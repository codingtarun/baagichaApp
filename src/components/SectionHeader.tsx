/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SECTION HEADER
 * ═══════════════════════════════════════════════════════════════
 *
 * Reusable section header: icon + English title + Hindi subtitle + optional "View All" link.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import PressableScale from './PressableScale';

interface SectionHeaderProps {
  icon?: string;
  iconColor?: string;
  title: string;
  titleHi: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({
  icon = 'circle-small',
  iconColor = Colors.primary,
  title,
  titleHi,
  actionLabel,
  onAction,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
          <Icon name={icon} size={14} color={iconColor} />
        </View>
        <View>
          <Typography variant="sectionTitle" style={styles.title}>
            {title}
          </Typography>
          <Typography variant="hindiDisplaySection" style={styles.titleHi}>
            {titleHi}
          </Typography>
        </View>
      </View>
      {actionLabel && onAction && (
        <PressableScale onPress={onAction}>
          <Typography variant="link" style={styles.action}>
            {actionLabel}
          </Typography>
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
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
  titleHi: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
  action: {
    fontSize: 13,
  },
});
