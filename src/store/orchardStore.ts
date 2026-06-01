/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD STORE (Zustand + MMKV)
 * ═══════════════════════════════════════════════════════════════
 *
 * Global orchard selection state. Persists the user's selected
 * orchard across app restarts. All orchard-scoped screens
 * (weather, spray schedule, predictions) read from here.
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { Orchard } from '../services/orchardApi';

// ── MMKV Instance ──
let mmkvInstance: MMKV | null = null;
try {
  mmkvInstance = new MMKV({ id: 'orchard-storage' });
} catch {
  console.warn('[OrchardStore] MMKV init failed');
}

const orchardStorage = {
  set: (key: string, value: string) => mmkvInstance?.set(key, value),
  getString: (key: string): string | undefined => mmkvInstance?.getString(key),
  delete: (key: string) => mmkvInstance?.delete(key),
};

// ── Types ──
export interface OrchardSummary {
  id: number;
  orchard_name: string;
  village: string | null;
  district: string | null;
  state: string | null;
  altitude_meters: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface OrchardState {
  orchards: OrchardSummary[];
  selectedOrchardId: number | null;
  isLoading: boolean;

  // Computed
  selectedOrchard: OrchardSummary | null;

  // Actions
  setOrchards: (orchards: OrchardSummary[]) => void;
  setSelectedOrchardId: (id: number | null) => void;
  selectOrchard: (id: number) => void;
  clear: () => void;
}

// ── Helpers ──
function getStoredId(): number | null {
  const raw = orchardStorage.getString('selectedOrchardId');
  if (!raw) return null;
  const id = parseInt(raw, 10);
  return isNaN(id) ? null : id;
}

function setStoredId(id: number | null) {
  if (id === null) {
    orchardStorage.delete('selectedOrchardId');
  } else {
    orchardStorage.set('selectedOrchardId', String(id));
  }
}

// ── Store ──
export const useOrchardStore = create<OrchardState>((set, get) => ({
  orchards: [],
  selectedOrchardId: getStoredId(),
  isLoading: false,

  get selectedOrchard() {
    const { orchards, selectedOrchardId } = get();
    if (!selectedOrchardId) return null;
    return orchards.find((o) => o.id === selectedOrchardId) ?? null;
  },

  setOrchards: (orchards) => {
    set({ orchards });

    // Auto-select first orchard if none selected
    const currentId = get().selectedOrchardId;
    if (!currentId && orchards.length > 0) {
      const firstId = orchards[0].id;
      setStoredId(firstId);
      set({ selectedOrchardId: firstId });
    }
  },

  setSelectedOrchardId: (id) => {
    setStoredId(id);
    set({ selectedOrchardId: id });
  },

  selectOrchard: (id) => {
    setStoredId(id);
    set({ selectedOrchardId: id });
  },

  clear: () => {
    orchardStorage.delete('selectedOrchardId');
    set({ orchards: [], selectedOrchardId: null });
  },
}));
