import { useEffect, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Copy from "../components/Copy/Copy";
import Product from "../components/Product/Product";
import { fetchCatalogBundle } from "../api/catalog";
import "../../css/wardrobe.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function LabPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "Все услуги", styleKey: "all" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 250);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const productRefs = useRef([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    let isMounted = true;

    // ensure ScrollTrigger and external GSAP modules re-calc after React renders
    requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh(true);
      } catch {}
    });

    async function loadCatalog() {

      setIsLoading(true);
      setLoadError("");

      try {
        const data = await fetchCatalogBundle();
        if (!isMounted) return;

        setAllServices(data.services);
        setFilteredServices(data.services);
        setCategories([
          { id: "all", name: "Все услуги", styleKey: "all" },
          ...data.categories,
        ]);
      } catch (error) {
        console.error("Failed to load services:", error);
        if (!isMounted) return;

        setAllServices([]);
        setFilteredServices([]);
        setLoadError("Не удалось загрузить услуги");
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

  const handleCategoryChange = (newCategory) => {
    if (newCategory === activeCategory) return;
    setActiveCategory(newCategory);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (allServices.length === 0) {
      setFilteredServices([]);
      setIsAnimating(false);
      return;
    }

    const filtered = allServices.filter((service) => {
      const matchesCategory = activeCategory === "all" ? true : String(service.category) === String(activeCategory);
      const matchesQuery = !debouncedQuery ? true : service.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    const visibleRefs = productRefs.current.filter(Boolean);
    if (isInitialMount.current || visibleRefs.length === 0) {
      setFilteredServices(filtered);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    gsap.killTweensOf(visibleRefs);

    gsap.to(visibleRefs, {
      opacity: 0,
      scale: 0.5,
      duration: 0.18,
      stagger: 0.03,
      ease: "power3.out",
      onComplete: () => {
        setFilteredServices(filtered);
      },
    });
  }, [debouncedQuery, activeCategory, allServices]);

  useEffect(() => {
    productRefs.current = productRefs.current.slice(0, filteredServices.length);
    gsap.killTweensOf(productRefs.current);

    gsap.fromTo(
      productRefs.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: isInitialMount.current ? 0.5 : 0.25,
        stagger: isInitialMount.current ? 0.05 : 0.05,
        ease: "power3.out",
        onComplete: () => {
          setIsAnimating(false);
          isInitialMount.current = false;
        },
      }
    );
  }, [filteredServices]);

  const handleServiceClick = (serviceId) => {
    navigate(`/lab/${serviceId}`);
  };

  const activeCategoryName =
    categories.find((category) => category.id === activeCategory)?.name || "Все услуги";

  return (
    <div className="lab-page">
      <canvas id="particle-canvas"></canvas>

      <section className="lab-hero">
        <div className="container">
          <h1
            data-animate-variant="diffuse"
            data-animate-on-scroll="false"
            data-animate-delay="0.1"
          >
            Services
          </h1>
          <p
            data-animate-variant="slide"
            data-animate-type="words"
            data-animate-on-scroll="false"
            data-animate-delay="0.75"
          >
            Experimental Unit
          </p>
        </div>
        <div className="lab-about-revealer"></div>
        <div className="lab-hero-overlay"></div>
      </section>

      <section className="lab-about">
        <div className="container">
          <h3
            className="type-var-2"
            data-animate-variant="slide"
            data-animate-type="lines"
            data-animate-on-scroll="true"
          >
            Массаж для тела и души
          </h3>
          <Copy animateOnScroll={true} delay={0.2}>
            <p className="bodyCopy lg">
              Массаж — это не просто уход за телом, а полноценный ритуал
              восстановления. В нашем салоне мы создаём атмосферу спокойствия,
              где вы можете отпустить напряжение, перезагрузиться и почувствовать
              настоящее расслабление. Каждая процедура подбирается индивидуально —
              с учётом ваших ощущений, ритма жизни и целей: расслабление,
              восстановление после нагрузок или забота о здоровье.
            </p>
          </Copy>
          <Copy animateOnScroll={true} delay={0.4}>
            <p className="bodyCopy lg">
              Мы используем только проверенные техники массажа, индивидуально
              подбирая интенсивность и методику под каждого клиента. Перед началом
              сеанса мастер обязательно уточняет ваши пожелания, зоны напряжения
              и уровень комфорта — для нас важно, чтобы результат ощущался не
              только сразу, но и после.
            </p>
          </Copy>
        </div>
      </section>

      <section className="services-header">
        <div className="container">
          <Copy animateOnScroll={false} delay={0.65}>
            <h1>Услуги</h1>
          </Copy>
          <div className="services-header-divider"></div>
          <div className="service-filter-bar">
            <div className="filter-bar-header">
              <span>Каталог</span>
              <p className="bodyCopy">{activeCategoryName}</p>
            </div>
            <div className="filter-bar-search">
              <input
                type="text"
                placeholder="Поиск по названию"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="filter-bar-count">
                {filteredServices.length}
              </div>
            </div>
            <div className="filter-bar-tags">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`bodyCopy ${activeCategory === category.id ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category.id)}
                  disabled={isAnimating}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          {isLoading && <p className="bodyCopy">Загрузка услуг...</p>}
          {!isLoading && loadError && <p className="bodyCopy">{loadError}</p>}
          {!isLoading && !loadError && filteredServices.length === 0 && (
            <p className="bodyCopy">Услуги не найдены</p>
          )}
          {filteredServices.map((service, index) => (
            <Product
              key={service.id}
              service={service}
              serviceIndex={index + 1}
              innerRef={(el) => (productRefs.current[index] = el)}
              style={{ opacity: 0, transform: "scale(0.5)" }}
            />
          ))}
        </div>
      </section>

      <section className="stats">
        <div className="stats-header">
          <div className="stats-header-copy">
            <h3>Услуги</h3>
            <p>
              В нашем салоне мы предлагаем широкий спектр массажных услуг, которые
              адаптируются под ваши индивидуальные потребности. От классического
              расслабляющего массажа до специализированных техник, направленных на
              восстановление после физических нагрузок или улучшение общего
              самочувствия. Наши мастера тщательно подбирают методики и
              интенсивность, чтобы обеспечить максимальную эффективность и комфорт
              для каждого клиента.
            </p>
          </div>
        </div>

        <div className="stats-content">
          <div className="stat-item">
            <div className="stat-count">
              <h1>1</h1>
            </div>
            <div className="stat-content">
              <div className="stat-title">
                <h3>
                  Классический массаж — это базовая техника, которая помогает
                  расслабиться, улучшить кровообращение и снять мышечное
                  напряжение.
                </h3>
              </div>
              <div className="stat-info">
                <p className="type-mono">(Анастасия Длиноручка)</p>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-count">
              <h1>2</h1>
            </div>
            <div className="stat-content">
              <div className="stat-title">
                <h3>
                  Лечебный массаж — при болях в спине, шее, пояснице по
                  показаниям.
                </h3>
              </div>
              <div className="stat-info">
                <p className="type-mono">(Яна Дрочунова)</p>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-count">
              <h1>3</h1>
            </div>
            <div className="stat-content">
              <div className="stat-title">
                <h3>
                  Спортивный массаж — для восстановления после тренировок.
                </h3>
              </div>
              <div className="stat-info">
                <p className="type-mono">(Анастасия Длиноручка)</p>
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-count">
              <h1>4</h1>
            </div>
            <div className="stat-content">
              <div className="stat-title">
                <h3>
                  Тайский массаж — растяжки и работа с энергетическими линиями.
                </h3>
              </div>
              <div className="stat-info">
                <p className="type-mono">(Валентика Кусака)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="clients">
        <div className="container">
          <div className="clients-header">
            <h2>Все предоставляемые услуги</h2>
          </div>
          <div className="clients-list"></div>
        </div>
      </section>

      <Footer />

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
          <filter
            id="blur-matrix"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            ></feColorMatrix>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
