/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Every tab in the bottom navbar gets its OWN stack
 * navigator. This means when you push screens inside this tab,
 * the bottom tab bar STAYS VISIBLE. Without this nested stack,
 * pushed screens would hide the tab bar.
 *
 * Structure:
 *   HomeTab (BottomTab) → HomeStack
 *     ├── Home
 *     └── (future detail screens push here)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';

export type HomeStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
