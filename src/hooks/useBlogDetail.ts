/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE BLOG DETAIL HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchBlogDetail, type BlogDetail } from '../services/blogApi';

interface UseBlogDetailResult {
  post: BlogDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useBlogDetail(slug: string): UseBlogDetailResult {
  const [post, setPost] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogDetail(slug);
      setPost(data);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    post,
    loading,
    error,
    refresh: load,
  };
}
