/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE VARIETY DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: This hook fetches a single variety's full details.
 * It manages loading, error, and data states so the detail
 * screen component can focus purely on rendering.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchVarietyDetail, type VarietyDetail } from '../services/varietyApi';

interface UseVarietyDetailResult {
  variety: VarietyDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useVarietyDetail(slug: string): UseVarietyDetailResult {
  const [variety, setVariety] = useState<VarietyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVarietyDetail(slug);
      setVariety(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load variety details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    variety,
    loading,
    error,
    refresh: load,
  };
}
