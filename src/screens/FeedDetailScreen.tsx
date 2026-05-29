/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FEED DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full post detail with comments, likes, and share.
 * Instagram/Facebook-style feed detail page.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import ShareSheet from '../components/ShareSheet';
import type { HomeNavigationProp } from '../navigation/types';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';
import { useNavigation, useRoute } from '@react-navigation/native';

// ── Mock Comments ──
interface Comment {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  timeAgo: string;
  likes: number;
  liked: boolean;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { name: 'Sunita Chauhan', avatar: 'https://i.pravatar.cc/150?u=2' },
    text: 'Great tip! I sprayed Copper Oxychloride last week and it worked wonders. 🍎',
    timeAgo: '1h ago',
    likes: 12,
    liked: false,
  },
  {
    id: 'c2',
    user: { name: 'Ajay Thakur', avatar: 'https://i.pravatar.cc/150?u=3' },
    text: 'Which brand do you recommend for 200L tank?',
    timeAgo: '45m ago',
    likes: 5,
    liked: false,
  },
  {
    id: 'c3',
    user: { name: 'Priya Devi', avatar: 'https://i.pravatar.cc/150?u=4' },
    text: 'Same here in Mandi. Rain is coming tomorrow, applying today itself!',
    timeAgo: '30m ago',
    likes: 8,
    liked: true,
  },
  {
    id: 'c4',
    user: { name: 'Dr. Rajesh Sharma', avatar: 'https://i.pravatar.cc/150?u=6' },
    text: 'Remember to add sticker/spreader for better coverage during dormancy break.',
    timeAgo: '20m ago',
    likes: 24,
    liked: false,
  },
  {
    id: 'c5',
    user: { name: 'Mohan Verma', avatar: 'https://i.pravatar.cc/150?u=5' },
    text: 'Can we mix Mancozeb with Copper Oxychloride?',
    timeAgo: '10m ago',
    likes: 3,
    liked: false,
  },
];

// ── Mock Post Detail ──
const MOCK_POST = {
  id: 'p1',
  user: { name: 'Ramesh Negi', avatar: 'https://i.pravatar.cc/150?u=1', location: 'Kinnaur, HP' },
  timeAgo: '2h ago',
  text: 'Just sprayed Copper Oxychloride on all 250 trees before the rain. Preventive sprays during dormancy break are critical! 🍎\n\nPro tip: Always check weather forecast before spraying. 75% chance of rain starting Tuesday evening.',
  image: 'https://picsum.photos/seed/orchard2/400/250',
  likes: 34,
  comments: 8,
  shares: 3,
  liked: false,
};

