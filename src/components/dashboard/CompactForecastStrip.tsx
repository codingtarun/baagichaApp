/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMPACT FORECAST STRIP
 * ═══════════════════════════════════════════════════════════════
 *
 * Smaller 4-day forecast cards (64dp wide) with spray suitability.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

export interface CompactForecastDay {
  day: string;
  dayEn: string;
  date: string;
  icon: string;
  iconColor: string;
  high: number;
  low: number;
  suit: 'perfect' | 'caution' | 'avoid';
}

interface CompactForecastStripProps {
  forecast: CompactForecastDay[];
  onViewAll?: () => void;
}

const SUIT_ICONS: Record<string, string> = {
  perfect: 'check-circle',
  caution: 'alert-circle',
  avoid: 'close-circle',
};

const SUIT_COLORS: Record<string, string> = {
  perfect: Colors.success,
  caution: Colors.warning,
  avoid: Colors.danger,
};

export default function CompactForecastStrip({ forecast, onViewAll }: CompactForecastStripProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="displayHeading" style={styles.title}>Forecast</Typography>
        <Typography variant="hindiDisplaySection" style={styles.titleHi}>पूर्वानुमान</Typography>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAll}>
            <Typography variant="link" style={styles.viewAllText}>7-day →</Typography>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {forecast.map((f, i) => {
          const suitIcon = SUIT_ICONS[f.suit];
          const suitColor = SUIT_COLORS[f.suit];
          return (
            <View key={i} style={styles.card}>
              <Typography variant="caption" style={styles.day}>{f.dayEn}</Typography>
              <Typography variant="hindiMicro" style={styles.dayHi}>{f.day}</Typography>
              <Typography variant="captionMuted" style={styles.date}>{f.date}</Typography>
              <Icon name={f.icon as any} size={22} color={f.iconColor} style={styles.weatherIcon} />
              <View style={styles.temps}>
                <Typography variant="bodySmall" style={styles.high}>{f.high}°</Typography>
                <Typography variant="captionMuted" style={styles.low}>/{f.low}°</Typography>
              </View>
              <Icon name={suitIcon as any} size={14} color={suitColor} style={styles.suitIcon} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  titleHi: {
    color: Colors.gray400,
    flex: 1,
  },
  viewAll: {
    marginLeft: 'auto',
  },
  viewAllText: {
    fontSize: 12,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 2,
  },
  card: {
    width: 64,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 2,
  },
  day: {
    fontWeight: '700',
    color: Colors.gray700,
  },
  dayHi: {
    color: Colors.gray400,
    marginTop: -2,
  },
  date: {
    marginBottom: 4,
  },
  weatherIcon: {
    marginBottom: 4,
  },
  temps: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  high: {
    fontWeight: '800',
    color: Colors.gray900,
  },
  low: {
    fontSize: 10,
  },
  suitIcon: {
    marginTop: 2,
  },
});
