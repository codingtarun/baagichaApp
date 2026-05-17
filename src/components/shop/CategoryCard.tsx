/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CATEGORY CARD
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import type { CategoryItem } from '../../services/shopApi';

interface CategoryCardProps {
  category: CategoryItem;
  onPress: (slug: string) => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps): React.JSX.Element {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(category.slug)}
      style={[styles.card, { backgroundColor: category.color_hex ? `${category.color_hex}15` : Colors.gray100 }]}
    >
      {category.icon || category.cover_image ? (
        <FastImage
          source={{
            uri: category.cover_image ?? category.icon!,
            priority: FastImage.priority.normal,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Typography variant="displayHeading" style={styles.placeholderText}>
            {category.name.charAt(0)}
          </Typography>
        </View>
      )}
      <Typography variant="caption" center style={styles.name} numberOfLines={2}>
        {category.name}
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 90,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderRadius: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.primary,
    fontSize: 24,
  },
  name: {
    color: Colors.gray700,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});
