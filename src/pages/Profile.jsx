import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const API_ENDPOINTS = {
  profile: `${API_BASE_URL}/Users/profile`,
  legacyProfile: `${API_BASE_URL}/users/profile`,
  users: `${API_BASE_URL}/Users`,
  changePassword: `${API_BASE_URL}/users/change-password`,
  legacyChangePassword: `${API_BASE_URL}/Users/change-password`,
  logout: `${API_BASE_URL}/users/logout`,
  deleteAccount: `${API_BASE_URL}/users/account`,
  bookings: `${API_BASE_URL}/ServiceBookings`,
};

function getToken() {
  return localStorage.getItem("authToken") || localStorage.getItem("adminToken");
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

async function requestJson(url, options = {}) {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  const body = text && contentType.includes("application/json")
    ? JSON.parse(text)
    : text;

  if (!response.ok) {
    const message =
      body?.message ||
      body?.title ||
      (typeof body === "string" && body) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body || null;
}

function normalizeUser(raw) {
  if (!raw) return null;
  const source = raw.user || raw.data || raw;

  return {
    ...source,
    id: source.id ?? source.userId ?? source.UserId ?? source.Id,
    firstName: source.firstName ?? source.FirstName ?? "",
    lastName: source.lastName ?? source.LastName ?? "",
    userName:
      source.userName ??
      source.UserName ??
      source.username ??
      source.Username ??
      "",
    email: source.email ?? source.Email ?? "",
    phone: source.phone ?? source.Phone ?? source.phoneNumber ?? source.PhoneNumber ?? "",
    role: source.role ?? source.Role,
    createdAt:
      source.createdAt ??
      source.CreatedAt ??
      source.joinedAt ??
      source.JoinedAt ??
      "",
  };
}

function formatDate(value) {
  if (!value) return "Не указано";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Не указано";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBookingTime(value) {
  if (!value) return "Не указано";
  const textValue = String(value);
  const timeMatch = textValue.match(/T?(\d{2}:\d{2})(?::\d{2})?/);

  if (timeMatch) {
    return timeMatch[1];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return textValue.slice(0, 5);
  }

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseField(description, label) {
  if (!description) return "";
  const match = description.match(new RegExp(`${label}:\\s*([^;]+)`, "i"));
  return match ? match[1].trim() : "";
}

function normalizeBooking(raw) {
  const source = raw.booking || raw.data || raw;
  const rawStatus = source.status ?? source.Status ?? 0;
  const statusMap = {
    0: "pending",
    1: "confirmed",
    2: "cancelled",
    3: "completed",
    4: "no-show",
    5: "rejected",
  };
  const status = statusMap[Number(rawStatus)] || String(rawStatus).toLowerCase();
  const description = source.bookingDescription ?? source.BookingDescription ?? "";

  return {
    id: source.id ?? source.Id,
    serviceId: source.bookingId ?? source.BookingId ?? source.serviceId ?? source.ServiceId,
    serviceName:
      source.serviceName ||
      source.ServiceName ||
      parseField(description, "Услуга") ||
      source.bookingName ||
      source.BookingName ||
      "Запись",
    specialist:
      source.specialist ||
      source.Specialist ||
      parseField(description, "Специалист") ||
      "",
    clientName: parseField(description, "Клиент"),
    phone: parseField(description, "Телефон"),
    clientUserId: source.clientUserId ?? source.ClientUserId ?? "",
    date: source.bookingDate ?? source.BookingDate ?? source.date ?? source.Date,
    time:
      parseField(description, "Время") ||
      formatBookingTime(source.bookingTime ?? source.BookingTime ?? source.time ?? source.Time),
    duration: source.duration ?? source.Duration ?? "-",
    price: source.price ?? source.Price ?? "",
    status,
  };
}

function getInitials(user) {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  const fallback = user?.userName?.trim()?.[0] || "U";
  return `${first}${last}` || fallback;
}

function isActiveBooking(booking) {
  return ["confirmed", "pending", "active"].includes(booking.status);
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const displayName = useMemo(() => {
    const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    return fullName || user?.userName || "Пользователь";
  }, [user]);

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "cancelled").length,
    [bookings],
  );

  useEffect(() => {
    let mounted = true;

    async function loadPageData() {
      setLoading(true);
      setBookingsLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        setBookingsLoading(false);
        return;
      }

      const storedUser = normalizeUser(getStoredUser());
      let nextUser = storedUser;

      try {
        nextUser = await loadUserProfile(storedUser);
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("user");
          if (mounted) setUser(null);
          return;
        }

        if (!storedUser) {
          if (mounted) setError(err.message || "Не удалось загрузить профиль");
        } else if (mounted) {
          setError("Не удалось обновить профиль с сервера. Показаны сохраненные данные.");
        }
      } finally {
        if (mounted) setLoading(false);
      }

      if (nextUser && mounted) {
        applyUser(nextUser);
      }

      try {
        const nextBookings = await loadUserBookings(nextUser);
        if (mounted) setBookings(nextBookings);
      } catch (err) {
        const currentUserId = String(nextUser?.id || "");
        const cachedBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
        const ownCachedBookings = cachedBookings.filter((booking) =>
          booking.clientUserId && String(booking.clientUserId) === currentUserId
        );
        if (mounted) setBookings(ownCachedBookings.map(normalizeBooking));
      } finally {
        if (mounted) setBookingsLoading(false);
      }
    }

    loadPageData();

    return () => {
      mounted = false;
    };
  }, []);

  async function loadUserProfile(storedUser) {
    const candidates = [
      API_ENDPOINTS.profile,
      API_ENDPOINTS.legacyProfile,
      storedUser?.id ? `${API_ENDPOINTS.users}/${storedUser.id}` : null,
    ].filter(Boolean);

    let lastError = null;
    for (const url of candidates) {
      try {
        const data = await requestJson(url);
        return normalizeUser(data);
      } catch (err) {
        lastError = err;
        if (err.status === 401) throw err;
      }
    }

    throw lastError || new Error("Не удалось загрузить профиль");
  }

  async function loadUserBookings(currentUser) {
    const userId = currentUser?.id;
    if (!userId) {
      return [];
    }

    const data = await requestJson(`${API_ENDPOINTS.bookings}/user/${userId}`);
    const list = Array.isArray(data) ? data : data?.bookings || data?.data || [];
    return list.map(normalizeBooking);
  }

  function applyUser(nextUser) {
    setUser(nextUser);
    setProfileData({
      firstName: nextUser.firstName || "",
      lastName: nextUser.lastName || "",
      userName: nextUser.userName || "",
      email: nextUser.email || "",
      phone: nextUser.phone || "",
    });
    localStorage.setItem("user", JSON.stringify(nextUser));
  }

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccessMessage("");
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    const payload = {
      ...user,
      firstName: profileData.firstName.trim(),
      lastName: profileData.lastName.trim(),
      userName: profileData.userName.trim(),
      username: profileData.userName.trim(),
      email: profileData.email.trim(),
      phone: profileData.phone.trim(),
    };

    const candidates = [
      API_ENDPOINTS.profile,
      API_ENDPOINTS.legacyProfile,
      user?.id ? `${API_ENDPOINTS.users}/${user.id}` : null,
    ].filter(Boolean);

    let lastError = null;
    for (const url of candidates) {
      try {
        const data = await requestJson(url, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        applyUser(normalizeUser(data) || normalizeUser(payload));
        setSuccessMessage("Профиль обновлен");
        setIsEditing(false);
        setSaving(false);
        return;
      } catch (err) {
        lastError = err;
        if (err.status === 401) break;
      }
    }

    setError(lastError?.message || "Не удалось сохранить профиль");
    setSaving(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Новые пароли не совпадают");
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Новый пароль должен быть минимум 6 символов");
      setSaving(false);
      return;
    }

    const candidates = [
      API_ENDPOINTS.changePassword,
      API_ENDPOINTS.legacyChangePassword,
    ];

    let lastError = null;
    for (const url of candidates) {
      try {
        await requestJson(url, {
          method: "POST",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });
        setSuccessMessage("Пароль изменен");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSaving(false);
        return;
      } catch (err) {
        lastError = err;
      }
    }

    setError(lastError?.message || "Не удалось изменить пароль");
    setSaving(false);
  }

  async function handleCancelBooking(bookingId) {
    if (!window.confirm("Отменить эту запись?")) return;

    try {
      await requestJson(`${API_ENDPOINTS.bookings}/${bookingId}`, {
        method: "DELETE",
      });
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
        ),
      );
      setSuccessMessage("Запись отменена");
    } catch (err) {
      setError(err.message || "Не удалось отменить запись");
    }
  }

  async function handleLogout() {
    try {
      await requestJson(API_ENDPOINTS.logout, { method: "POST" });
    } catch {
      // Logout should still clear the local session.
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      navigate("/LogIn", { replace: true });
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Удалить аккаунт? Это действие нельзя отменить.")) return;

    setSaving(true);
    setError("");

    try {
      await requestJson(API_ENDPOINTS.deleteAccount, { method: "DELETE" });
      localStorage.removeItem("authToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user");
      navigate("/LogIn", { replace: true });
    } catch (err) {
      setError(err.message || "Не удалось удалить аккаунт");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-shell profile-state">
          <p>Загружаем профиль...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-shell profile-guest">
          <div>
            <p className="profile-kicker">Аккаунт</p>
            <h1>Войдите, чтобы открыть профиль</h1>
            <p>
              Здесь будут ваши данные, записи на услуги и настройки безопасности.
            </p>
          </div>
          <button type="button" className="profile-primary-button" onClick={() => navigate("/LogIn")}>
            Войти
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(user)}
          </div>

          <div className="profile-hero-copy">
            <p className="profile-kicker">Личный кабинет</p>
            <h1>{displayName}</h1>
            <p>@{user.userName || "user"}</p>
          </div>

          <div className="profile-hero-actions">
            <button
              type="button"
              className="profile-secondary-button"
              onClick={() => navigate("/lab")}
            >
              Записаться
            </button>
            <button type="button" className="profile-ghost-button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </section>

        {(error || successMessage) && (
          <div className={`profile-message ${error ? "is-error" : "is-success"}`}>
            {error || successMessage}
          </div>
        )}

        <section className="profile-stats" aria-label="Сводка профиля">
          <div>
            <span>{upcomingBookings}</span>
            <p>Активные записи</p>
          </div>
          <div>
            <span>{user.phone ? "Да" : "Нет"}</span>
            <p>Телефон</p>
          </div>
          <div>
            <span>{formatDate(user.createdAt)}</span>
            <p>Дата регистрации</p>
          </div>
        </section>

        <div className="profile-grid">
          <section className="profile-panel profile-account-panel">
            <div className="profile-panel-header">
              <div>
                <p className="profile-kicker">Данные из БД</p>
                <h2>Профиль</h2>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  className="profile-ghost-button"
                  onClick={() => setIsEditing(true)}
                >
                  Изменить
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="profile-form-grid">
                  <label>
                    Имя
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label>
                    Фамилия
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label>
                    Логин
                    <input
                      type="text"
                      name="userName"
                      value={profileData.userName}
                      onChange={handleProfileChange}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </label>
                  <label className="profile-form-wide">
                    Телефон
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </label>
                </div>
                <div className="profile-form-actions">
                  <button type="submit" className="profile-primary-button" disabled={saving}>
                    {saving ? "Сохраняем..." : "Сохранить"}
                  </button>
                  <button
                    type="button"
                    className="profile-ghost-button"
                    onClick={() => {
                      setIsEditing(false);
                      applyUser(user);
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div>
                  <span>Имя</span>
                  <strong>{displayName}</strong>
                </div>
                <div>
                  <span>Логин</span>
                  <strong>@{user.userName || "Не указан"}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{user.email || "Не указан"}</strong>
                </div>
                <div>
                  <span>Телефон</span>
                  <strong>{user.phone || "Не указан"}</strong>
                </div>
              </div>
            )}
          </section>

          <section className="profile-panel profile-security-panel">
            <div className="profile-panel-header">
              <div>
                <p className="profile-kicker">Безопасность</p>
                <h2>Пароль</h2>
              </div>
            </div>

            {isChangingPassword ? (
              <form className="profile-form" onSubmit={handleChangePassword}>
                <label>
                  Текущий пароль
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <label>
                  Новый пароль
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <label>
                  Повторите пароль
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <div className="profile-form-actions">
                  <button type="submit" className="profile-primary-button" disabled={saving}>
                    {saving ? "Меняем..." : "Обновить пароль"}
                  </button>
                  <button
                    type="button"
                    className="profile-ghost-button"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="profile-panel-text">
                  Регулярно обновляйте пароль, особенно если входили с чужого устройства.
                </p>
                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Сменить пароль
                </button>
              </>
            )}
          </section>
        </div>

        <section className="profile-panel profile-bookings-panel">
          <div className="profile-panel-header">
            <div>
              <p className="profile-kicker">Записи</p>
              <h2>Мои бронирования</h2>
            </div>
            <button
              type="button"
              className="profile-secondary-button"
              onClick={() => navigate("/lab")}
            >
              Новая запись
            </button>
          </div>

          {bookingsLoading ? (
            <p className="profile-empty">Загружаем записи...</p>
          ) : bookings.length === 0 ? (
            <div className="profile-empty">
              <h3>Записей пока нет</h3>
              <p>Выберите услугу и удобное время, запись появится здесь.</p>
            </div>
          ) : (
            <div className="profile-bookings-list">
              {bookings.map((booking) => (
                <article key={booking.id} className={`profile-booking is-${booking.status}`}>
                  <div>
                    <p className="profile-booking-date">{formatDate(booking.date)}</p>
                    <h3>{booking.serviceName}</h3>
                    <p>{booking.specialist || "Специалист не указан"}</p>
                  </div>
                  <div className="profile-booking-meta">
                    <span>{booking.time}</span>
                    <span>{booking.duration}</span>
                    {booking.price && <span>{booking.price} ₽</span>}
                  </div>
                  <div className="profile-booking-actions">
                    <span className="profile-status">{booking.status}</span>
                    {isActiveBooking(booking) && (
                      <button
                        type="button"
                        className="profile-danger-button"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="profile-danger-zone">
          <div>
            <h2>Удаление аккаунта</h2>
            <p>Это удалит профиль и завершит текущую сессию.</p>
          </div>
          <button
            type="button"
            className="profile-danger-button"
            onClick={handleDeleteAccount}
            disabled={saving}
          >
            Удалить аккаунт
          </button>
        </section>
      </div>
    </main>
  );
}
