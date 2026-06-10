import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import { fetchSpecialistsBundle, FALLBACK_IMAGE } from "../api/catalog";
import { bookingsAPI, specialistReviewsAPI } from "../api/admin";
import "../../css/unit.css";

const REVIEW_RATINGS = [5, 4, 3, 2, 1];
const BOOKING_STATUS = {
  pending: 0,
  confirmed: 1,
  cancelled: 2,
  completed: 3,
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

function normalizeStatus(value) {
  const status = value?.status ?? value?.Status ?? value;
  if (status === undefined || status === null || status === "") return "";
  const numberStatus = Number(status);

  if (numberStatus === BOOKING_STATUS.confirmed) return "confirmed";
  if (numberStatus === BOOKING_STATUS.cancelled) return "cancelled";
  if (numberStatus === BOOKING_STATUS.completed) return "completed";
  if (numberStatus === BOOKING_STATUS.pending) return "pending";

  return String(status).toLowerCase();
}

function bookingMatchesSpecialist(booking, specialist) {
  const description = booking.bookingDescription ?? booking.BookingDescription ?? "";
  const specialistId = normalizeId(specialist.id);
  const bookingSpecialistId = normalizeId(booking.specialistId ?? booking.SpecialistId);
  const specialistName = String(specialist.specialist || "").trim().toLowerCase();
  const bookingSpecialistName = String(
    booking.specialist ??
      booking.Specialist ??
      booking.nameOfMaster ??
      booking.NameOfMaster ??
      parseField(description, "Специалист") ??
      "",
  )
    .trim()
    .toLowerCase();

  return (
    (bookingSpecialistId && bookingSpecialistId === specialistId) ||
    (specialistName && bookingSpecialistName === specialistName)
  );
}

function bookingIsEligibleForReview(booking) {
  const status = normalizeStatus(booking);
  return status === "completed";
}

function normalizeReview(raw) {
  const source = raw.review || raw.data || raw;

  return {
    id: source.id ?? source.Id ?? `${source.specialistId}-${source.userId}-${source.createdAt}`,
    specialistId: normalizeId(source.specialistId ?? source.SpecialistId),
    specialistName:
      source.specialistName ??
      source.SpecialistName ??
      source.specialist ??
      source.Specialist ??
      "",
    userId: normalizeId(
      source.userId ??
        source.UserId ??
        source.clientUserId ??
        source.ClientUserId ??
        source.clientId ??
        source.ClientId,
    ),
    userName:
      source.userName ??
      source.UserName ??
      source.clientName ??
      source.ClientName ??
      "Клиент",
    rating: Number(source.rating ?? source.Rating ?? 5),
    comment:
      source.comment ??
      source.Comment ??
      source.reviewText ??
      source.ReviewText ??
      source.text ??
      source.Text ??
      "",
    createdAt: source.createdAt ?? source.CreatedAt ?? source.date ?? source.Date ?? "",
  };
}

function reviewMatchesSpecialist(review, specialist) {
  if (!review) return false;
  const specialistId = normalizeId(specialist.id);
  const reviewSpecialistId = normalizeId(review.specialistId);
  const specialistName = String(specialist.specialist || "").trim().toLowerCase();
  const reviewSpecialistName = String(review.specialistName || "").trim().toLowerCase();

  return (
    (reviewSpecialistId && reviewSpecialistId === specialistId) ||
    (reviewSpecialistName && reviewSpecialistName === specialistName)
  );
}

function getEligibleReviewBooking(bookings, specialist) {
  return bookings.find((booking) =>
    bookingMatchesSpecialist(booking, specialist) &&
    bookingIsEligibleForReview(booking)
  );
}

function formatReviewDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReviewInitials(name) {
  const parts = String(name || "Клиент")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (parts[0]?.[0] || "К") + (parts[1]?.[0] || "");
}

export default function SpecialistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedSlug = searchParams.get("specialist");
  const currentUser = useMemo(() => getStoredUser(), []);

  useEffect(() => {
    let isMounted = true;

    async function loadSpecialists() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await fetchSpecialistsBundle();
        if (!isMounted) return;
        setSpecialists(data);
      } catch (error) {
        console.error("Failed to load specialists:", error);
        if (!isMounted) return;
        setSpecialists([]);
        setLoadError("Не удалось загрузить специалистов");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSpecialists();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedSpecialist = useMemo(() => {
    if (!selectedSlug) return null;
    return specialists.find((item) => item.specialistSlug === selectedSlug) || null;
  }, [selectedSlug, specialists]);

  const specialistReviews = useMemo(() => (
    selectedSpecialist
      ? reviews.filter((review) => reviewMatchesSpecialist(review, selectedSpecialist))
      : []
  ), [reviews, selectedSpecialist]);
  const averageRating = useMemo(() => {
    if (specialistReviews.length === 0) return "5.0";
    const total = specialistReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / specialistReviews.length).toFixed(1);
  }, [specialistReviews]);

  const canLeaveReview = useMemo(() => {
    if (!currentUser || !selectedSpecialist) return false;

    return userBookings.some((booking) =>
      bookingMatchesSpecialist(booking, selectedSpecialist) &&
      bookingIsEligibleForReview(booking)
    );
  }, [currentUser, selectedSpecialist, userBookings]);

  const alreadyReviewed = useMemo(() => {
    const userId = normalizeId(
      currentUser?.id ?? currentUser?.Id ?? currentUser?.userId ?? currentUser?.UserId,
    );
    if (!userId) return false;
    return specialistReviews.some((review) => review.userId === userId);
  }, [currentUser, specialistReviews]);

  useEffect(() => {
    let isMounted = true;

    async function loadReviewsAndBookings() {
      if (!selectedSpecialist) return;
      setReviewsLoading(true);
      setReviewError("");

      try {
        const rawReviews = selectedSpecialist.id
          ? await specialistReviewsAPI.getBySpecialist(selectedSpecialist.id).catch(() => [])
          : await specialistReviewsAPI.getAll().catch(() => []);
        if (!isMounted) return;
        const list = Array.isArray(rawReviews) ? rawReviews : rawReviews?.data || [];
        setReviews(list.map(normalizeReview).filter((review) => review.comment));
      } catch (error) {
        console.error("Failed to load specialist reviews:", error);
        if (isMounted) {
          setReviews([]);
          setReviewError("Не удалось загрузить отзывы.");
        }
      }

      const userId = currentUser?.id ?? currentUser?.Id ?? currentUser?.userId ?? currentUser?.UserId;
      if (userId) {
        try {
          const rawBookings = await bookingsAPI.getByUser(userId);
          if (!isMounted) return;
          const list = Array.isArray(rawBookings) ? rawBookings : rawBookings?.data || [];
          setUserBookings(list);
        } catch (error) {
          console.warn("Failed to load user bookings for review access:", error);
          if (isMounted) setUserBookings([]);
        }
      } else if (isMounted) {
        setUserBookings([]);
      }

      if (isMounted) {
        setReviewsLoading(false);
      }
    }

    loadReviewsAndBookings();

    return () => {
      isMounted = false;
    };
  }, [currentUser, selectedSpecialist]);

  async function handleReviewSubmit(event) {
    event.preventDefault();
    if (!selectedSpecialist || !currentUser || !canLeaveReview || alreadyReviewed) return;

    const comment = reviewForm.comment.trim();
    if (comment.length < 6) {
      setReviewError("Напишите отзыв чуть подробнее.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    const userId = currentUser.id ?? currentUser.Id ?? currentUser.userId ?? currentUser.UserId;
    const booking = getEligibleReviewBooking(userBookings, selectedSpecialist);
    if (!booking) {
      setReviewError("Отзыв можно оставить только после выполненной услуги у этого специалиста.");
      setIsSubmittingReview(false);
      return;
    }

    const userName =
      `${currentUser.firstName || currentUser.FirstName || ""} ${currentUser.lastName || currentUser.LastName || ""}`.trim() ||
      currentUser.userName ||
      currentUser.UserName ||
      "Клиент";
    const bookingId = booking.id ?? booking.Id ?? booking.bookingId ?? booking.BookingId;

    const payload = {
      specialistId: selectedSpecialist.id,
      SpecialistId: selectedSpecialist.id,
      bookingId,
      BookingId: bookingId,
      clientId: userId,
      ClientId: userId,
      userId,
      UserId: userId,
      userName,
      UserName: userName,
      rating: Number(reviewForm.rating),
      Rating: Number(reviewForm.rating),
      comment,
      Comment: comment,
    };

    try {
      const created = await specialistReviewsAPI.create(payload);
      const nextReview = normalizeReview(created || payload);
      setReviews((current) => [nextReview, ...current]);
      setReviewForm({ rating: 5, comment: "" });
      setReviewSuccess("Спасибо, отзыв опубликован.");
    } catch (error) {
      console.error("Failed to create specialist review:", error);
      setReviewError("Не удалось отправить отзыв. Проверьте, что backend поддерживает SpecialistReviews.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  if (selectedSlug && !isLoading && !loadError && !selectedSpecialist) {
    return (
      <div className="specialists-page">
        <section className="specialist-detail-shell">
          <p className="bodyCopy">Специалист не найден.</p>
          <button className="secondary" type="button" onClick={() => navigate("/lab/specialists")}>
            Все специалисты
          </button>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="specialists-page">
      <section className={`service-hero ${selectedSpecialist ? "specialist-hero" : ""}`}>
        <div className="service-hero-col service-meta">
          <div className="service-meta-container">
            <div className="service-meta-header">
              <h3>{selectedSpecialist ? selectedSpecialist.specialist : "Все специалисты"}</h3>
            </div>
            <div className="service-meta-header-divider"></div>
            <div className="service-meta-buttons">
              <Link className="primary" to="/lab">
                Все услуги
              </Link>
              {selectedSpecialist && (
                <Link className="secondary" to="/lab/specialists">
                  Все специалисты
                </Link>
              )}
              <button className="secondary" onClick={() => navigate(-1)}>
                Назад
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedSpecialist ? (
        <section className="specialist-detail-shell">
          <div className="specialist-detail-layout">
            <aside className="specialist-profile-panel">
              <div className="specialist-detail-image">
                <img
                  src={selectedSpecialist.image}
                  alt={selectedSpecialist.specialist}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="specialist-profile-copy">
                <p className="type-mono">Специалист</p>
                <h2>{selectedSpecialist.specialist}</h2>
                <p className="bodyCopy">
                  {selectedSpecialist.specialistBio || "Описание специалиста пока не добавлено"}
                </p>
                <div className="specialist-stats">
                  <div>
                    <strong>{averageRating}</strong>
                    <span>рейтинг</span>
                  </div>
                  <div>
                    <strong>{specialistReviews.length}</strong>
                    <span>отзывов</span>
                  </div>
                  <div>
                    <strong>{selectedSpecialist.services.length}</strong>
                    <span>услуг</span>
                  </div>
                </div>
              </div>
            </aside>

            <main className="specialist-review-workspace">
              <section className="specialist-services-panel">
                <div>
                  <p className="type-mono">Услуги мастера</p>
                  <h3>{selectedSpecialist.services.length}</h3>
                </div>
                <div className="specialist-services-chips">
                  {selectedSpecialist.services.map((service) => (
                    <Link key={service.id} to={`/lab/${service.id}`}>
                      {service.name}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="specialist-reviews-section">
                <div className="specialist-reviews-head">
                  <div>
                    <p className="type-mono">Отзывы клиентов</p>
                    <h3>{averageRating}</h3>
                  </div>
                  <div className="specialist-review-summary">
                    <span>{"★".repeat(Math.round(Number(averageRating)))}</span>
                    <small>{specialistReviews.length} всего</small>
                  </div>
                  {reviewsLoading && <p className="bodyCopy">Загрузка отзывов...</p>}
                </div>

                {reviewError && <p className="specialist-review-message is-error">{reviewError}</p>}
                {reviewSuccess && <p className="specialist-review-message is-success">{reviewSuccess}</p>}

                <div className="specialist-reviews-grid">
                  <div className="specialist-reviews-list">
                    {specialistReviews.length === 0 ? (
                      <div className="specialist-empty-reviews">
                        <strong>Пока нет отзывов</strong>
                        <p>Когда клиент завершит услугу у этого специалиста, он сможет оставить здесь впечатление.</p>
                      </div>
                    ) : (
                      specialistReviews.map((review) => (
                        <article className="specialist-review-card" key={review.id}>
                          <div className="specialist-review-top">
                            <div className="specialist-review-author">
                              <span>{getReviewInitials(review.userName)}</span>
                              <strong>{review.userName}</strong>
                            </div>
                            <div className="specialist-review-rating">
                              {"★".repeat(Math.max(1, Math.min(5, review.rating)))}
                            </div>
                          </div>
                          <p>{review.comment}</p>
                          {review.createdAt && (
                            <time>{formatReviewDate(review.createdAt)}</time>
                          )}
                        </article>
                      ))
                    )}
                  </div>

                  <div className="specialist-review-form-card">
                    <p className="type-mono">Ваш отзыв</p>
                    <h4>Оставить отзыв</h4>
                    {!currentUser ? (
                      <p className="bodyCopy">Войдите как клиент, чтобы оставить отзыв.</p>
                    ) : !canLeaveReview ? (
                      <p className="bodyCopy">
                        Отзыв можно оставить после хотя бы одной завершённой услуги у этого специалиста.
                      </p>
                    ) : alreadyReviewed ? (
                      <p className="bodyCopy">Вы уже оставили отзыв этому специалисту.</p>
                    ) : (
                      <form className="specialist-review-form" onSubmit={handleReviewSubmit}>
                        <label>
                          Оценка
                          <select
                            value={reviewForm.rating}
                            onChange={(event) =>
                              setReviewForm((current) => ({
                                ...current,
                                rating: Number(event.target.value),
                              }))
                            }
                          >
                            {REVIEW_RATINGS.map((rating) => (
                              <option key={rating} value={rating}>
                                {rating}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Комментарий
                          <textarea
                            value={reviewForm.comment}
                            onChange={(event) =>
                              setReviewForm((current) => ({
                                ...current,
                                comment: event.target.value,
                              }))
                            }
                            placeholder="Расскажите, как прошёл массаж"
                            rows={5}
                          />
                        </label>
                        <button className="primary" type="submit" disabled={isSubmittingReview}>
                          {isSubmittingReview ? "Отправка..." : "Опубликовать"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            </main>
          </div>
        </section>
      ) : (
      <section className="specialists-list">
        <div className="container">
          {isLoading && <p className="bodyCopy">Загрузка специалистов...</p>}
          {!isLoading && loadError && <p className="bodyCopy">{loadError}</p>}
          {!isLoading && !loadError && specialists.length === 0 && (
            <p className="bodyCopy">Специалисты пока не добавлены</p>
          )}
          {specialists.map((specialist) => (
            <div
              key={specialist.specialistSlug}
              id={`specialist-${specialist.specialistSlug}`}
              className={`specialist-card ${selectedSlug === specialist.specialistSlug ? "active" : ""}`}
            >
              <div className="specialist-card-image">
                <img
                  src={specialist.image}
                  alt={specialist.specialist}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="specialist-card-content">
                <h4>{specialist.specialist}</h4>
                <p className="bodyCopy lg">{specialist.specialistBio || "Описание специалиста пока не добавлено"}</p>
                <p className="type-mono">Услуг: {specialist.services.length}</p>
                <div className="specialist-services-list">
                  {specialist.services.map((service) => (
                    <Link
                      key={service.id}
                      to={`/lab/${service.id}`}
                      className="bodyCopy specialist-service-link"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      <Footer />
    </div>
  );
}
