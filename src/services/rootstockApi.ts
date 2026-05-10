/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ROOTSTOCK API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

// ── Types ──

export interface RootstockListItem {
  id: number;
  slug: string;
  name: string;
  name_hi: string | null;
  vigour_type: string;
  vigour_label: string;
  vigour_label_hi: string;
  vigour_color: string;
  vigour_pct: number | null;
  hp_recommended: boolean;
  avg_rating: number | null;
  rating_count: number;
  hero_image: string | null;
}

export interface VigourFilter {
  key: string;
  label: string;
  labelHi: string;
  color: string;
}

export interface RootstockListResponse {
  data: RootstockListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    vigour: VigourFilter[];
  };
}

export interface RootstockDetail {
  id: number;
  slug: string;
  name: string;
  full_name: string | null;
  name_hi: string | null;
  vigour_type: string;
  vigour_label: string;
  vigour_color: string;
  vigour_pct: number | null;
  hp_recommended: boolean;
  developed_by: string | null;
  developed_year: number | null;
  parentage: string | null;
  view_count: number;
  avg_rating: number | null;
  rating_count: number;
  hero_image: string | null;
  gallery: { thumb: string; full: string }[];

  // Overview
  description_en: string | null;
  description_hi: string | null;

  // Planting
  spacing_m_row: number | null;
  spacing_m_tree: number | null;
  density_per_ha_min: number | null;
  density_per_ha_max: number | null;
  years_to_first_crop: number | null;
  productive_life_years: number | null;
  needs_staking: boolean;
  needs_irrigation: boolean;
  planting_notes_en: string | null;
  planting_notes_hi: string | null;

  // Resistance
  collar_rot_resistance: number | null;
  collar_rot_res_color: string;
  collar_rot_res_label: string;
  woolly_aphid_resistance: number | null;
  woolly_aphid_res_color: string;
  woolly_aphid_res_label: string;
  replant_disease_res: number | null;
  replant_disease_res_color: string;
  replant_disease_res_label: string;
  fire_blight_res: number | null;
  fire_blight_res_color: string;
  fire_blight_res_label: string;
  collar_rot_warning_en: string | null;
  anchorage: string | null;

  // Soil
  soil_depth_cm_min: number | null;
  soil_ph_min: number | null;
  soil_ph_max: number | null;
  cold_hardiness_feet: number | null;

  // Related
  related: {
    id: number;
    slug: string;
    name: string;
    name_hi: string | null;
    vigour_type: string;
    vigour_label: string;
    vigour_color: string;
    vigour_pct: number | null;
    spacing: string;
    hero_image: string | null;
  }[];
}

// ── API Functions ──

export async function fetchRootstocks(params?: {
  search?: string;
  vigour?: string;
  hp_recommended?: boolean;
  page?: number;
  per_page?: number;
}): Promise<RootstockListResponse> {
  const response = await api.get<RootstockListResponse>('/rootstocks', { params });
  return response.data;
}

export async function fetchRootstockDetail(slug: string): Promise<RootstockDetail> {
  const response = await api.get<RootstockDetail>(`/rootstocks/${slug}`);
  return response.data;
}
