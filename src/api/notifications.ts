/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NOTIFICATIONS API
 * ═══════════════════════════════════════════════════════════════
 *
 * API endpoints for the in-app notification list.
 */

import { api } from '../services/api';
import type { InAppNotification } from '../store/notificationStore';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedNotifications {
  data: InAppNotification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// ── Fetch Notifications ──

export async function fetchNotifications(
  page = 1,
  perPage = 15,
  type?: string
): Promise<ApiResponse<PaginatedNotifications>> {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (type) {
    params.type = type;
  }

  const response = await api.get<ApiResponse<PaginatedNotifications>>('/notifications', {
    params,
  });
  return response.data;
}

export async function fetchRecentNotifications(
  limit = 5
): Promise<ApiResponse<InAppNotification[]>> {
  const response = await api.get<ApiResponse<InAppNotification[]>>('/notifications/recent', {
    params: { limit },
  });
  return response.data;
}

// ── Unread Count ──

export async function fetchUnreadCount(): Promise<ApiResponse<UnreadCountResponse>> {
  const response = await api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
  return response.data;
}

// ── Mark Read ──

export async function markNotificationAsRead(
  id: number
): Promise<ApiResponse<{ notification: InAppNotification }>> {
  const response = await api.post<ApiResponse<{ notification: InAppNotification }>>(
    `/notifications/${id}/read`
  );
  return response.data;
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<{ marked_count: boolean }>> {
  const response = await api.post<ApiResponse<{ marked_count: boolean }>>('/notifications/read-all');
  return response.data;
}

// ── Delete ──

export async function deleteNotification(id: number): Promise<ApiResponse<null>> {
  const response = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
  return response.data;
}

export async function deleteReadNotifications(): Promise<ApiResponse<{ deleted_count: number }>> {
  const response = await api.delete<ApiResponse<{ deleted_count: number }>>('/notifications/read');
  return response.data;
}
