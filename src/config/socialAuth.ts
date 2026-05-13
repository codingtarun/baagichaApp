/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SOCIAL AUTH CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Credentials are read from environment variables via react-native-config.
 * Update the root `.env` file with your actual credentials.
 *
 * GOOGLE:
 *   1. Go to https://console.cloud.google.com/apis/credentials
 *   2. Create an OAuth 2.0 Client ID (Web application)
 *   3. Copy the Client ID to .env → GOOGLE_WEB_CLIENT_ID
 *   4. Also create an Android OAuth client with your package name
 *      (com.baagichaapp) and SHA-1 fingerprint
 *
 * FACEBOOK:
 *   1. Go to https://developers.facebook.com/apps
 *   2. Create a new app → "Consumer" → "Facebook Login"
 *   3. Copy App ID and Client Token to .env
 *   4. Add Android platform with package name and key hash
 *   5. Update android/app/src/main/res/values/strings.xml
 *      with your real facebook_app_id
 *
 * DEV MOCK MODE:
 *   Automatically enabled in __DEV__ when real credentials are missing.
 *   Simulates a successful login for UI testing.
 */

import {
  ENV,
  isGoogleConfigured,
  isFacebookConfigured,
} from './env';

// ── Toggle ──

/** Auto-enabled in development when credentials are missing. */
export const DEV_MOCK_MODE = __DEV__ && (!isGoogleConfigured || !isFacebookConfigured);

// ── Google ──

/** Web Client ID from environment. */
export const GOOGLE_WEB_CLIENT_ID = ENV.GOOGLE_WEB_CLIENT_ID;

/** Whether real Google credentials are configured. */
export const GOOGLE_CONFIGURED = isGoogleConfigured;

// ── Facebook ──

/** App ID from environment. */
export const FACEBOOK_APP_ID = ENV.FACEBOOK_APP_ID;

/** Client Token from environment. */
export const FACEBOOK_CLIENT_TOKEN = ENV.FACEBOOK_CLIENT_TOKEN;

/** Whether real Facebook credentials are configured. */
export const FACEBOOK_CONFIGURED = isFacebookConfigured;
