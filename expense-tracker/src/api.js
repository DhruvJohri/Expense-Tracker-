import axios from "axios";

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api",
  withCredentials: true // This allows cookies to be sent with requests
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  // Store token in localStorage if it's in the response
  if (response.data && response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  // Store token in localStorage if it's in the response
  if (response.data && response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

export const logoutUser = async () => {
  // Remove token from localStorage when logging out
  localStorage.removeItem('accessToken');
  return API.post("/auth/logout");
};

export const refreshToken = async () => {
  const response = await API.post("/auth/refresh-token");
  // Update token in localStorage if a new one is returned
  if (response.data && response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response;
};

export const getCurrentUser = async () => {
  return API.get("/auth/me");
};

// Handle token expiry
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and token expired and we haven't tried to refresh yet
    if (error.response?.status === 401 && 
        error.response?.data?.expired === true && 
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await refreshToken();
        // If successful, retry the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Expense API
export const getExpenses = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...filters
  });
  
  return API.get(`/expenses?${params}`);
};

export const getExpenseById = async (id) => {
  return API.get(`/expenses/${id}`);
};

export const addExpense = async (expenseData) => {
  return API.post("/expenses", expenseData);
};

export const updateExpense = async (id, expenseData) => {
  return API.put(`/expenses/${id}`, expenseData);
};

export const deleteExpense = async (id) => {
  return API.delete(`/expenses/${id}`);
};

export const getSpendingInsights = async (dateRange = {}) => {
  const params = new URLSearchParams(dateRange);
  return API.get(`/expenses/insights?${params}`);
};

export default API;
