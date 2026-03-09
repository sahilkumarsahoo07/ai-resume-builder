import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Will use proxy or env var in production
});

api.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage, fallback to dev token if we are in that mode
        let token = localStorage.getItem('token');

        // Manual override for dev bypass if no real token exists
        if (!token) {
            token = 'mock-token-for-dev';
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
