/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FORGOT PASSWORD SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Step 1: Enter email → request reset link
 * Step 2: Show confirmation (actual reset is done via email link
 *         which opens a web view; mobile deep-link reset can be
 *         added later).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { showToast } from '../../store/toastStore';
import { forgotPassword } from '../../services/authApi';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ForgotPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = useCallback(async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        setIsSent(true);
        showToast('Password reset link sent to your email', 'success');
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        showToast('Failed to send reset link. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Typography variant="body" style={styles.backText}>
              ← Back to Login
            </Typography>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <PrimaryHeading style={styles.title}>Reset Password</PrimaryHeading>
            <HindiText style={styles.subtitleHi}>पासवर्ड रीसेट करें</HindiText>
          </View>

          {isSent ? (
            /* ── SUCCESS STATE ── */
            <View style={styles.successCard}>
              <Typography variant="displayHeading" style={styles.successIcon}>
                ✉️
              </Typography>
              <Typography variant="body" center style={styles.successText}>
                Check your email for a password reset link.
              </Typography>
              <HindiText center style={styles.successTextHi}>
                पासवर्ड रीसेट लिंक के लिए अपना ईमेल देखें।
              </HindiText>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <Typography variant="button" style={styles.buttonText}>
                  Back to Login / लॉग इन पर वापस
                </Typography>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── FORM ── */
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="label" style={styles.label}>
                  Email / ईमेल
                </Typography>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="e.g. farmer@email.com"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                {errors.email?.map((err, i) => (
                  <Typography key={i} variant="caption" style={styles.errorText}>
                    {err}
                  </Typography>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, (isLoading || !email) && styles.buttonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Typography variant="button" style={styles.buttonText}>
                    Send Reset Link / लिंक भेजें
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { color: Colors.primary, fontWeight: '600' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, textAlign: 'center' },
  subtitleHi: { fontSize: 16, color: Colors.gray500, marginTop: 4 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { color: Colors.gray700 },
  input: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, marginTop: 2 },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  successCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  successIcon: { fontSize: 48 },
  successText: { textAlign: 'center', color: Colors.gray700 },
  successTextHi: { textAlign: 'center', color: Colors.gray500, fontSize: 14 },
});
