/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP API
 * ═══════════════════════════════════════════════════════════════
 *
 * All eCommerce API calls: products, categories, cart, checkout,
 * orders, addresses, wishlist, and Razorpay payments.
 */

import { api } from './api';

// ── Product Types ──

export interface Brand {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  base_price: number;
  final_price: number;
  compare_at_price: number | null;
  discount_percentage: number | null;
  featured_image: string | null;
  rating: number;
  review_count: number;
  brand: Brand | null;
  category: Category;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  discount_percentage: number | null;
  weight_g: number | null;
  is_default: boolean;
  is_active: boolean;
  attributes: {
    name: string;
    value: string;
    color_hex: string | null;
  }[];
}

export interface ProductReview {
  id: number;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  user_name: string;
  created_at: string;
}

export interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

export interface ReviewsResponse {
  product_name: string;
  avg_rating: number;
  review_count: number;
  rating_breakdown: RatingBreakdown[];
  reviews: ProductReview[];
}

export interface ProductGalleryItem {
  url: string;
  thumb: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  hsn_code: string | null;
  gst_rate: number | null;
  base_price: number;
  final_price: number;
  compare_at_price: number | null;
  discount_percentage: number | null;
  weight_g: number | null;
  featured_image: string | null;
  gallery: ProductGalleryItem[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  brand: Brand | null;
  category: Category;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

// ── Category Types ──

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  cover_image: string | null;
  color_hex: string | null;
  children?: CategoryItem[];
}

// ── Brand Types ──

export interface BrandItem {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

// ── Cart Types ──

export interface CartItem {
  id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  sku: string;
  featured_image: string | null;
  price: number;
  quantity: number;
  item_total: number;
}

export interface CartResponse {
  items: CartItem[];
  item_count: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total: number;
  coupon_code: string | null;
}

// ── Address Types ──

export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string | null;
  is_default: boolean;
}

// ── Order Types ──

export interface OrderItem {
  id: number;
  product_name: string;
  variant_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  item_total: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  currency: string;
  placed_at: string;
  items: OrderItem[];
}

export interface OrderDetail extends Order {
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  coupon_code: string | null;
  shipping_address: Address;
  billing_address: Address;
  status_history: {
    status: string;
    comment: string | null;
    created_at: string;
  }[];
}

// ── Razorpay Types ──

export interface RazorpayCheckoutData {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string | null;
    contact: string;
  };
}

export interface CheckoutResponse {
  order: {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    total: number;
    currency: string;
  };
  razorpay?: RazorpayCheckoutData;
}

// ── API Response Wrapper ──

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ── Product API ──

export async function fetchCategories(): Promise<CategoryItem[]> {
  const response = await api.get<ApiResponse<CategoryItem[]>>('/shop/categories');
  return response.data.data;
}

export async function fetchCategory(slug: string): Promise<{ category: CategoryItem; products: ProductListItem[] }> {
  const response = await api.get<ApiResponse<{ category: CategoryItem; products: ProductListItem[] }>>(`/shop/categories/${slug}`);
  return response.data.data;
}

export async function fetchBrands(): Promise<BrandItem[]> {
  const response = await api.get<ApiResponse<BrandItem[]>>('/shop/brands');
  return response.data.data;
}

export async function fetchBrand(slug: string): Promise<{ brand: BrandItem; products: ProductListItem[] }> {
  const response = await api.get<ApiResponse<{ brand: BrandItem; products: ProductListItem[] }>>(`/shop/brands/${slug}`);
  return response.data.data;
}

export async function fetchProducts(params?: {
  category?: string;
  category_slug?: string;
  brand?: string;
  brand_slug?: string;
  q?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort?: string;
  page?: number;
}): Promise<{ products: ProductListItem[]; current_page: number; last_page: number; total: number }> {
  const response = await api.get<ApiResponse<any>>('/shop/products', { params });
  const data = response.data.data;
  // Laravel paginator structure
  if (data.data) {
    return {
      products: data.data,
      current_page: data.current_page,
      last_page: data.last_page,
      total: data.total,
    };
  }
  return {
    products: data,
    current_page: 1,
    last_page: 1,
    total: data.length,
  };
}

export async function fetchFeaturedProducts(): Promise<ProductListItem[]> {
  const response = await api.get<ApiResponse<ProductListItem[]>>('/shop/products/featured');
  return response.data.data;
}

export async function fetchProductDetail(slug: string): Promise<{ product: ProductDetail; related_products: ProductListItem[] }> {
  const response = await api.get<ApiResponse<{ product: ProductDetail; related_products: ProductListItem[] }>>(`/shop/products/${slug}`);
  return response.data.data;
}

export async function fetchProductReviews(slug: string, page = 1): Promise<ReviewsResponse & { current_page: number; last_page: number }> {
  const response = await api.get<ApiResponse<any>>(`/shop/products/${slug}/reviews`, { params: { page } });
  const data = response.data.data;
  const reviews = data.reviews ?? data;
  if (reviews.data) {
    return {
      product_name: data.product_name ?? '',
      avg_rating: data.avg_rating ?? 0,
      review_count: data.review_count ?? 0,
      rating_breakdown: data.rating_breakdown ?? [],
      reviews: reviews.data,
      current_page: reviews.current_page,
      last_page: reviews.last_page,
    };
  }
  return {
    product_name: data.product_name ?? '',
    avg_rating: data.avg_rating ?? 0,
    review_count: data.review_count ?? 0,
    rating_breakdown: data.rating_breakdown ?? [],
    reviews: reviews,
    current_page: 1,
    last_page: 1,
  };
}

