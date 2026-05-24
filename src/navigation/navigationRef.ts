/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NAVIGATION REFERENCE
 * ═══════════════════════════════════════════════════════════════
 *
 * Allows navigation from outside React components (e.g., API
 * interceptors, utility functions) by holding a ref to the
 * root NavigationContainer.
 */

import { createNavigationContainerRef } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Clear authentication and let AppNavigator route to AuthStack.
 * Use this from API interceptors when a 401 is received.
 */
export function navigateToLogin(): void {
  const { logout } = useAuthStore.getState();
  logout();
}
