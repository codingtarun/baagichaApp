/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * eCommerce product catalog placeholder.
 * Shows auth prompt for guests who want to purchase.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, HindiText } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import AuthPromptBanner from '../components/AuthPromptBanner';
import { useAuthStore } from '../store/authStore';

export default function ShopScreen(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <ScreenLayout>
      {!isAuthenticated && (
        <AuthPromptBanner
          message="Sign in to shop for fertilisers, pesticides, tools, and grafting material at farmer-friendly prices."
          messageHi="उर्वरक, कीटनाशक, उपकरण और ग्राफ्टिंग सामग्री खरीदने के लिए साइन इन करें।"
          ctaText="Sign In to Shop"
          ctaTextHi="खरीदारी के लिए साइन इन करें"
        />
      )}

      <View style={styles.placeholder}>
        <Typography variant="displayHeading" center>
          Shop / दुकान
        </Typography>
        <HindiText center style={styles.subtitle}>
          Farming inputs at your doorstep
        </HindiText>
        <Typography variant="bodyMuted" center style={styles.comingSoon}>
          Product catalog coming soon...
        </Typography>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    padding: 24,
    marginTop: 40,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: Colors.gray500,
  },
  comingSoon: {
    marginTop: 24,
  },
});
