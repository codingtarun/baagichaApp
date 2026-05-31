/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NOTIFICATION STORE (Zustand)
 * ═══════════════════════════════════════════════════════════════
 *
 * In-app notification state: unread count, recent notifications,
 * and loading states for the notification list screen.
 */

import { create } from 'zustand';

export interface InAppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  priority: string;
  action_url: string | null;
  icon_class: string;
  read_at: string | null;
  created_at: string;
}

interface NotificationState {
  // State
  notifications: InAppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;

  // Actions
  setNotifications: (notifications: InAppNotification[]) => void;
  appendNotifications: (notifications: InAppNotification[]) => void;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  refreshing: false,
  error: null,
  hasMore: true,
  page: 1,
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  setNotifications: (notifications) => set({ notifications }),

  appendNotifications: (notifications) =>
    set((state) => ({
      notifications: [...state.notifications, ...notifications],
    })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  decrementUnreadCount: () =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.is_read ? n : { ...n, is_read: true, read_at: new Date().toISOString() }
      ),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  setLoading: (loading) => set({ loading }),

  setRefreshing: (refreshing) => set({ refreshing }),

  setError: (error) => set({ error }),

  setHasMore: (hasMore) => set({ hasMore }),

  setPage: (page) => set({ page }),

  reset: () => set(initialState),
}));
