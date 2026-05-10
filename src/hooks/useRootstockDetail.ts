/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ROOTSTOCK DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchRootstockDetail, type RootstockDetail } from '../services/rootstockApi';

interface UseRootstockDetailResult {
  rootstock: RootstockDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRootstockDetail(slug: string): UseRootstockDetailResult {
  const [rootstock, setRootstock] = useState<RootstockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRootstockDetail(slug);
      setRootstock(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load rootstock details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    rootstock,
    loading,
    error,
    refresh: load,
  };
}
