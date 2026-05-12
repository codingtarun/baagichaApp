/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * The main dashboard. Shows auth prompt for guests.
 * All content is accessible without login.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import AuthPromptBanner from '../components/AuthPromptBanner';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen(): React.JSX.Element {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Show personalised greeting if logged in, generic if not
  const farmerName = user?.name ?? 'Farmer';

  return (
    <ScreenLayout
      headerProps={{
        farmerName: isAuthenticated ? farmerName.split(' ')[0] : 'Guest',
        location: 'Shimla, HP',
        temperature: '18',
        condition: 'Sunny',
        sprayStatus: 'Safe to spray',
        daysToBloom: 14,
        pendingSprays: 3,
        mandiTrend: '+₹12',
        notificationCount: isAuthenticated ? 3 : 0,
      }}
    >
      {/* Auth prompt for guests */}
      {!isAuthenticated && (
        <AuthPromptBanner
          message="Sign in to unlock personalised spray schedules, weather alerts for your orchard, and exclusive farming input deals."
          messageHi="अपने बाग के लिए व्यक्तिगत स्प्रे शेड्यूल, मौसम अलर्ट और कृषि इनपुट डील के लिए साइन इन करें।"
        />
      )}

      {/* Logged-in welcome card */}
      {isAuthenticated && (
        <View style={styles.welcomeCard}>
          <Typography variant="displayHeading" style={styles.welcomeTitle}>
            Namaste, {farmerName.split(' ')[0]}!
          </Typography>
          <Typography variant="body" style={styles.welcomeSubtitle}>
            Your orchard dashboard is ready.
          </Typography>
        </View>
      )}

      {/* Home screen content placeholder */}
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
  welcomeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 20,
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
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
