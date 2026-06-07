/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMMUNITY SEGMENT (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Full social feed with all original Home screen features:
 *   · Post composer (templates, image picker, camera, Ask Community)
 *   · Community Questions
 *   · Activity Feed (like, comment, share)
 *   · Suggested Friends
 *   · People to Follow
 *   · Groups to Join
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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { Colors } from '../../theme/colors';
import { Space, Radius, Shadows } from '../../theme/style';
import { Typography } from '../../typography';
import { showToast } from '../../store/toastStore';
import type { HomeNavigationProp } from '../../navigation/types';
import ShareSheet from '../../components/ShareSheet';
import PostImages from '../../components/PostImages';
import ReportComposerSheet from '../../components/ReportComposerSheet';
import { getSuggestedUsers, type SuggestedUser } from '../../services/userApi';
import { getFeed, getQuestions, createPost, togglePostLike, sharePost, type FeedPost } from '../../services/postApi';
import { getGroups, joinGroup, type GroupCard } from '../../services/groupApi';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const POST_TEMPLATES = [
  { id: 'spray', icon: 'spray', label: 'Spraying', text: 'I am spraying today on my orchard. Preventive care during this season is crucial! 🍎🚿' },
  { id: 'weather', icon: 'weather-rainy', label: 'Weather', text: 'Weather alert for my area: Stay prepared and stay safe! 🌧️' },
  { id: 'mandi', icon: 'chart-line', label: 'Mandi Price', text: 'Mandi price update: What prices are you getting in your area? 💰' },
  { id: 'work', icon: 'hammer-wrench', label: 'Orchard Work', text: 'Working hard in the orchard today! 🌳💪' },
  { id: 'report', icon: 'alert-circle', label: 'Report', text: '' },
];

const TAB_BAR_HEIGHT = 70;

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function CommunitySegment(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ uri: string; type: string; name: string }[]>([]);
  const [posting, setPosting] = useState(false);
  const [isAskCommunity, setIsAskCommunity] = useState(false);
  const [likingPostIds, setLikingPostIds] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<FeedPost[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [expertUsers, setExpertUsers] = useState<SuggestedUser[]>([]);
  const [friendUsers, setFriendUsers] = useState<SuggestedUser[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [suggestedGroups, setSuggestedGroups] = useState<GroupCard[]>([]);
  const [reportSheetVisible, setReportSheetVisible] = useState(false);

  // Fetch feed + experts + friends + groups + questions on mount
  useEffect(() => {
    let cancelled = false;

    getFeed(10, 1)
      .then((feed) => { if (!cancelled) setPosts(feed); })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Community] Feed fetch failed:', err.response?.data ?? err.message);
          setPosts([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingFeed(false); });

    getSuggestedUsers('experts', 8)
      .then((users) => { if (!cancelled) setExpertUsers(users); })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Community] Experts fetch failed:', err.response?.data ?? err.message);
          setExpertUsers([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingExperts(false); });

    getSuggestedUsers('friends', 6)
      .then((users) => { if (!cancelled) setFriendUsers(users); })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Community] Friends fetch failed:', err.response?.data ?? err.message);
          setFriendUsers([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingFriends(false); });

    getGroups({ visibility: 'public', sort: 'popular', per_page: 10 })
      .then((groups) => {
        if (!cancelled) {
          const filtered = groups.filter(g => !g.is_member).slice(0, 5);
          setSuggestedGroups(filtered);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Community] Groups fetch failed:', err.response?.data ?? err.message);
          setSuggestedGroups([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingGroups(false); });

    getQuestions(5, 1)
      .then((data) => { if (!cancelled) setQuestions(data); })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Community] Questions fetch failed:', err.response?.data ?? err.message);
          setQuestions([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingQuestions(false); });

    return () => { cancelled = true; };
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      getFeed(10, 1),
      getQuestions(5, 1),
    ])
      .then(([feed, qs]) => {
        setPosts(feed);
        setQuestions(qs);
        showToast('Refreshed', 'success');
      })
      .catch((err) => { console.error('[Community] Refresh failed:', err); showToast('Refresh failed', 'error'); })
      .finally(() => setRefreshing(false));
  }, []);

  const toggleLike = async (postId: number) => {
    if (likingPostIds.has(postId)) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setLikingPostIds(prev => new Set(prev).add(postId));
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
    ));
    try {
      const result = await togglePostLike(postId);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: result.is_liked, likes_count: result.likes_count } : p
      ));
    } catch {
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: post.is_liked, likes_count: post.likes_count } : p
      ));
      showToast('Failed to like post', 'error');
    } finally {
      setLikingPostIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const handlePost = async () => {
    if (!postText.trim() && selectedImages.length === 0) return;
    setPosting(true);
    try {
      const newPost = await createPost({
        body: postText.trim(),
        type: isAskCommunity ? 'question' : 'status',
        visibility: 'public',
        images: selectedImages.length > 0 ? selectedImages : undefined,
      });
      setPosts(prev => [newPost, ...prev]);
      setPostText('');
      setSelectedImages([]);
      setIsAskCommunity(false);
      showToast('Post shared!', 'success');
    } catch (err: any) {
      console.error('[Community] Post failed:', err.response?.data ?? err.message);
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

  const applyTemplate = (template: typeof POST_TEMPLATES[0]) => {
    if (template.id === 'report') {
      setReportSheetVisible(true);
      return;
    }
    setPostText(template.text);
    showToast('Template added — edit & post!', 'success');
  };

  const handleReportSubmitted = (post: FeedPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ── Post Composer ── */}
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
          <InputAction
            icon={isAskCommunity ? 'help-circle' : 'help-circle-outline'}
            label="Ask Community"
            color={isAskCommunity ? Colors.warning : Colors.gray500}
            onPress={() => setIsAskCommunity(prev => !prev)}
            selected={isAskCommunity}
          />
        </View>
        <TouchableOpacity
          style={[styles.postBtn, ((!postText.trim() && selectedImages.length === 0) || posting) ? styles.postBtnDisabled : null]}
          onPress={handlePost}
          activeOpacity={0.8}
          disabled={(!postText.trim() && selectedImages.length === 0) || posting}
        >
          <Typography variant="caption" style={styles.postBtnText}>{posting ? 'Posting...' : 'Post'}</Typography>
        </TouchableOpacity>
        <ReportComposerSheet
          visible={reportSheetVisible}
          onClose={() => setReportSheetVisible(false)}
          onReportSubmitted={handleReportSubmitted}
        />
      </View>

      {/* ── Community Questions ── */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWrap}>
          <Icon name="forum" size={18} color={Colors.primary} />
          <Typography variant="body" style={styles.sectionTitle}>Community Questions</Typography>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Community' as any)}>
          <Typography variant="caption" style={styles.seeAll}>See all</Typography>
        </TouchableOpacity>
      </View>
      {loadingQuestions ? (
        <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>Loading questions...</Typography>
      ) : questions.length === 0 ? (
        <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>No questions yet. Be the first to ask!</Typography>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.questionsContainer}>
          {questions.map((q) => (
            <TouchableOpacity
              key={q.id}
              style={styles.questionCard}
              onPress={() => navigation.navigate('PostDetail', { postId: String(q.id) })}
              activeOpacity={0.85}
            >
              <View style={styles.questionBadgeSmall}>
                <Icon name="help-circle" size={10} color={Colors.white} />
                <Typography variant="caption" style={styles.questionBadgeSmallText}>Question</Typography>
              </View>
              <Typography variant="body" style={styles.questionBody} numberOfLines={3}>{q.body}</Typography>
              <View style={styles.questionFooter}>
                <Image source={{ uri: q.user.avatar ?? `https://i.pravatar.cc/150?u=${q.user.id}` }} style={styles.questionAvatar} />
                <Typography variant="captionMuted" style={{ flex: 1 }}>{q.user.name}</Typography>
                <Typography variant="captionMuted">{q.comments_count} answers</Typography>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* ── Activity Feed ── */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWrap}>
          <Icon name="newspaper-variant" size={18} color={Colors.primary} />
          <Typography variant="body" style={styles.sectionTitle}>Activity Feed</Typography>
        </View>
      </View>
      {loadingFeed ? (
        <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>Loading feed...</Typography>
      ) : posts.length === 0 ? (
        <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>No posts yet. Share your first update!</Typography>
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
          <Typography variant="captionMuted" style={{ paddingVertical: 20, width: 200, textAlign: 'center' }}>Loading...</Typography>
        ) : friendUsers.length === 0 ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 20, width: 200, textAlign: 'center' }}>No suggestions</Typography>
        ) : (
          friendUsers.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={styles.friendCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('UserProfile', { userId: String(friend.id) })}
            >
              <Image source={{ uri: friend.avatar ?? `https://i.pravatar.cc/150?u=${friend.id}` }} style={styles.friendAvatar} />
              <Typography variant="caption" style={styles.friendName} numberOfLines={1}>{friend.name}</Typography>
              <Typography variant="captionMuted" style={{ fontSize: 10 }}>{friend.location?.district ?? 'Farmer'}</Typography>
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
          <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>Loading...</Typography>
        ) : expertUsers.length === 0 ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>No suggestions right now</Typography>
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
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('GroupList' as any)}>
          <Typography variant="caption" style={styles.seeAll}>See All</Typography>
        </TouchableOpacity>
      </View>
      <View style={[styles.listCard, { marginBottom: Space[6] + TAB_BAR_HEIGHT }]}>
        {loadingGroups ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>Loading groups...</Typography>
        ) : suggestedGroups.length === 0 ? (
          <Typography variant="captionMuted" style={{ paddingVertical: 20, textAlign: 'center' }}>No groups to join right now</Typography>
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
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function InputAction({ icon, label, color, onPress, selected }: { icon: string; label: string; color: string; onPress?: () => void; selected?: boolean }) {
  return (
    <TouchableOpacity style={[styles.inputActionBtn, selected ? styles.inputActionBtnSelected : undefined]} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={18} color={color} />
      <Typography variant="caption" style={[styles.inputActionText, selected && { color, fontWeight: '700' }]}>{label}</Typography>
    </TouchableOpacity>
  );
}

function urgencyColor(level: string): string {
  switch (level) {
    case 'critical': return Colors.danger;
    case 'high': return Colors.sevHigh;
    case 'medium': return Colors.warning;
    case 'low': return Colors.success;
    default: return Colors.gray500;
  }
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
      // Silently fail
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Typography variant="captionMuted">{timeAgo}</Typography>
                {post.type === 'question' && (
                  <View style={styles.questionBadge}>
                    <Icon name="help-circle" size={10} color={Colors.white} />
                    <Typography variant="caption" style={styles.questionBadgeText}>Question</Typography>
                  </View>
                )}
                {post.type === 'report' && post.report_type && (
                  <View style={[styles.reportBadge, { backgroundColor: urgencyColor(post.report_type.urgency_level) }]}>
                    <Icon name={post.report_type.icon ?? 'alert'} size={10} color={Colors.white} />
                    <Typography variant="caption" style={styles.reportBadgeText}>{post.report_type.name_en}</Typography>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feedMore} activeOpacity={0.7}>
            <Icon name="dots-horizontal" size={18} color={Colors.gray500} />
          </TouchableOpacity>
        </View>

        {/* Report-specific info */}
        {post.type === 'report' && post.report_type && (
          <View style={styles.reportInfoRow}>
            <View style={[styles.reportUrgencyStrip, { backgroundColor: urgencyColor(post.report_type.urgency_level) }]} />
            <View style={styles.reportInfoContent}>
              <View style={styles.reportMetaRow}>
                <Typography variant="caption" style={[styles.reportMetaText, { color: urgencyColor(post.report_type.urgency_level) }]}>
                  {post.report_type.name_en} {post.report_type.name_hi ? `(${post.report_type.name_hi})` : ''}
                </Typography>
                {post.distance_km !== undefined && (
                  <Typography variant="captionMuted">{post.distance_km.toFixed(1)} km away</Typography>
                )}
              </View>
              {post.weather_snapshot && (
                <Typography variant="captionMuted">
                  🌡️ {post.weather_snapshot.temp_c}°C · {post.weather_snapshot.condition}
                </Typography>
              )}
              {post.report_meta?.disease_name && (
                <TouchableOpacity
                  onPress={() => {
                    if (post.report_meta?.disease_slug) {
                      navigation.navigate('DiseaseDetail' as any, { slug: post.report_meta.disease_slug });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Typography variant="caption" style={styles.diseaseLink}>
                    🦠 {post.report_meta.disease_name} — Tap for info
                  </Typography>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <Typography variant="body" style={styles.feedText}>{post.body}</Typography>
        <PostImages
          images={post.images}
          onImagePress={(index) => navigation.navigate('ImageViewer', { images: post.images, initialIndex: index })}
        />
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
      console.error('[Community] Join failed:', err.response?.data ?? err.message);
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
  scrollContent: { paddingTop: 8, paddingBottom: 120 },

  // ── Section Headers ──
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], marginTop: Space[6], marginBottom: Space[3],
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  sectionTitle: { fontWeight: '800', color: Colors.gray900, fontSize: 16, letterSpacing: -0.3 },
  seeAll: { color: Colors.primary, fontWeight: '700', fontSize: 13 },

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
  inputActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Space[2], paddingVertical: 4, borderRadius: Radius.md },
  inputActionBtnSelected: { backgroundColor: Colors.warning + '15' },
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

  // ── Community Questions ──
  questionsContainer: { paddingHorizontal: Space[4], gap: Space[3] },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    marginRight: Space[3],
    width: 260,
    borderWidth: 1,
    borderColor: Colors.warning + '20',
    ...Shadows.medium,
  },
  questionBadgeSmall: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.warning,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.md,
    alignSelf: 'flex-start',
    marginBottom: Space[2],
  },
  questionBadgeSmallText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  questionBody: { fontSize: 13, color: Colors.gray800, lineHeight: 18, marginBottom: Space[3] },
  questionFooter: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  questionAvatar: { width: 20, height: 20, borderRadius: Radius.full },

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
  feedText: { fontSize: 14, color: Colors.gray700, marginTop: Space[3], lineHeight: 20 },
  feedStats: { marginTop: Space[3], paddingBottom: Space[3], borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  feedActions: { flexDirection: 'row', marginTop: Space[2] },
  feedActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6 },
  feedActionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  questionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.warning,
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: Radius.sm,
  },
  questionBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.white },
  reportBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: Radius.sm,
  },
  reportBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.white },
  reportInfoRow: {
    flexDirection: 'row',
    marginTop: Space[2],
    backgroundColor: Colors.gray50,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  reportUrgencyStrip: {
    width: 4,
  },
  reportInfoContent: {
    flex: 1,
    padding: Space[3],
    gap: Space[1],
  },
  reportMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportMetaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  diseaseLink: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 2,
  },

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
