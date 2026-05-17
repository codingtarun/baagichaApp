/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PRICE TAG
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

interface PriceTagProps {
  finalPrice: number;
  compareAtPrice?: number | null;
  discountPercentage?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceTag({
  finalPrice,
  compareAtPrice,
  discountPercentage,
  size = 'md',
}: PriceTagProps): React.JSX.Element {
  const hasDiscount = compareAtPrice && compareAtPrice > finalPrice;

  const sizeStyles = {
    sm: { price: 14, compare: 11 },
    md: { price: 18, compare: 13 },
    lg: { price: 24, compare: 15 },
  };

  const s = sizeStyles[size];

  return (
    <View style={styles.container}>
      <Typography
        variant="body"
        style={[styles.price, { fontSize: s.price }]}
      >
        ₹{finalPrice.toLocaleString('en-IN')}
      </Typography>

      {hasDiscount ? (
        <Typography
          variant="caption"
          style={[styles.compare, { fontSize: s.compare }]}
        >
          ₹{compareAtPrice!.toLocaleString('en-IN')}
        </Typography>
      ) : null}

      {hasDiscount && discountPercentage ? (
        <View style={styles.discountBadge}>
          <Typography variant="caption" style={styles.discountText}>
            {Math.round(discountPercentage)}% off
          </Typography>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  price: {
    color: Colors.primary,
    fontWeight: '800',
  },
  compare: {
    color: Colors.gray400,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: Colors.danger + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: Colors.danger,
    fontWeight: '700',
  },
});
