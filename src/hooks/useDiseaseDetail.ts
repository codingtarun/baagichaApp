/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE DISEASE DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchDiseaseDetail, type DiseaseDetail } from '../services/diseaseApi';

interface UseDiseaseDetailResult {
  disease: DiseaseDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDiseaseDetail(slug: string): UseDiseaseDetailResult {
  const [disease, setDisease] = useState<DiseaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDiseaseDetail(slug);
      setDisease(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load disease details');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    disease,
    loading,
    error,
    refresh: load,
  };
}
