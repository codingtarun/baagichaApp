/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NEW USER ONBOARDING SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shown after phone OTP or social login when is_new_user = true.
 * Collects essential profile info: name, village, district, state.
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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { Colors } from '../../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { updateProfile, type UpdateProfileRequest } from '../../services/authApi';
import { finishOnboardingAndGoHome } from '../../navigation/onboardingNavigation';
import type { AuthStackParamList } from '../../navigation/types';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;
type OnboardingRouteProp = RouteProp<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen(): React.JSX.Element {
  const navigation = useNavigation<AuthNavProp>();
  const route = useRoute<OnboardingRouteProp>();
  const loginAction = useAuthStore((s) => s.login);

  // If navigated directly with token/user params, use them; otherwise rely on store
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleComplete = useCallback(async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await updateProfile({
        name: name.trim() || undefined,
        village: village.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
      });

      if (response.success && response.data?.user) {
        // Update local store with the enriched user
        loginAction(
          route.params?.token ?? useAuthStore.getState().token ?? '',
          response.data.user
        );
        showToast('Profile completed! Welcome to Baagicha.', 'success');
        finishOnboardingAndGoHome(navigation.getParent());
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        showToast('Failed to save profile. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [name, village, district, state, loginAction, route.params, navigation]);

  const handleSkip = useCallback(() => {
    // Skip onboarding and go home
    finishOnboardingAndGoHome(navigation.getParent());
  }, [navigation]);

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
            <PrimaryHeading style={styles.title}>Complete Your Profile</PrimaryHeading>
            <HindiText style={styles.subtitleHi}>अपनी प्रोफाइल पूरी करें</HindiText>
            <Typography variant="body" style={styles.subtitle}>
              Help us personalize your Baagicha experience
            </Typography>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FormField
              label="Name / नाम"
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChangeText={setName}
              errors={errors.name}
            />

            <FormField
              label="Village / गांव"
              placeholder="e.g. Kotgarh"
              value={village}
              onChangeText={setVillage}
              errors={errors.village}
            />

            <FormField
              label="District / जिला"
              placeholder="e.g. Shimla"
              value={district}
              onChangeText={setDistrict}
              errors={errors.district}
            />

            <FormField
              label="State / राज्य"
              placeholder="e.g. Himachal Pradesh"
              value={state}
              onChangeText={setState}
              errors={errors.state}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleComplete}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Typography variant="button" style={styles.buttonText}>
                  Save & Continue / सहेजें और जारी रखें
                </Typography>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Typography variant="body" style={styles.skipText}>
                Skip for now / अभी नहीं
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  errors,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  errors?: string[];
}) {
  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>
        {label}
      </Typography>
      <TextInput
        style={[styles.input, errors && errors.length > 0 && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray400}
        value={value}
        onChangeText={onChangeText}
      />
      {errors?.map((err, i) => (
        <Typography key={i} variant="caption" style={styles.errorText}>
          {err}
        </Typography>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, textAlign: 'center' },
  subtitleHi: { fontSize: 16, color: Colors.gray500, marginTop: 4 },
  subtitle: { color: Colors.gray400, marginTop: 8, textAlign: 'center' },
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
  skipButton: { alignItems: 'center', marginTop: 12 },
  skipText: { color: Colors.gray400, fontWeight: '500' },
});
