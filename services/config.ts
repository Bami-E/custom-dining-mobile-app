// Environment configuration
export const ENV = {
  DEV: 'http://localhost:3006/api',
  PROD: 'https://custom-dining.onrender.com/api',
} as const;

// Current environment (change this based on your deployment)
const CURRENT_ENV: keyof typeof ENV = 'PROD';

// API configuration
export const API_CONFIG = {
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// API endpoints - Updated to match actual backend
export const ENDPOINTS = {
  // Authentication - Updated paths
  signup: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  changePassword: '/auth/change-password',
  verifyEmail: '/auth/verify-email',
  resendVerification: '/auth/resend-verification',
  refreshToken: '/auth/refresh-token',
  
  // User
  profile: '/user/profile',
  updateProfile: '/user/profile',
  
  // App-specific endpoints (add as needed)
  restaurants: '/restaurants',
  meals: '/meals',
  orders: '/orders',
  reservations: '/reservations',
} as const;

// Get the appropriate API URL based on environment
export const getApiUrl = (): string => {
  return ENV[CURRENT_ENV];
};

// 🤖 Gemini API Key - IMPORTANT: Add your key here
export const GEMINI_API_KEY = 'AIzaSyBT24xGmWuIueM2VbhXCz_DJVc8TL5cECo';

export default API_CONFIG; 