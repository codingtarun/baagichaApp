/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GROUP LIST SCREEN (Discover)
 * ═══════════════════════════════════════════════════════════════
 *
 * Discover and search all groups. Filter by public/private.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography, HindiText } from '../typography';
import { showToast } from '../store/toastStore';
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { getGroups, joinGroup, type GroupCard } from '../services/groupApi';

export default function GroupListScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();
  const [groups, setGroups] = useState<GroupCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  const fetchGroups = useCallback(async () => {
    try {
      const data = await getGroups({
        search: search.trim() || undefined,
        visibility: filter === 'all' ? undefined : filter,
        sort: 'popular',
      });
      setGroups(data);
    } catch (err) {
      console.error('[GroupList] fetch failed:', err);
      showToast('Failed to load groups', 'error');
    }
  }, [search, filter]);

  useEffect(() => {
    setLoading(true);
    fetchGroups().finally(() => setLoading(false));
  }, [fetchGroups]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups().finally(() => setRefreshing(false));
  }, [fetchGroups]);

  const handleJoin = async (group: GroupCard) => {
    try {
      const result = await joinGroup(group.slug);
      showToast(result.message, 'success');
      setGroups(prev => prev.map(g =>
        g.id === group.id
          ? { ...g, is_member: group.visibility === 'public', is_pending_request: group.visibility === 'private' }
          : g
      ));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to join', 'error');
    }
  };

  const FilterPill = ({ label, value }: { label: string; value: 'all' | 'public' | 'private' }) => (
    <TouchableOpacity
      style={[styles.filterPill, filter === value && styles.filterPillActive]}
      onPress={() => setFilter(value)}
      activeOpacity={0.8}
    >
      <Typography variant="caption" style={[styles.filterPillText, filter === value && styles.filterPillTextActive]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Groups / समूह</Typography>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {/* Search */}
        <View style={styles.searchWrap}>
          <Icon name="magnify" size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={Colors.gray400}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <FilterPill label="All / सभी" value="all" />
          <FilterPill label="Public / सार्वजनिक" value="public" />
          <FilterPill label="Private / निजी" value="private" />
        </View>

        {/* Groups List */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-group-outline" size={48} color={Colors.gray300} />
            <Typography variant="body" style={styles.emptyTitle}>No groups found</Typography>
            <HindiText style={styles.emptySubtitle}>कोई समूह नहीं मिला</HindiText>
          </View>
        ) : (
          <View style={styles.list}>
            {groups.map(group => (
              <GroupCardItem key={group.id} group={group} onJoin={() => handleJoin(group)} />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function GroupCardItem({ group, onJoin }: { group: GroupCard; onJoin: () => void }) {
  const navigation = useNavigation<DiscoverNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GroupDetail', { slug: group.slug })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: group.cover || undefined }} style={styles.cardCover} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: group.avatar || undefined }} style={styles.cardAvatar} />
          <View style={{ flex: 1 }}>
            <Typography variant="body" style={styles.cardName}>{group.name}</Typography>
            <View style={styles.cardMeta}>
              <Typography variant="captionMuted">
                {group.members_count} members · {group.posts_count} posts
              </Typography>
              <View style={[styles.badge, group.visibility === 'private' && styles.badgePrivate]}>
                <Typography variant="caption" style={[styles.badgeText, group.visibility === 'private' && styles.badgeTextPrivate]}>
                  {group.visibility === 'public' ? 'Public' : 'Private'}
                </Typography>
              </View>
            </View>
          </View>
        </View>
        {group.description && (
          <Typography variant="caption" style={styles.cardDesc} lines={2}>{group.description}</Typography>
        )}
        {!group.is_member && !group.is_pending_request && (
          <TouchableOpacity style={styles.joinBtn} onPress={onJoin} activeOpacity={0.8}>
            <Typography variant="caption" style={styles.joinBtnText}>Join / शामिल हों</Typography>
          </TouchableOpacity>
        )}
        {group.is_pending_request && (
          <View style={[styles.joinBtn, styles.joinBtnPending]}>
            <Typography variant="caption" style={styles.joinBtnTextPending}>Pending / अनुरोध भेजा</Typography>
          </View>
        )}
        {group.is_member && (
          <View style={[styles.joinBtn, styles.joinBtnMember]}>
            <Icon name="check" size={14} color={Colors.primary} />
            <Typography variant="caption" style={styles.joinBtnTextMember}>Joined / शामिल</Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100, backgroundColor: Colors.surface,
  },
  headerBtn: { padding: 4, width: 40, alignItems: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    marginHorizontal: Space[4], marginTop: Space[4], paddingHorizontal: Space[3],
    borderRadius: Radius.xl, ...Shadows.medium,
  },
  searchInput: {
    flex: 1, fontSize: 15, color: Colors.gray800, paddingVertical: Space[3], marginLeft: Space[2],
  },
  filtersRow: {
    flexDirection: 'row', gap: Space[2], paddingHorizontal: Space[4], marginTop: Space[3],
  },
  filterPill: {
    paddingHorizontal: Space[4], paddingVertical: Space[2],
    borderRadius: Radius.md, backgroundColor: Colors.surface, ...Shadows.subtle,
  },
  filterPillActive: { backgroundColor: Colors.primary },
  filterPillText: { fontWeight: '600', color: Colors.gray600, fontSize: 12 },
  filterPillTextActive: { color: Colors.white },
  list: { paddingHorizontal: Space[4], marginTop: Space[4], gap: Space[3] },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: Space[2] },
  emptyTitle: { fontWeight: '700', color: Colors.gray500, marginTop: Space[2] },
  emptySubtitle: { fontSize: 12, color: Colors.gray400 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], overflow: 'hidden', ...Shadows.medium,
  },
  cardCover: { width: '100%', height: 120 },
  cardBody: { padding: Space[4] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  cardAvatar: { width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: Colors.gray200 },
  cardName: { fontWeight: '800', fontSize: 15, color: Colors.gray900 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: Space[2], marginTop: 2 },
  badge: {
    backgroundColor: Colors.primary + '15', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgePrivate: { backgroundColor: Colors.gray200 },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  badgeTextPrivate: { color: Colors.gray600 },
  cardDesc: { color: Colors.gray500, marginTop: Space[2], lineHeight: 18 },
  joinBtn: {
    marginTop: Space[3], backgroundColor: Colors.primary, paddingVertical: 10,
    borderRadius: Radius.xl, alignItems: 'center',
  },
  joinBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  joinBtnPending: { backgroundColor: Colors.gray200 },
  joinBtnTextPending: { color: Colors.gray600, fontWeight: '700', fontSize: 13 },
  joinBtnMember: { backgroundColor: Colors.primary + '10', flexDirection: 'row', gap: 4, justifyContent: 'center' },
  joinBtnTextMember: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
});
