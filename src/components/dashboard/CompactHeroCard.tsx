/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMPACT HERO CARD
 * ═══════════════════════════════════════════════════════════════
 *
 * Condensed orchard stage card for the Home screen Farming Dashboard.
 * Shows stage name, progress bar, days left, and micro weather row.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

export interface CompactHeroStage {
  name: string;
  nameHi: string;
  period: string;
  progress: number;
  daysLeft: number;
  nextStage?: string;
  nextStageHi?: string;
}

export interface CompactHeroWeather {
  temp: number;
  wind: number;
  rain: number;
  suitType: 'perfect' | 'caution' | 'avoid';
  suitLabel: string;
  suitLabelHi: string;
}

interface CompactHeroCardProps {
  stage: CompactHeroStage;
  weather: CompactHeroWeather;
}

const SUIT_CONFIG: Record<string, { icon: string; color: string }> = {
  perfect: { icon: 'check-circle', color: Colors.success },
  caution: { icon: 'alert-circle', color: Colors.warning },
  avoid: { icon: 'close-circle', color: Colors.danger },
};

export default function CompactHeroCard({ stage, weather }: CompactHeroCardProps): React.JSX.Element {
  const suit = SUIT_CONFIG[weather.suitType];

  return (
    <View style={styles.card}>
      {/* Top row: period + days left */}
      <View style={styles.topRow}>
        <Typography variant="caption" style={styles.period}>{stage.period}</Typography>
        <Typography variant="caption" style={styles.daysLeft}>⏳ {stage.daysLeft}d left</Typography>
      </View>

      {/* Stage name */}
      <View style={styles.stageRow}>
        <View style={styles.iconWrap}>
          <Icon name="seedling" size={20} color={Colors.primaryLight} />
        </View>
        <View style={styles.stageText}>
          <Typography variant="displaySubheading" style={styles.stageName}>{stage.name}</Typography>
          <Typography variant="hindiDisplayHero" style={styles.stageNameHi}>{stage.nameHi}</Typography>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${stage.progress}%` }]} />
      </View>
      <View style={styles.progressMeta}>
        <Typography variant="caption" style={styles.progressPct}>{stage.progress}%</Typography>
        {stage.nextStage && (
          <Typography variant="caption" style={styles.nextStage}>
            Next: {stage.nextStage}
          </Typography>
        )}
      </View>

      {/* Micro weather row */}
      <View style={styles.weatherRow}>
        <View style={styles.weatherItem}>
          <Icon name="thermometer" size={14} color="rgba(255,255,255,0.7)" />
          <Typography variant="caption" style={styles.weatherText}>{weather.temp}°C</Typography>
        </View>
        <View style={styles.weatherItem}>
          <Icon name="weather-windy" size={14} color="rgba(255,255,255,0.7)" />
          <Typography variant="caption" style={styles.weatherText}>{weather.wind}km/h</Typography>
        </View>
        <View style={styles.weatherItem}>
          <Icon name="water" size={14} color="rgba(255,255,255,0.7)" />
          <Typography variant="caption" style={styles.weatherText}>{weather.rain}%</Typography>
        </View>
        <View style={[styles.suitBadge, { backgroundColor: suit.color + '20' }]}>
          <Icon name={suit.icon} size={12} color={suit.color} />
          <Typography variant="caption" style={[styles.suitText, { color: suit.color }]}>
            {weather.suitLabel}
          </Typography>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 4,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  period: {
    color: 'rgba(255,255,255,0.5)',
  },
  daysLeft: {
    color: Colors.accent,
    fontWeight: '700',
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageText: {
    flex: 1,
  },
  stageName: {
    fontSize: 17,
    color: Colors.white,
  },
  stageNameHi: {
    fontSize: 12,
    marginTop: 1,
    color: 'rgba(255,255,255,0.45)',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPct: {
    color: Colors.accent,
    fontWeight: '700',
  },
  nextStage: {
    color: 'rgba(255,255,255,0.35)',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weatherText: {
    color: 'rgba(255,255,255,0.7)',
  },
  suitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  suitText: {
    fontWeight: '700',
    fontSize: 11,
  },
});
