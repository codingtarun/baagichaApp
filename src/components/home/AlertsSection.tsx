/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ALERTS SECTION (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Preventive alerts with severity bars + community outbreak reports.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';
import PressableScale from '../PressableScale';

export interface PreventiveAlert {
  icon: string;
  title: string;
  titleHi: string;
  desc: string;
  sev: 'critical' | 'high' | 'medium';
}

export interface OutbreakAlert {
  location: string;
  disease: string;
  diseaseHi: string;
  reports: number;
  when: string;
  sev: 'critical' | 'high' | 'medium';
  tip: string;
}

interface AlertsSectionProps {
  preventiveAlerts: PreventiveAlert[];
  outbreakAlerts: OutbreakAlert[];
  onViewAll?: () => void;
}

const SEV_COLORS: Record<string, string> = {
  critical: Colors.sevCritical,
  high: Colors.sevHigh,
  medium: Colors.sevMedium,
};

const ICON_MAP: Record<string, string> = {
  'fas fa-biohazard': 'biohazard',
  'fas fa-snowflake': 'snowflake',
  'fas fa-bug': 'bug',
};

export default function AlertsSection({ preventiveAlerts, outbreakAlerts, onViewAll }: AlertsSectionProps): React.JSX.Element {
  return (
    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
      <SectionHeader
        icon="alert-circle"
        iconColor={Colors.warning}
        title="Alerts"
        titleHi="चेतावनी"
        actionLabel="View All"
        onAction={onViewAll}
      />

      {/* Preventive Alerts */}
      {preventiveAlerts.length > 0 && (
        <View style={styles.groupLabel}>
          <Icon name="shield-check" size={12} color={Colors.gray400} />
          <Typography variant="overline" style={{ color: Colors.gray400, fontSize: 10 }}>Preventive Alerts</Typography>
        </View>
      )}
      {preventiveAlerts.map((alert, i) => {
        const color = SEV_COLORS[alert.sev];
        const iconName = ICON_MAP[alert.icon] ?? 'alert';
        return (
          <PressableScale key={i} scale={0.98}>
            <View style={styles.alertCard}>
              <View style={[styles.sevBar, { backgroundColor: color }]} />
              <View style={styles.alertIconWrap}>
                <Icon name={iconName} size={20} color={color} />
              </View>
              <View style={styles.alertBody}>
                <Typography variant="alertTitle">{alert.title}</Typography>
                <Typography variant="hindiBody">{alert.titleHi}</Typography>
                <Typography variant="alertDesc" style={{ marginTop: 4 }}>{alert.desc}</Typography>
              </View>
            </View>
          </PressableScale>
        );
      })}

      {/* Outbreaks */}
      {outbreakAlerts.length > 0 && (
        <View style={[styles.groupLabel, { marginTop: 16 }]}>
          <Icon name="account-group" size={12} color={Colors.gray400} />
          <Typography variant="overline" style={{ color: Colors.gray400, fontSize: 10 }}>Farmer-Reported Outbreaks</Typography>
        </View>
      )}
      {outbreakAlerts.map((ob, i) => {
        const color = SEV_COLORS[ob.sev];
        return (
          <PressableScale key={i} scale={0.98}>
            <View style={styles.outbreakCard}>
              <View style={styles.obHead}>
                <View style={styles.obDiseaseWrap}>
                  <View style={[styles.obDot, { backgroundColor: color }]} />
                  <Typography variant="outbreakDisease">{ob.disease}</Typography>
                  <Typography variant="hindiBody">· {ob.diseaseHi}</Typography>
                </View>
                <View style={styles.obReports}>
                  <Icon name="account-group" size={10} color={Colors.gray400} />
                  <Typography variant="caption" style={{ color: Colors.gray400, marginLeft: 4 }}>{ob.reports}</Typography>
                </View>
              </View>
              <View style={styles.obMeta}>
                <Typography variant="caption"><Icon name="map-marker" size={10} color={Colors.gray400} /> {ob.location}</Typography>
                <Typography variant="caption"><Icon name="clock-outline" size={10} color={Colors.gray400} /> {ob.when}</Typography>
              </View>
              <View style={styles.obTip}>
                <Icon name="lightbulb-on" size={12} color={Colors.primary} />
                <Typography variant="outbreakTip" style={{ flex: 1 }}>{ob.tip}</Typography>
              </View>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sevBar: {
    width: 4,
  },
  alertIconWrap: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  alertBody: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    gap: 2,
  },
  outbreakCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  obHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  obDiseaseWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  obDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  obReports: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  obMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  obTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    backgroundColor: Colors.primary + '06',
    padding: 10,
    borderRadius: 10,
  },
});
