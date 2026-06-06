/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — KISAN TOOLS / FARMER WIDGETS SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Central hub for all standalone utility calculators & guides.
 * Organized into categorized sections with a 2-column grid.
 *
 * Categories:
 *   · Orchard Establishment & Planning
 *   · Crop Load & Thinning
 *   · Spray & Inputs
 *   · Harvest & Post-Harvest
 *   · Financial & Market
 *   · Weather & Phenology
 *   · Training & Pruning
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Shadows, Radius } from '../theme/style';
import { Typography, SectionHeader } from '../typography';
import ScreenLayout from '../components/ScreenLayout';

// ── Types ──

interface ToolWidget {
  id: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  titleHi: string;
}

interface ToolCategory {
  key: string;
  title: string;
  titleHi: string;
  emoji: string;
  widgets: ToolWidget[];
}

// ── Data: All 26 Widgets ──

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    key: 'orchard',
    title: 'Orchard Establishment & Planning',
    titleHi: 'बाग स्थापना और योजना',
    emoji: '🌱',
    widgets: [
      { id: 'orchard-cost', icon: 'calculator-variant', iconColor: Colors.primary, bgColor: Colors.primary50, title: 'New Orchard Cost Estimator', titleHi: 'नया बाग लागत अनुमान' },
      { id: 'tree-spacing', icon: 'grid', iconColor: Colors.primary, bgColor: Colors.primary50, title: 'Tree Spacing & Density', titleHi: 'पेड़ की दूरी और घनत्व' },
      { id: 'pollinizer-plan', icon: 'account-group', iconColor: Colors.primary, bgColor: Colors.primary50, title: 'Pollinizer Ratio Planner', titleHi: 'परागक योजना' },
      { id: 'layout-viz', icon: 'map-marker-radius', iconColor: Colors.primary, bgColor: Colors.primary50, title: 'Orchard Layout Visualizer', titleHi: 'बाग लेआउट दृश्य' },
    ],
  },
  {
    key: 'thinning',
    title: 'Crop Load & Thinning',
    titleHi: 'फसल भार और छँटाई',
    emoji: '✂️',
    widgets: [
      { id: 'trunk-thinning', icon: 'diameter-variant', iconColor: Colors.accent, bgColor: Colors.accent50, title: 'Thinning by Trunk Diameter', titleHi: 'तने के व्यास से छँटाई' },
      { id: 'equilifruit', icon: 'circle-slice-8', iconColor: Colors.accent, bgColor: Colors.accent50, title: 'Equilifruit Branch Disc', titleHi: 'शाखा फल अनुपात' },
      { id: 'crop-load-target', icon: 'target', iconColor: Colors.accent, bgColor: Colors.accent50, title: 'Crop Load Target', titleHi: 'लक्ष्य फसल भार' },
      { id: 'fruitlet-tracker', icon: 'chart-line', iconColor: Colors.accent, bgColor: Colors.accent50, title: 'Fruitlet Growth Tracker', titleHi: 'फल विकास ट्रैकर' },
    ],
  },
  {
    key: 'spray',
    title: 'Spray & Inputs',
    titleHi: 'छिड़काव और इनपुट',
    emoji: '🧪',
    widgets: [
      { id: 'sprayer-calib', icon: 'spray', iconColor: Colors.info, bgColor: Colors.infoLight, title: 'Sprayer Calibration', titleHi: 'स्प्रेयर कैलिब्रेशन' },
      { id: 'pesticide-mix', icon: 'flask', iconColor: Colors.info, bgColor: Colors.infoLight, title: 'Pesticide Mix Calculator', titleHi: 'कीटनाशक मिश्रण' },
      { id: 'fertilizer-calc', icon: 'seedling', iconColor: Colors.info, bgColor: Colors.infoLight, title: 'Fertilizer Requirement', titleHi: 'उर्वरक आवश्यकता' },
      { id: 'calcium-schedule', icon: 'calendar-clock', iconColor: Colors.info, bgColor: Colors.infoLight, title: 'Calcium Spray Schedule', titleHi: 'कैल्शियम छिड़काव कार्यक्रम' },
    ],
  },
  {
    key: 'harvest',
    title: 'Harvest & Post-Harvest',
    titleHi: 'कटाई और बाद की प्रक्रिया',
    emoji: '🧺',
    widgets: [
      { id: 'maturity-check', icon: 'basket-check', iconColor: Colors.warning, bgColor: Colors.warningLight, title: 'Harvest Maturity Checker', titleHi: 'कटाई परिपक्वता जाँच' },
      { id: 'fruit-grade', icon: 'ruler', iconColor: Colors.warning, bgColor: Colors.warningLight, title: 'Fruit Grade / Size', titleHi: 'फल ग्रेड / आकार' },
      { id: 'weight-estimator', icon: 'scale-balance', iconColor: Colors.warning, bgColor: Colors.warningLight, title: 'Fruit Weight Estimator', titleHi: 'फल वजन अनुमान' },
      { id: 'cold-storage', icon: 'warehouse', iconColor: Colors.warning, bgColor: Colors.warningLight, title: 'Cold Storage Rent', titleHi: 'कोल्ड स्टोर किराया' },
      { id: 'harvest-labour', icon: 'account-clock', iconColor: Colors.warning, bgColor: Colors.warningLight, title: 'Harvest Labour Estimator', titleHi: 'कटाई श्रम अनुमान' },
    ],
  },
  {
    key: 'financial',
    title: 'Financial & Market',
    titleHi: 'वित्त और बाज़ार',
    emoji: '💰',
    widgets: [
      { id: 'input-cost', icon: 'cash-register', iconColor: Colors.success, bgColor: Colors.successLight, title: 'Input Cost Tracker', titleHi: 'इनपुट लागत ट्रैकर' },
      { id: 'mandi-break-even', icon: 'chart-areaspline', iconColor: Colors.success, bgColor: Colors.successLight, title: 'Mandi Price Break-Even', titleHi: 'मंडी भाव ब्रेक-ईवन' },
      { id: 'subsidy-check', icon: 'file-document-check', iconColor: Colors.success, bgColor: Colors.successLight, title: 'Subsidy Eligibility', titleHi: 'सब्सिडी पात्रता' },
    ],
  },
  {
    key: 'weather',
    title: 'Weather & Phenology',
    titleHi: 'मौसम और फेनोलॉजी',
    emoji: '🌡️',
    widgets: [
      { id: 'gdd-calc', icon: 'thermometer', iconColor: Colors.primary700, bgColor: Colors.primary50, title: 'Growing Degree Days', titleHi: 'बढ़ते दिन की गणना' },
      { id: 'chill-hours', icon: 'snowflake', iconColor: Colors.primary700, bgColor: Colors.primary50, title: 'Chill Hour Tracker', titleHi: 'ठंडे घंटे ट्रैकर' },
      { id: 'bloom-countdown', icon: 'calendar-range', iconColor: Colors.primary700, bgColor: Colors.primary50, title: 'Bloom to Harvest Countdown', titleHi: 'फूल से कटाई उलटी गिनती' },
      { id: 'frost-risk', icon: 'weather-snowy-alert', iconColor: Colors.primary700, bgColor: Colors.primary50, title: 'Frost Risk Window', titleHi: 'पाला जोखिम अवधि' },
    ],
  },
  {
    key: 'pruning',
    title: 'Training & Pruning',
    titleHi: 'प्रशिक्षण और छँटाई',
    emoji: '🌳',
    widgets: [
      { id: 'pruning-weight', icon: 'weight-kilogram', iconColor: Colors.gray600, bgColor: Colors.gray100, title: 'Pruning Weight Estimator', titleHi: 'छँटाई वजन अनुमान' },
      { id: 'branch-angle', icon: 'angle-acute', iconColor: Colors.gray600, bgColor: Colors.gray100, title: 'Branch Angle Guide', titleHi: 'शाखा कोण मार्गदर्शिका' },
    ],
  },
];

