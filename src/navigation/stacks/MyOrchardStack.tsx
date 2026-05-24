/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY ORCHARD STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * Nested stack for the My Orchard tab. Keeps bottom navbar
 * visible when pushing screens from the My Orchard tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../../screens/ProfileScreen';
import OrchardListScreen from '../../screens/OrchardListScreen';
import OrchardDetailScreen from '../../screens/OrchardDetailScreen';
import OrchardFormScreen from '../../screens/OrchardFormScreen';
import BlockFormScreen from '../../screens/BlockFormScreen';
import OrchardVarietyFormScreen from '../../screens/OrchardVarietyFormScreen';

export type MyOrchardStackParamList = {
  MyOrchard: undefined;
  OrchardList: undefined;
  OrchardDetail: { orchardId: number };
  OrchardForm: { orchardId?: number } | undefined;
  BlockForm: { orchardId: number; blockId?: number } | undefined;
  OrchardVarietyForm: { orchardId: number; varietyId?: number } | undefined;
};

const Stack = createNativeStackNavigator<MyOrchardStackParamList>();

export default function MyOrchardStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyOrchard" component={ProfileScreen} />
      <Stack.Screen name="OrchardList" component={OrchardListScreen} />
      <Stack.Screen name="OrchardDetail" component={OrchardDetailScreen} />
      <Stack.Screen name="OrchardForm" component={OrchardFormScreen} />
      <Stack.Screen name="BlockForm" component={BlockFormScreen} />
      <Stack.Screen name="OrchardVarietyForm" component={OrchardVarietyFormScreen} />
    </Stack.Navigator>
  );
}
