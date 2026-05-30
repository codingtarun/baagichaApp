/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HYBRID HOME SCREEN (Modernized)
 * ═══════════════════════════════════════════════════════════════
 *
 * Social + farming intelligence hybrid feed.
 * UPDATED: Gradient hero, glassmorphism stories, priority cards
 * with animated press, cleaner feed, modern list styling.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
  Modal,
  Linking,
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
import ShareSheet from '../components/ShareSheet';
import { getSuggestedUsers, type SuggestedUser } from '../services/userApi';
import { getFeed, createPost, togglePostLike, sharePost, type FeedPost } from '../services/postApi';
import { getGroups, joinGroup, type GroupCard } from '../services/groupApi';

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

const POST_TEMPLATES = [
  { id: 'spray', icon: 'spray', label: 'Spraying', text: 'I am spraying today on my orchard. Preventive care during this season is crucial! 🍎🚿' },
  { id: 'weather', icon: 'weather-rainy', label: 'Weather', text: 'Weather alert for my area: Stay prepared and stay safe! 🌧️' },
  { id: 'mandi', icon: 'chart-line', label: 'Mandi Price', text: 'Mandi price update: What prices are you getting in your area? 💰' },
  { id: 'work', icon: 'hammer-wrench', label: 'Orchard Work', text: 'Working hard in the orchard today! 🌳💪' },
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

const TAB_BAR_HEIGHT = 70; // Custom bottom tab bar height

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const PRIORITY_PAIR = {
  critical: { accent: Colors.danger, icon: Colors.danger, text: Colors.danger },
  high:     { accent: '#ea580c', icon: '#ea580c', text: '#c2410c' },
  medium:   { accent: '#ca8a04', icon: '#ca8a04', text: '#a16207' },
  low:      { accent: Colors.info, icon: Colors.info, text: Colors.info },
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
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string; name: string }[]>([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareCard, setShareCard] = useState<PriorityCardData | null>(null);
  const [expertUsers, setExpertUsers] = useState<SuggestedUser[]>([]);
  const [friendUsers, setFriendUsers] = useState<SuggestedUser[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [suggestedGroups, setSuggestedGroups] = useState<GroupCard[]>([]);
  const [posting, setPosting] = useState(false);

  const sortedCards = sortByPriority(PRIORITY_CARDS);

  // Fetch feed + experts + suggested friends on mount
  useEffect(() => {
    let cancelled = false;

    getFeed(10, 1)
      .then((feed) => { if (!cancelled) setPosts(feed); })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Home] Feed fetch failed:', err.response?.data ?? err.message);
          setPosts([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingFeed(false); });

    getSuggestedUsers('experts', 8)
      .then((users) => { if (!cancelled) setExpertUsers(users); })
      .catch((err) => { 
        if (!cancelled) {
          console.error('[Home] Experts fetch failed:', err.response?.data ?? err.message);
          setExpertUsers([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingExperts(false); });

    getSuggestedUsers('friends', 6)
      .then((users) => { if (!cancelled) setFriendUsers(users); })
      .catch((err) => { 
        if (!cancelled) {
          console.error('[Home] Friends fetch failed:', err.response?.data ?? err.message);
          setFriendUsers([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingFriends(false); });

    // Fetch suggested groups (public, not joined)
    getGroups({ visibility: 'public', sort: 'popular', per_page: 10 })
      .then((groups) => {
        if (!cancelled) {
          // Filter out groups user is already in, pick up to 5
          const filtered = groups.filter(g => !g.is_member).slice(0, 5);
          setSuggestedGroups(filtered);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Home] Groups fetch failed:', err.response?.data ?? err.message);
          setSuggestedGroups([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingGroups(false); });

    return () => { cancelled = true; };
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    getFeed(10, 1)
      .then((feed) => { setPosts(feed); showToast('Refreshed', 'success'); })
      .catch((err) => { console.error('[Home] Refresh failed:', err); showToast('Refresh failed', 'error'); })
      .finally(() => setRefreshing(false));
  }, []);

  const toggleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
    ));
    try {
      const result = await togglePostLike(postId);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: result.is_liked, likes_count: result.likes_count } : p
      ));
    } catch {
      // Revert
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: post.is_liked, likes_count: post.likes_count } : p
      ));
      showToast('Failed to like post', 'error');
    }
  };

  const handlePost = async () => {
    if (!postText.trim() && selectedImages.length === 0) return;
    setPosting(true);
    try {
      const newPost = await createPost({
        body: postText.trim(),
        type: 'status',
        visibility: 'public',
        images: selectedImages.length > 0 ? selectedImages : undefined,
      });
      setPosts(prev => [newPost, ...prev]);
      setPostText('');
      setSelectedImages([]);
      showToast('Post shared!', 'success');
    } catch (err: any) {
      console.error('[Home] Post failed:', err.response?.data ?? err.message);
      showToast('Failed to share post', 'error');
    } finally {
      setPosting(false);
    }
  };

  const pickFromGallery = () => {
    const remaining = 3 - selectedImages.length;
    if (remaining <= 0) { showToast('Max 3 images allowed', 'warning'); return; }
    launchImageLibrary({ mediaType: 'photo', selectionLimit: remaining }, (response) => {
      if (response.assets) {
        const newImages = response.assets
          .filter(a => a.uri && a.type)
          .map(a => ({ uri: a.uri!, type: a.type!, name: a.fileName ?? `image_${Date.now()}.jpg` }));
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 3));
      }
    });
  };
  const pickFromCamera = () => {
    if (selectedImages.length >= 3) { showToast('Max 3 images allowed', 'warning'); return; }
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]?.uri) {
        const a = response.assets[0];
        setSelectedImages(prev => [...prev, { uri: a.uri!, type: a.type ?? 'image/jpeg', name: a.fileName ?? `camera_${Date.now()}.jpg` }]);
      }
    });
  };

  const navigateToCardDetail = (card: PriorityCardData) => {
    navigation.navigate('CardDetail', { card });
  };

  const applyTemplate = (template: typeof POST_TEMPLATES[0]) => {
    setPostText(template.text);
    showToast('Template added — edit & post!', 'success');
  };

  const openShareModal = (card: PriorityCardData) => {
    setShareCard(card);
    setShareModalVisible(true);
  };

  const shareAlertToFeed = () => {
    if (!shareCard) return;
    const text = `📢 ${shareCard.title}\n\n${shareCard.description}\n\nStay informed with Baagicha!`;
    setPostText(text);
    setShareModalVisible(false);
    setShareCard(null);
    showToast('Alert added to post box', 'success');
  };

  const shareAlertViaWhatsApp = () => {
    if (!shareCard) return;
    const text = `📢 *${shareCard.title}*\n\n${shareCard.description}\n\n_Shared via Baagicha_`;
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
    });
    setShareModalVisible(false);
    setShareCard(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Hero Gradient Header ── */}
      <LinearGradient
        colors={[Colors.primary, Colors.primary600]}
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
          {selectedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewsContainer}>
              {selectedImages.map((img, idx) => (
                <View key={`${img.uri}_${idx}`} style={styles.previewWrap}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removePreview} onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}>
                    <Icon name="close-circle" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {/* ── Quick Templates ── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateChipsContainer}>
            {POST_TEMPLATES.map((template) => (
              <TouchableOpacity key={template.id} style={styles.templateChip} onPress={() => applyTemplate(template)} activeOpacity={0.7}>
                <Icon name={template.icon} size={14} color={Colors.primary} />
                <Typography variant="caption" style={styles.templateChipText}>{template.label}</Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputActions}>
            <InputAction icon="image-outline" label="Gallery" color={Colors.success} onPress={pickFromGallery} />
            <InputAction icon="camera-outline" label="Camera" color={Colors.info} onPress={pickFromCamera} />
            <InputAction icon="help-circle-outline" label="Ask Community" color={Colors.warning} />
          </View>
          <TouchableOpacity
            style={[styles.postBtn, (!postText.trim() && selectedImages.length === 0) || posting && styles.postBtnDisabled]}
            onPress={handlePost}
            activeOpacity={0.8}
            disabled={(!postText.trim() && selectedImages.length === 0) || posting}
          >
            <Typography variant="caption" style={styles.postBtnText}>{posting ? 'Posting...' : 'Post'}</Typography>
          </TouchableOpacity>
        </View>

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
            <PriorityCard key={card.id} card={card} onPress={navigateToCardDetail} onShare={openShareModal} />
          ))}
        </ScrollView>

        {/* ── Activity Feed ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="newspaper-variant" size={18} color={Colors.primary} />
            <Typography variant="body" style={styles.sectionTitle}>Activity Feed</Typography>
          </View>
        </View>
        {loadingFeed ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>
            Loading feed...
          </Typography>
        ) : posts.length === 0 ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>
            No posts yet. Share your first update!
          </Typography>
        ) : (
          posts.map((post) => (
            <FeedPost key={post.id} post={post} onLike={() => toggleLike(post.id)} />
          ))
        )}

        {/* ── Suggested Friends ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-plus" size={18} color={Colors.accent600} />
            <Typography variant="body" style={styles.sectionTitle}>Suggested Friends</Typography>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.friendsContainer}>
          {loadingFriends ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, width: 200, textAlign: 'center' }}>
              Loading...
            </Typography>
          ) : friendUsers.length === 0 ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, width: 200, textAlign: 'center' }}>
              No suggestions
            </Typography>
          ) : (
            friendUsers.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.friendCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('UserProfile', { userId: String(friend.id) })}
              >
                <Image source={{ uri: friend.avatar ?? `https://i.pravatar.cc/150?u=${friend.id}` }} style={styles.friendAvatar} />
                <Typography variant="caption" style={styles.friendName} lines={1}>{friend.name}</Typography>
                <Typography variant="captionMuted" style={{ fontSize: 10 }}>
                  {friend.location?.district ?? 'Farmer'}
                </Typography>
                <TouchableOpacity style={styles.friendBtn} activeOpacity={0.8}>
                  <Typography variant="caption" style={styles.friendBtnText}>Add</Typography>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* ── People to Follow ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-star" size={18} color={Colors.info} />
            <Typography variant="body" style={styles.sectionTitle}>People to Follow</Typography>
          </View>
        </View>
        <View style={styles.listCard}>
          {loadingExperts ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>
              Loading...
            </Typography>
          ) : expertUsers.length === 0 ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>
              No suggestions right now
            </Typography>
          ) : (
            expertUsers.map((person, idx) => (
              <TouchableOpacity
                key={person.id}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('UserProfile', { userId: String(person.id) })}
              >
                <ListRow
                  avatar={person.avatar ?? 'https://i.pravatar.cc/150?u=' + person.id}
                  name={person.name}
                  subtitle={`${person.title ?? 'Expert'} · ${formatCount(person.followers_count)} followers`}
                  isLast={idx === expertUsers.length - 1}
                >
                  <TouchableOpacity style={styles.followBtn} activeOpacity={0.8}>
                    <Typography variant="caption" style={styles.followBtnText}>Follow</Typography>
                  </TouchableOpacity>
                </ListRow>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ── Groups to Join ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="account-group" size={18} color={Colors.primary} />
            <Typography variant="body" style={styles.sectionTitle}>Groups to Join</Typography>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('GroupList')}>
            <Typography variant="caption" style={styles.seeAll}>See All</Typography>
          </TouchableOpacity>
        </View>
        <View style={[styles.listCard, { marginBottom: Space[6] + TAB_BAR_HEIGHT }]}>
          {loadingGroups ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>
              Loading groups...
            </Typography>
          ) : suggestedGroups.length === 0 ? (
            <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>
              No groups to join right now
            </Typography>
          ) : (
            suggestedGroups.map((group, idx) => (
              <TouchableOpacity
                key={group.id}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('GroupDetail', { slug: group.slug })}
              >
                <ListRow
                  avatar={group.avatar ?? group.cover ?? `https://i.pravatar.cc/150?u=group${group.id}`}
                  name={group.name}
                  subtitle={`${group.visibility === 'public' ? 'Public' : 'Private'} · ${group.members_count.toLocaleString()} members`}
                  isLast={idx === suggestedGroups.length - 1}
                  isSquareAvatar
                >
                  <JoinGroupButton group={group} onJoined={(slug) => {
                    setSuggestedGroups(prev => prev.filter(g => g.slug !== slug));
                  }} />
                </ListRow>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Alert Share Modal ── */}
      <Modal
        animationType="slide"
        transparent
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Typography variant="body" style={styles.modalTitle}>Share Alert</Typography>
            <Typography variant="caption" style={styles.modalSubtitle} lines={2}>{shareCard?.title}</Typography>

            <TouchableOpacity style={styles.modalBtn} onPress={shareAlertToFeed} activeOpacity={0.7}>
              <View style={[styles.modalIconWrap, { backgroundColor: Colors.primary + '15' }]}>
                <Icon name="newspaper-variant" size={22} color={Colors.primary} />
              </View>
              <View style={styles.modalBtnTextWrap}>
                <Typography variant="body" style={styles.modalBtnTitle}>Share to Feed</Typography>
                <Typography variant="captionMuted" style={styles.modalBtnDesc}>Post this alert to your activity feed</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalBtn} onPress={shareAlertViaWhatsApp} activeOpacity={0.7}>
              <View style={[styles.modalIconWrap, { backgroundColor: Colors.success + '15' }]}>
                <Icon name="whatsapp" size={22} color={Colors.success} />
              </View>
              <View style={styles.modalBtnTextWrap}>
                <Typography variant="body" style={styles.modalBtnTitle}>Share via WhatsApp</Typography>
                <Typography variant="captionMuted" style={styles.modalBtnDesc}>Send to farmers on WhatsApp</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancel} onPress={() => setShareModalVisible(false)} activeOpacity={0.7}>
              <Typography variant="body" style={styles.modalCancelText}>Cancel</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function StoryBar({ stories }: { stories: typeof STORIES }) {
  return (
    <View style={styles.storiesCardShadow}>
      <View style={styles.storiesCardInner}>
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
      </View>
    </View>
  );
}

