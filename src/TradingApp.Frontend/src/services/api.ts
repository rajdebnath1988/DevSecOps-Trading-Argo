import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    API.post('/api/auth/login', { email, password }),
  register: (data: any) => API.post('/api/auth/register', data),
};

export const stocksAPI = {
  getAll: (search?: string) =>
    API.get('/api/stocks', { params: search ? { search } : {} }),
  getBySymbol: (symbol: string) => API.get(`/api/stocks/${symbol}`),
  getHistory: (symbol: string, days = 30) =>
    API.get(`/api/stocks/${symbol}/history`, { params: { days } }),
};

export const ordersAPI = {
  getMyOrders: () => API.get('/api/orders'),
  placeOrder: (stockId: number, type: 'Buy'|'Sell', quantity: number) =>
    API.post('/api/orders', { stockId, type, quantity }),
  cancelOrder: (id: number) => API.delete(`/api/orders/${id}`),
};

export const portfolioAPI = {
  getMyPortfolio: () => API.get('/api/portfolio'),
  getSummary: () => API.get('/api/portfolio/summary'),
};

export const marketAPI = {
  getOverview: () => API.get('/api/market/overview'),
  getGainers: () => API.get('/api/market/gainers'),
  getLosers: () => API.get('/api/market/losers'),
};
