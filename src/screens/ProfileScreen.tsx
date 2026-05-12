/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PROFILE / MY ORCHARD SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shows user profile when logged in, or login/register prompt when guest.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../theme/colors';
import { Typography, HindiText } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList } from '../navigation/types';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<RootNavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const goToLogin = () => navigation.navigate('Auth', { screen: 'Login' });
  const goToRegister = () => navigation.navigate('Auth', { screen: 'EmailRegister' });

  const handleLogout = () => {
    logout();
  };

  return (
    <ScreenLayout>
      {isAuthenticated && user ? (
        /* ── LOGGED IN VIEW ── */
        <View style={styles.container}>
          <View style={styles.profileCard}>
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
          </View>

          <View style={styles.menu}>
            <MenuItem label="My Orchards / मेरे बाग" icon="🌳" />
            <MenuItem label="Saved Items / सहेजी गईं चीज़ें" icon="🔖" />
            <MenuItem label="Orders / ऑर्डर" icon="📦" />
            <MenuItem label="Settings / सेटिंग्स" icon="⚙️" />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Typography variant="button" style={styles.logoutText}>
              Log Out / लॉग आउट
            </Typography>
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
              Sign in to manage your orchards, track spray schedules, save favourite varieties, and shop for farming inputs.
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
              You can browse all content without signing in.
            </Typography>
            <HindiText center style={styles.guestHintHi}>
              साइन इन किए बिना सभी सामग्री देख सकते हैं।
            </HindiText>
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

function MenuItem({ label, icon }: { label: string; icon: string }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
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
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
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
    color: Colors.gray800,
  },
  menuArrow: {
    color: Colors.gray400,
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  // ── Guest ──
  guestCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginTop: 24,
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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
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
  guestHint: {
    marginTop: 24,
  },
  guestHintHi: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
});
