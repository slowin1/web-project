export default function Hamburger() {
    return (
        <>
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
    </>
    );
}
