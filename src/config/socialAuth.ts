/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SOCIAL AUTH CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 *
 * Replace these placeholder values with your actual credentials.
 *
 * GOOGLE:
 *   1. Go to https://console.cloud.google.com/apis/credentials
 *   2. Create an OAuth 2.0 Client ID (Web application)
 *   3. Copy the Client ID and paste below
 *   4. Also create an Android OAuth client with your package name
 *      (com.baagichaapp) and SHA-1 fingerprint
 *
 * FACEBOOK:
 *   1. Go to https://developers.facebook.com/apps
 *   2. Create a new app → "Consumer" → "Facebook Login"
 *   3. Copy App ID and Client Token, paste below
 *   4. Add Android platform with package name and key hash
 *   5. Update android/app/src/main/res/values/strings.xml
 *      with your real facebook_app_id
 *
 * DEV MOCK MODE:
 *   Set DEV_MOCK_MODE = true to test social login UI without
 *   real app credentials. It simulates a successful login.
 */

// ── Toggle ──

/** Set to `true` for development testing without real SDK credentials. */
export const DEV_MOCK_MODE = __DEV__;

// ── Google ──

/** Web Client ID from Google Cloud Console (OAuth 2.0 → Web application). */
export const GOOGLE_WEB_CLIENT_ID =
  'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';

/** Set to `true` once you replace the placeholder above. */
export const GOOGLE_CONFIGURED =
  GOOGLE_WEB_CLIENT_ID.includes('googleusercontent.com') &&
  !GOOGLE_WEB_CLIENT_ID.startsWith('YOUR_');

// ── Facebook ──

/** App ID from Facebook Developer Console. */
export const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

/** Client Token from Facebook Developer Console → Settings → Advanced. */
export const FACEBOOK_CLIENT_TOKEN = 'YOUR_FACEBOOK_CLIENT_TOKEN';

/** Set to `true` once you replace the placeholders above. */
export const FACEBOOK_CONFIGURED =
  !FACEBOOK_APP_ID.startsWith('YOUR_') &&
  !FACEBOOK_CLIENT_TOKEN.startsWith('YOUR_');
