/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISEASE API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

// ── Types ──

export interface DiseaseListItem {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  severity_label: {
    label: string;
    labelHi: string;
    color: string;
    bg: string;
    icon: string;
  };
  category: string;
  category_label: {
    label: string;
    labelHi: string;
    icon: string;
  };
  description: string;
  hero_image: string | null;
  view_count: number;
  hp_common: boolean;
}

export interface SeverityFilter {
  key: string;
  label: string;
  labelHi: string;
  color: string;
}

export interface CategoryFilter {
  key: string;
  label: string;
  labelHi: string;
}

export interface DiseaseListResponse {
  data: DiseaseListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    categories: CategoryFilter[];
    severities: SeverityFilter[];
  };
}

export interface DiseaseDetail {
  id: number;
  slug: string;
  name_en: string;
  name_hi: string | null;
  scientific_name: string | null;
  also_known_as: string[];
  category: string;
  category_label: {
    label: string;
    labelHi: string;
    icon: string;
  };
  severity: string;
  severity_label: {
    label: string;
    labelHi: string;
    color: string;
    bg: string;
    icon: string;
  };
  view_count: number;
  hp_common: boolean;
  hero_image: string | null;
  gallery: { thumb: string; full: string }[];
  description: Array<{ en?: string; hi?: string }> | string | null;
  season_start_stage: string | null;
  season_end_stage: string | null;
  spreads_via: string[];
  identification: Array<{ en?: string; hi?: string }> | null;
  confused_with: string[] | Array<{ name?: string; en?: string }> | null;
  prevention: Array<{ en?: string; hi?: string }> | null;
  organic_treatment: Array<{ en?: string; hi?: string }> | null;
  yield_loss_min_pct: number | null;
  yield_loss_max_pct: number | null;
  yield_loss_note: Array<{ en?: string; hi?: string }> | null;
  altitude_min_feet: number | null;
  altitude_max_feet: number | null;
  risk_temp_min_c: number | null;
  risk_temp_max_c: number | null;
  risk_humidity_pct: number | null;
  related: {
    id: number;
    slug: string;
    name_en: string;
    name_hi: string | null;
    severity: string;
    severity_label: { label: string; labelHi: string; color: string; bg: string; icon: string };
    category: string;
    description: string;
    hero_image: string | null;
  }[];
}

// ── API Functions ──

export async function fetchDiseases(params?: {
  search?: string;
  category?: string;
  severity?: string;
  page?: number;
  per_page?: number;
}): Promise<DiseaseListResponse> {
  const response = await api.get<DiseaseListResponse>('/diseases', { params });
  return response.data;
}

export async function fetchDiseaseDetail(slug: string): Promise<DiseaseDetail> {
  const response = await api.get<DiseaseDetail>(`/diseases/${slug}`);
  return response.data;
}
