import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { trackPageVisit } from "./api/analyticsTracker";
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const LabPage = React.lazy(() => import("./pages/LabPage"));
const UnitPage = React.lazy(() => import("./pages/UnitPage"));
const SpecialistPage = React.lazy(() => import("./pages/SpecialistPage"));
const ProjectPage = React.lazy(() => import("./pages/ProjectPage"));
const ProjectArticlePage = React.lazy(() => import("./pages/ProjectArticlePage"));
const WorkPage = React.lazy(() => import("./pages/WorkPage"));
const WorkPages = React.lazy(() => import("./pages/WorkPages"));
const LogIn = React.lazy(() => import("./pages/LogIn"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const SpecialistProfile = React.lazy(() => import("./pages/SpecialistProfile"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const Register = React.lazy(() => import("./pages/Register"));
const AdminLayout = React.lazy(() => import("./components/Admin/AdminLayout"));
const AdminContent = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminContent })),
);
const AdminDashboard = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminDashboard })),
);
const AdminSettings = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminSettings })),
);
const AdminServices = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminServices })),
);
const AdminUsers = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminUsers })),
);


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
];

const UNIT_MODULES = [
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
];

const WORK_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/work.js",
];

const PROJECT_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
];

const PROJECT_DETAIL_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/project.js",
];

const CONTACT_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
  "/js/contact.js",
];

const LOG_IN_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
];

const PROFILE_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
];

const ADMIN_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
];

const FORGOT_PASSWORD_MODULES = [
  "/js/lenis-scroll.js",
  "/js/transition.js",
  "/js/nav.js",
  "/js/menu.js",
  "/js/animated-copy.js",
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
  const moduleLoaders = {
    "/js/preloader.js": () => import("../js/preloader.js"),
    "/js/lenis-scroll.js": () => import("../js/lenis-scroll.js"),
    "/js/transition.js": () => import("../js/transition.js"),
    "/js/nav.js": () => import("../js/nav.js"),
    "/js/menu.js": () => import("../js/menu.js"),
    "/js/animated-copy.js": () => import("../js/animated-copy.js"),
    "/js/skyline.js": () => import("../js/skyline.js"),
    "/js/lab.js": () => import("../js/lab.js"),
    "/js/particle-visual.js": () => import("../js/particle-visual.js"),
    "/js/pie-transition.js": () => import("../js/pie-transition.js"),
    "/js/stats.js": () => import("../js/stats.js"),
    "/js/clients.js": () => import("../js/clients.js"),
    "/js/work.js": () => import("../js/work.js"),
    "/js/project.js": () => import("../js/project.js"),
    "/js/contact.js": () => import("../js/contact.js"),
  };

  for (const modulePath of modulePaths) {
    const loadModule = moduleLoaders[modulePath];
    if (loadModule) {
      await loadModule();
    }
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

function RoutedPage({
  component: Component,
  title,
  modulePaths,
  clearOverflow,
}) {
  usePageRuntime({ title, modulePaths, clearOverflow });

  return <Component />;
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function isAdminSession() {
  const token = localStorage.getItem("authToken") || localStorage.getItem("adminToken");
  const user = getStoredUser();
  if (!token) return false;

  // Check role from stored user (prefer role claim)
  if (user?.role !== undefined && user?.role !== null) {
    const r = String(user.role).toLowerCase();
    if (r === "4" || r === "admin") return true;
  }

  // Fallback: check by username (admin user)
  if (user?.userName?.toLowerCase() === "admin") return true;

  // Fallback: parse role claim from JWT
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);

    const roleClaim = payload?.role ?? payload?.Role;
    if (roleClaim === 4 || roleClaim === "4") return true;
    if (typeof roleClaim === "string" && roleClaim.toLowerCase() === "admin") return true;
  } catch (e) {
    // ignore
  }

  return false;
}

function isSpecialistSession() {
  const token = localStorage.getItem("authToken") || localStorage.getItem("adminToken");
  const user = getStoredUser();
  if (!token) return false;

  if (user?.role !== undefined && user?.role !== null) {
    const r = String(user.role).toLowerCase();
    if (r === "2" || r === "specialist") return true;
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    const roleClaim = payload?.role ?? payload?.Role;
    if (roleClaim === 2 || roleClaim === "2") return true;
    if (typeof roleClaim === "string" && roleClaim.toLowerCase() === "specialist") return true;
  } catch (e) {
    // ignore
  }

  return false;
}


function AdminRoute() {
  if (!isAdminSession()) {
    return <Navigate to="/LogIn" replace />;
  }

  return <AdminRuntime />;
}

function SpecialistRoute() {
  if (!isSpecialistSession()) {
    return <Navigate to="/LogIn" replace />;
  }

  return (
    <Layout>
      <RoutedPage
        title="Specialist Profile"
        modulePaths={PROFILE_MODULES}
        component={SpecialistProfile}
        clearOverflow
      />
    </Layout>
  );
}

function AdminRuntime() {
  usePageRuntime({
    title: "Admin",
    modulePaths: ADMIN_MODULES,
    clearOverflow: true,
  });

  return (
    <Layout>
      <AdminLayout />
    </Layout>
  );
}

function AnalyticsRuntime() {
  const location = useLocation();

  useEffect(() => {
    trackPageVisit(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
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

    // Theme colors are handled by CSS variables
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
              [ Engineered by Славик Нагорянский ]
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
      <AnalyticsRuntime />
      <Suspense fallback={null}>
        <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {/* If admin: send to /admin to avoid profile/admin route conflicts */}
              {isAdminSession() ? (
                <Navigate to="/admin" replace />
              ) : isSpecialistSession() ? (
                <Navigate to="/specialist-profile" replace />
              ) : (
                <HomePage />
              )}
            </Layout>
          }
        />


        <Route
          path="/index"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/index.html"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
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
          path="/lab/specialists"
          element={
            <Layout>
              <RoutedPage
                title="Specialists"
                modulePaths={LAB_MODULES}
                component={SpecialistPage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/lab/:id"
          element={
            <Layout>
              <RoutedPage
                title="Service Details"
                modulePaths={UNIT_MODULES}
                component={UnitPage}
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
          path="/project/:slug"
          element={
            <Layout>
              <RoutedPage
                title="Article"
                modulePaths={PROJECT_MODULES}
                component={ProjectArticlePage}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <Layout>
              <RoutedPage
                title="Service"
                modulePaths={PROJECT_DETAIL_MODULES}
                component={WorkPages}
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
          path="/LogIn"
          element={
            <Layout>
              <RoutedPage
                title="Log In"
                modulePaths={LOG_IN_MODULES}
                component={LogIn}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              {isSpecialistSession() ? (
                <Navigate to="/specialist-profile" replace />
              ) : (
                <RoutedPage
                  title="Profile"
                  modulePaths={PROFILE_MODULES}
                  component={ProfilePage}
                  clearOverflow
                />
              )}
            </Layout>
          }
        />
        <Route path="/specialist-profile" element={<SpecialistRoute />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route
          path="/forgot-password"
          element={
            <Layout>
              <RoutedPage
                title="ForgotPassword"
                modulePaths={FORGOT_PASSWORD_MODULES}
                component={ForgotPassword}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route
          path="/Register"
          element={
            <Layout>
              <RoutedPage
                title="Register"
                modulePaths={LOG_IN_MODULES}
                component={Register}
                clearOverflow
              />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>{" "}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
