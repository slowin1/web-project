import Footer from "../components/Footer";
import { workServices } from "../data/workServices";

export default function WorkPage() {
  return (
    <>
      <section className="work-hero">
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
        {workServices.map((service, index) => (
          <div
            className="work-item-row"
            id={`work-item-row-${index + 1}`}
            key={service.slug}
          >
            <a href={`/work/${service.slug}`}>
              <div className="work-item">
                <img src={service.image} alt={service.name} />
                <div className="work-item-info">
                  <p>{service.name}</p>
                  <p>{service.code}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>

    <Footer />

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
