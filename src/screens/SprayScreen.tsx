/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SPRAY SCHEDULE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full spray calendar: fruit/region selection, stage tracker,
 * chemical dosage (tank-size adjustable), disease alerts,
 * tips, and task completion.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RESULTS, openSettings } from 'react-native-permissions';
import ScreenLayout from '../components/ScreenLayout';

import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { useSpraySchedule, TANK_OPTIONS } from '../hooks/useSpraySchedule';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useAuthStore } from '../store/authStore';
import { navigateToLogin } from '../navigation/navigationRef';
import { showToast } from '../store/toastStore';
import type { SprayStage, SprayChemical, SprayDiseaseAlert } from '../services/sprayApi';



const SEVERITY_COLORS: Record<string, { bg: string; color: string; icon: string }> = {
  critical: { bg: '#fee2e2', color: '#dc2626', icon: 'alert-octagon' },
  high:     { bg: '#ffedd5', color: '#ea580c', icon: 'alert-circle' },
  medium:   { bg: '#fef9c3', color: '#ca8a04', icon: 'information' },
  low:      { bg: '#dbeafe', color: '#2563eb', icon: 'information' },
};

const STATUS_CONFIG: Record<string, { label: string; labelHi: string; color: string; bg: string }> = {
  done:     { label: 'Done',     labelHi: 'हो गया',    color: Colors.success, bg: Colors.success + '12' },
  active:   { label: 'Now',      labelHi: 'अभी',       color: Colors.primary, bg: Colors.primary + '12' },
  upcoming: { label: 'Upcoming', labelHi: 'आने वाला', color: Colors.gray500, bg: Colors.gray100 },
};

