import api from '../api';

// Central service for managing user authentication

export const authService = {
    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Save user name if available
            if (response.data.name) {
                localStorage.setItem('userName', response.data.name);
            }
        }
        return response.data;
    },

    // Register
    register: async (username, email, password) => {
        const response = await api.post('/auth/register', { name: username, email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.name) {
                localStorage.setItem('userName', response.data.name);
            }
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    },

    // Get current token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Get current user name
    getUserName: () => {
        return localStorage.getItem('userName') || 'User';
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};