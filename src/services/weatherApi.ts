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
