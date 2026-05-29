/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shows full orchard details, blocks, varieties, and quick
 * actions for spray logs, disease history, and pest trackers.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Shadows, Radius } from '../theme/style';
import { Typography, PrimaryHeading } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import { useOrchardDetail } from '../hooks/useOrchardDetail';
import { deleteBlock, deleteOrchardVariety } from '../services/orchardApi';
import { showToast } from '../store/toastStore';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'OrchardDetail'>;

export default function OrchardDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { orchardId } = route.params;
  const { orchard, loading, error, refreshing, refresh } = useOrchardDetail(orchardId);

  const [deletingBlock, setDeletingBlock] = useState<number | null>(null);
  const [deletingVariety, setDeletingVariety] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const goToEditOrchard = useCallback(() => {
    navigation.navigate('OrchardForm', { orchardId });
  }, [navigation, orchardId]);

  const goToAddBlock = useCallback(() => {
    navigation.navigate('BlockForm', { orchardId });
  }, [navigation, orchardId]);

  const goToEditBlock = useCallback(
    (blockId: number) => {
      navigation.navigate('BlockForm', { orchardId, blockId });
    },
    [navigation, orchardId]
  );

  const goToAddVariety = useCallback(() => {
    navigation.navigate('OrchardVarietyForm', { orchardId });
  }, [navigation, orchardId]);

  const goToVarietyDetail = useCallback(
    (slug: string) => {
      navigation.navigate('Discover' as never, {
        screen: 'VarietyDetail',
        params: { slug },
      } as never);
    },
    [navigation]
  );

  const goToEditVariety = useCallback(
    (varietyId: number) => {
      navigation.navigate('OrchardVarietyForm', { orchardId, varietyId });
    },
    [navigation, orchardId]
  );

  const handleDeleteBlock = useCallback(
    async (blockId: number) => {
      Alert.alert('Delete Block', 'Are you sure you want to delete this block?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingBlock(blockId);
            try {
              await deleteBlock(orchardId, blockId);
              showToast('Block deleted', 'success');
              refresh();
            } catch (err: any) {
              showToast(err?.response?.data?.message ?? 'Failed to delete block', 'error');
            } finally {
              setDeletingBlock(null);
            }
          },
        },
      ]);
    },
    [orchardId, refresh]
  );

  const handleDeleteVariety = useCallback(
    async (varietyId: number) => {
      Alert.alert('Delete Variety', 'Are you sure you want to remove this variety?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingVariety(varietyId);
            try {
              await deleteOrchardVariety(orchardId, varietyId);
              showToast('Variety removed', 'success');
              refresh();
            } catch (err: any) {
              showToast(err?.response?.data?.message ?? 'Failed to remove variety', 'error');
            } finally {
              setDeletingVariety(null);
            }
          },
        },
      ]);
    },
    [orchardId, refresh]
  );

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </ScreenLayout>
    );
  }

  if (error || !orchard) {
    return (
      <ScreenLayout>
        <View style={styles.centered}>
          <Icon name="alert-circle-outline" size={48} color={Colors.danger} />
          <Typography variant="bodyMuted" center style={styles.errorText}>
            {error ?? 'Orchard not found'}
          </Typography>
          <TouchableOpacity style={styles.retryButton} onPress={refresh} activeOpacity={0.8}>
            <Typography variant="button" style={styles.retryButtonText}>
              Retry
            </Typography>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout refreshing={refreshing} onRefresh={refresh}>
      <View style={styles.scrollContent}>
        {/* ── Orchard Header ── */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <PrimaryHeading style={styles.orchardName}>
                {orchard.orchard_name}
              </PrimaryHeading>
              <Typography variant="captionMuted" style={styles.locationText}>
                {orchard.village && `${orchard.village}, `}
                {orchard.district}, {orchard.state}
              </Typography>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={goToEditOrchard} activeOpacity={0.7}>
              <Icon name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <StatBadge icon="tree" label="Trees" value={orchard.total_trees ?? 0} />
            <StatBadge icon="ruler-square" label={orchard.area_unit ?? 'Area'} value={orchard.area_local_value ?? 0} />
            <StatBadge icon="chart-bar" label="Blocks" value={orchard.blocks?.length ?? 0} />
          </View>

          {orchard.microclimate_notes && (
            <Typography variant="captionMuted" style={styles.notes}>
              {orchard.microclimate_notes}
            </Typography>
          )}
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.section}>
          <Typography variant="body" style={styles.sectionTitle}>
            Activities / गतिविधियाँ
          </Typography>
          <View style={styles.actionsRow}>
            <ActionChip icon="spray" label="Spray Logs" labelHi="स्प्रे लॉग" />
            <ActionChip icon="virus" label="Disease History" labelHi="रोग इतिहास" />
            <ActionChip icon="bug" label="Pest Trackers" labelHi="कीट ट्रैकर" />
          </View>
        </View>

        {/* ── Blocks ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="body" style={styles.sectionTitle}>
              Blocks / ब्लॉक
            </Typography>
            <TouchableOpacity style={styles.addBtn} onPress={goToAddBlock} activeOpacity={0.7}>
              <Icon name="plus" size={18} color={Colors.primary} />
              <Typography variant="caption" style={styles.addBtnText}>
                Add
              </Typography>
            </TouchableOpacity>
          </View>

          {orchard.blocks.length === 0 ? (
            <View style={styles.emptyBox}>
              <Typography variant="captionMuted" center>
                No blocks added yet. Add a block to track varieties separately.
              </Typography>
            </View>
          ) : (
            orchard.blocks.map((block) => (
              <View key={block.id} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Typography variant="body" style={styles.itemName}>
                      {block.name}
                    </Typography>
                    <Typography variant="captionMuted">
                      {block.block_varieties && block.block_varieties.length > 0
                        ? block.block_varieties.map((bv) => `${bv.variety?.name_en ?? 'Unknown'}${bv.rootstock ? ` (${bv.rootstock.name})` : ''}`).join(', ')
                        : 'No variety'}
                      {' • '}{block.plant_count ?? 0} trees
                    </Typography>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => goToEditBlock(block.id)} activeOpacity={0.7}>
                      <Icon name="pencil-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteBlock(block.id)}
                      disabled={deletingBlock === block.id}
                      activeOpacity={0.7}
                    >
                      {deletingBlock === block.id ? (
                        <ActivityIndicator size="small" color={Colors.danger} />
                      ) : (
                        <Icon name="trash-can-outline" size={18} color={Colors.danger} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── Varieties ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="body" style={styles.sectionTitle}>
              Varieties / किस्में
            </Typography>
            <TouchableOpacity style={styles.addBtn} onPress={goToAddVariety} activeOpacity={0.7}>
              <Icon name="plus" size={18} color={Colors.primary} />
              <Typography variant="caption" style={styles.addBtnText}>
                Add
              </Typography>
            </TouchableOpacity>
          </View>

          {orchard.varieties.length === 0 ? (
            <View style={styles.emptyBox}>
              <Typography variant="captionMuted" center>
                No varieties added yet. Add varieties grown in this orchard.
              </Typography>
            </View>
          ) : (
            orchard.varieties.map((variety) => (
              <View key={variety.id} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <TouchableOpacity
                      onPress={() => variety.variety?.slug && goToVarietyDetail(variety.variety.slug)}
                      activeOpacity={0.7}
                      disabled={!variety.variety?.slug}
                    >
                      <Typography variant="body" style={[styles.itemName, variety.variety?.slug && styles.itemNameLink]}>
                        {variety.variety_name_custom ?? variety.variety?.name_en ?? 'Unknown'}
                      </Typography>
                    </TouchableOpacity>
                    <Typography variant="captionMuted">
                      {variety.num_trees ?? 0} trees • Planted {variety.planted_year ?? '—'}
                      {variety.rootstock ? ` • ${variety.rootstock.name}` : ''}
                    </Typography>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => goToEditVariety(variety.id)} activeOpacity={0.7}>
                      <Icon name="pencil-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteVariety(variety.id)}
                      disabled={deletingVariety === variety.id}
                      activeOpacity={0.7}
                    >
                      {deletingVariety === variety.id ? (
                        <ActivityIndicator size="small" color={Colors.danger} />
                      ) : (
                        <Icon name="trash-can-outline" size={18} color={Colors.danger} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScreenLayout>
  );
}

function StatBadge({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <View style={styles.statBadge}>
      <Icon name={icon} size={18} color={Colors.primary} />
      <Typography variant="body" style={styles.statBadgeValue}>
        {value}
      </Typography>
      <Typography variant="captionMuted" style={styles.statBadgeLabel}>
        {label}
      </Typography>
    </View>
  );
}

function ActionChip({ icon, label, labelHi }: { icon: string; label: string; labelHi: string }) {
  return (
    <TouchableOpacity style={styles.actionChip} activeOpacity={0.8}>
      <Icon name={icon} size={22} color={Colors.primary} />
      <Typography variant="caption" style={styles.actionChipLabel}>
        {label}
      </Typography>
      <Typography variant="captionMuted" style={styles.actionChipLabelHi}>
        {labelHi}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 16,
    marginBottom: 16,
    ...Shadows.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  orchardName: {
    fontSize: 22,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statBadge: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  statBadgeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray900,
  },
  statBadgeLabel: {
    fontSize: 11,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray900,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '10',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addBtnText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionChip: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    ...Shadows.medium,
  },
  actionChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray900,
  },
  actionChipLabelHi: {
    fontSize: 10,
  },
  emptyBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 16,
    alignItems: 'center',
    ...Shadows.medium,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 14,
    marginBottom: 8,
    ...Shadows.medium,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 2,
  },
  itemNameLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  varietyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBadge: {
    backgroundColor: Colors.accent + '20',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
});
