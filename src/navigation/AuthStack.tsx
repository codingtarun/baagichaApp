/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — AUTH STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * Contains all authentication screens:
 *   - Login (multi-method hub)
 *   - Email Register
 *   - Phone Auth (2-step OTP)
 *   - Forgot Password
 *   - Onboarding (new user profile completion)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';

import LoginScreen from '../screens/Auth/LoginScreen';
import EmailRegisterScreen from '../screens/Auth/EmailRegisterScreen';
import PhoneAuthScreen from '../screens/Auth/PhoneAuthScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EmailRegister" component={EmailRegisterScreen} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
