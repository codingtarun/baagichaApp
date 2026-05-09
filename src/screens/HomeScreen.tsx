/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: A "Screen" in React Native is just a component that
 * takes up the full screen. It receives navigation props from
 * React Navigation automatically.
 *
 * This is the main dashboard showing:
 *   · Do Now Banner
 *   · Weather Forecast
 *   · Weekly Tasks
 *   · Alerts
 *   · Top Varieties / Rootstocks / Blogs / Contributors
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import AppHeader from '../components/AppHeader';

export default function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* Custom Header - appears on all screens */}
      <AppHeader
        temperature="18"
        condition="Sunny"
        notificationCount={3}
      />

      {/* Scrollable content area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Placeholder for Home content */}
        <View style={styles.placeholder}>
          <Typography variant="displayHeading" center>
            Home Screen
          </Typography>
          <Typography variant="bodyMuted" center style={styles.subtitle}>
            Dashboard with Do Now, Forecast, Tasks, Alerts, and more...
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // LEARN: flex: 1 makes the container fill the entire screen
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },

  scrollView: {
    flex: 1,
  },

  // LEARN: paddingBottom adds space at the bottom so the last item
  // isn't hidden behind the bottom tab bar (which is ~90px tall)
  scrollContent: {
    paddingBottom: 100,
  },

  placeholder: {
    flex: 1,
    padding: 24,
    marginTop: 80,
    alignItems: 'center',
  },

  subtitle: {
    marginTop: 12,
    textAlign: 'center',
  },
});
