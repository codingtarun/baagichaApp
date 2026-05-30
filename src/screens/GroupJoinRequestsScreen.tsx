/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GROUP JOIN REQUESTS SCREEN
 * ═══════════════════════════════════════════════════════════════
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
import type { HomeNavigationProp } from '../navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';
import { getJoinRequests, approveJoinRequest, rejectJoinRequest, type JoinRequest } from '../services/groupApi';

export default function GroupJoinRequestsScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'GroupJoinRequests'>>();
  const { slug } = route.params;

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await getJoinRequests(slug);
      setRequests(data);
    } catch {
      showToast('Failed to load requests', 'error');
    }
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    fetchRequests().finally(() => setLoading(false));
  }, [fetchRequests]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests().finally(() => setRefreshing(false));
  }, [fetchRequests]);

  const handleApprove = async (requestId: number) => {
    try {
      await approveJoinRequest(slug, requestId);
      showToast('Request approved', 'success');
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to approve', 'error');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectJoinRequest(slug, requestId);
      showToast('Request rejected', 'success');
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to reject', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Join Requests / शामिल अनुरोध</Typography>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="check-circle-outline" size={48} color={Colors.gray300} />
            <Typography variant="body" style={styles.emptyTitle}>No pending requests</Typography>
            <HindiText style={styles.emptySubtitle}>कोई अनुरोध लंबित नहीं</HindiText>
          </View>
        ) : (
          <View style={styles.list}>
            {requests.map(req => (
              <View key={req.id} style={styles.card}>
                <View style={styles.userRow}>
                  <Image source={{ uri: req.user.avatar || `https://i.pravatar.cc/150?u=${req.user.id}` }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="body" style={styles.name}>{req.user.name}</Typography>
                    {req.message && <Typography variant="caption" style={styles.message} lines={2}>{req.message}</Typography>}
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(req.id)} activeOpacity={0.8}>
                    <Icon name="check" size={16} color={Colors.white} />
                    <Typography variant="caption" style={styles.approveText}>Approve</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(req.id)} activeOpacity={0.8}>
                    <Icon name="close" size={16} color={Colors.danger} />
                    <Typography variant="caption" style={styles.rejectText}>Reject</Typography>
                  </TouchableOpacity>
                </View>
              </View>
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
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  avatar: { width: 48, height: 48, borderRadius: Radius.full },
  name: { fontWeight: '700', color: Colors.gray900 },
  message: { color: Colors.gray500, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Space[3], marginTop: Space[3] },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: Radius.xl },
  approveBtn: { backgroundColor: Colors.primary },
  approveText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  rejectBtn: { backgroundColor: Colors.danger + '10', borderWidth: 1, borderColor: Colors.danger + '30' },
  rejectText: { color: Colors.danger, fontWeight: '700', fontSize: 13 },
});
