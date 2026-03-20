import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import Product from "../components/Product/Product";
import { massageServices } from "../data/massageServices";
import "../../css/unit.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function UnitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const activeMinimapIndex = useRef(0);
  const [relatedServices, setRelatedServices] = useState([]);

  const currentService = massageServices.find(
    (s) => s.id === parseInt(id)
  ) || massageServices[0];

  useEffect(() => {
    window.scrollTo(0, 0);

    const shuffled = [...massageServices]
      .filter((s) => s.id !== currentService.id)
      .sort(() => 0.5 - Math.random());
    setRelatedServices(shuffled.slice(0, 4));

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [id, currentService.id]);

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo(0, 0);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("scrollToTop", handleScrollToTop);

    return () => {
      window.removeEventListener("scrollToTop", handleScrollToTop);
    };
  }, []);

  useGSAP(() => {
    const snapshots = document.querySelectorAll(".service-snapshot");
    const minimapImages = document.querySelectorAll(
      ".service-snapshot-minimap-img"
    );
    const totalImages = snapshots.length;

    gsap.set(snapshots[0], { y: "0%", scale: 1 });
    gsap.set(minimapImages[0], { scale: 1.25 });
    for (let i = 1; i < totalImages; i++) {
      gsap.set(snapshots[i], { y: "100%", scale: 1 });
      gsap.set(minimapImages[i], { scale: 1 });
    }

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        let currentActiveIndex = 0;

        for (let i = 1; i < totalImages; i++) {
          const imageStart = (i - 1) / (totalImages - 1);
          const imageEnd = i / (totalImages - 1);

          let localProgress = (progress - imageStart) / (imageEnd - imageStart);
          localProgress = Math.max(0, Math.min(1, localProgress));

          const yValue = 100 - localProgress * 100;
          gsap.set(snapshots[i], { y: `${yValue}%` });

          const scaleValue = 1 + localProgress * 0.5;
          gsap.set(snapshots[i - 1], { scale: scaleValue });

          if (localProgress >= 0.5) {
            currentActiveIndex = i;
          }
        }

        if (currentActiveIndex !== activeMinimapIndex.current) {
          gsap.to(minimapImages[currentActiveIndex], {
            scale: 1.25,
            duration: 0.3,
            ease: "power2.out",
          });

          for (let i = 0; i < currentActiveIndex; i++) {
            gsap.to(minimapImages[i], {
              scale: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          for (let i = currentActiveIndex + 1; i < totalImages; i++) {
            gsap.to(minimapImages[i], {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          activeMinimapIndex.current = currentActiveIndex;
        }
      },
    });

    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, []);

  const handleBookNow = () => {
    alert(`Запись на процедуру: ${currentService.name}\nСпециалист: ${currentService.specialist}`);
  };

  const handleSaveService = () => {
    alert(`Услуга "${currentService.name}" сохранена в избранное`);
  };

  return (
    <div className="unit-page">
      <section className="service-hero" ref={heroRef}>
        <div className="service-hero-col service-snapshots">
          <div className="service-snapshot">
            <img src={currentService.image} alt={currentService.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop'; }} />
          </div>
          <div className="service-snapshot">
            <img src={currentService.image} alt={currentService.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop'; }} />
          </div>
          <div className="service-snapshot">
            <img src={currentService.image} alt={currentService.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop'; }} />
          </div>
          <div className="service-snapshot">
            <img src={currentService.image} alt={currentService.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop'; }} />
          </div>
          <div className="service-snapshot">
            <img src={currentService.image} alt={currentService.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop'; }} />
          </div>
          <div className="service-snapshot-minimap">
            <div className="service-snapshot-minimap-img">
              <img src={currentService.minimap} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop'; }} />
            </div>
            <div className="service-snapshot-minimap-img">
              <img src={currentService.minimap} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop'; }} />
            </div>
            <div className="service-snapshot-minimap-img">
              <img src={currentService.minimap} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop'; }} />
            </div>
            <div className="service-snapshot-minimap-img">
              <img src={currentService.minimap} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop'; }} />
            </div>
            <div className="service-snapshot-minimap-img">
              <img src={currentService.minimap} alt="" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop'; }} />
            </div>
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
              <p className="bodyCopy">{currentService.specialist}</p>
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
          <img src={currentService.image} alt={currentService.name} />
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

      <Footer />
    </div>
  );
}
