import { useCallback, useEffect, useMemo, useState } from "react";
import { usersAPI } from "../../api/admin";
import { useAdminText } from "./adminI18n";

const ROLE_ORDER = ["Admin", "Specialist", "Client", "Guest"];
const ROLE_BY_VALUE = {
  1: "Client",
  2: "Specialist",
  3: "Guest",
  4: "Admin",
};
const ROLE_VALUE_BY_NAME = {
  Client: 1,
  Specialist: 2,
  Guest: 3,
  Admin: 4,
};

function normalizeRole(role) {
  if (role === null || role === undefined || role === "") return "";
  const numericRole = Number(role);
  if (Number.isInteger(numericRole) && ROLE_BY_VALUE[numericRole]) {
    return ROLE_BY_VALUE[numericRole];
  }
  if (Number.isInteger(numericRole)) {
    return "Client";
  }
  return String(role);
}

function roleToUserRole(role) {
  const r = normalizeRole(role);
  const found = ROLE_ORDER.find((x) => x.toLowerCase() === r.toLowerCase());
  return found || r;
}

function userRoleToApiValue(role) {
  const normalizedRole = roleToUserRole(role);
  return ROLE_VALUE_BY_NAME[normalizedRole] || ROLE_VALUE_BY_NAME.Client;
}

export default function UsersManager() {
  const { t } = useAdminText();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [details, setDetails] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await usersAPI.getAll();
      const list = Array.isArray(data) ? data : data?.data || [];
      setUsers(list);
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить пользователей.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!selectedUserId) {
      setDetails(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const u = await usersAPI.getById(selectedUserId);
        if (!cancelled) setDetails(u);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Не удалось загрузить данные пользователя.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedUserId]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId, users]);

  const refreshSingle = useCallback(async () => {
    if (!selectedUserId) return;
    const u = await usersAPI.getById(selectedUserId);
    setDetails(u);
    setUsers((prev) => prev.map((x) => (x.id === selectedUserId ? u : x)));
  }, [selectedUserId]);

  const toggleBan = async () => {
    if (!details) return;
    setSaving(true);
    setError("");
    try {
      const currentRole = roleToUserRole(details.role);
      const nextRole = currentRole.toLowerCase() === "guest" ? "Client" : "Guest";

      await usersAPI.updateRole(details.id, userRoleToApiValue(nextRole));
      await refreshSingle();
    } catch (e) {
      console.error(e);
      setError(`Не удалось изменить бан. ${e.message || ""}`.trim());
    } finally {
      setSaving(false);
    }
  };

  const setRole = async (nextRole) => {
    if (!details) return;
    setSaving(true);
    setError("");
    try {
      await usersAPI.updateRole(details.id, userRoleToApiValue(nextRole));
      await refreshSingle();
    } catch (e) {
      console.error(e);
      setError(`Не удалось изменить права. ${e.message || ""}`.trim());
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async () => {
    if (!details) return;
    if (!window.confirm("Удалить аккаунт пользователя?")) return;

    setSaving(true);
    setError("");
    try {
      await usersAPI.delete(details.id);
      setSelectedUserId(null);
      await loadUsers();
    } catch (e) {
      console.error(e);
      setError("Не удалось удалить аккаунт.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="loading-text">{t.users.loading}</p>;
  }

  return (
    <div className="admin-section users-manager">
      <div className="admin-header">
        <div>
          <p className="admin-panel-eyebrow">{t.users.eyebrow}</p>
          <h3>{t.users.title}</h3>
        </div>
        <button className="btn-secondary" onClick={loadUsers} type="button">
          {t.users.refresh}
        </button>
      </div>

      <div className="admin-mini-metrics">
        <div className="admin-mini-card">
          <span>{t.users.total}</span>
          <strong>{users.length}</strong>
        </div>
        <div className="admin-mini-card">
          <span>{t.users.admins}</span>
          <strong>{users.filter((user) => roleToUserRole(user.role).toLowerCase() === "admin").length}</strong>
        </div>
        <div className="admin-mini-card">
          <span>{t.users.restricted}</span>
          <strong>{users.filter((user) => roleToUserRole(user.role).toLowerCase() === "guest").length}</strong>
        </div>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="users-layout">
        <div className="users-list">
          <div className="admin-list-heading">{t.users.directory}</div>
          {users.length === 0 ? (
            <p className="admin-hint">{t.users.empty}</p>
          ) : (
            <ul className="users-ul">
              {users.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    className={`user-item ${u.id === selectedUserId ? "active" : ""}`}
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <div className="user-item-title">{u.firstName} {u.lastName}</div>
                    <div className="user-item-sub">
                      <span className="mono">@{u.userName}</span>
                    </div>
                    <div className="user-item-badges">
                      <span className="role-badge">{roleToUserRole(u.role)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="users-details">
          <div className="admin-list-heading">{t.users.details}</div>
          {!details ? (
            <p className="admin-hint">{t.users.select}</p>
          ) : (
            <div className="user-card">
              <div className="user-card-header">
                <div>
                  <h4>
                    {details.firstName} {details.lastName}
                  </h4>
                  <p className="muted">
                    <span className="mono">@{details.userName}</span>
                  </p>
                </div>
                <div className="user-card-id">#{details.id}</div>
              </div>

              <div className="user-card-grid">
                <div>
                  <div className="field-label">{t.users.email}</div>
                  <div className="field-value">{details.email}</div>
                </div>
                <div>
                  <div className="field-label">{t.users.phone}</div>
                  <div className="field-value">{details.phone}</div>
                </div>
                <div>
                  <div className="field-label">{t.users.registered}</div>
                  <div className="field-value">
                    {details.registeredOn
                      ? new Date(details.registeredOn).toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="field-label">{t.users.role}</div>
                  <div className="field-value">
                    <span className="role-badge">{roleToUserRole(details.role)}</span>
                  </div>
                </div>
              </div>

              <div className="user-actions">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={saving}
                  onClick={toggleBan}
                >
                  {roleToUserRole(details.role).toLowerCase() === "guest"
                    ? t.users.unban
                    : t.users.ban}
                </button>

                <div className="role-editor">
                  <label className="role-editor-label">{t.users.rights}</label>
                  <select
                    className="role-editor-select"
                    value={roleToUserRole(details.role)}
                    disabled={saving}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Client">Client</option>
                    <option value="Specialist">Specialist</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="btn-danger"
                  disabled={saving}
                  onClick={removeUser}
                >
                  {t.users.delete}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
