/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SCREEN LAYOUT
 * ═══════════════════════════════════════════════════════════════
 *
 * WRAPPER component that EVERY screen should use.
 * It provides:
 *   1. GlobalHeader (greeting, weather, stats) — auto-compacts on scroll
 *   2. Animated.ScrollView — detects scroll position
 *   3. Safe bottom padding — avoids the bottom tab bar
 *   4. Consistent background color
 *
 * LEARN: Instead of copy-pasting <AppHeader /> + <ScrollView> into
 * every screen, we wrap the screen content with <ScreenLayout>.
 * The header behavior (compact on scroll) is handled automatically.
 *
 * Usage in any screen:
 *   <ScreenLayout>
 *     <YourContent />
 *   </ScreenLayout>
 */

import React, { useRef, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Colors } from '../theme/colors';
import GlobalHeader from './GlobalHeader';

// Scroll distance (in px) before header enters compact mode
const COMPACT_THRESHOLD = 50;

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Extra padding at bottom (default 100 covers bottom tab bar) */
  bottomPadding?: number;
  /** Props passed through to GlobalHeader */
  headerProps?: Omit<React.ComponentProps<typeof GlobalHeader>, 'scrollProgress'>;
}

export default function ScreenLayout({
  children,
  bottomPadding = 100,
  headerProps,
}: ScreenLayoutProps): React.JSX.Element {
  // Animated value: 0 = at top, 1 = scrolled past threshold
  const scrollProgress = useRef(new Animated.Value(0)).current;

  // Track raw scroll Y for direct comparison
  const scrollY = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      scrollY.current = y;

      // Calculate progress: 0 when y=0, 1 when y >= COMPACT_THRESHOLD
      const progress = Math.min(y / COMPACT_THRESHOLD, 1);

      // Use setValue for smooth native-driven animation
      scrollProgress.setValue(progress);
    },
    [scrollProgress],
  );

  return (
    <View style={styles.container}>
      {/* Global Header — receives scroll progress for compact animation */}
      <GlobalHeader scrollProgress={scrollProgress} {...headerProps} />

      {/* Scrollable content area */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // 60fps updates
        onScroll={handleScroll}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
});
