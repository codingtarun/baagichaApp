# Firebase Setup Guide (Push Notifications)

## ⚠️ REQUIRED before building the Android app

The app will **NOT compile** until you complete these steps.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it `baagicha-app` (or any name you prefer)
4. Disable Google Analytics (or enable if you want analytics later)
5. Click **"Create project"**

---

## Step 2: Add an Android App

1. In your Firebase project, click the **Android icon** (</>)
2. Register app:
   - **Package name:** `com.baagichaapp`
   - **App nickname:** `Baagicha`
   - **Debug signing certificate SHA-1** (optional but recommended):
     ```bash
     cd android/app
     keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
     Copy the SHA-1 and paste it.
3. Click **"Register app"**

---

## Step 3: Download `google-services.json`

1. Click **"Download google-services.json"**
2. Move it to:
   ```
   android/app/google-services.json
   ```
   **Replace** the existing placeholder file.

---

## Step 4: Verify Gradle Setup (Already Done)

The following changes were already applied by the agent:

**`android/build.gradle`:**
```gradle
dependencies {
    classpath("com.android.tools.build:gradle")
    classpath("com.facebook.react:react-native-gradle-plugin")
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    classpath("com.google.gms:google-services:4.4.2")  // ← Added
}
```

**`android/app/build.gradle`:**
```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: "com.google.gms.google-services"  // ← Added
```

---

## Step 5: Backend Firebase Config (Laravel)

1. In Firebase Console, go to **Project Settings → Service accounts**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Move it to your Laravel project, e.g.:
   ```
   web_baagicha/storage/app/firebase-service-account.json
   ```
5. Update `.env`:
   ```env
   FIREBASE_CREDENTIALS=/absolute/path/to/web_baagicha/storage/app/firebase-service-account.json
   FIREBASE_PROJECT_ID=your-project-id
   ```

---

## Step 6: Build the Android App

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

Or run via Metro:
```bash
npx react-native run-android
```

---

## How It Works

| Step | What Happens |
|------|-------------|
| App launches | Requests FCM permission, gets device token |
| Token received | Sends token to Laravel via `POST /api/v1/devices/register` |
| Backend sends notification | `NotificationDispatcher` → `SendPushNotification` job → FCM |
| FCM delivers | Android draws notification on lock screen + top drawer |
| User taps | App opens to the correct screen (deep link) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `google-services.json` not found | Make sure the file is in `android/app/` and you replaced the placeholder |
| `Could not find com.google.gms:google-services` | Run `./gradlew clean` and rebuild |
| Notifications not received | Check that `FIREBASE_CREDENTIALS` path is correct in Laravel `.env` |
| Deep links not working | Make sure the app is fully killed, then tap the notification |
