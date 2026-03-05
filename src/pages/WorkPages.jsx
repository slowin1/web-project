import { Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { getWorkServiceBySlug } from "../data/workServices";

export default function WorkPages() {
  const { slug } = useParams();
  const service = getWorkServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/work" replace />;
  }

  return (
    <>
      {/* Hero Section with Overlay */}
      <section className="project-hero-modern">
        <div className="project-hero-bg">
          <div className="project-hero-overlay"></div>
          <img src={service.coverImage} alt={service.name} className="project-hero-bg-img" />
        </div>

        <div className="project-hero-content">
          <div className="container">
            <div className="project-hero-badge">
              <span className="badge-icon">✦</span>
              <span>Massage & Wellness</span>
            </div>
            
            <h1 className="project-hero-title">
              {service.name}
            </h1>
            
            <p className="project-hero-subtitle">
              {service.description}
            </p>

            <div className="project-hero-pricing">
              <div className="price-card">
                <span className="price-label">Стоимость</span>
                <span className="price-value">{service.price}</span>
              </div>
              <div className="price-card">
                <span className="price-label">Длительность</span>
                <span className="price-value">{service.duration}</span>
              </div>
              <div className="price-card">
                <span className="price-label">Код услуги</span>
                <span className="price-value code">{service.code}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="project-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Natural Approach</h3>
              <p>Traditional techniques for holistic wellness and relaxation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💆</div>
              <h3>Expert Therapists</h3>
              <p>Certified professionals with years of experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Premium Service</h3>
              <p>Individual sessions tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="project-gallery">
        <div className="container">
          <div className="gallery-header">
            <h2>Gallery</h2>
            <p>Experience the atmosphere</p>
          </div>
          
          <div className="gallery-grid">
            {service.gallery.map((imagePath, index) => (
              <div 
                className={`gallery-item ${index === 0 ? 'gallery-item-large' : ''}`} 
                key={imagePath}
              >
                <div className="gallery-image-wrapper">
                  <img src={imagePath} alt={`${service.name} - ${index + 1}`} />
                  <div className="gallery-overlay"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="project-outro-modern">
        <div className="container">
          <div className="outro-content">
            <h2>Ready to Relax?</h2>
            <p>Book your session today and experience ultimate tranquility</p>
            <a href="/contact" className="btn-book">
              Book Now
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* SVG Filters for animations */}
      <svg
        viewBox="0 0 0 0"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="blur-matrix" x="-50%" y="-50%" width="200%" height="200%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
