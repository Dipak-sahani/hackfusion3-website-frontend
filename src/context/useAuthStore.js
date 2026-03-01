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
            const response = (role === 'admin' || role === 'customer')
                ? await authAPI.login({ email, password })
                : await authAPI.doctorLogin({ email, password });

            // STRICT ROLE CHECK
            if (user.role && user.role !== role) {
                set({
                    error: `Access Denied: Your account role is '${user.role}', but you tried to login as '${role}'.`,
                    loading: false
                });
                return false;
            }

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
            const payload = { ...userData, role };
            console.log(`[AUTH] Registering via Store. Role: ${role}, Payload Role: ${payload.role}`);

            const response = (role === 'admin' || role === 'customer')
                ? await authAPI.register(payload)
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
