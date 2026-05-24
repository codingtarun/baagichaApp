/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ORCHARD DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchOrchard, type OrchardDetail } from '../services/orchardApi';

export interface UseOrchardDetailResult {
  orchard: OrchardDetail | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export function useOrchardDetail(orchardId: number | null): UseOrchardDetailResult {
  const [orchard, setOrchard] = useState<OrchardDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!orchardId) return;
    setError(null);
    try {
      const response = await fetchOrchard(orchardId);
      setOrchard(response.data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load orchard');
    }
  }, [orchardId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    if (!orchardId) {
      setOrchard(null);
      return;
    }
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [orchardId, load]);

  return { orchard, loading, error, refreshing, refresh };
}
