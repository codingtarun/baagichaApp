/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WELCOME / ONBOARDING SLIDES SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * 4 clean, centered slides introducing app features.
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { Space, Radius, Shadows } from '../../theme/style';
import { Typography, PrimaryHeading, HindiText } from '../../typography';
import type { RootStackParamList } from '../../navigation/types';
type WelcomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🍎',
    title: 'Welcome to Baagicha',
    titleHi: 'बागीचा में आपका स्वागत है',
    description:
      'Your all-in-one companion for apple farming in the Himalayan apple belt.',
    descriptionHi:
      'हिमालयी सेब बेल्ट में सेब की खेती के लिए आपका साथी।',
  },
  {
    id: '2',
    icon: '🌳',
    title: 'Your Orchard',
    titleHi: 'आपका बाग',
    description:
      'Track multiple orchards, record spray schedules, and get timely weather-based spray reminders.',
    descriptionHi:
      'कई बागों को ट्रैक करें, स्प्रे शेड्यूल दर्ज करें, और समय पर रिमाइंडर पाएं।',
  },
  {
    id: '3',
    icon: '📖',
    title: 'Expert Knowledge',
    titleHi: 'विशेषज्ञ ज्ञान',
    description:
      'Explore apple varieties, disease guides, and get hyper-local weather forecasts with frost alerts.',
    descriptionHi:
      'सेब की किस्में, रोग मार्गदर्शिका और स्थानीय मौसम पूर्वानुमान जानें।',
  },
  {
    id: '4',
    icon: '🛒',
    title: 'Shop & Connect',
    titleHi: 'खरीदें और जुड़ें',
    description:
      'Buy quality seeds, fertilizers, and tools. Ask experts and connect with fellow farmers.',
    descriptionHi:
      'बीज, उर्वरक और उपकरण खरीदें। विशेषज्ञों से पूछें और किसानों से जुड़ें।',
  },
];

export default function WelcomeScreen(): React.JSX.Element {
  const navigation = useNavigation<WelcomeNavProp>();
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

  const scrollToIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      navigation.navigate('Auth');
    }
  }, [currentIndex, scrollToIndex, navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slideCard}>
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <View style={styles.skipRow}>
          <Typography variant="body" style={styles.skipText}>
            Skip / छोड़ें
          </Typography>
          <Icon
            name="arrow-right"
            size={18}
            color={Colors.gray500}
            style={styles.skipArrow}
          />
        </View>
      </TouchableOpacity>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
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
            style={[styles.dot, index === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
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
    backgroundColor: Colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipText: {
    color: Colors.gray500,
    fontWeight: '600',
    fontSize: 13,
  },
  skipArrow: {
    marginLeft: 4,
    marginTop: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space[5],
  },
  slideCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    paddingVertical: Space[7],
    paddingHorizontal: Space[6],
    alignItems: 'center',
    width: '100%',
    ...Shadows.medium,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space[5],
    ...Shadows.medium,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Space[1],
    color: Colors.gray900,
    letterSpacing: -0.3,
  },
  titleHi: {
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: Space[4],
  },
  description: {
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Space[2],
    fontSize: 13,
    paddingHorizontal: Space[2],
  },
  descriptionHi: {
    fontSize: 12,
    color: Colors.gray400,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Space[2],
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
    paddingHorizontal: Space[6],
    paddingBottom: Space[6],
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Space[4],
    alignItems: 'center',
    ...Shadows.strong,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
