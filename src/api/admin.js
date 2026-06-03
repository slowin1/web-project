import {
  normalizeService,
  normalizeServiceCategory,
  normalizeServiceImage,
  toCreateServiceDto,
  toCreateServiceImageDto,
} from "./dtoMappers";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

const ENDPOINTS = {
  users: "/Users",
  services: "/Services",
  serviceCategories: "/ServiceCategories",
  serviceImages: "/ServiceImages",
  serviceBookings: "/ServiceBookings",
  specialists: "/Specialists",
  serviceTimeSlots: "/ServiceTimeSlots",
  specialistWorkSchedules: "/SpecialistWorkSchedules",
  specialistReviews: "/SpecialistReviews",
  loginLogs: "/LoginLogs",
};

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("authToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem("adminToken");
        window.location.href = "/LogIn";
      }
      throw new Error(`API Error: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest("/dashboard/stats"),
  getVisitorData: (period = "7d") =>
    apiRequest(`/dashboard/visitors?period=${period}`),
  getHourlyData: () => apiRequest("/dashboard/hourly-traffic"),
  getDeviceData: () => apiRequest("/dashboard/devices"),
  getTrafficSources: () => apiRequest("/dashboard/traffic-sources"),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${ENDPOINTS.users}${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiRequest(`${ENDPOINTS.users}/${id}`),
  create: (data) =>
    apiRequest(ENDPOINTS.users, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.users}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.users}/${id}`, { method: "DELETE" }),
};

export const servicesAPI = {
  getAll: async () => {
    const data = await apiRequest(ENDPOINTS.services);
    return Array.isArray(data)
      ? data.map(normalizeService).filter(Boolean)
      : [];
  },
  getById: async (id) => normalizeService(await apiRequest(`${ENDPOINTS.services}/${id}`)),
  create: async (form) => {
    const data = await apiRequest(ENDPOINTS.services, {
      method: "POST",
      body: JSON.stringify(toCreateServiceDto(form)),
    });
    return normalizeService(data);
  },
  update: async (id, form) => {
    const data = await apiRequest(`${ENDPOINTS.services}/${id}`, {
      method: "PUT",
      body: JSON.stringify(toCreateServiceDto(form)),
    });
    return normalizeService(data);
  },
  delete: (id) => apiRequest(`${ENDPOINTS.services}/${id}`, { method: "DELETE" }),
};

export const serviceCategoriesAPI = {
  getAll: async () => {
    const data = await apiRequest(ENDPOINTS.serviceCategories);
    return Array.isArray(data)
      ? data.map(normalizeServiceCategory).filter(Boolean)
      : [];
  },
  getById: async (id) =>
    normalizeServiceCategory(
      await apiRequest(`${ENDPOINTS.serviceCategories}/${id}`),
    ),
  create: (data) =>
    apiRequest(ENDPOINTS.serviceCategories, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.serviceCategories}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`${ENDPOINTS.serviceCategories}/${id}`, { method: "DELETE" }),
};

export const serviceImagesAPI = {
  getAll: async () => {
    const data = await apiRequest(ENDPOINTS.serviceImages);
    return Array.isArray(data)
      ? data.map(normalizeServiceImage).filter(Boolean)
      : [];
  },
  getById: async (id) =>
    normalizeServiceImage(await apiRequest(`${ENDPOINTS.serviceImages}/${id}`)),
  create: async (form) => {
    const data = await apiRequest(ENDPOINTS.serviceImages, {
      method: "POST",
      body: JSON.stringify(toCreateServiceImageDto(form)),
    });
    return normalizeServiceImage(data);
  },
  update: async (id, form) => {
    const data = await apiRequest(`${ENDPOINTS.serviceImages}/${id}`, {
      method: "PUT",
      body: JSON.stringify(toCreateServiceImageDto(form)),
    });
    return normalizeServiceImage(data);
  },
  delete: (id) =>
    apiRequest(`${ENDPOINTS.serviceImages}/${id}`, { method: "DELETE" }),
};

export const specialistsAPI = {
  getAll: () => apiRequest(ENDPOINTS.specialists),
  getById: (id) => apiRequest(`${ENDPOINTS.specialists}/${id}`),
  create: (data) => apiRequest(ENDPOINTS.specialists, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.specialists}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.specialists}/${id}`, { method: "DELETE" }),
};

export const serviceTimeSlotsAPI = {
  getAll: () => apiRequest(ENDPOINTS.serviceTimeSlots),
  getById: (id) => apiRequest(`${ENDPOINTS.serviceTimeSlots}/${id}`),
  create: (data) =>
    apiRequest(ENDPOINTS.serviceTimeSlots, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.serviceTimeSlots}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.serviceTimeSlots}/${id}`, { method: "DELETE" }),
};

export const specialistWorkSchedulesAPI = {
  getAll: () => apiRequest(ENDPOINTS.specialistWorkSchedules),
  getById: (id) => apiRequest(`${ENDPOINTS.specialistWorkSchedules}/${id}`),
  create: (data) =>
    apiRequest(ENDPOINTS.specialistWorkSchedules, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.specialistWorkSchedules}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.specialistWorkSchedules}/${id}`, { method: "DELETE" }),
};

export const specialistReviewsAPI = {
  getAll: () => apiRequest(ENDPOINTS.specialistReviews),
  getById: (id) => apiRequest(`${ENDPOINTS.specialistReviews}/${id}`),
  create: (data) =>
    apiRequest(ENDPOINTS.specialistReviews, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.specialistReviews}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.specialistReviews}/${id}`, { method: "DELETE" }),
};

export const loginLogsAPI = {
  getAll: () => apiRequest(ENDPOINTS.loginLogs),
  getById: (id) => apiRequest(`${ENDPOINTS.loginLogs}/${id}`),
  create: (data) => apiRequest(ENDPOINTS.loginLogs, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.loginLogs}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.loginLogs}/${id}`, { method: "DELETE" }),
};

// Content API
export const contentAPI = {
  getPages: () => apiRequest("/content/pages"),
  getPosts: () => apiRequest("/content/posts"),
  getMedia: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/content/media${queryString ? `?${queryString}` : ""}`);
  },
  uploadMedia: (formData) =>
    apiRequest("/content/media/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    }),
  updatePage: (id, data) =>
    apiRequest(`/content/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updatePost: (id, data) =>
    apiRequest(`/content/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Settings API
export const settingsAPI = {
  get: () => apiRequest("/settings"),
  update: (data) =>
    apiRequest("/settings", { method: "PUT", body: JSON.stringify(data) }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (period = "7d") =>
    apiRequest(`/analytics/overview?period=${period}`),
  getPerformance: (type = "pages") =>
    apiRequest(`/analytics/performance/${type}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data) =>
    apiRequest(ENDPOINTS.serviceBookings, { method: "POST", body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`${ENDPOINTS.serviceBookings}${queryString ? `?${queryString}` : ""}`);
  },
  getById: (id) => apiRequest(`${ENDPOINTS.serviceBookings}/${id}`),
  update: (id, data) =>
    apiRequest(`${ENDPOINTS.serviceBookings}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`${ENDPOINTS.serviceBookings}/${id}`, { method: "DELETE" }),
  getByUser: (userId) => apiRequest(`${ENDPOINTS.serviceBookings}/user/${userId}`),
  getByService: (serviceId) => apiRequest(`${ENDPOINTS.serviceBookings}/service/${serviceId}`),
  getAvailableSlots: (serviceId, date) =>
    apiRequest(`${ENDPOINTS.serviceBookings}/available-slots?serviceId=${serviceId}&date=${date}`),
};

export { apiRequest };
