export default function LabPage() {
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
            <ion-icon name="triangle-sharp" /> Chishinay, MD
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
          Массаж — это не просто уход за телом, а полноценный ритуал восстановления. В нашем салоне мы создаём атмосферу спокойствия, где вы можете отпустить
          напряжение, перезагрузиться и почувствовать настоящее расслабление.
          Каждая процедура подбирается индивидуально — с учётом ваших ощущений, ритма жизни и целей: расслабление, восстановление после нагрузок или забота о здоровье.
        </h3>
        <h3
          className="type-var-2"
          data-animate-variant="slide"
          data-animate-type="lines"
          data-animate-on-scroll="true"
        >
          Мы используем только проверенные техники массажа, индивидуально
          подбирая интенсивность и методику под каждого клиента.
          Перед началом сеанса мастер обязательно уточняет ваши пожелания,
           зоны напряжения и уровень комфорта — для нас важно,чтобы результат
            ощущался не только сразу, но и после.
        </h3>
      </div>
    </section>

    <section className="pie-transition">
      <div className="pie-transition-outro-header">
        <h3>Услуги и эксперементальные техники массажа.</h3>
      </div>

      <div className="pie-transition-footer">
        <div className="container">
          <p className="type-mono">[010101]</p>
          <p className="type-mono">Разработка в процессе...</p>
        </div>
      </div>
    </section>

    <section className="stats">
      <div className="stats-header">
        <div className="stats-header-copy">
          <h3>Услуги</h3>
          <p>
            В нашем салоне мы предлагаем широкий спектр массажных услуг, которые адаптируются под ваши индивидуальные потребности.
             От классического расслабляющего массажа до специализированных техник, направленных на восстановление после физических нагрузок или улучшение общего самочувствия.
             Наши мастера тщательно подбирают методики и интенсивность, чтобы обеспечить максимальную эффективность и комфорт для каждого клиента.
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
                какой-то текст про услуги, который может быть длинным и занимать несколько строк, чтобы показать, как будет выглядеть в дизайне
              </h3>
            </div>
            <div className="stat-info">
              <p className="type-mono">(имя фамилия)</p>
            </div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-count">
            <h1>2</h1>
          </div>
          <div className="stat-content">
            <div className="stat-title">
              <h3>какой-то текст про услуги, который может быть длинным и занимать несколько строк, чтобы показать, как будет выглядеть в дизайне</h3>
            </div>
            <div className="stat-info">
              <p className="type-mono">(имя фамилия)</p>
            </div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-count">
            <h1>3</h1>
          </div>
          <div className="stat-content">
            <div className="stat-title">
              <h3>какой-то текст про услуги, который может быть длинным и занимать несколько строк, чтобы показать, как будет выглядеть в дизайне</h3>
            </div>
            <div className="stat-info">
              <p className="type-mono">(имя фамилия)</p>
            </div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-count">
            <h1>4</h1>
          </div>
          <div className="stat-content">
            <div className="stat-title">
              <h3>какой-то текст про услуги, который может быть длинным и занимать несколько строк, чтобы показать, как будет выглядеть в дизайне</h3>
            </div>
            <div className="stat-info">
              <p className="type-mono">(имя фамилия)</p>
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

    <footer>
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-row">
            <div className="footer-col">
              <h2>MassageSalon</h2>
            </div>

            <div className="footer-col">
              <div className="footer-sub-col">
                <a href="/"><h3>Главная</h3></a>
                <a href="/lab"><h3>Услуги</h3></a>
                <a href="/work"><h3>Галерея</h3></a>
                <a href="/project"><h3>Проекты</h3></a>
                <a href="/contact"><h3>Контакты</h3></a>
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
            <p className="type-mono">MWT 19 February ’26</p>
            <p className="type-mono">[ Engineered by Clavik ]</p>
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
