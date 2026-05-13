/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PHONE AUTH SCREEN (2-Step OTP)
 * ═══════════════════════════════════════════════════════════════
 *
 * Step 1: Enter phone number → request OTP
 * Step 2: Enter 6-digit OTP → verify and login
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { sendOtp, verifyOtp } from '../../services/authApi';
import { finishOnboardingAndGoHome } from '../../navigation/onboardingNavigation';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

export default function PhoneAuthScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const authLogin = useAuthStore((s) => s.login);

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [countdown, setCountdown] = useState(0);
  const otpInputRef = useRef<TextInput>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = useCallback(async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await sendOtp({ phone });
      if (response.success) {
        setStep(2);
        setCountdown(60); // 60-second resend cooldown
        setTimeout(() => otpInputRef.current?.focus(), 300);
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status === 429) {
        showToast(error.response.data.message || 'Too many requests', 'warning');
      } else {
        showToast('Failed to send OTP. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  const handleVerifyOtp = useCallback(async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await verifyOtp({
        phone,
        otp,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });

      if (response.success && response.data) {
        authLogin(response.data.token, response.data.user);
        if (response.data.is_new_user) {
          navigation.navigate('Onboarding', {
            token: response.data.token,
            user: response.data.user,
          });
        } else {
          showToast('Welcome back!', 'success');
          finishOnboardingAndGoHome(navigation.getParent());
        }
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        showToast('Invalid OTP. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [phone, otp, authLogin]);

  const handleResend = useCallback(async () => {
    if (countdown > 0) return;
    setOtp('');
    await handleSendOtp();
  }, [countdown, handleSendOtp]);

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (step === 2 ? setStep(1) : navigation.goBack())}
            activeOpacity={0.7}
          >
            <Typography variant="body" style={styles.backText}>
              ← {step === 2 ? 'Change Phone' : 'Back'}
            </Typography>
          </TouchableOpacity>

          <View style={styles.header}>
            <PrimaryHeading style={styles.title}>
              {step === 1 ? 'Phone Login' : 'Enter OTP'}
            </PrimaryHeading>
            <HindiText style={styles.subtitleHi}>
              {step === 1 ? 'फोन से लॉग इन करें' : 'ओटीपी दर्ज करें'}
            </HindiText>
            <Typography variant="body" style={styles.subtitle}>
              {step === 1
                ? 'We will send a 6-digit code to your phone'
                : `Code sent to +91 ${phone.replace(/^91/, '')}`}
            </Typography>
          </View>

          {step === 1 ? (
            /* ── STEP 1: Phone Input ── */
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="label" style={styles.label}>
                  Phone Number / फोन नंबर
                </Typography>
                <View style={styles.phoneRow}>
                  <View style={styles.countryCode}>
                    <Typography variant="body">🇮🇳 +91</Typography>
                  </View>
                  <TextInput
                    style={[styles.phoneInput, errors.phone && styles.inputError]}
                    placeholder="9876543210"
                    placeholderTextColor={Colors.gray400}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
                {errors.phone?.map((err, i) => (
                  <Typography key={i} variant="caption" style={styles.errorText}>
                    {err}
                  </Typography>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, (isLoading || phone.length < 10) && styles.buttonDisabled]}
                onPress={handleSendOtp}
                activeOpacity={0.8}
                disabled={isLoading || phone.length < 10}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Typography variant="button" style={styles.buttonText}>
                    Send OTP / ओटीपी भेजें
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* ── STEP 2: OTP Input ── */
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Typography variant="label" style={styles.label}>
                  6-Digit Code / 6 अंकों का कोड
                </Typography>
                <TextInput
                  ref={otpInputRef}
                  style={[styles.input, styles.otpInput, errors.otp && styles.inputError]}
                  placeholder="------"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  textAlign="center"
                />
                {errors.otp?.map((err, i) => (
                  <Typography key={i} variant="caption" style={styles.errorText}>
                    {err}
                  </Typography>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, (isLoading || otp.length < 6) && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                activeOpacity={0.8}
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Typography variant="button" style={styles.buttonText}>
                    Verify & Login / सत्यापित करें
                  </Typography>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResend}
                disabled={countdown > 0 || isLoading}
                activeOpacity={0.7}
              >
                <Typography
                  variant="body"
                  style={[styles.resendText, countdown > 0 && styles.resendDisabled]}
                >
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s / ${countdown} सेकंड`
                    : 'Resend OTP / ओटीपी फिर से भेजें'}
                </Typography>
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
  subtitle: { color: Colors.gray400, marginTop: 8, textAlign: 'center' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { color: Colors.gray700 },
  phoneRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  phoneInput: {
    flex: 1,
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
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 12,
    paddingVertical: 18,
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
  resendButton: { alignItems: 'center', marginTop: 12 },
  resendText: { color: Colors.primary, fontWeight: '600' },
  resendDisabled: { color: Colors.gray400 },
});
