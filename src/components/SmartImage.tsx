/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SMART IMAGE
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, Source } from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import Skeleton from './Skeleton';

interface SmartImageProps extends Omit<FastImageProps, 'source'> {
  source: Source;
  containerStyle?: ViewStyle;
  fallbackIcon?: string;
}

export default function SmartImage({
  source,
  containerStyle,
  style,
  fallbackIcon = 'image-off-outline',
  onLoadStart,
  onLoadEnd,
  onError,
  ...rest
}: SmartImageProps): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
    onError?.();
  }, [onError]);

  const uri = (source as any)?.uri;
  const hasUri = !!uri && uri.length > 0 && !uri.includes('placeholder');

  if (error || !hasUri) {
    return (
      <View style={[styles.fallback, containerStyle]}>
        <Icon name={fallbackIcon} size={32} color={Colors.gray300} />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {loading && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton width="100%" height="100%" borderRadius={0} />
        </View>
      )}
      <FastImage
        source={source}
        style={[StyleSheet.absoluteFill, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.gray100,
  },
  fallback: {
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
