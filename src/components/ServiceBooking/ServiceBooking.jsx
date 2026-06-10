import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../css/service-booking.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildBookingDescription({ service, bookingData, selectedTime }) {
  const description = [
    `Клиент: ${bookingData.name}`,
    `Телефон: ${bookingData.phone}`,
    `Email: ${bookingData.email || "-"}`,
    `Услуга: ${service.name}`,
    `Специалист: ${service.specialist || "-"}`,
    `Время: ${selectedTime}`,
  ].join("; ");

  return description.slice(0, 200);
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function ServiceBooking({ service, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [bookingStep, setBookingStep] = useState("calendar"); // calendar, time, form, success
  const [isLoading, setIsLoading] = useState(false);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Available time slots (every 30 minutes, from 10 AM to 8 PM)
  const availableTimeSlots = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ];

  useEffect(() => {
    if (!selectedDate || bookingStep !== "time") {
      setIsSlotsLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    const loadAvailableSlots = async () => {
      setIsSlotsLoading(true);
      setErrorMessage("");

      try {
        const date = formatDateForApi(selectedDate);
        const response = await fetch(
          `${API_BASE_URL}/ServiceBookings/available-slots?serviceId=${encodeURIComponent(
            service.id
          )}&date=${encodeURIComponent(date)}`
          ,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Не удалось загрузить свободное время");
        }

        const slots = await response.json();
        if (!cancelled) {
          setAvailableSlots(Array.isArray(slots) ? slots : []);
        }
      } catch (error) {
        console.error("Available slots error:", error);
        if (!cancelled) {
          setAvailableSlots(availableTimeSlots);
          setErrorMessage("Не удалось обновить занятость времени. Сервер проверит слот при бронировании.");
        }
      } finally {
        if (!cancelled) {
          setIsSlotsLoading(false);
        }
      }
    };

    loadAvailableSlots();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [selectedDate, bookingStep, service.id]);

  // Disable only past dates. Availability is controlled by bookings/time slots, not weekday.
  const isTileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleCancel = () => {
    setBookingStep("calendar");
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingData({ name: "", phone: "", email: "" });
    setErrorMessage("");
    setSuccessMessage("");
    handleClose();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setAvailableSlots([]);
    setBookingStep("time");
  };

  const handleTimeSelect = (time) => {
    if (!availableSlots.includes(time)) {
      setErrorMessage("Это время уже занято. Выберите другой слот.");
      return;
    }

    setSelectedTime(time);
    setErrorMessage("");
    setBookingStep("form");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const bookingDate = formatDateForApi(selectedDate);
      const bookingTime = `${bookingDate}T${selectedTime}:00`;
      const bookingName = `${bookingData.name} - ${service.name}`.slice(0, 100);
      const storedUser = getStoredUser();
      const clientUserId = storedUser?.id ?? storedUser?.Id ?? storedUser?.userId ?? storedUser?.UserId ?? null;

      // Backend writes this DTO to the Bookings table.
      const bookingRequest = {
        bookingId: String(service.id),
        bookingName,
        bookingDescription: buildBookingDescription({
          service,
          bookingData,
          selectedTime,
        }),
        clientUserId,
        specialistId: service.specialistId || null,
        bookingDate: `${bookingDate}T00:00:00`,
        bookingTime,
      };

      // Get auth token if available
      const token = localStorage.getItem("authToken") || localStorage.getItem("adminToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/ServiceBookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          setBookingStep("time");
          setSelectedTime(null);
          setAvailableSlots((slots) => slots.filter((slot) => slot !== selectedTime));
        }
        throw new Error(errorData.message || `Ошибка при бронировании (${response.status})`);
      }

      const result = await response.json();
      const savedBooking = {
        id: result.id,
        serviceId: service.id,
        serviceName: service.name,
        specialist: service.specialist,
        specialistId: service.specialistId || null,
        date: bookingDate,
        time: selectedTime,
        duration: service.duration,
        price: service.price,
        status: "confirmed",
        clientUserId,
      };
      const storedBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
      localStorage.setItem("userBookings", JSON.stringify([...storedBookings, savedBooking]));

      setBookingStep("success");
      setSuccessMessage(result.message || "Бронирование подтверждено!");
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage(error.message || "Произошла ошибка при бронировании");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
  };

  return (
    <div className="service-booking-container">
      <div className="booking-header">
        <h2>{service.name}</h2>
        <div className="booking-details">
          <span className="specialist">{service.specialist}</span>
          <span className="duration">{service.duration}</span>
          <span className="price">{service.price} ₽</span>
        </div>
      </div>

      {bookingStep === "calendar" && (
        <div className="booking-step calendar-step">
          <h3>Выберите дату</h3>
          <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            tileDisabled={isTileDisabled}
            minDate={new Date()}
            locale="ru-RU"
          />
          <p className="booking-hint">Выберите удобную дату на календаре</p>
        </div>
      )}

      {bookingStep === "time" && (
        <div className="booking-step time-step">
          <div className="step-header">
            <button className="back-btn" onClick={() => setBookingStep("calendar")}>
              ← Назад
            </button>
            <h3>Выберите время</h3>
          </div>
          <p className="selected-date">{formatDate(selectedDate)}</p>
          {isSlotsLoading && <p className="booking-hint">Проверяю свободное время...</p>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="time-slots">
            {availableTimeSlots.map((time) => {
              const isAvailable = availableSlots.includes(time);

              return (
                <button
                  key={time}
                  className={`time-slot ${selectedTime === time ? "active" : ""} ${
                    isAvailable ? "" : "disabled"
                  }`}
                  disabled={isSlotsLoading || !isAvailable}
                  onClick={() => handleTimeSelect(time)}
                  title={isAvailable ? "Свободно" : "Занято"}
                >
                  {time}
                </button>
              );
            })}
          </div>
          {!isSlotsLoading && availableSlots.length === 0 && (
            <p className="booking-hint">На выбранную дату свободного времени нет</p>
          )}
          <p className="booking-hint">Выберите удобное время для бронирования</p>
        </div>
      )}

      {bookingStep === "form" && (
        <div className="booking-step form-step">
          <div className="step-header">
            <button className="back-btn" onClick={() => setBookingStep("time")}>
              ← Назад
            </button>
            <h3>Ваши данные</h3>
          </div>
          <div className="booking-summary">
            <p>
              <strong>Дата:</strong> {formatDate(selectedDate)}
            </p>
            <p>
              <strong>Время:</strong> {selectedTime}
            </p>
          </div>
          <form onSubmit={handleSubmitBooking} className="booking-form">
            <div className="form-group">
              <label htmlFor="name">Имя *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={bookingData.name}
                onChange={handleInputChange}
                required
                placeholder="Введите ваше имя"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                required
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={bookingData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Бронирую..." : "Подтвердить бронирование"}
            </button>
          </form>
        </div>
      )}

      {bookingStep === "success" && (
        <div className="booking-step success-step">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Бронирование подтверждено!</h3>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="booking-confirmation">
              <p>
                <strong>{service.name}</strong>
              </p>
              <p>
                {formatDate(selectedDate)} в {selectedTime}
              </p>
              <p>Специалист: {service.specialist}</p>
              <p>Сумма: {service.price} ₽</p>
            </div>
            <p className="confirmation-message">
              На ваш телефон {bookingData.phone} придет подтверждение бронирования
            </p>
            <button
              className="close-btn"
              onClick={() => {
                setBookingStep("calendar");
                setSelectedDate(null);
                setSelectedTime(null);
                setBookingData({ name: "", phone: "", email: "" });
                setSuccessMessage("");
                if (onClose) {
                  setTimeout(() => onClose(), 300);
                }
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
