import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import { massageServices } from "../data/massageServices";
import "../../css/unit.css";

export default function SpecialistPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedSlug = searchParams.get("specialist");

  const specialists = useMemo(() => {
    const grouped = massageServices.reduce((acc, service) => {
      if (!acc[service.specialistSlug]) {
        acc[service.specialistSlug] = {
          specialist: service.specialist,
          specialistSlug: service.specialistSlug,
          specialistBio: service.specialistBio,
          image: service.image,
          services: [],
        };
      }
      acc[service.specialistSlug].services.push(service);
      return acc;
    }, {});

    return Object.values(grouped);
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

  const fallbackImage =
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop";

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
                    e.target.src = fallbackImage;
                  }}
                />
              </div>
              <div className="specialist-card-content">
                <h4>{specialist.specialist}</h4>
                <p className="bodyCopy lg">{specialist.specialistBio}</p>
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
