export default function ProjectPage() {
  return (
    <>

    <div className="transition-grid">
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
      <div className="transition-block"></div>
    </div>



    <nav>
      <div className="container">
        <div className="nav-clock">
          <p className="type-mono">18 <span>:</span> 25 EST</p>
        </div>

        <div className="nav-logo">
          <a href="/" className="type-mono">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1000"
              height="1000"
              viewBox="0 0 1000 1000"
              fill="none"
            >
              <g clipPath="url(#clip0_1002_3)">
                <path
                  d="M25 500.205C25 633.944 205.38 742.342 427.916 742.342V598.989C278.924 598.989 158.162 526.396 158.162 436.851C158.162 347.307 278.924 274.713 427.916 274.713V258C205.414 258 25 366.432 25 500.137V500.205Z"
                  fill="black"
                />
                <path
                  d="M572.084 258.068V274.781C721.076 274.781 841.839 347.375 841.839 436.919C841.839 526.464 721.076 599.057 572.084 599.057V742.41C794.586 742.41 975 633.978 975 500.273C975 366.568 794.62 258.136 572.084 258.136V258.068Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_1002_3">
                  <rect width="1000" height="1000" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
        </div>

        <div className="nav-location">
          <p className="type-mono">
            <ion-icon name="triangle-sharp" /> Chishinau, MD
          </p>
        </div>
      </div>
    </nav>

    <div className="menu-toggle-btn">
      <div className="hamburger-bar"></div>
      <div className="hamburger-bar"></div>
    </div>

    <div className="menu-overlay">
      <div className="menu-bg">
        <canvas id="menu-canvas"></canvas>
      </div>

      <div className="menu-overlay-nav">
        <div className="close-btn">
          <div className="close-btn-bar"></div>
          <div className="close-btn-bar"></div>
        </div>

        <div className="menu-overlay-items">
          <a
            className="type-mono"
            href="https://www.instagram.com/clavik_nagoreanskii/"
            target="_blank"
            rel="noopener noreferrer"
            >Instagram</a
          >
          <a
            className="type-mono"
            href="https://x.com/codegridweb"
            target="_blank"
            rel="noopener noreferrer"
            >Twitter</a
          >
        </div>
      </div>

      <div className="menu-overlay-footer">
        <a className="type-mono" href="/lab">Lab Access</a>
        <a className="type-mono" href="/contact">Get in Touch</a>
      </div>

      <div className="circular-menu">
        <div className="joystick">
          <ion-icon
            name="grid-sharp"
            className="center-icon center-main"
           />
          <ion-icon
            name="chevron-up-sharp"
            className="center-icon center-up"
           />
          <ion-icon
            name="chevron-down-sharp"
            className="center-icon center-down"
           />
          <ion-icon
            name="chevron-back-sharp"
            className="center-icon center-left"
           />
          <ion-icon
            name="chevron-forward-sharp"
            className="center-icon center-right"
           />
        </div>
      </div>
    </div>

    <section className="project-hero">
      <div className="project-hero-img">
        <img src="/project/project_2.jpg" alt="" />
      </div>

      <div className="project-hero-copy">
        <div className="container">
          <div className="project-hero-header">
            <h1
              data-animate-variant="diffuse"
              data-animate-on-scroll="false"
              data-animate-delay="0.1"
            >
              Silent<br />Offset
            </h1>
            <p
              data-animate-variant="slide"
              data-animate-type="words"
              data-animate-on-scroll="false"
              data-animate-delay="0.75"
            >
              Symmetry without collapse
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
          <img src="/project/project_1.jpg" alt="" />
        </div>

        <div className="project-img">
          <img src="/project/project_4.jpg" alt="" />
        </div>

        <div className="project-img">
          <img src="/project/project_5.jpg" alt="" />
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

    <footer>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-row">
            <div className="footer-col">
              <h2>Deadspace</h2>
            </div>

            <div className="footer-col">
              <div className="footer-sub-col">
                <a href="/"><h3>Index</h3></a>
                <a href="/lab"><h3>Lab</h3></a>
                <a href="/work"><h3>Archive</h3></a>
                <a href="/project"><h3>Record 01</h3></a>
                <a href="/contact"><h3>Connect</h3></a>
              </div>

              <div className="footer-sub-col">
                <a
                  href="https://x.com/codegridweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Twitter</a
                >
                <a
                  href="https://www.instagram.com/codegridweb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Instagram</a
                >
                <a
                  href="https://codegrid.gumroad.com/l/codegridpro"
                  target="_blank"
                  rel="noopener noreferrer"
                  >Gumroad</a
                >
                <a
                  href="https://www.youtube.com/@codegrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  >YouTube</a
                >
              </div>
            </div>
          </div>

          <div className="footer-row">
            <p className="type-mono">MWT __ January ’26</p>
            <p className="type-mono">[ Engineered by Codegrid ]</p>
          </div>
        </div>
      </div>
    </footer>

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
