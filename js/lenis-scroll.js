import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis = null;
let lenisTicker = null;

// initialization
document.addEventListener("DOMContentLoaded", () => initLenisScroll());

// smooth scroll setup with responsive config
function initLenisScroll() {
  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
  }

  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  const isMobile = window.innerWidth <= 1000;

  lenis = new Lenis({
    duration: isMobile ? 0.8 : 1.2,
    lerp: isMobile ? 0.075 : 0.1,
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: isMobile ? 1.5 : 2,
  });

  lenis.on("scroll", ScrollTrigger.update);
  lenisTicker = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);

  window.lenis = lenis;
}

export { lenis };
