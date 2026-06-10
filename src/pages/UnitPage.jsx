import { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import Product from "../components/Product/Product";
import ServiceBooking from "../components/ServiceBooking/ServiceBooking";
import { fetchCatalogBundle } from "../api/catalog";
import "../../css/unit.css";
import gsap from "gsap";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const FALLBACK_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop";

export default function UnitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollGalleryRef = useRef(null);
  const heroRef = useRef(null);
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedServices, setRelatedServices] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await fetchCatalogBundle();
        if (!isMounted) return;
        setServices(data.services);
      } catch (error) {
        console.error("Failed to load service:", error);
        if (!isMounted) return;
        setServices([]);
        setLoadError("Не удалось загрузить услугу");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (services.length === 0) {
      setCurrentService(null);
      setRelatedServices([]);
      return;
    }

    const selectedService = services.find((service) => String(service.id) === String(id));
    const activeService = selectedService || services[0];
    setCurrentService(activeService);

    window.scrollTo(0, 0);

    const shuffled = [...services]
      .filter((s) => s.id !== activeService.id)
      .sort(() => 0.5 - Math.random());
    setRelatedServices(shuffled.slice(0, 4));

  }, [id, services]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("scrollToTop", handleScrollToTop);

    return () => {
      window.removeEventListener("scrollToTop", handleScrollToTop);
    };
  }, []);

  const serviceImages = useMemo(() => {
    if (!currentService) {
      return [];
    }

    const images = Array.isArray(currentService.images)
      ? currentService.images.filter(Boolean)
      : [];

    return images.length > 0
      ? images
      : [currentService.image || FALLBACK_SERVICE_IMAGE];
  }, [currentService]);

  const detailImage = serviceImages[1] || serviceImages[0] || FALLBACK_SERVICE_IMAGE;

  useLayoutEffect(() => {
    if (!currentService) {
      return;
    }

    if (window.lenis?.destroy) {
      window.lenis.destroy();
      window.lenis = null;
    }

    const scrollElement = scrollGalleryRef.current;
    const heroElement = heroRef.current;
    if (!scrollElement || !heroElement) {
      return;
    }

    const slides = gsap.utils.toArray(
      heroElement.querySelectorAll(".service-gallery-slide"),
    );

    if (slides.length === 0) {
      return;
    }

    gsap.set(slides, {
      autoAlpha: 0,
      clipPath: "inset(0% 0% 0% 100%)",
      scale: 1.08,
      xPercent: 5,
      yPercent: 0,
      transformOrigin: "center center",
    });
    gsap.set(slides[0], {
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      xPercent: 0,
    });
    setActiveImageIndex(0);

    let frameId = 0;

    const updateActiveImage = () => {
      frameId = 0;
      const rect = scrollElement.getBoundingClientRect();
      const scrollDistance = Math.max(scrollElement.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
      const galleryProgress = progress * Math.max(slides.length - 1, 1);
      const currentSlide = Math.min(slides.length - 1, Math.floor(galleryProgress));
      const nextSlide = Math.min(slides.length - 1, currentSlide + 1);
      const slideProgress = galleryProgress - currentSlide;
      const activeSlide = Math.min(slides.length - 1, Math.round(galleryProgress));

      slides.forEach((slide, slideIndex) => {
        if (slideIndex === currentSlide) {
          gsap.to(slide, {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1 + slideProgress * 0.04,
            xPercent: -slideProgress * 4,
            duration: 0.22,
            ease: "power2.out",
            overwrite: true,
          });
          return;
        }

        if (slideIndex === nextSlide && nextSlide !== currentSlide) {
          gsap.to(slide, {
            autoAlpha: 1,
            clipPath: `inset(0% 0% 0% ${(1 - slideProgress) * 100}%)`,
            scale: 1.08 - slideProgress * 0.08,
            xPercent: 5 - slideProgress * 5,
            duration: 0.22,
            ease: "power2.out",
            overwrite: true,
          });
          return;
        }

        gsap.to(slide, {
          autoAlpha: 0,
          clipPath: "inset(0% 0% 0% 100%)",
          scale: 1.08,
          xPercent: 5,
          duration: 0.18,
          ease: "power2.out",
          overwrite: true,
        });
      });

      setActiveImageIndex((currentIndex) =>
        currentIndex === activeSlide ? currentIndex : activeSlide,
      );
    };

    const scheduleActiveImageUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveImage);
    };

    window.scrollTo(0, 0);
    updateActiveImage();
    window.addEventListener("scroll", scheduleActiveImageUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveImageUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleActiveImageUpdate);
      window.removeEventListener("resize", scheduleActiveImageUpdate);
      gsap.killTweensOf(slides);
    };
  }, [currentService?.id, serviceImages.length]);

  const handleBookNow = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/LogIn");
      return;
    }

    // Открываем модальное окно с календарем
    setShowBookingModal(true);
  };

  const handleSaveService = () => {
    alert(`Услуга "${currentService.name}" сохранена в избранное`);
  };

  const handleGalleryThumbClick = (index) => {
    const scrollElement = scrollGalleryRef.current;
    if (!scrollElement || serviceImages.length <= 1) return;

    const progress = index / (serviceImages.length - 1);
    const scrollDistance = Math.max(scrollElement.offsetHeight - window.innerHeight, 1);
    const targetY = window.scrollY + scrollElement.getBoundingClientRect().top + scrollDistance * progress;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="unit-page">
        <section className="service-details">
          <div className="service-col service-col-copy">
            <p className="bodyCopy lg">Загрузка услуги...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="unit-page">
        <section className="service-details">
          <div className="service-col service-col-copy">
            <p className="bodyCopy lg">{loadError || "Услуга не найдена"}</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="unit-page">
      {bookingSuccess && (
        <div className="booking-notification success">
          <span>✓</span>
          <div>
            <strong>Booking confirmed!</strong>
            <p>Check your profile for details</p>
          </div>
        </div>
      )}
      {bookingError && (
        <div className="booking-notification error">
          <span>✕</span>
          <div>
            <strong>Booking failed</strong>
            <p>{bookingError}</p>
          </div>
        </div>
      )}
      <div
        className="service-gallery-scroll"
        ref={scrollGalleryRef}
        style={{
          "--service-gallery-steps": Math.max(serviceImages.length, 2),
        }}
      >
      <section className="service-hero" ref={heroRef}>
        <div className="service-hero-col service-gallery">
          <div className="service-gallery-stage">
          {serviceImages.map((imageUrl, index) => (
            <div
              className="service-gallery-slide"
              key={`${imageUrl}-${index}`}
              style={{ zIndex: index + 1 }}
            >
              <img
                src={imageUrl}
                alt={`${currentService.name} фото ${index + 1}`}
                onError={(e) => {
                  e.target.src = FALLBACK_SERVICE_IMAGE;
                }}
              />
            </div>
          ))}
          </div>
          <div className="service-gallery-thumbs" aria-label="Фотографии услуги">
            {serviceImages.map((imageUrl, index) => (
              <button
                type="button"
                className={`service-gallery-thumb ${activeImageIndex === index ? "is-active" : ""}`}
                key={`${imageUrl}-thumb-${index}`}
                onClick={() => handleGalleryThumbClick(index)}
                aria-label={`Показать фото ${index + 1}`}
              >
                <img
                  src={imageUrl}
                  alt=""
                  onError={(e) => {
                    e.target.src = FALLBACK_SERVICE_IMAGE;
                  }}
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="service-hero-col service-meta">
          <div className="service-meta-container">
            <div className="service-meta-header">
              <h3>{currentService.name}</h3>
              <h3>{currentService.price} ₽</h3>
            </div>
            <div className="service-meta-header-divider"></div>
            <div className="service-specialist-container">
              <p className="md">Specialist</p>
              <p className="bodyCopy">
                <Link
                  to={`/lab/specialists?specialist=${currentService.specialistSlug}`}
                  className="service-specialist-link"
                >
                  {currentService.specialist}
                </Link>
              </p>
            </div>
            <div className="service-duration-container">
              <p className="md">Duration</p>
              <p className="bodyCopy">{currentService.duration}</p>
            </div>
            <div className="service-meta-buttons">
              <button className="primary" onClick={handleBookNow}>
                Book Now
              </button>
              <button className="secondary" onClick={handleSaveService}>
                Save Item
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>

      <section className="service-details">
        <div className="service-col service-col-copy">
          <div className="service-col-copy-wrapper">
            <Copy>
              <h4>Description</h4>
            </Copy>
            <Copy>
              <p className="bodyCopy lg">{currentService.description}</p>
            </Copy>
          </div>
        </div>
        <div className="service-col service-col-img">
          <img src={detailImage} alt={currentService.name} />
        </div>
      </section>

      <section className="service-benefits">
        <div className="container">
          <h4>Benefits</h4>
          <div className="benefits-list">
            {currentService.benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <p className="bodyCopy">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="related-services">
        <div className="container">
          <div className="related-services-header">
            <h3>Related Services</h3>
          </div>
          <div className="related-services-container">
            <div className="container">
              {relatedServices.map((service) => (
                <Product
                  key={service.id}
                  service={service}
                  serviceIndex={service.id}
                  showAddToCart={true}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {showBookingModal && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="booking-modal-close"
              onClick={() => setShowBookingModal(false)}
            >
              ✕
            </button>
            <ServiceBooking
              service={currentService}
              onClose={() => setShowBookingModal(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
