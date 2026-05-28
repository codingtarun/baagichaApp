/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE LOCATIONS HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchStates, fetchDistricts, type State, type District } from '../services/locationApi';
import { showToast } from '../store/toastStore';

export interface UseLocationsResult {
  states: State[];
  districts: District[];
  loadingStates: boolean;
  loadingDistricts: boolean;
  loadDistricts: (stateId: number) => Promise<void>;
}

export function useLocations(): UseLocationsResult {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    fetchStates()
      .then((res) => setStates(res.data))
      .catch(() => showToast('Failed to load states', 'error'))
      .finally(() => setLoadingStates(false));
  }, []);

  const loadDistricts = useCallback(async (stateId: number) => {
    setLoadingDistricts(true);
    try {
      const res = await fetchDistricts(stateId);
      setDistricts(res.data);
    } catch {
      showToast('Failed to load districts', 'error');
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  return { states, districts, loadingStates, loadingDistricts, loadDistricts };
}
