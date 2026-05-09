/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Nested stack for the Shop tab. Keeps bottom navbar
 * visible when pushing screens from the Shop tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopScreen from '../../screens/ShopScreen';

export type ShopStackParamList = {
  Shop: undefined;
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Shop" component={ShopScreen} />
    </Stack.Navigator>
  );
}
