/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE BLOGS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchBlogs,
  type BlogListItem,
  type CategoryFilter,
} from '../services/blogApi';

interface UseBlogsResult {
  posts: BlogListItem[];
  featured: BlogListItem[];
  categoryFilters: CategoryFilter[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useBlogs(): UseBlogsResult {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [featured, setFeatured] = useState<BlogListItem[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page: targetPage };
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        const response = await fetchBlogs(params);

        if (append) {
          setPosts((prev) => [...prev, ...response.data]);
        } else {
          setPosts(response.data);
          setFeatured(response.featured ?? []);
        }
        setCategoryFilters(response.filters.categories);
        setLastPage(response.meta.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    },
    [activeCategory]
  );

  useEffect(() => {
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

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
    posts,
    featured,
    categoryFilters,
    loading,
    error,
    page,
    lastPage,
    activeCategory,
    setActiveCategory,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
