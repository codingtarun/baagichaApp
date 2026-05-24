/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ORCHARDS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchOrchards, deleteOrchard, type Orchard } from '../services/orchardApi';
import { showToast } from '../store/toastStore';

export interface UseOrchardsResult {
  orchards: Orchard[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  removeOrchard: (id: number) => Promise<void>;
}

export function useOrchards(): UseOrchardsResult {
  const [orchards, setOrchards] = useState<Orchard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchOrchards();
      setOrchards(response.data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load orchards');
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const removeOrchard = useCallback(async (id: number) => {
    try {
      await deleteOrchard(id);
      setOrchards((prev) => prev.filter((o) => o.id !== id));
      showToast('Orchard deleted', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to delete orchard', 'error');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  return { orchards, loading, error, refreshing, refresh, removeOrchard };
}
