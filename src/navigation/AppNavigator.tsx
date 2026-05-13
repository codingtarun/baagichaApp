/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * ROOT navigator. Entry point depends on onboarding state:
 *   - First launch    → OnboardingStack (slides → permissions → auth)
 *   - Returning user  → MainTabs (home), regardless of auth state
 *
 * Auth screens (Login/Register) can still be pushed on top when needed.
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';

// Navigators
import OnboardingStack from './OnboardingStack';
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const restoreOnboarding = useOnboardingStore((s) => s.restoreOnboardingState);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const isOnboardingLoading = useOnboardingStore((s) => s.isLoading);

  // Restore both states on app startup
  useEffect(() => {
    restoreOnboarding();
    restoreSession();
  }, [restoreOnboarding, restoreSession]);

  // Show nothing while we read MMKV (prevents flash of wrong screen)
  if (isOnboardingLoading) {
    return <></>;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        /* ── FIRST LAUNCH ── */
        <>
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </>
      ) : (
        /* ── RETURNING USER ── */
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Auth" component={AuthStack} />
        </>
      )}
    </Stack.Navigator>
  );
}
