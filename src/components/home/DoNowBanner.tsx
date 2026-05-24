/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DO NOW BANNER (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Hero card showing current growth stage, progress bar, spray suitability,
 * weather warnings, disease watch chips, spray now chips, and soil nutrition.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import PressableScale from '../PressableScale';

// ── Types ──

export interface SprayItem {
  name: string;
  nameHi: string;
  dose?: string;
  target?: string;
  group: 'Fungicide' | 'Pesticide' | 'Foliar';
  groupIcon: string;
}

export interface DiseaseWatchItem {
  name: string;
  nameHi: string;
  type: 'fungal' | 'pest' | 'bacterial';
  risk: 'high' | 'medium' | 'low';
  note?: string;
}

export interface SoilNutritionItem {
  name: string;
  nameHi: string;
  dose: string;
  icon: string;
}

export interface WeatherWarning {
  type: string;
  message: string;
  severity: 'critical' | 'warning';
}

export interface DoNowStage {
  name: string;
  nameHi: string;
  period: string;
  progress: number;
  nextStage?: string;
  nextStageHi?: string;
}

interface DoNowBannerProps {
  stage: DoNowStage;
  sprays: SprayItem[];
  diseaseWatch: DiseaseWatchItem[];
  soilNutrition: SoilNutritionItem[];
  weatherWarnings: WeatherWarning[];
  suitLabel?: string;
  suitLabelHi?: string;
  suitType?: 'perfect' | 'caution' | 'avoid';
}

// ── Helpers ──

const RISK_COLORS: Record<string, string> = {
  high: '#dc2626',
  medium: '#d97706',
  low: '#2563eb',
};

const RISK_LABELS: Record<string, string> = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

const TYPE_ICONS: Record<string, string> = {
  fungal: 'virus',
  pest: 'bug',
  bacterial: 'bacteria',
};

const SUIT_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  perfect: { icon: 'check-circle', color: Colors.success, bg: Colors.success + '18', label: 'Good for Spray' },
  caution: { icon: 'alert-circle', color: Colors.warning, bg: Colors.warning + '18', label: 'Use Caution' },
  avoid:   { icon: 'close-circle', color: Colors.danger, bg: Colors.danger + '18', label: 'Avoid Spray' },
};

const WEATHER_ICONS: Record<string, string> = {
  frost: 'snowflake',
  hail: 'weather-hail',
  heavy_rain: 'weather-pouring',
  strong_wind: 'weather-windy',
};

// ── Component ──

