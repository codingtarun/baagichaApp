/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SOCIAL AUTH SERVICE
 * ═══════════════════════════════════════════════════════════════
 *
 * Wraps native SDKs for Google Sign-In and Facebook Login.
 * Falls back to DEV_MOCK_MODE when credentials are not configured.
 */

import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  type SignInResponse as GoogleSignInResponse,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

import {
  DEV_MOCK_MODE,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_CONFIGURED,
  FACEBOOK_CONFIGURED,
} from '../config/socialAuth';
import { ENV } from '../config/env';
import { showToast } from '../store/toastStore';

// ── Types ──

export interface SocialAuthResult {
  provider: 'google' | 'facebook';
  token: string; // idToken (Google) or accessToken (Facebook)
  user?: {
    name: string | null;
    email: string | null;
    photo: string | null;
  };
}

export type SocialProvider = 'google' | 'facebook';

// ── Mock Data (DEV only) ──

const MOCK_GOOGLE_USER: SocialAuthResult = {
  provider: 'google',
  token: 'mock_google_id_token_dev_only',
  user: {
    name: 'Dev Farmer',
    email: 'dev.farmer@baagicha.test',
    photo: null,
  },
};

const MOCK_FACEBOOK_USER: SocialAuthResult = {
  provider: 'facebook',
  token: 'mock_facebook_access_token_dev_only',
  user: {
    name: 'Dev Farmer',
    email: 'dev.farmer@baagicha.test',
    photo: null,
  },
};

// ── Google Sign-In ──

let googleInitialized = false;

function initGoogle(): void {
  if (googleInitialized) return;
  if (!GOOGLE_CONFIGURED && !DEV_MOCK_MODE) return;

  try {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      forceCodeForRefreshToken: false,
      profileImageSize: 120,
    });
    googleInitialized = true;
  } catch (err) {
    console.warn('[SocialAuth] Google init failed:', err);
  }
}

export async function signInWithGoogle(): Promise<SocialAuthResult> {
  // Dev mock fallback
  if (DEV_MOCK_MODE && !GOOGLE_CONFIGURED) {
    await new Promise((r) => setTimeout(r, 800)); // Simulate network
    return { ...MOCK_GOOGLE_USER };
  }

  initGoogle();

  try {
    // Check Play Services (Android only)
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const response: GoogleSignInResponse = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      throw new Error('Google sign in was cancelled');
    }

    const googleUser = response.data;
    const tokens = await GoogleSignin.getTokens();

    if (!tokens.idToken) {
      throw new Error('Google Sign-In did not return an idToken');
    }

    return {
      provider: 'google',
      token: tokens.idToken,
      user: {
        name: googleUser.user.name ?? null,
        email: googleUser.user.email ?? null,
        photo: googleUser.user.photo ?? null,
      },
    };
  } catch (error: any) {
    handleGoogleError(error);
    throw error;
  }
}

export async function signOutGoogle(): Promise<void> {
  if (!GOOGLE_CONFIGURED) return;
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore sign-out errors
  }
}

function handleGoogleError(error: any): void {
  let message = 'Google Sign-In failed. Please try again.';

  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    message = 'Sign in was cancelled.';
  } else if (error.code === statusCodes.IN_PROGRESS) {
    message = 'Sign in is already in progress.';
  } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    message = 'Google Play Services are not available on this device.';
  } else if (error.message?.includes('NETWORK_ERROR')) {
    message = 'Network error. Please check your internet connection.';
  }

  showToast(message, 'error');
}

// ── Facebook Login ──

export async function signInWithFacebook(): Promise<SocialAuthResult> {
  // Dev mock fallback
  if (DEV_MOCK_MODE && !FACEBOOK_CONFIGURED) {
    await new Promise((r) => setTimeout(r, 800)); // Simulate network
    return { ...MOCK_FACEBOOK_USER };
  }

  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw new Error('Facebook login was cancelled');
    }

    const accessToken = await AccessToken.getCurrentAccessToken();

    if (!accessToken) {
      throw new Error('Facebook login did not return an access token');
    }

    const profile = await Profile.getCurrentProfile();

    return {
      provider: 'facebook',
      token: accessToken.accessToken,
      user: {
        name: profile?.name ?? null,
        email: profile?.email ?? null,
        photo: profile?.imageURL ?? null,
      },
    };
  } catch (error: any) {
    handleFacebookError(error);
    throw error;
  }
}

export async function signOutFacebook(): Promise<void> {
  LoginManager.logOut();
}

function handleFacebookError(error: any): void {
  let message = 'Facebook Login failed. Please try again.';

  if (error.message?.includes('cancelled')) {
    message = 'Login was cancelled.';
  } else if (
    error.message?.includes('CONNECTION_FAILURE') ||
    error.message?.includes('NETWORK_ERROR')
  ) {
    message = 'Network error. Please check your internet connection.';
  }

  showToast(message, 'error');
}
