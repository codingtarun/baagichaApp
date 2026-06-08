/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * ROOT navigator.
 *
 * Flow:
 *   - Authenticated + email verified → MainTabs
 *   - Authenticated + email NOT verified → EmailVerification
 *   - Not authenticated + hasCompletedOnboarding → AuthStack
 *   - Not authenticated + first launch → Welcome → Auth → Notification → Location → MainTabs
 */

import React, { useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { navigationRef } from './navigationRef';
import {
  initializePushNotifications,
  linkOrphanTokens,
  registerFcmToken,
  onTokenRefresh,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  handleNotificationNavigation,
} from '../services/notificationService';
import { fetchUnreadCount } from '../api/notifications';

// Navigators
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

// Screens (for first-launch unauthenticated flow)
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import NotificationPermissionScreen from '../screens/Onboarding/NotificationPermissionScreen';
import LocationPermissionScreen from '../screens/Onboarding/LocationPermissionScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const restoreOnboarding = useOnboardingStore((s) => s.restoreOnboardingState);
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const isOnboardingLoading = useOnboardingStore((s) => s.isLoading);

  // Compute verification status reactively from user state
  const needsVerify = isAuthenticated && user !== null && user.auth_provider === 'local' && user.email !== null && user.email_verified_at === null;

  // Restore both states on app startup
  useEffect(() => {
    restoreOnboarding();
    restoreSession();
  }, [restoreOnboarding, restoreSession]);

  // Reset navigation stack when auth state changes
  const prevIsAuthenticated = useRef(isAuthenticated);
  const prevNeedsVerify = useRef(needsVerify);

  useEffect(() => {
    if (!navigationRef.isReady()) return;

    const wasAuth = prevIsAuthenticated.current;
    const isAuth = isAuthenticated;
    const neededVerify = prevNeedsVerify.current;

    if (wasAuth && !isAuth) {
      // Logged out → reset to Auth stack
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth', params: { screen: 'Login' } }],
        })
      );
    } else if (!wasAuth && isAuth) {
      // Logged in → check verification before MainTabs
      if (needsVerify) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'EmailVerification' }],
          })
        );
      } else {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          })
        );
      }
    } else if (isAuth && neededVerify && !needsVerify) {
      // Email just got verified → go to MainTabs
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    }

    prevIsAuthenticated.current = isAuthenticated;
    prevNeedsVerify.current = needsVerify;
  }, [isAuthenticated, needsVerify]);

  // Initialize Firebase push notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated || needsVerify) return;

    initializePushNotifications().then(() => {
      linkOrphanTokens().catch(() => {});
    });

    const unsubscribeTokenRefresh = onTokenRefresh((token) => {
      registerFcmToken(token);
    });

    const unsubscribeForeground = onForegroundMessage(() => {
      fetchUnreadCount().catch(() => {});
    });

    const unsubscribeOpened = onNotificationOpenedApp((payload) => {
      handleNotificationNavigation(payload);
    });

    getInitialNotification().then((payload) => {
      if (payload) {
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
  }, [isAuthenticated, needsVerify]);

  // Show nothing while we read MMKV
  if (isAuthLoading || isOnboardingLoading) {
    return <></>;
  }

  // ── AUTHENTICATED but email NOT verified ──
  if (isAuthenticated && needsVerify) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      </Stack.Navigator>
    );
  }

  // ── AUTHENTICATED + verified → Always home ──
  if (isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    );
  }

  // ── NOT AUTHENTICATED ──
  if (hasSeenOnboarding) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  // First-launch flow
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
