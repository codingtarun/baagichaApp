/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GLOBAL HEADER (Orchard-Aware)
 * ═══════════════════════════════════════════════════════════════
 *
 * Compact header shown on ALL screens. Features:
 *   • Orchard location dropdown (tap to switch)
 *   • Live weather for selected orchard
 *   • Notification bell with unread badge
 *   • Collapses on scroll to save space
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { useAuthStore } from '../store/authStore';
import { useOrchardStore } from '../store/orchardStore';
import { fetchWeather, type WeatherData } from '../services/weatherApi';
import { fetchOrchards, type Orchard } from '../services/orchardApi';
import { fetchUnreadCount } from '../api/notifications';
import { navigationRef } from '../navigation/navigationRef';

interface GlobalHeaderProps {
  scrollProgress?: Animated.Value;
}

export default function GlobalHeader({
  scrollProgress,
}: GlobalHeaderProps): React.JSX.Element {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const orchards = useOrchardStore((s) => s.orchards);
  const selectedOrchardId = useOrchardStore((s) => s.selectedOrchardId);
  const selectOrchard = useOrchardStore((s) => s.selectOrchard);
  const setOrchards = useOrchardStore((s) => s.setOrchards);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingOrchards, setLoadingOrchards] = useState(false);

  const hasFetched = useRef(false);

  // ── Load orchards once on mount when authenticated ──
  useEffect(() => {
    if (!isAuthenticated || hasFetched.current) return;
    hasFetched.current = true;

    setLoadingOrchards(true);
    fetchOrchards()
      .then((res) => {
        const list: Orchard[] = res.data ?? [];
        setOrchards(
          list.map((o) => ({
            id: o.id,
            orchard_name: o.orchard_name,
            village: o.village,
            district: o.district,
            state: o.state,
            altitude_meters: o.altitude_meters,
            latitude: o.latitude,
            longitude: o.longitude,
          }))
        );
      })
      .catch((err) => console.warn('[GlobalHeader] Failed to fetch orchards:', err))
      .finally(() => setLoadingOrchards(false));
  }, [isAuthenticated, setOrchards]);

  // ── Fetch weather when selected orchard changes ──
  useEffect(() => {
    if (!isAuthenticated) return;

    const orchard = orchards.find((o) => o.id === selectedOrchardId);
    if (orchard?.latitude && orchard?.longitude) {
      fetchWeather(orchard.latitude, orchard.longitude, orchard.orchard_name)
        .then((res) => {
          if (res.success) setWeather(res.data);
        })
        .catch((err) => console.warn('[GlobalHeader] Weather fetch failed:', err));
    } else {
      // Fallback: fetch weather for user (backend uses primary orchard or device location)
      fetchWeather()
        .then((res) => {
          if (res.success) setWeather(res.data);
        })
        .catch((err) => console.warn('[GlobalHeader] Weather fetch failed:', err));
    }
  }, [isAuthenticated, selectedOrchardId, orchards]);

  // ── Poll unread notification count ──
  useEffect(() => {
    if (!isAuthenticated) return;

    const load = () => {
      fetchUnreadCount()
        .then((res) => {
          if (res.success) setUnreadCount(res.data.unread_count);
        })
        .catch(() => {});
    };

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // ── Scroll animation (only when scrollProgress is provided) ──
  const headerPaddingTop = scrollProgress
    ? scrollProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [Platform.select({ ios: 48, android: 36 }) ?? 36, Platform.select({ ios: 44, android: 32 }) ?? 32],
        extrapolate: 'clamp',
      })
    : (Platform.select({ ios: 48, android: 36 }) ?? 36);

  const headerPaddingBottom = scrollProgress
    ? scrollProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 6],
        extrapolate: 'clamp',
      })
    : 10;

  // ── Orchard switch handler ──
  const handleOrchardSelect = useCallback(
    (id: number) => {
      selectOrchard(id);
      setShowDropdown(false);
      // TODO: emit event or callback so screens can refetch orchard-specific data
    },
    [selectOrchard]
  );

  // ── Navigate to add orchard ──
  const handleAddOrchard = useCallback(() => {
    setShowDropdown(false);
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('MainTabs', { screen: 'MyOrchard' });
    }
  }, []);

  // ── Navigate to notifications ──
  const handleNotificationPress = useCallback(() => {
    if (navigationRef.isReady()) {
      (navigationRef as any).navigate('MainTabs', {
        screen: 'Home',
        params: { screen: 'Notifications' },
      });
    }
  }, []);

  // ── Location text ──
  const selectedOrchard = orchards.find((o) => o.id === selectedOrchardId);
  const locationText = selectedOrchard
    ? [selectedOrchard.village, selectedOrchard.district]
        .filter(Boolean)
        .join(', ') || selectedOrchard.orchard_name
    : user?.profile?.village
    ? [user.profile.village, user.profile.district, user.profile.state]
        .filter(Boolean)
        .join(', ')
    : 'Select Location';

  const altitudeText = selectedOrchard?.altitude_meters
    ? ` · ${selectedOrchard.altitude_meters}m`
    : '';

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            paddingTop: headerPaddingTop,
            paddingBottom: headerPaddingBottom,
          },
        ]}
      >
        {/* MAIN ROW */}
        <View style={styles.mainRow}>
          {/* Left: App name + Location */}
          <View style={styles.leftBlock}>
            <Typography variant="body" style={styles.appName}>
              Baagicha
            </Typography>

            <TouchableOpacity
              style={styles.locationChip}
              onPress={() => orchards.length > 0 && setShowDropdown(true)}
              activeOpacity={0.7}
              disabled={orchards.length === 0}
            >
              <Icon name="map-marker" size={10} color={Colors.accent} />
              <Typography variant="overline" style={styles.locationText} numberOfLines={1}>
                {locationText}
                {altitudeText}
              </Typography>
              {orchards.length > 0 && (
                <Icon name="chevron-down" size={10} color="rgba(255,255,255,0.5)" />
              )}
            </TouchableOpacity>
          </View>

          {/* Center: Weather */}
          <TouchableOpacity style={styles.weatherBlock} activeOpacity={0.7}>
            <Icon name="weather-partly-cloudy" size={16} color={Colors.accent} />
            <Typography variant="chipText" style={styles.tempText}>
              {weather?.temperature ?? '--'}°
            </Typography>
          </TouchableOpacity>

          {/* Right: Notification */}
          <TouchableOpacity style={styles.notifButton} onPress={handleNotificationPress} activeOpacity={0.7}>
            <Icon
              name={unreadCount > 0 ? 'bell' : 'bell-outline'}
              size={18}
              color={Colors.white}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Typography variant="overline" style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Typography>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ORCHARD DROPDOWN MODAL */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Typography variant="cardTitle">Your Orchards</Typography>
              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <Icon name="close" size={20} color={Colors.gray500} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dropdownList} showsVerticalScrollIndicator={false}>
              {orchards.map((orchard) => (
                <TouchableOpacity
                  key={orchard.id}
                  style={[
                    styles.orchardItem,
                    orchard.id === selectedOrchardId && styles.orchardItemActive,
                  ]}
                  onPress={() => handleOrchardSelect(orchard.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.orchardIcon}>
                    <Icon name="sprout" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.orchardInfo}>
                    <Typography
                      variant="body"
                      style={
                        orchard.id === selectedOrchardId
                          ? styles.orchardNameActive
                          : undefined
                      }
                    >
                      {orchard.orchard_name}
                    </Typography>
                    <Typography variant="caption" color={Colors.gray400}>
                      {[orchard.village, orchard.district, orchard.state]
                        .filter(Boolean)
                        .join(', ')}
                      {orchard.altitude_meters ? ` · ${orchard.altitude_meters}m` : ''}
                    </Typography>
                  </View>
                  {orchard.id === selectedOrchardId && (
                    <Icon name="check-circle" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}

              {/* Add Orchard button */}
              <TouchableOpacity
                style={styles.addOrchardItem}
                onPress={handleAddOrchard}
                activeOpacity={0.7}
              >
                <View style={[styles.orchardIcon, { backgroundColor: Colors.primaryLight }]}
                >
                  <Icon name="plus" size={18} color={Colors.primary} />
                </View>
                <Typography variant="body" color={Colors.primary}>
                  Add New Orchard
                </Typography>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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

  appName: {
    color: Colors.white,
    fontSize: 16,
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
    maxWidth: 160,
  },

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
    borderColor: Colors.primary,
    paddingHorizontal: 2,
  },

  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700',
  },

  // ── Dropdown Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    paddingTop: Platform.select({ ios: 100, android: 80 }),
    paddingHorizontal: 16,
  },

  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    ...Shadows.strong,
    maxHeight: 400,
    overflow: 'hidden',
  },

  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },

  dropdownList: {
    paddingVertical: 4,
  },

  orchardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  orchardItemActive: {
    backgroundColor: Colors.primaryLight,
  },

  orchardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orchardInfo: {
    flex: 1,
    gap: 2,
  },

  orchardNameActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  addOrchardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    marginTop: 4,
  },
});
