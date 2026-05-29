/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GLOBAL HEADER (Compact)
 * ═══════════════════════════════════════════════════════════════
 *
 * Compact header that maximizes screen real estate.
 * Collapses further when user scrolls down > 50px.
 *
 * Layout (Single dense row + stat chips):
 *   [Greeting + Location]  [Weather]  [Notif]
 *   [Bloom] [Sprays] [Mandi] — inline mini chips
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

interface GlobalHeaderProps {
  scrollProgress: Animated.Value;
  farmerName?: string;
  location?: string;
  temperature?: string;
  condition?: string;
  sprayStatus?: string;
  daysToBloom?: number;
  pendingSprays?: number;
  mandiTrend?: string;
  notificationCount?: number;
  onLocationPress?: () => void;
  onWeatherPress?: () => void;
  onNotificationPress?: () => void;
}

export default function GlobalHeader({
  scrollProgress,
  farmerName = 'Ramesh',
  location = 'Shimla, HP',
  temperature = '18',
  condition = 'Sunny',
  sprayStatus = 'Safe',
  daysToBloom = 14,
  pendingSprays = 3,
  mandiTrend = '+₹12',
  notificationCount = 0,
  onLocationPress,
  onWeatherPress,
  onNotificationPress,
}: GlobalHeaderProps): React.JSX.Element {
  const headerPaddingTop = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [Platform.select({ ios: 48, android: 36 }), Platform.select({ ios: 44, android: 32 })],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 6],
    extrapolate: 'clamp',
  });

  const statsOpacity = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const statsHeight = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
    extrapolate: 'clamp',
  });

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const getMandiColor = (): string => {
    if (mandiTrend.startsWith('+')) return Colors.success;
    if (mandiTrend.startsWith('-')) return Colors.danger;
    return Colors.gray400;
  };

  const getSprayColor = (): string => {
    if (sprayStatus.toLowerCase().includes('safe')) return Colors.success;
    if (sprayStatus.toLowerCase().includes('caution')) return Colors.warning;
    return Colors.danger;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
        },
      ]}
    >
      {/* ═══════════════════════════════════════════
          MAIN ROW: Greeting | Weather | Notif
         ═══════════════════════════════════════════ */}
      <View style={styles.mainRow}>
        {/* Left: Greeting + Location */}
        <View style={styles.leftBlock}>
          <Typography variant="body" style={styles.greetingText}>
            {getGreeting()},{' '}
            <Typography variant="body" style={styles.nameText}>
              {farmerName}
            </Typography>
          </Typography>

          <TouchableOpacity
            style={styles.locationChip}
            onPress={onLocationPress}
            activeOpacity={0.7}
          >
            <Icon name="map-marker" size={10} color={Colors.accent} />
            <Typography variant="overline" style={styles.locationText}>
              {location}
            </Typography>
            <Icon name="chevron-down" size={10} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>

        {/* Center: Compact Weather */}
        <TouchableOpacity
          style={styles.weatherBlock}
          onPress={onWeatherPress}
          activeOpacity={0.7}
        >
          <Icon name="weather-partly-cloudy" size={16} color={Colors.accent} />
          <Typography variant="chipText" style={styles.tempText}>
            {temperature}°
          </Typography>
          <View style={[styles.sprayDot, { backgroundColor: getSprayColor() }]} />
        </TouchableOpacity>

        {/* Right: Notification */}
        <TouchableOpacity
          style={styles.notifButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Icon
            name={notificationCount > 0 ? 'bell' : 'bell-outline'}
            size={18}
            color={Colors.white}
          />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Typography variant="overline" style={styles.badgeText}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════
          MINI STATS ROW (collapses on scroll)
         ═══════════════════════════════════════════ */}
      <Animated.View
        style={[
          styles.statsRow,
          {
            opacity: statsOpacity,
            height: statsHeight,
          },
        ]}
      >
        <View style={styles.miniChip}>
          <Icon name="flower-tulip" size={10} color={Colors.accentLight} />
          <Typography variant="overline" style={styles.miniChipText}>
            Bloom <Typography variant="overline" style={styles.miniChipValue}>{daysToBloom}d</Typography>
          </Typography>
        </View>

        <View style={styles.miniDivider} />

        <View style={styles.miniChip}>
          <Icon name="spray-bottle" size={10} color={Colors.info} />
          <Typography variant="overline" style={styles.miniChipText}>
            Sprays <Typography variant="overline" style={styles.miniChipValue}>{pendingSprays}</Typography>
          </Typography>
        </View>

        <View style={styles.miniDivider} />

        <View style={styles.miniChip}>
          <Icon name="trending-up" size={10} color={getMandiColor()} />
          <Typography variant="overline" style={styles.miniChipText}>
            Mandi <Typography variant="overline" style={[styles.miniChipValue, { color: getMandiColor() }]}>{mandiTrend}</Typography>
          </Typography>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100,
  },

  // ── Main Row ──
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  leftBlock: {
    flex: 1,
    gap: 1,
  },

  greetingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },

  nameText: {
    color: Colors.white,
    fontWeight: '700',
  },

  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },

  locationText: {
    color: Colors.accentLight,
    fontSize: 10,
    fontWeight: '600',
  },

  // Weather
  weatherBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  tempText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  sprayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 2,
  },

  // Notification
  notifButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.danger,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.bgPrimary,
    paddingHorizontal: 2,
  },

  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700',
  },

  // ── Mini Stats Row ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 8,
    overflow: 'hidden',
  },

  miniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  miniChipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 9,
  },

  miniChipValue: {
    color: Colors.white,
    fontWeight: '700',
  },

  miniDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
