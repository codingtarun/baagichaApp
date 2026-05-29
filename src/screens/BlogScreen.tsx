/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOG SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Blog hub: category pills, article cards, search.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Typography } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import PressableScale from '../components/PressableScale';
import SmartImage from '../components/SmartImage';
import EmptyState from '../components/EmptyState';
import { useBlogs } from '../hooks/useBlogs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiscoverStackParamList } from '../navigation/types';

type BlogNav = NativeStackNavigationProp<DiscoverStackParamList>;

const CATEGORIES = [
  { key: 'all', label: 'All', labelHi: 'सभी' },
  { key: 'spray', label: 'Spray', labelHi: 'स्प्रे' },
  { key: 'disease', label: 'Disease', labelHi: 'रोग' },
  { key: 'pest', label: 'Pest', labelHi: 'कीट' },
  { key: 'rootstock', label: 'Rootstock', labelHi: 'मूलवृंत' },
  { key: 'market', label: 'Market', labelHi: 'मंडी' },
  { key: 'practice', label: 'Practice', labelHi: 'खेती' },
];

export default function BlogScreen(): React.JSX.Element {
  const navigation = useNavigation<BlogNav>();
  const { posts, loading, error, refresh, activeCategory, setActiveCategory } = useBlogs();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = posts.filter((b) => {
    const matchesCategory = activeCategory === 'all' || b.category?.slug === activeCategory;
    const matchesSearch = !searchQuery.trim() || b.title_en.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <ScreenLayout refreshing={loading} onRefresh={handleRefresh}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={Colors.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles / लेख खोजें..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <PressableScale key={cat.key} scale={0.95} onPress={() => setActiveCategory(cat.key)}>
              <View style={[styles.catPill, isActive && styles.catPillActive]}>
                <Typography variant="caption" style={[styles.catLabel, isActive && styles.catLabelActive]}>
                  {cat.label}
                </Typography>
                <Typography variant="hindiMicro" style={[styles.catLabelHi, isActive && styles.catLabelActive]}>
                  {cat.labelHi}
                </Typography>
              </View>
            </PressableScale>
          );
        })}
      </ScrollView>

      {/* Blog List */}
      <View style={styles.list}>
        {error && !loading && (
          <EmptyState
            icon="alert-circle-outline"
            title="Could not load articles"
            titleHi="लेख लोड नहीं हो सके"
            subtitle={error}
            actionLabel="Retry"
            actionLabelHi="पुनः प्रयास"
            onAction={handleRefresh}
          />
        )}

        {!error && filtered.length === 0 && !loading && (
          <EmptyState
            icon="newspaper-variant-outline"
            title="No articles found"
            titleHi="कोई लेख नहीं मिला"
            subtitle="Try adjusting your search or category filter."
            subtitleHi="कृपया खोज या श्रेणी बदलें।"
          />
        )}

        {!error && filtered.map((blog, i) => (
          <PressableScale key={blog.id ?? i} scale={0.98} onPress={() => navigation.navigate('BlogDetail', { slug: blog.slug })}>
            <View style={styles.card}>
              <SmartImage source={{ uri: blog.featured_image ?? '' }} containerStyle={styles.thumb} fallbackIcon="newspaper-variant" />
              <View style={styles.cardBody}>
                <View style={styles.cardMeta}>
                  <Typography variant="caption" style={{ color: blog.category?.color ?? Colors.primary, fontWeight: '700' }}>
                    {blog.category?.name_en ?? 'Blog'}
                  </Typography>
                  <Typography variant="caption" color={Colors.gray400}>{blog.reading_time_min ?? 5} min read</Typography>
                </View>
                <Typography variant="cardTitle" numberOfLines={2}>{blog.title_en}</Typography>
                <Typography variant="hindiCardName" numberOfLines={1}>{blog.title_hi ?? ''}</Typography>
                <View style={styles.cardFooter}>
                  <Typography variant="cardFooter"><Icon name="account-edit" size={10} color={Colors.gray400} /> {blog.author?.name ?? 'Baagvaani'}</Typography>
                  <Typography variant="cardFooter"><Icon name="eye" size={10} color={Colors.gray400} /> {blog.view_count?.toLocaleString('en-IN') ?? 0}</Typography>
                </View>
              </View>
            </View>
          </PressableScale>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray800,
    fontFamily: 'DMSans-Regular',
  },
  catRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    alignItems: 'center',
  },
  catPillActive: {
    backgroundColor: Colors.primary,
  },
  catLabel: {
    color: Colors.gray600,
    fontWeight: '600',
    fontSize: 12,
  },
  catLabelHi: {
    fontSize: 9,
    color: Colors.gray400,
    marginTop: 1,
  },
  catLabelActive: {
    color: Colors.white,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
});
