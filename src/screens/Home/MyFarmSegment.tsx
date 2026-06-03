/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — MY FARM SEGMENT (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * The default Home screen segment. Compact, information-dense
 * Farming Dashboard with all critical orchard data.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { HomeNavigationProp } from '../../navigation/types';

import {
  CompactHeroCard,
  QuickStatsStrip,
  QuickActionsGrid,
  CompactTaskList,
  CompactForecastStrip,
  CompactAlertRow,
} from '../../components/dashboard';
import type { CompactHeroStage, CompactHeroWeather, QuickStat, QuickAction, CompactTask, CompactForecastDay, CompactAlert } from '../../components/dashboard';
import { Colors } from '../../theme/colors';

// ── Mock Data (will be replaced by API in Phase 6) ──

const STAGE: CompactHeroStage = {
  name: 'Dormancy Break / Green Tip',
  nameHi: 'सुप्तावस्था / हरी कली',
  period: 'Mar 1 – Mar 20, 2026',
  progress: 65,
  daysLeft: 12,
  nextStage: 'Tight Cluster',
  nextStageHi: 'कसी कली',
};

const WEATHER: CompactHeroWeather = {
  temp: 18,
  wind: 12,
  rain: 20,
  suitType: 'perfect',
  suitLabel: 'Spray OK',
  suitLabelHi: 'उचित',
};

const STATS: QuickStat[] = [
  { key: 'sprays', icon: 'spray-bottle', value: '3', label: 'Sprays', labelHi: 'स्प्रे', color: Colors.primary },
  { key: 'risk', icon: 'alert-circle', value: 'High', label: 'Disease Risk', labelHi: 'रोग जोखिम', color: Colors.danger },
  { key: 'done', icon: 'check-circle', value: '7', label: 'Done', labelHi: 'पूरा', color: Colors.success },
  { key: 'alerts', icon: 'bell-alert', value: '2', label: 'Alerts', labelHi: 'अलर्ट', color: Colors.warning },
];

const ACTIONS: QuickAction[] = [
  { key: 'log-spray', icon: 'spray-bottle', label: 'Log Spray', labelHi: 'छिड़काव लॉग', color: Colors.primary, onPress: () => {} },
  { key: 'weather', icon: 'weather-partly-cloudy', label: 'Weather', labelHi: 'मौसम', color: Colors.info, onPress: () => {} },
  { key: 'disease', icon: 'virus', label: 'Disease Scan', labelHi: 'रोग स्कैन', color: Colors.danger, onPress: () => {} },
  { key: 'mandi', icon: 'chart-line', label: 'Mandi Rates', labelHi: 'मंडी भाव', color: Colors.accent, onPress: () => {} },
];

const TASKS = {
  spray: [
    { id: 's1', name: 'Copper Oxychloride 50WP', nameHi: 'कॉपर ऑक्सीक्लोराइड', due: 'Today', priority: 'essential' as const },
    { id: 's2', name: 'Mancozeb 75WP', nameHi: 'मैन्कोजेब', due: 'Tomorrow', priority: 'recommended' as const },
    { id: 's3', name: 'Imidacloprid 17.8 SL', nameHi: 'इमिडाक्लोप्रिड', due: 'Mar 12', priority: 'conditional' as const },
  ],
  nutrition: [
    { id: 'n1', name: 'Zinc Sulphate 21%', nameHi: 'जिंक सल्फेट', due: 'Now', priority: 'essential' as const },
    { id: 'n2', name: 'Boron 20% (Solubor)', nameHi: 'बोरोन', due: 'Mar 15', priority: 'recommended' as const },
  ],
  cultural: [
    { id: 'c1', name: 'Pruning — Dead Wood', nameHi: 'छँटाई — सूखी टहनियाँ', due: 'Now', priority: 'essential' as const },
    { id: 'c2', name: 'Rootstock Sucker Removal', nameHi: 'मूलवृंत के अंकुर हटाएँ', due: 'Weekly', priority: 'recommended' as const },
  ],
};

const FORECAST: CompactForecastDay[] = [
  { day: 'रवि', dayEn: 'Sun', date: 'Mar 9', icon: 'weather-sunny', iconColor: '#f59e0b', high: 18, low: 4, suit: 'perfect' },
  { day: 'सोम', dayEn: 'Mon', date: 'Mar 10', icon: 'weather-partly-cloudy', iconColor: '#64748b', high: 17, low: 5, suit: 'perfect' },
  { day: 'मंगल', dayEn: 'Tue', date: 'Mar 11', icon: 'weather-rainy', iconColor: '#3b82f6', high: 14, low: 3, suit: 'avoid' },
  { day: 'बुध', dayEn: 'Wed', date: 'Mar 12', icon: 'weather-cloudy', iconColor: '#94a3b8', high: 15, low: 4, suit: 'caution' },
];

const ALERTS: CompactAlert[] = [
  { id: 'a1', title: 'Apple Scab Risk — High', titleHi: 'सेब खुजली का खतरा — अधिक', desc: 'Wet conditions forecast Mar 12–13. Apply Mancozeb before rain.', severity: 'critical', type: 'preventive', meta: '3 orchards nearby affected' },
  { id: 'a2', title: 'Late Frost Possible', titleHi: 'देर से पाला पड़ सकता है', desc: 'Temperatures may drop to −2°C above 7500ft. Protect young grafts.', severity: 'high', type: 'preventive' },
];

export default function MyFarmSegment(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();

  const goToSpray = () => navigation.navigate('Spray' as any);
  const goToWeather = () => navigation.navigate('Weather' as any);
  const goToDisease = () => navigation.navigate('Diseases' as any);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <CompactHeroCard stage={STAGE} weather={WEATHER} />
      <QuickStatsStrip stats={STATS} />
      <QuickActionsGrid actions={ACTIONS.map(a => ({ ...a, onPress: a.key === 'weather' ? goToWeather : a.onPress }))} />
      <CompactTaskList tasks={TASKS} onViewAll={goToSpray} />
      <CompactForecastStrip forecast={FORECAST} onViewAll={goToWeather} />
      <CompactAlertRow alerts={ALERTS} onViewAll={goToDisease} />
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 4,
    paddingBottom: 120,
  },
});
