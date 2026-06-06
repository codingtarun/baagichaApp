/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SEGMENTED CONTROL
 * ═══════════════════════════════════════════════════════════════
 *
 * Pill-style bilingual segmented control for switching between
 * views (e.g., My Farm / Community) on the Home screen.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';

export interface Segment {
  key: string;
  label: string;
  labelHi: string;
  icon?: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function SegmentedControl({ segments, activeKey, onChange }: SegmentedControlProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const isActive = activeKey === segment.key;
        return (
          <TouchableOpacity
            key={segment.key}
            style={[styles.pill, isActive && styles.pillActive]}
            onPress={() => onChange(segment.key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${segment.label} / ${segment.labelHi}`}
          >
            <Typography
              variant="bodySmall"
              style={[styles.label, isActive && styles.labelActive]}
              numberOfLines={1}
            >
              {segment.label}
            </Typography>
            <Typography
              variant="hindiMicro"
              style={[styles.labelHi, isActive && styles.labelHiActive]}
              numberOfLines={1}
            >
              {segment.labelHi}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.surface,
    minHeight: 32,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontWeight: '600',
    color: Colors.gray600,
    fontSize: 12,
  },
  labelActive: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  labelHi: {
    color: Colors.gray400,
    marginTop: 0,
    fontSize: 8,
  },
  labelHiActive: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
  },
});
