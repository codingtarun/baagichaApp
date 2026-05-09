/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — APP ENTRY POINT
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: App.tsx is the FIRST component React Native renders.
 * Think of it as the "front door" of your app.
 *
 * We wrap everything in these essential providers:
 *   1. SafeAreaProvider — handles notches, home indicators, status bar
 *   2. NavigationContainer — REQUIRED by React Navigation. It manages
 *      the navigation state, deep links, and screen transitions.
 *
 * Without NavigationContainer, React Navigation won't work at all!
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Colors } from './src/theme/colors';

// Import our root navigator
import AppNavigator from './src/navigation/AppNavigator';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      {/*
        LEARN: StatusBar controls the color of the time/battery/wifi
        icons at the top of the screen. We want them LIGHT (white)
        because our header has a dark green background.

        On Android, we also set the background color of the status
        bar to match our app's header.
      */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.bgPrimary}
      />

      {/*
        LEARN: NavigationContainer is the ROOT of React Navigation.
        It must wrap ALL navigators in your app. It provides:
          · Navigation state management
          · Deep linking support
          · Screen tracking for analytics
          · Back button handling (Android)
      */}
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
