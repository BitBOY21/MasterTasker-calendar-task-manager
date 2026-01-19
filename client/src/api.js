import axios from 'axios';

// Create Axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// --- Request Interceptor ---
// This function runs *before* every request is sent to the server
api.interceptors.request.use(
    (config) => {
        // Check: Is there a token stored in the browser?
        const token = localStorage.getItem('token');
        if (token) {
            // If yes, add it to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;