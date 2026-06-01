/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SCREEN LAYOUT
 * ═══════════════════════════════════════════════════════════════
 *
 * WRAPPER component that EVERY screen should use.
 * Provides:
 *   1. GlobalHeader (orchard-aware, weather, notifications)
 *   2. Scrollable content area
 *   3. Safe bottom padding for the tab bar
 *
 * Usage:
 *   <ScreenLayout>
 *     <YourContent />
 *   </ScreenLayout>
 *
 * For screens that manage their own scroll (e.g. FlatList):
 *   <ScreenLayout scrollable={false}>
 *     <FlatList ... />
 *   </ScreenLayout>
 */

import React, { useRef, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  RefreshControl,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import GlobalHeader from './GlobalHeader';
import { TAB_BAR_TOTAL_HEIGHT } from '../navigation/CustomTabBar';

// Scroll distance (in px) before header enters compact mode
const COMPACT_THRESHOLD = 50;

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Extra padding at bottom (default: safe area + tab bar + 16px) */
  bottomPadding?: number;
  /** When false, children manage their own scroll (e.g. FlatList) */
  scrollable?: boolean;
  /** Pull-to-refresh control */
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function ScreenLayout({
  children,
  bottomPadding,
  scrollable = true,
  refreshing,
  onRefresh,
}: ScreenLayoutProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding: system safe-area + tab bar height + extra spacing.
  // This ensures content never hides behind the tab bar or system nav buttons.
  const computedBottomPadding = bottomPadding ?? (insets.bottom + TAB_BAR_TOTAL_HEIGHT + 16);
  // Animated value: 0 = at top, 1 = scrolled past threshold
  const scrollProgress = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      scrollY.current = y;
      const progress = Math.min(y / COMPACT_THRESHOLD, 1);
      scrollProgress.setValue(progress);
    },
    [scrollProgress]
  );

  return (
    <View style={styles.container}>
      {/* Global Header — self-contained (fetches its own data) */}
      <GlobalHeader scrollProgress={scrollProgress} />

      {scrollable ? (
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: computedBottomPadding }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
            ) : undefined
          }
        >
          {children}
        </Animated.ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
