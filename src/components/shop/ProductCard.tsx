/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PRODUCT CARD
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import PressableScale from '../PressableScale';
import SmartImage from '../SmartImage';
import type { ProductListItem } from '../../services/shopApi';

interface ProductCardProps {
  product: ProductListItem;
  onPress: (slug: string) => void;
  width?: number;
}

export default function ProductCard({ product, onPress, width = 160 }: ProductCardProps): React.JSX.Element {
  const finalPrice = product.final_price ?? product.base_price ?? 0;
  const comparePrice = product.compare_at_price ?? null;
  const discountPct = product.discount_percentage ?? null;
  const rating = product.rating ?? 0;
  const reviewCount = product.review_count ?? 0;
  const featuredImage = product.featured_image ?? null;
  const name = product.name ?? product.slug ?? 'Product';
  const brandName = product.brand?.name ?? product.category?.name ?? '';

  const hasDiscount = comparePrice && comparePrice > finalPrice;

  return (
    <PressableScale scale={0.97} onPress={() => onPress(product.slug)}>
      <View style={[styles.cardShadow, { width }]}>
        <View style={styles.cardInner}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <SmartImage
            source={{ uri: featuredImage ?? '' }}
            containerStyle={styles.image}
            fallbackIcon="package-variant"
          />
          {hasDiscount && discountPct ? (
            <View style={styles.badge}>
              <Typography variant="caption" style={styles.badgeText}>
                {Math.round(discountPct)}% OFF
              </Typography>
            </View>
          ) : null}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Typography variant="caption" style={styles.brand} numberOfLines={1}>
            {brandName}
          </Typography>
          <Typography variant="body" style={styles.name} numberOfLines={2}>
            {name}
          </Typography>

          <View style={globalStyle.row}>
            <Typography variant="body" style={styles.price}>
              ₹{finalPrice.toLocaleString('en-IN')}
            </Typography>
            {hasDiscount ? (
              <Typography variant="caption" style={styles.comparePrice}>
                ₹{comparePrice.toLocaleString('en-IN')}
              </Typography>
            ) : null}
          </View>

          {reviewCount > 0 ? (
            <View style={globalStyle.row}>
              <Typography variant="caption" style={styles.rating}>
                ★ {rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" style={styles.reviewCount}>
                ({reviewCount})
              </Typography>
            </View>
          ) : null}
        </View>
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardInner: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: Colors.white,
    fontWeight: '700',
  },
  content: {
    padding: 12,
    gap: 4,
  },
  brand: {
    color: Colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: Colors.gray800,
    fontWeight: '600',
    lineHeight: 20,
    minHeight: 40,
  },
  price: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  comparePrice: {
    color: Colors.gray400,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  rating: {
    color: Colors.accent,
    fontWeight: '700',
  },
  reviewCount: {
    color: Colors.gray400,
    marginLeft: 4,
  },
});
