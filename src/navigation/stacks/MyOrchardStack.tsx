/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY ORCHARD STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Nested stack for the My Orchard tab. Keeps bottom navbar
 * visible when pushing screens from the My Orchard tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/ProfileScreen';

export type MyOrchardStackParamList = {
  MyOrchard: undefined;
};

const Stack = createNativeStackNavigator<MyOrchardStackParamList>();

export default function MyOrchardStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyOrchard" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
