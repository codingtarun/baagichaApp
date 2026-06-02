/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WEATHER SCREEN (Real Data)
 * ═══════════════════════════════════════════════════════════════
 *
 * Current weather widget, 7-day forecast list, hourly scroll,
 * spray suitability for each day, and weather alerts.
 * NOW WIRED TO REAL API via /weather/dashboard
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Shadows, Radius } from '../theme/style';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import PressableScale from '../components/PressableScale';
import EmptyState from '../components/EmptyState';
import {
  fetchWeatherDashboard,
  type WeatherDashboardData,
  type Forecast7Day,
} from '../services/weatherApi';
import { showToast } from '../store/toastStore';

const SUIT_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  excellent: { icon: 'check-circle', color: Colors.success, bg: Colors.success + '12', label: 'Excellent' },
  good:      { icon: 'check-circle', color: Colors.success, bg: Colors.success + '12', label: 'Good' },
  short:     { icon: 'alert-circle', color: Colors.warning, bg: Colors.warning + '12', label: 'Short' },
  caution:   { icon: 'alert-circle', color: Colors.warning, bg: Colors.warning + '12', label: 'Caution' },
  avoid:     { icon: 'close-circle',  color: Colors.danger,  bg: Colors.danger + '12',  label: 'Avoid' },
};

function getSuitConfig(day: Forecast7Day) {
  if (day.spray_suitable) return SUIT_CONFIG['good'];
  return SUIT_CONFIG['avoid'];
}

