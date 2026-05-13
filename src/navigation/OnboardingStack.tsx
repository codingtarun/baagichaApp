/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ONBOARDING STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * First-launch experience flow:
 *   Welcome Slides → Notification Permission → Location Permission
 * After location permission, the parent navigator routes to Auth.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';

import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import NotificationPermissionScreen from '../screens/Onboarding/NotificationPermissionScreen';
import LocationPermissionScreen from '../screens/Onboarding/LocationPermissionScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
    </Stack.Navigator>
  );
}
