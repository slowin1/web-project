import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAdminText } from "./adminI18n";

const NAV_ITEMS = [
  { to: "/admin/dashboard", key: "dashboard", icon: "DB" },
  { to: "/admin/users", key: "users", icon: "US" },
  { to: "/admin/content", key: "content", icon: "CT" },
  { to: "/admin/services", key: "services", icon: "SV" },
  { to: "/admin/settings", key: "settings", icon: "ST" },
];

export default function AdminLayout() {
  const location = useLocation();
  const { t } = useAdminText();

  return (
    <div className="admin-page">
      <div className="admin-content">
        <div className="admin-title">
          <div>
            <p className="admin-kicker">{t.layout.product}</p>
            <h2>{t.layout.title}</h2>
          </div>
          <div className="admin-topbar">
            <div className="admin-status">
              <span className="admin-status-dot" />
              {t.layout.connected}
            </div>
            <div className="admin-user">
              <span className="admin-name">{t.layout.admin}</span>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </div>

        <div className="admin-flex-container">
          <aside className="admin-sidebar" aria-label="Admin navigation">
            <div className="admin-brand-card">
              <div className="admin-brand-mark">MS</div>
              <div>
                <div className="admin-brand-title">{t.layout.room}</div>
                <div className="admin-brand-subtitle">{t.layout.workspace}</div>
              </div>
            </div>
            <div className="admin-sidebar-label">{t.layout.navigation}</div>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    end={item.to === "/admin/dashboard"}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-copy">
                      <span className="menu-label">{t.layout.nav[item.key][0]}</span>
                      <span className="menu-caption">{t.layout.nav[item.key][1]}</span>
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>

          <main className="admin-main-content" data-route={location.pathname}>
            <div className="admin-window-bar" aria-hidden="true">
              <div className="admin-window-title">{t.layout.window}</div>
              <div className="admin-window-pill">{t.layout.live}</div>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
