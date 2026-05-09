import React from 'react';
import { TextProps } from 'react-native';
import Typography from './Typography';

interface MetaTextProps extends Omit<TextProps, 'children'> {
  /** Meta text content */
  children: React.ReactNode;
  /** Mute the text further (lighter gray) */
  muted?: boolean;
  /** Optional color override */
  color?: string;
}

/**
 * Meta Text — timestamps, locations, small metadata.
 *
 * Usage:
 *   <MetaText>Kinnaur · 9200ft</MetaText>
 *   <MetaText muted>2 days ago</MetaText>
 */
export default function MetaText({
  children,
  muted = false,
  color,
  ...rest
}: MetaTextProps) {
  return (
    <Typography
      variant={muted ? 'captionMuted' : 'caption'}
      color={color}
      {...rest}
    >
      {children}
    </Typography>
  );
}