export default function DoNowBanner({
  stage,
  sprays,
  diseaseWatch,
  soilNutrition,
  weatherWarnings,
  suitLabel,
  suitLabelHi,
  suitType = 'perfect',
}: DoNowBannerProps): React.JSX.Element {
  const suit = SUIT_CONFIG[suitType];
  const daysLeft = 12;

  return (
    <View style={styles.card}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.badge}>
            <Icon name="flash" size={10} color={Colors.accent} />
            <Typography variant="overline" style={styles.badgeText}>Do Now</Typography>
          </View>
          <Typography variant="caption" style={styles.period}>{stage.period}</Typography>
        </View>

        <View style={styles.heroStage}>
          <View style={styles.heroIconWrap}>
            <Icon name="seedling" size={22} color={Colors.primaryLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Typography variant="displaySubheading" style={styles.stageName}>{stage.name}</Typography>
            <Typography variant="hindiDisplayHero" style={styles.stageNameHi}>{stage.nameHi}</Typography>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${stage.progress}%` }]} />
        </View>
        <View style={styles.progressMeta}>
          <Typography variant="caption" style={styles.progressPct}>{stage.progress}%</Typography>
          {daysLeft > 0 && <Typography variant="caption" style={styles.progressDays}>{daysLeft}d left</Typography>}
          {stage.nextStage && (
            <Typography variant="caption" style={styles.nextStage}>Next: {stage.nextStage}</Typography>
          )}
        </View>

        {/* Suitability */}
        <View style={[styles.suitBadge, { backgroundColor: suit.bg }]}>
          <Icon name={suit.icon} size={14} color={suit.color} />
          <Typography variant="bodySmall" style={[styles.suitText, { color: suit.color }]}>
            {suitLabel ?? suit.label}
          </Typography>
          {suitLabelHi && (
            <Typography variant="hindiMicro" style={{ color: suit.color }}>· {suitLabelHi}</Typography>
          )}
        </View>
      </View>

      {/* ── Weather Warnings ── */}
      {weatherWarnings.length > 0 && (
        <View style={styles.warnings}>
          {weatherWarnings.map((w, i) => (
            <View key={i} style={[styles.warnRow, w.severity === 'critical' ? styles.warnCritical : styles.warnAmber]}>
              <Icon
                name={WEATHER_ICONS[w.type] ?? 'alert'}
                size={14}
                color={w.severity === 'critical' ? Colors.danger : Colors.warning}
              />
              <Typography variant="caption" style={styles.warnText}>{w.message}</Typography>
            </View>
          ))}
        </View>
      )}

      {/* ── Disease Watch ── */}
      {diseaseWatch.length > 0 && (
        <View style={styles.section}>
          <SectionDotTitle title="Watch For" titleHi="निगरानी" iconColor={Colors.warning} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {diseaseWatch.map((d, i) => (
              <PressableScale key={i} scale={0.96}>
                <View style={styles.watchChip}>
                  <View style={styles.watchChipTop}>
                    <Icon name={TYPE_ICONS[d.type] ?? 'virus'} size={18} color={RISK_COLORS[d.risk]} />
                    <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[d.risk] + '14' }]}>
                      <Typography variant="overline" style={{ fontSize: 9, color: RISK_COLORS[d.risk], fontWeight: '700' }}>
                        {RISK_LABELS[d.risk]}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="bodySmall" style={styles.watchName}>{d.name}</Typography>
                  <Typography variant="hindiMeta">{d.nameHi}</Typography>
                  {d.note && <Typography variant="caption" style={styles.watchNote} numberOfLines={2}>{d.note}</Typography>}
                </View>
              </PressableScale>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Spray Now ── */}
      {sprays.length > 0 && (
        <View style={styles.section}>
          <SectionDotTitle title="Spray Now" titleHi="छिड़काव" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {sprays.map((s, i) => (
              <PressableScale key={i} scale={0.96}>
                <View style={styles.sprayChip}>
                  <View style={styles.sprayChipHead}>
                    <View style={styles.sprayTag}>
                      <Icon name={s.groupIcon as any} size={10} color={Colors.primary} />
                      <Typography variant="overline" style={{ fontSize: 9, color: Colors.primary, marginLeft: 4 }}>
                        {s.group}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="bodySmall" style={styles.sprayName}>{s.name}</Typography>
                  <Typography variant="hindiMeta">{s.nameHi}</Typography>
                  <View style={styles.sprayPills}>
                    {s.dose && (
                      <View style={styles.miniPill}>
                        <Icon name="flask-outline" size={10} color={Colors.primary} />
                        <Typography variant="caption" style={styles.miniPillText}>{s.dose}</Typography>
                      </View>
                    )}
                    {s.target && (
                      <View style={styles.miniPill}>
                        <Icon name="target" size={10} color={Colors.gray500} />
                        <Typography variant="caption" style={styles.miniPillText}>{s.target}</Typography>
                      </View>
                    )}
                  </View>
                </View>
              </PressableScale>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Soil Nutrition ── */}
      {soilNutrition.length > 0 && (
        <View style={[styles.section, styles.sectionLast]}>
          <SectionDotTitle title="Soil" titleHi="मिट्टी" iconColor={Colors.info} />
          <View style={styles.soilList}>
            {soilNutrition.map((sn, i) => (
              <View key={i} style={styles.soilRow}>
                <Icon name={sn.icon as any} size={14} color={Colors.info} />
                <Typography variant="bodySmall" style={styles.soilName}>{sn.name}</Typography>
                <Typography variant="caption" style={styles.soilDose}>{sn.dose}</Typography>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Sub-component ──

function SectionDotTitle({ title, titleHi, iconColor = Colors.primary }: { title: string; titleHi: string; iconColor?: string }) {
  return (
    <View style={styles.secHead}>
      <View style={[styles.secDot, { backgroundColor: iconColor }]} />
      <Typography variant="label" style={styles.secTitle}>{title}</Typography>
      <Typography variant="hindiMicro" style={styles.secHi}>· {titleHi}</Typography>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  hero: {
    backgroundColor: Colors.bgPrimary,
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 9,
  },
  period: {
    color: 'rgba(255,255,255,0.5)',
  },
  heroStage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageName: {
    fontSize: 18,
    color: Colors.white,
  },
  stageNameHi: {
    fontSize: 14,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  progressPct: {
    color: Colors.accent,
    fontWeight: '700',
  },
  progressDays: {
    color: 'rgba(255,255,255,0.6)',
  },
  nextStage: {
    color: 'rgba(255,255,255,0.35)',
    marginLeft: 'auto',
  },
  suitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  suitText: {
    fontWeight: '700',
  },
  warnings: {
    padding: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  warnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  warnCritical: {
    backgroundColor: Colors.danger + '10',
  },
  warnAmber: {
    backgroundColor: Colors.warning + '10',
  },
  warnText: {
    flex: 1,
    color: Colors.gray700,
  },
  section: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  sectionLast: {
    borderBottomWidth: 0,
  },
  secHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  secDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  secTitle: {
    color: Colors.gray800,
    fontSize: 12,
  },
  secHi: {
    color: Colors.gray400,
  },
  hScroll: {
    gap: 10,
    paddingRight: 16,
  },
  watchChip: {
    width: 160,
    backgroundColor: Colors.gray50,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 6,
  },
  watchChipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  watchName: {
    fontWeight: '700',
    color: Colors.gray800,
    marginTop: 2,
  },
  watchNote: {
    marginTop: 2,
    lineHeight: 16,
  },
  sprayChip: {
    width: 180,
    backgroundColor: Colors.gray50,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 6,
  },
  sprayChipHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sprayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sprayName: {
    fontWeight: '700',
    color: Colors.gray800,
    marginTop: 2,
  },
  sprayPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  miniPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  miniPillText: {
    fontSize: 10,
    color: Colors.gray600,
  },
  soilList: {
    gap: 8,
  },
  soilRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  soilName: {
    flex: 1,
    color: Colors.gray800,
    fontWeight: '600',
  },
  soilDose: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
