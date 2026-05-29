/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISEASE DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full detail view for a single disease/pest.
 * Fetches from: GET /api/v1/diseases/{slug}
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useDiseaseDetail } from '../hooks/useDiseaseDetail';
import type { DiscoverNavigationProp, DiseaseDetailRouteProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'identify', label: 'Identify' },
  { key: 'manage', label: 'Manage' },
  { key: 'risk', label: 'Risk' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function DiseaseDetailScreen(): React.JSX.Element {
  const route = useRoute<DiseaseDetailRouteProp>();
  const navigation = useNavigation<DiscoverNavigationProp>();
  const { slug } = route.params;

  const { disease, loading, error, refresh } = useDiseaseDetail(slug);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (loading && !disease) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Typography variant="bodyMuted" style={styles.loadingText}>
          Loading disease...
        </Typography>
      </SafeAreaView>
    );
  }

  if (error || !disease) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <Icon name="alert-circle" size={40} color={Colors.danger} />
        <Typography variant="body" color={Colors.danger} style={styles.errorText}>
          {error ?? 'Disease not found'}
        </Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Typography variant="bodySmall" color={Colors.primary}>
            Go Back
          </Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const sev = disease.severity_label;
  const cat = disease.category_label;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!disease} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {disease.hero_image ? (
            <Image source={{ uri: disease.hero_image }} style={styles.heroImg} />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: `${sev.color}18` }]}>
              <Icon name="virus" size={48} color={sev.color} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: sev.color }]}>
              <Icon name="alert" size={10} color={Colors.white} />
              <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                {sev.label}
              </Typography>
            </View>
            <View style={[styles.badge, styles.badgeOutline, { borderColor: sev.color }]}>
              <Icon name="tag" size={10} color={sev.color} />
              <Typography variant="badgeText" color={sev.color} style={styles.badgeText}>
                {cat.label}
              </Typography>
            </View>
            {disease.hp_common && (
              <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
                <Icon name="map-marker" size={10} color={Colors.white} />
                <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                  HP
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={styles.identity}>
          <Typography variant="displayHeading" style={styles.nameEn}>
            {disease.name_en}
          </Typography>
          {disease.name_hi && (
            <Typography variant="hindiDisplaySection" style={styles.nameHi}>
              {disease.name_hi}
            </Typography>
          )}
          {disease.scientific_name && (
            <Typography variant="metaText" color={Colors.gray400} style={styles.sciName}>
              {disease.scientific_name}
            </Typography>
          )}
        </View>

        {/* ── Quick Stats ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {(disease.risk_temp_min_c || disease.risk_temp_max_c) && (
            <StatItem icon="thermometer" value={`${disease.risk_temp_min_c ?? '?'}–${disease.risk_temp_max_c ?? '?'}°C`} />
          )}
          {disease.risk_humidity_pct && (
            <StatItem icon="water-percent" value={`>${disease.risk_humidity_pct}%`} unit="humidity" />
          )}
          {(disease.yield_loss_min_pct || disease.yield_loss_max_pct) && (
            <StatItem icon="trending-down" value={`${disease.yield_loss_min_pct ?? 0}–${disease.yield_loss_max_pct ?? '?'}%`} unit="yield loss" warn />
          )}
          {(disease.altitude_min_feet || disease.altitude_max_feet) && (
            <StatItem icon="terrain" value={`${(disease.altitude_min_feet ?? 0).toLocaleString()}–${(disease.altitude_max_feet ?? 10000).toLocaleString()}`} unit="ft" />
          )}
          <StatItem icon="eye" value={disease.view_count.toLocaleString()} unit="views" />
        </ScrollView>

        {/* ── Tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: sev.color }]}
            >
              <Typography
                variant="bodySmall"
                color={activeTab === tab.key ? sev.color : Colors.gray400}
                style={{ fontWeight: activeTab === tab.key ? '700' : '500' }}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Tab Content ── */}
        <View style={styles.section}>
          {activeTab === 'overview' && <OverviewSection disease={disease} />}
          {activeTab === 'identify' && <IdentifySection disease={disease} />}
          {activeTab === 'manage' && <ManageSection disease={disease} />}
          {activeTab === 'risk' && <RiskSection disease={disease} sevColor={sev.color} />}
        </View>

        {/* ── Related Diseases ── */}
        {disease.related.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.relatedTitle}>
              Other {cat.label} Diseases
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
              {disease.related.map((rel) => (
                <View key={rel.id} style={[styles.relatedCardShadow, { borderColor: `${rel.severity_label.color}30` }]}>
                  <TouchableOpacity
                    style={styles.relatedCardInner}
                    onPress={() => navigation.navigate('DiseaseDetail', { slug: rel.slug })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.relatedHero, { backgroundColor: `${rel.severity_label.color}12` }]}>
                      <Icon name="virus" size={24} color={rel.severity_label.color} />
                    </View>
                    <View style={styles.relatedBody}>
                      <Typography variant="cardTitle" lines={1} style={{ fontSize: 12 }}>
                        {rel.name_en}
                      </Typography>
                      <View style={[styles.relatedSevBadge, { backgroundColor: `${rel.severity_label.color}18` }]}>
                        <Typography variant="overline" style={{ color: rel.severity_label.color, fontSize: 8 }}>
                          {rel.severity_label.label}
                        </Typography>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.safeBottom} />
      </ScrollView>

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <View style={styles.backBtnBg}>
          <Icon name="arrow-left" size={20} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Section Components ──

function OverviewSection({ disease }: { disease: import('../services/diseaseApi').DiseaseDetail }) {
  return (
    <>
      {disease.description && (
        <DetailCard icon="text" title="About This Disease" color={disease.severity_label.color}>
          <BilingualContent content={disease.description} />
        </DetailCard>
      )}

      {(disease.season_start_stage || disease.season_end_stage) && (
        <DetailCard icon="calendar" title="Active Season" color={disease.severity_label.color}>
          <View style={styles.seasonBar}>
            <Typography variant="bodySmall" color={Colors.gray600}>{disease.season_start_stage ?? 'Unknown'}</Typography>
            <View style={styles.seasonLine} />
            <Typography variant="bodySmall" color={Colors.gray600}>{disease.season_end_stage ?? 'Unknown'}</Typography>
          </View>
        </DetailCard>
      )}

      {disease.spreads_via && disease.spreads_via.length > 0 && (
        <DetailCard icon="share-variant" title="Spreads Via" color={disease.severity_label.color}>
          <View style={styles.chipsRow}>
            {disease.spreads_via.map((via, i) => (
              <View key={i} style={styles.chip}>
                <Icon name="arrow-expand" size={10} color={Colors.primary} />
                <Typography variant="badgeText" color={Colors.gray600} style={{ marginLeft: 4 }}>
                  {capitalize(via)}
                </Typography>
              </View>
            ))}
          </View>
        </DetailCard>
      )}
    </>
  );
}

function IdentifySection({ disease }: { disease: import('../services/diseaseApi').DiseaseDetail }) {
  return (
    <>
      {disease.gallery && disease.gallery.length > 0 && (
        <DetailCard icon="image-multiple" title={`Disease Images (${disease.gallery.length})`} color={disease.severity_label.color}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {disease.gallery.map((img, i) => (
              <Image key={i} source={{ uri: img.thumb }} style={styles.galleryThumb} />
            ))}
          </ScrollView>
        </DetailCard>
      )}

      {disease.identification && disease.identification.length > 0 && (
        <DetailCard icon="magnify" title="How to Identify" color={disease.severity_label.color}>
          <BilingualSteps steps={disease.identification} />
        </DetailCard>
      )}

      {disease.confused_with && disease.confused_with.length > 0 && (
        <DetailCard icon="shuffle-variant" title="Often Confused With" color={disease.severity_label.color}>
          {disease.confused_with.map((item, i) => (
            <View key={i} style={styles.confusedItem}>
              <Icon name="help-circle" size={14} color={Colors.gray400} />
              <Typography variant="bodySmall" color={Colors.gray700} style={{ marginLeft: 8, flex: 1 }}>
                {typeof item === 'string' ? item : (item.name ?? item.en ?? JSON.stringify(item))}
              </Typography>
            </View>
          ))}
        </DetailCard>
      )}
    </>
  );
}

function ManageSection({ disease }: { disease: import('../services/diseaseApi').DiseaseDetail }) {
  return (
    <>
      {disease.prevention && disease.prevention.length > 0 && (
        <DetailCard icon="shield-check" title="Prevention" color={Colors.primary} accent>
          <BilingualSteps steps={disease.prevention} />
        </DetailCard>
      )}

      {disease.organic_treatment && disease.organic_treatment.length > 0 && (
        <DetailCard icon="leaf" title="Organic Treatment" color={Colors.primary} accent>
          <BilingualSteps steps={disease.organic_treatment} />
        </DetailCard>
      )}

      {disease.yield_loss_note && (
        <DetailCard icon="chart-line" title="Yield Impact" color={Colors.warning} warn>
          <BilingualContent content={disease.yield_loss_note} />
        </DetailCard>
      )}
    </>
  );
}

function RiskSection({ disease, sevColor }: { disease: import('../services/diseaseApi').DiseaseDetail; sevColor: string }) {
  return (
    <>
      {(disease.altitude_min_feet || disease.altitude_max_feet) && (
        <DetailCard icon="terrain" title="Altitude Range" color={sevColor}>
          <View style={styles.meter}>
            <View style={styles.meterHeader}>
              <Typography variant="metaText" color={Colors.gray500}>{(disease.altitude_min_feet ?? 0).toLocaleString()} ft</Typography>
              <Typography variant="metaText" color={Colors.gray500}>{(disease.altitude_max_feet ?? 10000).toLocaleString()} ft</Typography>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, {
                left: `${((disease.altitude_min_feet ?? 0) / 10000) * 100}%`,
                width: `${(((disease.altitude_max_feet ?? 10000) - (disease.altitude_min_feet ?? 0)) / 10000) * 100}%`,
                backgroundColor: sevColor,
              }]} />
            </View>
          </View>
        </DetailCard>
      )}

      {(disease.risk_temp_min_c || disease.risk_temp_max_c) && (
        <DetailCard icon="thermometer" title="Temperature Risk" color={sevColor}>
          <View style={styles.meter}>
            <View style={styles.meterHeader}>
              <Typography variant="metaText" color={Colors.gray500}>{disease.risk_temp_min_c ?? 0}°C</Typography>
              <Typography variant="metaText" color={Colors.gray500}>{disease.risk_temp_max_c ?? 35}°C</Typography>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, {
                left: `${((disease.risk_temp_min_c ?? 0) / 45) * 100}%`,
                width: `${(((disease.risk_temp_max_c ?? 35) - (disease.risk_temp_min_c ?? 0)) / 45) * 100}%`,
                backgroundColor: '#ea580c',
              }]} />
            </View>
          </View>
        </DetailCard>
      )}

      {disease.risk_humidity_pct && (
        <DetailCard icon="water-percent" title="Humidity Threshold" color={sevColor}>
          <View style={styles.meter}>
            <View style={styles.meterHeader}>
              <Typography variant="metaText" color={Colors.gray500}>Risk above</Typography>
              <Typography variant="metaText" color={Colors.gray500}>{disease.risk_humidity_pct}%</Typography>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${disease.risk_humidity_pct}%`, backgroundColor: '#3b82f6' }]} />
            </View>
          </View>
        </DetailCard>
      )}
    </>
  );
}

// ── Reusable Sub-Components ──

function StatItem({ icon, value, unit, warn }: { icon: string; value: string; unit?: string; warn?: boolean }) {
  return (
    <View style={[styles.statItem, warn && styles.statItemWarn]}>
      <Icon name={icon} size={12} color={warn ? Colors.warning : Colors.primary} />
      <Typography variant="bodySmall" color={Colors.gray800} style={styles.statValue}>
        {value}
      </Typography>
      {unit && (
        <Typography variant="metaText" color={Colors.gray500}>
          {unit}
        </Typography>
      )}
    </View>
  );
}

function DetailCard({
  icon,
  title,
  color,
  accent,
  warn,
  children,
}: {
  icon: string;
  title: string;
  color: string;
  accent?: boolean;
  warn?: boolean;
  children: React.ReactNode;
}) {
  const stripColor = warn ? Colors.warning : accent ? Colors.primary : color;
  return (
    <View style={styles.detailCardShadow}>
      <View style={[styles.detailCardInner, { flexDirection: 'row' }]}>
        <View style={[styles.cardStrip, { backgroundColor: stripColor }]} />
        <View style={{ flex: 1 }}>
          <View style={styles.cardHead}>
            <Icon name={icon} size={16} color={stripColor} />
            <Typography variant="cardTitle" style={styles.cardTitle}>
              {title}
            </Typography>
          </View>
          <View style={styles.cardBody}>{children}</View>
        </View>
      </View>
    </View>
  );
}

function BilingualContent({ content }: { content: Array<{ en?: string; hi?: string }> | string | null }) {
  if (!content) return null;

  // If it's still a raw string (shouldn't happen after API fix, but safety net)
  if (typeof content === 'string') {
    // Try to parse it as JSON in case API sent a JSON string
    let parsed: Array<{ en?: string; hi?: string }> | null = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Not valid JSON, render as plain text
      return <Typography variant="body" color={Colors.gray700} style={styles.cardText}>{content}</Typography>;
    }
    if (parsed && Array.isArray(parsed)) {
      content = parsed;
    } else {
      return <Typography variant="body" color={Colors.gray700} style={styles.cardText}>{content}</Typography>;
    }
  }

  // Handle empty array
  if (Array.isArray(content) && content.length === 0) {
    return null;
  }

  return (
    <>
      {content.map((item, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          {item.en && <Typography variant="body" color={Colors.gray700} style={styles.cardText}>{item.en}</Typography>}
          {item.hi && <Typography variant="hindiBody" color={Colors.gray400} style={styles.cardTextHi}>{item.hi}</Typography>}
        </View>
      ))}
    </>
  );
}

function BilingualSteps({ steps }: { steps: Array<{ en?: string; hi?: string }> | string | null }) {
  if (!steps) return null;

  // Handle raw JSON string safety net
  let normalizedSteps: Array<{ en?: string; hi?: string }> = [];
  if (typeof steps === 'string') {
    try {
      const parsed = JSON.parse(steps);
      normalizedSteps = Array.isArray(parsed) ? parsed : [];
    } catch {
      normalizedSteps = [{ en: steps, hi: '' }];
    }
  } else {
    normalizedSteps = steps;
  }

  if (normalizedSteps.length === 0) return null;

  return (
    <View style={{ gap: 10 }}>
      {normalizedSteps.map((step, i) => (
        <View key={i} style={styles.stepRow}>
          <View style={styles.stepNumber}>
            <Typography variant="badgeText" color={Colors.white}>{i + 1}</Typography>
          </View>
          <View style={{ flex: 1 }}>
            {step.en && <Typography variant="bodySmall" color={Colors.gray700}>{step.en}</Typography>}
            {step.hi && <Typography variant="hindiMeta" color={Colors.gray400}>{step.hi}</Typography>}
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Helpers ──

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Styles ──

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16 },
  errorText: { marginTop: 12, textAlign: 'center' },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.surfaceSubtle, borderRadius: 999 },

  // Hero
  hero: { position: 'relative', width: SCREEN_W, height: 200, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroBadges: { position: 'absolute', bottom: 12, left: 14, flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeOutline: { backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Identity
  identity: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  nameEn: { fontSize: 24, lineHeight: 28 },
  nameHi: { marginTop: 2, fontSize: 15 },
  sciName: { marginTop: 2, fontStyle: 'italic' },

  // Stats
  statsScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, backgroundColor: Colors.white, borderRadius: 17, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
  statItemWarn: { backgroundColor: `${Colors.warning}10`, borderColor: `${Colors.warning}30` },
  statValue: { fontWeight: '700' },

  // Tabs
  tabsScroll: { paddingHorizontal: 12, gap: 4, borderBottomWidth: 1, borderBottomColor: Colors.gray200, backgroundColor: Colors.background },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },

  // Detail Card
  detailCardShadow: { borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  detailCardInner: { backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden' },
  cardStrip: { width: 3, alignSelf: 'stretch' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  cardTitle: { flex: 1 },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
  cardText: { lineHeight: 22 },
  cardTextHi: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.gray200, lineHeight: 22 },

  // Gallery
  galleryThumb: { width: 80, height: 80, borderRadius: 12, marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },

  // Steps
  stepRow: { flexDirection: 'row', gap: 10 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },

  // Season bar
  seasonBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  seasonLine: { flex: 1, height: 2, backgroundColor: Colors.gray200 },

  // Chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.white, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },

  // Confused
  confusedItem: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: Colors.white, borderRadius: 16, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },

  // Meter
  meter: { marginBottom: 4 },
  meterHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  meterTrack: { position: 'relative', width: '100%', height: 6, backgroundColor: Colors.gray100, borderRadius: 3, overflow: 'hidden' },
  meterFill: { position: 'absolute', top: 0, height: '100%', borderRadius: 3 },

  // Related
  relatedTitle: { marginBottom: 12 },
  relatedScroll: { gap: 12, paddingBottom: 8 },
  relatedCardShadow: { width: 140, borderRadius: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  relatedCardInner: { backgroundColor: Colors.white, borderRadius: 18, padding: 8, overflow: 'hidden' },
  relatedHero: { width: '100%', height: 70, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  relatedBody: { gap: 4 },
  relatedSevBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 2, paddingHorizontal: 6 },

  // Safe bottom
  safeBottom: { height: 100 },

  // Back button
  backBtn: { position: 'absolute', top: 12, left: 12, zIndex: 10 },
  backBtnBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
});
