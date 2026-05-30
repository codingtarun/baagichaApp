/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY GROUPS SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * List of groups the logged-in user has joined.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography, HindiText } from '../typography';
import { showToast } from '../store/toastStore';
import type { MyOrchardNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { getJoinedGroups, type GroupCard } from '../services/groupApi';

export default function MyGroupsScreen(): React.JSX.Element {
  const navigation = useNavigation<MyOrchardNavigationProp>();
  const [groups, setGroups] = useState<GroupCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const data = await getJoinedGroups();
      setGroups(data);
    } catch (err) {
      console.error('[MyGroups] fetch failed:', err);
      showToast('Failed to load groups', 'error');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchGroups().finally(() => setLoading(false));
  }, [fetchGroups]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups().finally(() => setRefreshing(false));
  }, [fetchGroups]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>My Groups / मेरे समूह</Typography>
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GroupCreate')}
        >
          <Icon name="plus" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-group-outline" size={48} color={Colors.gray300} />
            <Typography variant="body" style={styles.emptyTitle}>No groups joined yet</Typography>
            <HindiText style={styles.emptySubtitle}>अभी तक कोई समूह नहीं जुड़ा</HindiText>
            <TouchableOpacity
              style={styles.discoverBtn}
              onPress={() => navigation.navigate('GroupList')}
              activeOpacity={0.8}
            >
              <Typography variant="caption" style={styles.discoverBtnText}>Discover Groups / समूह खोजें</Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {groups.map(group => (
              <TouchableOpacity
                key={group.id}
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
                      <Typography variant="captionMuted">
                        {group.members_count} members · {group.posts_count} posts
                      </Typography>
                    </View>
                    {group.my_role && group.my_role !== 'member' && (
                      <View style={styles.roleBadge}>
                        <Typography variant="caption" style={styles.roleBadgeText}>
                          {group.my_role.charAt(0).toUpperCase() + group.my_role.slice(1)}
                        </Typography>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  list: { paddingHorizontal: Space[4], paddingTop: Space[4], gap: Space[3] },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: Space[2] },
  emptyTitle: { fontWeight: '700', color: Colors.gray500, marginTop: Space[2] },
  emptySubtitle: { fontSize: 12, color: Colors.gray400 },
  discoverBtn: {
    marginTop: Space[4], backgroundColor: Colors.primary, paddingHorizontal: Space[6],
    paddingVertical: 12, borderRadius: Radius.full, ...Shadows.medium,
  },
  discoverBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], overflow: 'hidden', ...Shadows.medium,
  },
  cardCover: { width: '100%', height: 100 },
  cardBody: { padding: Space[4] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  cardAvatar: { width: 44, height: 44, borderRadius: Radius.lg, backgroundColor: Colors.gray200 },
  cardName: { fontWeight: '800', fontSize: 15, color: Colors.gray900 },
  roleBadge: {
    backgroundColor: Colors.primary + '12', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  roleBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
});
