import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: { name: "Guest User", email: "guest@example.com", picture: "" }, // Default mock user
    token: 'mock-token-for-dev',
    isAuthenticated: true, // Forces authentication to be true for temporary bypass
    isLoading: false,

    loginWithGoogle: async (credential) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/google', { token: credential });
            localStorage.setItem('token', data.token);
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
