/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ORDERS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOrders, fetchOrderDetail, cancelOrder, type Order, type OrderDetail } from '../services/shopApi';

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchOrders(targetPage);
        if (append) {
          setOrders((prev) => [...prev, ...response.orders]);
        } else {
          setOrders(response.orders);
        }
        setLastPage(response.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [load]);

  return {
    orders,
    loading,
    error,
    page,
    lastPage,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}

interface UseOrderDetailResult {
  order: OrderDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  cancel: (reason?: string) => Promise<void>;
}

export function useOrderDetail(orderNumber: string): UseOrderDetailResult {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrderDetail(orderNumber);
      setOrder(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = useCallback(
    async (reason?: string) => {
      try {
        await cancelOrder(orderNumber, reason);
        await load();
      } catch (err: any) {
        throw err;
      }
    },
    [orderNumber, load]
  );

  return {
    order,
    loading,
    error,
    refresh: load,
    cancel,
  };
}
