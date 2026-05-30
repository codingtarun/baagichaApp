/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STORY MEDIA PREVIEW
 * ═══════════════════════════════════════════════════════════════
 *
 * Preview selected image/video before posting as story.
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import { createStory } from '../services/storyApi';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';

type StoryMediaPreviewRouteProp = RouteProp<HomeStackParamList, 'StoryMediaPreview'>;

export default function StoryMediaPreview(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<StoryMediaPreviewRouteProp>();
  const { uri, mediaType, mimeType } = route.params;
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    setPosting(true);
    try {
      await createStory({
        type: mediaType,
        visibility: 'followers',
        media: {
          uri,
          type: mimeType,
          name: mediaType === 'video' ? 'story.mp4' : 'story.jpg',
        },
      });
      showToast('Story posted!', 'success');
      navigation.goBack();
    } catch {
      showToast('Failed to post story', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Media */}
      <View style={styles.mediaWrap}>
        {mediaType === 'video' ? (
          <Video
            source={{ uri }}
            style={styles.media}
            resizeMode="cover"
            repeat
            muted={false}
          />
        ) : (
          <Image source={{ uri }} style={styles.media} resizeMode="cover" />
        )}
      </View>

      {/* Overlay controls */}
      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header} pointerEvents="auto">
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
            <Icon name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer} pointerEvents="auto">
          <TouchableOpacity
            style={[styles.postBtn, posting && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={posting}
            activeOpacity={0.8}
          >
            {posting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Typography variant="body" style={styles.postBtnText}>Post to Story</Typography>
                <Icon name="send" size={18} color={Colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray900 },
  mediaWrap: { flex: 1 },
  media: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: Space[4],
    paddingTop: Space[3],
  },
  headerBtn: { padding: 4 },
  footer: {
    paddingHorizontal: Space[6],
    paddingBottom: Space[8],
    alignItems: 'center',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
