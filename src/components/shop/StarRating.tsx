/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STAR RATING COMPONENT
 * ═══════════════════════════════════════════════════════════════
 *
 * Display or interactive star rating. Supports half-stars for
 * display mode and full stars for interactive mode.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

interface StarRatingProps {
  /** Current rating value (1-5) */
  rating: number;
  /** Total number of stars (default 5) */
  maxStars?: number;
  /** Star size in pixels */
  size?: number;
  /** If true, allow tapping to set rating */
  interactive?: boolean;
  /** Called when user taps a star (interactive only) */
  onChange?: (rating: number) => void;
  /** Show numeric label next to stars */
  showLabel?: boolean;
  /** Number of reviews to show in label */
  reviewCount?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange,
  showLabel = false,
  reviewCount,
}: StarRatingProps): React.JSX.Element {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= Math.floor(rating);
    const isHalf = !isFilled && i === Math.ceil(rating) && rating % 1 >= 0.5;

    const iconName = isFilled
      ? 'star'
      : isHalf
        ? 'star-half-full'
        : 'star-outline';

    if (interactive && onChange) {
      stars.push(
        <TouchableOpacity
          key={i}
          activeOpacity={0.6}
          onPress={() => onChange(i)}
          style={styles.starButton}
        >
          <MaterialCommunityIcons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={Colors.accent}
          />
        </TouchableOpacity>
      );
    } else {
      stars.push(
        <MaterialCommunityIcons
          key={i}
          name={iconName}
          size={size}
          color={Colors.accent}
          style={styles.star}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {showLabel && (
        <Typography variant="caption" style={styles.label}>
          {rating.toFixed(1)}
          {reviewCount !== undefined ? ` (${reviewCount})` : ''}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  starButton: {
    paddingHorizontal: 2,
  },
  label: {
    marginLeft: 6,
    color: Colors.gray500,
    fontWeight: '600',
  },
});
