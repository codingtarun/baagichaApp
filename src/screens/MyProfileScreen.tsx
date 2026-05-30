/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY PROFILE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * The logged-in user's own profile page.
 * Shows profile header, stats, and tabs:
 *   • Posts    / पोस्ट्स
 *   • Activities / गतिविधियाँ
 *   • Likes    / पसंदीदा
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography, HindiText } from '../typography';
import { showToast } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import type { MyOrchardNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import {
  getMyPosts,
  getMyLikedPosts,
  getMyActivities,
  getMyProfileStats,
  type UserActivity,
  type ProfileStats,
} from '../services/profileApi';
import { togglePostLike, sharePost, type FeedPost } from '../services/postApi';
import ShareSheet from '../components/ShareSheet';
import PostImages from '../components/PostImages';

type TabKey = 'posts' | 'activities' | 'likes';

const TABS: { key: TabKey; label: string; labelHi: string }[] = [
  { key: 'posts', label: 'Posts', labelHi: 'पोस्ट्स' },
  { key: 'activities', label: 'Activities', labelHi: 'गतिविधियाँ' },
  { key: 'likes', label: 'Likes', labelHi: 'पसंदीदा' },
];

export default function MyProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<MyOrchardNavigationProp>();
  const user = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<TabKey>('posts');
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<FeedPost[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likingPostIds, setLikingPostIds] = useState<Set<number>>(new Set());

  const fetchStats = useCallback(async () => {
    try {
      const data = await getMyProfileStats();
      setStats(data);
    } catch (err) {
      console.error('[MyProfile] Stats fetch failed:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const data = await getMyPosts();
      setPosts(data);
    } catch (err) {
      console.error('[MyProfile] Posts fetch failed:', err);
      showToast('Failed to load posts', 'error');
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const fetchLikes = useCallback(async () => {
    setLoadingLikes(true);
    try {
      const data = await getMyLikedPosts();
      setLikedPosts(data);
    } catch (err) {
      console.error('[MyProfile] Likes fetch failed:', err);
      showToast('Failed to load liked posts', 'error');
      setLikedPosts([]);
    } finally {
      setLoadingLikes(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const data = await getMyActivities();
      setActivities(data);
    } catch (err) {
      console.error('[MyProfile] Activities fetch failed:', err);
      showToast('Failed to load activities', 'error');
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  const loadAll = useCallback(() => {
    fetchStats();
    fetchPosts();
  }, [fetchStats, fetchPosts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Lazy-load likes and activities when tab is first opened
  useEffect(() => {
    if (activeTab === 'likes' && likedPosts.length === 0 && !loadingLikes) {
      fetchLikes();
    }
    if (activeTab === 'activities' && activities.length === 0 && !loadingActivities) {
      fetchActivities();
    }
  }, [activeTab, likedPosts.length, activities.length, loadingLikes, loadingActivities, fetchLikes, fetchActivities]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchStats(), fetchPosts(), activeTab === 'likes' ? fetchLikes() : Promise.resolve(), activeTab === 'activities' ? fetchActivities() : Promise.resolve()])
      .then(() => showToast('Refreshed', 'success'))
      .catch(() => showToast('Refresh failed', 'error'))
      .finally(() => setRefreshing(false));
  }, [fetchStats, fetchPosts, fetchLikes, fetchActivities, activeTab]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <Typography variant="captionMuted">Please sign in to view your profile</Typography>
      </SafeAreaView>
    );
  }

  const locationParts = [user.profile?.village, user.profile?.district, user.profile?.state].filter(Boolean);
  const avatarUrl = user.avatar ?? `https://i.pravatar.cc/150?u=${user.id}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>My Profile</Typography>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7} onPress={handleEditProfile}>
          <Icon name="pencil-outline" size={22} color={Colors.gray800} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {/* Cover + Avatar */}
        <View style={styles.coverWrap}>
          <View style={styles.coverGradient}>
            <Icon name="account-circle" size={120} color="rgba(255,255,255,0.15)" />
          </View>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>
        </View>

        {/* Name & Location */}
        <View style={styles.infoSection}>
          <Typography variant="displaySubheading" style={styles.name}>{user.name}</Typography>
          {locationParts.length > 0 && (
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={14} color={Colors.primary} />
              <Typography variant="caption" style={styles.location}>{locationParts.join(', ')}</Typography>
            </View>
          )}
          <Typography variant="body" style={styles.phone}>{user.phone}</Typography>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatItem value={stats?.posts_count ?? 0} label="Posts" />
            <View style={styles.statDivider} />
            <StatItem value={stats?.followers_count ?? 0} label="Followers" />
            <View style={styles.statDivider} />
            <StatItem value={stats?.following_count ?? 0} label="Following" />
            <View style={styles.statDivider} />
            <StatItem value={stats?.orchards_count ?? 0} label="Orchards" />
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile} activeOpacity={0.8}>
            <Icon name="pencil" size={14} color={Colors.primary} />
            <Typography variant="caption" style={styles.editBtnText}>Edit Profile / प्रोफाइल संपादित करें</Typography>
          </TouchableOpacity>
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
          {activeTab === 'posts' && (
            <PostsTab posts={posts} loading={loadingPosts} onToggleLike={(postId) => {
              if (likingPostIds.has(postId)) return;
              const post = posts.find(p => p.id === postId);
              if (!post) return;
              const oldPosts = [...posts];
              setLikingPostIds(prev => new Set(prev).add(postId));
              setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
              ));
              togglePostLike(postId)
                .then((result) => {
                  setPosts(prev => prev.map(p =>
                    p.id === postId ? { ...p, is_liked: result.is_liked, likes_count: result.likes_count } : p
                  ));
                })
                .catch(() => {
                  setPosts(oldPosts);
                  showToast('Failed to update like', 'error');
                })
                .finally(() => {
                  setLikingPostIds(prev => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                  });
                });
            }} />
          )}

          {activeTab === 'activities' && (
            <ActivitiesTab activities={activities} loading={loadingActivities} />
          )}

          {activeTab === 'likes' && (
            <LikesTab posts={likedPosts} loading={loadingLikes} onToggleLike={(postId) => {
              if (likingPostIds.has(postId)) return;
              const post = likedPosts.find(p => p.id === postId);
              if (!post) return;
              const oldPosts = [...likedPosts];
              setLikingPostIds(prev => new Set(prev).add(postId));
              setLikedPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
              ));
              togglePostLike(postId)
                .then((result) => {
                  setLikedPosts(prev => prev.map(p =>
                    p.id === postId ? { ...p, is_liked: result.is_liked, likes_count: result.likes_count } : p
                  ));
                })
                .catch(() => {
                  setLikedPosts(oldPosts);
                  showToast('Failed to update like', 'error');
                })
                .finally(() => {
                  setLikingPostIds(prev => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                  });
                });
            }} />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Typography variant="body" style={styles.statValue}>{value}</Typography>
      <Typography variant="captionMuted" style={styles.statLabel}>{label}</Typography>
    </View>
  );
}

function PostsTab({ posts, loading, onToggleLike }: { posts: FeedPost[]; loading: boolean; onToggleLike: (id: number) => void }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (posts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="post-outline" size={48} color={Colors.gray300} />
        <Typography variant="body" style={styles.emptyTitle}>No posts yet</Typography>
        <HindiText style={styles.emptySubtitle}>अभी तक कोई पोस्ट नहीं</HindiText>
      </View>
    );
  }
  return (
    <View style={styles.tabList}>
      {posts.map((post) => (
        <ProfilePostCard key={post.id} post={post} onToggleLike={() => onToggleLike(post.id)} />
      ))}
    </View>
  );
}

function LikesTab({ posts, loading, onToggleLike }: { posts: FeedPost[]; loading: boolean; onToggleLike: (id: number) => void }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (posts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="heart-outline" size={48} color={Colors.gray300} />
        <Typography variant="body" style={styles.emptyTitle}>No liked posts</Typography>
        <HindiText style={styles.emptySubtitle}>अभी तक कोई पोस्ट पसंद नहीं की</HindiText>
      </View>
    );
  }
  return (
    <View style={styles.tabList}>
      {posts.map((post) => (
        <ProfilePostCard key={post.id} post={post} onToggleLike={() => onToggleLike(post.id)} showAuthor />
      ))}
    </View>
  );
}

function ActivitiesTab({ activities, loading }: { activities: UserActivity[]; loading: boolean }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (activities.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Icon name="timeline-text-outline" size={48} color={Colors.gray300} />
        <Typography variant="body" style={styles.emptyTitle}>No activities yet</Typography>
        <HindiText style={styles.emptySubtitle}>अभी तक कोई गतिविधि नहीं</HindiText>
      </View>
    );
  }
  return (
    <View style={styles.tabList}>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </View>
  );
}

function ProfilePostCard({ post, onToggleLike, showAuthor }: { post: FeedPost; onToggleLike: () => void; showAuthor?: boolean }) {
  const navigation = useNavigation<MyOrchardNavigationProp>();
  const [shareVisible, setShareVisible] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.shares_count);

  const handleShare = async () => {
    setShareVisible(true);
    try {
      const result = await sharePost(post.id);
      setSharesCount(result.shares_count);
    } catch {
      // Silently fail
    }
  };

  const timeAgo = formatTimeAgo(post.created_at);

  return (
    <View style={styles.postCard}>
      {showAuthor && (
        <View style={styles.postAuthorRow}>
          <Image
            source={{ uri: post.user.avatar ?? `https://i.pravatar.cc/150?u=${post.user.id}` }}
            style={styles.postAuthorAvatar}
          />
          <View style={{ flex: 1 }}>
            <Typography variant="body" style={styles.postAuthorName}>{post.user.name}</Typography>
            <Typography variant="captionMuted">{timeAgo}</Typography>
          </View>
        </View>
      )}
      {!showAuthor && (
        <Typography variant="captionMuted" style={styles.postTime}>{timeAgo}</Typography>
      )}
      <Typography variant="body" style={styles.postBody}>{post.body}</Typography>
      <PostImages
        images={post.images}
        onImagePress={(index) => navigation.navigate('ImageViewer', { images: post.images, initialIndex: index })}
      />
      <View style={styles.postStats}>
        <Typography variant="captionMuted">{post.likes_count} likes · {post.comments_count} comments · {sharesCount} shares</Typography>
      </View>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postActionBtn} onPress={onToggleLike} activeOpacity={0.7}>
          <Icon name={post.is_liked ? 'thumb-up' : 'thumb-up-outline'} size={20} color={post.is_liked ? Colors.primary : Colors.gray500} />
          <Typography variant="caption" style={[styles.postActionText, post.is_liked && { color: Colors.primary }]}>Like</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postActionBtn} activeOpacity={0.7}>
          <Icon name="comment-outline" size={20} color={Colors.gray500} />
          <Typography variant="caption" style={styles.postActionText}>Comment</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postActionBtn} onPress={handleShare} activeOpacity={0.7}>
          <Icon name="share-outline" size={20} color={Colors.gray500} />
          <Typography variant="caption" style={styles.postActionText}>Share</Typography>
        </TouchableOpacity>
      </View>
      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title={post.user.name + "'s Post"}
        message={post.body}
        url={`https://baagvaani.com/post/${post.id}`}
      />
    </View>
  );
}

