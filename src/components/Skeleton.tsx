/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SKELETON / SHIMMER LOADING
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps): React.JSX.Element {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        styles.container,
        { width: width as any, height: height as any, borderRadius, overflow: 'hidden' },
        style,
      ]}
    >
      <View style={[styles.base, { width: width as any, height: height as any, borderRadius }]} />
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }): React.JSX.Element {
  return (
    <View style={[styles.card, style]}>
      <Skeleton width="100%" height={140} borderRadius={12} />
      <View style={{ marginTop: 12, gap: 8 }}>
        <Skeleton width="60%" height={14} borderRadius={6} />
        <Skeleton width="40%" height={12} borderRadius={6} />
        <Skeleton width="80%" height={12} borderRadius={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray200,
    position: 'relative',
  },
  base: {
    backgroundColor: Colors.gray200,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    width: 220,
  },
});
