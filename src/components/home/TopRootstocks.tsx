/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOP ROOTSTOCKS (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';
import PressableScale from '../PressableScale';
import SmartImage from '../SmartImage';

export interface RootstockItem {
  name: string;
  nameHi: string;
  type: string;
  spacing: string;
  votes: number;
  rating: number;
  color: string;
  tag: string;
  image?: string;
}

interface TopRootstocksProps {
  rootstocks: RootstockItem[];
  onViewAll?: () => void;
  onPress?: (item: RootstockItem) => void;
}

export default function TopRootstocks({ rootstocks, onViewAll, onPress }: TopRootstocksProps): React.JSX.Element {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <SectionHeader icon="tree" title="Top Rootstocks" titleHi="शीर्ष मूलवृंत" actionLabel="View All" onAction={onViewAll} />
      </View>
      <Typography variant="scrollHint" style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <Icon name="gesture-swipe-horizontal" size={12} color={Colors.gray400} /> Swipe to explore · स्वाइप करें
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {rootstocks.map((r, i) => (
          <PressableScale key={i} scale={0.97} onPress={() => onPress?.(r)}>
            <View style={styles.card}>
              <Typography variant="rankBadge" style={[styles.rank, i === 0 && styles.rankGold, i === 1 && styles.rankSilver, i === 2 && styles.rankBronze]}>
                #{i + 1}
              </Typography>
              <SmartImage source={{ uri: r.image ?? '' }} containerStyle={styles.thumb} fallbackIcon="tree" />
              <View style={[styles.tag, { backgroundColor: r.color + '18' }]}>
                <Typography variant="caption" style={{ color: r.color, fontWeight: '700', fontSize: 10 }}>{r.tag}</Typography>
              </View>
              <Typography variant="cardTitle" style={styles.name}>{r.name}</Typography>
              <Typography variant="hindiCardName">{r.nameHi}</Typography>
              <Typography variant="caption" style={styles.meta}><Icon name="ruler-square" size={10} color={Colors.gray400} /> {r.type}</Typography>
              <Typography variant="caption" style={styles.meta}><Icon name="arrow-expand" size={10} color={Colors.gray400} /> {r.spacing}</Typography>
              <View style={styles.footer}>
                <Typography variant="countText"><Icon name="eye" size={10} color={Colors.gray400} /> {r.votes.toLocaleString('en-IN')}</Typography>
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
  meta: {
    marginTop: 2,
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
