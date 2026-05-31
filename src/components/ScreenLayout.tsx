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

import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  RefreshControl,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Colors } from '../theme/colors';
import GlobalHeader from './GlobalHeader';
import { fetchUnreadCount } from '../api/notifications';
import { navigationRef } from '../navigation/navigationRef';
import { useAuthStore } from '../store/authStore';

// Scroll distance (in px) before header enters compact mode
const COMPACT_THRESHOLD = 50;

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Extra padding at bottom (default 100 covers bottom tab bar) */
  /** Extra padding at bottom (default 120px covers custom tab bar + safe area) */
  bottomPadding?: number;
  /** Props passed through to GlobalHeader */
  headerProps?: Omit<React.ComponentProps<typeof GlobalHeader>, 'scrollProgress'>;
  /** Pull-to-refresh control — pass when screen loads remote data */
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function ScreenLayout({
  children,
  bottomPadding = 120,
  headerProps,
  refreshing,
  onRefresh,
}: ScreenLayoutProps): React.JSX.Element {
  // Unread notification count for the bell badge
  const [unreadCount, setUnreadCount] = useState(0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const response = await fetchUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (err) {
      console.warn('[ScreenLayout] Failed to fetch unread count:', err);
    }
  }, [isAuthenticated]);

  // Poll unread count on mount and every 30 seconds
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  const handleNotificationPress = useCallback(() => {
    if (navigationRef.isReady()) {
      // Navigate to MainTabs → Home → Notifications
      (navigationRef as any).navigate('MainTabs', {
        screen: 'Home',
        params: { screen: 'Notifications' },
      });
    }
  }, []);

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
      <GlobalHeader
        scrollProgress={scrollProgress}
        notificationCount={unreadCount}
        onNotificationPress={handleNotificationPress}
        {...headerProps}
      />

      {/* Scrollable content area */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // 60fps updates
        onScroll={handleScroll}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          ) : undefined
        }
      >
        {children}
      </Animated.ScrollView>
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
});
