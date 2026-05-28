/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SECTION HEADER (Modernized)
 * ═══════════════════════════════════════════════════════════════
 *
 * Bold, clean section header with optional icon badge and action.
 * Updated for stronger visual hierarchy and modern spacing.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import { Typography } from '../typography';
import PressableScale from './PressableScale';

interface SectionHeaderProps {
  icon?: string;
  iconColor?: string;
  title: string;
  titleHi?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({
  icon,
  iconColor = Colors.primary,
  title,
  titleHi,
  actionLabel,
  onAction,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {icon && (
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
            <Icon name={icon} size={16} color={iconColor} />
          </View>
        )}
        <View>
          <Typography variant="sectionTitle" style={styles.title}>
            {title}
          </Typography>
          {titleHi && (
            <Typography variant="hindiDisplaySection" style={styles.titleHi}>
              {titleHi}
            </Typography>
          )}
        </View>
      </View>
      {actionLabel && onAction && (
        <PressableScale onPress={onAction}>
          <View style={styles.actionPill}>
            <Typography variant="caption" style={styles.actionText}>
              {actionLabel}
            </Typography>
          </View>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Space[3],
    paddingHorizontal: Space[4],
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    color: Colors.gray900,
    letterSpacing: -0.3,
  },
  titleHi: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    color: Colors.gray500,
  },
  actionPill: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Space[3],
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
