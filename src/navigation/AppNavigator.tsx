/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * ROOT navigator. The entire app is accessible without login.
 * Auth screens (Login/Register) can be pushed on top when needed.
 * The auth state is still restored on startup for seamless login.
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import { useAuthStore } from '../store/authStore';

// Navigators
import AuthStack from './AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  // Restore auth session from MMKV on app startup (silent, in background)
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main app is ALWAYS accessible */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Auth screens can be pushed from anywhere */}
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
}
