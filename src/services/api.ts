/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Axios instance with automatic auth token injection.
 * The token is read from MMKV storage on every request.
 */

import axios from 'axios';
import { authStorage } from '../store/authStore';

// LEARN: Use 10.0.2.2 for Android emulator to reach localhost.
// For physical devices on the same WiFi, use the actual IP.
// Update this to your Laravel dev server IP.
const API_BASE_URL = 'http://192.168.1.13:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ──
// Automatically attach the Bearer token to every request
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
// Handle auth errors globally (401 = token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Unauthorized — token expired or invalid
      if (status === 401) {
        console.error('Auth Error: Token expired or invalid');
        // Clear stored credentials (the app will redirect to login)
        authStorage.delete('token');
        authStorage.delete('user');
      }

      // Validation errors
      if (status === 422) {
        console.error('Validation Error:', error.response.data.errors);
      }

      // Server errors
      if (status >= 500) {
        console.error('Server Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);
