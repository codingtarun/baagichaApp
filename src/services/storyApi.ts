/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STORIES API SERVICE
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

export interface StoryItem {
  id: number;
  type: 'image' | 'video' | 'text';
  body: string | null;
  media_url: string | null;
  is_viewed?: boolean;
  view_count?: number;
  created_at: string;
}

export interface StoryGroup {
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  unseen_count: number;
  stories: StoryItem[];
}

export interface StoryFeedResponse {
  my_stories: StoryItem[];
  feed: StoryGroup[];
}

export interface StoryViewer {
  id: number;
  name: string;
  avatar: string | null;
  viewed_at: string;
}

/**
 * GET /api/v1/stories/feed
 */
export async function getStoryFeed(): Promise<StoryFeedResponse> {
  const response = await api.get<{ success: boolean; data: StoryFeedResponse }>('/stories/feed');
  return response.data.data;
}

/**
 * GET /api/v1/stories/me
 */
export async function getMyStories(): Promise<StoryItem[]> {
  const response = await api.get<{ success: boolean; data: StoryItem[] }>('/stories/me');
  return response.data.data;
}

/**
 * POST /api/v1/stories
 */
export async function createStory(data: {
  type: string;
  body?: string;
  visibility: string;
  media?: { uri: string; type: string; name: string };
}): Promise<StoryItem> {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('visibility', data.visibility);
  if (data.body) {
    formData.append('body', data.body);
  }
  if (data.media) {
    formData.append('media', {
      uri: data.media.uri,
      type: data.media.type,
      name: data.media.name,
    } as any);
  }

  const response = await api.post<{ success: boolean; data: StoryItem }>('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

/**
 * POST /api/v1/stories/{storyId}/view
 */
export async function markStoryViewed(storyId: number): Promise<void> {
  await api.post(`/stories/${storyId}/view`);
}

/**
 * GET /api/v1/stories/{storyId}/viewers
 */
export async function getStoryViewers(storyId: number): Promise<StoryViewer[]> {
  const response = await api.get<{ success: boolean; data: StoryViewer[] }>(`/stories/${storyId}/viewers`);
  return response.data.data;
}

/**
 * DELETE /api/v1/stories/{storyId}
 */
export async function deleteStory(storyId: number): Promise<void> {
  await api.delete(`/stories/${storyId}`);
}
