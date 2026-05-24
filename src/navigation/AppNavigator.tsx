/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * ROOT navigator. All app screens are gated behind authentication.
 *   - Not authenticated → AuthStack ONLY (Login / Register / OTP)
 *   - Authenticated     → OnboardingStack (first launch) or MainTabs
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const restoreOnboarding = useOnboardingStore((s) => s.restoreOnboardingState);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const isOnboardingLoading = useOnboardingStore((s) => s.isLoading);

  // Restore both states on app startup
  useEffect(() => {
    restoreOnboarding();
    restoreSession();
  }, [restoreOnboarding, restoreSession]);

  // Show nothing while we read MMKV (prevents flash of wrong screen)
  if (isAuthLoading || isOnboardingLoading) {
    return <></>;
  }

  // ── NOT AUTHENTICATED → Auth screens only ──
  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  // ── AUTHENTICATED → Onboarding (first launch) or Main app ──
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
