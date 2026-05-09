import React from 'react';
import { TextProps } from 'react-native';
import Typography from './Typography';
import { TextVariant } from './Typography';

interface HindiTextProps extends Omit<TextProps, 'children'> {
  /** The Hindi text content */
  children: React.ReactNode;
  /** Variant of Hindi text style */
  variant?: 'hindiDisplayHero' | 'hindiDisplaySection' | 'hindiCardName' | 'hindiNavLabel' | 'hindiMicro' | 'hindiBody';
  /** Optional color override */
  color?: string;
  /** Center align */
  center?: boolean;
  /** Number of lines */
  lines?: number;
}

/**
 * Hindi Text Component — renders Devanagari text with the correct font family.
 *
 * Usage:
 *   <HindiText variant="hindiCardName">रॉयल डेलिशस</HindiText>
 *   <HindiText variant="hindiMicro" color={Colors.gray400}>उचित</HindiText>
 */
export default function HindiText({
  children,
  variant = 'hindiBody',
  color,
  center,
  lines,
  ...rest
}: HindiTextProps) {
  return (
    <Typography
      variant={variant as TextVariant}
      color={color}
      center={center}
      lines={lines}
      {...rest}
    >
      {children}
    </Typography>
  );
}
