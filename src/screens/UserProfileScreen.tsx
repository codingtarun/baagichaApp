/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USER PROFILE SCREEN (Live Data)
 * ═══════════════════════════════════════════════════════════════
 *
 * Public user profile showing:
 *   • Profile header (avatar, name, location, stats)
 *   • Action buttons (Connect, Follow, Ask Question)
 *   • Orchard details
 *   • Expert consultancy charges (if user is_expert)
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import type { HomeNavigationProp } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserProfile, type UserProfile } from '../services/userApi';

type TabKey = 'orchards' | 'expert';

export default function UserProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'UserProfile'>>();
  const { userId } = route.params;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('orchards');

  // Fetch profile on mount / userId change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUserProfile(Number(userId))
      .then((data) => { if (!cancelled) setProfile(data); })
      .catch(() => { if (!cancelled) showToast('Failed to load profile', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const handleConnect = useCallback(() => {
    showToast('Connect feature coming soon', 'info');
  }, []);

  const handleFollow = useCallback(() => {
    showToast('Follow feature coming soon', 'info');
  }, []);

  const handleAskQuestion = useCallback(() => {
    showToast('Ask question feature coming soon', 'info');
  }, []);

  const TABS: { key: TabKey; label: string; labelHi: string }[] = [
    { key: 'orchards', label: 'Orchards', labelHi: 'बगीचे' },
  ];

  if (profile?.is_expert) {
    TABS.push({ key: 'expert', label: 'Expert', labelHi: 'विशेषज्ञ' });
  }

  if (loading || !profile) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Typography variant="captionMuted" style={{ marginTop: 12 }}>Loading profile...</Typography>
      </SafeAreaView>
    );
  }

  const bio = profile.preferred_language === 'hi'
    ? (profile.profile?.bio_hi ?? profile.profile?.bio_en)
    : (profile.profile?.bio_en ?? profile.profile?.bio_hi);

  const locationParts = [
    profile.orchards[0]?.district,
    profile.orchards[0]?.state,
  ].filter(Boolean);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Profile</Typography>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Icon name="dots-horizontal" size={24} color={Colors.gray800} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: profile.avatar ?? `https://i.pravatar.cc/150?u=${profile.id}` }}
            style={styles.avatar}
          />
          <Typography variant="displaySubheading" style={styles.name}>{profile.name}</Typography>
          {profile.is_expert && (
            <View style={styles.expertBadge}>
              <Icon name="check-decagram" size={14} color={Colors.white} />
              <Typography variant="caption" style={styles.expertBadgeText}>Expert</Typography>
            </View>
          )}
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={14} color={Colors.primary} />
            <Typography variant="caption" style={styles.location}>
              {locationParts.join(', ')}
              {profile.orchards[0]?.altitude_meters ? ` · ${profile.orchards[0].altitude_meters}m` : ''}
            </Typography>
          </View>
          {bio ? <Typography variant="body" style={styles.bio}>{bio}</Typography> : null}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{profile.followers_count}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Followers</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{profile.following_count}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Following</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{profile.orchards.length}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Orchards</Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {!profile.is_expert && (
              <TouchableOpacity
                style={[styles.actionBtn, profile.connection_status === 'accepted' && styles.actionBtnActive]}
                onPress={handleConnect}
                activeOpacity={0.7}
              >
                <Icon
                  name={profile.connection_status === 'accepted' ? 'account-check' : 'account-plus'}
                  size={16}
                  color={profile.connection_status === 'accepted' ? Colors.white : Colors.primary}
                />
                <Typography variant="caption" style={[styles.actionBtnText, profile.connection_status === 'accepted' && styles.actionBtnTextActive]}>
                  {profile.connection_status === 'accepted' ? 'Connected' : 'Connect'}
                </Typography>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, profile.is_following && styles.actionBtnActive]}
              onPress={handleFollow}
              activeOpacity={0.7}
            >
              <Icon name={profile.is_following ? 'check' : 'plus'} size={16} color={profile.is_following ? Colors.white : Colors.primary} />
              <Typography variant="caption" style={[styles.actionBtnText, profile.is_following && styles.actionBtnTextActive]}>
                {profile.is_following ? 'Following' : 'Follow'}
              </Typography>
            </TouchableOpacity>
            {profile.is_expert && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleAskQuestion} activeOpacity={0.7}>
                <Icon name="chat-question" size={16} color={Colors.primary} />
                <Typography variant="caption" style={styles.actionBtnText}>Ask</Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Typography variant="caption" style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Typography>
              <Typography variant="hindiMicro" style={[styles.tabLabelHi, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.labelHi}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'orchards' && (
            <View style={styles.tabSection}>
              {profile.orchards.length === 0 ? (
                <Typography variant="captionMuted" style={{ textAlign: 'center', paddingVertical: 24 }}>
                  No orchards added yet
                </Typography>
              ) : (
                profile.orchards.map((orchard) => (
                  <View key={orchard.id} style={styles.orchardCard}>
                    <View style={styles.orchardHeader}>
                      <View style={styles.orchardIconWrap}>
                        <Icon name="tree" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.orchardHeaderText}>
                        <Typography variant="bodySmall" style={styles.orchardName}>{orchard.name}</Typography>
                        <Typography variant="captionMuted">{orchard.village}, {orchard.district}</Typography>
                      </View>
                    </View>
                    <View style={styles.orchardMeta}>
                      <View style={styles.orchardMetaItem}>
                        <Icon name="ruler-square" size={12} color={Colors.gray400} />
                        <Typography variant="caption">{orchard.area_display}</Typography>
                      </View>
                      <View style={styles.orchardMetaItem}>
                        <Icon name="tree" size={12} color={Colors.gray400} />
                        <Typography variant="caption">{orchard.total_trees} trees</Typography>
                      </View>
                      <View style={styles.orchardMetaItem}>
                        <Icon name="apple" size={12} color={Colors.gray400} />
                        <Typography variant="caption">{orchard.varieties.map(v => v.variety_name).filter(Boolean).join(', ') || '—'}</Typography>
                      </View>
                      <View style={styles.orchardMetaItem}>
                        <Icon name="source-branch" size={12} color={Colors.gray400} />
                        <Typography variant="caption">{orchard.farming_type}</Typography>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'expert' && profile.expert_profile && (
            <View style={styles.tabSection}>
              {/* Expert Info Card */}
              <View style={styles.orchardCard}>
                <Typography variant="bodySmall" style={styles.orchardName}>
                  {profile.expert_profile.title ?? 'Apple Farming Expert'}
                </Typography>
                <Typography variant="body" style={{ marginTop: 8, lineHeight: 20, color: Colors.gray600 }}>
                  {profile.expert_profile.bio ?? 'No bio available'}
                </Typography>
                <View style={{ marginTop: 12, gap: 6 }}>
                  {profile.expert_profile.experience_years && (
                    <View style={styles.orchardMetaItem}>
                      <Icon name="calendar-check" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{profile.expert_profile.experience_years} years experience</Typography>
                    </View>
                  )}
                  {profile.expert_profile.orchard_location && (
                    <View style={styles.orchardMetaItem}>
                      <Icon name="map-marker" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{profile.expert_profile.orchard_location}</Typography>
                    </View>
                  )}
                  {profile.expert_profile.languages_spoken && profile.expert_profile.languages_spoken.length > 0 && (
                    <View style={styles.orchardMetaItem}>
                      <Icon name="translate" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{profile.expert_profile.languages_spoken.join(', ')}</Typography>
                    </View>
                  )}
                  {profile.expert_profile.specializations && profile.expert_profile.specializations.length > 0 && (
                    <View style={styles.orchardMetaItem}>
                      <Icon name="star" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{profile.expert_profile.specializations.join(', ')}</Typography>
                    </View>
                  )}
                </View>
              </View>

              {/* Consultancy Charges */}
              {profile.expert_profile.charges.length > 0 && (
                <>
                  <Typography variant="body" style={{ fontWeight: '800', marginTop: 16, marginBottom: 8 }}>
                    Consultancy Charges
                  </Typography>
                  {profile.expert_profile.charges.map((charge, idx) => (
                    <View key={idx} style={styles.orchardCard}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="bodySmall" style={styles.orchardName}>
                          {charge.format.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Typography>
                        <Typography variant="body" style={{ fontWeight: '800', color: Colors.primary }}>
                          ₹{charge.price}
                        </Typography>
                      </View>
                      {charge.duration_minutes && (
                        <Typography variant="captionMuted" style={{ marginTop: 2 }}>
                          {charge.duration_minutes} minutes
                        </Typography>
                      )}
                      {charge.description && (
                        <Typography variant="caption" style={{ marginTop: 6, color: Colors.gray600 }}>
                          {charge.description}
                        </Typography>
                      )}
                      {!charge.is_active && (
                        <View style={{ marginTop: 6, backgroundColor: Colors.gray200, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' }}>
                          <Typography variant="captionMuted" style={{ fontSize: 10 }}>Currently unavailable</Typography>
                        </View>
                      )}
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    backgroundColor: Colors.surface,
  },
  headerBtn: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    padding: Space[4],
    paddingTop: Space[5],
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.primary + '20',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: Space[3],
    color: Colors.gray900,
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Space[3],
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: Space[2],
  },
  expertBadgeText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Space[2],
  },
  location: {
    color: Colors.gray500,
    fontSize: 13,
  },
  bio: {
    fontSize: 13,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Space[3],
    lineHeight: 20,
    paddingHorizontal: Space[4],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Space[4],
    gap: Space[5],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '800',
    fontSize: 18,
    color: Colors.gray900,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.gray200,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Space[3],
    marginTop: Space[4],
    width: '100%',
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Space[4],
    paddingVertical: 10,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  actionBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: Colors.primary,
  },
  actionBtnTextActive: {
    color: Colors.white,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Space[4],
    paddingBottom: Space[3],
    gap: Space[2],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Space[2],
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  tabActive: {
    backgroundColor: Colors.primary + '12',
  },
  tabLabel: {
    fontWeight: '600',
    color: Colors.gray500,
    fontSize: 13,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabLabelHi: {
    fontSize: 9,
    color: Colors.gray400,
  },
  tabContent: {
    paddingTop: Space[3],
  },
  tabSection: {
    gap: Space[3],
    paddingHorizontal: Space[4],
  },
  orchardCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  orchardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    marginBottom: Space[3],
  },
  orchardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orchardHeaderText: {
    flex: 1,
  },
  orchardName: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  orchardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space[3],
  },
  orchardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: Space[3],
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
});
