/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USER PROFILE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Public user profile showing:
 *   • Profile header (avatar, name, location, stats)
 *   • Action buttons (Connect, Follow, Ask Question)
 *   • Orchard details
 *   • User's posts / status updates
 *   • Community answers given
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const DEMO_USER = {
  id: 'u1',
  name: 'Ramesh Negi',
  nameHi: 'रमेश नेगी',
  avatar: 'https://i.pravatar.cc/150?u=1',
  location: 'Kinnaur, HP',
  altitude: '2,800m',
  bio: 'Apple farmer since 1995. Growing Royal Delicious & Golden Delicious on 4 blocks. Always learning, always sharing. 🍎',
  followers: 342,
  following: 128,
  posts: 24,
  isConnected: false,
  isFollowing: false,
};

const DEMO_ORCHARDS = [
  {
    id: 'o1',
    name: 'Block A — Royal Delicious',
    area: '2.5 bigha',
    trees: 120,
    variety: 'Royal Delicious',
    rootstock: 'M9',
    year: 2010,
    stage: 'Fruit Development',
  },
  {
    id: 'o2',
    name: 'Block B — Golden Delicious',
    area: '1.8 bigha',
    trees: 85,
    variety: 'Golden Delicious',
    rootstock: 'MM106',
    year: 2012,
    stage: 'Fruit Development',
  },
  {
    id: 'o3',
    name: 'Block C — Scarlet Spur',
    area: '1.2 bigha',
    trees: 60,
    variety: 'Scarlet Spur',
    rootstock: 'M9',
    year: 2015,
    stage: 'Fruit Development',
  },
];

const DEMO_POSTS = [
  {
    id: 'p1',
    text: 'Just sprayed Copper Oxychloride on all 250 trees before the rain. Preventive sprays during dormancy break are critical! 🍎',
    image: 'https://picsum.photos/seed/orchard2/400/250',
    timeAgo: '2h ago',
    likes: 34,
    comments: 8,
  },
  {
    id: 'p2',
    text: 'Getting ₹92/kg for Grade A Scarlet Spur at Shimla Mandi today. What prices are you seeing in your area?',
    image: null,
    timeAgo: '3d ago',
    likes: 28,
    comments: 15,
  },
  {
    id: 'p3',
    text: 'Scab outbreak in Kullu valley. Anyone seeing early signs? I noticed olive-green spots on lower leaves.',
    image: null,
    timeAgo: '1w ago',
    likes: 52,
    comments: 23,
  },
  {
    id: 'p4',
    text: 'Switched to organic sprays on 2 blocks this season. Fingers crossed! 🌿 Using neem oil + garlic extract.',
    image: 'https://picsum.photos/seed/spray1/400/250',
    timeAgo: '2w ago',
    likes: 41,
    comments: 19,
  },
];

const DEMO_ANSWERS = [
  {
    id: 'a1',
    question: 'When is the best time to apply Urea in apple orchards?',
    answer: 'Best time is early morning before 8 AM during active growth stage. Dissolve 1kg Urea in 20L water per tree.',
    votes: 18,
    timeAgo: '3d ago',
  },
  {
    id: 'a2',
    question: 'How to prevent hail damage in apple orchards?',
    answer: 'Install anti-hail nets before May. For existing damage, spray Bavistin 50WP (200g/200L) immediately after hail.',
    votes: 24,
    timeAgo: '1w ago',
  },
  {
    id: 'a3',
    question: 'What rootstock is best for high altitude (2800m+)?',
    answer: 'M9 or MM106 are ideal for high altitude. M9 gives dwarf trees suitable for windy conditions.',
    votes: 12,
    timeAgo: '2w ago',
  },
];

type TabKey = 'orchards' | 'posts' | 'answers';

