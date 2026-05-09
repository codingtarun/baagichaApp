import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { TextStyles } from './styles';

interface PrimaryHeadingProps extends TextProps {
  /** The heading text */
  children: React.ReactNode;
  /** Optional color override */
  color?: string;
  /** Optional additional styles */
  style?: TextStyle | TextStyle[];
}

/**
 * Primary Display Heading — uses DM Serif Display
 *
 * For section titles, hero greetings, and prominent headings.
 * Maps to `displayHeading` in the text style catalog.
 *
 * Usage:
 *   <PrimaryHeading>Top Varieties</PrimaryHeading>
 *   <PrimaryHeading color={Colors.white}>Namaste,</PrimaryHeading>
 */
export default function PrimaryHeading({
  children,
  color,
  style,
  ...rest
}: PrimaryHeadingProps) {
  const styles: TextStyle[] = [TextStyles.displayHeading];

  if (color) {
    styles.push({ color });
  }

  if (style) {
    styles.push(style as TextStyle);
  }

  return (
    <Text style={styles} {...rest}>
      {children}
    </Text>
  );
}
