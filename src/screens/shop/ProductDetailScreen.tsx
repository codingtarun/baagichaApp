/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PRODUCT DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { showToast } from '../../store/toastStore';
import { navigateToLogin } from '../../navigation/navigationRef';
import { submitReview } from '../../services/shopApi';
import QuantitySelector from '../../components/shop/QuantitySelector';
import PriceTag from '../../components/shop/PriceTag';
import ProductCard from '../../components/shop/ProductCard';
import StarRating from '../../components/shop/StarRating';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<ShopStackParamList, 'ProductDetail'>;
type ProductDetailNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function ProductDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<ProductDetailNavProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { slug } = route.params;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cart = useCartStore();
  const insets = useSafeAreaInsets();

  const {
    product,
    related,
    reviews,
    avgRating,
    reviewCount,
    ratingBreakdown,
    canReview,
    verifiedPurchase,
    loading,
    error,
    refresh,
    refreshReviews,
  } = useProductDetail(slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const selectedVariant = product?.variants.find((v) => v.id === selectedVariantId) ?? product?.variants.find((v) => v.is_default) ?? product?.variants[0];

  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to cart', 'warning');
      navigateToLogin();
      return;
    }
    if (!selectedVariant) return;

    setAddingToCart(true);
    try {
      await cart.addItem(selectedVariant.id, quantity);
      showToast('Added to cart!', 'success');
      setQuantity(1);
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  }, [isAuthenticated, selectedVariant, quantity, cart]);

  const goToProduct = useCallback(
    (s: string) => {
      navigation.push('ProductDetail', { slug: s });
    },
    [navigation]
  );

  const handleSubmitReview = useCallback(async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to write a review', 'warning');
      navigateToLogin();
      return;
    }
    if (reviewRating === 0) {
      showToast('Please select a star rating', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      await submitReview(slug, {
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        comment: reviewComment.trim() || undefined,
        variant_id: selectedVariant?.id,
      });
      showToast('Review submitted! It will appear after approval.', 'success');
      setReviewRating(0);
      setReviewTitle('');
      setReviewComment('');
      setShowReviewForm(false);
      await refreshReviews();
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  }, [isAuthenticated, reviewRating, reviewTitle, reviewComment, slug, selectedVariant, refreshReviews]);

  if (loading && !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Typography variant="bodyMuted" center>{error ?? 'Product not found'}</Typography>
        <TouchableOpacity onPress={refresh} style={styles.retryButton} activeOpacity={0.7}>
          <Typography variant="button" style={styles.retryText}>Retry</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : product.featured_image ? [{ url: product.featured_image, thumb: product.featured_image }] : [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading && !!product} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} activeOpacity={0.7} style={styles.iconButton}>
            <MaterialCommunityIcons name="cart-outline" size={24} color={Colors.gray700} />
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.gallery}>
          {gallery.map((img, index) => (
            <FastImage
              key={index}
              source={{ uri: img.url, priority: FastImage.priority.high }}
              style={[styles.galleryImage, { width: SCREEN_WIDTH }]}
              resizeMode={FastImage.resizeMode.contain}
            />
          ))}
        </ScrollView>

        {/* Info */}
        <View style={styles.infoCard}>
          <Typography variant="caption" style={styles.brand}>
            {product.brand?.name ?? product.category.name}
          </Typography>
          <Typography variant="displayHeading" style={styles.name}>
            {product.name}
          </Typography>

          <View style={styles.ratingRow}>
            {reviewCount > 0 ? (
              <StarRating rating={avgRating} showLabel reviewCount={reviewCount} />
            ) : (
              <Typography variant="caption" style={styles.reviewCount}>No reviews yet</Typography>
            )}
          </View>

          <PriceTag
            finalPrice={selectedVariant?.price ?? product.final_price}
            compareAtPrice={selectedVariant?.compare_at_price ?? product.compare_at_price}
            discountPercentage={selectedVariant?.discount_percentage ?? product.discount_percentage}
            size="lg"
          />

          {/* Variants */}
          {product.variants.length > 1 && (
            <View style={styles.variantsSection}>
              <Typography variant="label" style={styles.label}>Select Variant</Typography>
              <View style={styles.variantList}>
                {product.variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.id}
                    activeOpacity={0.7}
                    style={[
                      styles.variantChip,
                      selectedVariant?.id === variant.id && styles.variantChipActive,
                      !variant.is_active && styles.variantChipDisabled,
                    ]}
                    onPress={() => variant.is_active && setSelectedVariantId(variant.id)}
                    disabled={!variant.is_active}
                  >
                    <Typography
                      variant="caption"
                      style={[
                        styles.variantText,
                        selectedVariant?.id === variant.id && styles.variantTextActive,
                      ]}
                    >
                      {variant.name}
                    </Typography>
                    <Typography variant="caption" style={styles.variantPrice}>
                      ₹{variant.price.toLocaleString('en-IN')}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <Typography variant="label" style={styles.label}>Quantity</Typography>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => Math.min(q + 1, 99))}
              onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
            />
          </View>

          {/* Description */}
          {product.description ? (
            <View style={styles.section}>
              <Typography variant="label" style={styles.label}>Description</Typography>
              <Typography variant="body" style={styles.description}>{product.description}</Typography>
            </View>
          ) : null}

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={globalStyle.rowBetween}>
              <Typography variant="label" style={styles.label}>Customer Reviews</Typography>
              {canReview && !showReviewForm && (
                <TouchableOpacity onPress={() => setShowReviewForm(true)} activeOpacity={0.7}>
                  <Typography variant="link" style={styles.writeReviewText}>Write a Review</Typography>
                </TouchableOpacity>
              )}
            </View>

            {/* Rating Summary */}
            {reviewCount > 0 ? (
              <View style={styles.ratingSummary}>
                <View style={styles.ratingBig}>
                  <Typography variant="displayHeading" style={styles.ratingBigNumber}>{avgRating.toFixed(1)}</Typography>
                  <StarRating rating={avgRating} size={14} />
                  <Typography variant="caption" style={styles.ratingBigLabel}>{reviewCount} reviews</Typography>
                </View>
                <View style={styles.ratingBars}>
                  {ratingBreakdown.map((item) => (
                    <View key={item.stars} style={styles.ratingBarRow}>
                      <Typography variant="caption" style={styles.ratingBarLabel}>{item.stars}★</Typography>
                      <View style={styles.ratingBarTrack}>
                        <View style={[styles.ratingBarFill, { width: `${item.percentage}%` }]} />
                      </View>
                      <Typography variant="caption" style={styles.ratingBarCount}>{item.count}</Typography>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Typography variant="bodySmall" style={styles.noReviewsText}>
                Be the first to review this product!
              </Typography>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <View style={styles.reviewForm}>
                <Typography variant="body" style={styles.reviewFormTitle}>Write a Review</Typography>
                {verifiedPurchase && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={14} color={Colors.success} />
                    <Typography variant="caption" style={styles.verifiedText}>Verified Purchase</Typography>
                  </View>
                )}
                <StarRating rating={reviewRating} interactive size={32} onChange={setReviewRating} />
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Review Title (optional)"
                  placeholderTextColor={Colors.gray400}
                  value={reviewTitle}
                  onChangeText={setReviewTitle}
                  maxLength={255}
                />
                <TextInput
                  style={[styles.reviewInput, styles.reviewTextarea]}
                  placeholder="Share your experience..."
                  placeholderTextColor={Colors.gray400}
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  multiline
                  numberOfLines={4}
                  maxLength={2000}
                />
                <View style={globalStyle.row}>
                  <TouchableOpacity
                    style={[styles.reviewSubmitButton, submittingReview && styles.reviewSubmitDisabled]}
                    onPress={handleSubmitReview}
                    disabled={submittingReview}
                    activeOpacity={0.8}
                  >
                    {submittingReview ? (
                      <ActivityIndicator color={Colors.white} size="small" />
                    ) : (
                      <Typography variant="button" style={styles.reviewSubmitText}>Submit Review</Typography>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reviewCancelButton}
                    onPress={() => setShowReviewForm(false)}
                    activeOpacity={0.7}
                  >
                    <Typography variant="button" style={styles.reviewCancelText}>Cancel</Typography>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Review List */}
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={globalStyle.rowBetween}>
                  <View style={globalStyle.row}>
                    <Typography variant="body" style={styles.reviewUser}>{review.user_name}</Typography>
                    {review.is_verified && (
                      <View style={styles.verifiedBadgeSmall}>
                        <MaterialCommunityIcons name="check-circle" size={12} color={Colors.success} />
                        <Typography variant="caption" style={styles.verifiedTextSmall}>Verified</Typography>
                      </View>
                    )}
                  </View>
                  <StarRating rating={review.rating} size={14} />
                </View>
                {review.title ? (
                  <Typography variant="bodySmall" style={styles.reviewTitle}>{review.title}</Typography>
                ) : null}
                <Typography variant="caption" style={styles.reviewDate}>{review.created_at}</Typography>
                <Typography variant="bodySmall" style={styles.reviewComment}>{review.comment}</Typography>
              </View>
            ))}
          </View>

          {/* Related Products */}
          {related.length > 0 && (
            <View style={styles.section}>
              <Typography variant="label" style={styles.label}>You May Also Like</Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} onPress={goToProduct} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.bottomPrice}>
          <Typography variant="caption" style={styles.totalLabel}>Total</Typography>
          <Typography variant="displayHeading" style={styles.totalPrice}>
            ₹{((selectedVariant?.price ?? product.final_price) * quantity).toLocaleString('en-IN')}
          </Typography>
        </View>
        <TouchableOpacity
          style={[styles.addButton, addingToCart && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
          activeOpacity={0.8}
        >
          {addingToCart ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Typography variant="button" style={styles.addButtonText}>Add to Cart</Typography>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gallery: {
    height: SCREEN_WIDTH * 0.9,
  },
  galleryImage: {
    height: SCREEN_WIDTH * 0.9,
    backgroundColor: Colors.surfaceSubtle,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
    gap: 16,
  },
  brand: {
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    color: Colors.accent,
    fontWeight: '700',
  },
  reviewCount: {
    color: Colors.gray400,
  },
  variantsSection: {
    gap: 8,
  },
  label: {
    color: Colors.gray600,
    fontWeight: '600',
  },
  variantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  variantChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  variantChipDisabled: {
    opacity: 0.4,
  },
  variantText: {
    color: Colors.gray700,
    fontWeight: '600',
  },
  variantTextActive: {
    color: Colors.primary,
  },
  variantPrice: {
    color: Colors.gray400,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    gap: 10,
  },
  description: {
    color: Colors.gray600,
    lineHeight: 22,
  },
  writeReviewText: {
    fontSize: 13,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  ratingBig: {
    alignItems: 'center',
    gap: 4,
  },
  ratingBigNumber: {
    fontSize: 36,
    color: Colors.gray800,
  },
  ratingBigLabel: {
    color: Colors.gray400,
  },
  ratingBars: {
    flex: 1,
    gap: 4,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarLabel: {
    width: 24,
    color: Colors.gray500,
    fontWeight: '600',
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  ratingBarCount: {
    width: 28,
    textAlign: 'right',
    color: Colors.gray400,
  },
  noReviewsText: {
    color: Colors.gray400,
    textAlign: 'center',
    paddingVertical: 12,
  },
  reviewForm: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginTop: 4,
  },
  reviewFormTitle: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: Colors.success,
    fontWeight: '700',
  },
  reviewInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.gray800,
    fontFamily: 'DMSans-Regular',
  },
  reviewTextarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  reviewSubmitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    marginRight: 8,
  },
  reviewSubmitDisabled: {
    opacity: 0.6,
  },
  reviewSubmitText: {
    color: Colors.white,
    fontWeight: '700',
  },
  reviewCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewCancelText: {
    color: Colors.gray500,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 4,
  },
  reviewUser: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  verifiedBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 6,
    backgroundColor: Colors.success + '12',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTextSmall: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 10,
  },
  reviewTitle: {
    color: Colors.gray800,
    fontWeight: '600',
    marginTop: 2,
  },
  reviewDate: {
    color: Colors.gray400,
  },
  reviewComment: {
    color: Colors.gray600,
    marginTop: 2,
  },
  horizontalScroll: {
    gap: 12,
    paddingRight: 16,
  },
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  bottomPrice: {
    gap: 2,
  },
  totalLabel: {
    color: Colors.gray400,
  },
  totalPrice: {
    fontSize: 20,
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    minWidth: 160,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
