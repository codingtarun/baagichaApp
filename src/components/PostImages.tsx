/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — POST IMAGES GRID
 * ═══════════════════════════════════════════════════════════════
 *
 * Renders post images in a compact grid.
 * - 1 image  → full width, medium quality
 * - 2 images → side by side, thumb quality
 * - 3 images → row of 3, thumb quality
 * Tapping any image opens the full-screen viewer.
 */

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import type { FeedPost } from '../services/postApi';

const { width: SCREEN_W } = Dimensions.get('window');

interface PostImagesProps {
  images: FeedPost['images'];
  onImagePress?: (index: number) => void;
}

export default function PostImages({ images, onImagePress }: PostImagesProps): React.JSX.Element | null {
  if (!images || images.length === 0) return null;

  const isSingle = images.length === 1;

  return (
    <View style={styles.container}>
      {isSingle ? (
        <TouchableOpacity onPress={() => onImagePress?.(0)} activeOpacity={0.92}>
          <Image source={{ uri: images[0].medium }} style={styles.singleImage} resizeMode="cover" />
        </TouchableOpacity>
      ) : (
        <View style={styles.grid}>
          {images.map((img, index) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => onImagePress?.(index)}
              activeOpacity={0.92}
              style={[
                styles.gridItem,
                images.length === 2 && styles.gridItemTwo,
                images.length >= 3 && styles.gridItemThree,
              ]}
            >
              <Image source={{ uri: img.thumb }} style={styles.gridImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Space[3],
  },
  singleImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray100,
  },
  grid: {
    flexDirection: 'row',
    gap: Space[2],
  },
  gridItem: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
    backgroundColor: Colors.gray100,
  },
  gridItemTwo: {
    flex: 1,
    height: 180,
  },
  gridItemThree: {
    flex: 1,
    height: 120,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});
