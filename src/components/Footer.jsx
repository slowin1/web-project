import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  useEffect(() => {
    const footerContainer = document.querySelector(".footer-container");
    if (!footerContainer) return;

    ScrollTrigger.create({
      trigger: "footer",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const yValue = -35 * (1 - self.progress);
        gsap.set(footerContainer, { y: `${yValue}%` });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
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
                >Twitter</a>
                <a
                  href="https://www.instagram.com/clavik_nagoreanskii/"
                  target="_blank"
                  rel="noopener noreferrer"
                >Instagram</a>
                <a
                  href="https://codegrid.gumroad.com/l/codegridpro"
                  target="_blank"
                  rel="noopener noreferrer"
                >Gumroad</a>
                <a
                  href="https://www.youtube.com/@codegrid"
                  target="_blank"
                  rel="noopener noreferrer"
                >YouTube</a>
              </div>
            </div>
          </div>

          <div className="footer-row">
            <p className="type-mono">MWT 19 Februaty '26</p>
            <p className="type-mono">[ Engineered by clavik ]</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
