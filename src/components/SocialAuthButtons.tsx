/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SOCIAL AUTH BUTTONS
 * ═══════════════════════════════════════════════════════════════
 *
 * Google Sign-In and Facebook Login buttons.
 *
 * Native SDK integration is handled by the parent screen.
 * These buttons trigger the onPress handlers which call the
 * native SDKs and then the backend API.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Colors } from '../theme/colors';
import { Typography } from '../typography';

interface SocialAuthButtonsProps {
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
  isLoading?: boolean;
}

export default function SocialAuthButtons({
  onGooglePress,
  onFacebookPress,
  isLoading = false,
}: SocialAuthButtonsProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Typography variant="captionMuted" style={styles.orText}>
          or continue with
        </Typography>
        <View style={styles.line} />
      </View>

      <View style={styles.buttonsRow}>
        {/* Google */}
        <TouchableOpacity
          style={[styles.button, styles.googleButton, isLoading && styles.disabled]}
          onPress={onGooglePress}
          activeOpacity={0.8}
          disabled={isLoading}
          accessibilityLabel="Sign in with Google"
          accessibilityRole="button"
        >
          <Icon name="google" size={18} color="#DB4437" style={styles.icon} />
          <Typography variant="body" style={styles.googleText}>
            Google
          </Typography>
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity
          style={[styles.button, styles.facebookButton, isLoading && styles.disabled]}
          onPress={onFacebookPress}
          activeOpacity={0.8}
          disabled={isLoading}
          accessibilityLabel="Sign in with Facebook"
          accessibilityRole="button"
        >
          <Icon name="facebook" size={18} color="#fff" style={styles.icon} />
          <Typography variant="body" style={styles.facebookText}>
            Facebook
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  orText: {
    marginHorizontal: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: Colors.gray200,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  googleText: {
    color: Colors.gray800,
    fontWeight: '600',
  },
  facebookText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
