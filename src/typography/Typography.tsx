/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TYPOGRAPHY COMPONENT
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: This is a "polymorphic" text component. Instead of
 * creating 50 different text components, we create ONE component
 * that accepts a "variant" prop and renders the correct style.
 *
 * Think of it like a swiss army knife for text - one tool,
 * many uses. This keeps our code DRY (Don't Repeat Yourself).
 *
 * Why not just use <Text style={...}> everywhere?
 * - Consistency: Every "card title" looks exactly the same
 * - Maintainability: Change the font size in ONE place
 * - Type safety: TypeScript catches invalid variant names
 *
 * Usage:
 *   <Typography variant="displayHeading">Top Varieties</Typography>
 *   <Typography variant="body" color={Colors.gray500}>Description</Typography>
 *   <Typography variant="cardTitle" numberOfLines={2}>Long title...</Typography>
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { TextStyles } from './styles';

// ── Types ──

/**
 * LEARN: `keyof typeof TextStyles` creates a union type of all
 * the keys in the TextStyles object. This means TypeScript will
 * only allow valid variant names and will give autocomplete!
 *
 * Try typing: variant="    and you'll see all options.
 */
export type TextVariant = keyof typeof TextStyles;

/**
 * Props for the Typography component.
 * LEARN: We extend TextProps so our component accepts ALL the
 * same props as React Native's <Text> (onPress, numberOfLines,
 * accessibilityLabel, etc.) PLUS our custom props.
 */
interface TypographyProps extends TextProps {
  /** Predefined text style variant - controls font, size, weight, color */
  variant?: TextVariant;
  /** Optional override color - use when the default color doesn't fit */
  color?: string;
  /** Center-align the text - shortcut for textAlign: 'center' */
  center?: boolean;
  /** Number of lines to show before truncating with "..." */
  lines?: number;
}

// ── Component ──

/**
 * Typography Component
 *
 * LEARN: This is a functional component. In modern React, we
 * use functions instead of classes. They're simpler, easier to
 * read, and work better with hooks.
 *
 * The component destructures its props in the parameter list,
 * which is a common pattern that makes the used props obvious.
 */
export default function Typography({
  variant = 'body',       // Default to body text if no variant specified
  color,                  // Optional color override
  center,                 // Optional center alignment
  lines,                  // Optional line limit
  style,                  // Additional styles passed from parent
  children,               // The text content between opening/closing tags
  ...rest                 // LEARN: "rest" captures ALL remaining props
}: TypographyProps) {

  // Start with the base style from our catalog
  const baseStyle = TextStyles[variant];

  // Build an array of styles that will be merged
  // LEARN: React Native's style prop accepts arrays! The last
  // style in the array wins if there are conflicts.
  const mergedStyle: TextStyle[] = [baseStyle];

  // Apply color override if provided
  if (color) {
    mergedStyle.push({ color });
  }

  // Apply center alignment if requested
  if (center) {
    mergedStyle.push({ textAlign: 'center' });
  }

  // Apply any additional styles from the parent
  // LEARN: This is how parents can tweak the component's style
  // without breaking the variant system.
  if (style) {
    mergedStyle.push(style as TextStyle);
  }

  return (
    <Text
      style={mergedStyle}
      numberOfLines={lines}
      {...rest}  // LEARN: Spread the remaining props onto <Text>
    >
      {children}
    </Text>
  );
}
