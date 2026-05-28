/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HYBRID HOME SCREEN (Modernized)
 * ═══════════════════════════════════════════════════════════════
 *
 * Social + farming intelligence hybrid feed.
 * UPDATED: Gradient hero, glassmorphism stories, priority cards
 * with animated press, cleaner feed, modern list styling.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import type { HomeNavigationProp } from '../navigation/types';
import type { PriorityCardData } from '../navigation/stacks/HomeStack';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const STORIES = [
  { id: 'mine', name: 'Your Story', avatar: 'https://i.pravatar.cc/150?u=me', hasStory: false, isMine: true },
  { id: '1', name: 'Ramesh N.', avatar: 'https://i.pravatar.cc/150?u=1', hasStory: true },
  { id: '2', name: 'Sunita C.', avatar: 'https://i.pravatar.cc/150?u=2', hasStory: true },
  { id: '3', name: 'Ajay T.', avatar: 'https://i.pravatar.cc/150?u=3', hasStory: false },
  { id: '4', name: 'Priya D.', avatar: 'https://i.pravatar.cc/150?u=4', hasStory: true },
  { id: '5', name: 'Mohan V.', avatar: 'https://i.pravatar.cc/150?u=5', hasStory: true },
  { id: '6', name: 'Geeta R.', avatar: 'https://i.pravatar.cc/150?u=8', hasStory: true },
];

const PRIORITY_CARDS: PriorityCardData[] = [
  {
    id: 'c1', type: 'weather_alert', title: 'Heavy Rain Alert', titleHi: 'भारी बारिश की चेतावनी',
    description: '75% chance of heavy rain starting Tuesday evening. Complete all spray applications before 4 PM.',
    descriptionHi: 'मंगलवार शाम से भारी बारिश की 75% संभावना।', priority: 'critical',
    ctaText: 'View Spray Schedule', timestamp: 'Updated 10 min ago',
    extraInfo: [{ icon: 'weather-rainy', label: 'Expected Rainfall', value: '35-50mm' }, { icon: 'clock-outline', label: 'Start Time', value: 'Tue 4:00 PM' }],
  },
  {
    id: 'c2', type: 'work', title: 'Spray Before Rain', titleHi: 'बारिश से पहले छिड़काव',
    description: 'Apply Mancozeb 75WP (400g/200L) + Copper Oxychloride (300g/200L) on all blocks before the rain hits.',
    descriptionHi: 'बारिश से पहले सभी ब्लॉकों पर छिड़काव करें।', priority: 'high',
    ctaText: 'Mark as Done', timestamp: 'Due today',
    extraInfo: [{ icon: 'flask', label: 'Tank Mix', value: 'Mancozeb + Copper' }, { icon: 'spray', label: 'Coverage', value: 'All 4 blocks' }],
  },
  {
    id: 'c3', type: 'weekly_recommendation', title: 'Soil Drench — Urea', titleHi: 'जड़ों में यूरिया डालें',
    description: 'Weekly nutrition: Apply Urea 46% (1kg/tree) dissolved in 20L water per tree. Best done in early morning.',
    descriptionHi: 'साप्ताहिक पोषण: प्रति पेड़ यूरिया 46% (1kg) लगाएं।', priority: 'medium',
    ctaText: 'View Details', timestamp: 'Recommended for Thu',
  },
  {
    id: 'c4', type: 'notification', title: 'Mandi Price Up 📈', titleHi: 'मंडी भाव बढ़े',
    description: 'Royal Delicious Grade A prices increased by ₹4/kg at Shimla Mandi. Current rate: ₹92/kg.',
    descriptionHi: 'शिमला मंडी में रॉयल डिलीशियस के भाव में ₹4/kg की बढ़ोतरी।', priority: 'low',
    timestamp: 'Today, 10:30 AM',
  },
  {
    id: 'c5', type: 'weather_alert', title: 'Frost Warning', titleHi: 'पाला चेतावनी',
    description: 'Night temperature expected to drop to 2°C on Thursday. Protect young buds with smoke pots or frost fans.',
    descriptionHi: 'गुरुवार को रात का तापमान 2°C तक गिरने की संभावना।', priority: 'high',
    ctaText: 'View Protection Tips', timestamp: 'Thu night forecast',
  },
];

