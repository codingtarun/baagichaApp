/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — VARIETY COMPARE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Side-by-side comparison of up to 3 apple varieties.
 * Receives slugs via navigation params, fetches details,
 * and renders a comparison table.
 *
 * LEARN: This screen receives data via route params instead of
 * local state. The parent (VarietyScreen) passes the selected
 * variety slugs, and this screen fetches their full details.
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useVarietyDetail } from '../hooks/useVarietyDetail';
import type { DiscoverNavigationProp, VarietyCompareRouteProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VarietyCompareScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();
  const route = useRoute<VarietyCompareRouteProp>();
  const { slugs } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color={Colors.gray700} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Typography variant="displayHeading" style={styles.title}>
            Compare Varieties
          </Typography>
          <Typography variant="hindiDisplaySection" style={styles.subtitle}>
            किस्मों की तुलना
          </Typography>
        </View>
        <View style={styles.backBtn} />
      </View>

      {/* Comparison table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tableScroll}
      >
        {/* Label column */}
        <View style={styles.labelCol}>
          <View style={[styles.cell, styles.cellHeader]}>
            <Typography variant="badgeText" color={Colors.gray400}>
              Attribute
            </Typography>
          </View>
          <LabelCell label="Season" />
          <LabelCell label="Origin" />
          <LabelCell label="Fruit Size" />
          <LabelCell label="Taste" />
          <LabelCell label="Altitude" />
          <LabelCell label="Yield" />
          <LabelCell label="Storage" />
          <LabelCell label="Self-Fertile" />
          <LabelCell label="Export" />
        </View>

        {/* Variety columns */}
        {slugs.map((slug) => (
          <VarietyCol key={slug} slug={slug} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ──

function LabelCell({ label }: { label: string }) {
  return (
    <View style={[styles.cell, styles.cellLabel]}>
      <Typography variant="metaText" color={Colors.gray500}>
        {label}
      </Typography>
    </View>
  );
}

function VarietyCol({ slug }: { slug: string }) {
  const { variety, loading, error } = useVarietyDetail(slug);

  if (loading) {
    return (
      <View style={styles.varietyCol}>
        <View style={[styles.cell, styles.cellHeader]}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={styles.cell}>
            <View style={styles.skeleton} />
          </View>
        ))}
      </View>
    );
  }

  if (error || !variety) {
    return (
      <View style={styles.varietyCol}>
        <View style={[styles.cell, styles.cellHeader]}>
          <Typography variant="badgeText" color={Colors.danger}>Error</Typography>
        </View>
      </View>
    );
  }

  const sc = variety.season_color;

  return (
    <View style={styles.varietyCol}>
      {/* Name header */}
      <View style={[styles.cell, styles.cellHeader, { borderBottomColor: sc }]}>
        <Typography variant="cardTitle" style={{ color: sc }}>
          {variety.name_en}
        </Typography>
        {variety.name_hi && (
          <Typography variant="hindiMeta" color={Colors.gray400}>
            {variety.name_hi}
          </Typography>
        )}
      </View>

      <DataCell value={variety.season_label.en} color={sc} />
      <DataCell value={variety.origin ?? '—'} />
      <DataCell value={variety.fruit_size ? capitalize(variety.fruit_size) : '—'} />
      <DataCell value={variety.taste_profile ? capitalize(variety.taste_profile) : '—'} />
      <DataCell value={`${variety.altitude_min_feet ?? '?'}–${variety.altitude_max_feet ?? '?'} ft`} />
      <DataCell value={variety.yield_potential ? capitalize(variety.yield_potential) : '—'} />
      <DataCell value={variety.storage_life ?? '—'} />
      <DataCell value={variety.is_self_fertile ? 'Yes' : 'No'} />
      <DataCell value={variety.is_export_quality ? 'Yes ✓' : 'No'} />
    </View>
  );
}

function DataCell({ value, color }: { value: string; color?: string }) {
  return (
    <View style={styles.cell}>
      <Typography
        variant="bodySmall"
        color={color ?? Colors.gray700}
        style={{ fontWeight: color ? '700' : '400' }}
      >
        {value}
      </Typography>
    </View>
  );
}

// ── Helpers ──

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
  },
  subtitle: {
    marginTop: 0,
    fontSize: 13,
  },

  tableScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 2,
  },

  labelCol: {
    width: 110,
    borderRightWidth: 1,
    borderRightColor: Colors.gray200,
  },
  varietyCol: {
    width: 140,
    borderRightWidth: 1,
    borderRightColor: Colors.gray200,
  },

  cell: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  cellHeader: {
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray200,
    justifyContent: 'center',
    gap: 2,
  },
  cellLabel: {
    backgroundColor: Colors.gray50,
  },

  skeleton: {
    height: 12,
    width: '70%',
    backgroundColor: Colors.gray200,
    borderRadius: 4,
  },
});