const ACTIVITY_ICONS: Record<string, string> = {
  post_created: 'post-outline',
  post_liked: 'thumb-up-outline',
  post_commented: 'comment-outline',
  user_followed: 'account-plus-outline',
  post_shared: 'share-outline',
  comment_replied: 'reply-outline',
};

function ActivityCard({ activity }: { activity: UserActivity }) {
  const icon = ACTIVITY_ICONS[activity.type] ?? 'information-outline';
  const timeAgo = formatTimeAgo(activity.created_at);

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityIconWrap}>
        <Icon name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.activityBody}>
        <Typography variant="body" style={styles.activityText}>{activity.description}</Typography>
        <Typography variant="captionMuted">{timeAgo}</Typography>
        {activity.related_post && (
          <View style={styles.activityPreview}>
            <Typography variant="caption" style={styles.activityPreviewText} lines={2}>{activity.related_post.body}</Typography>
          </View>
        )}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

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
  coverWrap: {
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  coverGradient: {
    height: 120,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.white,
    backgroundColor: Colors.gray200,
  },
  infoSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Space[4],
    paddingBottom: Space[4],
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.gray900,
    marginTop: Space[3],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Space[1],
  },
  location: {
    color: Colors.gray500,
    fontSize: 13,
  },
  phone: {
    fontSize: 13,
    color: Colors.gray400,
    marginTop: 2,
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space[4],
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Space[5],
    paddingVertical: 10,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    width: '100%',
    justifyContent: 'center',
  },
  editBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: Colors.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Space[4],
    paddingBottom: Space[3],
    gap: Space[2],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
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
    minHeight: 200,
  },
  tabList: {
    gap: Space[3],
    paddingHorizontal: Space[4],
  },
  centered: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: Space[2],
  },
  emptyTitle: {
    fontWeight: '700',
    color: Colors.gray500,
    marginTop: Space[2],
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.gray400,
  },
  // Post Card
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  postTime: {
    marginBottom: Space[2],
  },
  postAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    marginBottom: Space[3],
  },
  postAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },
  postAuthorName: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.gray900,
  },
  postBody: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
  },
  postStats: {
    marginTop: Space[3],
    paddingBottom: Space[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: Space[2],
  },
  postActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  postActionText: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500',
  },
  // Activity Card
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space[3],
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBody: {
    flex: 1,
    gap: 2,
  },
  activityText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  activityPreview: {
    marginTop: Space[2],
    backgroundColor: Colors.surfaceSubtle,
    padding: Space[3],
    borderRadius: Radius.lg,
  },
  activityPreviewText: {
    color: Colors.gray500,
  },
});
