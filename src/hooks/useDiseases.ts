/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE DISEASES HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchDiseases,
  type DiseaseListItem,
  type SeverityFilter,
  type CategoryFilter,
} from '../services/diseaseApi';

interface UseDiseasesResult {
  diseases: DiseaseListItem[];
  severityFilters: SeverityFilter[];
  categoryFilters: CategoryFilter[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  activeSeverity: string;
  setActiveSeverity: (severity: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useDiseases(): UseDiseasesResult {
  const [diseases, setDiseases] = useState<DiseaseListItem[]>([]);
  const [severityFilters, setSeverityFilters] = useState<SeverityFilter[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page: targetPage };
        if (activeSeverity !== 'all') {
          params.severity = activeSeverity;
        }
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        const response = await fetchDiseases(params);

        if (append) {
          setDiseases((prev) => [...prev, ...response.data]);
        } else {
          setDiseases(response.data);
        }
        setSeverityFilters(response.filters.severities);
        setCategoryFilters(response.filters.categories);
        setLastPage(response.meta.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load diseases');
      } finally {
        setLoading(false);
      }
    },
    [activeSeverity, activeCategory]
  );

  useEffect(() => {
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeverity, activeCategory]);

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
    diseases,
    severityFilters,
    categoryFilters,
    loading,
    error,
    page,
    lastPage,
    activeSeverity,
    setActiveSeverity,
    activeCategory,
    setActiveCategory,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
