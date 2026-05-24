/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — LOCATION PERMISSION SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Friendly permission explanation + request for location access.
 * Why: Hyper-local weather forecasts, mandi prices by region, spray timing.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { Colors } from '../../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../navigation/types';
import type { RootStackParamList } from '../../navigation/types';

type OnboardingNavProp = NativeStackNavigationProp<OnboardingStackParamList>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

export default function LocationPermissionScreen(): React.JSX.Element {
  const navigation = useNavigation<OnboardingNavProp>();
  const rootNavigation = useNavigation<RootNavProp>();
  const setLocationPermission = useOnboardingStore((s) => s.setLocationPermission);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllow = async () => {
    setIsRequesting(true);
    try {
      if (LOCATION_PERMISSION) {
        const result = await request(LOCATION_PERMISSION);
        setLocationPermission(result === RESULTS.GRANTED);
      } else {
        setLocationPermission(false);
      }
    } catch {
      setLocationPermission(false);
    } finally {
      setIsRequesting(false);
    }
    // After location, mark onboarding complete and go to main app
    completeOnboarding();
    rootNavigation.navigate('MainTabs');
  };

  const handleSkip = () => {
    setLocationPermission(false);
    completeOnboarding();
    rootNavigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Typography variant="displayHeading" style={styles.icon}>
            📍
          </Typography>
        </View>

        {/* Header */}
        <PrimaryHeading style={styles.title}>Enable Location</PrimaryHeading>
        <HindiText style={styles.subtitleHi}>स्थान सक्षम करें</HindiText>

        {/* Benefits */}
        <View style={styles.benefits}>
          <BenefitItem icon="🌤️" text="Hyper-local weather forecasts" textHi="स्थानीय मौसम पूर्वानुमान" />
          <BenefitItem icon="🌡️" text="Frost & hail alerts for your village" textHi="आपके गांव के लिए पाला और ओलावृष्टि अलर्ट" />
          <BenefitItem icon="💰" text="Mandi prices from your nearest market" textHi="निकटतम मंडी के भाव" />
          <BenefitItem icon="⏰" text="Optimal spray timing for your micro-climate" textHi="आपके माइक्रो-क्लाइमेट के लिए इष्टतम स्प्रे समय" />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.allowButton, isRequesting && styles.buttonDisabled]}
          onPress={handleAllow}
          activeOpacity={0.8}
          disabled={isRequesting}
        >
          <Typography variant="button" style={styles.allowButtonText}>
            Allow Location / स्थान की अनुमति दें
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Typography variant="body" style={styles.skipText}>
            Not Now / बाद में
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BenefitItem({ icon, text, textHi }: { icon: string; text: string; textHi: string }) {
  return (
    <View style={styles.benefitItem}>
      <Typography variant="body" style={styles.benefitIcon}>
        {icon}
      </Typography>
      <View style={styles.benefitText}>
        <Typography variant="body" style={styles.benefitTitle}>
          {text}
        </Typography>
        <HindiText style={styles.benefitTitleHi}>{textHi}</HindiText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleHi: {
    fontSize: 16,
    color: Colors.gray500,
    marginBottom: 28,
  },
  benefits: {
    width: '100%',
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  benefitIcon: {
    fontSize: 22,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    color: Colors.gray800,
    lineHeight: 20,
  },
  benefitTitleHi: {
    fontSize: 12,
    color: Colors.gray400,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  allowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  allowButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: Colors.gray400,
    fontWeight: '500',
  },
});
