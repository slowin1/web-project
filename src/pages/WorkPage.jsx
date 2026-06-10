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
