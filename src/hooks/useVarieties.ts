/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE VARIETIES HOOK
 * ═══════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  fetchVarieties,
  type VarietyListItem,
  type SeasonFilter,
} from '../services/varietyApi';

// ── Altitude Filter Types ──
export type AltitudeRange = 'all' | 'low' | 'mid' | 'high' | 'very-high';

export interface AltitudeFilter {
  key: AltitudeRange;
  label: string;
  labelHi: string;
  min: number;
  max: number;
}

export const ALTITUDE_FILTERS: AltitudeFilter[] = [
  { key: 'all', label: 'All Heights', labelHi: 'सभी ऊँचाई', min: 0, max: Infinity },
  { key: 'low', label: 'Low', labelHi: 'निम्न', min: 0, max: 5000 },
  { key: 'mid', label: 'Mid', labelHi: 'मध्यम', min: 5000, max: 7000 },
  { key: 'high', label: 'High', labelHi: 'उच्च', min: 7000, max: 9000 },
  { key: 'very-high', label: 'Very High', labelHi: 'अत्यधिक', min: 9000, max: Infinity },
];

// ── Helper: Parse altitude string → min/max feet ──
// Handles: "6000-8000 ft", "5000 – 7000 ft", "< 5000 ft", "> 9000 ft"
export function parseAltitude(altitude: string): { min: number; max: number } {
  const clean = altitude.toLowerCase().replace(/,/g, '').replace(/feet|ft/g, '').trim();

  // Range: "6000-8000" or "6000 – 8000"
  const rangeMatch = clean.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10) };
  }

  // Less than: "< 5000"
  const ltMatch = clean.match(/<\s*(\d+)/);
  if (ltMatch) {
    return { min: 0, max: parseInt(ltMatch[1], 10) };
  }

  // Greater than: "> 9000"
  const gtMatch = clean.match(/>\s*(\d+)/);
  if (gtMatch) {
    return { min: parseInt(gtMatch[1], 10), max: Infinity };
  }

  // Single number: "6500"
  const singleMatch = clean.match(/(\d+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    return { min: val, max: val };
  }

  return { min: 0, max: Infinity };
}

// ── Helper: Check if variety altitude overlaps with filter range ──
function matchesAltitudeFilter(altitude: string, filterKey: AltitudeRange): boolean {
  if (filterKey === 'all') return true;
  const { min: vMin, max: vMax } = parseAltitude(altitude);
  const filter = ALTITUDE_FILTERS.find((f) => f.key === filterKey)!;
  // Overlap: variety range intersects with filter range
  return vMin < filter.max && vMax > filter.min;
}

// ── Hook Result Type ──
interface UseVarietiesResult {
  varieties: VarietyListItem[];
  seasonFilters: SeasonFilter[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  activeSeason: string;
  setActiveSeason: (season: string) => void;
  activeAltitude: AltitudeRange;
  setActiveAltitude: (altitude: AltitudeRange) => void;
  altitudeFilters: AltitudeFilter[];
  loadMore: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
}

export function useVarieties(): UseVarietiesResult {
  const [varieties, setVarieties] = useState<VarietyListItem[]>([]);
  const [seasonFilters, setSeasonFilters] = useState<SeasonFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeSeason, setActiveSeason] = useState('all');
  const [activeAltitude, setActiveAltitude] = useState<AltitudeRange>('all');

  const isFirstMount = useRef(true);

  const load = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = { page: targetPage };
        if (activeSeason !== 'all') {
          params.season = activeSeason;
        }
        const response = await fetchVarieties(params);

        if (append) {
          setVarieties((prev) => [...prev, ...response.data]);
        } else {
          setVarieties(response.data);
        }
        setSeasonFilters(response.filters.seasons);
        setLastPage(response.meta.last_page);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load varieties');
      } finally {
        setLoading(false);
      }
    },
    [activeSeason]
  );

  // Reset page & reload when season changes
  useEffect(() => {
    setPage(1);
    load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeason]);

  // Load more pages
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (page > 1) {
      load(page, true);
    }
  }, [page, load]);

  const loadMore = useCallback(() => {
    if (page < lastPage && !loading) {
      setPage((p) => p + 1);
    }
  }, [page, lastPage, loading]);

  const refresh = useCallback(async () => {
    setPage(1);
    await load(1, false);
  }, [load]);

  // Filter loaded varieties by altitude (client-side)
  const filteredVarieties = useMemo(() => {
    if (activeAltitude === 'all') return varieties;
    return varieties.filter((v) => matchesAltitudeFilter(v.altitude, activeAltitude));
  }, [varieties, activeAltitude]);

  // Sort by altitude (low to high)
  const sortedVarieties = useMemo(() => {
    return [...filteredVarieties].sort((a, b) => {
      const aAlt = parseAltitude(a.altitude);
      const bAlt = parseAltitude(b.altitude);
      return aAlt.min - bAlt.min;
    });
  }, [filteredVarieties]);

  return {
    varieties: sortedVarieties,
    seasonFilters,
    loading,
    error,
    page,
    lastPage,
    activeSeason,
    setActiveSeason,
    activeAltitude,
    setActiveAltitude,
    altitudeFilters: ALTITUDE_FILTERS,
    loadMore,
    refresh,
    hasMore: page < lastPage,
  };
}
