import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingsAPI, servicesAPI, specialistsAPI } from "../api/admin";

const BOOKING_STATUS = {
  pending: 0,
  confirmed: 1,
  cancelled: 2,
  completed: 3,
  noShow: 4,
  rejected: 5,
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function normalizeId(value) {
  return value == null ? "" : String(value);
}

function parseField(description, label) {
  if (!description) return "";
  const match = description.match(new RegExp(`${label}:\\s*([^;]+)`, "i"));
  return match ? match[1].trim() : "";
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Не указано";
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value, description) {
  const explicitTime = parseField(description, "Время");
  if (explicitTime) return explicitTime;

  const match = String(value || "").match(/T?(\d{2}:\d{2})(?::\d{2})?/);
  return match ? match[1] : "Не указано";
}

function getLocalDayKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeBooking(raw, servicesById) {
  const description = raw.bookingDescription ?? raw.BookingDescription ?? "";
  const serviceId = normalizeId(raw.bookingId ?? raw.BookingId);
  const service = servicesById.get(serviceId);
  const statusValue = raw.status ?? raw.Status ?? BOOKING_STATUS.pending;
  const status = Number(statusValue);

  return {
    id: raw.id ?? raw.Id,
    serviceId,
    serviceName:
      service?.nameOfService ||
      service?.name ||
      service?.NameOfService ||
      parseField(description, "Услуга") ||
      raw.bookingName ||
      raw.BookingName ||
      "Услуга",
    clientName: parseField(description, "Клиент") || "Клиент",
    phone: parseField(description, "Телефон") || "-",
    email: parseField(description, "Email") || "-",
    specialist:
      parseField(description, "Специалист") ||
      service?.nameOfMaster ||
      service?.specialist ||
      service?.NameOfMaster ||
      "",
    date: raw.bookingDate ?? raw.BookingDate,
    bookingDate: raw.bookingDate ?? raw.BookingDate,
    bookingTime: raw.bookingTime ?? raw.BookingTime,
    bookingName: raw.bookingName ?? raw.BookingName ?? "",
    bookingDescription: description,
    specialistId: raw.specialistId ?? raw.SpecialistId ?? "",
    clientUserId: raw.clientUserId ?? raw.ClientUserId ?? null,
    time: formatTime(raw.bookingTime ?? raw.BookingTime, description),
    status,
    price: service?.priceOfService ?? service?.price ?? service?.PriceOfService ?? 0,
    duration: service?.durationOfService ?? service?.duration ?? service?.DurationOfService ?? "-",
  };
}

function bookingBelongsToSpecialist(raw, specialist, servicesById) {
  const specialistId = normalizeId(specialist?.id ?? specialist?.Id);
  const specialistName = specialist?.fullName ?? specialist?.FullName ?? "";
  const description = raw.bookingDescription ?? raw.BookingDescription ?? "";
  const bookingSpecialistId = normalizeId(raw.specialistId ?? raw.SpecialistId);
  const serviceId = normalizeId(raw.bookingId ?? raw.BookingId);
  const service = servicesById.get(serviceId);

  return (
    bookingSpecialistId === specialistId ||
    String(parseField(description, "Специалист")).trim().toLowerCase() === String(specialistName).trim().toLowerCase() ||
    String(raw.bookingName ?? raw.BookingName ?? "").trim().toLowerCase().includes(String(specialistName).trim().toLowerCase()) ||
    String(service?.nameOfMaster ?? service?.specialist ?? service?.NameOfMaster ?? "").trim().toLowerCase() === String(specialistName).trim().toLowerCase()
  );
}

function statusLabel(status) {
  switch (Number(status)) {
    case BOOKING_STATUS.confirmed:
      return "Подтверждена";
    case BOOKING_STATUS.cancelled:
      return "Отменена";
    case BOOKING_STATUS.completed:
      return "Проведена";
    case BOOKING_STATUS.noShow:
      return "Клиент не пришел";
    case BOOKING_STATUS.rejected:
      return "Не будет";
    default:
      return "Ожидает";
  }
}

function isSpecialistRole(user) {
  const role = user?.role ?? user?.Role;
  return role === 2 || role === "2" || String(role).toLowerCase() === "specialist";
}

export default function SpecialistProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSpecialistProfile();
  }, []);

  async function loadSpecialistProfile() {
    setLoading(true);
    setError("");

    const storedUser = getStoredUser();
    const token = localStorage.getItem("authToken") || localStorage.getItem("adminToken");

    if (!token || !isSpecialistRole(storedUser)) {
      navigate("/LogIn", { replace: true });
      return;
    }

    try {
      setUser(storedUser);
      const [specialists, services] = await Promise.all([
        specialistsAPI.getAll(),
        servicesAPI.getAll(),
      ]);
      const userId = normalizeId(storedUser.id ?? storedUser.Id ?? storedUser.userId ?? storedUser.UserId);
      const currentSpecialist = (Array.isArray(specialists) ? specialists : []).find((item) =>
        normalizeId(item.userId ?? item.UserId) === userId
      );

      if (!currentSpecialist) {
        setError("Профиль специалиста не найден. Проверьте связь пользователя со специалистом в админке.");
        setLoading(false);
        return;
      }

      const servicesById = new Map(
        services.map((service) => [normalizeId(service.id ?? service.Id), service]),
      );

      let specialistBookings = [];
      try {
        specialistBookings = await bookingsAPI.getBySpecialist(currentSpecialist.id ?? currentSpecialist.Id);
      } catch (specialistBookingsError) {
        console.warn("Specialist bookings endpoint unavailable:", specialistBookingsError);
      }

      if (!Array.isArray(specialistBookings) || specialistBookings.length === 0) {
        const allBookings = await bookingsAPI.getAll();
        specialistBookings = (Array.isArray(allBookings) ? allBookings : []).filter((booking) =>
          bookingBelongsToSpecialist(booking, currentSpecialist, servicesById)
        );
      }

      let completedServices = [];
      try {
        completedServices = await bookingsAPI.getCompleted();
      } catch (completedError) {
        console.warn("Completed services unavailable:", completedError);
      }

      setSpecialist(currentSpecialist);
      setBookings((Array.isArray(specialistBookings) ? specialistBookings : []).map((booking) =>
        normalizeBooking(booking, servicesById)
      ).sort((a, b) => new Date(b.bookingDate || b.date || 0) - new Date(a.bookingDate || a.date || 0)));
      setCompleted(Array.isArray(completedServices) ? completedServices : []);
    } catch (loadError) {
      console.error("Specialist profile load error:", loadError);
      setError("Не удалось загрузить кабинет специалиста");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingId, status, message) {
    setSavingId(bookingId);
    setError("");
    setSuccess("");

    try {
      const booking = bookings.find((item) => item.id === bookingId);
      try {
        await bookingsAPI.updateStatus(bookingId, status);
      } catch (patchError) {
        console.warn("PATCH booking status failed, trying PUT status:", patchError);
        try {
          await bookingsAPI.putStatus(bookingId, status);
        } catch (putStatusError) {
          console.warn("PUT booking status failed, trying full booking update:", putStatusError);
          if (!booking) throw putStatusError;

          await bookingsAPI.update(bookingId, {
            bookingId: booking.serviceId,
            bookingName: booking.bookingName || `${booking.clientName} - ${booking.serviceName}`,
            bookingDescription: booking.bookingDescription,
            clientUserId: booking.clientUserId,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            specialistId: booking.specialistId,
            status,
          });
        }
      }

      setBookings((current) =>
        current.map((booking) => booking.id === bookingId ? { ...booking, status } : booking),
      );
      setSuccess(message);
    } catch (updateError) {
      console.error("Booking status update error:", updateError);
      setError("Не удалось обновить запись. Проверьте, что backend перезапущен и миграции применены.");
    } finally {
      setSavingId("");
    }
  }

  async function completeBooking(bookingId) {
    setSavingId(bookingId);
    setError("");
    setSuccess("");

    try {
      const completedService = await bookingsAPI.complete(bookingId);
      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? { ...booking, status: BOOKING_STATUS.completed } : booking,
        ),
      );
      setCompleted((current) => [completedService, ...current.filter((item) => item.bookingId !== bookingId)]);
      setSuccess("Услуга отмечена как проведенная");
    } catch (completeError) {
      console.error("Booking complete error:", completeError);
      setError("Не удалось завершить услугу");
    } finally {
      setSavingId("");
    }
  }

  const todayKey = getLocalDayKey(new Date());
  const todaysBookings = useMemo(
    () => bookings.filter((booking) => getLocalDayKey(booking.date) === todayKey),
    [bookings, todayKey],
  );

  const confirmedToday = todaysBookings.filter((booking) => booking.status === BOOKING_STATUS.confirmed);
  const completedToday = todaysBookings.filter((booking) => booking.status === BOOKING_STATUS.completed);
  const currentSpecialistId = normalizeId(specialist?.id ?? specialist?.Id);
  const specialistCompleted = completed.filter((item) =>
    normalizeId(item.specialistId ?? item.SpecialistId) === currentSpecialistId
  );
  const todayRevenue = completed
    .filter((item) =>
      normalizeId(item.specialistId ?? item.SpecialistId) === currentSpecialistId &&
      getLocalDayKey(item.completedOn ?? item.CompletedOn) === todayKey
    )
    .reduce((sum, item) => sum + Number(item.price ?? item.Price ?? 0), 0);

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-shell profile-state">
          <p>Загружаем кабинет специалиста...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page specialist-profile-page">
      <div className="profile-shell">
        <section className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {(specialist?.fullName || specialist?.FullName || user?.userName || "S").slice(0, 2)}
          </div>
          <div className="profile-hero-copy">
            <p className="profile-kicker">Кабинет специалиста</p>
            <h1>{specialist?.fullName || specialist?.FullName || "Специалист"}</h1>
            <p>Сегодня: {formatDate(new Date())}</p>
          </div>
          <div className="profile-hero-actions">
            <button type="button" className="profile-secondary-button" onClick={loadSpecialistProfile}>
              Обновить
            </button>
            <button type="button" className="profile-ghost-button" onClick={() => navigate("/")}>
              На сайт
            </button>
          </div>
        </section>

        {(error || success) && (
          <div className={`profile-message ${error ? "is-error" : "is-success"}`}>
            {error || success}
          </div>
        )}

        <section className="profile-stats">
          <div>
            <span>{todaysBookings.length}</span>
            <p>Записи сегодня</p>
          </div>
          <div>
            <span>{confirmedToday.length}</span>
            <p>Подтверждены</p>
          </div>
          <div>
            <span>{todayRevenue} ₽</span>
            <p>Доход сегодня</p>
          </div>
        </section>

        <section className="profile-panel profile-bookings-panel">
          <div className="profile-panel-header">
            <div>
              <p className="profile-kicker">Сегодня</p>
              <h2>Клиенты и услуги</h2>
            </div>
          </div>

          {todaysBookings.length === 0 ? (
            <div className="profile-empty">
              <h3>На сегодня записей нет</h3>
              <p>Когда клиент забронирует вашу услугу, запись появится здесь.</p>
            </div>
          ) : (
            <div className="profile-bookings-list">
              {todaysBookings.map((booking) => {
                const canConfirm = booking.status === BOOKING_STATUS.pending;
                const canComplete = booking.status === BOOKING_STATUS.confirmed;
                const busy = savingId === booking.id;

                return (
                  <article key={booking.id} className={`profile-booking is-${booking.status}`}>
                    <div>
                      <p className="profile-booking-date">{booking.time} · {booking.duration} мин</p>
                      <h3>{booking.serviceName}</h3>
                      <p>{booking.clientName} · {booking.phone}</p>
                    </div>
                    <div className="profile-booking-meta">
                      <span>{booking.price} ₽</span>
                      <span>{statusLabel(booking.status)}</span>
                    </div>
                    <div className="profile-booking-actions">
                      {canConfirm && (
                        <>
                          <button
                            type="button"
                            className="profile-secondary-button"
                            disabled={busy}
                            onClick={() => updateStatus(booking.id, BOOKING_STATUS.confirmed, "Запись подтверждена")}
                          >
                            Будет
                          </button>
                          <button
                            type="button"
                            className="profile-danger-button"
                            disabled={busy}
                            onClick={() => updateStatus(booking.id, BOOKING_STATUS.rejected, "Запись отклонена")}
                          >
                            Не будет
                          </button>
                        </>
                      )}
                      {canComplete && (
                        <>
                          <button
                            type="button"
                            className="profile-primary-button"
                            disabled={busy}
                            onClick={() => completeBooking(booking.id)}
                          >
                            Услуга прошла
                          </button>
                          <button
                            type="button"
                            className="profile-danger-button"
                            disabled={busy}
                            onClick={() => updateStatus(booking.id, BOOKING_STATUS.noShow, "Отмечено: клиент не пришел")}
                          >
                            Не пришел
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="profile-panel">
          <div className="profile-panel-header">
            <div>
              <p className="profile-kicker">История</p>
              <h2>Проведенные услуги</h2>
            </div>
          </div>
          <div className="profile-details">
            <div>
              <span>Сегодня проведено</span>
              <strong>{completedToday.length}</strong>
            </div>
            <div>
              <span>Всего проведено</span>
              <strong>{specialistCompleted.length}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
