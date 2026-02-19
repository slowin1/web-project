import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContactPage from "./pages/ContactPage";
import LabPage from "./pages/LabPage";
import ProjectPage from "./pages/ProjectPage";
import WorkPage from "./pages/WorkPage";

const HOME_MODULES = [
  "/js/preloader.js",
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/skyline.js",
];

const LAB_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/lab.js",
  "/js/particle-visual.js",
  "/js/pie-transition.js",
  "/js/stats.js",
  "/js/clients.js",
  "/js/footer.js",
];

const WORK_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/work.js",
  "/js/footer.js",
];

const PROJECT_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/project.js",
  "/js/footer.js",
];

const CONTACT_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/contact.js",
];

function applyTransitionState() {
  if (sessionStorage.getItem("pageTransition") !== "true") return;

  const grid = document.querySelector(".transition-grid");
  if (!grid) return;

  grid.style.backgroundColor = "var(--bg)";
  grid.style.zIndex = "1000";
  grid.style.pointerEvents = "auto";

  const blocks = grid.querySelectorAll(".transition-block");
  blocks.forEach((block) => {
    block.style.opacity = "1";
  });
}

async function loadPageModules(modulePaths) {
  for (const modulePath of modulePaths) {
    await import(/* @vite-ignore */ modulePath);
  }
}

function usePageRuntime({ title, modulePaths, clearOverflow = false }) {
  useEffect(() => {
    document.title = title;

    if (clearOverflow) {
      document.documentElement.style.overflow = "";
    }

    applyTransitionState();

    let isCancelled = false;

    loadPageModules(modulePaths)
      .then(() => {
        if (isCancelled) return;
        document.dispatchEvent(new Event("DOMContentLoaded"));
      })
      .catch((error) => {
        console.error("Failed to initialize page modules", error);
      });

    return () => {
      isCancelled = true;
    };
  }, [clearOverflow, modulePaths, title]);
}

function RoutedPage({ component: Component, title, modulePaths, clearOverflow }) {
  usePageRuntime({ title, modulePaths, clearOverflow });

  return <Component />;
}

function HomePage() {
  usePageRuntime({
    title: "Массажка",
    modulePaths: HOME_MODULES,
  });

  useEffect(() => {
    const root = document.documentElement;
    const previousBg = getComputedStyle(root).getPropertyValue("--bg").trim();
    root.style.setProperty("--bg", "#C8CFC8");

    return () => {
      if (previousBg) {
        root.style.setProperty("--bg", previousBg);
      } else {
        root.style.removeProperty("--bg");
      }
    };
  }, []);

  return (
    <>
      <div className="preloader">
        <div className="preloader-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="preloader-block" key={`preloader-${i}`} />
          ))}
        </div>

        <div className="progress-bar">
          <div className="progress-bar-indicator" />

          <div className="progress-bar-copy">
            <p className="type-mono">
              &#9654; Loading - <span>0%</span>
            </p>
            <p className="type-mono">Deadspace Labs Booting</p>
          </div>
        </div>
      </div>

      <div className="transition-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="transition-block" key={`transition-${i}`} />
        ))}
      </div>

      <nav>
        <div className="container">
          <div className="nav-clock">
            <p className="type-mono">
              18 <span>:</span> 25 EST
            </p>
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
              <ion-icon name="triangle-sharp" /> Chishinau, MD
            </p>
          </div>
        </div>
      </nav>

      <div className="menu-toggle-btn">
        <div className="hamburger-bar" />
        <div className="hamburger-bar" />
      </div>

      <div className="menu-overlay">
        <div className="menu-bg">
          <canvas id="menu-canvas" />
        </div>

        <div className="menu-overlay-nav">
          <div className="close-btn">
            <div className="close-btn-bar" />
            <div className="close-btn-bar" />
          </div>

          <div className="menu-overlay-items">
            <a
              className="type-mono"
              href="https://www.instagram.com/clavik_nagoreanskii/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              className="type-mono"
              href="https://x.com/codegridweb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="menu-overlay-footer">
          <a className="type-mono" href="/lab">
            Lab Access
          </a>
          <a className="type-mono" href="/contact">
            Get in Touch
          </a>
        </div>

        <div className="circular-menu">
          <div className="joystick">
            <ion-icon name="grid-sharp" className="center-icon center-main" />
            <ion-icon name="chevron-up-sharp" className="center-icon center-up" />
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

      <section className="hero">
        <canvas id="skyline" />

        <h1
          data-animate-variant="diffuse"
          data-animate-on-scroll="false"
          data-animate-delay="0.1"
        >
          Massage Salon
        </h1>
        <p
          data-animate-variant="slide"
          data-animate-type="words"
          data-animate-on-scroll="false"
          data-animate-delay="0.75"
        >
          Chishinau's premier destination for relaxation and rejuvenation.
        </p>

        <div className="hero-footer">
          <div className="container">
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="false"
              data-animate-delay="1"
            >
              MWT 19 february '26
            </p>
            <p
              className="type-mono"
              data-animate-variant="flicker"
              data-animate-on-scroll="false"
              data-animate-delay="1"
            >
              [ Engineered by clavik ]
            </p>
          </div>
        </div>
      </section>

      <svg
        viewBox="0 0 0 0"
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="blur-matrix" x="-50%" y="-50%" width="200%" height="200%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route
          path="/lab"
          element={
            <RoutedPage
              title="Lab"
              modulePaths={LAB_MODULES}
              component={LabPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/lab.html"
          element={
            <RoutedPage
              title="Lab"
              modulePaths={LAB_MODULES}
              component={LabPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/work"
          element={
            <RoutedPage
              title="Work"
              modulePaths={WORK_MODULES}
              component={WorkPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/work.html"
          element={
            <RoutedPage
              title="Work"
              modulePaths={WORK_MODULES}
              component={WorkPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/project"
          element={
            <RoutedPage
              title="Project"
              modulePaths={PROJECT_MODULES}
              component={ProjectPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/project.html"
          element={
            <RoutedPage
              title="Project"
              modulePaths={PROJECT_MODULES}
              component={ProjectPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/contact"
          element={
            <RoutedPage
              title="Contact"
              modulePaths={CONTACT_MODULES}
              component={ContactPage}
              clearOverflow
            />
          }
        />
        <Route
          path="/contact.html"
          element={
            <RoutedPage
              title="Contact"
              modulePaths={CONTACT_MODULES}
              component={ContactPage}
              clearOverflow
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
