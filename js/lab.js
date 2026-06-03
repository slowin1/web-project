import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const labHero = document.querySelector(".lab-hero");
const revealer = document.querySelector(".lab-about-revealer");
const overlay = document.querySelector(".lab-hero-overlay");

if (labHero && revealer && overlay) {
  const scrollTriggerConfig = {
    trigger: labHero,
    start: "top top",
    end: "150% top",
    scrub: true,
  };

  // revealer - clip path animates to reveal about section
  gsap.to(revealer, {
    clipPath: "polygon(0% 100%, 100% 100%, 100% -25%, 0% 0%)",
    ease: "none",
    scrollTrigger: scrollTriggerConfig,
  });

  // overlay - fades in as hero scrolls
  gsap.to(overlay, {
    opacity: 1,
    ease: "none",
    scrollTrigger: scrollTriggerConfig,
  });
}
