/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISEASES SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Disease and pest library with filterable cards.
 * Farmers can browse symptoms, prevention, and treatment info.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';

export default function DiseasesScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={globalStyle.screen} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder}>
          <Typography variant="displayHeading" center>
            Diseases
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            रोग पुस्तकालय
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
