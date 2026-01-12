import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getCategories: () => api.get('/products/categories'),
    // Admin
    getAllAdmin: () => api.get('/products/admin/all'),
    create: (formData) => api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
    update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
    remove: (itemId) => api.delete(`/cart/${itemId}`),
    clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my-orders'),
    getById: (id) => api.get(`/orders/${id}`),
    // Admin
    getAll: (params) => api.get('/orders', { params }),
    updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
    getStats: () => api.get('/orders/admin/stats'),
};

// Announcements API
export const announcementsAPI = {
    getActive: () => api.get('/announcements/active'),
    // Admin
    getAll: () => api.get('/announcements'),
    getAllAdmin: () => api.get('/announcements'),
    create: (data) => api.post('/announcements', data),
    update: (id, data) => api.put(`/announcements/${id}`, data),
    toggle: (id) => api.patch(`/announcements/${id}/toggle`),
    delete: (id) => api.delete(`/announcements/${id}`),
};

export default api;
