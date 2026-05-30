/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ANDROID-STYLE TOAST NOTIFICATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Compact toast positioned at the bottom-center, above the nav bar.
 * Mimics native Android toast: dark pill, white text, small size,
 * centered, auto-dismisses.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useToastStore, type ToastType } from '../store/toastStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TYPE_ICON: Record<ToastType, string> = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert',
  info: 'information',
};

export default function Toast(): React.JSX.Element | null {
  const { visible, message, type, duration, hide } = useToastStore();
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 50,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity, scale]);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
      hide();
    });
  }, [translateY, opacity, hide]);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      animateIn();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        animateOut();
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, animateIn, animateOut]);

  if (!shouldRender) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.toast,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <Icon
          name={TYPE_ICON[type]}
          size={10}
          color="rgba(255,255,255,0.6)"
          style={styles.icon}
        />
        <Typography variant="caption" style={styles.message} numberOfLines={2}>
          {message}
        </Typography>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 82,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.55)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    marginRight: 5,
  },
  message: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
