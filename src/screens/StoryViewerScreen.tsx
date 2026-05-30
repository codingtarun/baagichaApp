/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STORY VIEWER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Instagram-style full-screen story viewer.
 * - Horizontal swipe between users
 * - Tap right/left to advance/go back
 * - Long press to pause
 * - Progress bars at top
 * - Auto-advance after duration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';

import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import { Typography } from '../typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';
import { markStoryViewed, getStoryViewers, type StoryGroup, type StoryItem, type StoryViewer } from '../services/storyApi';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;
const STORY_DURATION = 5000; // 5s for images/text
const PROGRESS_HEIGHT = 2;

type StoryViewerRouteProp = RouteProp<HomeStackParamList, 'StoryViewer'>;

export default function StoryViewerScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<StoryViewerRouteProp>();
  const { groups, initialGroupIndex } = route.params;
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewerModalVisible, setViewerModalVisible] = useState(false);
  const [viewers, setViewers] = useState<StoryViewer[]>([]);
  const [loadingViewers, setLoadingViewers] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const currentGroup = groups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];
  const isOwnStory = currentGroup?.user.id === undefined; // determined by caller

  const storyDuration = currentStory?.type === 'video' ? STORY_DURATION * 2 : STORY_DURATION;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    clearTimer();
    progressAnim.setValue(0);
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      if (paused) return;
      elapsedRef.current = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsedRef.current / storyDuration, 1);
      progressAnim.setValue(pct);
      setProgress(pct);

      if (pct >= 1) {
        clearTimer();
        // Advance to next
        if (storyIndex < (currentGroup?.stories.length ?? 1) - 1) {
          setStoryIndex(prev => prev + 1);
        } else if (groupIndex < groups.length - 1) {
          setGroupIndex(prev => prev + 1);
          setStoryIndex(0);
        } else {
          navigation.goBack();
        }
      }
    }, 50);
  }, [storyDuration, paused, storyIndex, currentGroup, groupIndex, groups.length, navigation, clearTimer, progressAnim]);

  useEffect(() => {
    startProgress();
    // Mark as viewed
    if (currentStory && !currentStory.is_viewed) {
      markStoryViewed(currentStory.id).catch(() => {});
    }
    return () => clearTimer();
  }, [currentStory?.id]);

  const goNext = useCallback(() => {
    if (storyIndex < (currentGroup?.stories.length ?? 1) - 1) {
      setStoryIndex(prev => prev + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex(prev => prev + 1);
      setStoryIndex(0);
    } else {
      navigation.goBack();
    }
  }, [storyIndex, currentGroup, groupIndex, groups.length, navigation]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex(prev => prev - 1);
    } else if (groupIndex > 0) {
      setGroupIndex(prev => prev - 1);
      setStoryIndex((groups[groupIndex - 1]?.stories.length ?? 1) - 1);
    }
  }, [storyIndex, groupIndex, groups]);

  const handleTap = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x > SCREEN_W * 0.65) {
      goNext();
    } else if (x < SCREEN_W * 0.35) {
      goPrev();
    }
  };

  const handleLongPress = (pressing: boolean) => {
    setPaused(pressing);
  };

  const openViewers = async () => {
    if (!currentStory) return;
    setViewerModalVisible(true);
    setLoadingViewers(true);
    try {
      const data = await getStoryViewers(currentStory.id);
      setViewers(data);
    } catch {
      setViewers([]);
    } finally {
      setLoadingViewers(false);
    }
  };

  if (!currentGroup || !currentStory) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background content */}
      <View style={styles.content}>
        {currentStory.type === 'video' && currentStory.media_url ? (
          <Video
            source={{ uri: currentStory.media_url }}
            style={styles.media}
            resizeMode="cover"
            paused={paused}
            repeat
            muted={false}
          />
        ) : currentStory.media_url ? (
          <Image source={{ uri: currentStory.media_url }} style={styles.media} resizeMode="cover" />
        ) : (
          <View style={[styles.media, { backgroundColor: Colors.gray900, justifyContent: 'center', alignItems: 'center' }]}>
            <Typography variant="body" style={{ color: Colors.white, padding: Space[6], textAlign: 'center' }}>
              {currentStory.body}
            </Typography>
          </View>
        )}
      </View>

      {/* Overlay: Progress bars, header, tap zones */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Progress bars */}
        <View style={styles.progressRow}>
          {currentGroup.stories.map((_, idx) => (
            <View key={idx} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      idx < storyIndex
                        ? '100%'
                        : idx === storyIndex
                          ? progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                          : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header: avatar, name, close */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: currentGroup.user.avatar ?? `https://i.pravatar.cc/150?u=${currentGroup.user.id}` }} style={styles.headerAvatar} />
            <Typography variant="bodySmall" style={styles.headerName}>{currentGroup.user.name}</Typography>
            <Typography variant="captionMuted" style={styles.headerTime}>• {formatTimeAgo(currentStory.created_at)}</Typography>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} activeOpacity={0.7}>
            <Icon name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Tap zones */}
        <View style={styles.tapZoneContainer} pointerEvents="auto">
          <TouchableOpacity
            style={styles.tapZone}
            onPress={handleTap}
            onLongPress={() => handleLongPress(true)}
            onPressOut={() => handleLongPress(false)}
            delayLongPress={300}
            activeOpacity={1}
          />
        </View>

        {/* Bottom: viewer count (if own story) */}
        <View style={styles.bottomBar} pointerEvents="auto">
          <TouchableOpacity onPress={openViewers} activeOpacity={0.7} style={styles.viewerBtn}>
            <Icon name="eye-outline" size={16} color={Colors.white} />
            <Typography variant="caption" style={styles.viewerText}>{currentStory.view_count ?? 0}</Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Viewer list modal */}
      <Modal
        visible={viewerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setViewerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="body" style={styles.modalTitle}>Viewers</Typography>
              <TouchableOpacity onPress={() => setViewerModalVisible(false)}>
                <Icon name="close" size={22} color={Colors.gray700} />
              </TouchableOpacity>
            </View>
            {loadingViewers ? (
              <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>Loading...</Typography>
            ) : viewers.length === 0 ? (
              <Typography variant="captionMuted" style={{ paddingVertical: 24, textAlign: 'center' }}>No views yet</Typography>
            ) : (
              <FlatList
                data={viewers}
                keyExtractor={(v) => String(v.id)}
                renderItem={({ item }) => (
                  <View style={styles.viewerRow}>
                    <Image source={{ uri: item.avatar ?? `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.viewerAvatar} />
                    <View style={{ flex: 1 }}>
                      <Typography variant="bodySmall" style={{ fontWeight: '700' }}>{item.name}</Typography>
                      <Typography variant="captionMuted">{formatTimeAgo(item.viewed_at)}</Typography>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray900,
  },
  content: {
    ...StyleSheet.absoluteFill,
  },
  media: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Space[3],
    paddingTop: Space[3],
  },
  progressTrack: {
    flex: 1,
    height: PROGRESS_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: PROGRESS_HEIGHT,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingTop: Space[2],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerName: {
    color: Colors.white,
    fontWeight: '700',
  },
  headerTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  closeBtn: {
    padding: 4,
  },
  tapZoneContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tapZone: {
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: Space[4],
    paddingBottom: Space[6],
  },
  viewerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  viewerText: {
    color: Colors.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Space[4],
    paddingTop: Space[4],
    paddingBottom: Space[8],
    maxHeight: SCREEN_H * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Space[4],
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 16,
  },
  viewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    paddingVertical: Space[3],
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },
});
