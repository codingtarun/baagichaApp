import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Typography from './Typography';

interface StatTextProps {
  /** The numeric/stat value */
  value: string | number;
  /** The label below the value */
  label: string;
  /** Whether to render in compact mode (smaller) */
  compact?: boolean;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
}

/**
 * Stat Text — value + label pair used in header stat pills.
 *
 * Usage:
 *   <StatText value="14" label="Days to bloom" />
 *   <StatText value="3" label="Pending sprays" compact />
 */
export default function StatText({
  value,
  label,
  compact = false,
  style,
}: StatTextProps) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Typography variant={compact ? 'tempValueCompact' : 'statValue'}>
        {value}
      </Typography>
      <Typography variant="statLabel" style={{ marginTop: 2 }}>
        {label}
      </Typography>
    </View>
  );
}
