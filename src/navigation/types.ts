/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NAVIGATION TYPES
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: React Navigation uses TypeScript for type-safe navigation.
 * With nested navigators, we need types for EACH level:
 *   1. BottomTabParamList      — the 5 main tabs
 *   2. DiscoverStackParamList  — screens inside Discover tab's stack
 *   3. RootStackParamList      — truly global screens (auth, splash)
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

// ═══════════════════════════════════════════════════════════════
// 1. BOTTOM TAB PARAM LIST
// ═══════════════════════════════════════════════════════════════

export type BottomTabParamList = {
  Home: undefined;
  Spray: undefined;
  Shop: undefined;
  Discover: undefined;
  MyOrchard: undefined;
};

// ═══════════════════════════════════════════════════════════════
// 2. DISCOVER STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════
// These screens live INSIDE the Discover tab's nested stack.
// The bottom tab bar stays visible when navigating between them.

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

// ═══════════════════════════════════════════════════════════════
// 3. ROOT STACK PARAM LIST
// ═══════════════════════════════════════════════════════════════
// Only screens that should NOT show the tab bar go here.
// Currently empty — everything lives inside tabs.

export type RootStackParamList = {
  MainTabs: undefined;
};

// ═══════════════════════════════════════════════════════════════
// 4. TYPE HELPERS
// ═══════════════════════════════════════════════════════════════

/** Navigation prop for screens inside the bottom tabs */
export type TabNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

/** Navigation prop for screens inside the Discover stack */
export type DiscoverNavigationProp = NativeStackNavigationProp<DiscoverStackParamList>;

/** Route prop for VarietyDetail params */
export type VarietyDetailRouteProp = RouteProp<DiscoverStackParamList, 'VarietyDetail'>;

/** Route prop for VarietyCompare params */
export type VarietyCompareRouteProp = RouteProp<DiscoverStackParamList, 'VarietyCompare'>;
