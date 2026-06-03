import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function LogIn() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Логирование для отладки
      console.log("📤 Отправляю данные:", formData);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Если нужны cookies
      });

      console.log("📨 Статус ответа:", response.status, response.statusText);

      // Читаем ответ один раз и парсим JSON только если это действительно JSON.
      const responseText = await response.text();
      console.log("📝 Ответ бэка (текст):", responseText);

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      let data = null;
      if (responseText && isJson) {
        try {
          data = JSON.parse(responseText);
        } catch (parseErr) {
          console.error("❌ Ошибка парсинга JSON:", parseErr);
        }
      }

      console.log("✅ Распарсенные данные:", data);

      if (response.ok) {
        // Сохраняем токен
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        localStorage.setItem("user", JSON.stringify(data));

        // Decide where to go after login.
        // Prefer role-based logic (admin should be role=4 / "4").
        const roleClaim = data?.role ?? data?.Role;
        const isAdminByRole =
          roleClaim === 4 || roleClaim === "4" ||
          (typeof roleClaim === "string" && roleClaim.toLowerCase() === "admin");
        const isSpecialistByRole =
          roleClaim === 2 || roleClaim === "2" ||
          (typeof roleClaim === "string" && roleClaim.toLowerCase() === "specialist");

        // Fallback: older logic by username.
        const isAdminByUsername = data?.userName?.toLowerCase() === "admin";

        if (isAdminByRole || isAdminByUsername) {
          if (data.token) {
            localStorage.setItem("adminToken", data.token);
          }
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...data,
            })
          );

          navigate("/admin", { replace: true });
          return;
        }

        localStorage.removeItem("adminToken");
        if (isSpecialistByRole) {
          navigate("/specialist-profile", { replace: true });
          return;
        }

        navigate("/profile");

      } else {
        if (response.status === 401) {
          setError(data?.message || "Неверный логин или пароль");
        } else if (response.status === 403) {
          setError(data?.message || "Доступ запрещен (403)");
        } else {
          setError(data?.message || `Ошибка: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("🔥 Ошибка сети/подключения:", err.message);
      console.error("Полная ошибка:", err);
      setError(`Ошибка подключения: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sign-in-page">
        <h1>Log in to your account</h1>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Логин"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </button>

          <div className="Forgot-Password">
            <a href="/forgot-password">
              <button type="button">Забыли пароль?</button>
            </a>
            <br />
            <a href="/Register">
              <button type="button">Нет аккаунта? Зарегистрироваться</button>
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