// ── Component ──

export default function ToolsScreen(): React.JSX.Element {
  const handleWidgetPress = (widget: ToolWidget) => {
    Alert.alert(
      widget.title,
      `${widget.titleHi}\n\nThis tool is coming soon. Stay tuned!`,
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  };

  const renderWidget = (widget: ToolWidget) => (
    <TouchableOpacity
      key={widget.id}
      style={styles.widgetCard}
      onPress={() => handleWidgetPress(widget)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${widget.title} / ${widget.titleHi}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: widget.bgColor }]}>
        <Icon name={widget.icon as any} size={24} color={widget.iconColor} />
      </View>
      <Typography variant="bodySmall" style={styles.widgetTitle} numberOfLines={2}>
        {widget.title}
      </Typography>
      <Typography variant="hindiMicro" style={styles.widgetTitleHi} numberOfLines={2}>
        {widget.titleHi}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title */}
        <View style={styles.titleSection}>
          <Typography variant="displayHeading">Kisan Tools</Typography>
          <Typography variant="hindiDisplaySection" style={styles.titleHi}>
            किसान उपकरण
          </Typography>
        </View>

        {/* Categories */}
        {TOOL_CATEGORIES.map((category) => (
          <View key={category.key} style={styles.categorySection}>
            <SectionHeader
              title={`${category.emoji} ${category.title}`}
              subtitleHi={category.titleHi}
              style={styles.sectionHeader}
            />
            <View style={styles.gridRow}>
              {category.widgets.map(renderWidget)}
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenLayout>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  titleSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleHi: {
    marginTop: 2,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  widgetCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: 14,
    alignItems: 'center',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  widgetTitle: {
    fontWeight: '700',
    color: Colors.gray900,
    textAlign: 'center',
    lineHeight: 18,
  },
  widgetTitleHi: {
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
  },
});
