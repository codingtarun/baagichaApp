/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — IMAGE VIEWER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Full-screen image viewer with horizontal paging.
 * Shows images in their original (large) size.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space } from '../theme/style';
import { Typography } from '../typography';
import type { HomeStackParamList } from '../navigation/stacks/HomeStack';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function ImageViewerScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HomeStackParamList, 'ImageViewer'>>();
  const { images, initialIndex = 0 } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_W);
    setCurrentIndex(index);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Icon name="close" size={28} color={Colors.white} />
      </TouchableOpacity>

      {/* Image carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: SCREEN_W * initialIndex, y: 0 }}
      >
        {images.map((img) => (
          <View key={img.id} style={styles.slide}>
            <Image
              source={{ uri: img.large }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      {/* Counter indicator */}
      {images.length > 1 && (
        <View style={styles.indicator}>
          <Typography variant="caption" style={styles.indicatorText}>
            {currentIndex + 1} / {images.length}
          </Typography>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray900,
  },
  closeBtn: {
    position: 'absolute',
    top: Space[4],
    right: Space[4],
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
  },
  slide: {
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.8,
  },
  indicator: {
    position: 'absolute',
    bottom: Space[6],
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  indicatorText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
