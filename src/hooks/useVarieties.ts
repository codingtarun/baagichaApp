/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE VARIETIES HOOK
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Custom hooks let us extract and reuse stateful logic.
 * This hook manages fetching the variety list, loading state,
 * errors, and pagination — all in one reusable function.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchVarieties,
  type VarietyListItem,
  type SeasonFilter,
} from '../services/varietyApi';

interface UseVarietiesResult {
  varieties: VarietyListItem[];
  seasonFilters: SeasonFilter[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  activeSeason: string;
  setActiveSeason: (season: string) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useVarieties(): UseVarietiesResult {
  const [varieties, setVarieties] = useState<VarietyListItem[]>([]);
  const [seasonFilters, setSeasonFilters] = useState<SeasonFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeSeason, setActiveSeason] = useState('all');

  // LEARN: useRef persists across renders without causing re-renders.
  // We use it to track whether this is the first mount so we don't
  // trigger the page-change effect on initial load.
  const isFirstMount = useRef(true);

  /**
   * Core fetch function.
   * LEARN: useCallback memoizes this function so it only changes
   * when `activeSeason` changes. This prevents unnecessary re-renders.
   */
  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page: targetPage };
        if (activeSeason !== 'all') {
          params.season = activeSeason;
        }
        const response = await fetchVarieties(params);

        if (append) {
          setVarieties((prev) => [...prev, ...response.data]);
        } else {
          setVarieties(response.data);
        }
        setSeasonFilters(response.filters.seasons);
        setLastPage(response.meta.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load varieties');
      } finally {
        setLoading(false);
      }
    },
    [activeSeason]
  );

  // Initial load + reload when season changes
  useEffect(() => {
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeason]);

  // Load more pages when page increments
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
    varieties,
    seasonFilters,
    loading,
    error,
    page,
    lastPage,
    activeSeason,
    setActiveSeason,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
