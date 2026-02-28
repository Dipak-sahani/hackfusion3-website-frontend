import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('adminUser')) || null,
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null,

    login: async (email, password, role = 'admin') => {
        set({ loading: true, error: null });
        try {
            const response = role === 'admin'
                ? await authAPI.login({ email, password })
                : await authAPI.doctorLogin({ email, password });

            const { token, ...user } = response.data;
            // The backend returns the correct role in response.data.role
            // Only fall back to selection if the backend doesn't provide it
            if (!user.role) user.role = role;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));

            set({ user, token, isAuthenticated: true, loading: false });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false
            });
            return false;
        }
    },

    register: async (userData, role = 'admin') => {
        set({ loading: true, error: null });
        try {
            const response = role === 'admin'
                ? await authAPI.register(userData)
                : await authAPI.doctorRegister(userData);

            const { token, ...user } = response.data;
            if (!user.role) user.role = role;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));

            set({ user, token, isAuthenticated: true, loading: false });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                loading: false
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
