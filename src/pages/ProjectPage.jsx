
import Footer from "../components/Footer";

export default function ProjectPage() {
  return (
    <>
      <section className="project-hero">
      <div className="project-hero-img">
        <img src="/project/project_1.png" alt="" />
      </div>

      <div className="project-hero-copy">
        <div className="container">
          <div className="project-hero-header">
            <h1
              data-animate-variant="diffuse"
              data-animate-on-scroll="false"
              data-animate-delay="0.1"
            >
              Шведский массаж<br />500 лей 30 минут
            </h1>
            <p
              data-animate-variant="slide"
              data-animate-type="words"
              data-animate-on-scroll="false"
              data-animate-delay="0.75"
            >
              Классический шведский массаж, который сочетает в себе различные техники для расслабления мышц и улучшения кровообращения. Идеально подходит для снятия напряжения и общего расслабления.
            </p>
          </div>

          <div className="project-hero-meta">
            <div className="project-hero-meta-col">
              <p
                className="type-mono"
                data-animate-variant="flicker"
                data-animate-on-scroll="false"
                data-animate-delay="1"
              >
                2025 & 2021
              </p>
            </div>

            <div className="project-hero-meta-col">
              <p
                className="type-mono"
                data-animate-variant="flicker"
                data-animate-on-scroll="false"
                data-animate-delay="1"
              >
                Form Study
              </p>
              <p
                className="type-mono"
                data-animate-variant="flicker"
                data-animate-on-scroll="false"
                data-animate-delay="1.5"
              >
                Computational Geometry
              </p>
              <p
                className="type-mono"
                data-animate-variant="flicker"
                data-animate-on-scroll="false"
                data-animate-delay="1.5"
              >
                Material Simulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="project-info">
      <div className="container">
        <div className="project-info-col">
          <p
            className="lg"
            data-animate-variant="slide"
            data-animate-type="lines"
            data-animate-on-scroll="true"
          >
            This project investigates the effects of controlled structural
            offset applied to a stable symmetrical form. By introducing minor
            displacement without altering the overall integrity of the system
            the study observes how perception of balance continuity and surface
            behavior changes under restrained conditions.
          </p>
        </div>

        <div className="project-info-col">
          <div className="project-info-sub-col">
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Lead Studio
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Interface Lab
            </p>
            <br />
            <br />
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Design Research
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Lucas Reinhardt, Alex Morin
            </p>
          </div>

          <div className="project-info-sub-col">
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Direction
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Deadspace Labs
            </p>
            <br />
            <br />
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Modeling
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Elias Norberg, Anton Weiss
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="project-images">
      <div className="container">
        <div className="project-img">
          <img src="/project/project_2.jpg" alt="" />
        </div>

        <div className="project-img">
          <img src="/project/project_3.jpg" alt="" />
        </div>

        <div className="project-img">
          <img src="/project/project_4.jpg" alt="" />
        </div>
      </div>
    </section>

    <section className="project-info project-outro">
      <div className="container">
        <div className="project-info-col">
          <p
            className="lg"
            data-animate-variant="slide"
            data-animate-type="lines"
            data-animate-on-scroll="true"
          >
            Silent Offset was developed as part of an internal research cycle
            focused on formal restraint and perceptual balance. The project
            prioritizes incremental adjustment over transformation using
            controlled variation to study how minimal deviation influences
            spatial reading and material presence.
          </p>
        </div>

        <div className="project-info-col">
          <div className="project-info-sub-col">
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Study Period
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Q4 2025
            </p>
            <br />
            <br />
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Project Status
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Completed
            </p>
          </div>

          <div className="project-info-sub-col">
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Primary Focus
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Structural Balance
            </p>
            <br />
            <br />
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="true"
            >
              Output Format
            </p>
            <p
              data-animate-variant="slide"
              data-animate-type="lines"
              data-animate-on-scroll="true"
            >
              Digital Spatial Artifact
            </p>
          </div>
        </div>
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
