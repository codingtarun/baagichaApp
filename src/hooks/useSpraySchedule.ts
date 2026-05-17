/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE SPRAY SCHEDULE HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchSpraySchedule,
  markTaskDone,
  toggleSpraySave,
  type SprayScheduleResponse,
  type SprayStage,
} from '../services/sprayApi';
import { showToast } from '../store/toastStore';

export interface UseSprayScheduleResult {
  data: SprayScheduleResponse | null;
  stages: SprayStage[];
  currentStageIndex: number;
  selectedStageIndex: number;
  loading: boolean;
  error: string | null;
  fruit: string;
  region: string;
  setFruit: (f: string) => void;
  setRegion: (r: string) => void;
  setSelectedStageIndex: (i: number) => void;
  refresh: () => Promise<void>;
  markStageDone: (stageIndex: number) => Promise<void>;
  toggleWatch: (type: 'Disease' | 'Chemical', id: number) => Promise<void>;
  tankSize: number;
  setTankSize: (v: number) => void;
}

const TANK_OPTIONS = [100, 200, 300, 500];

export function useSpraySchedule(): UseSprayScheduleResult {
  const [fruit, setFruit] = useState('apple');
  const [region, setRegion] = useState('hp');
  const [data, setData] = useState<SprayScheduleResponse | null>(null);
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tankSize, setTankSize] = useState(200);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSpraySchedule(fruit, region);
      setData(response);
      // Auto-select current stage on first load
      setSelectedStageIndex((prev) => {
        if (prev === 0 && response.schedule?.currentStage != null) {
          return response.schedule.currentStage;
        }
        return prev;
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load spray schedule');
    } finally {
      setLoading(false);
    }
  }, [fruit, region]);

  useEffect(() => {
    load();
  }, [load]);

  const markStageDone = useCallback(
    async (stageIndex: number) => {
      const stage = data?.schedule?.stages[stageIndex];
      if (!stage) return;

      const taskKey = `${fruit}-${region}-stage-${stage.no}`;
      try {
        await markTaskDone(taskKey, `${stage.name} spray completed`);
        showToast('Task marked as done!', 'success');
        // Refresh to get updated status
        await load();
      } catch (err: any) {
        showToast(err?.message ?? 'Failed to mark task', 'error');
      }
    },
    [data, fruit, region, load]
  );

  const toggleWatch = useCallback(
    async (type: 'Disease' | 'Chemical', id: number) => {
      try {
        const result = await toggleSpraySave(type, id);
        showToast(result.saved ? 'Saved to watchlist' : 'Removed from watchlist', 'success');
      } catch (err: any) {
        showToast(err?.message ?? 'Please sign in to save items', 'warning');
      }
    },
    []
  );

  return {
    data,
    stages: data?.schedule?.stages ?? [],
    currentStageIndex: data?.schedule?.currentStage ?? 0,
    selectedStageIndex,
    loading,
    error,
    fruit,
    region,
    setFruit: (f) => {
      setFruit(f);
      setSelectedStageIndex(0);
    },
    setRegion: (r) => {
      setRegion(r);
      setSelectedStageIndex(0);
    },
    setSelectedStageIndex,
    refresh: load,
    markStageDone,
    toggleWatch,
    tankSize,
    setTankSize,
  };
}

export { TANK_OPTIONS };
