/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * All orchard management API calls: orchards, blocks, varieties,
 * spray logs, disease logs, and pest trackers.
 */

import { api } from './api';

// ── Shared Types ──

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Orchard Types ──

export interface Orchard {
  id: number;
  orchard_name: string;
  state: string;
  district: string;
  tehsil: string | null;
  village: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude_meters: number | null;
  altitude_feet: number | null;
  altitude_band: string | null;
  altitude_source: string | null;
  aspect: string | null;
  area_unit: string | null;
  area_local_value: number | null;
  area_hectare: number | null;
  total_trees: number | null;
  trees_below_7: number | null;
  trees_between_7_15: number | null;
  trees_above_15: number | null;
  farming_type: string;
  irrigation_type: string | null;
  has_cold_storage: boolean;
  has_ca_storage: boolean;
  has_packing_house: boolean;
  uses_anti_hail_net: boolean;
  is_frost_prone: boolean;
  is_hail_prone: boolean;
  is_near_water_body: boolean;
  microclimate_notes: string | null;
  primary_market: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  blocks_count?: number;
  varieties_count?: number;
  featured_image_url?: string | null;
}

export interface OrchardDetail extends Orchard {
  varieties: OrchardVariety[];
  blocks: OrchardBlock[];

}

export interface CreateOrchardRequest {
  orchard_name: string;
  state: string;
  district: string;
  tehsil?: string;
  village?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  altitude_meters?: number;
  altitude_source?: 'manual' | 'gps' | 'map';
  aspect?: 'north' | 'south' | 'east' | 'west' | 'mixed';
  area_unit?: 'bigha' | 'kanal' | 'nali' | 'hectare';
  area_local_value?: number;
  total_trees?: number;
  trees_below_7?: number;
  trees_between_7_15?: number;
  trees_above_15?: number;
  farming_type: 'conventional' | 'integrated' | 'organic' | 'transitioning_organic' | 'regenerative' | 'transitioning_regenerative';
  irrigation_type?: 'rain_fed' | 'drip' | 'sprinkler' | 'flood' | 'mixed';
  has_cold_storage?: boolean;
  has_ca_storage?: boolean;
  has_packing_house?: boolean;
  uses_anti_hail_net?: boolean;
  is_frost_prone?: boolean;
  is_hail_prone?: boolean;
  is_near_water_body?: boolean;
  microclimate_notes?: string;
  primary_market?: 'mandi' | 'direct_buyer' | 'cooperative' | 'export' | 'mixed';
  variety_ids?: number[];
}

export interface UpdateOrchardRequest extends Partial<CreateOrchardRequest> {}

// ── Block Types ──

export interface BlockVariety {
  id: number;
  variety_id: number;
  rootstock_id: number;
  variety?: { id: number; name_en: string; name_hi: string; slug: string } | null;
  rootstock?: { id: number; name: string } | null;
}

export interface OrchardBlock {
  id: number;
  user_orchard_id: number;
  name: string;
  area_unit: string | null;
  area_local_value: number | null;
  plant_count: number | null;
  spacing_meters: string | null;
  soil_type: string | null;
  soil_ph: number | null;
  irrigation_type: string | null;
  aspect: string | null;
  slope_percent: number | null;
  is_sunny_exposure: boolean;
  wind_exposure: string | null;
  frost_pocket_risk: string | null;
  created_at: string;
  updated_at: string;
  block_varieties?: BlockVariety[];
}

export interface CreateBlockRequest {
  name: string;
  block_varieties?: { variety_id: number; rootstock_id: number }[];
  area_unit?: 'bigha' | 'kanal' | 'nali' | 'hectare';
  area_local_value?: number;
  plant_count?: number;
  spacing_meters?: string;
  soil_type?: 'loam' | 'clay' | 'sandy' | 'silty' | 'peaty';
  soil_ph?: number;
  irrigation_type?: 'drip' | 'sprinkler' | 'flood' | 'rainfed';
  aspect?: 'north' | 'south' | 'east' | 'west' | 'flat';
  slope_percent?: number;
  is_sunny_exposure?: boolean;
  wind_exposure?: 'sheltered' | 'moderate' | 'exposed';
  frost_pocket_risk?: 'low' | 'medium' | 'high';
}

export interface UpdateBlockRequest extends Partial<CreateBlockRequest> {}

// ── Variety Types ──

export interface OrchardVariety {
  id: number;
  user_orchard_id: number;
  variety_id: number;
  rootstock_id: number;
  variety_name_custom: string | null;
  num_trees: number | null;
  planted_year: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  variety?: { id: number; name_en: string; name_hi: string; slug: string } | null;
  rootstock?: { id: number; name: string; name_hi: string | null } | null;
}

