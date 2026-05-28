/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CUSTOM BOTTOM TAB BAR (Modernized)
 * ═══════════════════════════════════════════════════════════════
 *
 * Floating pill-style tab bar with animated active indicator.
 *   • White elevated container that floats above content
 *   • Active tab: primary green pill with white icon + text
 *   • Inactive: gray icon + text
 *   • Smooth scale + opacity transitions on tab switch
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';

const SCREEN_W = Dimensions.get('window').width;

interface TabConfig {
  name: string;
  label: string;
  labelHi: string;
  icon: string;
}

const TABS: TabConfig[] = [
  { name: 'Home', label: 'Home', labelHi: 'होम', icon: 'home-variant' },
  { name: 'Spray', label: 'Spray', labelHi: 'स्प्रे', icon: 'spray-bottle' },
  { name: 'Shop', label: 'Shop', labelHi: 'दुकान', icon: 'storefront' },
  { name: 'Discover', label: 'Baagicha', labelHi: 'बागीचा', icon: 'compass' },
  { name: 'MyOrchard', label: 'Orchard', labelHi: 'बाग', icon: 'sprout' },
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

  const tabCount = TABS.length;
  const tabWidth = (SCREEN_W - 32 - (tabCount - 1) * 4) / tabCount;

  // Animated value for the active indicator position
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: state.index * (tabWidth + 4),
      friction: 9,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, indicatorX]);

  if (focusedRoute && HIDDEN_TABBAR_SCREENS.includes(focusedRoute)) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Animated active background pill */}
        <Animated.View
          style={[
            styles.activePill,
            {
              width: tabWidth,
              transform: [{ translateX: indicatorX }],
            },
          ]}
        />

        {/* Tab buttons */}
        <View style={styles.tabRow}>
          {TABS.map((tab, index) => {
            const isFocused = state.index === index;
            const route = state.routes[index];

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
                style={[styles.tabItem, { width: tabWidth }]}
                activeOpacity={0.85}
              >
                <TabItemIcon name={tab.icon} size={22} isFocused={isFocused} />
                <TabItemLabel text={tab.label} isFocused={isFocused} style={styles.labelEn} />
                <TabItemLabel text={tab.labelHi} isFocused={isFocused} style={styles.labelHi} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.safeAreaBottom} />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB ITEM SUB-COMPONENT (static — avoids Animated.Value freeze)
// ═══════════════════════════════════════════════════════════════

function TabItemIcon({ name, size, isFocused }: { name: string; size: number; isFocused: boolean }) {
  return <Icon name={name} size={size} color={isFocused ? Colors.white : 'rgba(255,255,255,0.55)'} />;
}

function TabItemLabel({ text, isFocused, style }: { text: string; isFocused: boolean; style: any }) {
  return <Typography variant="caption" style={[style, { opacity: isFocused ? 1 : 0.6 }]}>{text}</Typography>;
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary700,
    marginHorizontal: 16,
    marginBottom: Platform.select({ ios: 20, android: 12 }),
    borderRadius: Radius.xl,
    padding: 4,
    ...Shadows.strong,
  },
  activePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    ...Shadows.subtle,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: Radius.lg,
    minHeight: 50,
    zIndex: 1,
  },
  labelEn: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelHi: {
    fontSize: 8,
    fontWeight: '500',
    color: Colors.white,
    marginTop: 1,
    opacity: 0.85,
  },
  safeAreaBottom: {
    height: Platform.select({ ios: 0, android: 4 }),
  },
});
