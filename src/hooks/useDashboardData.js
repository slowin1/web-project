import { useCallback, useEffect, useState } from "react";
import { decodeAnalyticsLog } from "../api/analyticsTracker";
import { bookingsAPI, loginLogsAPI } from "../api/admin";

const PERIOD_DAYS = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function isValidLogDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime()) && date.getFullYear() > 2001;
}

function normalizeLoginLog(log = {}) {
  return {
    id: log.id ?? log.Id,
    userIp: log.userIp ?? log.UserIp ?? "",
    loginIp: log.loginIp ?? log.LoginIp ?? "",
    loginDataTime: log.loginDataTime ?? log.LoginDataTime,
    logoutDataTime: log.logoutDataTime ?? log.LogoutDataTime,
    visitorId: log.visitorId ?? log.VisitorId ?? "",
    pagePath: log.pagePath ?? log.PagePath ?? "",
    source: log.source ?? log.Source ?? "",
    device: log.device ?? log.Device ?? "",
    role: log.role ?? log.Role ?? "",
    sessionDurationSeconds:
      log.sessionDurationSeconds ?? log.SessionDurationSeconds ?? null,
  };
}

function toLogArray(data) {
  if (Array.isArray(data)) return data.map(normalizeLoginLog);
  if (Array.isArray(data?.data)) return data.data.map(normalizeLoginLog);
  if (Array.isArray(data?.items)) return data.items.map(normalizeLoginLog);
  if (Array.isArray(data?.logs)) return data.logs.map(normalizeLoginLog);
  return [];
}

function toCompletedArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function getLogDate(log) {
  const rawDate =
    log.loginDataTime ||
    log.loginDateTime ||
    log.createdAt ||
    log.updatedAt;
  const date = rawDate ? new Date(rawDate) : null;
  return isValidLogDate(date) ? date : new Date();
}

function getSessionDuration(log) {
  const rawDuration = log.sessionDurationSeconds ?? log.SessionDurationSeconds;
  if (Number.isFinite(Number(rawDuration)) && Number(rawDuration) > 0) {
    return Number(rawDuration);
  }

  const start = getLogDate(log);
  const rawEnd = log.logoutDataTime || log.logoutDateTime || log.LogoutDataTime;
  const end = rawEnd ? new Date(rawEnd) : null;
  if (isValidLogDate(start) && isValidLogDate(end) && end > start) {
    return Math.round((end.getTime() - start.getTime()) / 1000);
  }

  return 0;
}

function formatDuration(seconds) {
  if (!seconds) return "0m";
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (minutes === 0) return `${restSeconds}s`;
  return `${minutes}m ${restSeconds}s`;
}

function getPeriodStart(period) {
  const days = PERIOD_DAYS[period] || PERIOD_DAYS["7d"];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return start;
}

