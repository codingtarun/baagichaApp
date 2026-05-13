/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ONBOARDING STORE (Zustand + MMKV)
 * ═══════════════════════════════════════════════════════════════
 *
 * Tracks first-launch onboarding state:
 *   - has user seen the welcome slides?
 *   - has user responded to notification prompt?
 *   - has user responded to location prompt?
 *
 * Stored in a separate MMKV instance so it survives app restarts.
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// ── MMKV Storage Instance ──
let mmkvInstance: MMKV | null = null;

try {
  mmkvInstance = new MMKV({
    id: 'onboarding-storage',
    encryptionKey: 'baagicha-onboard-key-2026',
  });
} catch (error) {
  console.warn('[OnboardingStore] MMKV initialization failed.');
}

const memoryStorage: Record<string, string> = {};

const onboardingStorage = {
  set: (key: string, value: string) => {
    if (mmkvInstance) mmkvInstance.set(key, value);
    else memoryStorage[key] = value;
  },
  getString: (key: string): string | undefined => {
    if (mmkvInstance) return mmkvInstance.getString(key);
    return memoryStorage[key];
  },
  delete: (key: string) => {
    if (mmkvInstance) mmkvInstance.delete(key);
    else delete memoryStorage[key];
  },
};

// ── Types ──

interface OnboardingState {
  hasSeenOnboarding: boolean;
  hasAllowedNotifications: boolean | null;
  hasAllowedLocation: boolean | null;
  isLoading: boolean;

  // Actions
  completeOnboarding: () => void;
  setNotificationPermission: (granted: boolean) => void;
  setLocationPermission: (granted: boolean) => void;
  restoreOnboardingState: () => void;
  resetOnboarding: () => void;
}

// ── Zustand Store ──

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenOnboarding: false,
  hasAllowedNotifications: null,
  hasAllowedLocation: null,
  isLoading: true,

  completeOnboarding: () => {
    onboardingStorage.set('hasSeenOnboarding', 'true');
    set({ hasSeenOnboarding: true, isLoading: false });
  },

  setNotificationPermission: (granted: boolean) => {
    onboardingStorage.set('hasAllowedNotifications', granted ? 'true' : 'false');
    set({ hasAllowedNotifications: granted });
  },

  setLocationPermission: (granted: boolean) => {
    onboardingStorage.set('hasAllowedLocation', granted ? 'true' : 'false');
    set({ hasAllowedLocation: granted });
  },

  restoreOnboardingState: () => {
    const seen = onboardingStorage.getString('hasSeenOnboarding');
    const notif = onboardingStorage.getString('hasAllowedNotifications');
    const loc = onboardingStorage.getString('hasAllowedLocation');

    set({
      hasSeenOnboarding: seen === 'true',
      hasAllowedNotifications: notif === null ? null : notif === 'true',
      hasAllowedLocation: loc === null ? null : loc === 'true',
      isLoading: false,
    });
  },

  resetOnboarding: () => {
    onboardingStorage.delete('hasSeenOnboarding');
    onboardingStorage.delete('hasAllowedNotifications');
    onboardingStorage.delete('hasAllowedLocation');
    set({
      hasSeenOnboarding: false,
      hasAllowedNotifications: null,
      hasAllowedLocation: null,
      isLoading: false,
    });
  },
}));
