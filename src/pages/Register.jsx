import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Логирование для отладки
            console.log("📤 Отправляю данные при регистрации:", formData);

            const response = await fetch("http://localhost:5000/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include", // Если нужны cookies
            });

            console.log("📨 Статус ответа:", response.status, response.statusText);

            // Читаем текст один раз
            const responseText = await response.text();
            console.log("📝 Ответ бэка (текст):", responseText);

            // Пытаемся распарсить JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseErr) {
                console.error("❌ Ошибка парсинга JSON:", parseErr);
                setError("Ошибка: сервер вернул неправильный формат");
                return;
            }

            console.log("✅ Распарсенные данные:", data);

            if (response.ok) {
                alert("Registration successful!");
                navigate("/LogIn");
            } else {
                setError(data.message || `Ошибка: ${response.statusText}`);
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
        <div className="sign-in-page">
            <h1>Create an account</h1>
            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
            <form className="sign-in-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Имя"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Фамилия"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="userName"
                    placeholder="Логин"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
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
                <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Загрузка..." : "Зарегистрироваться"}
                </button>
                <div className="Forgot-Password">
                    <a href="/LogIn">
                        <button type="button">Уже есть аккаунт? Войти</button>
                    </a>
                </div>
            </form>
        </div>
    );
}
