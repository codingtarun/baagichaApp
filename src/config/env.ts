/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ENVIRONMENT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Centralized access to environment variables via react-native-config.
 * Falls back to safe defaults when variables are missing.
 */

import Config from 'react-native-config';

export const ENV = {
  /** Laravel API base URL (must end in /api/v1) */
  API_BASE_URL: Config.API_BASE_URL || 'http://192.168.1.13:8000/api/v1',

  /** Google Web Client ID for native sign-in */
  GOOGLE_WEB_CLIENT_ID: Config.GOOGLE_WEB_CLIENT_ID || '',

  /** Facebook App ID for native login */
  FACEBOOK_APP_ID: Config.FACEBOOK_APP_ID || '',

  /** Facebook Client Token */
  FACEBOOK_CLIENT_TOKEN: Config.FACEBOOK_CLIENT_TOKEN || '',
} as const;

/** Whether Google Sign-In has real credentials configured */
export const isGoogleConfigured =
  ENV.GOOGLE_WEB_CLIENT_ID.includes('googleusercontent.com') &&
  !ENV.GOOGLE_WEB_CLIENT_ID.startsWith('YOUR_');

/** Whether Facebook Login has real credentials configured */
export const isFacebookConfigured =
  !!ENV.FACEBOOK_APP_ID &&
  !ENV.FACEBOOK_APP_ID.startsWith('YOUR_') &&
  !!ENV.FACEBOOK_CLIENT_TOKEN &&
  !ENV.FACEBOOK_CLIENT_TOKEN.startsWith('YOUR_');