const FEED_POSTS = [
  {
    id: 'p1', user: { name: 'Ramesh Negi', avatar: 'https://i.pravatar.cc/150?u=1', location: 'Kinnaur, HP' },
    timeAgo: '2h ago', text: 'Just sprayed Copper Oxychloride on all 250 trees before the rain. Preventive sprays during dormancy break are critical! 🍎',
    image: null as string | null, likes: 34, comments: 8, shares: 3, liked: false,
  },
  {
    id: 'p2', user: { name: 'Sunita Chauhan', avatar: 'https://i.pravatar.cc/150?u=2', location: 'Shimla, HP' },
    timeAgo: '4h ago', text: 'Getting ₹92/kg for Grade A Scarlet Spur at Shimla Mandi today. What prices are you seeing in your area?',
    image: 'https://picsum.photos/seed/apple1/400/250', likes: 28, comments: 15, shares: 6, liked: true,
  },
  {
    id: 'p3', user: { name: 'Ajay Thakur', avatar: 'https://i.pravatar.cc/150?u=3', location: 'Kullu, HP' },
    timeAgo: '6h ago', text: 'Scab outbreak in Kullu valley. Anyone seeing early signs? I noticed olive-green spots on lower leaves.',
    image: null as string | null, likes: 52, comments: 23, shares: 12, liked: false,
  },
  {
    id: 'p4', user: { name: 'Priya Devi', avatar: 'https://i.pravatar.cc/150?u=4', location: 'Mandi, HP' },
    timeAgo: '8h ago', text: 'New to integrated pest management this season. Switched from conventional to organic sprays on 2 blocks. Fingers crossed! 🌿',
    image: 'https://picsum.photos/seed/orchard2/400/250', likes: 41, comments: 19, shares: 4, liked: false,
  },
];

const SUGGESTED_FRIENDS = [
  { id: 'sf1', name: 'Vikram S.', avatar: 'https://i.pravatar.cc/150?u=9', location: 'Kullu, HP', mutual: 4 },
  { id: 'sf2', name: 'Anita K.', avatar: 'https://i.pravatar.cc/150?u=10', location: 'Shimla, HP', mutual: 2 },
  { id: 'sf3', name: 'Rohit P.', avatar: 'https://i.pravatar.cc/150?u=11', location: 'Mandi, HP', mutual: 6 },
  { id: 'sf4', name: 'Deepa M.', avatar: 'https://i.pravatar.cc/150?u=12', location: 'Kinnaur, HP', mutual: 3 },
];

const PEOPLE_TO_FOLLOW = [
  { id: 'pf1', name: 'Dr. Rajesh Sharma', role: 'Horticulturist', avatar: 'https://i.pravatar.cc/150?u=6', followers: '12.4K' },
  { id: 'pf2', name: 'Meena Thakur', role: 'FPO Leader', avatar: 'https://i.pravatar.cc/150?u=7', followers: '8.2K' },
  { id: 'pf3', name: 'Krishi Vigyan Kendra', role: 'Govt. Extension', avatar: 'https://i.pravatar.cc/150?u=13', followers: '24K' },
  { id: 'pf4', name: 'Amit Verma', role: 'Organic Farmer', avatar: 'https://i.pravatar.cc/150?u=14', followers: '5.1K' },
];