function PriorityCard({ card, onPress, onShare }: { card: PriorityCardData; onPress: (c: PriorityCardData) => void; onShare?: (c: PriorityCardData) => void }) {
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
      <View style={styles.priorityCardShadow}>
        <Animated.View style={[styles.priorityCardInner, { transform: [{ scale: scaleAnim }] }]}>
          {/* Colored accent strip — replaces borderLeftWidth to avoid corner artifacts */}
          <View style={[styles.priorityStrip, { backgroundColor: style.accent }]} />
          <View style={styles.priorityContent}>
            <View style={styles.priorityHeader}>
              <View style={[styles.priorityIconWrap, { backgroundColor: style.accent + '15' }]}>
                <Icon name={icon} size={16} color={style.icon} />
              </View>
              {onShare ? (
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); onShare(card); }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={[styles.shareIconWrap, { backgroundColor: style.accent + '12' }]}>
                    <Icon name="share-variant" size={14} color={style.accent} />
                  </View>
                </TouchableOpacity>
              ) : (
                <Icon name="chevron-right" size={18} color={style.accent} />
              )}
            </View>
            <Typography variant="body" style={[styles.priorityTitle, { color: style.text }]} lines={2}>{card.title}</Typography>
            <Typography variant="caption" style={styles.priorityDesc} lines={2}>{card.description}</Typography>
            {card.timestamp && (
              <Typography variant="captionMuted" style={styles.priorityTime}>{card.timestamp}</Typography>
            )}
          </View>
        </Animated.View>
      </View>
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

