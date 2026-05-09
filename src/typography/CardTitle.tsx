import React from 'react';
import { TextProps } from 'react-native';
import Typography from './Typography';

interface CardTitleProps extends Omit<TextProps, 'children'> {
  /** Card title text */
  children: React.ReactNode;
  /** If true, renders as a clickable link style */
  link?: boolean;
  /** Optional color override */
  color?: string;
  /** Max lines to show */
  lines?: number;
}

/**
 * Card Title — bold title for cards, tiles, and list items.
 *
 * Usage:
 *   <CardTitle>Royal Delicious</CardTitle>
 *   <CardTitle link lines={2}>Long chemical name...</CardTitle>
 */
export default function CardTitle({
  children,
  link = false,
  color,
  lines = 2,
  ...rest
}: CardTitleProps) {
  return (
    <Typography
      variant={link ? 'cardTitleLink' : 'cardTitle'}
      color={color}
      lines={lines}
      {...rest}
    >
      {children}
    </Typography>
  );
}
