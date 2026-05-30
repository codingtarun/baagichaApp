/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMMUNITY STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * Nested stack for the Community (Q&A) tab.
 * CommunityTab (BottomTab) → CommunityStack
 *   ├── Community        (Q&A feed)
 *   ├── PostDetail       (question detail with answers)
 *   └── ImageViewer      (full-screen images)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityScreen from '../../screens/CommunityScreen';
import PostDetailScreen from '../../screens/PostDetailScreen';
import ImageViewerScreen from '../../screens/ImageViewerScreen';
import UserProfileScreen from '../../screens/UserProfileScreen';

export type CommunityStackParamList = {
  Community: undefined;
  PostDetail: { postId: string };
  ImageViewer: { images: { id: number; url: string; thumb?: string; medium?: string; large?: string }[]; initialIndex: number };
  UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}
