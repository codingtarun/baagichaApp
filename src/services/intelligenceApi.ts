/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DAILY INTELLIGENCE API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

// ── Types ──

export type IntelligenceCategory = 'do_now' | 'prepare' | 'routine' | 'avoid_today' | 'insight';
export type IntelligenceActionType =
  | 'spray'
  | 'avoid_spray'
  | 'scout'
  | 'irrigate'
  | 'fertilize'
  | 'thin'
  | 'harvest'
  | 'watch'
  | 'note'
  | 'protect';

export interface IntelligenceItem {
  id: number;
  category: IntelligenceCategory;
  action_type: IntelligenceActionType;
  priority_score: number;
  content: {
    title_en: string;
    title_hi: string;
    reason_en: string;
    reason_hi: string;
    safety_notes: { en: string; hi: string };
    cta: { en: string; hi: string };
    confidence_en?: string;
    confidence_hi?: string;
  };
  explanation: { en: string; hi: string };
  trigger_factors: Array<{ key: string; value: string | number; label: string }>;
  linked_entities: Record<string, number> | null;
  user_action: 'done' | 'snoozed' | 'dismissed' | 'clicked' | null;
  user_action_at: string | null;
  feedback: { was_correct?: boolean; notes?: string; observed_outcome?: string } | null;
  orchard_id: number | null;
  block_id: number | null;
}

export interface DailyIntelligence {
  id: number;
  date: string;
  generated_at: string;
  generation_source: string;
  status: 'active' | 'dismissed' | 'snoozed' | 'acted';
  snoozed_until: string | null;
  priority_score: number;
  top_action_type: IntelligenceActionType | null;
  summary: { en: string; hi: string };
  categories: Record<IntelligenceCategory, number>;
  total_items: number;
  top_priority_score: number;
  weather_snapshot: Record<string, unknown>;
  orchard_state: Record<string, unknown>;
  input_signals: Record<string, unknown>;
  block_breakdown: Array<{
    block_id: number | null;
    block_name: string;
    orchard_id: number;
    priority_score: number;
    actions_count: number;
  }>;
  user_reaction: Record<string, unknown> | null;
  items: IntelligenceItem[];
}

export interface DailyIntelligenceResponse {
  success: boolean;
  message: string;
  data: DailyIntelligence;
}

export interface IntelligenceHistoryResponse {
  success: boolean;
  data: DailyIntelligence[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ── API Functions ──

export async function fetchTodayIntelligence(): Promise<DailyIntelligence> {
  const response = await api.get<DailyIntelligenceResponse>('/intelligence/today');
  return response.data.data;
}

export async function fetchIntelligenceByDate(date: string): Promise<DailyIntelligence> {
  const response = await api.get<DailyIntelligenceResponse>(`/intelligence/${date}`);
  return response.data.data;
}

export async function fetchIntelligenceHistory(page = 1, perPage = 14): Promise<IntelligenceHistoryResponse> {
  const response = await api.get<IntelligenceHistoryResponse>('/intelligence/history', {
    params: { page, per_page: perPage },
  });
  return response.data;
}

export async function dismissIntelligenceCard(
  cardId: number,
  action: 'dismiss' | 'snooze',
  snoozeMinutes?: number
): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>(
    `/intelligence/${cardId}/dismiss`,
    { action, snooze_minutes: snoozeMinutes }
  );
  return response.data;
}

export async function expandIntelligenceCard(cardId: number): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>(`/intelligence/${cardId}/expand`);
  return response.data;
}

export async function markItemDone(itemId: number, notes?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>(`/intelligence/items/${itemId}/done`, {
    notes,
  });
  return response.data;
}

export async function snoozeItem(
  itemId: number,
  snoozeMinutes: number
): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>(`/intelligence/items/${itemId}/snooze`, {
    snooze_minutes: snoozeMinutes,
  });
  return response.data;
}

export async function submitItemFeedback(
  itemId: number,
  wasCorrect: boolean,
  notes?: string,
  observedOutcome?: string
): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>(`/intelligence/items/${itemId}/feedback`, {
    was_correct: wasCorrect,
    notes,
    observed_outcome: observedOutcome,
  });
  return response.data;
}
