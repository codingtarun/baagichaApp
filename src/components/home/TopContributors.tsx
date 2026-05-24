/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOP CONTRIBUTORS (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';
import PressableScale from '../PressableScale';

export interface ContributorItem {
  name: string;
  nameHi: string;
  location: string;
  initials: string;
  color: string;
  points: number;
  badge: string;
  reports: number;
  reviews: number;
  photos: number;
}

interface TopContributorsProps {
  contributors: ContributorItem[];
  onViewAll?: () => void;
}

const RANK_STYLES = [
  { color: '#d97706', label: '1st' },
  { color: '#9ca3af', label: '2nd' },
  { color: '#b45309', label: '3rd' },
];

export default function TopContributors({ contributors, onViewAll }: TopContributorsProps): React.JSX.Element {
  return (
    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
      <SectionHeader icon="trophy" title="Top Contributors" titleHi="शीर्ष योगदानकर्ता" actionLabel="View All" onAction={onViewAll} />
      <View style={styles.list}>
        {contributors.map((c, i) => {
          const rankStyle = i < 3 ? RANK_STYLES[i] : null;
          return (
            <PressableScale key={i} scale={0.98}>
              <View style={styles.row}>
                <View style={[styles.rankBadge, rankStyle && { borderColor: rankStyle.color }]}>
                  <Typography variant="caption" style={[styles.rankText, rankStyle && { color: rankStyle.color, fontWeight: '800' }]}>
                    {i + 1}
                  </Typography>
                </View>
                <View style={[styles.avatar, { borderColor: c.color + '30' }]}>
                  <Typography variant="body" style={[styles.avatarText, { color: c.color }]}>{c.initials}</Typography>
                </View>
                <View style={styles.body}>
                  <View style={styles.nameRow}>
                    <Typography variant="contributorName">{c.name}</Typography>
                    <View style={[styles.badge, { backgroundColor: c.color + '15' }]}>
                      <Typography variant="caption" style={{ color: c.color, fontWeight: '700', fontSize: 10 }}>{c.badge}</Typography>
                    </View>
                  </View>
                  <Typography variant="contributorLocation"><Icon name="map-marker" size={10} color={Colors.gray400} /> {c.location}</Typography>
                  <View style={styles.statsRow}>
                    <Typography variant="contributorStats"><Icon name="flag-outline" size={10} color={Colors.gray400} /> {c.reports} reports</Typography>
                    <Typography variant="contributorStats"><Icon name="star-outline" size={10} color={Colors.gray400} /> {c.reviews} reviews</Typography>
                    <Typography variant="contributorStats"><Icon name="camera-outline" size={10} color={Colors.gray400} /> {c.photos} photos</Typography>
                  </View>
                </View>
                <View style={styles.points}>
                  <Typography variant="pointsValue">{c.points.toLocaleString('en-IN')}</Typography>
                  <Typography variant="pointsLabel">pts</Typography>
                </View>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    color: Colors.gray400,
    fontWeight: '700',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 14,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  points: {
    alignItems: 'center',
    marginLeft: 8,
  },
});
