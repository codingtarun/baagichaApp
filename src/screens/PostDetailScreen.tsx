/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — POST DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shows full post with comments, likes, and reply functionality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import type { HomeNavigationProp } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import {
  getPost,
  getComments,
  addComment,
  addReply,
  togglePostLike,
  toggleCommentLike,
  markHelpful,
  unmarkHelpful,
  type FeedPost,
  type FeedComment,
} from '../services/postApi';

export default function PostDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'PostDetail'>>();
  const { postId } = route.params;
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 70; // Custom tab bar height (bar + padding + FAB overlap)

  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<FeedComment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const [likingCommentIds, setLikingCommentIds] = useState<Set<number>>(new Set());
  const [markingHelpfulIds, setMarkingHelpfulIds] = useState<Set<number>>(new Set());
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    let cancelled = false;
    loadData();
    return () => { cancelled = true; };

    async function loadData(): Promise<void> {
      setLoading(true);
      try {
        const [postData, commentsData] = await Promise.all([
          getPost(Number(postId)),
          getComments(Number(postId)),
        ]);
        if (!cancelled) {
          setPost(postData);
          setComments(commentsData);
        }
      } catch {
        if (!cancelled) showToast('Failed to load post', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
  }, [postId]);

  const handleLike = useCallback(async () => {
    if (!post || likingPost) return;
    setLikingPost(true);
    try {
      const result = await togglePostLike(post.id);
      setPost({ ...post, is_liked: result.is_liked, likes_count: result.likes_count });
    } catch {
      showToast('Failed to like post', 'error');
    } finally {
      setLikingPost(false);
    }
  }, [post, likingPost]);

  const handleCommentLike = useCallback(async (comment: FeedComment) => {
    if (likingCommentIds.has(comment.id)) return;
    setLikingCommentIds(prev => new Set(prev).add(comment.id));
    try {
      const result = await toggleCommentLike(comment.id);
      setComments(prev => prev.map(c =>
        c.id === comment.id ? { ...c, likes_count: result.likes_count } : c
      ));
    } catch {
      showToast('Failed to like comment', 'error');
    } finally {
      setLikingCommentIds(prev => {
        const next = new Set(prev);
        next.delete(comment.id);
        return next;
      });
    }
  }, [likingCommentIds]);

  const isAsker = currentUser?.id === post?.user.id;
  const isQuestion = post?.type === 'question';
  const helpfulCount = post?.helpful_marks_count ?? 0;
  const maxHelpfulReached = helpfulCount >= 3;

  const handleMarkHelpful = useCallback(async (comment: FeedComment) => {
    if (!post || markingHelpfulIds.has(comment.id)) return;
    if (!isAsker || !isQuestion) {
      showToast('Only the question asker can mark answers as helpful', 'error');
      return;
    }
    if (maxHelpfulReached && !comment.is_helpful) {
      showToast('Maximum 3 helpful marks allowed per question', 'error');
      return;
    }

    setMarkingHelpfulIds(prev => new Set(prev).add(comment.id));
    try {
      if (comment.is_helpful) {
        const result = await unmarkHelpful(post.id, comment.id);
        setComments(prev => prev.map(c =>
          c.id === comment.id ? { ...c, is_helpful: false, helpful_count: result.helpful_count } : c
        ));
        setPost({ ...post, helpful_marks_count: result.post_helpful_count });
      } else {
        const result = await markHelpful(post.id, comment.id);
        setComments(prev => prev.map(c =>
          c.id === comment.id ? { ...c, is_helpful: true, helpful_count: result.helpful_count } : c
        ));
        setPost({ ...post, helpful_marks_count: result.post_helpful_count });
        if (result.asker_awarded) {
          showToast('You earned 5 points for marking a helpful answer!', 'success');
        }
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to mark helpful';
      showToast(msg, 'error');
    } finally {
      setMarkingHelpfulIds(prev => {
        const next = new Set(prev);
        next.delete(comment.id);
        return next;
      });
    }
  }, [post, isAsker, isQuestion, maxHelpfulReached, markingHelpfulIds]);

  const handleSubmitComment = useCallback(async () => {
    if (!commentText.trim() || !post) return;
    setSubmitting(true);
    try {
      if (replyingTo) {
        const newReply = await addReply(replyingTo.id, commentText.trim());
        setComments(prev => prev.map(c =>
          c.id === replyingTo.id
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c
        ));
        setReplyingTo(null);
      } else {
        const newComment = await addComment(post.id, commentText.trim());
        setComments(prev => [newComment, ...prev]);
        setPost({ ...post, comments_count: post.comments_count + 1 });
      }
      setCommentText('');
    } catch {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [commentText, post, replyingTo]);

  const navigateToUser = (userId: number) => {
    navigation.navigate('UserProfile', { userId: String(userId) });
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const timeAgo = formatTimeAgo(post.created_at);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Post</Typography>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Post Content */}
            <View style={styles.postCard}>
              {/* Author */}
              <TouchableOpacity
                style={styles.authorRow}
                onPress={() => navigateToUser(post.user.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: post.user.avatar ?? `https://i.pravatar.cc/150?u=${post.user.id}` }}
                  style={styles.authorAvatar}
                />
                <View style={styles.authorInfo}>
                  <Typography variant="body" style={styles.authorName}>{post.user.name}</Typography>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Typography variant="captionMuted">{timeAgo}</Typography>
                    {isQuestion && (
                      <View style={styles.questionBadge}>
                        <Icon name="help-circle" size={10} color={Colors.white} />
                        <Typography variant="caption" style={styles.questionBadgeText}>Question</Typography>
                      </View>
                    )}
                  </View>
                </View>
                {post.user.is_expert && (
                  <Icon name="check-decagram" size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>

              {/* Body */}
              <Typography variant="body" style={styles.postBody}>{post.body}</Typography>

              {/* Images */}
              {post.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imagesContainer}
                >
                  {post.images.map(img => (
                    <Image key={img.id} source={{ uri: img.medium }} style={styles.postImage} resizeMode="cover" />
                  ))}
                </ScrollView>
              )}

              {/* Stats */}
              <Typography variant="captionMuted" style={styles.statsText}>
                {post.likes_count} likes · {post.comments_count} comments · {post.shares_count} shares
                {isQuestion && (
                  <Typography variant="captionMuted"> · {helpfulCount}/3 helpful</Typography>
                )}
              </Typography>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
                  <Icon name={post.is_liked ? 'thumb-up' : 'thumb-up-outline'} size={20} color={post.is_liked ? Colors.primary : Colors.gray500} />
                  <Typography variant="caption" style={[styles.actionText, post.is_liked && { color: Colors.primary }]}>Like</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Icon name="comment-outline" size={20} color={Colors.gray500} />
                  <Typography variant="caption" style={styles.actionText}>Comment</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Icon name="share-outline" size={20} color={Colors.gray500} />
                  <Typography variant="caption" style={styles.actionText}>Share</Typography>
                </TouchableOpacity>
              </View>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Typography variant="body" style={styles.commentsTitle}>Comments</Typography>
              {comments.length === 0 ? (
                <Typography variant="captionMuted" style={{ textAlign: 'center', paddingVertical: 24 }}>
                  No comments yet. Be the first!
                </Typography>
              ) : (
                comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={(c) => { setReplyingTo(c); setCommentText(''); }}
                    onLike={handleCommentLike}
                    onMarkHelpful={handleMarkHelpful}
                    showHelpful={isQuestion}
                    isAsker={isAsker}
                    maxHelpfulReached={maxHelpfulReached}
                    markingHelpful={markingHelpfulIds.has(comment.id)}
                    onUserPress={(userId) => navigateToUser(userId)}
                  />
                ))
              )}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Comment Input */}
          <View style={[styles.inputBar, { paddingBottom: insets.bottom + Space[3] + TAB_BAR_HEIGHT }]}>
            {replyingTo && (
              <View style={styles.replyBanner}>
                <Typography variant="caption" style={{ flex: 1 }}>
                  Replying to {replyingTo.user.name}
                </Typography>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Icon name="close" size={16} color={Colors.gray500} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
                placeholderTextColor={Colors.gray400}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!commentText.trim() || submitting) && styles.sendBtnDisabled]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
                activeOpacity={0.7}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Icon name="send" size={18} color={Colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CommentItem({ comment, onReply, onLike, onMarkHelpful, showHelpful, isAsker, maxHelpfulReached, markingHelpful, onUserPress }: {
  comment: FeedComment;
  onReply: (c: FeedComment) => void;
  onLike: (c: FeedComment) => void;
  onMarkHelpful?: (c: FeedComment) => void;
  showHelpful?: boolean;
  isAsker?: boolean;
  maxHelpfulReached?: boolean;
  markingHelpful?: boolean;
  onUserPress: (userId: number) => void;
}) {
  return (
    <View style={[styles.commentCard, comment.is_helpful && styles.helpfulCommentCard]}>
      <TouchableOpacity onPress={() => onUserPress(comment.user.id)} activeOpacity={0.7} style={styles.commentAuthorRow}>
        <Image source={{ uri: comment.user.avatar ?? `https://i.pravatar.cc/150?u=${comment.user.id}` }} style={styles.commentAvatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Typography variant="bodySmall" style={styles.commentName}>{comment.user.name}</Typography>
            {comment.user.experience_level && comment.user.experience_level !== 'beginner' && (
              <View style={[styles.experienceBadge, comment.user.experience_level === 'expert' && styles.expertBadge]}>
                <Typography variant="caption" style={styles.experienceBadgeText}>
                  {comment.user.experience_level === 'expert' ? 'Expert' : 'Intermediate'}
                </Typography>
              </View>
            )}
          </View>
          <Typography variant="captionMuted">{formatTimeAgo(comment.created_at)}</Typography>
        </View>
      </TouchableOpacity>
      <Typography variant="body" style={styles.commentBody}>{comment.body}</Typography>
      <View style={styles.commentActions}>
        <TouchableOpacity onPress={() => onLike(comment)} activeOpacity={0.7} style={styles.commentAction}>
          <Icon name="thumb-up-outline" size={14} color={Colors.gray500} />
          <Typography variant="captionMuted">{comment.likes_count}</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReply(comment)} activeOpacity={0.7} style={styles.commentAction}>
          <Icon name="reply-outline" size={14} color={Colors.gray500} />
          <Typography variant="captionMuted">Reply</Typography>
        </TouchableOpacity>
        {showHelpful && onMarkHelpful && (
          <TouchableOpacity
            onPress={() => onMarkHelpful(comment)}
            activeOpacity={0.7}
            style={[
              styles.commentAction,
              styles.helpfulBtn,
              comment.is_helpful && styles.helpfulBtnActive,
              (!isAsker || (maxHelpfulReached && !comment.is_helpful)) && styles.helpfulBtnDisabled,
            ]}
            disabled={!isAsker || markingHelpful || (maxHelpfulReached && !comment.is_helpful)}
          >
            {markingHelpful ? (
              <ActivityIndicator size="small" color={comment.is_helpful ? Colors.white : Colors.primary} />
            ) : (
              <>
                <Icon name={comment.is_helpful ? 'check-circle' : 'check-circle-outline'} size={14} color={comment.is_helpful ? Colors.white : Colors.primary} />
                <Typography variant="caption" style={[styles.helpfulBtnText, comment.is_helpful && styles.helpfulBtnTextActive]}>
                  {comment.is_helpful ? 'Helpful' : 'Find this helpful'}
                </Typography>
                {comment.helpful_count > 0 && (
                  <Typography variant="caption" style={[styles.helpfulCount, comment.is_helpful && styles.helpfulBtnTextActive]}>
                    ({comment.helpful_count})
                  </Typography>
                )}
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => (
            <View key={reply.id} style={styles.replyCard}>
              <TouchableOpacity onPress={() => onUserPress(reply.user.id)} activeOpacity={0.7} style={styles.commentAuthorRow}>
                <Image source={{ uri: reply.user.avatar ?? `https://i.pravatar.cc/150?u=${reply.user.id}` }} style={styles.replyAvatar} />
                <View style={{ flex: 1 }}>
                  <Typography variant="bodySmall" style={styles.commentName}>{reply.user.name}</Typography>
                  <Typography variant="captionMuted">{formatTimeAgo(reply.created_at)}</Typography>
                </View>
              </TouchableOpacity>
              <Typography variant="body" style={styles.commentBody}>{reply.body}</Typography>
            </View>
          ))}
        </View>
      )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100, backgroundColor: Colors.surface,
  },
  headerBtn: { padding: 4, width: 40, alignItems: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16 },
  postCard: {
    backgroundColor: Colors.surface, marginHorizontal: Space[4], marginTop: Space[4],
    borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: Space[3], marginBottom: Space[3] },
  authorAvatar: { width: 44, height: 44, borderRadius: Radius.full },
  authorInfo: { flex: 1 },
  authorName: { fontWeight: '700', fontSize: 14, color: Colors.gray900 },
  postBody: { fontSize: 14, color: Colors.gray700, lineHeight: 20, marginBottom: Space[3] },
  imagesContainer: { gap: Space[2], marginBottom: Space[3] },
  postImage: { width: 260, height: 180, borderRadius: Radius.lg },
  statsText: { marginBottom: Space[3] },
  actionsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Space[3] },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  actionText: { fontSize: 12, color: Colors.gray500, fontWeight: '500' },
  commentsSection: { marginTop: Space[4], paddingHorizontal: Space[4] },
  commentsTitle: { fontWeight: '800', fontSize: 16, marginBottom: Space[3] },
  commentCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Space[4], marginBottom: Space[3], ...Shadows.medium,
  },
  commentAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: Space[2], marginBottom: Space[2] },
  commentAvatar: { width: 32, height: 32, borderRadius: Radius.full },
  commentName: { fontWeight: '700', color: Colors.gray800 },
  commentBody: { fontSize: 14, color: Colors.gray700, lineHeight: 20, marginBottom: Space[2] },
  commentActions: { flexDirection: 'row', gap: Space[4] },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  repliesContainer: { marginTop: Space[3], paddingLeft: Space[4], borderLeftWidth: 2, borderLeftColor: Colors.gray200 },
  replyCard: { marginTop: Space[3] },
  replyAvatar: { width: 24, height: 24, borderRadius: Radius.full },
  inputBar: {
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.gray200,
    paddingHorizontal: Space[4], paddingBottom: Space[4], paddingTop: Space[2],
  },
  replyBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary + '10',
    paddingHorizontal: Space[3], paddingVertical: 6, borderRadius: Radius.md, marginBottom: Space[2],
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  input: {
    flex: 1, backgroundColor: Colors.background, borderRadius: Radius.xl,
    paddingHorizontal: Space[4], paddingVertical: 10,
    fontSize: 14, color: Colors.gray900, maxHeight: 80,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  questionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: Colors.warning ?? '#F59E0B',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.md,
  },
  questionBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  helpfulCommentCard: { borderWidth: 1, borderColor: Colors.primary + '40' },
  helpfulBtn: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.md,
  },
  helpfulBtnActive: { backgroundColor: Colors.primary },
  helpfulBtnDisabled: { opacity: 0.4 },
  helpfulBtnText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  helpfulBtnTextActive: { color: Colors.white },
  helpfulCount: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  experienceBadge: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: Radius.sm,
  },
  expertBadge: { backgroundColor: Colors.primary + '18' },
  experienceBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.gray600 },
});
