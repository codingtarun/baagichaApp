/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISCOVER STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: This is the most important nested stack. The Discover
 * tab hosts ALL knowledge screens: Diseases, Variety, Rootstock,
 * Blog, Weather. When you tap a card in Discover and push a new
 * screen, the bottom tab bar stays visible because you're still
 * INSIDE this stack, which is INSIDE the BottomTabNavigator.
 *
 * If these screens were in the ROOT stack instead, the tab bar
 * would disappear every time you navigated to them.
 *
 * Structure:
 *   DiscoverTab (BottomTab) → DiscoverStack
 *     ├── Discover        (the hub with 4 cards)
 *     ├── VarietyList     (apple variety guide)
 *     ├── VarietyDetail   (single variety)
 *     ├── VarietyCompare  (side-by-side comparison)
 *     ├── Diseases        (disease library)
 *     ├── Weather         (weather info)
 *     ├── Blog            (articles)
 *     └── Rootstock       (rootstock guide)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscoverScreen from '../../screens/DiscoverScreen';
import VarietyScreen from '../../screens/VarietyScreen';
import VarietyDetailScreen from '../../screens/VarietyDetailScreen';
import VarietyCompareScreen from '../../screens/VarietyCompareScreen';
import DiseasesScreen from '../../screens/DiseasesScreen';
import WeatherScreen from '../../screens/WeatherScreen';
import BlogScreen from '../../screens/BlogScreen';

export type DiscoverStackParamList = {
  Discover: undefined;
  VarietyList: undefined;
  VarietyDetail: { slug: string };
  VarietyCompare: { slugs: string[] };
  Diseases: undefined;
  Weather: undefined;
  Blog: undefined;
  Rootstock: undefined;
};

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="VarietyList" component={VarietyScreen} />
      <Stack.Screen name="VarietyDetail" component={VarietyDetailScreen} />
      <Stack.Screen name="VarietyCompare" component={VarietyCompareScreen} />
      <Stack.Screen name="Diseases" component={DiseasesScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />
      {/* Rootstock placeholder — reuse BlogScreen until built */}
      <Stack.Screen name="Rootstock" component={BlogScreen} />
    </Stack.Navigator>
  );
}
