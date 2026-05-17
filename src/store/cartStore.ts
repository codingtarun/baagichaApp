/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CART STORE (Zustand + MMKV)
 * ═══════════════════════════════════════════════════════════════
 *
 * Cart state with MMKV persistence. Syncs with backend when
 * user is authenticated. Guest users see auth prompt.
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { CartResponse, CartItem } from '../services/shopApi';
import { fetchCart, addToCart as addToCartApi, updateCartItem as updateCartItemApi, removeCartItem as removeCartItemApi } from '../services/shopApi';

// ── MMKV Storage Instance ──
let mmkvInstance: MMKV | null = null;

try {
  mmkvInstance = new MMKV({
    id: 'cart-storage',
    encryptionKey: 'baagicha-cart-key-2026',
  });
} catch (error) {
  console.warn('[CartStore] MMKV initialization failed. Cart will not persist across app restarts.');
}

const memoryStorage: Record<string, string> = {};

const cartStorage = {
  set: (key: string, value: string) => {
    if (mmkvInstance) mmkvInstance.set(key, value);
    else memoryStorage[key] = value;
  },
  getString: (key: string): string | undefined => {
    if (mmkvInstance) return mmkvInstance.getString(key);
    return memoryStorage[key];
  },
  delete: (key: string) => {
    if (mmkvInstance) mmkvInstance.delete(key);
    else delete memoryStorage[key];
  },
};

// ── Types ──

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  couponCode: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCart: () => Promise<void>;
  addItem: (variantId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
}

// ── Helper: Persist cart locally ──
function persistCart(items: CartItem[]) {
  cartStorage.set('cart_items', JSON.stringify(items));
}

function restoreCart(): CartItem[] {
  const json = cartStorage.getString('cart_items');
  if (json) {
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  }
  return [];
}

// ── Zustand Store ──
export const useCartStore = create<CartState>((set, get) => ({
  items: restoreCart(),
  itemCount: restoreCart().reduce((sum, item) => sum + item.quantity, 0),
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  shippingAmount: 0,
  total: 0,
  couponCode: null,
  isLoading: false,
  error: null,

  loadCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await fetchCart();
      set({
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        discountAmount: cart.discount_amount,
        taxAmount: cart.tax_amount,
        shippingAmount: cart.shipping_amount,
        total: cart.total,
        couponCode: cart.coupon_code,
        isLoading: false,
      });
      persistCart(cart.items);
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to load cart', isLoading: false });
    }
  },

  addItem: async (variantId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await addToCartApi(variantId, quantity);
      set({
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        discountAmount: cart.discount_amount,
        taxAmount: cart.tax_amount,
        shippingAmount: cart.shipping_amount,
        total: cart.total,
        couponCode: cart.coupon_code,
        isLoading: false,
      });
      persistCart(cart.items);
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to add item', isLoading: false });
      throw err;
    }
  },

  updateItem: async (itemId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await updateCartItemApi(itemId, quantity);
      set({
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        discountAmount: cart.discount_amount,
        taxAmount: cart.tax_amount,
        shippingAmount: cart.shipping_amount,
        total: cart.total,
        couponCode: cart.coupon_code,
        isLoading: false,
      });
      persistCart(cart.items);
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to update item', isLoading: false });
      throw err;
    }
  },

  removeItem: async (itemId: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await removeCartItemApi(itemId);
      set({
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        discountAmount: cart.discount_amount,
        taxAmount: cart.tax_amount,
        shippingAmount: cart.shipping_amount,
        total: cart.total,
        couponCode: cart.coupon_code,
        isLoading: false,
      });
      persistCart(cart.items);
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to remove item', isLoading: false });
      throw err;
    }
  },

  clearCart: () => {
    set({
      items: [],
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      total: 0,
      couponCode: null,
    });
    cartStorage.delete('cart_items');
  },

  setCoupon: (code: string | null) => {
    set({ couponCode: code });
  },
}));