export default function FeedDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const route = useRoute<RouteProp<HomeStackParamList, 'FeedDetail'>>();
  const { postId } = route.params;

  const [post, setPost] = useState(MOCK_POST);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [shareVisible, setShareVisible] = useState(false);

  const toggleLike = useCallback(() => {
    setPost((prev) => ({
      ...prev,
      liked: !prev.liked,
      likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
    }));
  }, []);

  const toggleCommentLike = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
      )
    );
  }, []);

  const submitComment = useCallback(() => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' },
      text: commentText.trim(),
      timeAgo: 'Just now',
      likes: 0,
      liked: false,
    };
    setComments((prev) => [newComment, ...prev]);
    setPost((prev) => ({ ...prev, comments: prev.comments + 1 }));
    setCommentText('');
    showToast('Comment posted', 'success');
  }, [commentText]);

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile', { userId: post.user.name });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Typography variant="body" style={styles.headerTitle}>Post</Typography>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Icon name="dots-horizontal" size={24} color={Colors.gray800} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <View style={styles.flex1}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Post Header */}
          <View style={styles.postCard}>
            <TouchableOpacity onPress={navigateToUserProfile} activeOpacity={0.7}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
                <View style={styles.postHeaderText}>
                  <Typography variant="body" style={styles.postAuthor}>{post.user.name}</Typography>
                  <Typography variant="captionMuted">{post.user.location} · {post.timeAgo}</Typography>
                </View>
              </View>
            </TouchableOpacity>

            <Typography variant="body" style={styles.postText}>{post.text}</Typography>
            {post.image && <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />}

            {/* Stats */}
            <View style={styles.statsRow}>
              <Typography variant="captionMuted">{post.likes} likes · {post.comments} comments · {post.shares} shares</Typography>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={toggleLike} activeOpacity={0.7}>
                <Icon name={post.liked ? 'thumb-up' : 'thumb-up-outline'} size={22} color={post.liked ? Colors.primary : Colors.gray500} />
                <Typography variant="caption" style={[styles.actionText, post.liked && { color: Colors.primary }]}>Like</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Icon name="comment-outline" size={22} color={Colors.gray500} />
                <Typography variant="caption" style={styles.actionText}>Comment</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShareVisible(true)} activeOpacity={0.7}>
                <Icon name="share-outline" size={22} color={Colors.gray500} />
                <Typography variant="caption" style={styles.actionText}>Share</Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Typography variant="body" style={styles.commentsTitle}>Comments</Typography>
              <Typography variant="hindiBody" style={styles.commentsTitleHi}>टिप्पणियाँ</Typography>
            </View>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: comment.user.name })} activeOpacity={0.7}>
                  <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                </TouchableOpacity>
                <View style={styles.commentBody}>
                  <View style={styles.commentBubble}>
                    <Typography variant="bodySmall" style={styles.commentAuthor}>{comment.user.name}</Typography>
                    <Typography variant="body" style={styles.commentText}>{comment.text}</Typography>
                  </View>
                  <View style={styles.commentMeta}>
                    <Typography variant="captionMuted" style={styles.commentTime}>{comment.timeAgo}</Typography>
                    <TouchableOpacity onPress={() => toggleCommentLike(comment.id)} activeOpacity={0.7}>
                      <Typography variant="caption" style={[styles.commentLike, comment.liked && { color: Colors.primary }]}>
                        Like{comment.likes > 0 ? ` · ${comment.likes}` : ''}
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Typography variant="caption" style={styles.commentReply}>Reply</Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Comment Input — fixed at bottom */}
      <View style={styles.inputBar}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.inputAvatar} />
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor={Colors.gray400}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity onPress={submitComment} activeOpacity={0.7} disabled={!commentText.trim()}>
          <Icon name="send" size={24} color={commentText.trim() ? Colors.primary : Colors.gray300} />
        </TouchableOpacity>
      </View>

      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title={post.user.name + "'s Post"}
        message={post.text}
        url={`https://baagvaani.com/post/${postId}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
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
  postCard: {
    backgroundColor: Colors.surface,
    padding: Space[4],
    marginBottom: Space[3],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  postHeaderText: {
    flex: 1,
  },
  postAuthor: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.gray900,
  },
  postText: {
    fontSize: 14,
    color: Colors.gray700,
    marginTop: Space[3],
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: Radius.lg,
    marginTop: Space[3],
  },
  statsRow: {
    marginTop: Space[3],
    paddingBottom: Space[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: Space[2],
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 13,
    color: Colors.gray500,
    fontWeight: '500',
  },
  commentsSection: {
    backgroundColor: Colors.surface,
    padding: Space[4],
  },
  commentsHeader: {
    marginBottom: Space[4],
  },
  commentsTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  commentsTitleHi: {
    color: Colors.gray400,
  },
  commentRow: {
    flexDirection: 'row',
    gap: Space[3],
    marginBottom: Space[4],
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  commentBody: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    padding: Space[3],
  },
  commentAuthor: {
    fontWeight: '700',
    color: Colors.gray800,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    marginTop: Space[1],
    paddingLeft: Space[1],
  },
  commentTime: {
    fontSize: 11,
  },
  commentLike: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray500,
  },
  commentReply: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray500,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    paddingHorizontal: Space[4],
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    paddingHorizontal: Space[4],
    paddingVertical: 8,
  },
  input: {
    fontSize: 14,
    color: Colors.gray900,
    maxHeight: 80,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
