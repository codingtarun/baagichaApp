/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — EMAIL VERIFICATION SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Gate screen shown when a user registers or logs in with an
 * unverified email. Blocks access to MainTabs until verified.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../theme/colors';
import { Radius, Shadows, Space } from '../../theme/style';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { getEmailVerificationStatus, resendEmailVerification } from '../../services/authApi';
import type { RootStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'EmailVerification'>;

const POLL_INTERVAL_MS = 5000;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_POLL_ATTEMPTS = 12; // ~1 minute of polling

export default function EmailVerificationScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ScreenRouteProp>();
  const user = useAuthStore((s) => s.user);
  const markEmailVerified = useAuthStore((s) => s.markEmailVerified);
  const logout = useAuthStore((s) => s.logout);

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState(route.params?.email ?? user?.email ?? '');
  const [pollAttempts, setPollAttempts] = useState(0);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      if (!isMounted.current) return;
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-poll verification status every 5 seconds (with max attempts)
  useEffect(() => {
    isMounted.current = true;

    pollTimerRef.current = setInterval(() => {
      if (!isMounted.current) return;
      setPollAttempts((prev) => {
        if (prev >= MAX_POLL_ATTEMPTS) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          return prev;
        }
        checkStatusSilent();
        return prev + 1;
      });
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const checkStatusSilent = useCallback(async () => {
    try {
      const response = await getEmailVerificationStatus();
      if (response.data?.verified) {
        markEmailVerified();
        showToast('Email verified! Welcome to Baagicha.', 'success');
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      }
    } catch {
      // Silently ignore polling errors (e.g. 401 during edge cases)
    }
  }, [markEmailVerified]);

  const handleCheckNow = useCallback(async () => {
    setIsChecking(true);
    try {
      const response = await getEmailVerificationStatus();
      if (response.data?.verified) {
        markEmailVerified();
        showToast('Email verified! Welcome to Baagicha.', 'success');
      } else {
        showToast('Email not verified yet. Please check your inbox.', 'warning');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        showToast('Session expired. Please log in again.', 'error');
        logout();
      } else {
        showToast('Unable to check status. Please try again.', 'error');
      }
    } finally {
      setIsChecking(false);
    }
  }, [markEmailVerified, logout]);

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await resendEmailVerification();
      showToast('Verification email sent!', 'success');
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setPollAttempts(0); // Reset polling attempts
    } catch (error: any) {
      if (error.response?.status === 429) {
        showToast('Too many requests. Please wait a moment.', 'warning');
      } else if (error.response?.status === 409) {
        showToast('Email is already verified.', 'success');
        markEmailVerified();
      } else {
        showToast('Failed to resend email. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [countdown, markEmailVerified]);

  const handleLogout = useCallback(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    logout();
  }, [logout]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Illustration placeholder */}
        <View style={styles.illustration}>
          <Typography variant="displayHero" style={styles.envelopeIcon}>
            ✉️
          </Typography>
        </View>

        <PrimaryHeading style={styles.title}>Verify Your Email</PrimaryHeading>
        <HindiText style={styles.subtitleHi}>अपना ईमेल सत्यापित करें</HindiText>

        <Typography variant="body" style={styles.description}>
          We&apos;ve sent a verification link to{' '}
          <Typography variant="body" style={styles.emailHighlight}>
            {email || 'your email'}
          </Typography>
          . Please tap the link in the email to activate your account.
        </Typography>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, isChecking && styles.buttonDisabled]}
            onPress={handleCheckNow}
            activeOpacity={0.8}
            disabled={isChecking}
          >
            {isChecking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography variant="button" style={styles.buttonText}>
                I&apos;ve Verified / मैंने सत्यापित किया
              </Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonSecondary, (isLoading || countdown > 0) && styles.buttonDisabled]}
            onPress={handleResend}
            activeOpacity={0.8}
            disabled={isLoading || countdown > 0}
          >
            <Typography variant="button" style={styles.buttonSecondaryText}>
              {countdown > 0
                ? `Resend in ${countdown}s / ${countdown} सेकंड में फिर भेजें`
                : 'Resend Email / ईमेल फिर भेजें'}
            </Typography>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutLink} onPress={handleLogout} activeOpacity={0.7}>
          <Typography variant="body" style={styles.logoutText}>
            Use a different account / दूसरा खाता प्रयोग करें
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Space[6],
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Space[6],
  },
  envelopeIcon: {
    fontSize: 56,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
  },
  subtitleHi: {
    fontSize: 16,
    color: Colors.gray500,
    marginTop: Space[1],
  },
  description: {
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Space[4],
    lineHeight: 22,
  },
  emailHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: Space[3],
    marginTop: Space[8],
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Space[4],
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Space[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonSecondaryText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutLink: {
    marginTop: Space[6],
  },
  logoutText: {
    color: Colors.gray500,
    fontWeight: '500',
  },
});
