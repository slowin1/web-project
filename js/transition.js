import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let blocks = [];
let isTransitioning = false;
let isLinkHandlerAttached = false;

// initialization
document.addEventListener("DOMContentLoaded", init);

function normalizePath(pathname) {
  const withoutTrailingSlash = pathname.replace(/\/+$/, "") || "/";
  const withoutHtml = withoutTrailingSlash.replace(/\.html$/, "");

  if (withoutHtml === "/index") return "/";
  return withoutHtml || "/";
}

function toInternalPath(href) {
  if (!href) return null;

  const trimmedHref = href.trim();
  if (
    !trimmedHref ||
    trimmedHref.startsWith("#") ||
    trimmedHref.startsWith("mailto:") ||
    trimmedHref.startsWith("tel:") ||
    trimmedHref.startsWith("javascript:")
  ) {
    return null;
  }

  try {
    const url = new URL(trimmedHref, window.location.origin);
    if (url.origin !== window.location.origin) return null;

    const normalizedPath = normalizePath(url.pathname);
    return `${normalizedPath}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function isSamePage(targetPath) {
  if (!targetPath) return true;

  try {
    const targetUrl = new URL(targetPath, window.location.origin);
    const currentPath = normalizePath(window.location.pathname);
    const currentSearch = window.location.search || "";
    const currentHash = window.location.hash || "";

    const targetNormalizedPath = normalizePath(targetUrl.pathname);
    const targetSearch = targetUrl.search || "";
    const targetHash = targetUrl.hash || "";

    return (
      currentPath === targetNormalizedPath &&
      currentSearch === targetSearch &&
      currentHash === targetHash
    );
  } catch {
    return false;
  }
}

function init() {
  const transitionGrid = document.querySelector(".transition-grid");
  if (!transitionGrid) return;

  isTransitioning = false;

  const isPageNavigation = sessionStorage.getItem("pageTransition") === "true";
  const blockElements = Array.from(
    transitionGrid.querySelectorAll(".transition-block"),
  );
  blocks = blockElements.map((block) => ({ element: block }));

  if (isPageNavigation) {
    sessionStorage.removeItem("pageTransition");
    const style = document.querySelector("style[data-transition]");
    if (style) style.remove();

    gsap.set(blockElements, { opacity: 1 });
    setTimeout(() => {
      transitionGrid.style.backgroundColor = "";
      reveal();
    }, 300);
  } else {
    gsap.set(blockElements, { opacity: 0 });
  }

  setupLinkHandlers();
}

// animate blocks to cover screen before navigation
function animateOut() {
  return new Promise((resolve) => {
    const blockElements = blocks.map((b) => b.element);
    const transitionGrid = document.querySelector(".transition-grid");

    if (!blockElements.length || !transitionGrid) {
      setTimeout(() => resolve(), 100);
      return;
    }

    transitionGrid.style.pointerEvents = "auto";
    transitionGrid.style.zIndex = "1000";

    gsap.set(blockElements, { opacity: 0 });

    const shuffled = [...blockElements].sort(() => Math.random() - 0.5);

    shuffled.forEach((block, index) => {
      gsap.to(block, {
        opacity: 1,
        duration: 0.075,
        ease: "power2.inOut",
        delay: index * 0.025,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          gsap.set(block, { opacity: 1 });
          if (index === shuffled.length - 1) {
            setTimeout(() => resolve(), 300);
          }
        },
      });
    });
  });
}

// reveal page by animating blocks away
function reveal() {
  const blockElements = blocks.map((b) => b.element);
  if (blockElements.length === 0) return;

  const transitionGrid = document.querySelector(".transition-grid");
  const shuffled = [...blockElements].sort(() => Math.random() - 0.5);

  shuffled.forEach((block, index) => {
    gsap.to(block, {
      opacity: 0,
      duration: 0.075,
      ease: "power2.inOut",
      delay: index * 0.025,
      repeat: 1,
      yoyo: true,
      onComplete: () => {
        gsap.set(block, { opacity: 0 });
        if (index === shuffled.length - 1) {
          if (transitionGrid) transitionGrid.style.pointerEvents = "none";
          ScrollTrigger.refresh();
        }
      },
    });
  });
}

function handleLinkClick(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  if (isTransitioning) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const link = event.target.closest("a");
  if (!link) return;

  if (link.target === "_blank" || link.hasAttribute("download")) return;

  const href = link.getAttribute("href");
  const targetPath = toInternalPath(href);
  if (!targetPath) return;

  if (isSamePage(targetPath)) {
    event.preventDefault();
    event.stopPropagation();

    if (link.classList.contains("menu-segment")) {
      const toggleMenu = window.toggleMenu;
      if (toggleMenu && typeof toggleMenu === "function") toggleMenu();
    }
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  isTransitioning = true;

  const transitionGrid = document.querySelector(".transition-grid");
  if (transitionGrid) transitionGrid.style.pointerEvents = "auto";

  sessionStorage.setItem("pageTransition", "true");

  animateOut()
    .then(() => {
      window.location.href = href;
    })
    .catch(() => {
      window.location.href = href;
    });
}

// click handler for internal navigation
function setupLinkHandlers() {
  if (isLinkHandlerAttached) return;

  document.addEventListener("click", handleLinkClick, {
    capture: true,
    passive: false,
  });

  isLinkHandlerAttached = true;
}
