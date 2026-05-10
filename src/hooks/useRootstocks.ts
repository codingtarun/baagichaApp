/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE ROOTSTOCKS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchRootstocks,
  type RootstockListItem,
  type VigourFilter,
} from '../services/rootstockApi';

interface UseRootstocksResult {
  rootstocks: RootstockListItem[];
  vigourFilters: VigourFilter[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  activeVigour: string;
  setActiveVigour: (vigour: string) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useRootstocks(): UseRootstocksResult {
  const [rootstocks, setRootstocks] = useState<RootstockListItem[]>([]);
  const [vigourFilters, setVigourFilters] = useState<VigourFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeVigour, setActiveVigour] = useState('all');

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page: targetPage };
        if (activeVigour !== 'all') {
          params.vigour = activeVigour;
        }
        const response = await fetchRootstocks(params);

        if (append) {
          setRootstocks((prev) => [...prev, ...response.data]);
        } else {
          setRootstocks(response.data);
        }
        setVigourFilters(response.filters.vigour);
        setLastPage(response.meta.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load rootstocks');
      } finally {
        setLoading(false);
      }
    },
    [activeVigour]
  );

  useEffect(() => {
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVigour]);

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
    rootstocks,
    vigourFilters,
    loading,
    error,
    page,
    lastPage,
    activeVigour,
    setActiveVigour,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
