// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            if (response.status === 401) {
                // Handle unauthorized - redirect to login
                localStorage.removeItem('adminToken');
                window.location.href = '/LogIn';
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiRequest('/dashboard/stats'),
    getVisitorData: (period = '7d') => apiRequest(`/dashboard/visitors?period=${period}`),
    getHourlyData: () => apiRequest('/dashboard/hourly-traffic'),
    getDeviceData: () => apiRequest('/dashboard/devices'),
    getTrafficSources: () => apiRequest('/dashboard/traffic-sources'),
};

// Users API
export const usersAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiRequest(`/users/${id}`),
    create: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// Content API
export const contentAPI = {
    getPages: () => apiRequest('/content/pages'),
    getPosts: () => apiRequest('/content/posts'),
    getMedia: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/content/media${queryString ? `?${queryString}` : ''}`);
    },
    uploadMedia: (formData) => apiRequest('/content/media/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Don't set Content-Type for FormData
    }),
    updatePage: (id, data) => apiRequest(`/content/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updatePost: (id, data) => apiRequest(`/content/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Settings API
export const settingsAPI = {
    get: () => apiRequest('/settings'),
    update: (data) => apiRequest('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Analytics API
export const analyticsAPI = {
    getOverview: (period = '7d') => apiRequest(`/analytics/overview?period=${period}`),
    getPerformance: (type = 'pages') => apiRequest(`/analytics/performance/${type}`),
};

export { apiRequest };
