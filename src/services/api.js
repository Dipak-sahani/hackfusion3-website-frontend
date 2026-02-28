import axios from 'axios';
import useAuthStore from '../context/useAuthStore';

let API_URL = import.meta.env.VITE_API_URL || ''; // Fallback to empty to avoid exposing localhost if not set

// Ensure URL ends with /api and no trailing slash
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
    API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
}
// Strip trailing slash if present for consistency with relative paths
if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1);
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('auth/login', credentials),
    register: (userData) => api.post('auth/register', userData),
    doctorLogin: (credentials) => api.post('doctor/login', credentials),
    doctorRegister: (userData) => api.post('doctor/register', userData),
};

export const doctorAPI = {
    getProfile: () => api.get('doctor/profile'),
    updateAvailability: (availability) => api.post('doctor/availability', { availability }),
    getAppointments: () => api.get('doctor/appointments'),
    updateStatus: (id, status) => api.patch(`doctor/appointment/${id}/status`, { status }),
    addNotes: (id, notes) => api.post(`doctor/appointment/${id}/notes`, { notes }),
};

export const medicineAPI = {
    getAll: () => api.get('medicines'),
    create: (data) => api.post('medicines', data),
    update: (id, data) => api.put(`medicines/${id}`, data),
    delete: (id) => api.delete(`medicines/${id}`),
    upload: (formData) => api.post('medicines/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export const orderAPI = {
    getAll: () => api.get('orders/all'),
};

export const inventoryAPI = {
    getLogs: () => api.get('inventory/logs'),
};

export default api;
