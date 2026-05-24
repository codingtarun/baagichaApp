/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FORECAST STRIP (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Horizontal scroll of 4-day forecast cards with spray suitability.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';

export interface ForecastDay {
  day: string;
  dayEn: string;
  date: string;
  icon: string;
  iconColor: string;
  high: number;
  low: number;
  wind: number;
  rain: number;
  suit: 'perfect' | 'caution' | 'avoid';
  suitLabel: string;
  suitHi: string;
}

interface ForecastStripProps {
  forecast: ForecastDay[];
  location?: string;
  onViewAll?: () => void;
}

const SUIT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  perfect: { icon: 'check-circle', color: Colors.success, bg: Colors.success + '12' },
  caution: { icon: 'alert-circle', color: Colors.warning, bg: Colors.warning + '12' },
  avoid:   { icon: 'close-circle', color: Colors.danger, bg: Colors.danger + '12' },
};

export default function ForecastStrip({ forecast, location, onViewAll }: ForecastStripProps): React.JSX.Element {
  if (forecast.length === 0) {
    return (
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <SectionHeader icon="weather-partly-cloudy" title="Forecast" titleHi="पूर्वानुमान" actionLabel="7-day" onAction={onViewAll} />
        <View style={styles.empty}>
          <Icon name="weather-partly-cloudy" size={32} color={Colors.gray300} />
          <Typography variant="bodyMuted" center style={{ marginTop: 8 }}>
            Weather forecast not available yet.
          </Typography>
          <Typography variant="hindiBody" center>
            मौसम पूर्वानुमान अभी उपलब्ध नहीं है
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <SectionHeader
          icon="weather-partly-cloudy"
          title="Forecast"
          titleHi="पूर्वानुमान"
          actionLabel="7-day"
          onAction={onViewAll}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {forecast.map((f, i) => {
          const suit = SUIT_CONFIG[f.suit];
          return (
            <View key={i} style={[styles.card, { borderTopColor: suit.color }]}>
              <View style={styles.dayWrap}>
                <Typography variant="forecastDayHi">{f.day}</Typography>
                <Typography variant="forecastDayEn">{f.dayEn}</Typography>
              </View>
              <Typography variant="forecastDate" style={styles.date}>{f.date}</Typography>
              <Icon name={f.icon as any} size={28} color={f.iconColor} style={styles.weatherIcon} />
              <View style={styles.temps}>
                <Typography variant="forecastHigh">{f.high}°</Typography>
                <Typography variant="forecastLow">/ {f.low}°</Typography>
              </View>
              <View style={styles.meta}>
                <Typography variant="forecastMeta"><Icon name="weather-windy" size={10} color={Colors.gray400} /> {f.wind}km/h</Typography>
                <Typography variant="forecastMeta"><Icon name="water" size={10} color={Colors.gray400} /> {f.rain}%</Typography>
              </View>
              <View style={[styles.suitBadge, { backgroundColor: suit.bg }]}>
                <Icon name={suit.icon} size={10} color={suit.color} />
                <Typography variant="overline" style={{ fontSize: 9, color: suit.color, fontWeight: '700' }}>{f.suitLabel}</Typography>
              </View>
              <Typography variant="hindiMicro" style={styles.suitHi}>{f.suitHi}</Typography>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },
  card: {
    width: 130,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dayWrap: {
    alignItems: 'center',
  },
  date: {
    marginTop: 2,
    marginBottom: 8,
  },
  weatherIcon: {
    marginBottom: 8,
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  suitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  suitHi: {
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
});
