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

export interface VarietyListItem {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
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
  disease_resistance: Record<string, string> | null;
  susceptibility: (string | Record<string, string>)[] | null;
  recommended_rootstocks: string[];
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
  page?: number;
  per_page?: number;
}): Promise<VarietyListResponse> {
  const response = await api.get<VarietyListResponse>('/varieties', { params });
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