function FeedPost({ post, onLike }: { post: FeedPost; onLike: () => void }) {
  const navigation = useNavigation<HomeNavigationProp>();
  const [shareVisible, setShareVisible] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.shares_count);

  const navigateToDetail = () => {
    navigation.navigate('PostDetail', { postId: String(post.id) });
  };

  const navigateToUser = () => {
    navigation.navigate('UserProfile', { userId: String(post.user.id) });
  };

  const handleShare = async () => {
    setShareVisible(true);
    try {
      const result = await sharePost(post.id);
      setSharesCount(result.shares_count);
    } catch {
      // Silently fail — user still gets the share sheet
    }
  };

  const timeAgo = formatTimeAgo(post.created_at);

  return (
    <TouchableOpacity onPress={navigateToDetail} activeOpacity={0.97}>
      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <TouchableOpacity onPress={navigateToUser} activeOpacity={0.7}>
            <Image source={{ uri: post.user.avatar ?? `https://i.pravatar.cc/150?u=${post.user.id}` }} style={styles.feedAvatar} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToUser} activeOpacity={0.7} style={{ flex: 1 }}>
            <View style={styles.feedHeaderText}>
              <Typography variant="body" style={styles.feedAuthor}>{post.user.name}</Typography>
              <Typography variant="captionMuted">{timeAgo}</Typography>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedMore} activeOpacity={0.7}>
            <Icon name="dots-horizontal" size={18} color={Colors.gray500} />
          </TouchableOpacity>
        </View>
        <Typography variant="body" style={styles.feedText}>{post.body}</Typography>
        {post.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Space[2], marginTop: Space[3] }}>
            {post.images.map(img => (
              <Image key={img.id} source={{ uri: img.medium }} style={styles.feedImage} resizeMode="cover" />
            ))}
          </ScrollView>
        )}
        <View style={styles.feedStats}>
          <Typography variant="captionMuted">{post.likes_count} likes · {post.comments_count} comments · {sharesCount} shares</Typography>
        </View>
        <View style={styles.feedActions}>
          <TouchableOpacity style={styles.feedActionBtn} onPress={onLike} activeOpacity={0.7}>
            <Icon name={post.is_liked ? 'thumb-up' : 'thumb-up-outline'} size={20} color={post.is_liked ? Colors.primary : Colors.gray500} />
            <Typography variant="caption" style={[styles.feedActionText, post.is_liked && { color: Colors.primary }]}>Like</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedActionBtn} onPress={navigateToDetail} activeOpacity={0.7}>
            <Icon name="comment-outline" size={20} color={Colors.gray500} />
            <Typography variant="caption" style={styles.feedActionText}>Comment</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedActionBtn} onPress={handleShare} activeOpacity={0.7}>
            <Icon name="share-outline" size={20} color={Colors.gray500} />
            <Typography variant="caption" style={styles.feedActionText}>Share</Typography>
          </TouchableOpacity>
        </View>
      </View>
      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title={post.user.name + "'s Post"}
        message={post.body}
        url={`https://baagvaani.com/post/${post.id}`}
      />
    </TouchableOpacity>
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

