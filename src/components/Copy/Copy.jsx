import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Copy({ children, animateOnScroll = true, delay = 0 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!animateOnScroll) return;

    const element = containerRef.current;
    if (!element) return;

    const words = element.querySelectorAll(".word");
    
    gsap.fromTo(
      words,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [animateOnScroll, delay]);

  return (
    <div ref={containerRef} className="copy-container">
      {children}
    </div>
  );
}
