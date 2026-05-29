/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CUSTOM BOTTOM TAB BAR (LeafSnap Style)
 * ═══════════════════════════════════════════════════════════════
 *
 * Compact white tab bar with center Shop FAB.
 * The FAB sits EMBEDDED in the tab bar — half inside, half above.
 * Layout: [Home] [Spray]  [🟢]  [Baagic] [Orchard]
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';

interface TabConfig {
  name: string;
  label: string;
  icon: string;
}

const LEFT_TABS: TabConfig[] = [
  { name: 'Home', label: 'Home', icon: 'home-variant' },
  { name: 'Spray', label: 'Spray', icon: 'spray-bottle' },
];

const RIGHT_TABS: TabConfig[] = [
  { name: 'Discover', label: 'Baagicha', icon: 'compass' },
  { name: 'MyOrchard', label: 'Orchard', icon: 'sprout' },
];

const HIDDEN_TABBAR_SCREENS = [
  'ProductDetail', 'Cart', 'Checkout',
  'AddressList', 'AddEditAddress',
  'OrderList', 'OrderDetail',
];

function getFocusedRouteName(navState: any): string | null {
  const route = navState.routes?.[navState.index];
  if (!route) return null;
  if (route.state) {
    return getFocusedRouteName(route.state);
  }
  return route.name ?? null;
}

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps): React.JSX.Element | null {
  const focusedRoute = getFocusedRouteName(state);

  if (focusedRoute && HIDDEN_TABBAR_SCREENS.includes(focusedRoute)) {
    return null;
  }

  // Tab indices in BottomTabNavigator state:
  // 0: Home, 1: Spray, 2: Shop, 3: Discover, 4: MyOrchard
  const shopIndex = 2;
  const isShopFocused = state.index === shopIndex;

  const renderTab = (tab: TabConfig, stateIdx: number) => {
    const isFocused = state.index === stateIdx;
    const route = state.routes[stateIdx];

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={tab.name}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.7}
      >
        <Icon
          name={tab.icon}
          size={20}
          color={isFocused ? Colors.primary : Colors.gray500}
        />
        <Typography
          variant="caption"
          style={[
            styles.label,
            { color: isFocused ? Colors.primary : Colors.gray500 },
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Tab bar container — FAB is positioned absolutely inside this */}
      <View style={styles.bar} pointerEvents="auto">
        {/* Left side tabs */}
        <View style={styles.side}>
          {LEFT_TABS.map((tab, i) => renderTab(tab, i))}
        </View>

        {/* Fixed gap in the middle for the FAB */}
        <View style={styles.gap} />

        {/* Right side tabs */}
        <View style={styles.side}>
          {RIGHT_TABS.map((tab, i) => renderTab(tab, i + 3))}
        </View>

        {/* Center Shop FAB — positioned to sit half inside, half above the bar */}
        <View style={styles.fabWrap} pointerEvents="box-none">
          <TouchableOpacity
            onPress={() => {
              const shopRoute = state.routes[shopIndex];
              const event = navigation.emit({
                type: 'tabPress',
                target: shopRoute.key,
                canPreventDefault: true,
              });
              if (!isShopFocused && !event.defaultPrevented) {
                navigation.navigate(shopRoute.name);
              }
            }}
            style={[styles.fab, isShopFocused && styles.fabActive]}
            activeOpacity={0.85}
          >
            <Icon name="storefront" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Typography
            variant="caption"
            style={[
              styles.fabLabel,
              { color: isShopFocused ? Colors.primary : Colors.gray500 },
            ]}
          >
            Shop
          </Typography>
        </View>
      </View>
    </View>
  );
}

const BAR_H = 52;
const FAB_H = 48;
const FAB_RISE = 16; // how much the FAB sticks above the tab bar

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.select({ ios: 12, android: 6 }),
    zIndex: 1000,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_H,
    marginHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: 4,
    position: 'relative',
    ...Shadows.strong,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  gap: {
    width: 52,
  },
  fabWrap: {
    position: 'absolute',
    top: -FAB_RISE,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    width: FAB_H,
    height: FAB_H,
    borderRadius: FAB_H / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.strong,
  },
  fabActive: {
    backgroundColor: Colors.primary700,
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
