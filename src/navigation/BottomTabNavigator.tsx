/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BOTTOM TAB NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: A BottomTabNavigator manages switching between tabs.
 * Each tab gets its own NESTED STACK NAVIGATOR (not a raw screen).
 *
 * Why nested stacks?
 *   - When you push a detail screen (e.g., VarietyDetail), the
 *     bottom tab bar STAYS VISIBLE because the push happens
 *     INSIDE the stack, which is INSIDE the tab navigator.
 *   - Without nested stacks, pushed screens would be outside
 *     the tab navigator and the tab bar would disappear.
 *   - This is the standard pattern for global tab bars.
 *
 * Structure:
 *   BottomTabNavigator
 *   ├── HomeTab        → HomeStack
 *   ├── SprayTab       → SprayStack
 *   ├── ShopTab        → ShopStack
 *   ├── BaagichaTab    → DiscoverStack (Variety, Diseases, Blog...)
 *   └── MyOrchardTab   → MyOrchardStack
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { BottomTabParamList } from './types';

// Nested stack navigators — one per tab
import HomeStack from './stacks/HomeStack';
import SprayStack from './stacks/SprayStack';
import ShopStack from './stacks/ShopStack';
import DiscoverStack from './stacks/DiscoverStack';
import MyOrchardStack from './stacks/MyOrchardStack';

// Custom tab bar
import CustomTabBar from './CustomTabBar';

// ── Create the navigator ──
const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Spray" component={SprayStack} />
      <Tab.Screen
        name="Shop"
        component={ShopStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Shop';
          const hideTabBar = ['ProductDetail', 'Cart', 'Checkout', 'AddressList', 'AddEditAddress', 'OrderList', 'OrderDetail'].includes(routeName);
          return {
            tabBarStyle: { display: hideTabBar ? 'none' : 'flex' },
          };
        }}
      />
      <Tab.Screen name="Discover" component={DiscoverStack} />
      <Tab.Screen name="MyOrchard" component={MyOrchardStack} />
    </Tab.Navigator>
  );
}
