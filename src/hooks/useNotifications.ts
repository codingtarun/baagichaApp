/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE NOTIFICATIONS HOOK
 * ═══════════════════════════════════════════════════════════════
 *
 * Data hook for the notification list screen.
 * Follows the project's pattern: loading, refreshing, refresh, error.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications,
} from '../api/notifications';
import { useNotificationStore } from '../store/notificationStore';
import { showToast } from '../store/toastStore';

export function useNotifications() {
  const store = useNotificationStore();

  const load = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) {
        store.setLoading(true);
      }
      store.setError(null);

      try {
        const response = await fetchNotifications(page);

        if (response.success) {
          const { data, current_page, last_page } = response.data;

          if (append) {
            store.appendNotifications(data);
          } else {
            store.setNotifications(data);
          }

          store.setHasMore(current_page < last_page);
          store.setPage(current_page);
        } else {
          store.setError(response.message);
        }
      } catch (err: any) {
        store.setError(err.response?.data?.message ?? 'Failed to load notifications');
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const refresh = useCallback(async () => {
    store.setRefreshing(true);
    await load(1, false);
    store.setRefreshing(false);
  }, [load, store]);

  const loadMore = useCallback(async () => {
    if (store.loading || store.refreshing || !store.hasMore) return;
    await load(store.page + 1, true);
  }, [load, store]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await fetchUnreadCount();
      if (response.success) {
        store.setUnreadCount(response.data.unread_count);
      }
    } catch (err) {
      console.error('[useNotifications] Failed to fetch unread count:', err);
    }
  }, [store]);

  const markAsRead = useCallback(
    async (id: number) => {
      try {
        const response = await markNotificationAsRead(id);
        if (response.success) {
          store.markAsRead(id);
        }
      } catch (err: any) {
        showToast(err.response?.data?.message ?? 'Failed to mark as read', 'error');
      }
    },
    [store]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        store.markAllAsRead();
        showToast('All notifications marked as read', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Failed to mark all as read', 'error');
    }
  }, [store]);

  const remove = useCallback(
    async (id: number) => {
      try {
        const response = await deleteNotification(id);
        if (response.success) {
          store.removeNotification(id);
        }
      } catch (err: any) {
        showToast(err.response?.data?.message ?? 'Failed to delete notification', 'error');
      }
    },
    [store]
  );

  const clearRead = useCallback(async () => {
    try {
      const response = await deleteReadNotifications();
      if (response.success) {
        await refresh();
        showToast('Read notifications cleared', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Failed to clear read notifications', 'error');
    }
  }, [refresh]);

  // Load on mount
  useEffect(() => {
    load(1, false);
    refreshUnreadCount();
  }, [load, refreshUnreadCount]);

  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    loading: store.loading,
    refreshing: store.refreshing,
    error: store.error,
    hasMore: store.hasMore,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    remove,
    clearRead,
    refreshUnreadCount,
  };
}
