/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WEATHER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Current weather widget, 7-day forecast list, hourly scroll,
 * spray suitability for each day, and weather alerts.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import PressableScale from '../components/PressableScale';
import EmptyState from '../components/EmptyState';

// Mock data
const CURRENT = {
  temp: 18,
  condition: 'Partly Cloudy',
  conditionHi: 'आंशिक रूप से बादलवाह',
  high: 20,
  low: 5,
  humidity: 62,
  wind: 8,
  rainChance: 15,
  spraySuit: 'perfect' as const,
};

const HOURLY = [
  { time: '6 AM', temp: 6, icon: 'weather-night-partly-cloudy', iconColor: Colors.gray400 },
  { time: '9 AM', temp: 12, icon: 'weather-partly-cloudy', iconColor: '#f59e0b' },
  { time: '12 PM', temp: 18, icon: 'weather-sunny', iconColor: '#f59e0b' },
  { time: '3 PM', temp: 19, icon: 'weather-sunny', iconColor: '#f59e0b' },
  { time: '6 PM', temp: 14, icon: 'weather-partly-cloudy', iconColor: '#64748b' },
  { time: '9 PM', temp: 8, icon: 'weather-night', iconColor: Colors.gray400 },
];

const DAILY = [
  { day: 'Sun', dayHi: 'रवि', date: 'Mar 9', icon: 'weather-sunny', iconColor: '#f59e0b', high: 18, low: 4, wind: 8, rain: 10, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'Mon', dayHi: 'सोम', date: 'Mar 10', icon: 'weather-partly-cloudy', iconColor: '#64748b', high: 17, low: 5, wind: 10, rain: 20, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'Tue', dayHi: 'मंगल', date: 'Mar 11', icon: 'weather-rainy', iconColor: '#3b82f6', high: 14, low: 3, wind: 14, rain: 70, suit: 'avoid' as const, suitLabel: 'Avoid', suitHi: 'टालें' },
  { day: 'Wed', dayHi: 'बुध', date: 'Mar 12', icon: 'weather-cloudy', iconColor: '#94a3b8', high: 15, low: 4, wind: 12, rain: 40, suit: 'caution' as const, suitLabel: 'Caution', suitHi: 'सावधानी' },
  { day: 'Thu', dayHi: 'गुरु', date: 'Mar 13', icon: 'weather-partly-cloudy', iconColor: '#64748b', high: 16, low: 5, wind: 9, rain: 15, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'Fri', dayHi: 'शुक्र', date: 'Mar 14', icon: 'weather-sunny', iconColor: '#f59e0b', high: 19, low: 6, wind: 7, rain: 5, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
  { day: 'Sat', dayHi: 'शनि', date: 'Mar 15', icon: 'weather-partly-cloudy', iconColor: '#64748b', high: 18, low: 5, wind: 10, rain: 20, suit: 'perfect' as const, suitLabel: 'Good', suitHi: 'उचित' },
];

const SUIT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  perfect: { icon: 'check-circle', color: Colors.success, bg: Colors.success + '12' },
  caution: { icon: 'alert-circle', color: Colors.warning, bg: Colors.warning + '12' },
  avoid:   { icon: 'close-circle', color: Colors.danger, bg: Colors.danger + '12' },
};

