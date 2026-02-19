export default function WorkPage() {
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
            <ion-icon name="triangle-sharp" /> Helsinki, FI
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
            href="https://www.instagram.com/codegridweb/"
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
        <div className="work-item-row" id="work-item-row-1">
          <a href="/project">
            <div className="work-item">
              <img src="/work/work_01.jpg" alt="" />
              <div className="work-item-info">
                <p>Тайский массаж</p>
                <p>9K4F2M7Q</p>
              </div>
            </div>
          </a>
        </div>

        <div className="work-item-row" id="work-item-row-2">
          <a href="/project">
            <div className="work-item">
              <img src="/work/work_02.jpg" alt="" />
              <div className="work-item-info">
                <p>Шведский массаж</p>
                <p>A7L3Q9F2</p>
              </div>
            </div>
          </a>
        </div>

        <div className="work-item-row" id="work-item-row-3">
          <a href="/project">
            <div className="work-item">
              <img src="/work/work_03.jpg" alt="" />
              <div className="work-item-info">
                <p>Массаж с использованием масла</p>
                <p>R1M9D4K7</p>
              </div>
            </div>
          </a>
        </div>

        <div className="work-item-row" id="work-item-row-4">
          <a href="/project">
            <div className="work-item">
              <img src="/work/work_04.jpg" alt="" />
              <div className="work-item-info">
                <p>Банный чан</p>
                <p>2F8Q7A9L</p>
              </div>
            </div>
          </a>
        </div>

        <div className="work-item-row" id="work-item-row-5">
          <a href="/project">
            <div className="work-item">
              <img src="/work/work_05.jpg" alt="" />
              <div className="work-item-info">
                <p>Сауна</p>
                <p>M4D9K7F2</p>
              </div>
            </div>
          </a>
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
