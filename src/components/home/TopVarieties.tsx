/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOP VARIETIES (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Horizontal scroll cards for apple varieties with rank, tag, altitude, rating.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';
import PressableScale from '../PressableScale';
import SmartImage from '../SmartImage';

export interface VarietyItem {
  name: string;
  nameHi: string;
  altitude: string;
  votes: number;
  rating: number;
  color: string;
  tag: string;
  image?: string;
}

interface TopVarietiesProps {
  varieties: VarietyItem[];
  onViewAll?: () => void;
  onPress?: (item: VarietyItem) => void;
}

export default function TopVarieties({ varieties, onViewAll, onPress }: TopVarietiesProps): React.JSX.Element {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <SectionHeader icon="apple" title="Top Varieties" titleHi="शीर्ष किस्में" actionLabel="View All" onAction={onViewAll} />
      </View>
      <Typography variant="scrollHint" style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <Icon name="gesture-swipe-horizontal" size={12} color={Colors.gray400} /> Swipe to explore · स्वाइप करें
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {varieties.map((v, i) => (
          <PressableScale key={i} scale={0.97} onPress={() => onPress?.(v)}>
            <View style={styles.card}>
              <Typography variant="rankBadge" style={[styles.rank, i === 0 && styles.rankGold, i === 1 && styles.rankSilver, i === 2 && styles.rankBronze]}>
                #{i + 1}
              </Typography>
              <SmartImage
                source={{ uri: v.image ?? '' }}
                containerStyle={styles.thumb}
                fallbackIcon="apple"
              />
              <View style={[styles.tag, { backgroundColor: v.color + '18' }]}>
                <Typography variant="caption" style={{ color: v.color, fontWeight: '700', fontSize: 10 }}>{v.tag}</Typography>
              </View>
              <Typography variant="cardTitle" style={styles.name}>{v.name}</Typography>
              <Typography variant="hindiCardName">{v.nameHi}</Typography>
              <Typography variant="altitudeText" style={styles.altitude}><Icon name="mountain" size={10} color={Colors.gray400} /> {v.altitude}</Typography>
              <View style={styles.footer}>
                {v.rating > 0 && (
                  <Typography variant="ratingText"><Icon name="star" size={10} color={Colors.accent} /> {v.rating}</Typography>
                )}
                <Typography variant="countText"><Icon name="eye" size={10} color={Colors.gray400} /> {v.votes.toLocaleString('en-IN')}</Typography>
              </View>
            </View>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  card: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rank: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
  rankGold: { color: '#d97706' },
  rankSilver: { color: '#9ca3af' },
  rankBronze: { color: '#b45309' },
  thumb: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
  },
  altitude: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
});
