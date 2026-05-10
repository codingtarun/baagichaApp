/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOG API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

// ── Types ──

export interface BlogCategory {
  slug: string;
  name_en: string;
  name_hi: string | null;
  color: string;
}

export interface BlogListItem {
  id: number;
  slug: string;
  title_en: string;
  title_hi: string | null;
  excerpt_en: string | null;
  excerpt_hi: string | null;
  reading_time_min: number;
  view_count: number;
  featured_image: string | null;
  category: BlogCategory | null;
  author: { name: string };
}

export interface CategoryFilter {
  key: string;
  label: string;
  labelHi: string;
  color: string;
}

export interface BlogListResponse {
  data: BlogListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    categories: CategoryFilter[];
  };
  featured: BlogListItem[];
}

export interface BlogDetail {
  id: number;
  slug: string;
  title_en: string;
  title_hi: string | null;
  excerpt_en: string | null;
  excerpt_hi: string | null;
  body_en: string | null;
  body_hi: string | null;
  reading_time_min: number;
  view_count: number;
  published_at: string | null;
  category: BlogCategory | null;
  author: { name: string; role: string };
  featured_image: string | null;
  gallery: { thumb: string; full: string }[];
  tags: { slug: string; name_en: string }[];
  related: {
    slug: string;
    title_en: string;
    title_hi: string | null;
    excerpt_en: string | null;
    reading_time_min: number;
    category: BlogCategory | null;
  }[];
}

// ── API Functions ──

export async function fetchBlogs(params?: {
  q?: string;
  category?: string;
  page?: number;
  per_page?: number;
}): Promise<BlogListResponse> {
  const response = await api.get<BlogListResponse>('/blog', { params });
  return response.data;
}

export async function fetchBlogDetail(slug: string): Promise<BlogDetail> {
  const response = await api.get<BlogDetail>(`/blog/${slug}`);
  return response.data;
}
