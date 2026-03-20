import axios from 'axios';

// Get the base URL relying on Vite env or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add the Authorization token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Intercept responses to handle 401s globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and optionally force reload to kick user to login page
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Only use this if not handling redirects in AuthContext
        }
        return Promise.reject(error);
    }
);

export default api;
