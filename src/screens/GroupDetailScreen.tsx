/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GROUP DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Group header + tabs: Feed / About / Members
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
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
import {
  getGroupDetail,
  getGroupFeed,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  cancelJoinRequest,
  createGroupPost,
  type GroupDetail,
  type GroupMember,
} from '../services/groupApi';
import { togglePostLike } from '../services/postApi';
import type { FeedPost } from '../services/postApi';

 type TabKey = 'feed' | 'about' | 'members';

const TABS: { key: TabKey; label: string; labelHi: string }[] = [
  { key: 'feed', label: 'Feed', labelHi: 'फ़ीड' },
  { key: 'about', label: 'About', labelHi: 'जानकारी' },
  { key: 'members', label: 'Members', labelHi: 'सदस्य' },
];

export default function GroupDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'GroupDetail'>>();
  const { slug } = route.params;

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('feed');
  const [postText, setPostText] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [groupData, postsData, membersData] = await Promise.all([
        getGroupDetail(slug),
        getGroupFeed(slug),
        getGroupMembers(slug, { per_page: 20 }),
      ]);
      setGroup(groupData);
      setPosts(postsData);
      setMembers(membersData);
    } catch (err) {
      console.error('[GroupDetail] fetch failed:', err);
      showToast('Failed to load group', 'error');
    }
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll().finally(() => setRefreshing(false));
  }, [fetchAll]);

  const handleJoin = async () => {
    if (!group) return;
    try {
      const result = await joinGroup(group.slug);
      showToast(result.message, 'success');
      setGroup(prev => prev ? {
        ...prev,
        is_member: group.visibility === 'public',
        is_pending_request: group.visibility === 'private',
        members_count: group.visibility === 'public' ? group.members_count + 1 : group.members_count,
      } : null);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to join', 'error');
    }
  };

  const handleLeave = async () => {
    if (!group) return;
    try {
      await leaveGroup(group.slug);
      showToast('Left the group', 'success');
      setGroup(prev => prev ? {
        ...prev,
        is_member: false,
        my_role: null,
        members_count: Math.max(0, prev.members_count - 1),
      } : null);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to leave', 'error');
    }
  };

  const handleCancelRequest = async () => {
    if (!group) return;
    try {
      await cancelJoinRequest(group.slug);
      showToast('Request cancelled', 'success');
      setGroup(prev => prev ? { ...prev, is_pending_request: false } : null);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel', 'error');
    }
  };

  const handlePost = async () => {
    if (!postText.trim() || !group) return;
    setPosting(true);
    try {
      const newPost = await createGroupPost(group.slug, { body: postText.trim(), type: 'status' });
      setPosts(prev => [newPost, ...prev]);
      setPostText('');
      setGroup(prev => prev ? { ...prev, posts_count: prev.posts_count + 1 } : null);
      showToast('Post shared!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to post', 'error');
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const oldPosts = [...posts];
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
    ));
    try {
      await togglePostLike(postId);
    } catch {
      setPosts(oldPosts);
      showToast('Failed to like', 'error');
    }
  };

  if (loading || !group) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const isAdmin = group.my_role === 'owner' || group.my_role === 'admin';
  const isModerator = group.my_role === 'moderator';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle} lines={1}>{group.name}</Typography>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Icon name="dots-horizontal" size={24} color={Colors.gray800} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      >
        {/* Cover */}
        <Image source={{ uri: group.cover_media?.medium || group.cover || undefined }} style={styles.cover} />

        {/* Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Image source={{ uri: group.avatar_media?.medium || group.avatar || undefined }} style={styles.infoAvatar} />
            <View style={{ flex: 1 }}>
              <Typography variant="displaySubheading" style={styles.infoName}>{group.name}</Typography>
              <Typography variant="captionMuted">
                {group.members_count} members · {group.posts_count} posts
              </Typography>
            </View>
          </View>

          {group.description && (
            <Typography variant="body" style={styles.infoDesc}>{group.description}</Typography>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {!group.is_member && !group.is_pending_request && (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleJoin} activeOpacity={0.8}>
                <Typography variant="caption" style={styles.primaryBtnText}>Join Group / शामिल हों</Typography>
              </TouchableOpacity>
            )}
            {group.is_pending_request && (
              <TouchableOpacity style={[styles.primaryBtn, styles.pendingBtn]} onPress={handleCancelRequest} activeOpacity={0.8}>
                <Typography variant="caption" style={styles.pendingBtnText}>Cancel Request / अनुरोध रद्द करें</Typography>
              </TouchableOpacity>
            )}
            {group.is_member && (
              <>
                <TouchableOpacity style={[styles.primaryBtn, styles.leaveBtn]} onPress={handleLeave} activeOpacity={0.8}>
                  <Typography variant="caption" style={styles.leaveBtnText}>Leave / छोड़ें</Typography>
                </TouchableOpacity>
                {isAdmin && group.pending_requests_count > 0 && (
                  <TouchableOpacity
                    style={styles.requestsBtn}
                    onPress={() => navigation.navigate('GroupJoinRequests', { slug: group.slug })}
                    activeOpacity={0.8}
                  >
                    <Icon name="account-check" size={16} color={Colors.primary} />
                    <Typography variant="caption" style={styles.requestsBtnText}>
                      {group.pending_requests_count} requests
                    </Typography>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map(tab => (
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
          {activeTab === 'feed' && (
            <FeedTab
              posts={posts}
              isMember={group.is_member}
              postText={postText}
              setPostText={setPostText}
              posting={posting}
              onPost={handlePost}
              onToggleLike={toggleLike}
            />
          )}
          {activeTab === 'about' && <AboutTab group={group} />}
          {activeTab === 'members' && <MembersTab members={members} />}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── SUB-COMPONENTS ──

function FeedTab({ posts, isMember, postText, setPostText, posting, onPost, onToggleLike }: {
  posts: FeedPost[];
  isMember: boolean;
  postText: string;
  setPostText: (t: string) => void;
  posting: boolean;
  onPost: () => void;
  onToggleLike: (id: number) => void;
}) {
  if (!isMember) {
    return (
      <View style={styles.centeredEmpty}>
        <Icon name="lock-outline" size={48} color={Colors.gray300} />
        <Typography variant="body" style={styles.emptyTitle}>Members only</Typography>
        <HindiText style={styles.emptySubtitle}>केवल सदस्य देख सकते हैं</HindiText>
      </View>
    );
  }

  return (
    <View style={styles.tabList}>
      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          style={styles.composerInput}
          placeholder="Write something to the group..."
          placeholderTextColor={Colors.gray400}
          value={postText}
          onChangeText={setPostText}
          multiline
        />
        <TouchableOpacity
          style={[styles.composerBtn, (!postText.trim() || posting) && styles.composerBtnDisabled]}
          onPress={onPost}
          disabled={!postText.trim() || posting}
          activeOpacity={0.8}
        >
          <Typography variant="caption" style={styles.composerBtnText}>{posting ? 'Posting...' : 'Post'}</Typography>
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <View style={styles.centeredEmpty}>
          <Icon name="post-outline" size={48} color={Colors.gray300} />
          <Typography variant="body" style={styles.emptyTitle}>No posts yet</Typography>
          <HindiText style={styles.emptySubtitle}>अभी तक कोई पोस्ट नहीं</HindiText>
        </View>
      ) : (
        posts.map(post => (
          <FeedPostCard key={post.id} post={post} onToggleLike={() => onToggleLike(post.id)} />
        ))
      )}
    </View>
  );
}

function AboutTab({ group }: { group: GroupDetail }) {
  return (
    <View style={styles.tabList}>
      <View style={styles.aboutCard}>
        <Typography variant="body" style={styles.aboutTitle}>About this group / समूह के बारे में</Typography>
        <Typography variant="body" style={styles.aboutText}>{group.description || 'No description available.'}</Typography>
      </View>

      <View style={styles.aboutCard}>
        <Typography variant="body" style={styles.aboutTitle}>Created by / निर्माता</Typography>
        <View style={styles.creatorRow}>
          <Image source={{ uri: group.created_by.avatar || undefined }} style={styles.creatorAvatar} />
          <Typography variant="body" style={styles.creatorName}>{group.created_by.name}</Typography>
        </View>
      </View>

      {group.rules.length > 0 && (
        <View style={styles.aboutCard}>
          <Typography variant="body" style={styles.aboutTitle}>Rules / नियम</Typography>
          {group.rules.map((rule, idx) => (
            <View key={rule.id} style={styles.ruleItem}>
              <Typography variant="bodySmall" style={styles.ruleTitle}>{idx + 1}. {rule.title}</Typography>
              {rule.body && <Typography variant="caption" style={styles.ruleBody}>{rule.body}</Typography>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function MembersTab({ members }: { members: GroupMember[] }) {
  return (
    <View style={styles.tabList}>
      {members.length === 0 ? (
        <View style={styles.centeredEmpty}>
          <Icon name="account-outline" size={48} color={Colors.gray300} />
          <Typography variant="body" style={styles.emptyTitle}>No members yet</Typography>
        </View>
      ) : (
        members.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <Image source={{ uri: member.user.avatar || `https://i.pravatar.cc/150?u=${member.user.id}` }} style={styles.memberAvatar} />
            <View style={{ flex: 1 }}>
              <Typography variant="body" style={styles.memberName}>{member.user.name}</Typography>
              <Typography variant="captionMuted">{member.role}</Typography>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function FeedPostCard({ post, onToggleLike }: { post: FeedPost; onToggleLike: () => void }) {
  const timeAgo = formatTimeAgo(post.created_at);

  return (
    <View style={styles.postCard}>
      <View style={styles.postAuthorRow}>
        <Image source={{ uri: post.user.avatar ?? `https://i.pravatar.cc/150?u=${post.user.id}` }} style={styles.postAuthorAvatar} />
        <View style={{ flex: 1 }}>
          <Typography variant="body" style={styles.postAuthorName}>{post.user.name}</Typography>
          <Typography variant="captionMuted">{timeAgo}</Typography>
        </View>
      </View>
      <Typography variant="body" style={styles.postBody}>{post.body}</Typography>
      {post.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Space[2], marginTop: Space[3] }}>
          {post.images.map(img => (
            <Image key={img.id} source={{ uri: img.medium }} style={styles.postImage} resizeMode="cover" />
          ))}
        </ScrollView>
      )}
      <View style={styles.postStats}>
        <Typography variant="captionMuted">{post.likes_count} likes · {post.comments_count} comments</Typography>
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
        <TouchableOpacity style={styles.postActionBtn} activeOpacity={0.7}>
          <Icon name="share-outline" size={20} color={Colors.gray500} />
          <Typography variant="caption" style={styles.postActionText}>Share</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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

// ── STYLES ──

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100, backgroundColor: Colors.surface,
  },
  headerBtn: { padding: 4, width: 40, alignItems: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16, flex: 1, textAlign: 'center', marginHorizontal: 8 },
  cover: { width: '100%', height: 160 },
  infoCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: -30,
    borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  infoAvatar: { width: 64, height: 64, borderRadius: Radius.lg, backgroundColor: Colors.gray200, borderWidth: 3, borderColor: Colors.white },
  infoName: { fontSize: 18, fontWeight: '800', color: Colors.gray900 },
  infoDesc: { fontSize: 14, color: Colors.gray600, marginTop: Space[3], lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: Space[2], marginTop: Space[4] },
  primaryBtn: {
    flex: 1, backgroundColor: Colors.primary, paddingVertical: 12,
    borderRadius: Radius.xl, alignItems: 'center', ...Shadows.subtle,
  },
  primaryBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  pendingBtn: { backgroundColor: Colors.gray200 },
  pendingBtnText: { color: Colors.gray700, fontWeight: '700', fontSize: 13 },
  leaveBtn: { backgroundColor: Colors.danger + '12', borderWidth: 1, borderColor: Colors.danger + '30' },
  leaveBtnText: { color: Colors.danger, fontWeight: '700', fontSize: 13 },
  requestsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary + '10', paddingHorizontal: Space[4],
    paddingVertical: 12, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.primary + '20',
  },
  requestsBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    paddingHorizontal: Space[4], paddingBottom: Space[3], gap: Space[2],
    borderBottomWidth: 1, borderBottomColor: Colors.gray100, marginTop: Space[3],
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Space[2], borderRadius: Radius.md, backgroundColor: Colors.surfaceSubtle },
  tabActive: { backgroundColor: Colors.primary + '12' },
  tabLabel: { fontWeight: '600', color: Colors.gray500, fontSize: 13 },
  tabLabelActive: { color: Colors.primary, fontWeight: '700' },
  tabLabelHi: { fontSize: 9, color: Colors.gray400 },
  tabContent: { paddingTop: Space[3], minHeight: 200 },
  tabList: { gap: Space[3], paddingHorizontal: Space[4] },
  centeredEmpty: { alignItems: 'center', paddingVertical: 48, gap: Space[2] },
  emptyTitle: { fontWeight: '700', color: Colors.gray500, marginTop: Space[2] },
  emptySubtitle: { fontSize: 12, color: Colors.gray400 },
  // Composer
  composer: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  composerInput: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    paddingHorizontal: Space[4], paddingVertical: 10,
    fontSize: 14, color: Colors.gray800, minHeight: 60, textAlignVertical: 'top',
  },
  composerBtn: {
    backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: Radius.full,
    alignItems: 'center', marginTop: Space[3],
  },
  composerBtnDisabled: { opacity: 0.4 },
  composerBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  // Post Card
  postCard: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  postAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3], marginBottom: Space[3] },
  postAuthorAvatar: { width: 40, height: 40, borderRadius: Radius.full },
  postAuthorName: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  postBody: { fontSize: 14, color: Colors.gray600, lineHeight: 20 },
  postImage: { width: 240, height: 160, borderRadius: Radius.lg },
  postStats: { marginTop: Space[3], paddingBottom: Space[3], borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  postActions: { flexDirection: 'row', marginTop: Space[2] },
  postActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6 },
  postActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  // About
  aboutCard: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  aboutTitle: { fontWeight: '800', fontSize: 15, color: Colors.gray900, marginBottom: Space[2] },
  aboutText: { fontSize: 14, color: Colors.gray600, lineHeight: 20 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  creatorAvatar: { width: 40, height: 40, borderRadius: Radius.full },
  creatorName: { fontWeight: '700', color: Colors.gray800 },
  ruleItem: { marginBottom: Space[3] },
  ruleTitle: { fontWeight: '700', color: Colors.gray700 },
  ruleBody: { color: Colors.gray500, marginTop: 2 },
  // Members
  memberCard: {
    flexDirection: 'row', alignItems: 'center', gap: Space[3],
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Space[4], ...Shadows.medium,
  },
  memberAvatar: { width: 44, height: 44, borderRadius: Radius.full },
  memberName: { fontWeight: '700', color: Colors.gray900 },
});
