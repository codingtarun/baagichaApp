# Social Auth Setup Guide

This guide walks you through configuring Google Sign-In and Facebook Login for the Baagicha React Native app.

---

## Quick Start (Development)

In development mode (`__DEV__ === true`), social login works **without real credentials** via mock mode. Tap the Google or Facebook button and a test user will be "logged in" automatically.

To use **real** social authentication, follow the steps below.

---

## 1. Google Sign-In

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**

### 1.2 Create a Web Client ID

1. Choose **Application type: Web application**
2. Name it "Baagicha Web Client"
3. Add authorized redirect URIs:
   - `http://localhost`
   - `https://yourdomain.com` (if you have one)
4. Click **Create**
5. Copy the **Client ID** (looks like `123456789-abc123.apps.googleusercontent.com`)

### 1.3 Create an Android Client ID

1. Click **Create Credentials → OAuth 2.0 Client ID** again
2. Choose **Application type: Android**
3. Name it "Baagicha Android"
4. Package name: `com.baagichaapp`
5. SHA-1 fingerprint:
   ```bash
   cd android/app
   keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
   Copy the SHA1 value.
6. Click **Create**

### 1.4 Configure the App

Edit `baagichaApp/src/config/socialAuth.ts`:

```typescript
export const GOOGLE_WEB_CLIENT_ID =
  '123456789-abc123.apps.googleusercontent.com'; // your real client id
```

The `GOOGLE_CONFIGURED` flag will auto-detect the change.

---

## 2. Facebook Login

### 2.1 Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Click **Create App**
3. Select **Consumer** or **None** as app type
4. Name it "Baagicha"
5. Add **Facebook Login** product

### 2.2 Get App Credentials

1. Go to **Settings → Basic**
2. Copy **App ID** and **App Secret**
3. Go to **Settings → Advanced**
4. Copy **Client Token**

### 2.3 Add Android Platform

1. In the Facebook app dashboard, go to **Settings → Basic**
2. Scroll to **Add Platform → Android**
3. Fill in:
   - **Google Play Package Name**: `com.baagichaapp`
   - **Class Name**: `com.baagichaapp.MainActivity`
   - **Key Hashes**: Generate with:
     ```bash
     keytool -exportcert -alias androiddebugkey -keystore android/app/debug.keystore | openssl sha1 -binary | openssl base64
     ```
     (Password: `android`)
4. Enable **Single Sign On**: Yes
5. Save Changes

### 2.4 Configure the App

Edit `baagichaApp/android/app/src/main/res/values/strings.xml`:

```xml
<string name="facebook_app_id">YOUR_REAL_APP_ID</string>
<string name="fb_login_protocol_scheme">fbYOUR_REAL_APP_ID</string>
<string name="facebook_client_token">YOUR_REAL_CLIENT_TOKEN</string>
```

Edit `baagichaApp/src/config/socialAuth.ts`:

```typescript
export const FACEBOOK_APP_ID = 'YOUR_REAL_APP_ID';
export const FACEBOOK_CLIENT_TOKEN = 'YOUR_REAL_CLIENT_TOKEN';
```

The `FACEBOOK_CONFIGURED` flag will auto-detect the change.

---

## 3. Rebuild the App

After any configuration change:

```bash
cd baagichaApp/android
./gradlew clean
cd ..
npx react-native start --reset-cache
# In another terminal:
npx react-native run-android
```

---

## 4. Disable Dev Mock Mode

Once real credentials are configured, the app will automatically use them. Dev mock mode only kicks in when:
- `__DEV__ === true` (development builds)
- AND the credentials are still placeholders

To explicitly disable mock mode, edit `src/config/socialAuth.ts`:

```typescript
export const DEV_MOCK_MODE = false;
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Google Sign-In failed" | Check `GOOGLE_WEB_CLIENT_ID` is correct. Verify SHA-1 fingerprint matches in Google Cloud Console. |
| "Facebook Login failed" | Check `facebook_app_id` in `strings.xml`. Verify key hash in Facebook Developer Console. |
| "Developer Error" (Google) | Package name or SHA-1 fingerprint doesn't match what's in Google Cloud Console. |
| "Invalid Key Hash" (Facebook) | Regenerate key hash with the correct keystore. |
| App crashes on social button tap | Run `./gradlew clean` and rebuild. Ensure native modules are linked. |
| "Network Error" | Check internet connection. Backend must be reachable. |

---

## Security Notes

- Never commit real app secrets to version control
- Use `.env` files or CI/CD secrets for production builds
- The backend validates all social tokens directly with Google/Facebook APIs
- Mock tokens (`mock_*_dev_only`) are rejected by the backend in production
