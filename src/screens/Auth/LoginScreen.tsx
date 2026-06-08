/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — LOGIN SCREEN (Multi-Method Auth Hub)
 * ═══════════════════════════════════════════════════════════════
 *
 * Central login hub supporting:
 *   - Email or Phone + Password
 *   - Phone + OTP (navigates to PhoneAuthScreen)
 *   - Google / Facebook Social Login (via native SDKs)
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { Radius, Shadows, Space } from '../../theme/style';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { loginByEmail, loginBySocial } from '../../services/authApi';
import { signInWithGoogle, signInWithFacebook } from '../../services/socialAuth';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

type LoginMethod = 'password' | 'otp';

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function isValidPhone(val: string): boolean {
  return /^[6-9]\d{9}$/.test(val.replace(/\D/g, ''));
}

interface FormErrors {
  login?: string[];
  password?: string[];
  general?: string;
}

export default function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const authLogin = useAuthStore((s) => s.login);

  const [method, setMethod] = useState<LoginMethod>('password');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!login.trim()) {
      newErrors.login = ['Please enter your email or phone number.'];
    } else if (method === 'password') {
      const trimmed = login.trim();
      if (!isValidEmail(trimmed) && !isValidPhone(trimmed)) {
        newErrors.login = ['Please enter a valid email or 10-digit phone number.'];
      }
    } else if (method === 'otp') {
      if (!isValidPhone(login)) {
        newErrors.login = ['Please enter a valid 10-digit phone number.'];
      }
    }

    if (method === 'password' && !password) {
      newErrors.password = ['Please enter your password.'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [login, password, method]);

  const handlePasswordLogin = useCallback(async () => {
    if (!validateForm()) return;

    setErrors({});
    setIsLoading(true);

    try {
      const response = await loginByEmail({
        login,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });

      if (response.success && response.data) {
        authLogin(response.data.token, response.data.user);
        showToast('Welcome back!', 'success');
        const hasSeen = useOnboardingStore.getState().hasSeenOnboarding;
        if (!hasSeen) {
          navigation.getParent()?.navigate('NotificationPermission');
        }
        return;
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || '';

      if (status === 422) {
        setErrors(error.response.data.errors || {});
        showToast('Please check your email/phone and password.', 'warning');
      } else if (status === 403 && message.toLowerCase().includes('verify')) {
        showToast('Please verify your email before logging in.', 'warning');
        navigation.navigate('EmailVerification', { email: login });
      } else if (status === 401) {
        showToast(error.response.data.message || 'Invalid credentials', 'error');
      } else if (status === 429) {
        showToast('Too many attempts. Please try again later.', 'error');
      } else if (!error.response || error.message === 'Network Error') {
        showToast(
          'Cannot connect to server. Please check your internet, API URL, and try again.',
          'error',
        );
      } else {
        showToast('Something went wrong. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [login, password, authLogin, validateForm, navigation]);

  const goToPhoneOtp = useCallback(() => {
    if (!isValidPhone(login.replace(/\D/g, ''))) {
      setErrors({ login: ['Please enter a valid 10-digit phone number.'] });
      return;
    }
    navigation.navigate('PhoneAuth', { phone: login });
  }, [login, navigation]);

  const goToRegister = useCallback(() => {
    navigation.navigate('EmailRegister');
  }, [navigation]);

  const goToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  // ── Social Login ──

  const handleSocialLogin = useCallback(
    async (provider: 'google' | 'facebook') => {
      setIsLoading(true);
      setErrors({});

      try {
        const socialResult =
          provider === 'google'
            ? await signInWithGoogle()
            : await signInWithFacebook();

        const response = await loginBySocial({
          provider: socialResult.provider,
          token: socialResult.token,
          device_name: `${Platform.OS} ${Platform.Version}`,
        });

        if (response.success && response.data) {
          if (response.data.is_new_user) {
            navigation.navigate('Onboarding', {
              token: response.data.token,
              user: response.data.user,
            });
          } else {
            authLogin(response.data.token, response.data.user);
            showToast('Welcome back!', 'success');
            const hasSeen = useOnboardingStore.getState().hasSeenOnboarding;
            if (!hasSeen) {
              navigation.getParent()?.navigate('NotificationPermission');
            }
          }
        }
      } catch (error: any) {
        if (error.message?.includes('cancelled')) {
          return;
        }

        const status = error.response?.status;
        if (status === 422) {
          const msg =
            error.response.data.message ||
            'Invalid social account. Please try again.';
          showToast(msg, 'error');
        } else if (status === 401) {
          showToast('Your social account could not be verified.', 'error');
        } else if (status === 403) {
          showToast(
            error.response.data.message || 'Your account has been deactivated.',
            'error'
          );
        } else {
          showToast('Unable to sign in. Please check your connection.', 'error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [authLogin, navigation]
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
        >
          {/* Header */}
          <View style={styles.header}>
            <PrimaryHeading style={styles.title}>Welcome Back</PrimaryHeading>
            <HindiText style={styles.subtitleHi}>वापसी पर स्वागत है</HindiText>
            <Typography variant="body" style={styles.subtitle}>
              Sign in to your Baagicha account
            </Typography>
          </View>

          {/* Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[styles.methodTab, method === 'password' && styles.methodTabActive]}
              onPress={() => setMethod('password')}
              activeOpacity={0.8}
            >
              <Typography
                variant="body"
                style={[styles.methodTabText, method === 'password' && styles.methodTabTextActive]}
              >
                Password / पासवर्ड
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodTab, method === 'otp' && styles.methodTabActive]}
              onPress={() => setMethod('otp')}
              activeOpacity={0.8}
            >
              <Typography
                variant="body"
                style={[styles.methodTabText, method === 'otp' && styles.methodTabTextActive]}
              >
                OTP / ओटीपी
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Login Input (email or phone) */}
            <View style={styles.inputGroup}>
              <Typography variant="label" style={styles.label}>
                {method === 'password' ? 'Email or Phone / ईमेल या फोन' : 'Phone / फोन'}
              </Typography>
              <TextInput
                style={[styles.input, errors.login && styles.inputError]}
                placeholder={method === 'password' ? 'e.g. farmer@email.com' : 'e.g. 9876543210'}
                placeholderTextColor={Colors.gray400}
                keyboardType={method === 'otp' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                value={login}
                onChangeText={(text) => {
                  setLogin(text);
                  setErrors((prev) => ({ ...prev, login: undefined }));
                }}
              />
              {errors.login?.map((err, i) => (
                <Typography key={i} variant="caption" style={styles.errorText}>
                  {err}
                </Typography>
              ))}
            </View>

            {/* Password Input (password method only) */}
            {method === 'password' && (
              <View style={styles.inputGroup}>
                <Typography variant="label" style={styles.label}>
                  Password / पासवर्ड
                </Typography>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.gray400}
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setPasswordVisible((v) => !v)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={Colors.gray500}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password?.map((err, i) => (
                  <Typography key={i} variant="caption" style={styles.errorText}>
                    {err}
                  </Typography>
                ))}
              </View>
            )}

            {/* Forgot Password Link (password method only) */}
            {method === 'password' && (
              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={goToForgotPassword}
                activeOpacity={0.7}
              >
                <Typography variant="body" style={styles.link}>
                  Forgot Password? / पासवर्ड भूल गए?
                </Typography>
              </TouchableOpacity>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={method === 'password' ? handlePasswordLogin : goToPhoneOtp}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Typography variant="button" style={styles.buttonText}>
                  {method === 'password' ? 'Sign In / साइन इन' : 'Send OTP / ओटीपी भेजें'}
                </Typography>
              )}
            </TouchableOpacity>

            {/* OTP Note */}
            {method === 'otp' && (
              <Typography variant="captionMuted" center style={styles.otpNote}>
                You will receive a 6-digit code via SMS / आपको एसएमएस से 6 अंकों का कोड मिलेगा
              </Typography>
            )}
          </View>

          {/* Social Auth */}
          <SocialAuthButtons
            onGooglePress={() => handleSocialLogin('google')}
            onFacebookPress={() => handleSocialLogin('facebook')}
            isLoading={isLoading}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Typography variant="body" style={styles.footerText}>
              Don&apos;t have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={goToRegister} activeOpacity={0.7}>
              <Typography variant="body" style={styles.link}>
                Register / पंजीकरण
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
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 28, textAlign: 'center' },
  subtitleHi: { fontSize: 16, color: Colors.gray500, marginTop: 4 },
  subtitle: { color: Colors.gray500, marginTop: 8, textAlign: 'center' },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  methodTabActive: {
    backgroundColor: '#fff',
    shadowColor: Colors.gray400,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodTabText: { color: Colors.gray500, fontWeight: '500' },
  methodTabTextActive: { color: Colors.primary, fontWeight: '600' },
  form: {
    gap: 16,
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Space[5],
    ...Shadows.medium,
  },
  inputGroup: { gap: 6 },
  label: { color: Colors.gray700 },
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
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
  otpNote: { marginTop: 4 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: { color: Colors.gray500 },
  link: { color: Colors.primary, fontWeight: '600' },
  forgotPasswordLink: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 4 },
});