function formatDay(date) {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

function getLocalDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createVisitorData(logs, period) {
  const days = PERIOD_DAYS[period] || PERIOD_DAYS["7d"];
  const start = getPeriodStart(period);
  const buckets = new Map();

  for (let index = 0; index < days; index += 1) {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const key = getLocalDayKey(day);
    buckets.set(key, {
      name: formatDay(day),
      visitors: 0,
      uniqueSet: new Set(),
    });
  }

  logs.forEach((log) => {
    const date = getLogDate(log);
    const key = getLocalDayKey(date);
    const bucket = buckets.get(key);
    if (!bucket) return;

    bucket.visitors += 1;
    if (log.userIp) bucket.uniqueSet.add(log.userIp);
  });

  return Array.from(buckets.values()).map((bucket) => ({
    name: bucket.name,
    visitors: bucket.visitors,
    unique: bucket.uniqueSet.size,
  }));
}

function createHourlyData(logs) {
  const hourLabels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  const buckets = hourLabels.map((time) => ({ time, visitors: 0 }));

  logs.forEach((log) => {
    const hour = getLogDate(log).getHours();
    const bucketIndex = Math.min(Math.floor(hour / 3), buckets.length - 1);
    buckets[bucketIndex].visitors += 1;
  });

  return buckets;
}

function titleCase(value) {
  return String(value || "unknown")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function createDeviceData(logs) {
  const counts = new Map();
  logs.forEach((log) => {
    const { device } = decodeAnalyticsLog(log);
    counts.set(device, (counts.get(device) || 0) + 1);
  });

  const total = Math.max(logs.length, 1);
  return Array.from(counts.entries()).map(([name, value]) => ({
    name: titleCase(name),
    value: Math.round((value / total) * 100),
  }));
}

function createTrafficSources(logs) {
  const counts = new Map();
  logs.forEach((log) => {
    const { source } = decodeAnalyticsLog(log);
    counts.set(source, (counts.get(source) || 0) + 1);
  });

  const total = Math.max(logs.length, 1);
  return Array.from(counts.entries()).map(([name, value]) => ({
    name: titleCase(name),
    value: Math.round((value / total) * 100),
  }));
}

function createPageData(logs) {
  const counts = new Map();
  logs.forEach((log) => {
    const { page } = decodeAnalyticsLog(log);
    counts.set(page, (counts.get(page) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function createRecentVisits(logs) {
  return [...logs]
    .sort((a, b) => getLogDate(b).getTime() - getLogDate(a).getTime())
    .slice(0, 8)
    .map((log) => {
      const meta = decodeAnalyticsLog(log);
      return {
        id: log.id,
        visitor: meta.role === "guest" ? "guest" : log.userIp || meta.visitorId || "unknown",
        page: meta.page,
        source: meta.source,
        device: meta.device,
        duration: getSessionDuration(log),
        date: getLogDate(log),
      };
    });
}

function formatPageName(page) {
  const names = {
    "/": "Home",
    "/work": "Work",
    "/project": "Project",
    "/project/article": "Article",
    "/lab": "Lab",
    "/contact": "Contact",
    "/login": "Login",
    "/register": "Register",
    "/profile": "Profile",
    "/admin": "Admin",
    "/work/service": "Service",
    "/lab/detail": "Service Detail",
    other: "Other",
    unknown: "Unknown",
  };

  return names[page] || titleCase(page);
}

export function formatAnalyticsPageName(page) {
  return formatPageName(page);
}

export function formatAnalyticsVisitTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function formatAnalyticsLabel(value) {
  return titleCase(value);
}

function decoratePageData(pageData) {
  return pageData.map((item) => ({
    ...item,
    label: formatPageName(item.name),
  }));
}

function calculateStats(logs) {
  const uniqueVisitors = new Set(
    logs.map((log) => log.visitorId || log.userIp).filter(Boolean),
  ).size;
  const durations = logs.map(getSessionDuration).filter((duration) => duration > 0);
  const averageDuration = durations.length
    ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length)
    : 0;

  return {
    totalVisitors: logs.length,
    uniqueVisitors,
    avgSession: formatDuration(averageDuration),
    revenue: 0,
  };
}

function filterLogsByPeriod(logs, period) {
  const start = getPeriodStart(period);
  return logs.filter((log) => getLogDate(log) >= start);
}

function getCompletedDate(item) {
  const rawDate = item.completedOn ?? item.CompletedOn ?? item.bookingDate ?? item.BookingDate;
  const date = rawDate ? new Date(rawDate) : null;
  return isValidLogDate(date) ? date : new Date();
}

function filterCompletedByPeriod(items, period) {
  const start = getPeriodStart(period);
  return items.filter((item) => getCompletedDate(item) >= start);
}

function calculateRevenue(items) {
  return items.reduce((sum, item) => sum + Number(item.price ?? item.Price ?? 0), 0);
}

export function useDashboardData() {
  const [stats, setStats] = useState(null);
  const [visitorData, setVisitorData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [completedServices, setCompletedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (period = "7d") => {
    try {
      setLoading(true);
      setError(null);

      const logs = await loginLogsAPI.getAll();
      let completed = [];
      try {
        completed = await bookingsAPI.getCompleted();
      } catch (completedError) {
        console.warn("Completed services unavailable:", completedError);
      }

      const safeLogs = toLogArray(logs);
      const periodLogs = filterLogsByPeriod(safeLogs, period);
      const periodCompleted = filterCompletedByPeriod(toCompletedArray(completed), period);

      setStats({
        ...calculateStats(periodLogs),
        revenue: calculateRevenue(periodCompleted),
      });
      setVisitorData(createVisitorData(periodLogs, period));
      setHourlyData(createHourlyData(periodLogs));
      setDeviceData(createDeviceData(periodLogs));
      setTrafficSources(createTrafficSources(periodLogs));
      setPageData(decoratePageData(createPageData(periodLogs)));
      setRecentVisits(createRecentVisits(periodLogs));
      setCompletedServices(periodCompleted);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError(err.message);
      setStats({ totalVisitors: 0, uniqueVisitors: 0, avgSession: "0m", revenue: 0 });
      setVisitorData([]);
      setHourlyData([]);
      setDeviceData([]);
      setTrafficSources([]);
      setPageData([]);
      setRecentVisits([]);
      setCompletedServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    visitorData,
    hourlyData,
    deviceData,
    trafficSources,
    pageData,
    recentVisits,
    completedServices,
    loading,
    error,
    refreshData: fetchData,
  };
}
