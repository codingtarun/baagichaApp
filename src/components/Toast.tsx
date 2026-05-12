/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOAST NOTIFICATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Global toast overlay rendered at the root of the app.
 * Slides in from the top, auto-dismisses after a timeout.
 *
 * Types:
 *   success  → green  → checkmark icon
 *   error    → red    → cross icon
 *   warning  → amber  → exclamation icon
 *   info     → blue   → info icon
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  type ColorValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import { useToastStore, type ToastType } from '../store/toastStore';

const TYPE_CONFIG: Record<
  ToastType,
  { bg: ColorValue; icon: string; iconColor: ColorValue }
> = {
  success: { bg: Colors.success, icon: 'check-circle', iconColor: '#fff' },
  error: { bg: Colors.danger, icon: 'close-circle', iconColor: '#fff' },
  warning: { bg: Colors.warning, icon: 'alert-circle', iconColor: '#fff' },
  info: { bg: Colors.info, icon: 'information', iconColor: '#fff' },
};

export default function Toast(): React.JSX.Element | null {
  const { visible, message, type, duration, hide } = useToastStore();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
      hide();
    });
  }, [translateY, opacity, hide]);

  // Show / hide based on visibility
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      animateIn();

      // Auto-dismiss timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        animateOut();
      }, duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, animateIn, animateOut]);

  // Render nothing when hidden and animation finished
  if (!shouldRender) return null;

  const config = TYPE_CONFIG[type];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: config.bg },
            { transform: [{ translateY }], opacity },
          ]}
        >
          <Icon
            name={config.icon}
            size={22}
            color={config.iconColor as string}
            style={styles.icon}
          />
          <Typography variant="toast" style={styles.message} numberOfLines={2}>
            {message}
          </Typography>
          <TouchableOpacity
            onPress={animateOut}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: Colors.white,
  },
});
