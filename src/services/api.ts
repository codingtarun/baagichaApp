/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Axios is a popular HTTP client for JavaScript. It wraps
 * the native fetch API with a cleaner interface, automatic JSON
 * parsing, request/response interceptors, and better error handling.
 *
 * We create ONE axios instance with our base URL and default config.
 * Every API call in the app uses this instance, so if we need to
 * change the base URL (e.g., for staging vs production), we only
 * change it in ONE place.
 */

import axios from 'axios';

// LEARN: Use 10.0.2.2 for Android emulator to reach localhost.
// For physical devices on the same WiFi, use the actual IP.
// This matches the Laravel dev server at http://192.168.1.13:8000
const API_BASE_URL = 'http://192.168.1.13:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds before aborting
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// LEARN: Interceptors let us transform every request before it
// goes out, and every response before it reaches the calling code.
// This is where we would add auth tokens, logging, etc.
api.interceptors.request.use(
  (config) => {
    // Future: attach auth token here
    // const token = await getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // LEARN: Axios wraps network errors, timeouts, and HTTP errors
    // in a single error object. We can centralize error handling here.
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received (network issue)
      console.error('Network Error:', error.message);
    } else {
      // Something else went wrong
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);
