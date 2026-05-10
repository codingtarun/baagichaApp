/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';

export default function ShopScreen(): React.JSX.Element {
  return (
    <ScreenLayout>
      <View style={styles.placeholder}>
        <Typography variant="displayHeading" center>
          Shop
        </Typography>
        <Typography variant="bodyMuted" center style={styles.subtitle}>
          दुकान
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
    marginTop: 12,
    textAlign: 'center',
  },
});
