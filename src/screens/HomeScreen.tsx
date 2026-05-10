/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * The main dashboard. Uses ScreenLayout for automatic
 * GlobalHeader + scroll-compact behavior.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';

export default function HomeScreen(): React.JSX.Element {
  return (
    <ScreenLayout
      headerProps={{
        farmerName: 'Ramesh',
        location: 'Shimla, HP',
        temperature: '18',
        condition: 'Sunny',
        sprayStatus: 'Safe to spray',
        daysToBloom: 14,
        pendingSprays: 3,
        mandiTrend: '+₹12',
        notificationCount: 3,
      }}
    >
      {/* All home screen content goes here */}
      <View style={styles.placeholder}>
        <Typography variant="displayHeading" center>
          Home Screen
        </Typography>
        <Typography variant="bodyMuted" center style={styles.subtitle}>
          Dashboard with Do Now, Forecast, Tasks, Alerts, and more...
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
