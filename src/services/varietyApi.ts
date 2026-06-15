/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — VARIETY API
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: We organize API calls by domain (variety, disease, etc.)
 * into separate files. This keeps the code modular and makes it
 * easy to find all variety-related endpoints in one place.
 */

import { api } from './api';

// ── Types ──
// LEARN: Defining TypeScript interfaces for API responses gives us
// autocomplete and compile-time type checking. If the backend
// changes its response shape, TypeScript will catch mismatches.

export type FruitType =
  | 'apple'
  | 'pear'
  | 'plum'
  | 'peach'
  | 'apricot'
  | 'cherry'
  | 'persimmon'
  | 'pomegranate';

export interface VarietyListItem {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
  fruit_type: FruitType;
  fruit_type_label: string;
  season_type: string;
  season_label: string;
  season_label_hi: string;
  season_color: string;
  altitude: string;
  view_count: number;
  is_featured: boolean;
  is_export_quality: boolean;
  hero_image: string | null;
}

export interface SeasonFilter {
  key: string;
  label: string;
  labelHi: string;
  color: string;
}

export interface FruitFilter {
  key: string;
  label: string;
  labelHi: string;
}

export interface VarietyListResponse {
  data: VarietyListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    seasons: SeasonFilter[];
    fruit_types: FruitFilter[];
  };
}

export interface VarietyDetail {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
  scientific_name: string | null;
  season_type: string;
  season_label: { en: string; hi: string };
  season_color: string;
  fruit_type: FruitType;
  fruit_type_label: string;
  fruit_specific_attributes: Record<string, string> | null;
  origin: string | null;
  introduction_year: number | null;
  is_featured: boolean;
  is_export_quality: boolean;
  view_count: number;
  hero_image: string | null;
  gallery: { thumb: string; full: string }[];
  description_en: string | null;
  description_hi: string | null;
  growing_tips: string | null;
  // Tree
  tree_vigor: string | null;
  growth_habit: string | null;
  bearing_age_years: number | null;
  pollinators: string | null;
  is_self_fertile: boolean;
  // Fruit
  fruit_size: string | null;
  fruit_shape: string | null;
  skin_color: string | null;
  flesh_color: string | null;
  avg_fruit_weight_g: number | null;
  taste_profile: string | null;
  // Harvest
  days_to_maturity: number | null;
  harvest_window: string | null;
  storage_life: string | null;
  storage_months: number | null;
  // Climate
  altitude_min_feet: number | null;
  altitude_max_feet: number | null;
  altitude_ideal: string | null;
  chilling_hours_min: number | null;
  temp_ideal_min_c: number | null;
  temp_ideal_max_c: number | null;
  rain_tolerance: string | null;
  // Disease
  disease_resistance: {
    id: number;
    name: string;
    name_hi: string | null;
    resistance_level: string;
    resistance_label: string;
  }[];
  // Rootstocks
  recommended_rootstocks: {
    id: number;
    name: string;
    full_name: string | null;
    image: string | null;
  }[];
  // Related blog posts
  related_blog_posts: {
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    image: string | null;
    relation_kind: string;
    published_at: string | null;
  }[];
  // Market
  market_demand: string | null;
  market_price_tier: number;
  yield_kg_per_tree: number | null;
  yield_potential: string | null;
  // Related
  related: {
    id: number;
    slug: string;
    name_en: string;
    name_hi: string | null;
    season_type: string;
    season_label: string;
    season_color: string;
    fruit_type: FruitType;
    altitude: string;
    hero_image: string | null;
    view_count: number;
  }[];
}

// ── API Functions ──

/**
 * Fetch the list of apple varieties with optional filtering.
 *
 * @param params - Query parameters: search, season, page, per_page
 */
export async function fetchVarieties(params?: {
  search?: string;
  season?: string;
  fruit?: FruitType | 'all';
  page?: number;
  per_page?: number;
}): Promise<VarietyListResponse> {
  const query = { fruit: 'apple', ...params };
  const response = await api.get<VarietyListResponse>('/varieties', { params: query });
  return response.data;
}

/**
 * Fetch a single variety by its slug.
 *
 * @param slug - The URL-friendly identifier (e.g., "anna", "royal-delicious")
 */
export async function fetchVarietyDetail(slug: string): Promise<VarietyDetail> {
  const response = await api.get<VarietyDetail>(`/varieties/${slug}`);
  return response.data;
}

/**
 * Toggle like on a variety.
 */
export async function toggleVarietyLike(slug: string): Promise<{ is_liked: boolean; likes_count: number }> {
  const response = await api.post<{ data: { is_liked: boolean; likes_count: number } }>(`/varieties/${slug}/like`);
  return response.data.data;
}

/**
 * Toggle save/bookmark on a variety.
 */
export async function toggleVarietySave(slug: string): Promise<{ saved: boolean }> {
  const response = await api.post<{ data: { saved: boolean } }>(`/varieties/${slug}/save`);
  return response.data.data;
}

/**
 * Fetch comments for a variety.
 */
export async function fetchVarietyComments(slug: string): Promise<{ id: number; body: string; author: string; created_at: string }[]> {
  const response = await api.get<{ data: { id: number; body: string; author: string; created_at: string }[] }>(`/varieties/${slug}/comments`);
  return response.data.data;
}

/**
 * Post a comment on a variety.
 */
export async function postVarietyComment(
  slug: string,
  body: string,
  parentId?: number | null,
): Promise<{ id: number; body: string; author: string; created_at: string }> {
  const response = await api.post<{ data: { id: number; body: string; author: string; created_at: string } }>(`/varieties/${slug}/comments`, {
    body,
    parent_id: parentId ?? null,
  });
  return response.data.data;
}
