const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const TRACK_COOLDOWN_MS = 30_000;
const DEFAULT_SOURCE = "direct";
const DEFAULT_DEVICE = "desktop";
const DEFAULT_ROLE = "guest";

const PAGE_CODES = {
  "/": 1,
  "/work": 2,
  "/project": 3,
  "/lab": 5,
  "/contact": 6,
  "/login": 7,
  "/register": 8,
  "/profile": 9,
  "/admin": 10,
};

const SOURCE_CODES = {
  direct: 1,
  internal: 2,
  organic: 3,
  social: 4,
  referral: 5,
};

const DEVICE_CODES = {
  desktop: 1,
  mobile: 2,
  tablet: 3,
};

export const ANALYTICS_CODE_LOOKUP = {
  pages: Object.fromEntries(Object.entries(PAGE_CODES).map(([key, value]) => [value, key])),
  sources: Object.fromEntries(Object.entries(SOURCE_CODES).map(([key, value]) => [value, key])),
  devices: Object.fromEntries(Object.entries(DEVICE_CODES).map(([key, value]) => [value, key])),
};

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getVisitorId() {
  const storageKey = "analyticsVisitorId";
  const existingId = localStorage.getItem(storageKey);
  if (existingId) return existingId;

  const nextId = crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  localStorage.setItem(storageKey, nextId);
  return nextId;
}

function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const role = user?.role ?? user?.Role;
    if (role === 4 || role === "4" || String(role).toLowerCase() === "admin") return "admin";
    if (role !== undefined && role !== null) return "user";
  } catch {
    // ignore malformed localStorage
  }

  return "guest";
}

function visitorIdToIp(visitorId, role) {
  const hash = hashString(`${role}:${visitorId}`);
  const second = ((hash >> 16) & 255) || 1;
  const third = ((hash >> 8) & 255) || 1;
  const fourth = (hash & 255) || 1;
  return `10.${second}.${third}.${fourth}`;
}

function normalizePath(pathname) {
  const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path.startsWith("/project/")) return "/project/article";
  if (path.startsWith("/work/")) return "/work/service";
  if (path.startsWith("/lab/")) return "/lab/detail";
  return path;
}

function getPageCode(pathname) {
  const normalizedPath = normalizePath(pathname);
  if (normalizedPath === "/project/article") return 4;
  if (normalizedPath === "/work/service") return 11;
  if (normalizedPath === "/lab/detail") return 12;
  return PAGE_CODES[normalizedPath] || 250;
}

function getDeviceType() {
  const width = window.innerWidth || 0;
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}

function getSourceType() {
  const referrer = document.referrer;
  if (!referrer) return "direct";

  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.origin === window.location.origin) return "internal";
    if (/google|yandex|bing|duckduckgo/i.test(referrerUrl.hostname)) return "organic";
    if (/instagram|facebook|twitter|x\.com|tiktok|youtube/i.test(referrerUrl.hostname)) {
      return "social";
    }
    return "referral";
  } catch {
    return "referral";
  }
}

function analyticsIpForPage(pathname) {
  const pageCode = getPageCode(pathname);
  const sourceCode = SOURCE_CODES[getSourceType()] || SOURCE_CODES.direct;
  const deviceCode = DEVICE_CODES[getDeviceType()] || DEVICE_CODES.desktop;
  return `172.${16 + sourceCode}.${pageCode}.${deviceCode}`;
}

export function decodeAnalyticsLog(log = {}) {
  if (log.pagePath || log.source || log.device || log.role) {
    return {
      page: log.pagePath || "unknown",
      source: log.source || DEFAULT_SOURCE,
      device: log.device || DEFAULT_DEVICE,
      role: log.role || DEFAULT_ROLE,
      visitorId: log.visitorId || "",
    };
  }

  const legacy = decodeAnalyticsLoginIp(log.loginIp);
  return {
    ...legacy,
    role: DEFAULT_ROLE,
    visitorId: "",
  };
}

export function decodeAnalyticsLoginIp(loginIp = "") {
  const parts = String(loginIp).split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts[0] !== 172) {
    return {
      page: "unknown",
      source: "direct",
      device: "desktop",
    };
  }

  const [, sourceSegment, pageCode, deviceCode] = parts;
  return {
    page: ANALYTICS_CODE_LOOKUP.pages[pageCode] || "other",
    source: ANALYTICS_CODE_LOOKUP.sources[sourceSegment - 16] || "direct",
    device: ANALYTICS_CODE_LOOKUP.devices[deviceCode] || "desktop",
  };
}

let activeVisit = null;

function getVisitPayload(pathname) {
  const role = getUserRole();
  const visitorId = getVisitorId();
  const normalizedPath = normalizePath(pathname);

  return {
    userIp: visitorIdToIp(visitorId, role),
    loginIp: analyticsIpForPage(pathname),
    visitorId,
    pagePath: normalizedPath,
    source: getSourceType(),
    device: getDeviceType(),
    role,
    sessionDurationSeconds: 0,
  };
}

function updateVisitDurationPayload(visit) {
  const logoutAt = new Date();
  const durationSeconds = Math.max(1, Math.round((logoutAt.getTime() - visit.startedAt) / 1000));

  return {
    ...visit.payload,
    logoutDataTime: logoutAt.toISOString(),
    sessionDurationSeconds: durationSeconds,
  };
}

function sendVisitUpdate(visit) {
  if (!visit?.id) return;

  const payload = updateVisitDurationPayload(visit);
  fetch(`${API_BASE_URL}/LoginLogs/${visit.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((error) => {
    console.warn("Analytics visit update failed:", error);
  });
}

export function finalizeActiveVisit() {
  sendVisitUpdate(activeVisit);
  activeVisit = null;
}

export async function trackPageVisit(pathname) {
  if (pathname.toLowerCase().startsWith("/admin")) {
    finalizeActiveVisit();
    return;
  }

  const normalizedPath = normalizePath(pathname);
  const cooldownKey = `analytics:last:${normalizedPath}`;
  const lastTracked = Number(sessionStorage.getItem(cooldownKey) || 0);

  if (Date.now() - lastTracked < TRACK_COOLDOWN_MS) return;

  finalizeActiveVisit();
  sessionStorage.setItem(cooldownKey, String(Date.now()));

  const payload = getVisitPayload(pathname);

  try {
    const response = await fetch(`${API_BASE_URL}/LoginLogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    const contentType = response.headers.get("content-type") || "";
    const createdLog = contentType.includes("application/json")
      ? await response.json()
      : null;
    activeVisit = {
      id: createdLog?.id,
      startedAt: Date.now(),
      payload,
    };
  } catch (error) {
    console.warn("Analytics visit tracking failed:", error);
  }
}

window.addEventListener("pagehide", finalizeActiveVisit);
