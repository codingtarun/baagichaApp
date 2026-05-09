/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CUSTOM BOTTOM TAB BAR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: React Navigation lets us replace the default tab bar
 * with a completely custom component. This gives us full control
 * over the look and feel.
 *
 * Design matches the web app's bottom navigation:
 *   · Primary color background (green)
 *   · Icon on top, English label, Hindi label below
 *   · Active: lighter green background pill, white icon + text
 *   · Inactive: white icon + text at lower opacity
 *   · Icons spread evenly using flexbox
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// LEARN: We use MaterialCommunityIcons because it's the most
// reliably available icon set in react-native-vector-icons.
// If icons show as crosses, the font files need to be linked
// by rebuilding the app: npm run android / npm run ios
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

// ── Tab Configuration ──
// LEARN: Centralizing tab config makes it easy to add/remove tabs
// or change icons without hunting through component code.

interface TabConfig {
  name: string;        // Route name (must match navigator)
  label: string;       // English label
  labelHi: string;     // Hindi label
  icon: string;        // MaterialCommunityIcons icon name
}

// 4 main tabs - spread evenly across the screen
const TABS: TabConfig[] = [
  { name: 'Home', label: 'Home', labelHi: 'होम', icon: 'home' },
  { name: 'Spray', label: 'Spray', labelHi: 'स्प्रे', icon: 'spray-bottle' },
  { name: 'Shop', label: 'Shop', labelHi: 'दुकान', icon: 'store' },
  { name: 'Discover', label: 'Discover', labelHi: 'खोजें', icon: 'compass' },
  { name: 'MyOrchard', label: 'My Orchard', labelHi: 'मेरा बाग', icon: 'sprout' },
];

// ── Component ──

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element {

  return (
    <View style={styles.container}>
      {/*
        LEARN: With only 4 tabs, we use a flex row with
        justifyContent: 'space-around' instead of ScrollView.
        This spreads the 4 tabs evenly across the full width.
      */}
      <View style={styles.tabRow}>
        {TABS.map((tab, index) => {
          // Find if this tab is currently active
          const isFocused = state.index === index;

          // Get the navigation options for this screen (title, etc.)
          const route = state.routes[index];
          const { options } = descriptors[route.key];

          // Build accessibility label for screen readers
          const accessibilityLabel =
            options.tabBarAccessibilityLabel ?? tab.label;

          // Handle tab press
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            // LEARN: `canPreventDefault` lets listeners cancel the navigation.
            // If nobody canceled it and we're not already on this tab, navigate.
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={accessibilityLabel}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive, // Apply active styles
              ]}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <Icon
                name={tab.icon}
                size={isFocused ? 20 : 18}
                color={isFocused ? Colors.white : 'rgba(255,255,255,0.6)'}
                style={styles.icon}
              />

              {/* English Label */}
              <Typography
                variant={isFocused ? 'navLabelActive' : 'navLabel'}
                style={[
                  styles.labelEn,
                  { color: isFocused ? Colors.white : 'rgba(255,255,255,0.6)' },
                ]}
              >
                {tab.label}
              </Typography>

              {/* Hindi Label */}
              <Typography
                variant="hindiNavLabel"
                style={[
                  styles.labelHi,
                  { color: isFocused ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)' },
                ]}
              >
                {tab.labelHi}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      {/*
        LEARN: The home indicator (iPhone X+) sits at the bottom of
        the screen. We add extra padding so content doesn't overlap it.
        SafeAreaView handles this automatically, but for custom
        components we need to add it manually.
      */}
      <View style={styles.safeAreaBottom} />
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    // LEARN: Position the tab bar at the bottom of the screen
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    // Primary green background - matching the user's request
    backgroundColor: Colors.primary,

    // Rounded top corners - radius-xl from the design system
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    // Subtle top border for separation
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    // Android elevation
    elevation: 10,

    // Ensure the tab bar stays on top of content
    zIndex: 1000,
  },

  tabRow: {
    // LEARN: flexDirection: 'row' puts children side by side
    flexDirection: 'row',
    // space-around gives equal space AROUND each tab item
    // This evenly distributes the 4 tabs across the full width
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 4,
  },

  tabItem: {
    // LEARN: flex: 1 makes each tab take equal width
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginHorizontal: 2,
    borderRadius: 12,
    minHeight: 44,
  },

  // Active tab gets a lighter background pill
  tabItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  icon: {
    marginBottom: 2,
  },

  labelEn: {
    fontSize: 9,
    lineHeight: 11,
    marginTop: 1,
    fontWeight: '600',
  },

  labelHi: {
    fontSize: 7,
    lineHeight: 9,
    marginTop: 0,
  },

  // LEARN: Extra space at the bottom for iPhone home indicator
  // and Android gesture navigation bar
  safeAreaBottom: {
    height: Platform.select({ ios: 12, android: 4 }),
  },
});
