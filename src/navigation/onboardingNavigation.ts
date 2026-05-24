/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ONBOARDING NAVIGATION HELPER
 * ═══════════════════════════════════════════════════════════════
 *
 * Utility to safely navigate to MainTabs after auth completion,
 * handling both first-launch (onboarding) and returning-user flows.
 */

import type { NavigationProp } from '@react-navigation/native';
import { useOnboardingStore } from '../store/onboardingStore';
import type { RootStackParamList } from './types';

/**
 * Call after successful login/register.
 *
 * AppNavigator now gates all screens behind authentication and
 * automatically routes to OnboardingStack or MainTabs based on
 * isAuthenticated + hasSeenOnboarding. No manual navigation needed.
 */
export function finishOnboardingAndGoHome(
  _rootNavigation: NavigationProp<RootStackParamList> | undefined
): void {
  // AppNavigator handles all routing based on auth + onboarding state.
  // This function is kept for backward compatibility at call sites.
}
