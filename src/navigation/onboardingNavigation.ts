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
 * Call after successful login/register to finish onboarding
 * and land the user on the home screen.
 *
 * During first-launch onboarding: resets stack to MainTabs.
 * For returning users: simply goes back to the previous screen.
 */
export function finishOnboardingAndGoHome(
  rootNavigation: NavigationProp<RootStackParamList> | undefined
): void {
  const { hasSeenOnboarding, completeOnboarding } = useOnboardingStore.getState();

  if (!hasSeenOnboarding) {
    completeOnboarding();
    rootNavigation?.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  } else {
    // Returning user — just dismiss the auth modal
    rootNavigation?.goBack();
  }
}