export interface CreateOrchardVarietyRequest {
  variety_id: number;
  variety_name_custom?: string;
  num_trees?: number;
  rootstock_id: number;
  planted_year?: number;
  notes?: string;
}

export interface UpdateOrchardVarietyRequest extends Partial<CreateOrchardVarietyRequest> {}

// ── Spray Log Types ──

export interface SprayLog {
  id: number;
  user_orchard_id: number;
  orchard_block_id: number | null;
  disease_id: number | null;
  spray_schedule_stage_id: number | null;
  spray_date: string;
  spray_time: string | null;
  chemical_name: string | null;
  quantity_used: number | null;
  unit: string | null;
  water_used_liters: number | null;
  area_covered_kanal: number | null;
  weather_condition: string | null;
  notes: string | null;
  photos: string[] | null;
  reward_points: number;
  created_at: string;
  disease?: { id: number; name: string } | null;
  block?: { id: number; name: string } | null;
}

export interface CreateSprayLogRequest {
  orchard_block_id?: number;
  disease_id?: number;
  spray_schedule_stage_id?: number;
  spray_date: string;
  spray_time?: string;
  chemical_name?: string;
  quantity_used?: number;
  unit?: string;
  water_used_liters?: number;
  area_covered_kanal?: number;
  weather_condition?: 'sunny' | 'cloudy' | 'windy' | 'rainy';
  notes?: string;
  photos?: string[];
}

// ── Disease Log Types ──

export interface DiseasePressureLog {
  id: number;
  user_orchard_id: number;
  orchard_block_id: number | null;
  disease_id: number;
  prediction_date: string;
  prediction_type: string | null;
  risk_score: number | null;
  risk_level: string | null;
  trigger_factors: string[] | null;
  weather_snapshot: Record<string, unknown> | null;
  spray_recommendation: string | null;
  spray_recommendation_hi: string | null;
  is_confirmed: boolean;
  farmer_feedback: string | null;
  disease?: { id: number; name: string } | null;
  block?: { id: number; name: string } | null;
}

export interface CreateDiseaseLogRequest {
  orchard_block_id?: number;
  disease_id: number;
  prediction_date: string;
  prediction_type?: string;
  risk_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  trigger_factors?: string[];
  weather_snapshot?: Record<string, unknown>;
  spray_recommendation?: string;
  spray_recommendation_hi?: string;
  is_confirmed?: boolean;
  farmer_feedback?: string;
}

export interface UpdateDiseaseLogRequest extends Partial<CreateDiseaseLogRequest> {}

// ── Pest Tracker Types ──

export interface PestTracker {
  id: number;
  user_orchard_id: number;
  orchard_block_id: number | null;
  pest_model_id: number;
  season_year: number;
  biofix_date: string | null;
  biofix_source: string | null;
  cumulative_dd: number | null;
  last_event_triggered: string | null;
  next_event_at_dd: number | null;
  risk_level: string | null;
  block?: { id: number; name: string } | null;
  pest_model?: { id: number; name: string } | null;
}

export interface CreatePestTrackerRequest {
  orchard_block_id?: number;
  pest_model_id: number;
  season_year: number;
  biofix_date?: string;
  biofix_source?: string;
  cumulative_dd?: number;
  last_event_triggered?: string;
  next_event_at_dd?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdatePestTrackerRequest extends Partial<CreatePestTrackerRequest> {}

// ── API Functions: Orchards ──

export async function fetchOrchards(): Promise<{ data: Orchard[] }> {
  const response = await api.get<ApiResponse<Orchard[]>>('/orchards');
  return response.data;
}

export async function fetchOrchard(id: number): Promise<{ data: OrchardDetail }> {
  const response = await api.get<ApiResponse<OrchardDetail>>(`/orchards/${id}`);
  return response.data;
}

export async function createOrchard(data: CreateOrchardRequest): Promise<ApiResponse<Orchard>> {
  const response = await api.post<ApiResponse<Orchard>>('/orchards', data);
  return response.data;
}

export async function updateOrchard(id: number, data: UpdateOrchardRequest): Promise<ApiResponse<Orchard>> {
  const response = await api.put<ApiResponse<Orchard>>(`/orchards/${id}`, data);
  return response.data;
}

export async function deleteOrchard(id: number): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(`/orchards/${id}`);
  return response.data;
}

// ── API Functions: Blocks ──

export async function fetchBlocks(orchardId: number): Promise<{ orchard_id: number; blocks: OrchardBlock[] }> {
  const response = await api.get<{ orchard_id: number; blocks: OrchardBlock[] }>(`/orchards/${orchardId}/blocks`);
  return response.data;
}