function JoinGroupButton({ group, onJoined }: { group: GroupCard; onJoined: (slug: string) => void }) {
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(group.is_member);
  const [pending, setPending] = useState(group.is_pending_request);

  const handleJoin = async () => {
    if (joining || joined || pending) return;
    setJoining(true);
    try {
      const result = await joinGroup(group.slug);
      if (result.success) {
        if (group.visibility === 'private' && result.message?.includes('request')) {
          setPending(true);
          showToast('Join request sent', 'success');
        } else {
          setJoined(true);
          showToast('Joined group!', 'success');
          onJoined(group.slug);
        }
      }
    } catch (err: any) {
      console.error('[Home] Join failed:', err.response?.data ?? err.message);
      showToast('Failed to join', 'error');
    } finally {
      setJoining(false);
    }
  };

  if (joined) {
    return (
      <View style={[styles.joinBtn, { backgroundColor: Colors.gray200 }]}>
        <Typography variant="caption" style={[styles.joinBtnText, { color: Colors.gray500 }]}>Joined</Typography>
      </View>
    );
  }

  if (pending) {
    return (
      <View style={[styles.joinBtn, { backgroundColor: Colors.warning + '20' }]}>
        <Typography variant="caption" style={[styles.joinBtnText, { color: Colors.warning }]}>Pending</Typography>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.joinBtn} activeOpacity={0.8} onPress={handleJoin} disabled={joining}>
      <Typography variant="caption" style={styles.joinBtnText}>{joining ? '...' : 'Join'}</Typography>
    </TouchableOpacity>
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
    backgroundColor: Colors.accent500, borderWidth: 1.5, borderColor: Colors.primary,
  },

  // ── Stories ──
  storiesCardShadow: {
    borderRadius: Radius['2xl'],
    marginHorizontal: Space[4],
    ...Shadows.medium,
  },
  storiesCardInner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
  },
  storiesContainer: { paddingHorizontal: Space[3], paddingVertical: Space[3], gap: Space[1] },
  storyItem: { alignItems: 'center', marginRight: Space[3], width: 66 },
  storyRing: { width: 60, height: 60, borderRadius: 30, padding: 2.5, backgroundColor: Colors.gray200 },
  storyRingActive: { backgroundColor: Colors.primary },
  storyAvatar: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 2.5, borderColor: Colors.white },
  addStoryBtn: {
    position: 'absolute', bottom: 18, right: 2,
    width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.accent500,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white,
  },
  storyName: { marginTop: 4, fontSize: 10, color: Colors.gray900, textAlign: 'center', fontWeight: '500' },

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
  priorityCardShadow: {
    width: 260, borderRadius: Radius['2xl'], ...Shadows.medium,
  },
  priorityCardInner: {
    backgroundColor: Colors.surface, borderRadius: Radius['2xl'],
    flexDirection: 'row', overflow: 'hidden',
  },
  priorityStrip: {
    width: 4,
    alignSelf: 'stretch',
  },
  priorityContent: {
    flex: 1,
    padding: Space[4],
  },
  priorityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space[3] },
  priorityIconWrap: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  priorityTitle: { fontWeight: '800', fontSize: 15, lineHeight: 20, marginBottom: Space[1] },
  priorityDesc: { fontSize: 12, color: Colors.gray500, lineHeight: 17 },
  priorityTime: { fontSize: 10, marginTop: Space[3], color: Colors.gray500 },

  // ── Post Input ──
  inputCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: Space[4],
    borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  inputTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Space[3] },
  inputAvatar: { width: 40, height: 40, borderRadius: Radius.full },
  inputField: {
    flex: 1, minHeight: 40, maxHeight: 100,
    fontSize: 15, color: Colors.gray900, textAlignVertical: 'top', paddingTop: 8,
  },
  previewsContainer: { marginTop: Space[3], gap: Space[2] },
  previewWrap: { position: 'relative', alignSelf: 'flex-start', marginRight: Space[2] },
  previewImage: { width: 120, height: 120, borderRadius: Radius.lg },
  removePreview: { position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.full },
  inputActions: { flexDirection: 'row', alignItems: 'center', marginTop: Space[3], paddingTop: Space[3], borderTopWidth: 1, borderTopColor: Colors.gray200 },
  inputActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Space[2], paddingVertical: 4 },
  inputActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  postBtn: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: Radius.full, alignItems: 'center', marginTop: Space[3] },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },

  // ── Template Chips ──
  templateChipsContainer: { marginTop: Space[3], gap: Space[2] },
  templateChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Space[3], paddingVertical: 6,
    borderRadius: Radius.full, marginRight: Space[2],
    borderWidth: 1, borderColor: Colors.primary + '20',
  },
  templateChipText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },

  // ── Card Share ──
  shareIconWrap: {
    width: 28, height: 28, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Share Modal ──
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: Radius['2xl'], borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Space[4], paddingBottom: Space[6], paddingTop: Space[3],
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: Radius.full, backgroundColor: Colors.gray300,
    alignSelf: 'center', marginBottom: Space[3],
  },
  modalTitle: { fontWeight: '800', fontSize: 18, color: Colors.gray900, textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: Colors.gray500, textAlign: 'center', marginBottom: Space[4] },
  modalBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Space[3],
    padding: Space[3], borderRadius: Radius.xl, backgroundColor: Colors.background,
    marginBottom: Space[3],
  },
  modalIconWrap: { width: 44, height: 44, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  modalBtnTextWrap: { flex: 1 },
  modalBtnTitle: { fontWeight: '700', fontSize: 15, color: Colors.gray900 },
  modalBtnDesc: { fontSize: 12, color: Colors.gray500, marginTop: 2 },
  modalCancel: {
    alignItems: 'center', paddingVertical: Space[3],
    borderTopWidth: 1, borderTopColor: Colors.gray100, marginTop: Space[2],
  },
  modalCancelText: { fontWeight: '700', fontSize: 15, color: Colors.gray500 },

  // ── Feed ──
  feedCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: Space[3],
    borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  feedAvatar: { width: 42, height: 42, borderRadius: Radius.full },
  feedHeaderText: { flex: 1 },
  feedAuthor: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  feedMore: { padding: 4 },
  feedText: { fontSize: 14, color: Colors.gray500, marginTop: Space[3], lineHeight: 20 },
  feedImage: { width: 260, height: 180, borderRadius: Radius.lg },
  feedStats: { marginTop: Space[3], paddingBottom: Space[3], borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  feedActions: { flexDirection: 'row', marginTop: Space[2] },
  feedActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6 },
  feedActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },

  // ── Suggested Friends ──
  friendsContainer: { paddingHorizontal: Space[4] },
  friendCard: {
    width: 100, backgroundColor: Colors.surface, borderRadius: Radius['2xl'],
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
    borderRadius: Radius['2xl'], paddingHorizontal: Space[4], paddingVertical: Space[2],
    ...Shadows.medium,
  },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Space[3] },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  listAvatar: { width: 46, height: 46, borderRadius: Radius.full },
  groupImage: { width: 46, height: 46, borderRadius: Radius.md },
  listText: { flex: 1, marginLeft: Space[3] },
  listName: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  followBtn: { backgroundColor: Colors.primary + '10', paddingHorizontal: Space[4], paddingVertical: 6, borderRadius: Radius.full },
  followBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  joinBtn: { backgroundColor: Colors.primary, paddingHorizontal: Space[4], paddingVertical: 6, borderRadius: Radius.full },
  joinBtnText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
});
