/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NAVIGATION REFERENCE
 * ═══════════════════════════════════════════════════════════════
 *
 * Allows navigation from outside React components (e.g., API
 * interceptors, utility functions) by holding a ref to the
 * root NavigationContainer.
 */

import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Clear authentication and reset navigation to Login.
 * Use this from API interceptors when a 401 is received.
 */
export function navigateToLogin(): void {
  const { logout } = useAuthStore.getState();
  logout();

  // Force navigation reset so the old MainTabs stack is destroyed
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      })
    );
  }
}
