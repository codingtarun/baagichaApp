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
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Programmatically navigate to the Auth stack.
 * Use this from API interceptors when a 401 is received.
 */
export function navigateToLogin(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Auth', { screen: 'Login' });
  }
}