export default function UserProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'UserProfile'>>();
  const { userId } = route.params;

  const [user, setUser] = useState(DEMO_USER);
  const [activeTab, setActiveTab] = useState<TabKey>('orchards');

  const handleConnect = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      isConnected: !prev.isConnected,
      followers: prev.isConnected ? prev.followers - 1 : prev.followers + 1,
    }));
    showToast(user.isConnected ? 'Connection removed' : 'Connection request sent', 'success');
  }, [user.isConnected]);

  const handleFollow = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
    showToast(user.isFollowing ? 'Unfollowed' : 'Following', 'success');
  }, [user.isFollowing]);

  const handleAskQuestion = useCallback(() => {
    showToast('Ask question feature coming soon', 'info');
  }, []);

  const navigateToFeedDetail = (postId: string) => {
    navigation.navigate('FeedDetail', { postId });
  };

  const TABS: { key: TabKey; label: string; labelHi: string }[] = [
    { key: 'orchards', label: 'Orchards', labelHi: 'बगीचे' },
    { key: 'posts', label: 'Posts', labelHi: 'पोस्ट' },
    { key: 'answers', label: 'Answers', labelHi: 'जवाब' },
  ];

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
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Typography variant="displaySubheading" style={styles.name}>{user.name}</Typography>
          <Typography variant="hindiDisplayHero" style={styles.nameHi}>{user.nameHi}</Typography>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={14} color={Colors.primary} />
            <Typography variant="caption" style={styles.location}>{user.location} · {user.altitude}</Typography>
          </View>
          <Typography variant="body" style={styles.bio}>{user.bio}</Typography>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{user.followers}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Followers</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{user.following}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Following</Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="body" style={styles.statValue}>{user.posts}</Typography>
              <Typography variant="captionMuted" style={styles.statLabel}>Posts</Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, user.isConnected && styles.actionBtnActive]}
              onPress={handleConnect}
              activeOpacity={0.7}
            >
              <Icon name={user.isConnected ? 'account-check' : 'account-plus'} size={16} color={user.isConnected ? Colors.white : Colors.primary} />
              <Typography variant="caption" style={[styles.actionBtnText, user.isConnected && styles.actionBtnTextActive]}>
                {user.isConnected ? 'Connected' : 'Connect'}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, user.isFollowing && styles.actionBtnActive]}
              onPress={handleFollow}
              activeOpacity={0.7}
            >
              <Icon name={user.isFollowing ? 'check' : 'plus'} size={16} color={user.isFollowing ? Colors.white : Colors.primary} />
              <Typography variant="caption" style={[styles.actionBtnText, user.isFollowing && styles.actionBtnTextActive]}>
                {user.isFollowing ? 'Following' : 'Follow'}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleAskQuestion} activeOpacity={0.7}>
              <Icon name="chat-question" size={16} color={Colors.primary} />
              <Typography variant="caption" style={styles.actionBtnText}>Ask</Typography>
            </TouchableOpacity>
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
              {DEMO_ORCHARDS.map((orchard) => (
                <View key={orchard.id} style={styles.orchardCard}>
                  <View style={styles.orchardHeader}>
                    <View style={styles.orchardIconWrap}>
                      <Icon name="tree" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.orchardHeaderText}>
                      <Typography variant="bodySmall" style={styles.orchardName}>{orchard.name}</Typography>
                      <Typography variant="captionMuted">{orchard.stage}</Typography>
                    </View>
                  </View>
                  <View style={styles.orchardMeta}>
                    <View style={styles.orchardMetaItem}>
                      <Icon name="ruler-square" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{orchard.area}</Typography>
                    </View>
                    <View style={styles.orchardMetaItem}>
                      <Icon name="tree" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{orchard.trees} trees</Typography>
                    </View>
                    <View style={styles.orchardMetaItem}>
                      <Icon name="apple" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{orchard.variety}</Typography>
                    </View>
                    <View style={styles.orchardMetaItem}>
                      <Icon name="source-branch" size={12} color={Colors.gray400} />
                      <Typography variant="caption">{orchard.rootstock}</Typography>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'posts' && (
            <View style={styles.tabSection}>
              {DEMO_POSTS.map((post) => (
                <TouchableOpacity key={post.id} style={styles.postCard} onPress={() => navigateToFeedDetail(post.id)} activeOpacity={0.7}>
                  <Typography variant="body" style={styles.postText} numberOfLines={3}>{post.text}</Typography>
                  {post.image && <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />}
                  <View style={styles.postMeta}>
                    <Typography variant="captionMuted">{post.timeAgo}</Typography>
                    <Typography variant="captionMuted">{post.likes} likes · {post.comments} comments</Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'answers' && (
            <View style={styles.tabSection}>
              {DEMO_ANSWERS.map((ans) => (
                <View key={ans.id} style={styles.answerCard}>
                  <View style={styles.answerQuestionRow}>
                    <Icon name="help-circle" size={14} color={Colors.info} />
                    <Typography variant="bodySmall" style={styles.answerQuestion}>{ans.question}</Typography>
                  </View>
                  <Typography variant="body" style={styles.answerText}>{ans.answer}</Typography>
                  <View style={styles.answerMeta}>
                    <View style={styles.answerVote}>
                      <Icon name="thumb-up" size={12} color={Colors.primary} />
                      <Typography variant="caption" style={styles.answerVoteText}>{ans.votes} votes</Typography>
                    </View>
                    <Typography variant="captionMuted">{ans.timeAgo}</Typography>
                  </View>
                </View>
              ))}
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
  nameHi: {
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 2,
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
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  postText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: Radius.lg,
    marginTop: Space[3],
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Space[3],
    paddingTop: Space[3],
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  answerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  answerQuestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space[2],
    marginBottom: Space[2],
  },
  answerQuestion: {
    fontWeight: '700',
    color: Colors.gray800,
    flex: 1,
    lineHeight: 20,
  },
  answerText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  answerMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Space[3],
    paddingTop: Space[3],
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  answerVote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  answerVoteText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