export default function SprayScreen(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const {
    data,
    stages,
    currentStageIndex,
    selectedStageIndex,
    loading,
    error,
    fruit,
    region,
    setFruit,
    setRegion,
    setSelectedStageIndex,
    refresh,
    markStageDone,
    toggleWatch,
    tankSize,
    setTankSize,
  } = useSpraySchedule();

  const [activeTab, setActiveTab] = useState<'fungicide' | 'insecticide' | 'tips'>('fungicide');
  const [markingDone, setMarkingDone] = useState(false);

  const {
    location: currentLocation,
    permissionStatus: locPermissionStatus,
    loading: locLoading,
    getLocation,
  } = useCurrentLocation();

  // Auto-prompt location permission once on first spray screen visit
  const hasAutoPrompted = useRef(false);
  useEffect(() => {
    if (
      !hasAutoPrompted.current &&
      (locPermissionStatus === RESULTS.DENIED || locPermissionStatus === RESULTS.LIMITED)
    ) {
      hasAutoPrompted.current = true;
      const timer = setTimeout(() => {
        getLocation();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [locPermissionStatus, getLocation]);

  const handleLocationPress = useCallback(async () => {
    if (locPermissionStatus === RESULTS.BLOCKED || locPermissionStatus === RESULTS.UNAVAILABLE) {
      showToast('Please enable location permission in settings', 'warning');
      await openSettings();
      return;
    }
    await getLocation();
  }, [locPermissionStatus, getLocation]);

  const stage = stages[selectedStageIndex];
  const fruits = data?.fruit_config ?? {};
  const regions = ['hp', 'kashmir'];
  // Region labels are displayed via regionLabelsHi
  const regionLabelsHi: Record<string, string> = { hp: 'हिमाचल प्रदेश', kashmir: 'कश्मीर' };

  const handleMarkDone = useCallback(async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to track spray tasks', 'warning');
      navigateToLogin();
      return;
    }
    setMarkingDone(true);
    await markStageDone(selectedStageIndex);
    setMarkingDone(false);
  }, [isAuthenticated, selectedStageIndex, markStageDone]);

  const handleShare = useCallback(async () => {
    if (!stage) return;
    const locationName = currentLocation?.name ?? data?.location?.name ?? 'Himachal Pradesh';
    const text = `🍎 Spray Schedule\n📍 ${locationName} | ${stage.name} (${stage.nameHi})\n📅 ${stage.timing}\n\n${stage.desc ?? ''}\n\nvia Baagicha App`;
    try {
      await Share.share({ message: text });
    } catch {
      // User cancelled
    }
  }, [stage, data, currentLocation]);

  // ── Adjust dose based on tank size ──
  const adjustDose = useCallback(
    (doseStr: string) => {
      const baseLitres = 200;
      const ratio = tankSize / baseLitres;

      // Try to extract numeric value from dose string
      const match = doseStr.match(/([\d.]+)\s*(gm|ml|kg|L|tablet|tbsp|tsp|litre|litres)/i);
      if (!match) return doseStr;

      const val = parseFloat(match[1]);
      const unit = match[2];
      const adjusted = Math.round(val * ratio);
      return `${adjusted} ${unit}`;
    },
    [tankSize]
  );

  if (loading && !data) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Typography variant="bodyMuted" style={styles.loadingText}>Loading spray schedule…</Typography>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout scrollable={false}>
        <View style={[styles.centered, { flex: 1 }]}>
          <Icon name="alert-circle" size={40} color={Colors.danger} />
          <Typography variant="body" color={Colors.danger} style={styles.errorText}>{error}</Typography>
          <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
            <Typography variant="bodySmall" color={Colors.primary}>Retry</Typography>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!data} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* ── Spray Window Banner ── */}
        <SprayWindowBanner stage={stage} />

        {/* ── Fruit Selector ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fruitRow}>
          {Object.entries(fruits).map(([slug, f]) => (
            <TouchableOpacity
              key={slug}
              onPress={() => f.available && setFruit(slug)}
              disabled={!f.available}
              activeOpacity={0.7}
              style={[
                styles.fruitPill,
                fruit === slug && styles.fruitPillActive,
                !f.available && styles.fruitPillSoon,
              ]}
            >
              <Typography variant="body" style={{ fontSize: 20 }}>{f.icon}</Typography>
              <View>
                <Typography
                  variant="badgeText"
                  style={[
                    styles.fruitPillLabel,
                    fruit === slug && { color: Colors.white },
                    !f.available && { color: Colors.gray500 },
                  ]}
                >
                  {f.label}
                </Typography>
                <Typography
                  variant="hindiMeta"
                  style={[
                    styles.fruitPillHi,
                    fruit === slug && { color: 'rgba(255,255,255,0.85)' },
                    !f.available && { color: Colors.gray500 },
                  ]}
                >
                  {f.available ? f.labelHi : 'जल्द आएगा'}
                </Typography>
              </View>
              {!f.available && (
                <View style={styles.soonBadge}>
                  <Typography variant="overline" style={{ fontSize: 8, color: Colors.white }}>Soon</Typography>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Region Tabs ── */}
        <View style={styles.regionBar}>
          {regions.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRegion(r)}
              activeOpacity={0.7}
              style={[styles.regionTab, region === r && styles.regionTabActive]}
            >
              <Icon name={r === 'hp' ? 'mountain' : 'snowflake'} size={14} color={region === r ? Colors.white : Colors.gray500} />
              <Typography variant="caption" style={region === r ? styles.regionTabTextActive : styles.regionTabText}>
                {regionLabelsHi[r]}
              </Typography>
            </TouchableOpacity>
          ))}
          <Typography variant="overline" color={Colors.gray500} style={styles.sourceNote}>
            HP Dept. of Horticulture · Nauni UHF 2026
          </Typography>
        </View>

        {/* ── Tank Calculator ── */}
        <View style={styles.tankBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="flask" size={16} color={Colors.primary} />
            <Typography variant="caption" style={styles.tankLabel}>टंकी साइज़</Typography>
          </View>
          <View style={styles.tankButtons}>
            {TANK_OPTIONS.map((vol) => (
              <TouchableOpacity
                key={vol}
                onPress={() => setTankSize(vol)}
                activeOpacity={0.7}
                style={[styles.tankBtn, tankSize === vol && styles.tankBtnActive]}
              >
                <Typography variant="badgeText" style={tankSize === vol ? styles.tankBtnTextActive : styles.tankBtnText}>
                  {vol}L
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Stage Timeline ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stageTrack}
        >
          {stages.map((s, index) => {
            const isActive = index === selectedStageIndex;
            const status = s.status;
            return (
              <React.Fragment key={s.no}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedStageIndex(index);
                    setActiveTab('fungicide');
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.stagePill,
                    isActive && styles.stagePillActive,
                    status === 'done' && styles.stagePillDone,
                  ]}
                >
                  <Icon
                    name={s.icon.replace('fas fa-', '').replace(/-/g, '-') as any}
                    size={16}
                    color={isActive ? Colors.white : s.color}
                    style={{ marginBottom: 4 }}
                  />
                  <Typography
                    variant="badgeText"
                    style={[
                      styles.stagePillLabel,
                      isActive && { color: Colors.white },
                      status === 'upcoming' && !isActive && { color: Colors.gray500 },
                    ]}
                  >
                    {s.name}
                  </Typography>
                  <Typography
                    variant="hindiMeta"
                    style={[
                      styles.stagePillHi,
                      isActive && { color: 'rgba(255,255,255,0.85)' },
                      status === 'upcoming' && !isActive && { color: Colors.gray500 },
                    ]}
                  >
                    {s.nameHi}
                  </Typography>
                  {status === 'done' && (
                    <View style={styles.doneCheck}>
                      <Icon name="check" size={10} color={Colors.success} />
                    </View>
                  )}
                  {status === 'active' && !isActive && (
                    <View style={styles.nowDot} />
                  )}
                </TouchableOpacity>
                {index < stages.length - 1 && (
                  <View style={[styles.stageConnector, index < currentStageIndex && styles.stageConnectorDone]} />
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>

        {/* ── Stage Detail Panel ── */}
        {stage && (
          <View style={styles.stagePanel}>
            <StageHero stage={stage} onShare={handleShare} onMarkDone={handleMarkDone} markingDone={markingDone} />
            <DiseaseSection diseases={stage.diseases} onWatch={(id) => toggleWatch('Disease', id)} />
            <DoseNote doseNote={data?.schedule?.doseNote ?? 'Dose per 200 litres of water'} tankSize={tankSize} />
            <ChemicalTabs activeTab={activeTab} onChange={setActiveTab} counts={{
              fungicide: stage.fungicides.length,
              insecticide: stage.insecticides.length,
              tips: stage.tips.length,
            }} />

            {activeTab === 'fungicide' && (
              <ChemicalList chemicals={stage.fungicides} adjustDose={adjustDose} />
            )}
            {activeTab === 'insecticide' && (
              <ChemicalList chemicals={stage.insecticides} adjustDose={adjustDose} />
            )}
            {activeTab === 'tips' && <TipsList tips={stage.tips} />}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

// ── Sub-Components ──

function SprayWindowBanner({ stage }: { stage?: SprayStage }) {
  if (!stage) return null;

  const isGood = stage.status === 'active' || stage.status === 'upcoming';
  const config = isGood
    ? { icon: 'check-circle', color: Colors.success, bg: Colors.success + '12', title: 'आज छिड़काव ठीक है', sub: 'Good conditions · Spray before noon' }
    : { icon: 'weather-pouring', color: Colors.info, bg: Colors.info + '12', title: 'Conditions checked', sub: 'Review schedule below' };

  return (
    <View style={[styles.banner, { backgroundColor: config.bg }]}>
      <Icon name={config.icon} size={22} color={config.color} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Typography variant="bodySmall" style={{ fontWeight: '700', color: config.color }}>
          {config.title}
        </Typography>
        <Typography variant="caption" color={Colors.gray500}>
          {config.sub}
        </Typography>
      </View>
    </View>
  );
}

function StageHero({ stage, onShare, onMarkDone, markingDone }: {
  stage: SprayStage;
  onShare: () => void;
  onMarkDone: () => void;
  markingDone: boolean;
}) {
  const statusCfg = STATUS_CONFIG[stage.status];

  return (
    <View style={[styles.stageHero, { borderLeftColor: stage.color }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.stageHeroIconWrap, { backgroundColor: stage.color + '18' }]}>
            <Icon name={stage.icon.replace('fas fa-', '').replace(/-/g, '-') as any} size={20} color={stage.color} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="caption" style={styles.stageNoBadge}>Spray {stage.no}</Typography>
              <View style={[styles.statusChip, { backgroundColor: statusCfg.bg }]}>
                <Typography variant="overline" style={{ fontSize: 9, color: statusCfg.color }}>
                  {statusCfg.labelHi} {statusCfg.label !== statusCfg.labelHi ? `· ${statusCfg.label}` : ''}
                </Typography>
              </View>
            </View>
            <Typography variant="displayHeading" style={styles.stageName}>{stage.name}</Typography>
            <Typography variant="hindiMeta" color={Colors.gray500}>{stage.nameHi}</Typography>
          </View>
        </View>
        <View style={styles.timingBox}>
          <Icon name="calendar-month" size={14} color={Colors.primary} />
          <Typography variant="caption" style={styles.timingHi}>{stage.timingHi}</Typography>
          <Typography variant="overline" color={Colors.gray500}>{stage.timing}</Typography>
        </View>
      </View>

      {stage.desc && (
        <Typography variant="bodySmall" color={Colors.gray500} style={styles.stageDesc}>
          {stage.desc}
        </Typography>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
        <TouchableOpacity onPress={onMarkDone} disabled={markingDone} activeOpacity={0.8} style={styles.markDoneBtn}>
          {markingDone ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Icon name="check-circle-outline" size={16} color={Colors.white} />
              <Typography variant="button" style={styles.markDoneText}>Mark Done · हो गया</Typography>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} activeOpacity={0.7} style={styles.shareBtn}>
          <Icon name="share-variant" size={16} color={Colors.primary} />
          <Typography variant="button" style={styles.shareText}>Share</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DiseaseSection({ diseases, onWatch }: {
  diseases: SprayDiseaseAlert[];
  onWatch: (id: number) => void;
}) {
  if (diseases.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="shield-virus" size={16} color={Colors.danger} />
        <Typography variant="label" style={styles.sectionTitle}>इस अवस्था में खतरा</Typography>
        <Typography variant="caption" color={Colors.gray500}>Threats at this stage</Typography>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diseaseScroll}>
        {diseases.map((d) => {
          const sev = SEVERITY_COLORS[d.sev] ?? SEVERITY_COLORS.medium;
          return (
            <View key={d.id} style={[styles.diseaseCardShadow, { borderColor: sev.color + '30' }]}>
              <View style={styles.diseaseCardInner}>
                <View style={[styles.diseaseHero, { backgroundColor: sev.bg }]}>
                  <Icon name={sev.icon} size={24} color={sev.color} />
                  <View style={[styles.sevBadge, { backgroundColor: sev.color + '1a', borderColor: sev.color + '33' }]}>
                    <Icon name={sev.icon} size={8} color={sev.color} />
                    <Typography variant="overline" style={{ fontSize: 8, color: sev.color, fontWeight: '700' }}>
                      {d.sev.charAt(0).toUpperCase() + d.sev.slice(1)}
                    </Typography>
                  </View>
                </View>
                <View style={styles.diseaseBody}>
                  <Typography variant="bodySmall" style={styles.diseaseName}>{d.name}</Typography>
                  <Typography variant="hindiMeta" color={Colors.gray500}>{d.nameHi}</Typography>
                  <Typography variant="caption" color={Colors.gray500} style={styles.diseaseDesc} numberOfLines={3}>
                    {d.desc}
                  </Typography>
                </View>
                <View style={styles.diseaseActions}>
                  <TouchableOpacity onPress={() => onWatch(d.id)} activeOpacity={0.7} style={styles.watchBtn}>
                    <Icon name="eye-outline" size={12} color={Colors.primary} />
                    <Typography variant="overline" style={{ fontSize: 9, color: Colors.primary }}>Watch</Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function DoseNote({ doseNote, tankSize }: { doseNote: string; tankSize: number }) {
  return (
    <View style={styles.doseNoteBar}>
      <Icon name="flask" size={14} color={Colors.gray500} />
      <Typography variant="caption" color={Colors.gray500}>
        {doseNote.replace('200', tankSize.toString())}
      </Typography>
    </View>
  );
}

function ChemicalTabs({ activeTab, onChange, counts }: {
  activeTab: 'fungicide' | 'insecticide' | 'tips';
  onChange: (t: 'fungicide' | 'insecticide' | 'tips') => void;
  counts: { fungicide: number; insecticide: number; tips: number };
}) {
  const tabs: Array<{ key: 'fungicide' | 'insecticide' | 'tips'; icon: string; label: string; labelHi: string }> = [
    { key: 'fungicide', icon: 'leaf', label: 'Fungicide', labelHi: 'रोग नाशक' },
    { key: 'insecticide', icon: 'bug', label: 'Insecticide', labelHi: 'कीट नाशक' },
    { key: 'tips', icon: 'lightbulb', label: 'Tips', labelHi: 'सुझाव' },
  ];

  return (
    <View style={styles.chemTabsRow}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          onPress={() => onChange(t.key)}
          activeOpacity={0.7}
          style={[styles.chemTab, activeTab === t.key && styles.chemTabActive]}
        >
          <Icon name={t.icon} size={14} color={activeTab === t.key ? Colors.primary : Colors.gray500} />
          <Typography variant="caption" style={activeTab === t.key ? styles.chemTabTextActive : styles.chemTabText}>
            {t.labelHi}
          </Typography>
          {counts[t.key] > 0 && (
            <View style={styles.tabCountBadge}>
              <Typography variant="overline" style={{ fontSize: 9, color: Colors.white }}>{counts[t.key]}</Typography>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ChemicalList({ chemicals, adjustDose }: {
  chemicals: SprayChemical[];
  adjustDose: (dose: string) => string;
}) {
  if (chemicals.length === 0) {
    return (
      <View style={styles.emptyChem}>
        <Typography variant="bodyMuted" center>No chemicals listed for this stage.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.chemList}>
      {chemicals.map((c, i) => (
        <View key={i} style={styles.chemCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="bodySmall" style={styles.chemName}>{c.name}</Typography>
            {c.phi && (
              <View style={styles.phiBadge}>
                <Typography variant="overline" style={{ fontSize: 8, color: Colors.warning }}>PHI {c.phi}</Typography>
              </View>
            )}
          </View>
          {c.target && (
            <Typography variant="caption" color={Colors.gray500}>Target: {c.target}</Typography>
          )}
          <View style={styles.doseRow}>
            <Icon name="flask-outline" size={14} color={Colors.primary} />
            <Typography variant="body" style={styles.doseValue}>{adjustDose(c.dose)}</Typography>
          </View>
          {c.note && (
            <Typography variant="caption" color={Colors.warning} style={styles.chemNote}>
              <Icon name="alert" size={10} color={Colors.warning} /> {c.note}
            </Typography>
          )}
        </View>
      ))}
    </View>
  );
}

function TipsList({ tips }: { tips: string[] }) {
  if (tips.length === 0) {
    return (
      <View style={styles.emptyChem}>
        <Typography variant="bodyMuted" center>No tips for this stage.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.tipsList}>
      {tips.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <View style={styles.tipNumber}>
            <Typography variant="badgeText" color={Colors.white}>{i + 1}</Typography>
          </View>
          <Typography variant="bodySmall" color={Colors.gray900} style={{ flex: 1 }}>{tip}</Typography>
        </View>
      ))}
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroGradient: {
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.medium,
    zIndex: 10,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingTop: Space[2],
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  locationTagPrompt: {
    backgroundColor: Colors.accent500 + '30',
    borderWidth: 1,
    borderColor: Colors.accent500,
  },
  locationText: {
    color: Colors.white,
    fontWeight: '600',
  },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
  },

  // Fruit selector
  fruitRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  fruitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
  },
  fruitPillActive: {
    backgroundColor: Colors.primary,
  },
  fruitPillSoon: {
    opacity: 0.6,
  },
  fruitPillLabel: {
    color: Colors.gray900,
    fontWeight: '700',
  },
  fruitPillHi: {
    fontSize: 10,
    color: Colors.gray500,
  },
  soonBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.gray500,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  // Region bar
  regionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    gap: 8,
  },
  regionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  regionTabActive: {
    backgroundColor: Colors.primary,
  },
  regionTabText: {
    color: Colors.gray700,
    fontWeight: '600',
  },
  regionTabTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  sourceNote: {
    marginLeft: 'auto',
    fontSize: 9,
  },

  // Tank calculator
  tankBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingVertical: Space[3],
    backgroundColor: Colors.surface,
    marginHorizontal: Space[4],
    marginTop: Space[3],
    borderRadius: Radius['2xl'],
    ...Shadows.subtle,
  },
  tankLabel: {
    marginLeft: 6,
    fontWeight: '600',
    color: Colors.gray900,
  },
  tankButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  tankBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
  },
  tankBtnActive: {
    backgroundColor: Colors.primary,
  },
  tankBtnText: {
    color: Colors.gray700,
    fontWeight: '600',
    fontSize: 12,
  },
  tankBtnTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  // Stage timeline
  stageTrack: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 0,
  },
  stagePill: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.surface,
    minWidth: 80,
  },
  stagePillActive: {
    backgroundColor: Colors.primary,
  },
  stagePillDone: {
    backgroundColor: Colors.success + '10',
  },
  stagePillLabel: {
    color: Colors.gray900,
    fontWeight: '700',
    fontSize: 11,
  },
  stagePillHi: {
    fontSize: 9,
    color: Colors.gray500,
  },
  stageConnector: {
    width: 16,
    height: 2,
    backgroundColor: Colors.gray200,
    alignSelf: 'center',
  },
  stageConnectorDone: {
    backgroundColor: Colors.success,
  },
  doneCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 2,
  },
  nowDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // Stage panel
  stagePanel: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  // Stage hero
  stageHero: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    gap: Space[3],
    ...Shadows.medium,
  },
  stageHeroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stageNoBadge: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '700',
    marginRight: 8,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stageName: {
    fontSize: 18,
    marginTop: 4,
  },
  timingBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  timingHi: {
    color: Colors.primary,
    fontWeight: '700',
  },
  stageDesc: {
    marginTop: 4,
    lineHeight: 20,
  },
  markDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  markDoneText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  shareText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  // Disease section
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: Colors.gray900,
  },
  diseaseScroll: {
    gap: 10,
    paddingRight: 16,
  },
  diseaseCardShadow: {
    width: 220,
    borderRadius: Radius['2xl'],
    ...Shadows.medium,
  },
  diseaseCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
  },
  diseaseHero: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sevBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  diseaseBody: {
    padding: 12,
    gap: 4,
  },
  diseaseName: {
    fontWeight: '700',
    color: Colors.gray900,
  },
  diseaseDesc: {
    marginTop: 4,
    lineHeight: 18,
  },
  diseaseActions: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '08',
    borderRadius: Radius.full,
  },

  // Dose note
  doseNoteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius['2xl'],
  },

  // Chemical tabs
  chemTabsRow: {
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  chemTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  chemTabActive: {
    borderBottomColor: Colors.primary,
  },
  chemTabText: {
    color: Colors.gray500,
    fontWeight: '500',
  },
  chemTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },

  // Chemical list
  chemList: {
    gap: 10,
  },
  emptyChem: {
    paddingVertical: 40,
  },
  chemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    gap: Space[2],
    ...Shadows.subtle,
  },
  chemName: {
    fontWeight: '700',
    color: Colors.gray900,
  },
  phiBadge: {
    backgroundColor: Colors.warning + '12',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  doseValue: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  chemNote: {
    marginTop: 4,
    lineHeight: 18,
  },

  // Tips
  tipsList: {
    gap: 10,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Space[3],
    borderRadius: Radius['2xl'],
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