export async function createBlock(orchardId: number, data: CreateBlockRequest): Promise<{ message: string; block: OrchardBlock }> {
  const response = await api.post<{ message: string; block: OrchardBlock }>(`/orchards/${orchardId}/blocks`, data);
  return response.data;
}

export async function updateBlock(orchardId: number, blockId: number, data: UpdateBlockRequest): Promise<{ message: string; block: OrchardBlock }> {
  const response = await api.put<{ message: string; block: OrchardBlock }>(`/orchards/${orchardId}/blocks/${blockId}`, data);
  return response.data;
}

export async function deleteBlock(orchardId: number, blockId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/orchards/${orchardId}/blocks/${blockId}`);
  return response.data;
}

// ── API Functions: Varieties ──

export async function fetchOrchardVarieties(orchardId: number): Promise<{ orchard_id: number; data: OrchardVariety[] }> {
  const response = await api.get<{ orchard_id: number; data: OrchardVariety[] }>(`/orchards/${orchardId}/varieties`);
  return response.data;
}

export async function createOrchardVariety(orchardId: number, data: CreateOrchardVarietyRequest): Promise<{ message: string; data: OrchardVariety }> {
  const response = await api.post<{ message: string; data: OrchardVariety }>(`/orchards/${orchardId}/varieties`, data);
  return response.data;
}

export async function updateOrchardVariety(orchardId: number, varietyId: number, data: UpdateOrchardVarietyRequest): Promise<{ message: string; data: OrchardVariety }> {
  const response = await api.put<{ message: string; data: OrchardVariety }>(`/orchards/${orchardId}/varieties/${varietyId}`, data);
  return response.data;
}

export async function deleteOrchardVariety(orchardId: number, varietyId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/orchards/${orchardId}/varieties/${varietyId}`);
  return response.data;
}

// ── API Functions: Spray Logs ──

export async function fetchSprayLogs(orchardId: number): Promise<{ orchard_id: number; logs: SprayLog[] }> {
  const response = await api.get<{ orchard_id: number; logs: SprayLog[] }>(`/orchards/${orchardId}/spray-logs`);
  return response.data;
}

export async function createSprayLog(orchardId: number, data: CreateSprayLogRequest): Promise<{ message: string; log: SprayLog; reward_points: number }> {
  const response = await api.post<{ message: string; log: SprayLog; reward_points: number }>(`/orchards/${orchardId}/spray-logs`, data);
  return response.data;
}

// ── API Functions: Disease Logs ──

export async function fetchDiseaseLogs(orchardId: number): Promise<{ orchard_id: number; data: DiseasePressureLog[] }> {
  const response = await api.get<{ orchard_id: number; data: DiseasePressureLog[] }>(`/orchards/${orchardId}/disease-logs`);
  return response.data;
}

export async function createDiseaseLog(orchardId: number, data: CreateDiseaseLogRequest): Promise<{ message: string; data: DiseasePressureLog }> {
  const response = await api.post<{ message: string; data: DiseasePressureLog }>(`/orchards/${orchardId}/disease-logs`, data);
  return response.data;
}

export async function updateDiseaseLog(orchardId: number, logId: number, data: UpdateDiseaseLogRequest): Promise<{ message: string; data: DiseasePressureLog }> {
  const response = await api.put<{ message: string; data: DiseasePressureLog }>(`/orchards/${orchardId}/disease-logs/${logId}`, data);
  return response.data;
}

export async function deleteDiseaseLog(orchardId: number, logId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/orchards/${orchardId}/disease-logs/${logId}`);
  return response.data;
}

// ── API Functions: Pest Trackers ──

export async function fetchPestTrackers(orchardId: number): Promise<{ orchard_id: number; data: PestTracker[] }> {
  const response = await api.get<{ orchard_id: number; data: PestTracker[] }>(`/orchards/${orchardId}/pest-trackers`);
  return response.data;
}

export async function createPestTracker(orchardId: number, data: CreatePestTrackerRequest): Promise<{ message: string; data: PestTracker }> {
  const response = await api.post<{ message: string; data: PestTracker }>(`/orchards/${orchardId}/pest-trackers`, data);
  return response.data;
}

export async function updatePestTracker(orchardId: number, trackerId: number, data: UpdatePestTrackerRequest): Promise<{ message: string; data: PestTracker }> {
  const response = await api.put<{ message: string; data: PestTracker }>(`/orchards/${orchardId}/pest-trackers/${trackerId}`, data);
  return response.data;
}

export async function deletePestTracker(orchardId: number, trackerId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/orchards/${orchardId}/pest-trackers/${trackerId}`);
  return response.data;
}