const GROUPS_TO_JOIN = [
  { id: 'g1', name: 'Shimla Apple Growers', members: 1240, image: 'https://picsum.photos/seed/shimla/80/80', category: 'Region' },
  { id: 'g2', name: 'Organic HP Farmers', members: 856, image: 'https://picsum.photos/seed/organic/80/80', category: 'Practice' },
  { id: 'g3', name: 'Apple Scab Fighters', members: 2340, image: 'https://picsum.photos/seed/scab/80/80', category: 'Disease' },
  { id: 'g4', name: 'Mandi Price Updates', members: 3420, image: 'https://picsum.photos/seed/mandi/80/80', category: 'Market' },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const PRIORITY_PAIR = {
  critical: { bg: '#fef2f2', border: '#fecaca', icon: Colors.danger, text: Colors.danger },
  high:     { bg: '#fff7ed', border: '#fed7aa', icon: '#ea580c', text: '#c2410c' },
  medium:   { bg: '#fefce8', border: '#fde047', icon: '#ca8a04', text: '#a16207' },
  low:      { bg: '#eff6ff', border: '#bfdbfe', icon: Colors.info, text: Colors.info },
};

const TYPE_ICON: Record<string, string> = {
  weather_alert: 'weather-lightning-rainy',
  notification: 'bell-ring',
  work: 'spray',
  weekly_recommendation: 'calendar-check',
};

function sortByPriority(cards: PriorityCardData[]): PriorityCardData[] {
  return [...cards].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(FEED_POSTS);
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sortedCards = sortByPriority(PRIORITY_CARDS);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast('Refreshed', 'success'); }, 1200);
  }, []);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handlePost = () => {
    if (!postText.trim() && !selectedImage) return;
    const newPost = {
      id: `p${Date.now()}`,
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', location: 'Shimla, HP' },
      timeAgo: 'Just now', text: postText.trim(), image: selectedImage,
      likes: 0, comments: 0, shares: 0, liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostText(''); setSelectedImage(null);
    showToast('Post shared!', 'success');
  };

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.assets?.[0]?.uri) setSelectedImage(response.assets[0].uri);
    });
  };
  const pickFromCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]?.uri) setSelectedImage(response.assets[0].uri);
    });
  };

  const navigateToCardDetail = (card: PriorityCardData) => {
    navigation.navigate('CardDetail', { card });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Hero Gradient Header ── */}
      <LinearGradient
        colors={[Colors.primary600, Colors.primary500, Colors.primary700]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroHeader}>
          <View>
            <Typography variant="displayHeading" style={styles.heroTitle}>Baagicha</Typography>
            <Typography variant="caption" style={styles.heroSubtitle}>Shimla, HP · 1950m</Typography>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Icon name="bell-outline" size={24} color={Colors.white} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Stories inside hero */}
        <StoryBar stories={STORIES} />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Priority Cards ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="alert-circle" size={18} color={Colors.danger} />
            <Typography variant="body" style={styles.sectionTitle}>Alerts & Work</Typography>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Typography variant="caption" style={styles.seeAll}>View All</Typography>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
          {sortedCards.map((card) => (
            <PriorityCard key={card.id} card={card} onPress={navigateToCardDetail} />
          ))}
        </ScrollView>

        {/* ── Community Post Input ── */}
        <View style={styles.inputCard}>
          <View style={styles.inputTop}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.inputAvatar} />
            <TextInput
              style={styles.inputField}
              placeholder="Share an update or ask a question..."
              placeholderTextColor={Colors.gray400}
              value={postText}
              onChangeText={setPostText}
              multiline
            />
          </View>
          {selectedImage && (
            <View style={styles.previewWrap}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removePreview} onPress={() => setSelectedImage(null)}>
                <Icon name="close-circle" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputActions}>
            <InputAction icon="image-outline" label="Gallery" color={Colors.success} onPress={pickFromGallery} />
            <InputAction icon="camera-outline" label="Camera" color={Colors.info} onPress={pickFromCamera} />
            <InputAction icon="help-circle-outline" label="Question" color={Colors.warning} />
            <TouchableOpacity
              style={[styles.postBtn, !postText.trim() && !selectedImage && styles.postBtnDisabled]}
              onPress={handlePost}
              activeOpacity={0.8}
              disabled={!postText.trim() && !selectedImage}
            >
              <Typography variant="caption" style={styles.postBtnText}>Post</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Activity Feed ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="newspaper-variant" size={18} color={Colors.primary} />
            <Typography variant="body" style={styles.sectionTitle}>Activity Feed</Typography>
          </View>
        </View>
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} onLike={() => toggleLike(post.id)} />
        ))}

        {/* ── Suggested Friends ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-plus" size={18} color={Colors.accent600} />
            <Typography variant="body" style={styles.sectionTitle}>Suggested Friends</Typography>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsContainer}>
          {SUGGESTED_FRIENDS.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
              <Typography variant="caption" style={styles.friendName} lines={1}>{friend.name}</Typography>
              <Typography variant="captionMuted" style={{ fontSize: 10 }}>{friend.mutual} mutual</Typography>
              <TouchableOpacity style={styles.friendBtn} activeOpacity={0.8}>
                <Typography variant="caption" style={styles.friendBtnText}>Add</Typography>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* ── People to Follow ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-star" size={18} color={Colors.info} />
            <Typography variant="body" style={styles.sectionTitle}>People to Follow</Typography>
          </View>
        </View>
        <View style={styles.listCard}>
          {PEOPLE_TO_FOLLOW.map((person, idx) => (
            <ListRow key={person.id} avatar={person.avatar} name={person.name} subtitle={`${person.role} · ${person.followers}`} isLast={idx === PEOPLE_TO_FOLLOW.length - 1}>
              <TouchableOpacity style={styles.followBtn} activeOpacity={0.8}>
                <Typography variant="caption" style={styles.followBtnText}>Follow</Typography>
              </TouchableOpacity>
            </ListRow>
          ))}
        </View>

        {/* ── Groups to Join ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-group" size={18} color={Colors.primary} />
            <Typography variant="body" style={styles.sectionTitle}>Groups to Join</Typography>
          </View>
        </View>
        <View style={[styles.listCard, { marginBottom: Space[6] }]}>
          {GROUPS_TO_JOIN.map((group, idx) => (
            <ListRow key={group.id} avatar={group.image} name={group.name} subtitle={`${group.category} · ${group.members.toLocaleString()} members`} isLast={idx === GROUPS_TO_JOIN.length - 1} isSquareAvatar>
              <TouchableOpacity style={styles.joinBtn} activeOpacity={0.8}>
                <Typography variant="caption" style={styles.joinBtnText}>Join</Typography>
              </TouchableOpacity>
            </ListRow>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StoryBar({ stories }: { stories: typeof STORIES }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
      {stories.map((story) => (
        <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.7}>
          <View style={[styles.storyRing, story.hasStory && styles.storyRingActive]}>
            <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
          </View>
          {story.isMine && (
            <View style={styles.addStoryBtn}>
              <Icon name="plus" size={12} color={Colors.white} />
            </View>
          )}
          <Typography variant="caption" style={styles.storyName} lines={1}>{story.name}</Typography>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function PriorityCard({ card, onPress }: { card: PriorityCardData; onPress: (c: PriorityCardData) => void }) {
  const style = PRIORITY_PAIR[card.priority as keyof typeof PRIORITY_PAIR] ?? PRIORITY_PAIR.medium;
  const icon = TYPE_ICON[card.type] ?? 'information';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97, friction: 8, tension: 300, useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, friction: 8, tension: 300, useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(card)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={{ marginRight: Space[3] }}
    >
      <Animated.View style={[styles.priorityCard, { backgroundColor: style.bg, borderColor: style.border, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.priorityHeader}>
          <View style={[styles.priorityIconWrap, { backgroundColor: style.icon + '15' }]}>
            <Icon name={icon} size={16} color={style.icon} />
          </View>
          <Icon name="chevron-right" size={18} color={style.text} />
        </View>
        <Typography variant="body" style={[styles.priorityTitle, { color: style.text }]} lines={2}>{card.title}</Typography>
        <Typography variant="caption" style={styles.priorityDesc} lines={2}>{card.description}</Typography>
        {card.timestamp && (
          <Typography variant="captionMuted" style={styles.priorityTime}>{card.timestamp}</Typography>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

function InputAction({ icon, label, color, onPress }: { icon: string; label: string; color: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.inputActionBtn} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={18} color={color} />
      <Typography variant="caption" style={styles.inputActionText}>{label}</Typography>
    </TouchableOpacity>
  );
}

function FeedPost({ post, onLike }: { post: typeof FEED_POSTS[0]; onLike: () => void }) {
  return (
    <View style={styles.feedCard}>
      <View style={styles.feedHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.feedAvatar} />
        <View style={styles.feedHeaderText}>
          <Typography variant="body" style={styles.feedAuthor}>{post.user.name}</Typography>
          <Typography variant="captionMuted">{post.user.location} · {post.timeAgo}</Typography>
        </View>
        <TouchableOpacity style={styles.feedMore} activeOpacity={0.7}>
          <Icon name="dots-horizontal" size={18} color={Colors.gray400} />
        </TouchableOpacity>
      </View>
      <Typography variant="body" style={styles.feedText}>{post.text}</Typography>
      {post.image && <Image source={{ uri: post.image }} style={styles.feedImage} resizeMode="cover" />}
      <View style={styles.feedStats}>
        <Typography variant="captionMuted">{post.likes} likes · {post.comments} comments</Typography>
      </View>
      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.feedActionBtn} onPress={onLike} activeOpacity={0.7}>
          <Icon name={post.liked ? 'thumb-up' : 'thumb-up-outline'} size={20} color={post.liked ? Colors.primary : Colors.gray500} />
          <Typography variant="caption" style={[styles.feedActionText, post.liked && { color: Colors.primary }]}>Like</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
          <Icon name="comment-outline" size={20} color={Colors.gray500} />
          <Typography variant="caption" style={styles.feedActionText}>Comment</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedActionBtn} activeOpacity={0.7}>
          <Icon name="share-outline" size={20} color={Colors.gray500} />
          <Typography variant="caption" style={styles.feedActionText}>Share</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListRow({ avatar, name, subtitle, isLast, isSquareAvatar, children }: {
  avatar: string; name: string; subtitle: string; isLast: boolean; isSquareAvatar?: boolean; children: React.ReactNode;
}) {
  return (
    <View style={[styles.listRow, !isLast && styles.listRowBorder]}>
      <Image source={{ uri: avatar }} style={isSquareAvatar ? styles.groupImage : styles.listAvatar} />
      <View style={styles.listText}>
        <Typography variant="body" style={styles.listName}>{name}</Typography>
        <Typography variant="captionMuted">{subtitle}</Typography>
      </View>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 0 },

  // ── Hero ──
  heroGradient: {
    paddingTop: Space[3],
    paddingBottom: Space[4],
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.medium,
    zIndex: 10,
  },
  heroHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: Space[4], paddingBottom: Space[3],
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  notifBtn: { position: 'relative', padding: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full },
  notifBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.accent500, borderWidth: 1.5, borderColor: Colors.primary600,
  },

  // ── Stories ──
  storiesContainer: { paddingHorizontal: Space[4], paddingVertical: Space[3], gap: Space[1] },
  storyItem: { alignItems: 'center', marginRight: Space[3], width: 66 },
  storyRing: { width: 60, height: 60, borderRadius: 30, padding: 2.5, backgroundColor: 'rgba(255,255,255,0.25)' },
  storyRingActive: { backgroundColor: Colors.accent500 },
  storyAvatar: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 2.5, borderColor: Colors.primary600 },
  addStoryBtn: {
    position: 'absolute', bottom: 18, right: 2,
    width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.accent500,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary600,
  },
  storyName: { marginTop: 4, fontSize: 10, color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontWeight: '500' },

  // ── Section Headers ──
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], marginTop: Space[6], marginBottom: Space[3],
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  sectionTitle: { fontWeight: '800', color: Colors.gray900, fontSize: 16, letterSpacing: -0.3 },
  seeAll: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

  // ── Priority Cards ──
  cardsContainer: { paddingHorizontal: Space[4] },
  priorityCard: {
    width: 260, borderRadius: Radius.xl, padding: Space[4], borderWidth: 1,
  },
  priorityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space[3] },
  priorityIconWrap: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  priorityTitle: { fontWeight: '800', fontSize: 15, lineHeight: 20, marginBottom: Space[1] },
  priorityDesc: { fontSize: 12, color: Colors.gray600, lineHeight: 17 },
  priorityTime: { fontSize: 10, marginTop: Space[3], color: Colors.gray500 },

  // ── Post Input ──
  inputCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: Space[4],
    borderRadius: Radius.xl, padding: Space[4], ...Shadows.medium,
  },
  inputTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Space[3] },
  inputAvatar: { width: 40, height: 40, borderRadius: Radius.full },
  inputField: {
    flex: 1, minHeight: 40, maxHeight: 100,
    fontSize: 15, color: Colors.gray800, textAlignVertical: 'top', paddingTop: 8,
  },
  previewWrap: { marginTop: Space[3], position: 'relative', alignSelf: 'flex-start' },
  previewImage: { width: 120, height: 120, borderRadius: Radius.lg },
  removePreview: { position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.full },
  inputActions: { flexDirection: 'row', alignItems: 'center', marginTop: Space[3], paddingTop: Space[3], borderTopWidth: 1, borderTopColor: Colors.gray100 },
  inputActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Space[2], paddingVertical: 4 },
  inputActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  postBtn: { marginLeft: 'auto', backgroundColor: Colors.primary, paddingHorizontal: Space[5], paddingVertical: 8, borderRadius: Radius.lg },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },

  // ── Feed ──
  feedCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: Space[3],
    borderRadius: Radius.xl, padding: Space[4], ...Shadows.medium,
  },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  feedAvatar: { width: 42, height: 42, borderRadius: Radius.full },
  feedHeaderText: { flex: 1 },
  feedAuthor: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  feedMore: { padding: 4 },
  feedText: { fontSize: 14, color: Colors.gray700, marginTop: Space[3], lineHeight: 20 },
  feedImage: { width: '100%', height: 200, borderRadius: Radius.lg, marginTop: Space[3] },
  feedStats: { marginTop: Space[3], paddingBottom: Space[3], borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  feedActions: { flexDirection: 'row', marginTop: Space[2] },
  feedActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6 },
  feedActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },

  // ── Suggested Friends ──
  friendsContainer: { paddingHorizontal: Space[4] },
  friendCard: {
    width: 100, backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Space[3], alignItems: 'center', marginRight: Space[3], ...Shadows.medium,
  },
  friendAvatar: { width: 52, height: 52, borderRadius: Radius.full },
  friendName: { fontWeight: '700', fontSize: 12, color: Colors.gray900, marginTop: Space[2] },
  friendBtn: {
    marginTop: Space[2], backgroundColor: Colors.primary,
    paddingHorizontal: Space[4], paddingVertical: 5, borderRadius: Radius.full,
  },
  friendBtnText: { color: Colors.white, fontWeight: '700', fontSize: 11 },

  // ── Lists ──
  listCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4],
    borderRadius: Radius.xl, paddingHorizontal: Space[4], paddingVertical: Space[2],
    ...Shadows.medium,
  },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Space[3] },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  listAvatar: { width: 46, height: 46, borderRadius: Radius.full },
  groupImage: { width: 46, height: 46, borderRadius: Radius.md },
  listText: { flex: 1, marginLeft: Space[3] },
  listName: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  followBtn: { backgroundColor: Colors.primary + '10', paddingHorizontal: Space[4], paddingVertical: 6, borderRadius: Radius.lg },
  followBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  joinBtn: { backgroundColor: Colors.primary, paddingHorizontal: Space[4], paddingVertical: 6, borderRadius: Radius.lg },
  joinBtnText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
});
