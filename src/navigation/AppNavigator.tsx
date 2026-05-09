/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: The App Navigator is the ROOT navigator.
 * It now contains ONLY the BottomTabNavigator.
 *
 * All screens (including VarietyList, VarietyDetail, etc.) live
 * INSIDE nested stacks within the tabs. This makes the bottom
 * navbar GLOBAL — it stays visible on every screen.
 *
 * If you ever need a screen WITHOUT the tab bar (e.g., login,
 * splash, full-screen modal), add it here as a root stack screen.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

// The tab navigator — contains all tabs + their nested stacks
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
