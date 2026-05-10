/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISCOVER SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Central hub for all knowledge & reference content:
 *   · Diseases — Disease and pest library
 *   · Variety — Apple variety guide
 *   · Rootstock — Rootstock guide
 *   · Blog — Knowledge base articles
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

interface DiscoverItem {
  icon: string;
  title: string;
  titleHi: string;
  description: string;
  color: string;
  bgColor: string;
  route: keyof DiscoverNavigationProp;
}

const DISCOVER_ITEMS: DiscoverItem[] = [
  {
    icon: 'virus',
    title: 'Diseases',
    titleHi: 'रोग',
    description: 'Identify, prevent, and treat apple diseases & pests',
    color: Colors.danger,
    bgColor: 'rgba(239, 68, 68, 0.1)',
    route: 'Diseases',
  },
  {
    icon: 'apple-whole',
    title: 'Variety',
    titleHi: 'किस्में',
    description: 'Explore apple varieties best suited for your altitude',
    color: Colors.warning,
    bgColor: 'rgba(245, 158, 11, 0.1)',
    route: 'VarietyList',
  },
  {
    icon: 'tree',
    title: 'Rootstock',
    titleHi: 'मूलवृंत',
    description: 'Learn about rootstocks for better orchard planning',
    color: Colors.primary,
    bgColor: 'rgba(58, 125, 68, 0.1)',
    route: 'RootstockList',
  },
  {
    icon: 'newspaper',
    title: 'Blog',
    titleHi: 'ब्लॉग',
    description: 'Spray calendars, market prices, and farming tips',
    color: Colors.info,
    bgColor: 'rgba(59, 130, 246, 0.1)',
    route: 'Blog',
  },
];

export default function DiscoverScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const handlePress = (item: DiscoverItem) => {
    navigation.navigate(item.route as any);
  };

  return (
    <ScreenLayout>
      {/* Page Title */}
      <View style={styles.titleSection}>
        <Typography variant="displayHeading">Baagicha</Typography>
        <Typography variant="hindiDisplaySection" style={styles.titleHi}>
          खोजें
        </Typography>
      </View>

      {/* Discover Cards */}
      <View style={styles.cardsContainer}>
        {DISCOVER_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}: ${item.description}`}
            onPress={() => handlePress(item)}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: item.bgColor },
              ]}
            >
              <Icon name={item.icon} size={24} color={item.color} />
            </View>

            <View style={styles.textContent}>
              <View style={styles.titleRow}>
                <Typography variant="cardTitle">{item.title}</Typography>
                <Typography variant="hindiCardName" style={{ color: item.color }}>
                  · {item.titleHi}
                </Typography>
              </View>
              <Typography variant="bodySmall" style={styles.description}>
                {item.description}
              </Typography>
            </View>

            <Icon
              name="chevron-right"
              size={20}
              color={Colors.gray400}
              style={styles.arrow}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  titleSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  titleHi: {
    marginTop: 2,
  },

  cardsContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  textContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },

  description: {
    color: Colors.gray500,
  },

  arrow: {
    marginLeft: 8,
  },
});
