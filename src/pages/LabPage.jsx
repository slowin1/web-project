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
