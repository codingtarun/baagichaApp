/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMPACT ALERT ROW
 * ═══════════════════════════════════════════════════════════════
 *
 * Text-dense alert rows with colored left border.
 * Preventive + outbreak alerts in compact form.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

export interface CompactAlert {
  id: string;
  title: string;
  titleHi: string;
  desc: string;
  severity: 'critical' | 'high' | 'medium';
  type: 'preventive' | 'outbreak';
  meta?: string;
}

interface CompactAlertRowProps {
  alerts: CompactAlert[];
  onViewAll?: () => void;
}

const SEV_COLORS: Record<string, string> = {
  critical: Colors.sevCritical,
  high: Colors.sevHigh,
  medium: Colors.sevMedium,
};

const SEV_BG: Record<string, string> = {
  critical: Colors.dangerLight,
  high: Colors.warningLight,
  medium: '#fef9c3',
};

export default function CompactAlertRow({ alerts, onViewAll }: CompactAlertRowProps): React.JSX.Element {
  const preventive = alerts.filter((a) => a.type === 'preventive').slice(0, 2);
  const outbreaks = alerts.filter((a) => a.type === 'outbreak').slice(0, 1);
  const display = [...preventive, ...outbreaks];

  if (display.length === 0) return <View />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="displayHeading" style={styles.title}>Alerts</Typography>
        <Typography variant="hindiDisplaySection" style={styles.titleHi}>अलर्ट</Typography>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAll}>
            <Typography variant="link" style={styles.viewAllText}>View All</Typography>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.list}>
        {display.map((alert) => {
          const color = SEV_COLORS[alert.severity];
          const bg = SEV_BG[alert.severity];
          return (
            <TouchableOpacity key={alert.id} style={[styles.row, { borderLeftColor: color }]} activeOpacity={0.7}>
              <View style={[styles.severityDot, { backgroundColor: color }]} />
              <View style={styles.body}>
                <View style={styles.topRow}>
                  <Typography variant="bodySmall" style={[styles.alertTitle, { color: Colors.gray900 }]} numberOfLines={1}>
                    {alert.title}
                  </Typography>
                  <Typography variant="hindiMicro" style={styles.alertTitleHi} numberOfLines={1}>
                    {alert.titleHi}
                  </Typography>
                </View>
                <Typography variant="captionMuted" style={styles.desc} numberOfLines={2}>
                  {alert.desc}
                </Typography>
                {alert.meta && (
                  <Typography variant="caption" style={[styles.meta, { color }]}>
                    {alert.meta}
                  </Typography>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderLeftWidth: 3,
    gap: 8,
    alignItems: 'flex-start',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  alertTitle: {
    fontWeight: '700',
  },
  alertTitleHi: {
    color: Colors.gray400,
  },
  desc: {
    lineHeight: 16,
  },
  meta: {
    fontWeight: '600',
    marginTop: 1,
  },
});
