/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOG SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Knowledge base with articles on spray schedules, disease
 * management, rootstocks, and market prices.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';

export default function BlogScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={globalStyle.screen} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder}>
          <Typography variant="displayHeading" center>
            Blog
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            ज्ञान केंद्र
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  placeholder: { flex: 1, padding: 24, marginTop: 100, alignItems: 'center' },
  subtitle: { marginTop: 12, textAlign: 'center' },
});
