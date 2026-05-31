/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * ROOT navigator.
 *
 * Flow:
 *   - Authenticated → MainTabs (always — returning users skip everything)
 *   - Not authenticated + hasCompletedOnboarding → AuthStack
 *   - Not authenticated + first launch → Welcome → Auth → Notification → Location → MainTabs
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  initializePushNotifications,
  registerFcmToken,
  onTokenRefresh,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  handleNotificationNavigation,
} from '../services/notificationService';

// Navigators
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

// Screens (for first-launch unauthenticated flow)
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import NotificationPermissionScreen from '../screens/Onboarding/NotificationPermissionScreen';
import LocationPermissionScreen from '../screens/Onboarding/LocationPermissionScreen';

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

  // Initialize Firebase push notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Get FCM token and register with backend
    initializePushNotifications();

    // Listen for token refreshes
    const unsubscribeTokenRefresh = onTokenRefresh((token) => {
      registerFcmToken(token);
    });

    // Listen for foreground messages
    const unsubscribeForeground = onForegroundMessage();

    // Listen for notification tap (app was in background)
    const unsubscribeOpened = onNotificationOpenedApp((payload) => {
      handleNotificationNavigation(payload);
    });

    // Check if app was opened from a notification (cold start)
    getInitialNotification().then((payload) => {
      if (payload) {
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          handleNotificationNavigation(payload);
        }, 500);
      }
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [isAuthenticated]);

  // Show nothing while we read MMKV (prevents flash of wrong screen)
  if (isAuthLoading || isOnboardingLoading) {
    return <></>;
  }

  // ── AUTHENTICATED → Always home (skip onboarding & permissions) ──
  if (isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    );
  }

  // ── NOT AUTHENTICATED ──
  if (hasSeenOnboarding) {
    // User completed full flow before but is now logged out
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  // First-launch flow: Welcome → Auth → Notification → Location → Home
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
