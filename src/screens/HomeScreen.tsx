/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — HYBRID HOME SCREEN (Farming Dashboard + Community)
 * ═══════════════════════════════════════════════════════════════
 *
 * The app's command center. Default view is the compact Farming
 * Dashboard (My Farm). One tap switches to the stripped-down
 * Community feed.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenLayout from '../components/ScreenLayout';
import SegmentedControl from '../components/SegmentedControl';
import { Colors } from '../theme/colors';

import MyFarmSegment from './Home/MyFarmSegment';
import CommunitySegment from './Home/CommunitySegment';

const SEGMENTS = [
  { key: 'community', label: 'Community', labelHi: 'समुदाय' },
  { key: 'farm', label: 'My Farm', labelHi: 'मेरी खेती' },
];

export default function HomeScreen(): React.JSX.Element {
  const [activeSegment, setActiveSegment] = useState('farm');

  // Reset to Farming Dashboard whenever user returns to Home tab
  useFocusEffect(
    useCallback(() => {
      setActiveSegment('farm');
    }, [])
  );

  return (
    <ScreenLayout scrollable={false}>
      <View style={styles.container}>
        <SegmentedControl
          segments={SEGMENTS}
          activeKey={activeSegment}
          onChange={setActiveSegment}
        />
        {activeSegment === 'farm' && <MyFarmSegment />}
        {activeSegment === 'community' && <CommunitySegment />}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
