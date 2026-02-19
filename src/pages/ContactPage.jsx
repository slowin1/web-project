export default function ContactPage() {
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

    <section className="contact-visual">
      <div className="contact-visual-icon">
        <img src="/contact/icon_1.svg" alt="" />
      </div>
    </section>

    <section className="contact-info">
      <div className="contact-info-row">
        <p>Temporal</p>
        <p className="contact-clock">00:00 EST</p>
      </div>

      <div className="contact-info-row">
        <p>Registered Node</p>
        <p>Arctic Perimeter</p>
      </div>

      <div className="contact-info-row">
        <p>Business Interface</p>
        <p>business@deadspacelabs</p>
      </div>

      <div className="contact-info-row">
        <p>Collaborations Channel</p>
        <p>collaborate@deadspacelabs</p>
      </div>

      <div className="contact-info-row">
        <p>Network Presence</p>
        <p>Northern Relay, Helsinki</p>
      </div>

      <div className="contact-info-row">
        <p>Personnel Intake</p>
        <p>No Active Intake</p>
      </div>

      <div className="contact-info-row">
        <p>Voice Node</p>
        <p>COM–01</p>
      </div>
    </section>

    <div className="contact-footer">
      <div className="container">
        <p
          className="type-mono"
          data-animate-variant="flicker"
          data-animate-on-scroll="false"
          data-animate-delay="1"
        >
          MWT __ January ’26
        </p>
        <p
          className="type-mono"
          data-animate-variant="flicker"
          data-animate-on-scroll="false"
          data-animate-delay="1"
        >
          [ Engineered by Codegrid ]
        </p>
      </div>
    </div>








    </>
  );
}
