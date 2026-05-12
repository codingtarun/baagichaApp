/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — AUTH STORE (Zustand + MMKV)
 * ═══════════════════════════════════════════════════════════════
 *
 * Zustand store for auth state with MMKV persistence.
 *
 * NOTE: MMKV requires JSI (JavaScript Interface). It will NOT work
 * with Chrome Remote Debugger because that runs JS in Chrome's V8
 * engine instead of the device's JSC/Hermes. Use Flipper or
 * Hermes debugging instead.
 *
 * If MMKV fails to initialize (e.g. during Chrome debugging), we
 * gracefully fall back to an in-memory store so the app doesn't crash.
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// ── MMKV Storage Instance (with graceful fallback) ──
let mmkvInstance: MMKV | null = null;

try {
  mmkvInstance = new MMKV({
    id: 'auth-storage',
    encryptionKey: 'baagicha-auth-key-2026',
  });
} catch (error) {
  console.warn(
    '[AuthStore] MMKV initialization failed. ' +
    'This is expected if using Chrome Remote Debugger. ' +
    'Auth state will NOT persist across app restarts. ' +
    'Switch to Flipper or Hermes debugging for full functionality.'
  );
}

// Fallback in-memory storage when MMKV is unavailable
const memoryStorage: Record<string, string> = {};

export const authStorage = {
  set: (key: string, value: string) => {
    if (mmkvInstance) {
      mmkvInstance.set(key, value);
    } else {
      memoryStorage[key] = value;
    }
  },
  getString: (key: string): string | undefined => {
    if (mmkvInstance) {
      return mmkvInstance.getString(key);
    }
    return memoryStorage[key];
  },
  delete: (key: string) => {
    if (mmkvInstance) {
      mmkvInstance.delete(key);
    } else {
      delete memoryStorage[key];
    }
  },
};

// ── Types ──
export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  preferred_language: string;
  is_active: boolean;
  profile: {
    village: string | null;
    district: string | null;
    state: string | null;
  } | null;
  preferences: {
    language: string;
    units: string;
  } | null;
  primary_orchard: {
    id: number;
    name: string;
    village: string;
    district: string;
  } | null;
  created_at: string;
}

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  restoreSession: () => void;
}

// ── Zustand Store ──
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Set token only
  setToken: (token: string) => {
    authStorage.set('token', token);
    set({ token, isAuthenticated: true });
  },

  // Set user only
  setUser: (user: User) => {
    authStorage.set('user', JSON.stringify(user));
    set({ user });
  },

  // Full login — persist everything
  login: (token: string, user: User) => {
    authStorage.set('token', token);
    authStorage.set('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  // Logout — clear everything
  logout: () => {
    authStorage.delete('token');
    authStorage.delete('user');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  // Update user fields (e.g., after profile update)
  updateUser: (updates: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    authStorage.set('user', JSON.stringify(updated));
    set({ user: updated });
  },

  // Restore session from MMKV on app startup
  restoreSession: () => {
    const token = authStorage.getString('token');
    const userJson = authStorage.getString('user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        set({ token, user, isAuthenticated: true, isLoading: false });
        return;
      } catch {
        // Invalid stored user, clear it
        authStorage.delete('token');
        authStorage.delete('user');
      }
    }

    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },
}));
