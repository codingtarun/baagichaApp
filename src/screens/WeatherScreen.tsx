/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WEATHER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * 7-day weather forecast with spray suitability indicators.
 * Shows temperature, wind, rain probability, and spray windows.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';

export default function WeatherScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={globalStyle.screen} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.placeholder}>
          <Typography variant="displayHeading" center>
            Weather
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            मौसम पूर्वानुमान
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
