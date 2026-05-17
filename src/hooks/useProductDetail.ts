/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE PRODUCT DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchProductDetail,
  fetchProductReviews,
  checkCanReview,
  type ProductDetail,
  type ProductReview,
  type ProductListItem,
  type RatingBreakdown,
} from '../services/shopApi';

interface UseProductDetailResult {
  product: ProductDetail | null;
  related: ProductListItem[];
  reviews: ProductReview[];
  avgRating: number;
  reviewCount: number;
  ratingBreakdown: RatingBreakdown[];
  canReview: boolean;
  verifiedPurchase: boolean;
  canReviewMessage: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refreshReviews: () => Promise<void>;
}

export function useProductDetail(slug: string): UseProductDetailResult {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductListItem[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [verifiedPurchase, setVerifiedPurchase] = useState(false);
  const [canReviewMessage, setCanReviewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detailData, reviewsData, canReviewData] = await Promise.all([
        fetchProductDetail(slug),
        fetchProductReviews(slug),
        checkCanReview(slug).catch(() => ({ can_review: false, verified_purchase: false, message: '' })),
      ]);
      setProduct(detailData.product);
      setRelated(detailData.related_products);
      setReviews(reviewsData.reviews);
      setAvgRating(reviewsData.avg_rating);
      setReviewCount(reviewsData.review_count);
      setRatingBreakdown(reviewsData.rating_breakdown);
      setCanReview(canReviewData.can_review);
      setVerifiedPurchase(canReviewData.verified_purchase);
      setCanReviewMessage(canReviewData.message);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const refreshReviews = useCallback(async () => {
    try {
      const reviewsData = await fetchProductReviews(slug);
      setReviews(reviewsData.reviews);
      setAvgRating(reviewsData.avg_rating);
      setReviewCount(reviewsData.review_count);
      setRatingBreakdown(reviewsData.rating_breakdown);
      // Also re-check can-review status
      const canReviewData = await checkCanReview(slug).catch(() => ({ can_review: false, verified_purchase: false, message: '' }));
      setCanReview(canReviewData.can_review);
      setVerifiedPurchase(canReviewData.verified_purchase);
      setCanReviewMessage(canReviewData.message);
    } catch (err: any) {
      console.warn('[useProductDetail] Failed to refresh reviews:', err?.message);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    product,
    related,
    reviews,
    avgRating,
    reviewCount,
    ratingBreakdown,
    canReview,
    verifiedPurchase,
    canReviewMessage,
    loading,
    error,
    refresh: load,
    refreshReviews,
  };
}
