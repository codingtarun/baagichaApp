/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — QUICK ACTIONS GRID
 * ═══════════════════════════════════════════════════════════════
 *
 * 2×2 grid of the most common farmer actions.
 * Each card has a colored left border for quick visual scanning.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

export interface QuickAction {
  key: string;
  icon: string;
  label: string;
  labelHi: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export default function QuickActionsGrid({ actions }: QuickActionsGridProps): React.JSX.Element {
  return (
    <View style={styles.grid}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.key}
          style={styles.card}
          onPress={action.onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${action.label} / ${action.labelHi}`}
        >
          <View style={[styles.colorBar, { backgroundColor: action.color }]} />
          <View style={styles.content}>
            <Icon name={action.icon as any} size={22} color={action.color} />
            <Typography variant="bodySmall" style={[styles.label, { color: Colors.gray900 }]}>
              {action.label}
            </Typography>
            <Typography variant="hindiMicro" style={styles.labelHi}>
              {action.labelHi}
            </Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  card: {
    flexDirection: 'row',
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    minHeight: 72,
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 2,
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    marginTop: 2,
  },
  labelHi: {
    color: Colors.gray400,
  },
});
