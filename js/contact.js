import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// configuration
const CONFIG = {
  iconCount: 10,
  cloneCount: 10,
  gapMin: 1,
  gapMax: 10,
  rowThreshold: 25,
  mobileBreakpoint: 1000,
};

let currentIconIndex = 1;
let lastCenteredRow = null;
let gapScrollTriggers = [];
let isMobile = window.innerWidth < CONFIG.mobileBreakpoint;
let clockInterval = null;
let centerRowScrollHandler = null;

// initialization
document.addEventListener("DOMContentLoaded", () => {
  const contactVisual = document.querySelector(".contact-visual");
  const contactVisualIcon = document.querySelector(".contact-visual-icon img");
  const contactInfo = document.querySelector(".contact-info");
  if (!contactVisual || !contactVisualIcon || !contactInfo) return;

  updateClocks();
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClocks, 1000);

  rebuildContactRows(contactInfo, contactVisual, contactVisualIcon);

  waitForLenis(() => {
    initGapAnimations(contactVisual);
    trackCenterRow(contactVisualIcon);
  });

  window.addEventListener("resize", () => handleResize(contactVisual));
  window.addEventListener("contact:rows-updated", () => {
    window.requestAnimationFrame(() => {
      rebuildContactRows(contactInfo, contactVisual, contactVisualIcon);
    });
  });
});

// clock - updates all contact clocks with EST time
function getESTTime() {
  const now = new Date();
  const estTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const hours = String(estTime.getHours()).padStart(2, "0");
  const minutes = String(estTime.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} EST`;
}

function updateClocks() {
  const timeString = getESTTime();
  document.querySelectorAll(".contact-clock").forEach((clock) => {
    clock.textContent = timeString;
  });
}

// clone contact info rows for infinite scroll
function createClones(contactInfo) {
  if (!contactInfo) return;
  const sourceRows = Array.from(
    contactInfo.querySelectorAll(".contact-info-row[data-contact-source='true']"),
  );

  for (let i = 0; i < CONFIG.cloneCount; i++) {
    const clone = contactInfo.cloneNode(false);
    clone.dataset.contactClone = "true";
    sourceRows.forEach((row) => {
      clone.appendChild(row.cloneNode(true));
    });
    contactInfo.parentElement.appendChild(clone);
  }
}

function removeClones(contactInfo) {
  contactInfo?.parentElement
    ?.querySelectorAll(".contact-info[data-contact-clone='true']")
    .forEach((clone) => clone.remove());
}

function rebuildContactRows(contactInfo, contactVisual, contactVisualIcon) {
  removeClones(contactInfo);
  createClones(contactInfo);
  updateClocks();
  lastCenteredRow = null;

  if (window.lenis) {
    initGapAnimations(contactVisual);
    trackCenterRow(contactVisualIcon);
    ScrollTrigger.refresh();
  }
}

// icon cycling - changes icon when new row enters center
function changeIcon(contactVisualIcon) {
  currentIconIndex = (currentIconIndex % CONFIG.iconCount) + 1;
  contactVisualIcon.src = `/contact/icon_${currentIconIndex}.svg`;
}

function trackCenterRow(contactVisualIcon) {
  if (!window.lenis || !contactVisualIcon) return;

  if (centerRowScrollHandler && typeof window.lenis.off === "function") {
    window.lenis.off("scroll", centerRowScrollHandler);
  }

  centerRowScrollHandler = () => {
    const viewportCenter = window.innerHeight / 2;
    const rows = document.querySelectorAll(".contact-info-row");

    let closestRow = null;
    let minDistance = Infinity;

    rows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(rowCenter - viewportCenter);

      if (distance < minDistance && distance < CONFIG.rowThreshold) {
        minDistance = distance;
        closestRow = row;
      }
    });

    if (closestRow && closestRow !== lastCenteredRow) {
      lastCenteredRow = closestRow;
      changeIcon(contactVisualIcon);
    }
  };

  window.lenis.on("scroll", centerRowScrollHandler);
}

// gap animations - expand/collapse rows as they pass visual center
function getVisualCenter(contactVisual) {
  return contactVisual.offsetTop + contactVisual.offsetHeight / 2;
}

function resetRowGaps() {
  document.querySelectorAll(".contact-info-row").forEach((row) => {
    row.style.gap = `${CONFIG.gapMin}rem`;
  });
}

function killGapAnimations() {
  gapScrollTriggers.forEach((trigger) => trigger.kill());
  gapScrollTriggers = [];
  resetRowGaps();
}

function initGapAnimations(contactVisual) {
  killGapAnimations();

  if (isMobile || !contactVisual) return;

  const visualCenter = getVisualCenter(contactVisual);

  document.querySelectorAll(".contact-info-row").forEach((row) => {
    const expandTrigger = ScrollTrigger.create({
      trigger: row,
      start: () => `top+=${visualCenter - 550} center`,
      end: () => `top+=${visualCenter - 450} center`,
      scrub: true,
      onUpdate: (self) => {
        const currentGap =
          CONFIG.gapMin + (CONFIG.gapMax - CONFIG.gapMin) * self.progress;
        row.style.gap = `${currentGap}rem`;
      },
    });

    const collapseTrigger = ScrollTrigger.create({
      trigger: row,
      start: () => `top+=${visualCenter - 400} center`,
      end: () => `top+=${visualCenter - 300} center`,
      scrub: true,
      onUpdate: (self) => {
        const currentGap =
          CONFIG.gapMax - (CONFIG.gapMax - CONFIG.gapMin) * self.progress;
        row.style.gap = `${currentGap}rem`;
      },
    });

    gapScrollTriggers.push(expandTrigger, collapseTrigger);
  });
}

// resize handler - reinit gap animations on breakpoint change
function handleResize(contactVisual) {
  const wasMobile = isMobile;
  isMobile = window.innerWidth < CONFIG.mobileBreakpoint;

  if (wasMobile !== isMobile) {
    initGapAnimations(contactVisual);
  }
}

// wait for Lenis to be available and enable infinite scroll
function waitForLenis(callback) {
  const checkLenis = setInterval(() => {
    if (window.lenis) {
      clearInterval(checkLenis);
      window.lenis.options.infinite = true;
      callback();
    }
  }, 100);
}
