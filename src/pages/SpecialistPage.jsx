import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import { fetchSpecialistsBundle, FALLBACK_IMAGE } from "../api/catalog";
import "../../css/unit.css";

export default function SpecialistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedSlug = searchParams.get("specialist");

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

  useEffect(() => {
    if (!selectedSlug) return;
    const target = document.getElementById(`specialist-${selectedSlug}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSlug]);

  return (
    <div className="specialists-page">
      <section className="service-hero">
        <div className="service-hero-col service-meta">
          <div className="service-meta-container">
            <div className="service-meta-header">
              <h3>Все специалисты</h3>
            </div>
            <div className="service-meta-header-divider"></div>
            <div className="service-meta-buttons">
              <Link className="primary" to="/lab">
                Все услуги
              </Link>
              <button className="secondary" onClick={() => navigate(-1)}>
                Назад
              </button>
            </div>
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
}
