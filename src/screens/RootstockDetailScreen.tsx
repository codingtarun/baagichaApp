/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ROOTSTOCK DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full detail view for a single rootstock.
 * Fetches from: GET /api/v1/rootstocks/{slug}
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useRootstockDetail } from '../hooks/useRootstockDetail';
import type { DiscoverNavigationProp, RootstockDetailRouteProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'planting', label: 'Planting' },
  { key: 'resistance', label: 'Resistance' },
  { key: 'soil', label: 'Soil & Site' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function RootstockDetailScreen(): React.JSX.Element {
  const route = useRoute<RootstockDetailRouteProp>();
  const navigation = useNavigation<DiscoverNavigationProp>();
  const { slug } = route.params;

  const { rootstock, loading, error } = useRootstockDetail(slug);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (loading && !rootstock) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Typography variant="bodyMuted" style={styles.loadingText}>
          Loading rootstock...
        </Typography>
      </SafeAreaView>
    );
  }

  if (error || !rootstock) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <Icon name="alert-circle" size={40} color={Colors.danger} />
        <Typography variant="body" color={Colors.danger} style={styles.errorText}>
          {error ?? 'Rootstock not found'}
        </Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Typography variant="bodySmall" color={Colors.primary}>
            Go Back
          </Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const vc = rootstock.vigour_color;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {rootstock.hero_image ? (
            <Image source={{ uri: rootstock.hero_image }} style={styles.heroImg} />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: `${vc}18` }]}>
              <Icon name="tree" size={48} color={vc} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: vc }]}>
              <View style={[styles.badgeDot, { backgroundColor: Colors.white }]} />
              <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                {rootstock.vigour_label}
              </Typography>
            </View>
            {rootstock.hp_recommended && (
              <View style={[styles.badge, { backgroundColor: Colors.primary }]}>
                <Icon name="check" size={10} color={Colors.white} />
                <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                  HP Recommended
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={styles.identity}>
          <Typography variant="displayHeading" style={styles.nameEn}>
            {rootstock.name}
          </Typography>
          {rootstock.name_hi && (
            <Typography variant="hindiDisplaySection" style={styles.nameHi}>
              {rootstock.name_hi}
            </Typography>
          )}
          {rootstock.full_name && (
            <Typography variant="metaText" color={Colors.gray400} style={styles.sciName}>
              {rootstock.full_name}
            </Typography>
          )}
          {rootstock.developed_by && (
            <View style={styles.originRow}>
              <Icon name="flask-outline" size={12} color={Colors.gray500} />
              <Typography variant="metaText" color={Colors.gray500} style={styles.originText}>
                {rootstock.developed_by}
                {rootstock.developed_year ? `, ${rootstock.developed_year}` : ''}
              </Typography>
            </View>
          )}
        </View>

        {/* ── Quick Stats ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {rootstock.avg_rating !== null && (
            <StatItem icon="star" value={`${rootstock.avg_rating.toFixed(1)}`} unit="rating" />
          )}
          {(rootstock.spacing_m_row || rootstock.spacing_m_tree) && (
            <StatItem icon="arrow-expand" value={`${rootstock.spacing_m_row ?? '?'}m × ${rootstock.spacing_m_tree ?? '?'}m`} unit="spacing" />
          )}
          {rootstock.years_to_first_crop && (
            <StatItem icon="calendar" value={`${rootstock.years_to_first_crop} yrs`} unit="to first crop" />
          )}
          {rootstock.productive_life_years && (
            <StatItem icon="leaf" value={`${rootstock.productive_life_years} yrs`} unit="productive life" />
          )}
          <StatItem icon="eye" value={rootstock.view_count.toLocaleString()} unit="views" />
        </ScrollView>

        {/* ── Tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: vc }]}
            >
              <Typography
                variant="bodySmall"
                color={activeTab === tab.key ? vc : Colors.gray400}
                style={{ fontWeight: activeTab === tab.key ? '700' : '500' }}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Tab Content ── */}
        <View style={styles.section}>
          {activeTab === 'overview' && <OverviewSection rootstock={rootstock} />}
          {activeTab === 'planting' && <PlantingSection rootstock={rootstock} />}
          {activeTab === 'resistance' && <ResistanceSection rootstock={rootstock} />}
          {activeTab === 'soil' && <SoilSection rootstock={rootstock} />}
        </View>

        {/* ── Related Rootstocks ── */}
        {rootstock.related.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.relatedTitle}>
              Similar Rootstocks
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
              {rootstock.related.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={[styles.relatedCard, { borderColor: `${rel.vigour_color}30` }]}
                  onPress={() => navigation.navigate('RootstockDetail', { slug: rel.slug })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.relatedHero, { backgroundColor: `${rel.vigour_color}12` }]}>
                    <Icon name="tree" size={24} color={rel.vigour_color} />
                  </View>
                  <View style={styles.relatedBody}>
                    <Typography variant="cardTitle" lines={1} style={{ fontSize: 12 }}>
                      {rel.name}
                    </Typography>
                    <Typography variant="metaText" color={Colors.gray500}>
                      {rel.vigour_label} · {rel.spacing}
                    </Typography>
                  </View>
                </TouchableOpacity>
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

function OverviewSection({ rootstock }: { rootstock: any }) {
  return (
    <>
      {rootstock.description_en && (
        <DetailCard icon="text" title="About This Rootstock" color={rootstock.vigour_color}>
          <Typography variant="body" color={Colors.gray700} style={styles.cardText}>
            {rootstock.description_en}
          </Typography>
          {rootstock.description_hi && (
            <Typography variant="hindiBody" color={Colors.gray400} style={styles.cardTextHi}>
              {rootstock.description_hi}
            </Typography>
          )}
        </DetailCard>
      )}

      {rootstock.gallery?.length > 0 && (
        <DetailCard icon="image-multiple" title="Gallery" color={rootstock.vigour_color}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {rootstock.gallery.map((img: any, i: number) => (
              <Image key={i} source={{ uri: img.thumb }} style={styles.galleryThumb} />
            ))}
          </ScrollView>
        </DetailCard>
      )}

      {rootstock.parentage && (
        <DetailCard icon="family-tree" title="Parentage" color={rootstock.vigour_color}>
          <Typography variant="body" color={Colors.gray700} style={styles.cardText}>
            {rootstock.parentage}
          </Typography>
        </DetailCard>
      )}
    </>
  );
}

function PlantingSection({ rootstock }: { rootstock: any }) {
  const specs = [
    rootstock.spacing_m_row && { label: 'Row Spacing', value: `${rootstock.spacing_m_row} m` },
    rootstock.spacing_m_tree && { label: 'Tree Spacing', value: `${rootstock.spacing_m_tree} m` },
    rootstock.density_per_ha_min && { label: 'Density (min)', value: `${rootstock.density_per_ha_min.toLocaleString()} / ha` },
    rootstock.density_per_ha_max && { label: 'Density (max)', value: `${rootstock.density_per_ha_max.toLocaleString()} / ha` },
    rootstock.years_to_first_crop && { label: 'First Crop', value: `${rootstock.years_to_first_crop} years` },
    rootstock.productive_life_years && { label: 'Productive Life', value: `${rootstock.productive_life_years} years` },
    { label: 'Needs Staking', value: rootstock.needs_staking ? 'Yes ✓' : 'No' },
    { label: 'Needs Irrigation', value: rootstock.needs_irrigation ? 'Yes ✓' : 'No' },
  ].filter(Boolean);

  return (
    <>
      <DetailCard icon="sprout" title="Planting Specifications" color={Colors.primary} accent>
        <SpecGrid items={specs} />
      </DetailCard>

      {(rootstock.planting_notes_en || rootstock.planting_notes_hi) && (
        <DetailCard icon="lightbulb-on" title="Planting Notes" color={Colors.primary} accent>
          {rootstock.planting_notes_en && (
            <Typography variant="body" color={Colors.gray700} style={styles.cardText}>
              {rootstock.planting_notes_en}
            </Typography>
          )}
          {rootstock.planting_notes_hi && (
            <Typography variant="hindiBody" color={Colors.gray400} style={styles.cardTextHi}>
              {rootstock.planting_notes_hi}
            </Typography>
          )}
        </DetailCard>
      )}
    </>
  );
}

function ResistanceSection({ rootstock }: { rootstock: any }) {
  const resistances = [
    { label: 'Collar Rot', value: rootstock.collar_rot_resistance, color: rootstock.collar_rot_res_color, text: rootstock.collar_rot_res_label },
    { label: 'Woolly Aphid', value: rootstock.woolly_aphid_resistance, color: rootstock.woolly_aphid_res_color, text: rootstock.woolly_aphid_res_label },
    { label: 'Replant Disease', value: rootstock.replant_disease_res, color: rootstock.replant_disease_res_color, text: rootstock.replant_disease_res_label },
    { label: 'Fire Blight', value: rootstock.fire_blight_res, color: rootstock.fire_blight_res_color, text: rootstock.fire_blight_res_label },
  ];

  return (
    <>
      <DetailCard icon="shield-check" title="Disease Resistance" color={Colors.primary} accent>
        {resistances.map((r) => (
          <View key={r.label} style={styles.meter}>
            <View style={styles.meterHeader}>
              <Typography variant="metaText" color={Colors.gray500}>{r.label}</Typography>
              <Typography variant="metaText" color={r.color} style={{ fontWeight: '700' }}>
                {r.text}
              </Typography>
            </View>
            <View style={styles.meterTrack}>
              <View style={[styles.meterFill, { width: `${((r.value ?? 5) / 10) * 100}%`, backgroundColor: r.color }]} />
            </View>
          </View>
        ))}
      </DetailCard>

      {rootstock.collar_rot_warning_en && (
        <DetailCard icon="alert" title="Important Warning" color={Colors.warning} warn>
          <Typography variant="bodySmall" color={Colors.gray700} style={styles.cardText}>
            {rootstock.collar_rot_warning_en}
          </Typography>
        </DetailCard>
      )}

      {rootstock.anchorage && (
        <DetailCard icon="anchor" title="Anchorage" color={rootstock.vigour_color}>
          <Typography variant="body" color={Colors.gray700} style={styles.cardText}>
            {capitalize(rootstock.anchorage)}
          </Typography>
        </DetailCard>
      )}
    </>
  );
}

function SoilSection({ rootstock }: { rootstock: any }) {
  const specs = [
    rootstock.soil_depth_cm_min && { label: 'Soil Depth (min)', value: `${rootstock.soil_depth_cm_min} cm` },
    (rootstock.soil_ph_min || rootstock.soil_ph_max) && {
      label: 'Soil pH',
      value: `${rootstock.soil_ph_min ?? '?'}–${rootstock.soil_ph_max ?? '?'}`,
    },
    rootstock.cold_hardiness_feet && { label: 'Cold Hardiness', value: `${rootstock.cold_hardiness_feet.toLocaleString()} ft` },
  ].filter(Boolean);

  return (
    <DetailCard icon="terrain" title="Soil & Site Requirements" color={rootstock.vigour_color}>
      <SpecGrid items={specs} />
    </DetailCard>
  );
}

// ── Reusable Sub-Components ──

function StatItem({ icon, value, unit }: { icon: string; value: string; unit?: string }) {
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={12} color={Colors.primary} />
      <Typography variant="bodySmall" color={Colors.gray800} style={styles.statValue}>
        {value}
      </Typography>
      {unit && (
        <Typography variant="metaText" color={Colors.gray500}>{unit}</Typography>
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
  return (
    <View
      style={[
        styles.detailCard,
        accent && { borderLeftWidth: 3, borderLeftColor: Colors.primary },
        warn && { borderLeftWidth: 3, borderLeftColor: Colors.warning },
      ]}
    >
      <View style={styles.cardHead}>
        <Icon name={icon} size={16} color={warn ? Colors.warning : color} />
        <Typography variant="cardTitle" style={styles.cardTitle}>{title}</Typography>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function SpecGrid({ items }: { items: any[] }) {
  return (
    <View style={styles.specGrid}>
      {items.map((item, i) => (
        <View key={i} style={[styles.specItem, item.full && styles.specFull]}>
          <Typography variant="metaText" color={Colors.gray400} style={styles.specLabel}>
            {item.label}
          </Typography>
          <Typography variant="bodySmall" color={Colors.gray800} style={styles.specValue}>
            {item.value}
          </Typography>
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
  container: { flex: 1, backgroundColor: Colors.white },
  centered: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 16 },
  errorText: { marginTop: 12, textAlign: 'center' },
  retryBtn: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.gray100, borderRadius: 8 },

  // Hero
  hero: { position: 'relative', width: SCREEN_W, height: 200, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroBadges: { position: 'absolute', bottom: 12, left: 14, flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Identity
  identity: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  nameEn: { fontSize: 24, lineHeight: 28 },
  nameHi: { marginTop: 2, fontSize: 15 },
  sciName: { marginTop: 2, fontStyle: 'italic' },
  originRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  originText: { marginLeft: 4 },

  // Stats
  statsScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12, backgroundColor: Colors.gray50, borderRadius: 17, borderWidth: 1, borderColor: Colors.gray200 },
  statValue: { fontWeight: '700' },

  // Tabs
  tabsScroll: { paddingHorizontal: 12, gap: 4, borderBottomWidth: 1, borderBottomColor: Colors.gray200, backgroundColor: Colors.white },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },

  // Detail Card
  detailCard: { backgroundColor: Colors.gray50, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.gray200, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  cardTitle: { flex: 1 },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
  cardText: { lineHeight: 22 },
  cardTextHi: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.gray200, lineHeight: 22 },

  // Gallery
  galleryThumb: { width: 80, height: 80, borderRadius: 10, marginRight: 8, borderWidth: 2, borderColor: Colors.gray100 },

  // Spec Grid
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  specItem: { width: '47%', gap: 2 },
  specFull: { width: '100%' },
  specLabel: { textTransform: 'uppercase', letterSpacing: 0.4 },
  specValue: { fontWeight: '600' },

  // Meter
  meter: { marginBottom: 12 },
  meterHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  meterTrack: { position: 'relative', width: '100%', height: 6, backgroundColor: Colors.gray100, borderRadius: 3, overflow: 'hidden' },
  meterFill: { position: 'absolute', top: 0, height: '100%', borderRadius: 3 },

  // Related
  relatedTitle: { marginBottom: 12 },
  relatedScroll: { gap: 12, paddingBottom: 8 },
  relatedCard: { width: 140, backgroundColor: Colors.gray50, borderRadius: 14, padding: 8, borderWidth: 1, overflow: 'hidden' },
  relatedHero: { width: '100%', height: 70, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  relatedBody: { gap: 4 },

  // Safe bottom
  safeBottom: { height: 100 },

  // Back button
  backBtn: { position: 'absolute', top: 12, left: 12, zIndex: 10 },
  backBtnBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
});
