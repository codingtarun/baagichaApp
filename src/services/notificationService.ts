/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NOTIFICATION SERVICE (Firebase Cloud Messaging)
 * ═══════════════════════════════════════════════════════════════
 *
 * Handles FCM token lifecycle, incoming push messages, and
 * deep-link navigation when the user taps a notification.
 */

import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { registerDevice } from './authApi';
import { navigationRef } from '../navigation/navigationRef';

// ── Types ──

export interface NotificationPayload {
  title: string;
  body: string;
  screen?: string;
  [key: string]: string | undefined;
}

// ── Token Management ──

/**
 * Request FCM permission and get the device token.
 * Returns the token string or null if permission denied.
 */
export async function requestFcmPermission(): Promise<string | null> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('[FCM] Notification permission denied');
      return null;
    }

    const token = await messaging().getToken();
    console.log('[FCM] Token obtained:', token.substring(0, 20) + '...');
    return token;
  } catch (error) {
    console.error('[FCM] Failed to get token:', error);
    return null;
  }
}

/**
 * Register the FCM token with the Laravel backend.
 * Should be called after login and on token refresh.
 */
export async function registerFcmToken(token: string): Promise<void> {
  try {
    await registerDevice({
      token,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    });
    console.log('[FCM] Token registered with backend');
  } catch (error) {
    console.error('[FCM] Failed to register token with backend:', error);
  }
}

/**
 * Full flow: request permission → get token → register with backend.
 * Call this on app launch (after auth is restored) and after login.
 */
export async function initializePushNotifications(): Promise<void> {
  const token = await requestFcmPermission();
  if (token) {
    await registerFcmToken(token);
  }
}

/**
 * Set up the FCM token refresh listener.
 * Returns an unsubscribe function.
 */
export function onTokenRefresh(callback: (token: string) => void): () => void {
  return messaging().onTokenRefresh((token) => {
    console.log('[FCM] Token refreshed:', token.substring(0, 20) + '...');
    callback(token);
  });
}

// ── Message Handlers ──

/**
 * Handle push notifications when the app is in the foreground.
 * Instead of showing a toast, we silently refresh the unread count
 * so the bell badge updates. The user sees the notification in the
 * list when they tap the bell.
 */
export function onForegroundMessage(
  callback?: (payload: NotificationPayload) => void
): () => void {
  return messaging().onMessage(async (remoteMessage) => {
    const payload = extractPayload(remoteMessage);
    console.log('[FCM] Foreground message:', payload);

    if (callback) {
      callback(payload);
    }
  });
}

/**
 * Handle push notifications when the app is in background or killed.
 * This must be registered outside any React component.
 *
 * When the user taps the notification, `onNotificationOpenedApp` fires.
 */
export function setupBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const payload = extractPayload(remoteMessage);
    console.log('[FCM] Background message:', payload);
    // Background messages are handled by the OS — no UI action needed here
  });
}

/**
 * Listen for when the user taps a notification that opened the app
 * from background or quit state.
 */
export function onNotificationOpenedApp(
  callback: (payload: NotificationPayload) => void
): () => void {
  return messaging().onNotificationOpenedApp((remoteMessage) => {
    const payload = extractPayload(remoteMessage);
    console.log('[FCM] Notification opened app:', payload);
    callback(payload);
  });
}

/**
 * Check if the app was opened by tapping a notification (cold start).
 */
export async function getInitialNotification(): Promise<NotificationPayload | null> {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    const payload = extractPayload(remoteMessage);
    console.log('[FCM] App opened from quit state by notification:', payload);
    return payload;
  }
  return null;
}

// ── Deep Link Navigation ──

/**
 * Navigate to the appropriate screen based on notification payload.
 * Maps notification `screen` data field to navigation routes.
 */
export function handleNotificationNavigation(payload: NotificationPayload): void {
  if (!navigationRef.isReady()) {
    console.warn('[FCM] Navigation not ready, skipping deep link');
    return;
  }

  const screen = payload.screen;
  if (!screen) {
    console.log('[FCM] No screen in payload, staying on current screen');
    return;
  }

  switch (screen) {
    case 'SpraySchedule':
      (navigationRef as any).navigate('MainTabs', { screen: 'Spray' });
      break;

    case 'WeatherForecast':
      (navigationRef as any).navigate('MainTabs', { screen: 'Discover' });
      // TODO: Navigate deeper to Weather screen inside Discover stack
      break;

    case 'ProductDetail': {
      const productSlug = payload.product_slug;
      if (productSlug) {
        (navigationRef as any).navigate('MainTabs', {
          screen: 'Shop',
          params: { screen: 'ProductDetail', params: { slug: productSlug } },
        });
      } else {
        (navigationRef as any).navigate('MainTabs', { screen: 'Shop' });
      }
      break;
    }

    case 'OrderDetail': {
      const orderNumber = payload.order_number;
      if (orderNumber) {
        (navigationRef as any).navigate('MainTabs', {
          screen: 'Shop',
          params: { screen: 'OrderDetail', params: { orderNumber } },
        });
      } else {
        (navigationRef as any).navigate('MainTabs', { screen: 'Shop' });
      }
      break;
    }

    case 'DiseaseDetail': {
      const diseaseSlug = payload.disease_slug;
      if (diseaseSlug) {
        (navigationRef as any).navigate('MainTabs', {
          screen: 'Discover',
          params: { screen: 'DiseaseDetail', params: { slug: diseaseSlug } },
        });
      } else {
        (navigationRef as any).navigate('MainTabs', { screen: 'Discover' });
      }
      break;
    }

    case 'BlogDetail': {
      const blogSlug = payload.blog_slug;
      if (blogSlug) {
        (navigationRef as any).navigate('MainTabs', {
          screen: 'Discover',
          params: { screen: 'BlogDetail', params: { slug: blogSlug } },
        });
      } else {
        (navigationRef as any).navigate('MainTabs', { screen: 'Discover' });
      }
      break;
    }

    case 'OrchardDetail': {
      const orchardId = payload.orchard_id;
      if (orchardId) {
        (navigationRef as any).navigate('MainTabs', {
          screen: 'MyOrchard',
          params: { screen: 'OrchardDetail', params: { id: Number(orchardId) } },
        });
      } else {
        (navigationRef as any).navigate('MainTabs', { screen: 'MyOrchard' });
      }
      break;
    }

    default:
      console.log('[FCM] Unknown screen:', screen);
      break;
  }
}

// ── Utilities ──

/**
 * Extract notification payload from a Firebase remote message.
 */
function extractPayload(remoteMessage: any): NotificationPayload {
  const data = remoteMessage.data || {};
  const notification = remoteMessage.notification || {};

  return {
    title: data.title || notification.title || 'Baagicha',
    body: data.body || notification.body || '',
    screen: data.screen,
    ...data,
  };
}
