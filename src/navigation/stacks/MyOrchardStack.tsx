/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY ORCHARD STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * Nested stack for the My Orchard tab. Keeps bottom navbar
 * visible when pushing screens from the My Orchard tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../../screens/ProfileScreen';
import MyProfileScreen from '../../screens/MyProfileScreen';
import EditProfileScreen from '../../screens/EditProfileScreen';
import MyGroupsScreen from '../../screens/MyGroupsScreen';
import GroupDetailScreen from '../../screens/GroupDetailScreen';
import GroupCreateScreen from '../../screens/GroupCreateScreen';
import GroupListScreen from '../../screens/GroupListScreen';
import OrchardListScreen from '../../screens/OrchardListScreen';
import OrchardDetailScreen from '../../screens/OrchardDetailScreen';
import OrchardFormScreen from '../../screens/OrchardFormScreen';
import BlockFormScreen from '../../screens/BlockFormScreen';
import OrchardVarietyFormScreen from '../../screens/OrchardVarietyFormScreen';
import ImageViewerScreen from '../../screens/ImageViewerScreen';

export type MyOrchardStackParamList = {
  MyOrchard: undefined;
  MyProfile: undefined;
  EditProfile: undefined;
  MyGroups: undefined;
  GroupDetail: { slug: string };
  GroupCreate: undefined;
  GroupList: undefined;
  OrchardList: undefined;
  OrchardDetail: { orchardId: number };
  OrchardForm: { orchardId?: number } | undefined;
  BlockForm: { orchardId: number; blockId?: number } | undefined;
  OrchardVarietyForm: { orchardId: number; varietyId?: number } | undefined;
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
};

const Stack = createNativeStackNavigator<MyOrchardStackParamList>();

export default function MyOrchardStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyOrchard" component={ProfileScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyGroups" component={MyGroupsScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="GroupCreate" component={GroupCreateScreen} />
      <Stack.Screen name="GroupList" component={GroupListScreen} />
      <Stack.Screen name="OrchardList" component={OrchardListScreen} />
      <Stack.Screen name="OrchardDetail" component={OrchardDetailScreen} />
      <Stack.Screen name="OrchardForm" component={OrchardFormScreen} />
      <Stack.Screen name="BlockForm" component={BlockFormScreen} />
      <Stack.Screen name="OrchardVarietyForm" component={OrchardVarietyFormScreen} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
    </Stack.Navigator>
  );
}
