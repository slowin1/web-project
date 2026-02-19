import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContactPage from "./pages/ContactPage";
import LabPage from "./pages/LabPage";
import ProjectPage from "./pages/ProjectPage";
import WorkPage from "./pages/WorkPage";
import Layout from "./components/Layout";


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
  const modulesLoadedRef = React.useRef(false);

  useEffect(() => {
    document.title = "Массажка";
    
    if (!modulesLoadedRef.current) {
      modulesLoadedRef.current = true;
      loadPageModules(HOME_MODULES)
        .then(() => {
          document.dispatchEvent(new Event("DOMContentLoaded"));
        })
        .catch((error) => {
          console.error("Failed to initialize home modules", error);
        });
    }

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
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/index" element={<Layout><HomePage /></Layout>} />
        <Route path="/index.html" element={<Layout><HomePage /></Layout>} />
        <Route
          path="/lab"
          element={
            <Layout>
              <RoutedPage
                title="Lab"
                modulePaths={LAB_MODULES}
                component={LabPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/lab.html"
          element={
            <Layout>
              <RoutedPage
                title="Lab"
                modulePaths={LAB_MODULES}
                component={LabPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/work"
          element={
            <Layout>
              <RoutedPage
                title="Work"
                modulePaths={WORK_MODULES}
                component={WorkPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/work.html"
          element={
            <Layout>
              <RoutedPage
                title="Work"
                modulePaths={WORK_MODULES}
                component={WorkPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/project"
          element={
            <Layout>
              <RoutedPage
                title="Project"
                modulePaths={PROJECT_MODULES}
                component={ProjectPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/project.html"
          element={
            <Layout>
              <RoutedPage
                title="Project"
                modulePaths={PROJECT_MODULES}
                component={ProjectPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <RoutedPage
                title="Contact"
                modulePaths={CONTACT_MODULES}
                component={ContactPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/contact.html"
          element={
            <Layout>
              <RoutedPage
                title="Contact"
                modulePaths={CONTACT_MODULES}
                component={ContactPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
