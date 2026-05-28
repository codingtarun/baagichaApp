/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NAVIGATION TYPES
 * ═══════════════════════════════════════════════════════════════
 *
 * TypeScript types for ALL navigators in the app.
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ShopStackParamList } from './stacks/ShopStack';
import type { MyOrchardStackParamList } from './stacks/MyOrchardStack';
import type { HomeStackParamList } from './stacks/HomeStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

// ═══════════════════════════════════════════════════════════════
// 1. AUTH STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════
// Screens that should NOT show the bottom tab bar.

export type AuthStackParamList = {
  Login: undefined;
  EmailRegister: undefined;
  PhoneAuth: undefined;
  ForgotPassword: undefined;
  Onboarding: { token: string; user: import('../store/authStore').User } | undefined;
};

// ═══════════════════════════════════════════════════════════════
// 1b. ONBOARDING STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════
// First-launch screens before auth.

export type OnboardingStackParamList = {
  Welcome: undefined;
  NotificationPermission: undefined;
  LocationPermission: undefined;
};

// ═══════════════════════════════════════════════════════════════
// 2. BOTTOM TAB PARAM LIST
// ═══════════════════════════════════════════════════════════════

export type BottomTabParamList = {
  Home: undefined;
  Spray: undefined;
  Shop: undefined;
  Discover: undefined;
  MyOrchard: undefined;
};

// ═══════════════════════════════════════════════════════════════
// 3. DISCOVER STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════

export type DiscoverStackParamList = {
  Discover: undefined;
  VarietyList: undefined;
  VarietyDetail: { slug: string };
  VarietyCompare: { slugs: string[] };
  Diseases: undefined;
  DiseaseDetail: { slug: string };
  Weather: undefined;
  Blog: undefined;
  BlogDetail: { slug: string };
  RootstockList: undefined;
  RootstockDetail: { slug: string };
};

// ═══════════════════════════════════════════════════════════════
// 4. ROOT STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════
// Root navigator screens: Auth flow or Main app.

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: { screen?: keyof AuthStackParamList } | undefined;
  MainTabs: undefined;
};

// ═══════════════════════════════════════════════════════════════
// 4b. SHOP STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════

export type { ShopStackParamList };

// ═══════════════════════════════════════════════════════════════
// 4c. MY ORCHARD STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════

export type { MyOrchardStackParamList };

// ═══════════════════════════════════════════════════════════════
// 5. TYPE HELPERS
// ═══════════════════════════════════════════════════════════════

/** Navigation prop for auth screens */
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

/** Navigation prop for screens inside the bottom tabs */
export type TabNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

/** Navigation prop for screens inside the Discover stack */
export type DiscoverNavigationProp = NativeStackNavigationProp<DiscoverStackParamList>;

/** Navigation prop for screens inside the Shop stack */
export type ShopNavigationProp = NativeStackNavigationProp<ShopStackParamList>;

/** Navigation prop for screens inside the My Orchard stack */
export type MyOrchardNavigationProp = NativeStackNavigationProp<MyOrchardStackParamList>;

/** Navigation prop for screens inside the Home stack */
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

/** Route prop for VarietyDetail params */
export type VarietyDetailRouteProp = RouteProp<DiscoverStackParamList, 'VarietyDetail'>;

/** Route prop for DiseaseDetail params */
export type DiseaseDetailRouteProp = RouteProp<DiscoverStackParamList, 'DiseaseDetail'>;

/** Route prop for RootstockDetail params */
export type RootstockDetailRouteProp = RouteProp<DiscoverStackParamList, 'RootstockDetail'>;

/** Route prop for BlogDetail params */
export type BlogDetailRouteProp = RouteProp<DiscoverStackParamList, 'BlogDetail'>;

/** Route prop for VarietyCompare params */
export type VarietyCompareRouteProp = RouteProp<DiscoverStackParamList, 'VarietyCompare'>;
