/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE CART HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export function useCart() {
  const cart = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Auto-load cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      cart.loadCart();
    }
  }, [isAuthenticated]);

  return cart;
}
