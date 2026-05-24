/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOP BLOGS (Home Screen)
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

export interface BlogItem {
  title: string;
  titleHi: string;
  category: string;
  catColor: string;
  readMin: number;
  views: number;
  author: string;
  date: string;
  image?: string;
}

interface TopBlogsProps {
  blogs: BlogItem[];
  onViewAll?: () => void;
  onPress?: (item: BlogItem) => void;
}

export default function TopBlogs({ blogs, onViewAll, onPress }: TopBlogsProps): React.JSX.Element {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ paddingHorizontal: 16 }}>
        <SectionHeader icon="newspaper" title="Top Blogs" titleHi="शीर्ष लेख" actionLabel="View All" onAction={onViewAll} />
      </View>
      <Typography variant="scrollHint" style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <Icon name="gesture-swipe-horizontal" size={12} color={Colors.gray400} /> Swipe to explore · स्वाइप करें
      </Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {blogs.map((b, i) => (
          <PressableScale key={i} scale={0.97} onPress={() => onPress?.(b)}>
            <View style={styles.card}>
              <SmartImage source={{ uri: b.image ?? '' }} containerStyle={styles.thumb} fallbackIcon="newspaper-variant" />
              <View style={[styles.catBadge, { backgroundColor: b.catColor + '18' }]}>
                <Typography variant="caption" style={{ color: b.catColor, fontWeight: '700', fontSize: 10 }}>{b.category}</Typography>
              </View>
              <Typography variant="cardTitle" style={styles.title} numberOfLines={2}>{b.title}</Typography>
              <Typography variant="hindiCardName" numberOfLines={1}>{b.titleHi}</Typography>
              <View style={styles.authorRow}>
                <Typography variant="caption"><Icon name="account-edit" size={10} color={Colors.gray400} /> {b.author}</Typography>
                <Typography variant="caption">{b.date}</Typography>
              </View>
              <View style={styles.footer}>
                <Typography variant="cardFooter"><Icon name="clock-outline" size={10} color={Colors.gray400} /> {b.readMin} min</Typography>
                <Typography variant="cardFooter"><Icon name="eye" size={10} color={Colors.gray400} /> {b.views.toLocaleString('en-IN')}</Typography>
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
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  thumb: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginBottom: 10,
  },
  catBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
});
