/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — EMAIL REGISTER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Registration with email + password.
 * Optional: name, phone, location fields.
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
import { Radius, Shadows, Space } from '../../theme/style';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { registerByEmail } from '../../services/authApi';
import { finishOnboardingAndGoHome } from '../../navigation/onboardingNavigation';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

export default function EmailRegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const authLogin = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleRegister = useCallback(async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await registerByEmail({
        ...form,
        preferred_language: 'en',
      });

      if (response.success && response.data) {
        authLogin(response.data.token, response.data.user);
        showToast('Welcome! Your Baagicha account is ready.', 'success');
        finishOnboardingAndGoHome(navigation.getParent());
        return;
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        showToast('Please fix the errors above.', 'warning');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [form, authLogin]);

  const renderInput = (
    label: string,
    field: string,
    placeholder: string,
    options: {
      secure?: boolean;
      keyboard?: 'default' | 'phone-pad' | 'email-address';
      optional?: boolean;
    } = {}
  ) => (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>
        {label}{' '}
        {options.optional && (
          <Typography variant="caption" style={styles.optional}>(optional)</Typography>
        )}
      </Typography>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        secureTextEntry={options.secure}
        keyboardType={options.keyboard || 'default'}
        autoCapitalize={options.keyboard === 'email-address' ? 'none' : 'words'}
        value={(form as any)[field]}
        onChangeText={(text) => updateField(field, text)}
      />
      {errors[field]?.map((err: string, i: number) => (
        <Typography key={i} variant="caption" style={styles.errorText}>
          {err}
        </Typography>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Typography variant="body" style={styles.backText}>
              ← Back
            </Typography>
          </TouchableOpacity>

          <View style={styles.header}>
            <PrimaryHeading style={styles.title}>Create Account</PrimaryHeading>
            <HindiText style={styles.subtitleHi}>खाता बनाएं</HindiText>
            <Typography variant="body" style={styles.subtitle}>
              Join Baagicha with your email
            </Typography>
          </View>

          <View style={styles.form}>
            {renderInput('Full Name / पूरा नाम', 'name', 'e.g. Ramesh Negi', { optional: true })}
            {renderInput('Email / ईमेल', 'email', 'e.g. farmer@example.com', { keyboard: 'email-address' })}
            {renderInput('Phone / फोन', 'phone', 'e.g. 9876543210', { keyboard: 'phone-pad', optional: true })}
            {renderInput('Password / पासवर्ड', 'password', 'Minimum 6 characters', { secure: true })}
            {renderInput('Confirm Password / पासवर्ड की पुष्टि', 'password_confirmation', 'Re-enter password', { secure: true })}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Typography variant="button" style={styles.buttonText}>
                  Create Account / खाता बनाएं
                </Typography>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Typography variant="body" style={styles.footerText}>
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Typography variant="body" style={styles.link}>
                Sign In / साइन इन
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 16 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backText: { color: Colors.primary, fontWeight: '600' },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 26, textAlign: 'center' },
  subtitleHi: { fontSize: 16, color: Colors.gray500, marginTop: 4 },
  subtitle: { color: Colors.gray500, marginTop: 8, textAlign: 'center' },
  form: {
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Space[5],
    ...Shadows.medium,
  },
  inputGroup: { gap: 6 },
  label: { color: Colors.gray700 },
  optional: { color: Colors.gray400 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
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
    borderRadius: Radius.full,
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
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 16, flexWrap: 'wrap' },
  footerText: { color: Colors.gray500 },
  link: { color: Colors.primary, fontWeight: '600' },
});
