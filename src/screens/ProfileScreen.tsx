/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PROFILE / MY ORCHARD SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shows user profile when logged in, or login/register prompt when guest.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../theme/colors';
import { Shadows, Radius } from '../theme/style';
import { Typography, HindiText } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../store/toastStore';
import { resendEmailVerification } from '../services/authApi';
import type { RootStackParamList } from '../navigation/types';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
type MyOrchardNavProp = NativeStackNavigationProp<MyOrchardStackParamList>;

export default function ProfileScreen(): React.JSX.Element {
  const rootNavigation = useNavigation<RootNavProp>();
  const navigation = useNavigation<MyOrchardNavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logoutAndClear = useAuthStore((s) => s.logoutAndClear);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const goToLogin = () => rootNavigation.navigate('Auth', { screen: 'Login' });
  const goToRegister = () => rootNavigation.navigate('Auth', { screen: 'EmailRegister' });
  const goToOrchards = () => navigation.navigate('OrchardList');
  const goToMyProfile = () => navigation.navigate('MyProfile');
  const goToMyGroups = () => navigation.navigate('MyGroups');

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    try {
      const response = await resendEmailVerification();
      if (response.success) {
        showToast('Verification email sent!', 'success');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to resend email.', 'error');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAndClear();
    setIsLoggingOut(false);
  };

  return (
    <ScreenLayout>
      {isAuthenticated && user ? (
        /* ── LOGGED IN VIEW ── */
        <View style={styles.container}>
          <TouchableOpacity style={styles.profileCard} onPress={goToMyProfile} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Typography variant="displayHeading" style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Typography>
            </View>
            <Typography variant="displayHeading" style={styles.name}>
              {user.name}
            </Typography>
            <Typography variant="bodyMuted" style={styles.phone}>
              {user.phone}
            </Typography>
            {user.profile?.village && (
              <Typography variant="caption" style={styles.location}>
                📍 {user.profile.village}, {user.profile.district}
              </Typography>
            )}
            <View style={styles.viewProfileHint}>
              <Typography variant="caption" style={styles.viewProfileText}>
                Tap to view profile / प्रोफाइल देखें
              </Typography>
              <Icon name="chevron-right" size={14} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Email Verification Banner */}
          {user.email && !user.email_verified_at && (
            <View style={styles.verificationBanner}>
              <Typography variant="caption" style={styles.verificationText}>
                ⚠️ Email not verified. Please check your inbox.
              </Typography>
              <TouchableOpacity
                style={styles.verificationButton}
                onPress={handleResendVerification}
                disabled={isResendingEmail}
                activeOpacity={0.7}
              >
                {isResendingEmail ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Typography variant="caption" style={styles.verificationButtonText}>
                    Resend / फिर से भेजें
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.menu}>
            <MenuItem label="My Profile / मेरी प्रोफाइल" icon="👤" onPress={goToMyProfile} />
            <MenuItem label="My Groups / मेरे समूह" icon="👥" onPress={goToMyGroups} />
            <MenuItem label="My Orchards / मेरे बाग" icon="🌳" onPress={goToOrchards} />
            <MenuItem label="Saved Items / सहेजी गईं चीज़ें" icon="🔖" />
            <MenuItem label="Orders / ऑर्डर" icon="📦" />
            <MenuItem label="Settings / सेटिंग्स" icon="⚙️" />
          </View>

          <TouchableOpacity
            style={[styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
            onPress={handleLogout}
            activeOpacity={0.8}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography variant="button" style={styles.logoutText}>
                Log Out / लॉग आउट
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        /* ── GUEST VIEW ── */
        <View style={styles.container}>
          <View style={styles.guestCard}>
            <Typography variant="displayHeading" center style={styles.guestTitle}>
              Welcome to Baagicha
            </Typography>
            <HindiText center style={styles.guestTitleHi}>
              बागीचा में आपका स्वागत है
            </HindiText>
            <Typography variant="bodyMuted" center style={styles.guestDesc}>
              Please sign in to access your profile and manage your account.
            </Typography>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={goToLogin}
              activeOpacity={0.8}
            >
              <Typography variant="button" style={styles.primaryButtonText}>
                Sign In / साइन इन
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={goToRegister}
              activeOpacity={0.8}
            >
              <Typography variant="buttonSecondary" style={styles.secondaryButtonText}>
                Create Account / खाता बनाएं
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.guestHint}>
            <Typography variant="captionMuted" center>
              All features require sign in.
            </Typography>
            <HindiText center style={styles.guestHintHi}>
              सभी सुविधाओं के लिए साइन इन आवश्यक है।
            </HindiText>
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

function MenuItem({ label, icon, onPress }: { label: string; icon: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Typography variant="body" style={styles.menuIcon}>
        {icon}
      </Typography>
      <Typography variant="body" style={styles.menuLabel}>
        {label}
      </Typography>
      <Typography variant="body" style={styles.menuArrow}>
        ›
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  // ── Logged In ──
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...Shadows.medium,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
  },
  name: {
    fontSize: 20,
  },
  phone: {
    marginTop: 4,
  },
  location: {
    marginTop: 8,
    color: Colors.gray500,
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    color: Colors.gray900,
  },
  menuArrow: {
    color: Colors.gray400,
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: { opacity: 0.6 },
  verificationBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: Radius['2xl'],
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  verificationText: {
    color: '#856404',
    flex: 1,
  },
  verificationButton: {
    backgroundColor: '#FFE69C',
    borderRadius: Radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  verificationButtonText: {
    color: '#856404',
    fontWeight: '600',
  },
  // ── Guest ──
  guestCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: 28,
    alignItems: 'center',
    marginTop: 24,
    ...Shadows.medium,
  },
  guestTitle: {
    fontSize: 22,
  },
  guestTitleHi: {
    fontSize: 16,
    color: Colors.gray500,
    marginTop: 4,
  },
  guestDesc: {
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    ...Shadows.medium,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  viewProfileHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  viewProfileText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  guestHint: {
    marginTop: 24,
  },
  guestHintHi: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
});
