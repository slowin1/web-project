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
                <a href="/"><h3>Главная</h3></a>
                <a href="/lab"><h3>Услуги</h3></a>
                <a href="/work"><h3>Работы</h3></a>
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
                  href="https://www.instagram.com/clavik_nagoreanskii/"
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
            <p className="type-mono">MWT 19 Februaty ’26</p>
            <p className="type-mono">[ Engineered by clavik ]</p>
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
