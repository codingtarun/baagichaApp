/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HORIZONTAL ALERT STRIP
 * ═══════════════════════════════════════════════════════════════
 *
 * Horizontally scrollable alert cards for the My Farm dashboard.
 * Each card shows an alert with severity-colored styling.
 * Placed below the Quick Stats / Post Status section.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Shadows, Radius } from '../../theme/style';
import { Typography } from '../../typography';

export interface HorizontalAlert {
  id: string;
  icon: string;
  title: string;
  titleHi: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'warning' | 'todo' | 'info';
}

interface HorizontalAlertStripProps {
  alerts: HorizontalAlert[];
  onViewAll?: () => void;
}

const SEV_CONFIG: Record<string, { color: string; bg: string; iconColor: string }> = {
  critical: { color: Colors.danger, bg: Colors.dangerLight, iconColor: Colors.danger },
  high:     { color: Colors.sevHigh, bg: Colors.warningLight, iconColor: Colors.warning },
  medium:   { color: Colors.warning, bg: '#fef9c3', iconColor: '#a16207' },
  low:      { color: Colors.info, bg: Colors.infoLight, iconColor: Colors.info },
};

const TYPE_ICON: Record<string, string> = {
  warning: 'alert-circle',
  todo:    'checkbox-marked-circle-plus-outline',
  info:    'information',
};

export default function HorizontalAlertStrip({ alerts, onViewAll }: HorizontalAlertStripProps): React.JSX.Element {
  if (alerts.length === 0) return <View />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="bell-alert" size={18} color={Colors.warning} />
          <Typography variant="sectionTitle">Alerts</Typography>
          <Typography variant="sectionSubtitle" style={{ color: Colors.gray400 }}>
            · अलर्ट
          </Typography>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Typography variant="sectionLink">View All ›</Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scroll Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {alerts.map((alert) => {
          const cfg = SEV_CONFIG[alert.severity] ?? SEV_CONFIG.low;
          const typeIcon = TYPE_ICON[alert.type] ?? 'alert-circle';
          return (
            <TouchableOpacity
              key={alert.id}
              style={[styles.card, { borderLeftColor: cfg.color }]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${alert.title}: ${alert.message}`}
            >
              {/* Top row: icon + severity badge */}
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                  <Icon name={typeIcon as any} size={18} color={cfg.iconColor} />
                </View>
                <View style={[styles.sevBadge, { backgroundColor: cfg.bg }]}>
                  <Typography variant="overline" style={{ fontSize: 9, color: cfg.color, fontWeight: '700', textTransform: 'uppercase' }}>
                    {alert.severity}
                  </Typography>
                </View>
              </View>

              {/* Title */}
              <Typography variant="bodySmall" style={styles.cardTitle} numberOfLines={1}>
                {alert.title}
              </Typography>
              <Typography variant="hindiMicro" style={styles.cardTitleHi} numberOfLines={1}>
                {alert.titleHi}
              </Typography>

              {/* Message */}
              <Typography variant="captionMuted" style={styles.cardMessage} numberOfLines={2}>
                {alert.message}
              </Typography>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingRight: 24,
  },
  card: {
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: 14,
    borderLeftWidth: 4,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sevBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardTitle: {
    fontWeight: '700',
    color: Colors.gray900,
    lineHeight: 18,
  },
  cardTitleHi: {
    color: Colors.gray500,
    marginTop: 1,
  },
  cardMessage: {
    marginTop: 6,
    lineHeight: 16,
  },
});
