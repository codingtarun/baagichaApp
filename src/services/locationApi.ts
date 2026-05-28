/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — LOCATION API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Fetch Indian states and districts from the backend.
 */

import { api } from './api';

export interface State {
  id: number;
  name: string;
  code: string | null;
}

export interface District {
  id: number;
  state_id: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchStates(): Promise<{ data: State[] }> {
  const response = await api.get<{ data: State[] }>('/locations/states');
  return response.data;
}

export async function fetchDistricts(stateId: number): Promise<{ data: District[] }> {
  const response = await api.get<{ data: District[] }>('/locations/districts', {
    params: { state_id: stateId },
  });
  return response.data;
}
