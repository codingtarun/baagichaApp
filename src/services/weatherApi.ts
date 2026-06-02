/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WEATHER API
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

export interface WeatherData {
  location_name: string;
  temperature: number;
  condition: string;
  humidity: number | null;
  wind_speed: number | null;
  spray_status: string;
  updated_at: string;
}

export interface WeatherAlert {
  type: string;
  severity: 'warning' | 'critical';
}

export interface WeatherResponse {
  success: boolean;
  data: WeatherData;
}

export interface WeatherAlertsResponse {
  success: boolean;
  has_alerts: boolean;
  alerts: WeatherAlert[];
  spray_status: string;
}

// ── NEW: Dashboard Types ──

export interface SprayRecommendation {
  recommendation: 'excellent' | 'good' | 'short' | 'avoid';
  reason: string;
  delta_t: number | null;
  next_window: {
    date: string;
    start_time: string;
    end_time: string | null;
    reason: string;
  } | null;
}

export interface FertigationRecommendation {
  recommendation: 'apply_now' | 'wait_for_rain' | 'avoid' | 'irrigate_first';
  reason: string;
  best_time: string | null;
}

export interface DiseaseRiskAssessment {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  active_diseases: string[];
  reason: string;
}

export interface Forecast7Day {
  date: string;
  temp_max_c: number | null;
  temp_min_c: number | null;
  condition: string;
  precipitation_mm: number;
  spray_suitable: boolean;
  fertigation_suitable: boolean;
  disease_risk: string;
}

export interface ActiveAlert {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface Trends30Day {
  total_rainfall_mm: number;
  rainfall_vs_avg: string;
  avg_temp_c: number | null;
  disease_pressure_trend: string;
  spray_windows_missed: number;
  next_optimal_spray_date: string | null;
}

export interface CurrentWeather {
  temp_c: number;
  feels_like_c: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  wind_direction: string;
  condition: string;
  icon: string;
  uv_index: number | null;
  delta_t: number | null;
  dew_point_c: number | null;
  updated_at: string;
}

export interface WeatherDashboardData {
  current: CurrentWeather;
  today_recommendations: {
    spray: SprayRecommendation;
    fertigation: FertigationRecommendation;
    disease_risk: DiseaseRiskAssessment;
  };
  forecast_7d: Forecast7Day[];
  active_alerts: ActiveAlert[];
  trends_30d: Trends30Day;
}

export interface WeatherDashboardResponse {
  success: boolean;
  data: WeatherDashboardData;
}

export interface WeatherHistoryItem {
  date: string;
  temp_max_c: number | null;
  temp_min_c: number | null;
  rainfall_mm: number;
  humidity_percent: number | null;
  wind_speed_kmh: number | null;
  spray_recommendation: string | null;
  fertigation_recommendation: string | null;
  disease_risk_score: number | null;
  disease_risk_level: string | null;
}

export interface WeatherHistoryResponse {
  success: boolean;
  data: {
    days_requested: number;
    days_available: number;
    history: WeatherHistoryItem[];
    summary: {
      total_rainfall_mm: number;
      avg_temp_max_c: number | null;
      spray_avoid_days: number;
      disease_high_risk_days: number;
    };
  };
}

// ── API Functions ──

export async function fetchWeather(
  lat?: number,
  lng?: number,
  locationName?: string
): Promise<WeatherResponse> {
  const params: Record<string, string | number> = {};
  if (lat !== undefined) params.latitude = lat;
  if (lng !== undefined) params.longitude = lng;
  if (locationName) params.location_name = locationName;

  const response = await api.get<WeatherResponse>('/weather/current', { params });
  return response.data;
}

export async function fetchWeatherAlerts(): Promise<WeatherAlertsResponse> {
  const response = await api.get<WeatherAlertsResponse>('/weather/alerts');
  return response.data;
}

/**
 * Fetch full weather dashboard (current + recommendations + forecast + alerts + trends)
 */
export async function fetchWeatherDashboard(): Promise<WeatherDashboardResponse> {
  const response = await api.get<WeatherDashboardResponse>('/weather/dashboard');
  return response.data;
}

/**
 * Fetch today's engine recommendations
 */
export async function fetchWeatherEngine(): Promise<{
  success: boolean;
  data: {
    spray: SprayRecommendation;
    fertigation: FertigationRecommendation;
    disease_risk: DiseaseRiskAssessment;
    generated_at: string;
  };
}> {
  const response = await api.get('/weather/engine');
  return response.data;
}

/**
 * Fetch weather history for past N days
 */
export async function fetchWeatherHistory(days = 30): Promise<WeatherHistoryResponse> {
  const response = await api.get<WeatherHistoryResponse>('/weather/history', {
    params: { days },
  });
  return response.data;
}

/**
 * Fetch fertigation recommendation for an orchard
 */
export async function fetchFertigationWindow(orchardId: number): Promise<{
  success: boolean;
  data: {
    orchard_id: number;
    orchard_name: string;
    recommendation: string;
    reason: string;
    best_time: string | null;
    rain_expected_mm: number | null;
    forecast_next_7d: any[];
  };
}> {
  const response = await api.get(`/orchards/${orchardId}/fertigation-window`);
  return response.data;
}

/**
 * Fetch Delta T + spray suitability for an orchard
 */
export async function fetchDeltaT(orchardId: number): Promise<{
  success: boolean;
  data: {
    orchard_id: number;
    orchard_name: string;
    temperature_c: number;
    humidity_percent: number;
    delta_t: number;
    spray_suitability: string;
    interpretation: string;
  };
}> {
  const response = await api.get(`/orchards/${orchardId}/delta-t`);
  return response.data;
}
