import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Typography from './Typography';
import { Colors } from '../theme/colors';

interface SectionHeaderProps {
  /** English section title */
  title: string;
  /** Optional Hindi subtitle */
  subtitleHi?: string;
  /** Optional "View All" link text */
  linkText?: string;
  /** Called when link is pressed */
  onLinkPress?: () => void;
  /** Optional icon name (FontAwesome) rendered as text emoji fallback */
  icon?: string;
  /** Container style override */
  style?: StyleProp<ViewStyle>;
}

/**
 * Section Header — Title + Hindi subtitle + optional "View All" link
 *
 * Usage:
 *   <SectionHeader title="Top Varieties" subtitleHi="शीर्ष किस्में" linkText="सभी देखें" />
 *   <SectionHeader title="Alerts" subtitleHi="चेतावनी" icon="⚠️" />
 */
export default function SectionHeader({
  title,
  subtitleHi,
  linkText,
  onLinkPress,
  icon,
  style,
}: SectionHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 12,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, marginRight: 8 }}>
        <Typography variant="sectionTitle">
          {icon ? `${icon} ` : ''}
          {title}
        </Typography>
        {subtitleHi ? (
          <Typography variant="sectionSubtitle" style={{ marginTop: 2 }}>
            {subtitleHi}
          </Typography>
        ) : null}
      </View>

      {linkText ? (
        <Typography
          variant="sectionLink"
          onPress={onLinkPress}
        >
          {linkText} ›
        </Typography>
      ) : null}
    </View>
  );
}
