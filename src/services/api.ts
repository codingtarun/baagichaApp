/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Axios instance with automatic auth token injection, automatic
 * token refresh on 401, and programmatic navigation to login when
 * authentication fails irreversibly.
 */

import axios from 'axios';
import { Platform } from 'react-native';
import { authStorage, useAuthStore } from '../store/authStore';
import { showToast } from '../store/toastStore';
import { ENV } from '../config/env';
import { navigationRef } from '../navigation/navigationRef';

export const API_BASE_URL = ENV.API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ──
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
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void): void {
  refreshSubscribers.push(cb);
}

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      device_name: `${Platform.OS} ${Platform.Version}`,
    }, {
      headers: {
        Authorization: `Bearer ${authStorage.getString('token') ?? ''}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    if (response.data?.success && response.data?.data?.token) {
      authStorage.set('token', response.data.data.token);
      return response.data.data.token;
    }
  } catch (e) {
    console.error('[API] Token refresh failed:', e);
  }
  return null;
}

function clearAuthAndRedirect(): void {
  const { logout } = useAuthStore.getState();
  logout();
}

function navigateToEmailVerification(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('EmailVerification' as never);
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '';

      // Forbidden — email not verified (do NOT attempt refresh)
      if (status === 403 && message.toLowerCase().includes('verify')) {
        showToast('Please verify your email to continue.', 'warning');
        navigateToEmailVerification();
        return Promise.reject(error);
      }

      // Account deactivated
      if (status === 403) {
        showToast(message || 'Your account has been deactivated.', 'error');
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      // Unauthorized — token expired or invalid
      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            addRefreshSubscriber((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const newToken = await attemptTokenRefresh();
        isRefreshing = false;

        if (newToken) {
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }

        // Refresh failed — token is truly invalid. Clear auth and redirect.
        console.error('Auth Error: Token expired or invalid. Redirecting to login.');
        clearAuthAndRedirect();
      }

      // Rate limited
      if (status === 429) {
        showToast('Too many requests. Please try again later.', 'warning');
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
      console.error('Network Error — request was made but no response received:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);
