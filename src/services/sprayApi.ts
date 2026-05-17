/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SPRAY SCHEDULE API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';
import { Linking } from 'react-native';

// ── Types ──

export interface SprayFruitConfig {
  label: string;
  labelHi: string;
  icon: string;
  color: string;
  available: boolean;
}

export interface SprayDiseaseAlert {
  id: number;
  slug: string | null;
  name: string;
  nameHi: string;
  icon: string;
  sev: 'critical' | 'high' | 'medium' | 'low';
  desc: string;
}

export interface SprayChemical {
  id: number;
  slug: string | null;
  name: string;
  dose: string;
  target: string | null;
  phi: string | null;
  note: string | null;
}

export interface SprayStage {
  no: number;
  name: string;
  nameHi: string;
  icon: string;
  color: string;
  timing: string;
  timingHi: string;
  status: 'done' | 'active' | 'upcoming';
  desc: string | null;
  diseases: SprayDiseaseAlert[];
  fungicides: SprayChemical[];
  insecticides: SprayChemical[];
  tips: string[];
}

export interface SpraySchedule {
  region: string;
  label: string;
  sublabel: string;
  doseNote: string;
  currentStage: number;
  stages: SprayStage[];
}

export interface SprayScheduleResponse {
  success: boolean;
  fruit: string;
  region: string;
  location: { name: string; altitude: number };
  altitude_band: string | null;
  schedule: SpraySchedule;
  fruit_config: Record<string, SprayFruitConfig>;
  compat_map: Record<string, { avoid: string[]; ok: string[] }>;
  nutrient_rules: Array<{
    id: number;
    nutrient_name_en: string;
    nutrient_name_hi: string;
    timing_stage_key: string;
    dosage_per_200l: string;
    note_en: string | null;
  }>;
}

// ── API Functions ──

export async function fetchSpraySchedule(
  fruit: string = 'apple',
  region: string = 'hp'
): Promise<SprayScheduleResponse> {
  const response = await api.get('/spray-schedule', { params: { fruit, region } });
  return response.data;
}

export async function fetchFruitConfig(): Promise<Record<string, SprayFruitConfig>> {
  const response = await api.get('/spray-schedule/fruits');
  return response.data.data;
}

export async function fetchCompatMap(): Promise<Record<string, { avoid: string[]; ok: string[] }>> {
  const response = await api.get('/spray-schedule/compat-map');
  return response.data.data;
}

export async function markTaskDone(
  taskKey: string,
  title?: string,
  orchardId?: number
): Promise<{ success: boolean; task_key: string; already_logged: boolean }> {
  const response = await api.post('/spray-schedule/task-done', {
    task_key: taskKey,
    title,
    orchard_id: orchardId,
  });
  return response.data;
}

export async function toggleSpraySave(
  type: 'Disease' | 'Chemical',
  id: number
): Promise<{ success: boolean; saved: boolean }> {
  const response = await api.post('/spray-schedule/save', { type, id });
  return response.data;
}

// ── WhatsApp Share Helper ──

export function shareOnWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text);
  const url = `whatsapp://send?text=${encoded}`;
  Linking.openURL(url).catch(() => {
    // Fallback to web WhatsApp if app isn't installed
    Linking.openURL(`https://wa.me/?text=${encoded}`);
  });
}
