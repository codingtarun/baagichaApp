/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SPRAY SCHEDULE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Shows the current spray schedule based on growth stage,
 * fruit type, and region.
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import AppHeader from '../components/AppHeader';

export default function SprayScreen(): React.JSX.Element {
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
            Spray Schedule
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            छिड़काव कार्यक्रम
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
