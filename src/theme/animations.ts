/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ANIMATION PRESETS
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Consistent animation timing creates a polished feel.
 * We use React Native's built-in Animated API (no extra native
 * dependencies) with carefully tuned spring and timing configs.
 */

import { Animated, Easing, type EasingFunction } from 'react-native';

// ═══════════════════════════════════════════════════════════════
// DURATION TOKENS (ms)
// ═══════════════════════════════════════════════════════════════

export const Duration = {
  instant: 100,   // Micro-feedback (opacity flicker)
  fast: 200,      // Button presses, toggles
  normal: 300,    // Card transitions, layout changes
  slow: 400,      // Page transitions, modal open
  emphasis: 500,  // Hero animations, onboarding
} as const;

// ═══════════════════════════════════════════════════════════════
// EASING TOKENS
// ═══════════════════════════════════════════════════════════════

export const EasingTokens = {
  // Standard — smooth deceleration (most UI transitions)
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  // Enter — element appearing (fast start, slow end)
  enter: Easing.bezier(0.0, 0.0, 0.2, 1),
  // Exit — element disappearing (slow start, fast end)
  exit: Easing.bezier(0.4, 0.0, 1, 1),
  // Bounce — playful, attention-grabbing
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

// ═══════════════════════════════════════════════════════════════
// SPRING PRESETS (for useAnimatedValue + spring)
// ═══════════════════════════════════════════════════════════════
// LEARN: Springs feel more natural than linear timings because
// they simulate physics. Use them for scale, position, and size.

export const SpringConfig = {
  // Gentle — subtle, understated (cards, list items)
  gentle: {
    friction: 8,
    tension: 40,
  },
  // Snappy — quick and responsive (buttons, toggles)
  snappy: {
    friction: 7,
    tension: 120,
  },
  // Bouncy — playful, attention-grabbing (badges, notifications)
  bouncy: {
    friction: 4,
    tension: 180,
  },
  // Soft — slow, smooth (page transitions, modals)
  soft: {
    friction: 9,
    tension: 30,
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// HELPER: Animated.timing with presets
// ═══════════════════════════════════════════════════════════════

interface AnimateToOptions {
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
  useNativeDriver?: boolean;
}

export function animateTo(
  value: Animated.Value,
  toValue: number,
  options: AnimateToOptions = {},
): Animated.CompositeAnimation {
  const {
    duration = Duration.normal,
    easing = EasingTokens.standard,
    delay = 0,
    useNativeDriver = true,
  } = options;

  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    delay,
    useNativeDriver,
  });
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Press scale animation
// ═══════════════════════════════════════════════════════════════
// Usage in component:
//   const scale = useRef(new Animated.Value(1)).current;
//   const onPressIn = () => animateTo(scale, 0.97, { duration: Duration.fast }).start();
//   const onPressOut = () => animateTo(scale, 1, { duration: Duration.fast }).start();

export function pressScale(value: Animated.Value, pressed: boolean): Animated.CompositeAnimation {
  return Animated.spring(value, {
    toValue: pressed ? 0.96 : 1,
    friction: SpringConfig.snappy.friction,
    tension: SpringConfig.snappy.tension,
    useNativeDriver: true,
  });
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Fade in from bottom (staggered list entrance)
// ═══════════════════════════════════════════════════════════════

export function fadeInUp(
  translateY: Animated.Value,
  opacity: Animated.Value,
  delay = 0,
): Animated.CompositeAnimation {
  return Animated.parallel([
    Animated.timing(translateY, {
      toValue: 0,
      duration: Duration.normal,
      easing: EasingTokens.enter,
      delay,
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 1,
      duration: Duration.normal,
      easing: EasingTokens.standard,
      delay,
      useNativeDriver: true,
    }),
  ]);
}

// ═══════════════════════════════════════════════════════════════
// STAGGER DELAY CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function staggerDelay(index: number, baseDelay = 50): number {
  return index * baseDelay;
}
