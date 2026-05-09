import React from 'react';
import { TextProps } from 'react-native';
import Typography from './Typography';

interface BadgeTextProps extends Omit<TextProps, 'children'> {
  /** Badge text content */
  children: React.ReactNode;
  /** Optional color override */
  color?: string;
}

/**
 * Badge Text — tiny uppercase labels, tags, pills.
 *
 * Usage:
 *   <BadgeText>ESSENTIAL</BadgeText>
 *   <BadgeText color={Colors.primary}>NEW</BadgeText>
 */
export default function BadgeText({
  children,
  color,
  ...rest
}: BadgeTextProps) {
  return (
    <Typography variant="label" color={color} {...rest}>
      {children}
    </Typography>
  );
}
