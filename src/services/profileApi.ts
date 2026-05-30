/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PROFILE API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Endpoints for the logged-in user's profile content:
 *   • Own posts
 *   • Liked posts
 *   • Social activities
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

export interface UserActivity {
  id: number;
  type: 'post_created' | 'post_liked' | 'post_commented' | 'user_followed' | 'post_shared' | 'comment_replied';
  description: string;
  description_hi: string | null;
  created_at: string;
  related_post?: FeedPost;
  related_user?: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface ProfileStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
  orchards_count: number;
}

/**
 * GET /api/v1/users/me/posts
 * Fetch posts created by the logged-in user.
 */
export async function getMyPosts(page = 1, perPage = 10): Promise<FeedPost[]> {
  const response = await api.get<ApiResponse<FeedPost[]>>('/users/me/posts', {
    params: { page, per_page: perPage },
  });
  return response.data.data;
}

/**
 * GET /api/v1/users/me/liked-posts
 * Fetch posts liked by the logged-in user.
 */
export async function getMyLikedPosts(page = 1, perPage = 10): Promise<FeedPost[]> {
  const response = await api.get<ApiResponse<FeedPost[]>>('/users/me/liked-posts', {
    params: { page, per_page: perPage },
  });
  return response.data.data;
}

/**
 * GET /api/v1/users/me/activities
 * Fetch social activities for the logged-in user.
 */
export async function getMyActivities(page = 1, perPage = 20): Promise<UserActivity[]> {
  const response = await api.get<ApiResponse<UserActivity[]>>('/users/me/activities', {
    params: { page, per_page: perPage },
  });
  return response.data.data;
}

/**
 * GET /api/v1/users/me/stats
 * Fetch quick stats for the logged-in user's profile header.
 */
export async function getMyProfileStats(): Promise<ProfileStats> {
  const response = await api.get<ApiResponse<ProfileStats>>('/users/me/stats');
  return response.data.data;
}
