/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GROUPS API SERVICE
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';
import type { FeedPost } from './postApi';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GroupCard {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  visibility: 'public' | 'private';
  members_count: number;
  posts_count: number;
  cover: string | null;
  avatar: string | null;
  is_member: boolean;
  my_role: 'owner' | 'admin' | 'moderator' | 'member' | null;
  is_pending_request: boolean;
  created_at: string;
}

export interface GroupRule {
  id: number;
  title: string;
  body: string | null;
}

export interface GroupDetail extends GroupCard {
  join_approval: 'auto' | 'manual';
  is_active: boolean;
  pending_requests_count: number;
  created_by: {
    id: number;
    name: string;
    avatar: string | null;
  };
  cover_media?: {
    url: string;
    thumb: string;
    medium: string;
    large: string;
  } | null;
  avatar_media?: {
    url: string;
    thumb: string;
    medium: string;
  } | null;
  rules: GroupRule[];
}

export interface GroupMember {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string | null;
    is_expert: boolean;
  };
  role: string;
  joined_at: string;
}

export interface JoinRequest {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  message: string | null;
  status: string;
  created_at: string;
}

// ── Discovery ──

export async function getGroups(params?: {
  search?: string;
  visibility?: 'public' | 'private' | 'all';
  sort?: 'popular' | 'newest' | 'name';
  page?: number;
  per_page?: number;
}): Promise<GroupCard[]> {
  const response = await api.get<ApiResponse<GroupCard[]>>('/groups', { params });
  return response.data.data;
}

export async function getJoinedGroups(page = 1, perPage = 10): Promise<GroupCard[]> {
  const response = await api.get<ApiResponse<GroupCard[]>>('/groups/joined', {
    params: { page, per_page: perPage },
  });
  return response.data.data;
}

// ── Detail ──

export async function getGroupDetail(slug: string): Promise<GroupDetail> {
  const response = await api.get<ApiResponse<GroupDetail>>(`/groups/${slug}`);
  return response.data.data;
}

// ── CRUD ──

export async function createGroup(data: {
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  cover?: { uri: string; type: string; name: string };
  avatar?: { uri: string; type: string; name: string };
  rules?: { title: string; body?: string }[];
}): Promise<GroupDetail> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('visibility', data.visibility);
  if (data.description) formData.append('description', data.description);
  if (data.cover) {
    formData.append('cover', { uri: data.cover.uri, type: data.cover.type, name: data.cover.name } as any);
  }
  if (data.avatar) {
    formData.append('avatar', { uri: data.avatar.uri, type: data.avatar.type, name: data.avatar.name } as any);
  }
  if (data.rules) {
    data.rules.forEach((rule, index) => {
      formData.append(`rules[${index}][title]`, rule.title);
      if (rule.body) formData.append(`rules[${index}][body]`, rule.body);
    });
  }

  const response = await api.post<ApiResponse<GroupDetail>>('/groups', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function updateGroup(slug: string, data: Partial<{
  name: string;
  description: string;
  visibility: 'public' | 'private';
  cover: { uri: string; type: string; name: string };
  avatar: { uri: string; type: string; name: string };
  rules: { title: string; body?: string }[];
}>): Promise<GroupDetail> {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.visibility) formData.append('visibility', data.visibility);
  if (data.cover) {
    formData.append('cover', { uri: data.cover.uri, type: data.cover.type, name: data.cover.name } as any);
  }
  if (data.avatar) {
    formData.append('avatar', { uri: data.avatar.uri, type: data.avatar.type, name: data.avatar.name } as any);
  }
  if (data.rules) {
    data.rules.forEach((rule, index) => {
      formData.append(`rules[${index}][title]`, rule.title);
      if (rule.body) formData.append(`rules[${index}][body]`, rule.body);
    });
  }

  const response = await api.post<ApiResponse<GroupDetail>>(`/groups/${slug}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function deleteGroup(slug: string): Promise<void> {
  await api.delete(`/groups/${slug}`);
}

// ── Membership ──

export async function joinGroup(slug: string, message?: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<ApiResponse<null>>(`/groups/${slug}/join`, { message });
  return { success: response.data.success, message: response.data.message };
}

export async function leaveGroup(slug: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<ApiResponse<null>>(`/groups/${slug}/leave`);
  return { success: response.data.success, message: response.data.message };
}

export async function cancelJoinRequest(slug: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post<ApiResponse<null>>(`/groups/${slug}/cancel-request`);
  return { success: response.data.success, message: response.data.message };
}

export async function getGroupMembers(
  slug: string,
  params?: { role?: string; search?: string; page?: number; per_page?: number }
): Promise<GroupMember[]> {
  const response = await api.get<ApiResponse<GroupMember[]>>(`/groups/${slug}/members`, { params });
  return response.data.data;
}

export async function updateMemberRole(slug: string, userId: number, role: string): Promise<void> {
  await api.post(`/groups/${slug}/members/${userId}/role`, { role });
}

export async function removeMember(slug: string, userId: number): Promise<void> {
  await api.delete(`/groups/${slug}/members/${userId}`);
}

// ── Join Requests ──

export async function getJoinRequests(slug: string): Promise<JoinRequest[]> {
  const response = await api.get<ApiResponse<JoinRequest[]>>(`/groups/${slug}/join-requests`);
  return response.data.data;
}

export async function approveJoinRequest(slug: string, requestId: number): Promise<void> {
  await api.post(`/groups/${slug}/join-requests/${requestId}/approve`);
}

export async function rejectJoinRequest(slug: string, requestId: number): Promise<void> {
  await api.post(`/groups/${slug}/join-requests/${requestId}/reject`);
}

// ── Group Feed ──

export async function getGroupFeed(slug: string, page = 1, perPage = 10): Promise<FeedPost[]> {
  const response = await api.get<ApiResponse<FeedPost[]>>(`/groups/${slug}/feed`, {
    params: { page, per_page: perPage },
  });
  return response.data.data;
}

export async function createGroupPost(
  slug: string,
  data: {
    body: string;
    type: string;
    images?: { uri: string; type: string; name: string }[];
    is_pinned?: boolean;
  }
): Promise<FeedPost> {
  const formData = new FormData();
  formData.append('body', data.body);
  formData.append('type', data.type);
  if (data.is_pinned) formData.append('is_pinned', '1');
  if (data.images) {
    data.images.forEach((img, index) => {
      formData.append(`images[${index}]`, { uri: img.uri, type: img.type, name: img.name } as any);
    });
  }

  const response = await api.post<ApiResponse<FeedPost>>(`/groups/${slug}/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function deleteGroupPost(slug: string, postId: number): Promise<void> {
  await api.delete(`/groups/${slug}/posts/${postId}`);
}
