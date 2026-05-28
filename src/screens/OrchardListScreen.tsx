/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Lists all orchards for the logged-in user.
 * Shows orchard cards with quick stats and actions.
 */

import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import { useOrchards } from '../hooks/useOrchards';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;

export default function OrchardListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const { orchards, loading, error, refreshing, refresh, removeOrchard } = useOrchards();

  const goToDetail = useCallback(
    (orchardId: number) => {
      navigation.navigate('OrchardDetail', { orchardId });
    },
    [navigation]
  );

  const goToCreate = useCallback(() => {
    navigation.navigate('OrchardForm', undefined);
  }, [navigation]);

  const goToEdit = useCallback(
    (orchardId: number) => {
      navigation.navigate('OrchardForm', { orchardId });
    },
    [navigation]
  );

  const handleDelete = useCallback(
    (id: number, name: string) => {
      Alert.alert(
        'Delete Orchard?',
        `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => removeOrchard(id) },
        ]
      );
    },
    [removeOrchard]
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.screenWrapper}>
      <ScreenLayout refreshing={refreshing} onRefresh={refresh}>
        {/* Header */}
        <View style={styles.header}>
          <PrimaryHeading style={styles.title}>My Orchards</PrimaryHeading>
          <HindiText style={styles.subtitleHi}>मेरे बाग</HindiText>
        </View>

        {/* Content */}
        {loading && !refreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Icon name="alert-circle-outline" size={48} color={Colors.danger} />
            <Typography variant="bodyMuted" center style={styles.errorText}>
              {error}
            </Typography>
            <TouchableOpacity style={styles.retryButton} onPress={refresh} activeOpacity={0.8}>
              <Typography variant="button" style={styles.retryButtonText}>
                Retry / फिर से कोशिश करें
              </Typography>
            </TouchableOpacity>
          </View>
        ) : orchards.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="sprout" size={64} color={Colors.gray300} />
            <Typography variant="body" center style={styles.emptyTitle}>
              No orchards yet
            </Typography>
            <HindiText center style={styles.emptyTitleHi}>
              अभी तक कोई बाग नहीं
            </HindiText>
            <Typography variant="bodyMuted" center style={styles.emptyDesc}>
              Add your first orchard to track spray schedules, monitor health, and get personalised predictions.
            </Typography>
            <TouchableOpacity style={styles.primaryButton} onPress={goToCreate} activeOpacity={0.8}>
              <Typography variant="button" style={styles.primaryButtonText}>
                Add Orchard / बाग जोड़ें
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {orchards.map((orchard) => (
              <TouchableOpacity
                key={orchard.id}
                style={styles.orchardCard}
                onPress={() => goToDetail(orchard.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <Typography variant="body" style={styles.orchardName}>
                      {orchard.orchard_name}
                    </Typography>

                  </View>
                  <Typography variant="captionMuted" style={styles.locationText}>
                    {orchard.village && `${orchard.village}, `}
                    {orchard.district}, {orchard.state}
                  </Typography>
                </View>

                <View style={styles.cardStats}>
                  <StatItem icon="tree" value={orchard.total_trees ?? 0} label="Trees" />
                  <StatItem icon="grid" value={orchard.blocks_count ?? 0} label="Blocks" />
                  <StatItem icon="fruit-cherries" value={orchard.varieties_count ?? 0} label="Varieties" />
                  <StatItem
                    icon="ruler-square"
                    value={orchard.area_local_value ?? 0}
                    label={orchard.area_unit ?? 'Area'}
                  />
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => goToEdit(orchard.id)}
                    activeOpacity={0.7}
                  >
                    <Icon name="pencil-outline" size={18} color={Colors.primary} />
                    <Typography variant="caption" style={styles.actionText}>
                      Edit
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(orchard.id, orchard.orchard_name)}
                    activeOpacity={0.7}
                  >
                    <Icon name="trash-can-outline" size={18} color={Colors.danger} />
                    <Typography variant="caption" style={[styles.actionText, { color: Colors.danger }]}>
                      Delete
                    </Typography>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScreenLayout>

      {/* Floating Add Button — outside ScrollView so it stays fixed above bottom nav */}
      {!loading && orchards.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={goToCreate} activeOpacity={0.85}>
          <Icon name="plus" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function StatItem({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Icon name={icon} size={18} color={Colors.primary} />
      <Typography variant="body" style={styles.statValue}>
        {value}
      </Typography>
      <Typography variant="captionMuted" style={styles.statLabel}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
  },
  subtitleHi: {
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    color: Colors.gray800,
  },
  emptyTitleHi: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },
  emptyDesc: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 100,
  },
  orchardCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.gray400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orchardName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray900,
    flex: 1,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexShrink: 0,
  },
  badgeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 11,
  },
  locationText: {
    fontSize: 13,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray800,
  },
  statLabel: {
    fontSize: 11,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});
