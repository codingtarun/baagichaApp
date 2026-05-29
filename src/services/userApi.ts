/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USER API SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Endpoints for user discovery, profiles, and social actions.
 */

import { api } from './api';

export interface SuggestedUser {
  id: number;
  name: string;
  avatar: string | null;
  is_expert: boolean;
  title: string | null;
  location: {
    village: string;
    district: string;
    state: string;
  } | null;
  followers_count: number;
  experience_level: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string | null;
  preferred_language: string;
  is_active: boolean;
  is_expert: boolean;
  created_at: string;
  followers_count: number;
  following_count: number;
  is_following: boolean;
  connection_status: string | null;
  profile: {
    display_name: string | null;
    bio_en: string | null;
    bio_hi: string | null;
    whatsapp_number: string | null;
    farmer_since_year: number | null;
    experience_level: string | null;
    reputation_score: number | null;
    is_verified_farmer: boolean;
    completion_score: number | null;
  } | null;
  expert_profile: {
    title: string | null;
    bio: string | null;
    experience_years: number | null;
    specializations: string[] | null;
    orchard_location: string | null;
    certifications: string[] | null;
    languages_spoken: string[] | null;
    availability_status: string;
    charges: {
      format: string;
      price: string;
      currency: string;
      duration_minutes: number | null;
      description: string | null;
      is_active: boolean;
    }[];
  } | null;
  orchards: {
    id: number;
    name: string;
    state: string;
    district: string;
    village: string;
    altitude_meters: number;
    area_display: string;
    total_trees: number;
    farming_type: string;
    irrigation_type: string;
    has_cold_storage: boolean;
    has_ca_storage: boolean;
    has_packing_house: boolean;
    uses_anti_hail_net: boolean;
    varieties: {
      variety_name: string | null;
      num_trees: number;
      planted_year: number | null;
    }[];
  }[];
}

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

/**
 * GET /api/users/suggested
 *
 * type = 'experts' → returns is_expert = true users
 * type = 'friends' → returns non-experts, not already connected
 */
export async function getSuggestedUsers(type: 'experts' | 'friends' = 'experts', perPage = 10): Promise<SuggestedUser[]> {
  const response = await api.get<ApiResponse<SuggestedUser[]>>('/users/suggested', {
    params: { type, per_page: perPage },
  });
  return response.data.data;
}

/**
 * GET /api/v1/users/{id}
 * Fetch full public profile for a user.
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  const response = await api.get<ApiResponse<UserProfile>>(`/users/${userId}`);
  return response.data.data;
}

/**
 * POST /api/v1/users/{id}/follow
 * Toggle follow status for a user.
 */
export async function toggleFollow(userId: number): Promise<{ is_following: boolean }> {
  const response = await api.post<ApiResponse<{ is_following: boolean }>>(`/users/${userId}/follow`);
  return response.data.data;
}

/**
 * POST /api/v1/users/{id}/connect
 * Send a connection request.
 */
export async function sendConnection(userId: number): Promise<{ status: string }> {
  const response = await api.post<ApiResponse<{ status: string }>>(`/users/${userId}/connect`);
  return response.data.data;
}
