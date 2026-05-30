/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — POST / FEED API SERVICE
 * ═══════════════════════════════════════════════════════════════
 */

import { api } from './api';

export interface FeedPost {
  id: number;
  type: 'status' | 'post' | 'question';
  body: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_pinned: boolean;
  is_liked: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
    is_expert: boolean;
    experience_level?: string;
    reputation_score?: number;
  };
  helpful_marks_count: number;
  images: {
    id: number;
    url: string;
    thumb: string;
    medium: string;
    large: string;
  }[];
  comments?: FeedComment[];
}

export interface FeedComment {
  id: number;
  body: string;
  likes_count: number;
  helpful_count: number;
  is_helpful: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
    experience_level?: string;
    reputation_score?: number;
  };
  replies?: FeedComment[];
}

export interface PostTemplate {
  id: number;
  type: string;
  body_en: string;
  body_hi: string | null;
  icon: string | null;
  sort_order: number;
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
 * GET /api/v1/feed
 */
export async function getFeed(perPage = 10, page = 1): Promise<FeedPost[]> {
  const response = await api.get<ApiResponse<FeedPost[]>>('/feed', {
    params: { per_page: perPage, page },
  });
  return response.data.data;
}

/**
 * GET /api/v1/posts/{id}
 */
export async function getPost(postId: number): Promise<FeedPost> {
  const response = await api.get<ApiResponse<FeedPost>>(`/posts/${postId}`);
  return response.data.data;
}

/**
 * POST /api/v1/posts
 */
export async function createPost(data: {
  body: string;
  type: string;
  visibility: string;
  images?: { uri: string; type: string; name: string }[];
}): Promise<FeedPost> {
  const formData = new FormData();
  formData.append('body', data.body);
  formData.append('type', data.type);
  formData.append('visibility', data.visibility);

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

/**
 * POST /api/v1/posts/{id}/like
 */
export async function togglePostLike(postId: number): Promise<{ is_liked: boolean; likes_count: number }> {
  const response = await api.post<ApiResponse<{ is_liked: boolean; likes_count: number }>>(`/posts/${postId}/like`);
  return response.data.data;
}

/**
 * GET /api/v1/posts/{id}/comments
 */
export async function getComments(postId: number): Promise<FeedComment[]> {
  const response = await api.get<ApiResponse<FeedComment[]>>(`/posts/${postId}/comments`);
  return response.data.data;
}

/**
 * POST /api/v1/posts/{id}/comments
 */
export async function addComment(postId: number, body: string): Promise<FeedComment> {
  const response = await api.post<ApiResponse<FeedComment>>(`/posts/${postId}/comments`, { body });
  return response.data.data;
}

/**
 * POST /api/v1/comments/{id}/reply
 */
export async function addReply(commentId: number, body: string): Promise<FeedComment> {
  const response = await api.post<ApiResponse<FeedComment>>(`/comments/${commentId}/reply`, { body });
  return response.data.data;
}

/**
 * POST /api/v1/posts/{id}/share
 */
export async function sharePost(postId: number): Promise<{ shares_count: number }> {
  const response = await api.post<ApiResponse<{ shares_count: number }>>(`/posts/${postId}/share`);
  return response.data.data;
}

/**
 * POST /api/v1/comments/{id}/like
 */
export async function toggleCommentLike(commentId: number): Promise<{ is_liked: boolean; likes_count: number }> {
  const response = await api.post<ApiResponse<{ is_liked: boolean; likes_count: number }>>(`/comments/${commentId}/like`);
  return response.data.data;
}

/**
 * GET /api/v1/questions
 */
export async function getQuestions(perPage = 10, page = 1): Promise<FeedPost[]> {
  const response = await api.get<ApiResponse<FeedPost[]>>('/questions', {
    params: { per_page: perPage, page },
  });
  return response.data.data;
}

/**
 * POST /api/v1/posts/{postId}/comments/{commentId}/helpful
 */
export async function markHelpful(postId: number, commentId: number): Promise<{ helpful_count: number; asker_awarded: boolean; post_helpful_count: number }> {
  const response = await api.post<ApiResponse<{ helpful_count: number; asker_awarded: boolean; post_helpful_count: number }>>(`/posts/${postId}/comments/${commentId}/helpful`);
  return response.data.data;
}

/**
 * DELETE /api/v1/posts/{postId}/comments/{commentId}/helpful
 */
export async function unmarkHelpful(postId: number, commentId: number): Promise<{ helpful_count: number; post_helpful_count: number }> {
  const response = await api.delete<ApiResponse<{ helpful_count: number; post_helpful_count: number }>>(`/posts/${postId}/comments/${commentId}/helpful`);
  return response.data.data;
}

/**
 * GET /api/v1/post-templates
 */
export async function getPostTemplates(): Promise<PostTemplate[]> {
  const response = await api.get<ApiResponse<PostTemplate[]>>('/post-templates');
  return response.data.data;
}
