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
 *   2. NavigationContainer — REQUIRED by React Navigation.
 *   3. Toast — global notification overlay (renders above everything)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { Colors } from './src/theme/colors';

import AppNavigator from './src/navigation/AppNavigator';
import Toast from './src/components/Toast';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.bgPrimary}
      />

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>

      {/* Global Toast — renders above everything */}
      <Toast />
    </SafeAreaProvider>
  );
}
