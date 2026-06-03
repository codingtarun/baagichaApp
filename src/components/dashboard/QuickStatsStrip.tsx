/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — QUICK STATS STRIP
 * ═══════════════════════════════════════════════════════════════
 *
 * 4 key metrics in a single horizontal card.
 * Inspired by LeafSnap "My Plants" reference design.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

export interface QuickStat {
  key: string;
  icon: string;
  value: string;
  label: string;
  labelHi: string;
  color: string;
  onPress?: () => void;
}

interface QuickStatsStripProps {
  stats: QuickStat[];
}

export default function QuickStatsStrip({ stats }: QuickStatsStripProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {stats.map((stat) => (
          <TouchableOpacity
            key={stat.key}
            style={styles.stat}
            onPress={stat.onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: stat.color + '14' }]}>
              <Icon name={stat.icon as any} size={18} color={stat.color} />
            </View>
            <Typography variant="body" style={[styles.value, { color: stat.color }]}>
              {stat.value}
            </Typography>
            <Typography variant="caption" style={styles.label}>{stat.label}</Typography>
            <Typography variant="hindiMicro" style={styles.labelHi}>{stat.labelHi}</Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  stat: {
    alignItems: 'center',
    minWidth: 64,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontWeight: '800',
    fontSize: 18,
  },
  label: {
    color: Colors.gray600,
    fontWeight: '600',
    marginTop: 1,
  },
  labelHi: {
    color: Colors.gray400,
    marginTop: 1,
  },
});
