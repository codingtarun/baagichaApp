/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMMUNITY EVENT REPORT API SERVICE
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';
import type { FeedPost } from './postApi';

export interface ReportType {
  id: number;
  name_en: string;
  name_hi: string | null;
  category: string;
  urgency_level: 'critical' | 'high' | 'medium' | 'low';
  icon: string | null;
}

export interface DiseasePickerItem {
  id: number;
  name_en: string;
  name_hi: string | null;
}

export interface ReportTypesResponse {
  report_types: ReportType[];
  diseases: DiseasePickerItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * GET /api/v1/report-types
 */
export async function fetchReportTypes(): Promise<ReportTypesResponse> {
  const response = await api.get<ApiResponse<ReportTypesResponse>>('/report-types');
  return response.data.data;
}

/**
 * POST /api/v1/posts (type=report)
 */
export async function createReportPost(data: {
  report_type_id: number;
  latitude: number;
  longitude: number;
  disease_id?: number;
  body?: string;
  images?: { uri: string; type: string; name: string }[];
}): Promise<FeedPost> {
  const formData = new FormData();
  formData.append('type', 'report');
  formData.append('visibility', 'public');
  formData.append('report_type_id', String(data.report_type_id));
  formData.append('latitude', String(data.latitude));
  formData.append('longitude', String(data.longitude));
  formData.append('body', data.body ?? '');

  if (data.disease_id) {
    formData.append('disease_id', String(data.disease_id));
  }

  if (data.images) {
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, {
        uri: image.uri,
        type: image.type,
        name: image.name,
      } as any);
    });
  }

  const response = await api.post<ApiResponse<FeedPost>>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}
