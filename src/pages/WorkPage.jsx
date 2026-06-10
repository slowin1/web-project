import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { CONTENT_TYPES, contentItemsAPI } from "../api/contentItems";
import { workServices } from "../data/workServices";

export default function WorkPage() {
  const [galleryItems, setGalleryItems] = useState(() => getFallbackGalleryItems());

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        const data = await contentItemsAPI.getPublic(CONTENT_TYPES.gallery);
        const activeItems = data.filter((item) => item.isActive && item.imageUrl);

        if (isMounted && activeItems.length > 0) {
          setGalleryItems(activeItems);
        }
      } catch (error) {
        console.warn("Gallery DB content unavailable, using fallback images.", error);
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let frameId = 0;
    let lastScrollY = window.scrollY || window.pageYOffset;
    let velocity = 0;

    const updatePhotoMotion = () => {
      frameId = 0;
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      velocity += (scrollDelta - velocity) * 0.14;

      const motion = Math.min(Math.abs(velocity), 28);
      const photos = document.querySelectorAll(".work-item img");

      photos.forEach((photo) => {
        if (getComputedStyle(photo).opacity === "0") {
          photo.style.transform = "";
          photo.style.filter = "";
          return;
        }

        const bounds = photo.getBoundingClientRect();
        const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        if (!isVisible) return;

        const centerOffset =
          (bounds.top + bounds.height / 2 - window.innerHeight / 2) /
          window.innerHeight;
        const shift = Math.max(-34, Math.min(34, centerOffset * -36));
        const scale = 1.018 + motion * 0.0016;
        const blur = motion > 7 ? Math.min(0.65, motion / 42) : 0;

        photo.classList.add("work-photo-animated");
        photo.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        photo.style.filter = blur ? `blur(${blur.toFixed(2)}px)` : "";
      });
    };

    const schedulePhotoMotion = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updatePhotoMotion);
    };

    schedulePhotoMotion();
    window.addEventListener("scroll", schedulePhotoMotion, { passive: true });
    window.addEventListener("resize", schedulePhotoMotion);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", schedulePhotoMotion);
      window.removeEventListener("resize", schedulePhotoMotion);
      document.querySelectorAll(".work-item img").forEach((photo) => {
        photo.style.transform = "";
        photo.style.filter = "";
      });
    };
  }, [galleryItems.length]);

  return (
    <>
      <section className="work-hero">
      <canvas className="work-hero-shader" aria-hidden="true" />
      <h1
        data-animate-variant="diffuse"
        data-animate-on-scroll="false"
        data-animate-delay="0.1"
      >
        Галерея
      </h1>

      <div className="work-hero-footer">
        <div className="container">
          <p
            className="type-mono"
            data-animate-variant="flicker"
            data-animate-on-scroll="false"
            data-animate-delay="1"
          >
            [ Ongoing practice ]
          </p>
          <p
            className="type-mono"
            data-animate-variant="flicker"
            data-animate-on-scroll="false"
            data-animate-delay="1"
          >
            / Design archive
          </p>
        </div>
      </div>
    </section>

    <section className="work-items">
      <div className="container">
        {galleryItems.map((item, index) => (
          <div
            className={`work-item-row ${index % 2 === 0 ? "is-left" : "is-right"}`}
            key={item.id || item.slug || `${item.title}-${index}`}
          >
            <div className="work-item-frame">
              <div className="work-item">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  width="736"
                  height="920"
                />
                <div className="work-item-info">
                  <p>{item.title}</p>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <Footer className="work-footer" />

    <svg
      viewBox="0 0 0 0"
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="blur-matrix" x="-50%" y="-50%" width="200%" height="200%">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
          ></feColorMatrix>
        </filter>
      </defs>
    </svg>









    </>
  );
}


function getFallbackGalleryItems() {
  return workServices.map((service, index) => ({
    id: service.slug,
    title: service.name,
    slug: service.slug,
    subtitle: service.code,
    imageUrl: service.image,
    sortOrder: index,
    isActive: true,
  }));
}
