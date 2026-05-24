/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — EMPTY STATE
 * ═══════════════════════════════════════════════════════════════
 *
 * Friendly empty state with icon, bilingual message, and action.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import PressableScale from './PressableScale';

interface EmptyStateProps {
  icon?: string;
  title: string;
  titleHi?: string;
  subtitle?: string;
  subtitleHi?: string;
  actionLabel?: string;
  actionLabelHi?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon = 'leaf-off-outline',
  title,
  titleHi,
  subtitle,
  subtitleHi,
  actionLabel,
  actionLabelHi,
  onAction,
  style,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={40} color={Colors.gray300} />
      </View>
      <Typography variant="displayHeading" center style={styles.title}>
        {title}
      </Typography>
      {titleHi && (
        <Typography variant="hindiDisplaySection" center style={styles.titleHi}>
          {titleHi}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="bodyMuted" center style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
      {subtitleHi && (
        <Typography variant="hindiBody" center style={styles.subtitleHi}>
          {subtitleHi}
        </Typography>
      )}
      {onAction && actionLabel && (
        <PressableScale onPress={onAction} style={styles.actionButton}>
          <View style={styles.actionBg}>
            <Typography variant="button" style={styles.actionText}>
              {actionLabel}
              {actionLabelHi ? ` / ${actionLabelHi}` : ''}
            </Typography>
          </View>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.gray700,
  },
  titleHi: {
    marginTop: 4,
    color: Colors.gray400,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  subtitleHi: {
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 20,
  },
  actionBg: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
