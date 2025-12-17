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
  timeout: 30000, // 30 second timeout (increased for slow operations)
  withCredentials: true,
});


// Add request interceptor to handle FormData
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
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
  getUserCategories: () => api.get('/user/categories'), // Alias for getAll
  // Admin routes
  create: (data: any) => api.post('/admin/categories', data),
  createCategory: (data: any) => api.post('/admin/categories', data), // Alias
  update: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
  updateCategory: (id: number, data: any) => api.put(`/admin/categories/${id}`, data), // Alias
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`), // Alias
};

// Item services
export const itemService = {
  // User routes
  getAll: () => api.get('/user/items'),
  getUserItems: () => api.get('/user/items'), // Alias
  getById: (id: number) => api.get(`/user/items/${id}`),
  // Admin routes
  create: (data: FormData | any) => api.post('/admin/items', data),
  createItem: (data: FormData | any) => api.post('/admin/items', data), // Alias
  update: (id: number, data: FormData | any) => api.put(`/admin/items/${id}`, data),
  delete: (id: number) => api.delete(`/admin/items/${id}`),
  deleteItem: (id: number) => api.delete(`/admin/items/${id}`), // Alias
};

// Transaction services
export const transactionService = {
  // User routes
  getAll: () => api.get('/user/transactions'),
  getUserTransactions: () => api.get('/user/transactions'), // Alias
  borrow: (data: any) => api.post('/user/transactions/borrow', data),
  returnItem: (id: number) => api.put(`/user/transactions/${id}/return`),
  // Admin routes
  getAllAdmin: () => api.get('/admin/transactions'),
  cancel: (id: number) => api.put(`/admin/transactions/${id}/cancel`),
};

// Notification services
export const notificationService = {
  getAll: () => api.get('/user/notifications'),
  getUnreadCount: () => api.get('/user/notifications/unread-count'),
  markAsRead: (id: number) => api.put(`/user/notifications/${id}/read`),
  markAllAsRead: () => api.put('/user/notifications/mark-all-read'),
};

// User services (admin only)
export const userService = {
  getAllUsers: () => api.get('/admin/users'),
  toggleUserRestriction: (id: number, action: string) => {
    // Action can be 'restrict' or 'unrestrict', but backend toggles automatically
    return api.put(`/admin/users/${id}/toggle-restriction`);
  },
};

export default api;
