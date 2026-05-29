/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — VARIETY DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full detail view for a single apple variety.
 * Fetches from: GET /api/v1/varieties/{slug}
 *
 * Layout (matching Laravel web design):
 *   1. Hero image with badges
 *   2. Identity (name, hindi, scientific, origin)
 *   3. Quick stats scroll
 *   4. Section tabs (Overview, Tree, Climate, Disease, Market)
 *   5. Content cards for active tab
 *   6. Related varieties horizontal scroll
 *
 * LEARN: This screen uses a "tab switcher" pattern where we
 * conditionally render content based on the active tab. This is
 * simpler than a full TabNavigator since the tabs don't have
 * their own navigation history.
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
import { Shadows, Radius } from '../theme/style';
import { Typography } from '../typography';
import { useVarietyDetail } from '../hooks/useVarietyDetail';
import type { VarietyDetailRouteProp, DiscoverNavigationProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import VarietyCard from '../components/VarietyCard';

const { width: SCREEN_W } = Dimensions.get('window');

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'tree', label: 'Tree & Fruit' },
  { key: 'climate', label: 'Climate' },
  { key: 'disease', label: 'Disease' },
  { key: 'market', label: 'Market' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function VarietyDetailScreen(): React.JSX.Element {
  const route = useRoute<VarietyDetailRouteProp>();
  // LEARN: useNavigation() inside DiscoverStack gives us the
  // Discover stack navigator. Pushing another variety detail
  // keeps the bottom tab bar visible.
  const navigation = useNavigation<DiscoverNavigationProp>();
  const { slug } = route.params;

  const { variety, loading, error, refresh } = useVarietyDetail(slug);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Orchard tracking for related variety cards
  const [orchardSet, setOrchardSet] = useState<Set<number>>(new Set());

  const toggleOrchard = (id: number) => {
    setOrchardSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading && !variety) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Typography variant="bodyMuted" style={styles.loadingText}>
          Loading variety...
        </Typography>
      </SafeAreaView>
    );
  }

  if (error || !variety) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['top']}>
        <Icon name="alert-circle" size={40} color={Colors.danger} />
        <Typography variant="body" color={Colors.danger} style={styles.errorText}>
          {error ?? 'Variety not found'}
        </Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
          <Typography variant="bodySmall" color={Colors.primary}>
            Go Back
          </Typography>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const sc = variety.season_color;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!variety} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          {variety.hero_image ? (
            <Image source={{ uri: variety.hero_image }} style={styles.heroImg} />
          ) : (
            <View style={[styles.heroPlaceholder, { backgroundColor: `${sc}18` }]}>
              <Icon name="apple" size={48} color={sc} />
            </View>
          )}
          {/* Gradient overlay */}
          <View style={styles.heroOverlay} />
          {/* Orchard toggle — top right of hero image */}
          <TouchableOpacity
            style={[styles.heroOrchardBtn, orchardSet.has(variety.id) && styles.heroOrchardBtnActive]}
            onPress={() => toggleOrchard(variety.id)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name="sprout"
              size={18}
              color={orchardSet.has(variety.id) ? Colors.white : Colors.gray600}
            />
          </TouchableOpacity>
          {/* Badges */}
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: sc }]}>
              <Icon name="clock-outline" size={10} color={Colors.white} />
              <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                {variety.season_label.en}
              </Typography>
            </View>
            {variety.is_featured && (
              <View style={[styles.badge, { backgroundColor: Colors.accent }]}>
                <Icon name="star" size={10} color={Colors.white} />
                <Typography variant="badgeText" color={Colors.white} style={styles.badgeText}>
                  Featured
                </Typography>
              </View>
            )}
            {variety.is_export_quality && (
              <View style={[styles.badge, styles.badgeOutline, { borderColor: Colors.info }]}>
                <Icon name="earth" size={10} color={Colors.info} />
                <Typography variant="badgeText" color={Colors.info} style={styles.badgeText}>
                  Export
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* ── Identity ── */}
        <View style={styles.identity}>
          <Typography variant="displayHeading" style={styles.nameEn}>
            {variety.name_en}
          </Typography>
          {variety.name_hi && (
            <Typography variant="hindiDisplaySection" style={styles.nameHi}>
              {variety.name_hi}
            </Typography>
          )}
          {variety.scientific_name && (
            <Typography variant="metaText" color={Colors.gray400} style={styles.sciName}>
              <Typography variant="metaText" color={Colors.gray400}>
                {variety.scientific_name}
              </Typography>
            </Typography>
          )}
          {variety.origin && (
            <View style={styles.originRow}>
              <Icon name="map-marker" size={12} color={Colors.gray500} />
              <Typography variant="metaText" color={Colors.gray500} style={styles.originText}>
                {variety.origin}
                {variety.introduction_year ? `, introduced ${variety.introduction_year}` : ''}
              </Typography>
            </View>
          )}
        </View>

        {/* ── Quick Stats ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          {(variety.altitude_min_feet || variety.altitude_max_feet) && (
            <StatItem
              icon="terrain"
              value={`${variety.altitude_min_feet ?? 0}–${variety.altitude_max_feet ?? 0}`}
              unit="ft"
            />
          )}
          {variety.yield_potential && (
            <StatItem icon="package-variant" value={capitalize(variety.yield_potential)} unit="yield" />
          )}
          {variety.market_price_tier > 0 && (
            <StatItem icon="currency-inr" value={'₹'.repeat(variety.market_price_tier)} />
          )}
          <StatItem icon="eye" value={variety.view_count.toLocaleString()} unit="views" />
        </ScrollView>

        {/* ── Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && { borderBottomColor: sc }]}
            >
              <Typography
                variant="bodySmall"
                color={activeTab === tab.key ? sc : Colors.gray400}
                style={{ fontWeight: activeTab === tab.key ? '700' : '500' }}
              >
                {tab.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Tab Content ── */}
        <View style={styles.section}>
          {activeTab === 'overview' && <OverviewSection variety={variety} />}
          {activeTab === 'tree' && <TreeSection variety={variety} />}
          {activeTab === 'climate' && <ClimateSection variety={variety} />}
          {activeTab === 'disease' && <DiseaseSection variety={variety} />}
          {activeTab === 'market' && <MarketSection variety={variety} />}
        </View>

        {/* ── Related Varieties ── */}
        {variety.related.length > 0 && (
          <View style={styles.section}>
            <Typography variant="sectionHeader" style={styles.relatedTitle}>
              Other {variety.season_label.en} Varieties
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {variety.related.map((rel) => (
                <VarietyCard
                  key={rel.id}
                  item={rel}
                  onPress={() => navigation.navigate('VarietyDetail', { slug: rel.slug })}
                  style={styles.relatedCard}
                  inOrchard={orchardSet.has(rel.id)}
                  onToggleOrchard={() => toggleOrchard(rel.id)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom spacer for safe area */}
        <View style={styles.safeBottom} />
      </ScrollView>

      {/* Back button overlay */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <View style={styles.backBtnBg}>
          <Icon name="arrow-left" size={20} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Section Components ──

function OverviewSection({ variety }: { variety: any }) {
  return (
    <>
      {variety.description_en && (
        <DetailCard icon="text" title="About This Variety" color={variety.season_color}>
          <Typography variant="body" color={Colors.gray900} style={styles.cardText}>
            {variety.description_en}
          </Typography>
          {variety.description_hi && (
            <Typography variant="hindiBody" color={Colors.gray500} style={styles.cardTextHi}>
              {variety.description_hi}
            </Typography>
          )}
        </DetailCard>
      )}

      {variety.gallery.length > 0 && (
        <DetailCard icon="image-multiple" title="Gallery" color={variety.season_color}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {variety.gallery.map((img: any, i: number) => (
              <Image key={i} source={{ uri: img.thumb }} style={styles.galleryThumb} />
            ))}
          </ScrollView>
        </DetailCard>
      )}

      {variety.growing_tips && (
        <DetailCard icon="lightbulb-on" title="Growing Tips" color={Colors.primary} accent>
          <Typography variant="body" color={Colors.gray900} style={styles.cardText}>
            {variety.growing_tips}
          </Typography>
        </DetailCard>
      )}
    </>
  );
}

function TreeSection({ variety }: { variety: any }) {
  const treeSpecs = [
    variety.tree_vigor && { label: 'Vigour', value: capitalize(variety.tree_vigor) },
    variety.growth_habit && { label: 'Growth Habit', value: capitalize(variety.growth_habit) },
    variety.bearing_age_years && { label: 'Bearing Age', value: `${variety.bearing_age_years} years` },
    { label: 'Self-Fertile', value: variety.is_self_fertile ? 'Yes ✓' : 'No ✗' },
    variety.pollinators && { label: 'Pollinators', value: variety.pollinators, full: true },
  ].filter(Boolean);

  const fruitSpecs = [
    variety.fruit_size && { label: 'Size', value: capitalize(variety.fruit_size) },
    variety.fruit_shape && { label: 'Shape', value: capitalize(variety.fruit_shape) },
    variety.skin_color && { label: 'Skin Color', value: capitalize(variety.skin_color) },
    variety.flesh_color && { label: 'Flesh Color', value: capitalize(variety.flesh_color) },
    variety.avg_fruit_weight_g && { label: 'Avg. Weight', value: `${variety.avg_fruit_weight_g}g` },
    variety.taste_profile && { label: 'Taste', value: capitalize(variety.taste_profile) },
  ].filter(Boolean);

  const harvestSpecs = [
    variety.days_to_maturity && { label: 'Days to Maturity', value: `${variety.days_to_maturity} days` },
    variety.harvest_window && { label: 'Harvest Window', value: variety.harvest_window },
    variety.storage_life && { label: 'Storage Life', value: variety.storage_life },
    variety.storage_months && { label: 'Storage Duration', value: `${variety.storage_months} months` },
  ].filter(Boolean);

  return (
    <>
      <DetailCard icon="tree" title="Tree Characteristics" color={variety.season_color}>
        <SpecGrid items={treeSpecs} />
      </DetailCard>
      <DetailCard icon="apple" title="Fruit Profile" color={variety.season_color}>
        <SpecGrid items={fruitSpecs} />
      </DetailCard>
      <DetailCard icon="warehouse" title="Harvest & Storage" color={variety.season_color}>
        <SpecGrid items={harvestSpecs} />
      </DetailCard>
    </>
  );
}

function ClimateSection({ variety }: { variety: any }) {
  const climateSpecs = [
    variety.chilling_hours_min && { label: 'Chilling Hours (min)', value: `${variety.chilling_hours_min.toLocaleString()} hrs` },
    (variety.temp_ideal_min_c || variety.temp_ideal_max_c) && {
      label: 'Ideal Temp',
      value: `${variety.temp_ideal_min_c ?? '?'}–${variety.temp_ideal_max_c ?? '?'}°C`,
    },
    variety.rain_tolerance && { label: 'Rain Tolerance', value: variety.rain_tolerance },
  ].filter(Boolean);

  return (
    <>
      {(variety.altitude_min_feet || variety.altitude_max_feet) && (
        <DetailCard icon="terrain" title="Altitude Range" color={variety.season_color}>
          <AltitudeMeter
            min={variety.altitude_min_feet ?? 0}
            max={variety.altitude_max_feet ?? 10000}
            color={variety.season_color}
          />
          {variety.altitude_ideal && (
            <View style={styles.idealText}>
              <Icon name="information" size={10} color={Colors.gray500} />
              <Typography variant="metaText" color={Colors.gray500} style={{ marginLeft: 4 }}>
                {variety.altitude_ideal}
              </Typography>
            </View>
          )}
        </DetailCard>
      )}
      <DetailCard icon="weather-partly-cloudy" title="Climate Requirements" color={variety.season_color}>
        <SpecGrid items={climateSpecs} />
      </DetailCard>
    </>
  );
}

function DiseaseSection({ variety }: { variety: any }) {
  const resistance = variety.disease_resistance ?? {};
  const resistanceEntries = Object.entries(resistance);

  const resMap: Record<string, number> = {
    resistant: 9,
    moderately_resistant: 7,
    moderate: 5,
    susceptible: 3,
    highly_susceptible: 1,
  };

  return (
    <>
      {resistanceEntries.length > 0 && (
        <DetailCard icon="shield-check" title="Disease Resistance" color={variety.season_color}>
          {resistanceEntries.map(([disease, level]: [string, string]) => {
            const val = resMap[level.toLowerCase()] ?? 5;
            const resColor = val >= 7 ? Colors.success : val >= 4 ? Colors.warning : Colors.danger;
            return (
              <View key={disease} style={styles.meter}>
                <View style={styles.meterHeader}>
                  <Typography variant="metaText" color={Colors.gray500}>
                    {capitalizeWords(disease.replace(/_/g, ' '))}
                  </Typography>
                  <Typography variant="metaText" color={resColor} style={{ fontWeight: '700' }}>
                    {capitalizeWords(level.replace(/_/g, ' '))}
                  </Typography>
                </View>
                <View style={styles.meterTrack}>
                  <View style={[styles.meterFill, { width: `${(val / 10) * 100}%`, backgroundColor: resColor }]} />
                </View>
              </View>
            );
          })}
        </DetailCard>
      )}

      {variety.susceptibility && variety.susceptibility.length > 0 && (
        <DetailCard icon="alert" title="Susceptibilities" color={Colors.warning} warn>
          {variety.susceptibility.map((item: any, i: number) => (
            <View key={i} style={styles.warnItem}>
              <Icon name="alert-circle" size={14} color={Colors.warning} />
              <Typography variant="bodySmall" color={Colors.gray900} style={{ marginLeft: 8, flex: 1 }}>
                {typeof item === 'string' ? item : item.name ?? JSON.stringify(item)}
              </Typography>
            </View>
          ))}
        </DetailCard>
      )}

      {variety.recommended_rootstocks.length > 0 && (
        <DetailCard icon="sprout" title="Recommended Rootstocks" color={Colors.primary} accent>
          <View style={styles.chipsRow}>
            {variety.recommended_rootstocks.map((rs: string, i: number) => (
              <View key={i} style={styles.chip}>
                <Icon name="sprout" size={10} color={Colors.primary} />
                <Typography variant="badgeText" color={Colors.gray600} style={{ marginLeft: 4 }}>
                  {rs}
                </Typography>
              </View>
            ))}
          </View>
        </DetailCard>
      )}
    </>
  );
}

function MarketSection({ variety }: { variety: any }) {
  const marketSpecs = [
    variety.market_demand && { label: 'Demand', value: variety.market_demand },
    variety.market_price_tier > 0 && {
      label: 'Price Tier',
      value: '₹'.repeat(variety.market_price_tier) + '○'.repeat(5 - variety.market_price_tier),
    },
    variety.yield_kg_per_tree && { label: 'Yield / Tree', value: `${variety.yield_kg_per_tree} kg` },
    variety.yield_potential && { label: 'Yield Potential', value: capitalize(variety.yield_potential) },
    { label: 'Export Quality', value: variety.is_export_quality ? 'Yes ✓' : 'No' },
  ].filter(Boolean);

  return (
    <DetailCard icon="chart-pie" title="Market Overview" color={variety.season_color}>
      <SpecGrid items={marketSpecs} />
    </DetailCard>
  );
}

// ── Reusable Sub-Components ──

function StatItem({ icon, value, unit }: { icon: string; value: string; unit?: string }) {
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={12} color={Colors.primary} />
      <Typography variant="bodySmall" color={Colors.gray900} style={styles.statValue}>
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

function SpecGrid({ items }: { items: any[] }) {
  return (
    <View style={styles.specGrid}>
      {items.map((item, i) => (
        <View key={i} style={[styles.specItem, item.full && styles.specFull]}>
          <Typography variant="metaText" color={Colors.gray400} style={styles.specLabel}>
            {item.label}
          </Typography>
          <Typography variant="bodySmall" color={Colors.gray900} style={styles.specValue}>
            {item.value}
          </Typography>
        </View>
      ))}
    </View>
  );
}

function AltitudeMeter({ min, max, color }: { min: number; max: number; color: string }) {
  const maxScale = 10000;
  const left = (min / maxScale) * 100;
  const width = ((max - min) / maxScale) * 100;
  return (
    <View>
      <View style={styles.meterHeader}>
        <Typography variant="metaText" color={Colors.gray500}>{min.toLocaleString()} ft</Typography>
        <Typography variant="metaText" color={Colors.gray500}>{max.toLocaleString()} ft</Typography>
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { left: `${left}%`, width: `${width}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ── Helpers ──

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function capitalizeWords(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
  },

  // Hero
  hero: {
    position: 'relative',
    width: SCREEN_W,
    height: 200,
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroBadges: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeOutline: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Identity
  identity: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  nameEn: {
    fontSize: 24,
    lineHeight: 28,
  },
  nameHi: {
    marginTop: 2,
    fontSize: 15,
  },
  sciName: {
    marginTop: 2,
    fontStyle: 'italic',
    color: Colors.gray500,
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originText: {
    marginLeft: 4,
  },

  // Stats
  statsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    ...Shadows.subtle,
  },
  statValue: {
    fontWeight: '700',
  },

  // Tabs
  tabsScroll: {
    paddingHorizontal: 12,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    backgroundColor: Colors.background,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  // Section
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  // Detail Card
  detailCardShadow: {
    borderRadius: Radius['2xl'],
    marginBottom: 12,
    ...Shadows.medium,
  },
  detailCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
  },
  cardStrip: { width: 3, alignSelf: 'stretch' },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardTitle: {
    flex: 1,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  cardText: {
    lineHeight: 22,
    color: Colors.gray900,
  },
  cardTextHi: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    lineHeight: 22,
    color: Colors.gray500,
  },

  // Gallery
  galleryThumb: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    marginRight: 8,
    borderWidth: 2,
    borderColor: Colors.gray200,
  },

  // Spec Grid
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specItem: {
    width: '47%',
    gap: 2,
  },
  specFull: {
    width: '100%',
  },
  specLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  specValue: {
    fontWeight: '600',
    color: Colors.gray900,
  },

  // Meter
  meter: {
    marginBottom: 12,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meterTrack: {
    position: 'relative',
    width: '100%',
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  meterFill: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: 3,
  },
  idealText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  // Warn items
  warnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    marginBottom: 8,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
  },

  // Related
  relatedTitle: {
    marginBottom: 12,
  },
  relatedScroll: {
    gap: 12,
    paddingBottom: 24,
  },
  relatedCard: {
    width: 160,
  },

  // Safe bottom — extra space so last content isn't hidden behind bottom tab bar
  safeBottom: {
    height: 100,
  },

  // Orchard button on hero
  heroOrchardBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  heroOrchardBtnActive: {
    backgroundColor: Colors.primary,
  },

  // Back button
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
  },
  backBtnBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
