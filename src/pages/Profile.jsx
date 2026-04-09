import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { massageServices } from "../data/massageServices";

// Backend API configuration (same base URL as LogIn.jsx)
const API_BASE_URL = "http://localhost:5032";
const API_ENDPOINTS = {
  getProfile: `${API_BASE_URL}/api/auth/profile`,
  updateProfile: `${API_BASE_URL}/api/auth/profile`,
  changePassword: `${API_BASE_URL}/api/auth/change-password`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  deleteAccount: `${API_BASE_URL}/api/auth/account`,
  getBookings: `${API_BASE_URL}/api/bookings`,
  cancelBooking: `${API_BASE_URL}/api/bookings`,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile update form
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
    loadBookings();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.getProfile, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
          setLoading(false);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load profile");
      }

      const data = await response.json();
      setUser(data.user);
      setProfileData({
        username: data.user.username || "",
        email: data.user.email || "",
      });
    } catch (err) {
      console.error("Profile load error:", err);

      // Fallback: use localStorage data if backend unavailable
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setProfileData({
            username: userData.username || "",
            email: userData.email || "",
          });
          setError("Backend unavailable. Showing cached data from login.");
          return;
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }

      setError(err.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    setBookingsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setBookingsLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.getBookings, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Bookings load error:", err);

      // Fallback: load from localStorage
      const storedBookings = localStorage.getItem("userBookings");
      if (storedBookings) {
        try {
          setBookings(JSON.parse(storedBookings));
        } catch (e) {
          console.error("Failed to parse stored bookings:", e);
        }
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_ENDPOINTS.cancelBooking}/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      setSuccessMessage("Booking cancelled successfully");
    } catch (err) {
      console.error("Cancel booking error:", err);

      // Fallback: cancel in localStorage
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
      const updated = JSON.parse(localStorage.getItem("userBookings") || "[]");
      const cancelled = updated.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b,
      );
      localStorage.setItem("userBookings", JSON.stringify(cancelled));
      setSuccessMessage("Booking cancelled (offline mode)");
    }
  };

  // Handle profile data input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle password data input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      setSuccessMessage("Profile updated successfully");
      setIsEditing(false);

      // Update local storage
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!passwordData.currentPassword) {
      setError("Current password is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.changePassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      setSuccessMessage("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      setError(err.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch(API_ENDPOINTS.logout, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/LogIn");
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(API_ENDPOINTS.deleteAccount, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/LogIn");
    } catch (err) {
      console.error("Delete account error:", err);
      setError(err.message || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show guest view
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile</h1>
          <div className="profile-section">
            <p
              style={{
                fontFamily: "var(--type-3)",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                opacity: 0.7,
                textAlign: "center",
              }}
            >
              Please log in to view your profile
            </p>
            <button
              type="button"
              className="btn-edit"
              onClick={() => navigate("/LogIn")}
              style={{ marginTop: "1.5rem" }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* User Info Section */}
        <div className="profile-section">
          <h2>Account Information</h2>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      username: user.username || "",
                      email: user.email || "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Username:</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <button
                type="button"
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* My Bookings Section */}
        <div className="profile-section bookings-section">
          <h2>My Bookings</h2>

          {bookingsLoading ? (
            <p className="bookings-loading">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <span className="no-bookings-icon">📅</span>
              <p>No bookings yet</p>
              <button
                type="button"
                className="btn-book"
                onClick={() => navigate("/lab")}
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => {
                const service = massageServices.find(
                  (s) => s.id === booking.serviceId,
                );
                const isActive =
                  booking.status === "confirmed" ||
                  booking.status === "pending";

                return (
                  <div
                    key={booking.id}
                    className={`booking-card ${booking.status}`}
                  >
                    <div className="booking-card-glow" />
                    <div className="booking-header">
                      <div className="booking-service-info">
                        {service?.minimap && (
                          <img
                            src={service.minimap}
                            alt={service.name}
                            className="booking-thumb"
                          />
                        )}
                        <div>
                          <h3 className="booking-service-name">
                            {service?.name ||
                              booking.serviceName ||
                              "Unknown Service"}
                          </h3>
                          <p className="booking-specialist">
                            {service?.specialist || booking.specialist}
                          </p>
                        </div>
                      </div>
                      <span className={`booking-status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="booking-detail">
                        <span className="detail-label">📅 Date</span>
                        <span className="detail-value">
                          {new Date(booking.date).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">🕐 Time</span>
                        <span className="detail-value">{booking.time}</span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">⏱ Duration</span>
                        <span className="detail-value">
                          {service?.duration || booking.duration}
                        </span>
                      </div>
                      <div className="booking-detail">
                        <span className="detail-label">💰 Price</span>
                        <span className="detail-value price-value">
                          {service?.price || booking.price} руб
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <button
                        type="button"
                        className="btn-cancel-booking"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="profile-section">
          <h2>Security</h2>

          {isChangingPassword ? (
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="btn-edit"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {/* Account Actions */}
        <div className="profile-section profile-actions">
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>

          <button
            type="button"
            className="btn-delete"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
