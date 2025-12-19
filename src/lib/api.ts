import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const SERVER_URL = API_URL.replace(/\/?api\/?$/, '');

// Log API URL for debugging (remove in production)
if (typeof window !== 'undefined') {
  console.log('API URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Add request interceptor to handle auth token and FormData
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    
    // Add Bearer token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove Content-Type header for FormData requests (browser will set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error - Check if backend is running at:', API_URL);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
      });
    }
    
    // Only redirect to login on 401 if it's not a login/register request
    // This prevents redirecting during failed login attempts
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/login') || url.includes('/register');
      
      if (!isAuthEndpoint) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  csrfCookie: () => axios.get(`${SERVER_URL}/sanctum/csrf-cookie`, { withCredentials: true }),
  register: (data: any) => api.post('/register', data),
  login: (data: any) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  changePassword: (data: any) => api.put('/user/password', data),
};

// Category services
export const categoryService = {
  // User routes
  getAll: () => api.get('/user/categories'),
  getById: (id: number) => api.get(`/user/categories/${id}`),
  getUserCategories: () => api.get('/user/categories'),
  // Admin routes
  create: (data: any) => api.post('/admin/categories', data),
  createCategory: (data: any) => api.post('/admin/categories', data),
  update: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
  updateCategory: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),
  // Admin resource routes (for full CRUD)
  getAdminCategories: () => api.get('/admin/categories'),
  getAdminCategoryById: (id: number) => api.get(`/admin/categories/${id}`),
};

// Item services
export const itemService = {
  // User routes
  getAll: (params?: any) => api.get('/user/items', { params }),
  getUserItems: (params?: any) => api.get('/user/items', { params }),
  getById: (id: number) => api.get(`/user/items/${id}`),
  // Admin routes
  create: (data: FormData | any) => api.post('/admin/items', data),
  createItem: (data: FormData | any) => api.post('/admin/items', data),
  update: (id: number, data: FormData | any) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`/admin/items/${id}`, data);
    }
    return api.put(`/admin/items/${id}`, data);
  },
  delete: (id: number) => api.delete(`/admin/items/${id}`),
  deleteItem: (id: number) => api.delete(`/admin/items/${id}`),
  // Admin resource routes (for full CRUD)
  getAdminItems: (params?: any) => api.get('/admin/items', { params }),
  getAdminItemById: (id: number) => api.get(`/admin/items/${id}`),
};

// Transaction services
export const transactionService = {
  // User routes
  getAll: (params?: any) => api.get('/user/transactions', { params }),
  getUserTransactions: (params?: any) => api.get('/user/transactions', { params }),
  borrow: (data: any) => api.post('/user/transactions/borrow', data),
  returnItem: (id: number) => api.put(`/user/transactions/${id}/return`),
  returnTransaction: (id: number) => api.put(`/user/transactions/${id}/return`),
  // Admin routes
  getAllAdmin: (params?: any) => api.get('/admin/transactions', { params }),
  getAdminTransactions: (params?: any) => api.get('/admin/transactions', { params }),
  cancel: (id: number) => api.put(`/admin/transactions/${id}/cancel`),
  cancelTransaction: (id: number) => api.put(`/admin/transactions/${id}/cancel`),
};

// Notification services
export const notificationService = {
  getAll: (params?: any) => api.get('/user/notifications', { params }),
  getAllNotifications: (params?: any) => api.get('/user/notifications', { params }),
  getUnreadCount: () => api.get('/user/notifications/unread-count'),
  markAsRead: (id: number) => api.put(`/user/notifications/${id}/read`),
  markNotificationAsRead: (id: number) => api.put(`/user/notifications/${id}/read`),
  markAllAsRead: () => api.put('/user/notifications/mark-all-read'),
  markAllNotificationsAsRead: () => api.put('/user/notifications/mark-all-read'),
};

// User services (admin only)
export const userService = {
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUserRestriction: (id: number, action?: string) => {
    return api.put(`/admin/users/${id}/toggle-restriction`);
  },
  restrictUser: (id: number) => api.put(`/admin/users/${id}/toggle-restriction`),
  unrestrictUser: (id: number) => api.put(`/admin/users/${id}/toggle-restriction`),
};

// Health check service
export const healthService = {
  check: () => api.get('/health'),
};

export default api;
