import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed',
                userId: error.response?.data?.userId
            };
        }
    },

    sendRegisterOTP: async (email) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/send-register-otp', { email });
            set({ isLoading: false });
            return { success: true, message: data.message };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
    },

    signup: async (name, email, password, otp) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/register', { name, email, password, otp });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    },

    verifyOTP: async (userId, otp) => {
        // This is for existing unverified users/password reset
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/verify-otp', { userId, otp });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Verification failed' };
        }
    },

    resendOTP: async (userId, email) => {
        try {
            const { data } = await api.post('/auth/resend-otp', { userId, email });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to resend OTP' };
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            set({ isLoading: false });
            return { success: true, message: data.message };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Request failed' };
        }
    },

    resetPassword: async (email, otp, newPassword) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
            set({ isLoading: false });
            return { success: true, message: data.message };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Reset failed' };
        }
    },

    loginWithGoogle: async (credential) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/google', { token: credential });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
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
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
