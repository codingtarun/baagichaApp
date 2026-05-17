/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE PRODUCTS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProducts, fetchFeaturedProducts, type ProductListItem } from '../services/shopApi';

export interface ProductFilters {
  category?: string;
  brand?: string;
  q?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort?: string;
}

interface UseProductsResult {
  products: ProductListItem[];
  featured: ProductListItem[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  total: number;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [featured, setFeatured] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFiltersState] = useState<ProductFilters>({});

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProducts({ ...filters, page: targetPage });
        if (append) {
          setProducts((prev) => [...prev, ...response.products]);
        } else {
          setProducts(response.products);
        }
        setLastPage(response.last_page);
        setTotal(response.total);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load products');
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const loadFeatured = useCallback(async () => {
    try {
      const data = await fetchFeaturedProducts();
      setFeatured(data);
    } catch (err: any) {
      console.warn('[useProducts] Failed to load featured:', err?.message);
    }
  }, []);

  // Reset page & reload when filters change
  useEffect(() => {
    setPage(1);
    load(1, false);
    loadFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Load more pages
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (page > 1) {
      load(page, true);
    }
  }, [page, load]);

  const loadMore = useCallback(() => {
    if (page < lastPage && !loading) {
      setPage((p) => p + 1);
    }
  }, [page, lastPage, loading]);

  const refresh = useCallback(async () => {
    setPage(1);
    await load(1, false);
    await loadFeatured();
  }, [load, loadFeatured]);

  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(newFilters);
  }, []);

  return {
    products,
    featured,
    loading,
    error,
    page,
    lastPage,
    total,
    filters,
    setFilters,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
