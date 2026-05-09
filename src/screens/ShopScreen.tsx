/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Marketplace for farming supplies, chemicals, tools,
 * and equipment recommended for apple orchards.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import AppHeader from '../components/AppHeader';

export default function ShopScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <AppHeader
        temperature="18"
        condition="Sunny"
        notificationCount={0}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeholder}>
          <Typography variant="displayHeading" center>
            Shop
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            दुकान
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  placeholder: { flex: 1, padding: 24, marginTop: 80, alignItems: 'center' },
  subtitle: { marginTop: 12, textAlign: 'center' },
});
