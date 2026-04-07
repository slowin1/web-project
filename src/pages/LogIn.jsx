import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Backend API configuration
const API_BASE_URL = "http://localhost:5032";
const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
};

export default function LogIn() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid username or password");
      }

      const data = await response.json();

      // Save auth data (token, user info)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to profile
      navigate("/Profile");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Auto login after registration
      const loginResponse = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/Profile");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.forgotPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset email");
      }

      setSuccessMessage("Password reset link has been sent to your email");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset password view
  if (isForgotPassword) {
    return (
      <div className="sign-in-page">
        <div className="auth-container">
          <h1>Reset Password</h1>
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <form className="sign-in-form" onSubmit={handleForgotPassword}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              className="btn-back"
              onClick={() => {
                setIsForgotPassword(false);
                setError("");
                setSuccessMessage("");
              }}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="sign-in-page">
      <div className="auth-container">
        <h1>{isLogin ? "Log in to your account" : "Create an account"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form
          className="sign-in-form"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Войти" : "Register"}
          </button>

          {isLogin && (
            <div className="Forgot-Password">
              <button
                type="button"
                className="btn-link"
                onClick={() => setIsForgotPassword(true)}
              >
                Забыли пароль?
              </button>
            </div>
          )}
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
