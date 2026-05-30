/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HOME STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * LEARN: Every tab in the bottom navbar gets its OWN stack
 * navigator. This means when you push screens inside this tab,
 * the bottom tab bar STAYS VISIBLE. Without this nested stack,
 * pushed screens would hide the tab bar.
 *
 * Structure:
 *   HomeTab (BottomTab) → HomeStack
 *     ├── Home
 *     └── (future detail screens push here)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import CardDetailScreen from '../../screens/CardDetailScreen';
import FeedDetailScreen from '../../screens/FeedDetailScreen';
import PostDetailScreen from '../../screens/PostDetailScreen';
import UserProfileScreen from '../../screens/UserProfileScreen';
import GroupDetailScreen from '../../screens/GroupDetailScreen';
import GroupCreateScreen from '../../screens/GroupCreateScreen';
import GroupEditScreen from '../../screens/GroupEditScreen';
import GroupJoinRequestsScreen from '../../screens/GroupJoinRequestsScreen';

export type PriorityCardData = {
  id: string;
  type: 'weather_alert' | 'notification' | 'work' | 'weekly_recommendation';
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  ctaText?: string;
  timestamp?: string;
  extraInfo?: { icon: string; label: string; value: string }[];
};

export type HomeStackParamList = {
  Home: undefined;
  CardDetail: { card: PriorityCardData };
  FeedDetail: { postId: string };
  PostDetail: { postId: string };
  UserProfile: { userId: string };
  GroupDetail: { slug: string };
  GroupCreate: undefined;
  GroupEdit: { slug: string };
  GroupJoinRequests: { slug: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      <Stack.Screen name="FeedDetail" component={FeedDetailScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="GroupCreate" component={GroupCreateScreen} />
      <Stack.Screen name="GroupEdit" component={GroupEditScreen} />
      <Stack.Screen name="GroupJoinRequests" component={GroupJoinRequestsScreen} />
    </Stack.Navigator>
  );
}
