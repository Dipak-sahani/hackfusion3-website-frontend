import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || ''; // Fallback to empty to avoid exposing localhost if not set

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
            localStorage.removeItem('adminToken');
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
