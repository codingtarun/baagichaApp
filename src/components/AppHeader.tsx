/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP HEADER
 * ═══════════════════════════════════════════════════════════════
 *
 * Custom header component that appears at the top of every screen.
 *
 * Layout:
 *   [LEFT]    PLUS button (add new orchard/item)
 *   [CENTER]  Mini weather widget (temp + condition)
 *   [RIGHT]   Notification bell with badge
 *
 * Background: primary color (dark green gradient)
 *
 * LEARN: This is a reusable component used across all screens.
 * Instead of copy-pasting the header into every screen, we import
 * this component. If we ever need to change the header design,
 * we change it in ONE place.
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

interface AppHeaderProps {
  /** Temperature value, e.g. "18" */
  temperature?: string;
  /** Weather condition text, e.g. "Sunny" */
  condition?: string;
  /** Humidity percentage, e.g. "45" */
  humidity?: string;
  /** Wind speed in km/h, e.g. "12" */
  windSpeed?: string;
  /** Spray suitability status */
  sprayStatus?: string;
  /** Number of unread notifications (0 = hide badge) */
  notificationCount?: number;
  /** Called when PLUS button is pressed */
  onPlusPress?: () => void;
  /** Called when weather widget is pressed */
  onWeatherPress?: () => void;
  /** Called when notification bell is pressed */
  onNotificationPress?: () => void;
}

export default function AppHeader({
  temperature = '18',
  condition = 'Sunny',
  humidity = '45',
  windSpeed = '12',
  sprayStatus = 'Safe to spray',
  notificationCount = 0,
  onPlusPress,
  onWeatherPress,
  onNotificationPress,
}: AppHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* ── LEFT: PLUS Button ── */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={onPlusPress}
        activeOpacity={0.7}
        accessibilityLabel="Add new item"
        accessibilityRole="button"
      >
        <Icon name="plus" size={16} color={Colors.white} />
      </TouchableOpacity>

      {/* ── CENTER: Weather Widget ── */}
      <TouchableOpacity
        style={styles.weatherWidget}
        onPress={onWeatherPress}
        activeOpacity={0.7}
        accessibilityLabel={`Weather: ${temperature} degrees, ${condition}, ${sprayStatus}`}
        accessibilityRole="button"
      >
        {/* Left: Icon + Temp */}
        <View style={styles.weatherLeft}>
          <Icon name="weather-partly-cloudy" size={18} color={Colors.accent} />
          <Typography variant="chipText" style={styles.tempText}>
            {temperature}°C
          </Typography>
        </View>

        {/* Divider */}
        <View style={styles.weatherDivider} />

        {/* Right: Condition + Meta + Spray Status */}
        <View style={styles.weatherRight}>
          <Typography variant="weatherDesc" style={styles.conditionText}>
            {condition}
          </Typography>
          <View style={styles.weatherMetaRow}>
            <Icon name="water-percent" size={10} color="rgba(255,255,255,0.6)" />
            <Typography variant="overline" style={styles.metaText}>
              {humidity}%
            </Typography>
            <Icon name="weather-windy" size={10} color="rgba(255,255,255,0.6)" />
            <Typography variant="overline" style={styles.metaText}>
              {windSpeed}
            </Typography>
          </View>
          <View style={styles.sprayStatusBadge}>
            <Icon name="spray-bottle" size={8} color={Colors.success} />
            <Typography variant="overline" style={styles.sprayStatusText}>
              {sprayStatus}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── RIGHT: Notification Bell ── */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
        accessibilityLabel={`Notifications, ${notificationCount} unread`}
        accessibilityRole="button"
      >
        <Icon
          name={notificationCount > 0 ? 'bell' : 'bell-outline'}
          size={18}
          color={Colors.white}
        />
        {/* Notification badge */}
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Typography variant="overline" style={styles.badgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Typography>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // LEARN: flexDirection: 'row' puts children side by side horizontally
    flexDirection: 'row',
    // space-between pushes left item to start, right item to end,
    // and center item to the middle
    justifyContent: 'space-between',
    alignItems: 'center',
    // Background uses the primary green color from our theme
    backgroundColor: Colors.primary,
    // Safe area padding for status bar (notch area)
    paddingTop: Platform.select({ ios: 4, android: 8 }),
    paddingHorizontal: 12,
    paddingBottom: 6,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android elevation
    elevation: 6,
  },

  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
    gap: 10,
    minWidth: 180,
    // LEARN: flexShrink prevents the widget from being squished
    // when the header has limited space
    flexShrink: 0,
  },

  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  weatherDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  weatherRight: {
    alignItems: 'flex-start',
    gap: 2,
  },

  tempText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  conditionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    fontWeight: '600',
  },

  weatherMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  metaText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 8,
    fontWeight: '500',
    marginRight: 4,
  },

  sprayStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 999,
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginTop: 1,
  },

  sprayStatusText: {
    color: '#4ade80',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  notificationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // LEARN: position: 'relative' is needed so the badge (position: 'absolute')
    // positions itself relative to this button, not the whole screen
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
    borderColor: Colors.primary,
    paddingHorizontal: 3,
  },

  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 9,
  },
});
