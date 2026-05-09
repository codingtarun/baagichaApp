/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SPRAY STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Nested stack for the Spray tab. Keeps bottom navbar
 * visible when pushing screens from the Spray tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SprayScreen from '../../screens/SprayScreen';

export type SprayStackParamList = {
  Spray: undefined;
};

const Stack = createNativeStackNavigator<SprayStackParamList>();

export default function SprayStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Spray" component={SprayScreen} />
    </Stack.Navigator>
  );
}
