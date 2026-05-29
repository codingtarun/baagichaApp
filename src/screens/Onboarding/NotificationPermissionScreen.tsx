/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — NOTIFICATION PERMISSION SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Friendly permission explanation + request for push notifications.
 * Why: Spray reminders, weather alerts, mandi price updates.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { requestNotifications } from 'react-native-permissions';

import { Colors } from '../../theme/colors';
import { Radius, Shadows } from '../../theme/style';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { OnboardingStackParamList } from '../../navigation/types';

type OnboardingNavProp = NativeStackNavigationProp<OnboardingStackParamList>;

export default function NotificationPermissionScreen(): React.JSX.Element {
  const navigation = useNavigation<OnboardingNavProp>();
  const setNotificationPermission = useOnboardingStore((s) => s.setNotificationPermission);

  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllow = async () => {
    setIsRequesting(true);
    try {
      const result = await requestNotifications(['alert', 'badge', 'sound']);
      setNotificationPermission(result.status === 'granted');
    } catch {
      setNotificationPermission(false);
    } finally {
      setIsRequesting(false);
    }
    navigation.navigate('LocationPermission');
  };

  const handleSkip = () => {
    setNotificationPermission(false);
    navigation.navigate('LocationPermission');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Typography variant="displayHeading" style={styles.icon}>
            🔔
          </Typography>
        </View>

        {/* Header */}
        <PrimaryHeading style={styles.title}>Stay Notified</PrimaryHeading>
        <HindiText style={styles.subtitleHi}>सूचनाएं प्राप्त करें</HindiText>

        {/* Benefits */}
        <View style={styles.benefits}>
          <BenefitItem icon="💧" text="Spray reminders before weather changes" textHi="मौसम बदलने से पहले स्प्रे रिमाइंडर" />
          <BenefitItem icon="🌡️" text="Frost & heatwave alerts for your orchard" textHi="आपके बाग के लिए पाला और लू की चेतावनी" />
          <BenefitItem icon="📈" text="Daily mandi price updates" textHi="दैनिक मंडी भाव अपडेट" />
          <BenefitItem icon="🚚" text="Order & delivery notifications" textHi="ऑर्डर और डिलीवरी सूचनाएं" />
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
            Allow Notifications / सूचनाएं अनुमति दें
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
    backgroundColor: Colors.background,
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
    backgroundColor: '#FFF3E0',
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
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: 14,
    gap: 12,
    ...Shadows.subtle,
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
    paddingBottom: 120,
    gap: 12,
  },
  allowButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
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
    color: Colors.gray500,
    fontWeight: '500',
  },
});
