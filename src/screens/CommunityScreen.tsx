/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMMUNITY SCREEN (Q&A Feed)
 * ═══════════════════════════════════════════════════════════════
 *
 * Dedicated tab for community questions and answers.
 * Shows only posts of type 'question' with filtering options.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import { useNavigation } from '@react-navigation/native';
import type { HomeNavigationProp } from '../navigation/types';
import {
  getQuestions,
  togglePostLike,
  type FeedPost,
} from '../services/postApi';
import PostImages from '../components/PostImages';

export default function CommunityScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [questions, setQuestions] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likingPostIds, setLikingPostIds] = useState<Set<number>>(new Set());

  const fetchQuestions = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      const data = await getQuestions(10, pageNum);
      if (isRefresh || pageNum === 1) {
        setQuestions(data);
      } else {
        setQuestions(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 10);
    } catch {
      showToast('Failed to load questions', 'error');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadInitial();
    return () => { cancelled = true; };

    async function loadInitial(): Promise<void> {
      setLoading(true);
      await fetchQuestions(1, true);
      if (!cancelled) setLoading(false);
    }
  }, [fetchQuestions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchQuestions(1, true);
    setRefreshing(false);
  }, [fetchQuestions]);

  const onLoadMore = useCallback(() => {
    if (!hasMore || loading || refreshing) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchQuestions(nextPage, false);
  }, [hasMore, loading, refreshing, page, fetchQuestions]);

  const handleToggleLike = useCallback(async (postId: number) => {
    if (likingPostIds.has(postId)) return;
    setLikingPostIds(prev => new Set(prev).add(postId));

    const post = questions.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    setQuestions(prev => prev.map(p =>
      p.id === postId
        ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));

    try {
      const result = await togglePostLike(postId);
      setQuestions(prev => prev.map(p =>
        p.id === postId ? { ...p, is_liked: result.is_liked, likes_count: result.likes_count } : p
      ));
    } catch {
      showToast('Failed to update like', 'error');
      // Revert
      setQuestions(prev => prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: post.is_liked, likes_count: post.likes_count }
          : p
      ));
    } finally {
      setLikingPostIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }, [questions, likingPostIds]);

  const navigateToPostDetail = (postId: number) => {
    navigation.navigate('PostDetail', { postId: String(postId) });
  };



  const renderQuestion = ({ item: post }: { item: FeedPost }) => {
    const timeAgo = formatTimeAgo(post.created_at);
    const helpfulCount = post.helpful_marks_count ?? 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigateToPostDetail(post.id)}
        activeOpacity={0.85}
      >
        {/* Author */}
        <View style={styles.authorRow}>
          <Image
            source={{ uri: post.user.avatar ?? `https://i.pravatar.cc/150?u=${post.user.id}` }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="body" style={styles.authorName}>{post.user.name}</Typography>
              {post.user.is_expert && (
                <Icon name="check-decagram" size={14} color={Colors.primary} />
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="captionMuted">{timeAgo}</Typography>
              <View style={styles.questionBadge}>
                <Icon name="help-circle" size={10} color={Colors.white} />
                <Typography variant="caption" style={styles.questionBadgeText}>Question</Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Body */}
        <Typography variant="body" style={styles.body}>{post.body}</Typography>

        {/* Images */}
        {post.images.length > 0 && (
          <View style={{ marginBottom: Space[3] }}>
            <PostImages
              images={post.images}
              onImagePress={(idx) => navigation.navigate('ImageViewer', { images: post.images, initialIndex: idx })}
            />
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <Typography variant="captionMuted">
            {post.likes_count} likes · {post.comments_count} answers · {helpfulCount}/3 helpful
          </Typography>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleToggleLike(post.id)}
            activeOpacity={0.7}
            disabled={likingPostIds.has(post.id)}
          >
            <Icon
              name={post.is_liked ? 'thumb-up' : 'thumb-up-outline'}
              size={18}
              color={post.is_liked ? Colors.primary : Colors.gray500}
            />
            <Typography variant="caption" style={[styles.actionText, post.is_liked && { color: Colors.primary }]}>
              Like
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Icon name="comment-outline" size={18} color={Colors.gray500} />
            <Typography variant="caption" style={styles.actionText}>Answer</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Icon name="share-outline" size={18} color={Colors.gray500} />
            <Typography variant="caption" style={styles.actionText}>Share</Typography>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="displayHeading" style={styles.headerTitle}>Community</Typography>
        <Typography variant="captionMuted">Ask questions, get answers from experts</Typography>
      </View>

      <FlatList
        data={questions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderQuestion}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Space[4], paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="forum-outline" size={48} color={Colors.gray300} />
            <Typography variant="body" style={styles.emptyTitle}>No questions yet</Typography>
            <Typography variant="captionMuted" style={styles.emptySubtitle}>
              Be the first to ask the community!
            </Typography>
          </View>
        }
        ListFooterComponent={
          hasMore && questions.length > 0 ? (
            <ActivityIndicator style={{ marginVertical: 16 }} color={Colors.primary} />
          ) : null
        }
      />
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Space[4],
    paddingVertical: Space[4],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.gray900 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    marginBottom: Space[4],
    ...Shadows.medium,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3], marginBottom: Space[3] },
  avatar: { width: 44, height: 44, borderRadius: Radius.full },
  authorName: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  body: { fontSize: 14, color: Colors.gray700, lineHeight: 20, marginBottom: Space[3] },
  statsRow: { marginBottom: Space[3] },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Space[3],
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  questionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.warning,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.md,
  },
  questionBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Space[6],
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.gray700, marginTop: 16 },
  emptySubtitle: { textAlign: 'center', marginTop: 8 },
});