export default function WeatherScreen(): React.JSX.Element {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const currentSuit = SUIT_CONFIG[CURRENT.spraySuit];

  return (
    <ScreenLayout refreshing={refreshing} onRefresh={onRefresh}>
      {/* Current Weather Card */}
      <View style={styles.currentCard}>
        <View style={styles.currentTop}>
          <View>
            <Typography variant="displayHeading" style={styles.currentTemp}>{CURRENT.temp}°</Typography>
            <Typography variant="body" style={styles.currentCondition}>{CURRENT.condition}</Typography>
            <Typography variant="hindiBody">{CURRENT.conditionHi}</Typography>
          </View>
          <Icon name="weather-partly-cloudy" size={56} color={Colors.accent} />
        </View>
        <View style={styles.currentMeta}>
          <MetaPill icon="arrow-up" label={`High ${CURRENT.high}°`} />
          <MetaPill icon="arrow-down" label={`Low ${CURRENT.low}°`} />
          <MetaPill icon="water-percent" label={`${CURRENT.humidity}%`} />
          <MetaPill icon="weather-windy" label={`${CURRENT.wind} km/h`} />
        </View>
        <View style={[styles.suitBanner, { backgroundColor: currentSuit.bg }]}>
          <Icon name={currentSuit.icon} size={18} color={currentSuit.color} />
          <Typography variant="bodySmall" style={[styles.suitText, { color: currentSuit.color }]}>
            Spray Today: {currentSuit.icon === 'check-circle' ? 'Good Conditions' : 'Check Details'}
          </Typography>
        </View>
      </View>

      {/* Hourly */}
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Typography variant="sectionTitle" style={{ marginBottom: 12 }}>Hourly / प्रति घंटा</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
          {HOURLY.map((h, i) => (
            <View key={i} style={styles.hourCard}>
              <Typography variant="caption" style={{ color: Colors.gray500 }}>{h.time}</Typography>
              <Icon name={h.icon as any} size={24} color={h.iconColor} style={{ marginVertical: 8 }} />
              <Typography variant="body" style={{ fontWeight: '700', color: Colors.gray800 }}>{h.temp}°</Typography>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 7-Day Forecast */}
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Typography variant="sectionTitle" style={{ marginBottom: 12 }}>7-Day Forecast / 7-दिन का पूर्वानुमान</Typography>
        <View style={styles.dailyList}>
          {DAILY.map((d, i) => {
            const suit = SUIT_CONFIG[d.suit];
            return (
              <PressableScale key={i} scale={0.98}>
                <View style={styles.dailyRow}>
                  <View style={styles.dailyDay}>
                    <Typography variant="body" style={{ fontWeight: '700', color: Colors.gray800 }}>{d.day}</Typography>
                    <Typography variant="hindiMicro">{d.dayHi}</Typography>
                  </View>
                  <Icon name={d.icon as any} size={22} color={d.iconColor} style={{ marginHorizontal: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="caption" style={{ color: Colors.gray500 }}>{d.date}</Typography>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                      <Typography variant="caption"><Icon name="weather-windy" size={10} color={Colors.gray400} /> {d.wind}km/h</Typography>
                      <Typography variant="caption"><Icon name="water" size={10} color={Colors.gray400} /> {d.rain}%</Typography>
                    </View>
                  </View>
                  <View style={styles.dailyTemps}>
                    <Typography variant="bodySmall" style={{ fontWeight: '700', color: Colors.gray800 }}>{d.high}°</Typography>
                    <Typography variant="caption" style={{ color: Colors.gray400 }}>{d.low}°</Typography>
                  </View>
                  <View style={[styles.dailySuit, { backgroundColor: suit.bg }]}>
                    <Icon name={suit.icon} size={10} color={suit.color} />
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScreenLayout>
  );
}

function MetaPill({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaPill}>
      <Icon name={icon as any} size={12} color={Colors.gray400} />
      <Typography variant="caption" style={{ color: Colors.gray600, fontWeight: '600' }}>{label}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  currentCard: {
    backgroundColor: Colors.bgPrimary,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currentTemp: {
    fontSize: 48,
    color: Colors.white,
    lineHeight: 52,
  },
  currentCondition: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  currentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  suitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  suitText: {
    fontWeight: '700',
  },
  hourlyScroll: {
    gap: 10,
  },
  hourCard: {
    width: 72,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  dailyList: {
    gap: 8,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  dailyDay: {
    width: 50,
  },
  dailyTemps: {
    alignItems: 'flex-end',
    marginRight: 10,
    width: 40,
  },
  dailySuit: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