function mapConditionToIcon(condition: string): { icon: string; color: string } {
  const c = condition?.toLowerCase() ?? '';
  if (c.includes('rain')) return { icon: 'weather-rainy', color: '#3b82f6' };
  if (c.includes('cloud')) return { icon: 'weather-cloudy', color: '#64748b' };
  if (c.includes('partly')) return { icon: 'weather-partly-cloudy', color: '#f59e0b' };
  if (c.includes('clear') || c.includes('sun')) return { icon: 'weather-sunny', color: '#f59e0b' };
  if (c.includes('snow')) return { icon: 'weather-snowy', color: '#94a3b8' };
  if (c.includes('thunder') || c.includes('storm')) return { icon: 'weather-lightning', color: '#7c3aed' };
  if (c.includes('fog') || c.includes('mist')) return { icon: 'weather-fog', color: '#94a3b8' };
  return { icon: 'weather-partly-cloudy', color: '#f59e0b' };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

export default function WeatherScreen(): React.JSX.Element {
  const [dashboard, setDashboard] = useState<WeatherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await fetchWeatherDashboard();
      if (response.success) {
        setDashboard(response.data);
      } else {
        showToast({ message: 'Failed to load weather data', type: 'error' });
      }
    } catch (err: any) {
      showToast({ message: err?.message || 'Weather data unavailable', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Typography variant="bodyMuted" style={{ marginTop: 12 }}>Loading weather…</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (!dashboard) {
    return (
      <ScreenLayout refreshing={refreshing} onRefresh={onRefresh}>
        <EmptyState
          icon="weather-partly-cloudy"
          title="Weather Unavailable"
          subtitle="We couldn't load weather data. Please try again."
        />
      </ScreenLayout>
    );
  }

  const { current, today_recommendations, forecast_7d, active_alerts } = dashboard;
  const sprayRec = today_recommendations.spray;
  const spraySuit = SUIT_CONFIG[sprayRec.recommendation] ?? SUIT_CONFIG.avoid;
  const currentIcon = mapConditionToIcon(current.condition);

  return (
    <ScreenLayout refreshing={refreshing} onRefresh={onRefresh}>
      {/* Current Weather Card */}
      <View style={styles.currentCard}>
        <View style={styles.currentTop}>
          <View>
            <Typography variant="displayHeading" style={styles.currentTemp}>{Math.round(current.temp_c)}°</Typography>
            <Typography variant="body" style={styles.currentCondition}>{current.condition}</Typography>
            <Typography variant="hindiBody">{current.condition}</Typography>
          </View>
          <Icon name={currentIcon.icon as any} size={56} color={currentIcon.color} />
        </View>
        <View style={styles.currentMeta}>
          <MetaPill icon="water-percent" label={`${current.humidity_percent}%`} />
          <MetaPill icon="weather-windy" label={`${Math.round(current.wind_speed_kmh)} km/h`} />
          {current.delta_t !== null && (
            <MetaPill icon="thermometer" label={`ΔT ${current.delta_t}`} />
          )}
          {current.uv_index !== null && (
            <MetaPill icon="white-balance-sunny" label={`UV ${current.uv_index}`} />
          )}
        </View>
        <View style={[styles.suitBanner, { backgroundColor: spraySuit.bg }]}>
          <Icon name={spraySuit.icon as any} size={18} color={spraySuit.color} />
          <Typography variant="bodySmall" style={[styles.suitText, { color: spraySuit.color }]}>
            Spray: {sprayRec.recommendation.toUpperCase()} — {sprayRec.reason}
          </Typography>
        </View>
      </View>

      {/* Active Alerts */}
      {active_alerts.length > 0 && (
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Typography variant="sectionTitle" style={{ marginBottom: 10 }}>Alerts / चेतावनी</Typography>
          {active_alerts.map((alert, i) => (
            <View key={i} style={[styles.alertCard, { borderLeftColor: alert.severity === 'critical' ? Colors.danger : Colors.warning }]}>
              <Icon
                name={alert.severity === 'critical' ? 'alert-circle' : 'information-outline'}
                size={18}
                color={alert.severity === 'critical' ? Colors.danger : Colors.warning}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Typography variant="bodySmall" style={{ fontWeight: '700', color: Colors.gray900 }}>{alert.title}</Typography>
                <Typography variant="caption" style={{ color: Colors.gray600, marginTop: 2 }}>{alert.message}</Typography>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Fertigation Card */}
      {today_recommendations.fertigation && (
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Typography variant="sectionTitle" style={{ marginBottom: 10 }}>Fertigation / उर्वरक सलाह</Typography>
          <View style={styles.fertCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon
                name={today_recommendations.fertigation.recommendation === 'apply_now' ? 'check-circle' : 'close-circle'}
                size={20}
                color={today_recommendations.fertigation.recommendation === 'apply_now' ? Colors.success : Colors.danger}
              />
              <Typography variant="body" style={{ fontWeight: '700', color: Colors.gray900, flex: 1 }}>
                {today_recommendations.fertigation.recommendation === 'apply_now' ? 'Good for Fertigation' :
                 today_recommendations.fertigation.recommendation === 'wait_for_rain' ? 'Wait for Rain' :
                 today_recommendations.fertigation.recommendation === 'irrigate_first' ? 'Irrigate First' : 'Avoid Fertigation'}
              </Typography>
            </View>
            <Typography variant="bodySmall" style={{ color: Colors.gray600, marginTop: 6 }}>
              {today_recommendations.fertigation.reason}
            </Typography>
            {today_recommendations.fertigation.best_time && (
              <Typography variant="caption" style={{ color: Colors.accent, marginTop: 4, fontWeight: '600' }}>
                Suggested time: {today_recommendations.fertigation.best_time}
              </Typography>
            )}
          </View>
        </View>
      )}

      {/* Disease Risk */}
      {today_recommendations.disease_risk && (
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Typography variant="sectionTitle" style={{ marginBottom: 10 }}>Disease Risk / रोग जोखिम</Typography>
          <View style={styles.diseaseCard}>
            <View style={styles.diseaseHeader}>
              <Typography variant="body" style={{ fontWeight: '700', color: Colors.gray900 }}>
                Risk Score: {today_recommendations.disease_risk.score}/100
              </Typography>
              <View style={[styles.diseaseBadge, {
                backgroundColor: today_recommendations.disease_risk.level === 'high' || today_recommendations.disease_risk.level === 'critical'
                  ? Colors.danger + '18'
                  : today_recommendations.disease_risk.level === 'moderate'
                  ? Colors.warning + '18'
                  : Colors.success + '18'
              }]}>
                <Typography variant="caption" style={{
                  color: today_recommendations.disease_risk.level === 'high' || today_recommendations.disease_risk.level === 'critical'
                    ? Colors.danger
                    : today_recommendations.disease_risk.level === 'moderate'
                    ? Colors.warning
                    : Colors.success,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}>
                  {today_recommendations.disease_risk.level}
                </Typography>
              </View>
            </View>
            <Typography variant="bodySmall" style={{ color: Colors.gray600, marginTop: 6 }}>
              {today_recommendations.disease_risk.reason}
            </Typography>
            {today_recommendations.disease_risk.active_diseases.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {today_recommendations.disease_risk.active_diseases.map((disease, idx) => (
                  <View key={idx} style={styles.diseaseChip}>
                    <Typography variant="caption" style={{ color: Colors.danger, fontWeight: '600' }}>
                      {disease.replace('_', ' ')}
                    </Typography>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* 7-Day Forecast */}
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Typography variant="sectionTitle" style={{ marginBottom: 12 }}>7-Day Forecast / 7-दिन का पूर्वानुमान</Typography>
        <View style={styles.dailyList}>
          {forecast_7d.map((d, i) => {
            const suit = getSuitConfig(d);
            const iconInfo = mapConditionToIcon(d.condition);
            return (
              <PressableScale key={i} scale={0.98}>
                <View style={styles.dailyRow}>
                  <View style={styles.dailyDay}>
                    <Typography variant="body" style={{ fontWeight: '700', color: Colors.gray900 }}>{formatDay(d.date)}</Typography>
                    <Typography variant="caption" style={{ color: Colors.gray400 }}>{formatDate(d.date)}</Typography>
                  </View>
                  <Icon name={iconInfo.icon as any} size={22} color={iconInfo.color} style={{ marginHorizontal: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="caption" style={{ color: Colors.gray500 }}>{d.condition}</Typography>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                      <Typography variant="caption"><Icon name="water" size={10} color={Colors.gray400} /> {d.precipitation_mm}mm</Typography>
                    </View>
                  </View>
                  <View style={styles.dailyTemps}>
                    <Typography variant="bodySmall" style={{ fontWeight: '700', color: Colors.gray900 }}>
                      {d.temp_max_c !== null ? Math.round(d.temp_max_c) : '--'}°
                    </Typography>
                    <Typography variant="caption" style={{ color: Colors.gray400 }}>
                      {d.temp_min_c !== null ? Math.round(d.temp_min_c) : '--'}°
                    </Typography>
                  </View>
                  <View style={[styles.dailySuit, { backgroundColor: suit.bg }]}>
                    <Icon name={suit.icon as any} size={10} color={suit.color} />
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>

      <View style={{ height: 32 }} />
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  currentCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: Radius['2xl'],
    padding: 20,
    ...Shadows.medium,
  },
  currentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currentTemp: {
    fontSize: 48,
    color: Colors.gray900,
    lineHeight: 52,
  },
  currentCondition: {
    color: Colors.gray500,
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
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  suitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  suitText: {
    fontWeight: '700',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 4,
    ...Shadows.subtle,
  },
  fertCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 16,
    ...Shadows.subtle,
  },
  diseaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 16,
    ...Shadows.subtle,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diseaseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  diseaseChip: {
    backgroundColor: Colors.danger + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  dailyList: {
    gap: 8,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 12,
    ...Shadows.subtle,
  },
  dailyDay: {
    width: 70,
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
