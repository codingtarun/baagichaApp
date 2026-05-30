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
import GroupListScreen from '../../screens/GroupListScreen';
import ImageViewerScreen from '../../screens/ImageViewerScreen';

// Discover / Baagicha screens (moved from Discover tab to Home tab)
import VarietyScreen from '../../screens/VarietyScreen';
import VarietyDetailScreen from '../../screens/VarietyDetailScreen';
import VarietyCompareScreen from '../../screens/VarietyCompareScreen';
import DiseaseScreen from '../../screens/DiseaseScreen';
import DiseaseDetailScreen from '../../screens/DiseaseDetailScreen';
import WeatherScreen from '../../screens/WeatherScreen';
import BlogScreen from '../../screens/BlogScreen';
import BlogDetailScreen from '../../screens/BlogDetailScreen';
import RootstockListScreen from '../../screens/RootstockListScreen';
import RootstockDetailScreen from '../../screens/RootstockDetailScreen';
import CommunityScreen from '../../screens/CommunityScreen';
import StoryViewerScreen from '../../screens/StoryViewerScreen';
import StoryTextComposer from '../../screens/StoryTextComposer';
import StoryMediaPreview from '../../screens/StoryMediaPreview';
import type { StoryGroup } from '../../services/storyApi';

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
  GroupList: undefined;
  ImageViewer: {
    images: {
      id: number;
      url: string;
      thumb: string;
      medium: string;
      large: string;
    }[];
    initialIndex: number;
  };

  // Discover / Baagicha screens
  VarietyList: undefined;
  VarietyDetail: { slug: string };
  VarietyCompare: { slugs: string[] };
  Diseases: undefined;
  DiseaseDetail: { slug: string };
  Weather: undefined;
  Blog: undefined;
  BlogDetail: { slug: string };
  RootstockList: undefined;
  RootstockDetail: { slug: string };

  // Community Q&A (accessed from Home tab)
  Community: undefined;

  // Stories
  StoryViewer: { groups: StoryGroup[]; initialGroupIndex: number };
  StoryTextComposer: undefined;
  StoryMediaPreview: { uri: string; mediaType: 'image' | 'video'; mimeType: string };
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
      <Stack.Screen name="GroupList" component={GroupListScreen} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />

      {/* Discover / Baagicha screens */}
      <Stack.Screen name="VarietyList" component={VarietyScreen} />
      <Stack.Screen name="VarietyDetail" component={VarietyDetailScreen} />
      <Stack.Screen name="VarietyCompare" component={VarietyCompareScreen} />
      <Stack.Screen name="Diseases" component={DiseaseScreen} />
      <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Blog" component={BlogScreen} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
      <Stack.Screen name="RootstockList" component={RootstockListScreen} />
      <Stack.Screen name="RootstockDetail" component={RootstockDetailScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />
      <Stack.Screen name="StoryTextComposer" component={StoryTextComposer} />
      <Stack.Screen name="StoryMediaPreview" component={StoryMediaPreview} />
    </Stack.Navigator>
  );
}