export async function checkCanReview(slug: string): Promise<{ can_review: boolean; verified_purchase: boolean; reason?: string; message: string }> {
  const response = await api.get<ApiResponse<{ can_review: boolean; verified_purchase: boolean; reason?: string; message: string }>>(`/shop/products/${slug}/can-review`);
  return response.data.data;
}

// ── Cart API ──

export async function fetchCart(): Promise<CartResponse> {
  const response = await api.get<ApiResponse<CartResponse>>('/shop/cart');
  return response.data.data;
}

export async function addToCart(variantId: number, quantity: number): Promise<CartResponse> {
  const response = await api.post<ApiResponse<CartResponse>>('/shop/cart/items', { variant_id: variantId, quantity });
  return response.data.data;
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartResponse> {
  const response = await api.put<ApiResponse<CartResponse>>(`/shop/cart/items/${itemId}`, { quantity });
  return response.data.data;
}

export async function removeCartItem(itemId: number): Promise<CartResponse> {
  const response = await api.delete<ApiResponse<CartResponse>>(`/shop/cart/items/${itemId}`);
  return response.data.data;
}

export async function applyCoupon(code: string): Promise<CartResponse> {
  const response = await api.post<ApiResponse<CartResponse>>('/shop/cart/coupon', { code });
  return response.data.data;
}

export async function removeCoupon(): Promise<CartResponse> {
  const response = await api.delete<ApiResponse<CartResponse>>('/shop/cart/coupon');
  return response.data.data;
}

// ── Wishlist API ──

export async function fetchWishlist(): Promise<ProductListItem[]> {
  const response = await api.get<ApiResponse<ProductListItem[]>>('/shop/wishlist');
  return response.data.data;
}

export async function addToWishlist(productId: number): Promise<void> {
  await api.post<ApiResponse<void>>('/shop/wishlist', { product_id: productId });
}

export async function removeFromWishlist(productId: number): Promise<void> {
  await api.delete<ApiResponse<void>>(`/shop/wishlist/${productId}`);
}

// ── Address API ──

export async function fetchAddresses(): Promise<Address[]> {
  const response = await api.get<ApiResponse<Address[]>>('/shop/addresses');
  return response.data.data;
}

export async function createAddress(data: Omit<Address, 'id'>): Promise<Address> {
  const response = await api.post<ApiResponse<Address>>('/shop/addresses', data);
  return response.data.data;
}

export async function updateAddress(id: number, data: Partial<Address>): Promise<Address> {
  const response = await api.put<ApiResponse<Address>>(`/shop/addresses/${id}`, data);
  return response.data.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await api.delete<ApiResponse<void>>(`/shop/addresses/${id}`);
}

export async function setDefaultAddress(id: number): Promise<Address> {
  const response = await api.post<ApiResponse<Address>>(`/shop/addresses/${id}/default`);
  return response.data.data;
}

// ── Checkout & Order API ──

export async function createCheckout(payload: {
  shipping_address_id: number;
  billing_address_id?: number;
  payment_method: 'razorpay' | 'cod';
  notes?: string;
}): Promise<CheckoutResponse> {
  const response = await api.post<ApiResponse<CheckoutResponse>>('/shop/checkout', payload);
  return response.data.data;
}

export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await api.post<ApiResponse<{ success: boolean; message: string }>>('/shop/payments/razorpay/verify', payload);
  return response.data.data;
}

export async function createRazorpayOrder(orderNumber: string): Promise<RazorpayCheckoutData> {
  const response = await api.post<ApiResponse<RazorpayCheckoutData>>('/shop/payments/razorpay/order', { order_number: orderNumber });
  return response.data.data;
}

export async function fetchOrders(page = 1): Promise<{ orders: Order[]; current_page: number; last_page: number }> {
  const response = await api.get<ApiResponse<any>>('/shop/orders', { params: { page } });
  const data = response.data.data;
  if (data.data) {
    return {
      orders: data.data,
      current_page: data.current_page,
      last_page: data.last_page,
    };
  }
  return { orders: data, current_page: 1, last_page: 1 };
}

export async function fetchOrderDetail(orderNumber: string): Promise<OrderDetail> {
  const response = await api.get<ApiResponse<OrderDetail>>(`/shop/orders/${orderNumber}`);
  return response.data.data;
}

export async function cancelOrder(orderNumber: string, reason?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(`/shop/orders/${orderNumber}/cancel`, { reason });
  return response.data.data;
}

// ── Review API ──

export async function submitReview(slug: string, payload: {
  rating: number;
  title?: string;
  comment?: string;
  variant_id?: number;
  order_id?: number;
}): Promise<void> {
  await api.post<ApiResponse<void>>(`/shop/products/${slug}/reviews`, payload);
}
