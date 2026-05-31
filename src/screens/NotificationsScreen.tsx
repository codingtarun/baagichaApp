/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NOTIFICATIONS SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * In-app notification list. Pull-to-refresh, infinite scroll,
 * mark-as-read, and delete actions.
 *
 * NOTE: Uses FlatList as the root scrollable (NOT inside ScreenLayout)
 * to avoid the "VirtualizedLists should never be nested" error.
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography, PrimaryHeading } from '../typography';
import { Colors } from '../theme/colors';
import { Radius, Shadows } from '../theme/style';
import { useNotifications } from '../hooks/useNotifications';
import type { InAppNotification } from '../store/notificationStore';

export default function NotificationsScreen(): React.JSX.Element {
  const {
    notifications,
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
  } = useNotifications();

  const renderItem = ({ item }: { item: InAppNotification }) => (
    <NotificationCard
      notification={item}
      onPress={() => {
        if (!item.is_read) {
          markAsRead(item.id);
        }
      }}
      onDelete={() => remove(item.id)}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && !refreshing) return null;
    return (
      <View style={styles.emptyState}>
        <Typography variant="displayHeading" style={styles.emptyIcon}>
          🔔
        </Typography>
        <Typography variant="cardTitle" center>
          No Notifications Yet
        </Typography>
        <Typography variant="body" color={Colors.gray500} center>
          When you get alerts, spray reminders, or updates, they will appear here.
        </Typography>
      </View>
    );
  };

  const listHeader = (
    <>
      {/* Screen title */}
      <View style={styles.headerRow}>
        <PrimaryHeading style={styles.screenTitle}>Notifications</PrimaryHeading>
      </View>

      {/* Actions bar */}
      {notifications.length > 0 && (
        <View style={styles.actionsBar}>
          <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
            <Typography variant="body" color={Colors.primary}>
              Mark all read
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearRead} activeOpacity={0.7}>
            <Typography variant="body" color={Colors.danger}>
              Clear read
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Typography variant="body" color={Colors.danger} center>
            {error}
          </Typography>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={listHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.primary} />
        }
      />
    </SafeAreaView>
  );
}

// ── Notification Card ──

function NotificationCard({
  notification,
  onPress,
  onDelete,
}: {
  notification: InAppNotification;
  onPress: () => void;
  onDelete: () => void;
}): React.JSX.Element {
  const priorityStyle = getPriorityStyle(notification.priority);

  return (
    <TouchableOpacity
      style={[styles.card, notification.is_read && styles.cardRead]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Priority indicator */}
      <View style={[styles.priorityBar, { backgroundColor: priorityStyle.color }]} />

      <View style={styles.cardContent}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <Typography
            variant="cardTitle"
            style={[styles.title, notification.is_read && styles.textRead]}
            numberOfLines={1}
          >
            {notification.title}
          </Typography>
          {!notification.is_read && <View style={styles.unreadDot} />}
        </View>

        {/* Body */}
        <Typography
          variant="body"
          color={Colors.gray500}
          numberOfLines={2}
          style={notification.is_read ? styles.textRead : undefined}
        >
          {notification.message}
        </Typography>

        {/* Footer row */}
        <View style={styles.footerRow}>
          <Typography variant="caption" color={Colors.gray400}>
            {formatTime(notification.created_at)}
          </Typography>
          <Typography variant="caption" color={priorityStyle.color}>
            {notification.priority}
          </Typography>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.6}>
        <Typography variant="caption" color={Colors.gray400}>
          ✕
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Helpers ──

function getPriorityStyle(priority: string): { color: string } {
  switch (priority) {
    case 'urgent':
      return { color: Colors.danger };
    case 'high':
      return { color: Colors.warning };
    case 'normal':
      return { color: Colors.info };
    case 'low':
      return { color: Colors.success };
    default:
      return { color: Colors.gray400 };
  }
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorBanner: {
    backgroundColor: Colors.dangerLight,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: Radius.md,
  },
  listContent: {
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginHorizontal: 16,
    ...Shadows.subtle,
  },
  cardRead: {
    opacity: 0.7,
  },
  priorityBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  textRead: {
    color: Colors.gray500,
    fontWeight: '400',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButton: {
    padding: 14,
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
});
