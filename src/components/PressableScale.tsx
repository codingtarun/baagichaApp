/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PRESSABLE SCALE
 * ═══════════════════════════════════════════════════════════════
 *
 * Wraps children with a subtle scale-down animation on press.
 * TODO: Install react-native-haptic-feedback for tactile feedback.
 */

import React, { useCallback } from 'react';
import { TouchableOpacity, TouchableOpacityProps, Animated } from 'react-native';

interface PressableScaleProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scale?: number;
}

export default function PressableScale({
  children,
  scale = 0.97,
  onPressIn,
  onPressOut,
  activeOpacity = 0.9,
  ...rest
}: PressableScaleProps): React.JSX.Element {
  const animValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(animValue, {
        toValue: scale,
        useNativeDriver: true,
        friction: 5,
        tension: 300,
      }).start();
      onPressIn?.(e);
    },
    [animValue, scale, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(animValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 300,
      }).start();
      onPressOut?.(e);
    },
    [animValue, onPressOut]
  );

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <Animated.View style={{ transform: [{ scale: animValue }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
