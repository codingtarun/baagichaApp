/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MODERN CARD
 * ═══════════════════════════════════════════════════════════════
 *
 * Unified card component with:
 *   • Consistent border radius, padding, shadows
 *   • Press scale animation (spring physics)
 *   • Optional gradient background
 *   • Configurable elevation levels
 *
 * Replaces ad-hoc card styles scattered across screens.
 */

import React, { useRef, useCallback } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';

import { Colors } from '../theme/colors';
import { Radius, Shadows, Space } from '../theme/style';


// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type CardVariant = 'elevated' | 'flat' | 'subtle' | 'priority';
export type CardPadding = 'sm' | 'md' | 'lg';
export type CardRadius = 'sm' | 'md' | 'lg' | 'xl';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  pressScaleValue?: number;
  activeOpacity?: number;
  testID?: string;
}

// ═══════════════════════════════════════════════════════════════
// CONFIG MAPS
// ═══════════════════════════════════════════════════════════════

const PADDING_MAP: Record<CardPadding, number> = {
  sm: Space[3], // 12
  md: Space[4], // 16
  lg: Space[5], // 20
};

const RADIUS_MAP: Record<CardRadius, number> = {
  sm: Radius.sm,
  md: Radius.md,
  lg: Radius.lg,
  xl: Radius.xl,
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ModernCard({
  children,
  variant = 'elevated',
  padding = 'md',
  radius = 'lg',
  backgroundColor,
  borderColor,
  style,
  contentStyle,
  onPress,
  onLongPress,
  disabled = false,
  pressScaleValue = 0.97,
  testID,
}: ModernCardProps): React.JSX.Element {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: pressScaleValue,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [onPress, pressScaleValue, scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgroundColor ?? Colors.surface,
          ...Shadows.medium,
        };
      case 'flat':
        return {
          backgroundColor: backgroundColor ?? Colors.surface,
          borderWidth: 1,
          borderColor: borderColor ?? 'rgba(0,0,0,0.04)',
        };
      case 'subtle':
        return {
          backgroundColor: backgroundColor ?? Colors.surfaceSubtle,
        };
      case 'priority':
        return {
          backgroundColor: backgroundColor ?? Colors.surface,
          borderWidth: 1.5,
          borderColor: borderColor ?? Colors.gray200,
          ...Shadows.subtle,
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: RADIUS_MAP[radius],
    padding: PADDING_MAP[padding],
    ...getVariantStyle(),
  };

  const Wrapper = onPress ? Animated.createAnimatedComponent(Pressable) : Animated.View;

  const content = (
    <Wrapper
      testID={testID}
      style={[
        cardStyle,
        onPress && { transform: [{ scale: scaleAnim }] },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
    >
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </Wrapper>
  );

  return content;
}
