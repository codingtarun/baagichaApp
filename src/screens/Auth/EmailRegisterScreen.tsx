/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — EMAIL REGISTER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Registration with email + password.
 * Optional: name, phone, location fields.
 */

import React, { useState, useCallback, useMemo } from 'react';
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
import PasswordInput from '../../components/PasswordInput';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

interface FormErrors {
  name?: string[];
  email?: string[];
  phone?: string[];
  password?: string[];
  password_confirmation?: string[];
  general?: string;
}

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function isValidPhone(val: string): boolean {
  return /^[6-9]\d{9}$/.test(val.replace(/\D/g, ''));
}

function calculateStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

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
  const [errors, setErrors] = useState<FormErrors>({});

  const passwordStrength = useMemo(() => calculateStrength(form.password), [form.password]);

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete (next as any)[field];
      return next;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (form.name && form.name.length > 50) {
      newErrors.name = ['Name must be 50 characters or less.'];
    }

    if (!form.email.trim()) {
      newErrors.email = ['Email is required.'];
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = ['Please enter a valid email address.'];
    }

    if (form.phone && !isValidPhone(form.phone)) {
      newErrors.phone = ['Please enter a valid 10-digit mobile number.'];
    }

    if (!form.password) {
      newErrors.password = ['Password is required.'];
    } else {
      if (form.password.length < 8) {
        newErrors.password = ['Password must be at least 8 characters.'];
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
        newErrors.password = ['Password must contain uppercase, lowercase, and a number.'];
      }
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = ['Passwords do not match.'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      showToast('Please fix the errors above.', 'warning');
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await registerByEmail({
        ...form,
        preferred_language: 'en',
      });

      if (response.success && response.data) {
        // Store token so we can poll status and resend email
        authLogin(response.data.token, response.data.user);
        showToast('Check your email to verify your account.', 'success');
        navigation.navigate('EmailVerification', { email: form.email });
        return;
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        showToast('Please fix the errors above.', 'warning');
      } else if (error.response?.status === 429) {
        showToast('Too many requests. Please try again later.', 'error');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [form, validateForm, navigation]);

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
        style={[styles.input, (errors as any)[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        secureTextEntry={options.secure}
        keyboardType={options.keyboard || 'default'}
        autoCapitalize={options.keyboard === 'email-address' ? 'none' : 'words'}
        value={(form as any)[field]}
        onChangeText={(text) => updateField(field, text)}
      />
      {(errors as any)[field]?.map((err: string, i: number) => (
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

            <PasswordInput
              label="Password / पासवर्ड"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChangeText={(text) => updateField('password', text)}
              error={errors.password}
              showStrength
            />

            <PasswordInput
              label="Confirm Password / पासवर्ड की पुष्टि"
              placeholder="Re-enter password"
              value={form.password_confirmation}
              onChangeText={(text) => updateField('password_confirmation', text)}
              error={errors.password_confirmation}
              confirmValue={form.password}
            />

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
