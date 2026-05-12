/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — AUTH PROMPT BANNER
 * ═══════════════════════════════════════════════════════════════
 *
 * A friendly banner shown on screens when the user is not logged in.
 * Encourages registration without blocking content.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../theme/colors';
import { Typography, HindiText } from '../typography';
import type { RootStackParamList } from '../navigation/types';

type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

interface AuthPromptBannerProps {
  /** Custom message. Defaults to a friendly registration prompt. */
  message?: string;
  messageHi?: string;
  /** Optional: show a different CTA button text */
  ctaText?: string;
  ctaTextHi?: string;
}

export default function AuthPromptBanner({
  message = 'Sign in to unlock personalised spray schedules, weather alerts, and exclusive deals.',
  messageHi = 'व्यक्तिगत स्प्रे शेड्यूल, मौसम अलर्ट और विशेष ऑफ़र के लिए साइन इन करें।',
  ctaText = 'Sign In / Register',
  ctaTextHi = 'साइन इन / पंजीकरण',
}: AuthPromptBannerProps): React.JSX.Element {
  const navigation = useNavigation<RootNavProp>();

  const handlePress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="body" style={styles.message}>
          {message}
        </Typography>
        <HindiText style={styles.messageHi}>{messageHi}</HindiText>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Typography variant="button" style={styles.buttonText}>
          {ctaText}
        </Typography>
        <HindiText style={styles.buttonTextHi}>{ctaTextHi}</HindiText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgPrimary,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    shadowColor: Colors.bgPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    marginBottom: 12,
  },
  message: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  messageHi: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: Colors.bgPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonTextHi: {
    color: Colors.bgPrimary,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
});
