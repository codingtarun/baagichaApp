/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — INTELLIGENCE STORE (Zustand + MMKV)
 * ═══════════════════════════════════════════════════════════════
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { DailyIntelligence } from '../services/intelligenceApi';
import * as intelligenceApi from '../services/intelligenceApi';

// ── MMKV Instance ──
let mmkvInstance: MMKV | null = null;
try {
  mmkvInstance = new MMKV({ id: 'intelligence-storage' });
} catch {
  console.warn('[IntelligenceStore] MMKV init failed');
}

const intelligenceStorage = {
  set: (key: string, value: string) => mmkvInstance?.set(key, value),
  getString: (key: string): string | undefined => mmkvInstance?.getString(key),
  delete: (key: string) => mmkvInstance?.delete(key),
};

// ── Types ──
interface IntelligenceState {
  todayCard: DailyIntelligence | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  expanded: boolean;
  dismissedUntil: string | null;

  // Actions
  fetchToday: (force?: boolean) => Promise<void>;
  refreshToday: () => Promise<void>;
  dismissCard: (minutes?: number) => Promise<void>;
  expandCard: () => void;
  markItemDone: (itemId: number, notes?: string) => Promise<void>;
  snoozeItem: (itemId: number, minutes: number) => Promise<void>;
  submitItemFeedback: (
    itemId: number,
    wasCorrect: boolean,
    notes?: string,
    observedOutcome?: string
  ) => Promise<void>;
  clear: () => void;
}

// ── Helpers ──
function getStoredDismissedUntil(): string | null {
  return intelligenceStorage.getString('intelligenceDismissedUntil') ?? null;
}

function setStoredDismissedUntil(until: string | null) {
  if (until === null) {
    intelligenceStorage.delete('intelligenceDismissedUntil');
  } else {
    intelligenceStorage.set('intelligenceDismissedUntil', until);
  }
}

function isDismissedExpired(until: string | null): boolean {
  if (!until) return true;
  return new Date(until) <= new Date();
}

// ── Store ──
export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  todayCard: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  expanded: false,
  dismissedUntil: getStoredDismissedUntil(),

  fetchToday: async (force = false) => {
    const { todayCard, dismissedUntil } = get();

    // Respect snooze unless forced
    if (!force && !isDismissedExpired(dismissedUntil)) {
      return;
    }

    // Use cached card if recent (< 30 min) and not forced
    const cachedAt = todayCard?.generated_at ? new Date(todayCard.generated_at).getTime() : 0;
    const isRecent = Date.now() - cachedAt < 30 * 60 * 1000;
    if (!force && todayCard && isRecent) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const card = await intelligenceApi.fetchTodayIntelligence();
      set({ todayCard: card, isLoading: false });

      // Clear expired snooze
      if (!isDismissedExpired(dismissedUntil)) {
        setStoredDismissedUntil(null);
        set({ dismissedUntil: null });
      }
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to load intelligence', isLoading: false });
    }
  },

  refreshToday: async () => {
    set({ isRefreshing: true });
    try {
      const card = await intelligenceApi.fetchTodayIntelligence();
      set({ todayCard: card, error: null });
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to refresh intelligence' });
    } finally {
      set({ isRefreshing: false });
    }
  },

  dismissCard: async (minutes) => {
    const { todayCard } = get();
    if (!todayCard) return;

    try {
      await intelligenceApi.dismissIntelligenceCard(todayCard.id, minutes ? 'snooze' : 'dismiss', minutes);

      if (minutes) {
        const until = new Date(Date.now() + minutes * 60 * 1000).toISOString();
        setStoredDismissedUntil(until);
        set({ dismissedUntil: until, expanded: false });
      } else {
        // Dismiss until next cron (tomorrow 2 AM)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(2, 0, 0, 0);
        setStoredDismissedUntil(tomorrow.toISOString());
        set({ dismissedUntil: tomorrow.toISOString(), expanded: false });
      }
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to dismiss card' });
    }
  },

  expandCard: () => {
    const { expanded, todayCard } = get();
    const newExpanded = !expanded;
    set({ expanded: newExpanded });

    if (newExpanded && todayCard) {
      intelligenceApi.expandIntelligenceCard(todayCard.id).catch(() => {
        // Non-critical tracking call
      });
    }
  },

  markItemDone: async (itemId, notes) => {
    try {
      await intelligenceApi.markItemDone(itemId, notes);
      set((state) => ({
        todayCard: state.todayCard
          ? {
              ...state.todayCard,
              items: state.todayCard.items.map((item) =>
                item.id === itemId ? { ...item, user_action: 'done' as const, user_action_at: new Date().toISOString() } : item
              ),
            }
          : null,
      }));
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to mark item done' });
    }
  },

  snoozeItem: async (itemId, minutes) => {
    try {
      await intelligenceApi.snoozeItem(itemId, minutes);
      set((state) => ({
        todayCard: state.todayCard
          ? {
              ...state.todayCard,
              items: state.todayCard.items.map((item) =>
                item.id === itemId
                  ? { ...item, user_action: 'snoozed' as const, user_action_at: new Date().toISOString() }
                  : item
              ),
            }
          : null,
      }));
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to snooze item' });
    }
  },

  submitItemFeedback: async (itemId, wasCorrect, notes, observedOutcome) => {
    try {
      await intelligenceApi.submitItemFeedback(itemId, wasCorrect, notes, observedOutcome);
      set((state) => ({
        todayCard: state.todayCard
          ? {
              ...state.todayCard,
              items: state.todayCard.items.map((item) =>
                item.id === itemId
                  ? { ...item, feedback: { ...(item.feedback ?? {}), was_correct: wasCorrect, notes, observed_outcome: observedOutcome } }
                  : item
              ),
            }
          : null,
      }));
    } catch (err: any) {
      set({ error: err?.message ?? 'Failed to submit feedback' });
    }
  },

  clear: () => {
    setStoredDismissedUntil(null);
    set({ todayCard: null, expanded: false, dismissedUntil: null, error: null });
  },
}));
