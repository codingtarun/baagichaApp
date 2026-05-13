/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WELCOME / ONBOARDING SLIDES SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Horizontal swipeable carousel introducing app features.
 * 6 slides: Welcome, Orchards, Spray, Varieties, Weather, Shop.
 * Skip button (left), Next/Get Started button (right), dot indicator.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import type { OnboardingStackParamList } from '../../navigation/types';

type OnboardingNavProp = NativeStackNavigationProp<OnboardingStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  bgColor: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🍎',
    title: 'Welcome to Baagicha',
    titleHi: 'बागीचा में आपका स्वागत है',
    description:
      'Your all-in-one companion for apple farming in the Himalayan apple belt.',
    descriptionHi: 'हिमालयी सेब बेल्ट में सेब की खेती के लिए आपका साथी।',
    bgColor: '#E8F5E9',
  },
  {
    id: '2',
    icon: '🌳',
    title: 'Manage Your Orchards',
    titleHi: 'अपने बागों का प्रबंधन करें',
    description:
      'Track multiple orchards, record spray schedules, and monitor tree health in one place.',
    descriptionHi: 'एक स्थान पर कई बागों को ट्रैक करें, स्प्रे शेड्यूल दर्ज करें।',
    bgColor: '#FFF8E1',
  },
  {
    id: '3',
    icon: '💧',
    title: 'Never Miss a Spray',
    titleHi: 'स्प्रे कभी न चूकें',
    description:
      'Get timely reminders for fungicide, pesticide, and nutrition sprays based on weather.',
    descriptionHi: 'मौसम के आधार पर समय पर स्प्रे रिमाइंडर प्राप्त करें।',
    bgColor: '#E3F2FD',
  },
  {
    id: '4',
    icon: '📖',
    title: 'Variety & Disease Guide',
    titleHi: 'किस्म और रोग मार्गदर्शिका',
    description:
      'Explore apple varieties, rootstocks, and disease symptoms with expert advice.',
    descriptionHi: 'सेब की किस्में, रूटस्टॉक और रोग लक्षणों का अन्वेषण करें।',
    bgColor: '#F3E5F5',
  },
  {
    id: '5',
    icon: '🌤️',
    title: 'Weather Alerts',
    titleHi: 'मौसम अलर्ट',
    description:
      'Receive hyper-local weather forecasts and frost alerts for your village.',
    descriptionHi: 'अपने गांव के लिए स्थानीय मौसम पूर्वानुमान और पाला अलर्ट प्राप्त करें।',
    bgColor: '#E0F7FA',
  },
  {
    id: '6',
    icon: '🛒',
    title: 'Shop Farming Inputs',
    titleHi: 'कृषि इनपुट खरीदें',
    description:
      'Buy quality seeds, fertilizers, and tools at fair prices — delivered to your orchard.',
    descriptionHi: 'उचित मूल्य पर बीज, उर्वरक और उपकरण खरीदें — आपके बाग तक पहुंचाएं।',
    bgColor: '#FFF3E0',
  },
];

export default function WelcomeScreen(): React.JSX.Element {
  const navigation = useNavigation<OnboardingNavProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const scrollToIndex = useCallback(
    (index: number) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      navigation.navigate('NotificationPermission');
    }
  }, [currentIndex, scrollToIndex, navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('NotificationPermission');
  }, [navigation]);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
      <View style={styles.iconCircle}>
        <Typography variant="displayHeading" style={styles.icon}>
          {item.icon}
        </Typography>
      </View>
      <PrimaryHeading style={styles.title}>{item.title}</PrimaryHeading>
      <HindiText style={styles.titleHi}>{item.titleHi}</HindiText>
      <Typography variant="body" center style={styles.description}>
        {item.description}
      </Typography>
      <HindiText center style={styles.descriptionHi}>
        {item.descriptionHi}
      </HindiText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Typography variant="body" style={styles.skipText}>
          Skip / छोड़ें
        </Typography>
      </TouchableOpacity>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Dot Indicator */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, isLastSlide && styles.getStartedButton]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Typography variant="button" style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started / शुरू करें' : 'Next / आगे'}
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: Colors.gray500,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 120,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: Colors.gray400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 4,
  },
  titleHi: {
    fontSize: 16,
    color: Colors.gray500,
    marginBottom: 16,
  },
  description: {
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  descriptionHi: {
    fontSize: 13,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray300,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  getStartedButton: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
