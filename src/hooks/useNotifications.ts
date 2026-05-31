/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — USE NOTIFICATIONS HOOK
 * ═══════════════════════════════════════════════════════════════
 *
 * Data hook for the notification list screen.
 * Follows the project's pattern: loading, refreshing, refresh, error.
 *
 * NOTE: Uses Zustand store selectors to prevent infinite re-render loops.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
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
  // Use selectors to subscribe only to specific state slices
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const appendNotifications = useNotificationStore((s) => s.appendNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const markAsReadInStore = useNotificationStore((s) => s.markAsRead);
  const markAllAsReadInStore = useNotificationStore((s) => s.markAllAsRead);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Use a ref to prevent double-loading on mount
  const hasLoaded = useRef(false);

  const load = useCallback(
    async (targetPage = 1, append = false) => {
      if (targetPage === 1 && !append) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await fetchNotifications(targetPage);

        if (response.success) {
          const { data, current_page, last_page } = response.data;

          if (append) {
            appendNotifications(data);
          } else {
            setNotifications(data);
          }

          setHasMore(current_page < last_page);
          setPage(current_page);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    },
    [setNotifications, appendNotifications]
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(1, false);
    setRefreshing(false);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loading || refreshing || !hasMore) return;
    await load(page + 1, true);
  }, [load, loading, refreshing, hasMore, page]);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await fetchUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unread_count);
      }
    } catch (err) {
      console.warn('[useNotifications] Failed to fetch unread count:', err);
    }
  }, [setUnreadCount]);

  const markAsRead = useCallback(
    async (id: number) => {
      try {
        const response = await markNotificationAsRead(id);
        if (response.success) {
          markAsReadInStore(id);
        }
      } catch (err: any) {
        showToast(err.response?.data?.message ?? 'Failed to mark as read', 'error');
      }
    },
    [markAsReadInStore]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        markAllAsReadInStore();
        showToast('All notifications marked as read', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message ?? 'Failed to mark all as read', 'error');
    }
  }, [markAllAsReadInStore]);

  const remove = useCallback(
    async (id: number) => {
      try {
        const response = await deleteNotification(id);
        if (response.success) {
          removeNotification(id);
        }
      } catch (err: any) {
        showToast(err.response?.data?.message ?? 'Failed to delete notification', 'error');
      }
    },
    [removeNotification]
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

  // Load on mount (once only)
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    load(1, false);
    refreshUnreadCount();
  }, [load, refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    refreshing,
    error,
    hasMore,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    remove,
    clearRead,
    refreshUnreadCount,
  };
}
