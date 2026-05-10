/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOG LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Knowledge base articles with category filter pills and card list.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';
import { useBlogs } from '../hooks/useBlogs';
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function BlogListScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const {
    posts,
    featured,
    categoryFilters,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    refresh,
    hasMore,
    loadMore,
  } = useBlogs();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Page Header ── */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: '#eff6ff' }]}>
            <Icon name="newspaper-variant" size={20} color={Colors.info} />
          </View>
          <View style={styles.headerText}>
            <Typography variant="displayHeading" style={styles.pageTitle}>
              Knowledge Base
            </Typography>
            <Typography variant="hindiDisplaySection" style={styles.pageSub}>
              ज्ञान भंडार
            </Typography>
          </View>
        </View>
      </View>

      {/* ── Category Filter Pills ── */}
      <View style={styles.filterScroller}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoryFilters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterPillsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item.key)}
              activeOpacity={0.7}
              style={[
                globalStyle.filterPill,
                activeCategory === item.key && globalStyle.filterPillActive,
              ]}
            >
              <Typography
                variant="badgeText"
                color={activeCategory === item.key ? Colors.white : Colors.gray600}
              >
                {item.label}
              </Typography>
              {item.labelHi ? (
                <Typography
                  variant="hindiMeta"
                  color={activeCategory === item.key ? 'rgba(255,255,255,0.85)' : Colors.gray400}
                  style={{ marginTop: 0 }}
                >
                  {' '}{item.labelHi}
                </Typography>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Error State ── */}
      {error && (
        <View style={styles.centered}>
          <Icon name="alert-circle" size={40} color={Colors.danger} />
          <Typography variant="body" color={Colors.danger} style={styles.errorText}>
            {error}
          </Typography>
          <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
            <Typography variant="bodySmall" color={Colors.primary}>
              Retry
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Featured Articles ── */}
      {featured.length > 0 && activeCategory === 'all' && (
        <View style={styles.featuredSection}>
          <Typography variant="sectionHeader" style={styles.sectionTitle}>
            Featured
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
            {featured.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => navigation.navigate('BlogDetail', { slug: item.slug })}
                activeOpacity={0.7}
              >
                {item.featured_image ? (
                  <Image source={{ uri: item.featured_image }} style={styles.featuredImg} />
                ) : (
                  <View style={[styles.featuredImg, { backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' }]}>
                    <Icon name="newspaper" size={24} color={Colors.gray400} />
                  </View>
                )}
                <View style={styles.featuredOverlay} />
                <View style={styles.featuredBody}>
                  {item.category && (
                    <View style={[styles.featuredCat, { backgroundColor: item.category.color }]}>
                      <Typography variant="overline" color={Colors.white} style={{ fontSize: 9 }}>
                        {item.category.name_en}
                      </Typography>
                    </View>
                  )}
                  <Typography variant="cardTitle" color={Colors.white} lines={2} style={styles.featuredTitle}>
                    {item.title_en}
                  </Typography>
                  <Typography variant="metaText" color="rgba(255,255,255,0.75)" style={styles.featuredMeta}>
                    {item.reading_time_min} min read
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Article List ── */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && posts.length === 0} onRefresh={refresh} />
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.centered}>
              <Typography variant="bodyMuted">No articles found.</Typography>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && posts.length > 0 ? (
            <ActivityIndicator style={styles.loadMore} color={Colors.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <BlogCard
            item={item}
            onPress={() => navigation.navigate('BlogDetail', { slug: item.slug })}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ── Blog Card Component ──

function BlogCard({
  item,
  onPress,
}: {
  item: import('../services/blogApi').BlogListItem;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.card}
    >
      {/* Thumbnail */}
      <View style={styles.cardThumb}>
        {item.featured_image ? (
          <Image source={{ uri: item.featured_image }} style={styles.cardThumbImg} />
        ) : (
          <View style={[styles.cardThumbImg, { backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name="newspaper" size={20} color={Colors.gray400} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {item.category && (
          <View style={[styles.catBadge, { backgroundColor: `${item.category.color}15` }]}>
            <Typography variant="overline" style={[styles.catBadgeText, { color: item.category.color }]}>
              {item.category.name_en}
            </Typography>
          </View>
        )}
        <Typography variant="cardTitle" lines={2} style={styles.cardTitle}>
          {item.title_en}
        </Typography>
        {item.excerpt_en && (
          <Typography variant="bodySmall" color={Colors.gray500} lines={2} style={styles.cardExcerpt}>
            {item.excerpt_en}
          </Typography>
        )}
        <View style={styles.cardMeta}>
          <Icon name="clock-outline" size={10} color={Colors.gray400} />
          <Typography variant="metaText" color={Colors.gray400}>
            {item.reading_time_min} min
          </Typography>
          <View style={styles.metaDot} />
          <Icon name="eye" size={10} color={Colors.gray400} />
          <Typography variant="metaText" color={Colors.gray400}>
            {item.view_count.toLocaleString()}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Page header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 20,
    lineHeight: 24,
  },
  pageSub: {
    marginTop: 0,
    fontSize: 13,
  },

  // Filter pills
  filterScroller: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  filterPillsRow: {
    paddingHorizontal: 12,
    gap: 8,
  },

  // Featured section
  featuredSection: {
    paddingTop: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  featuredCard: {
    width: 260,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImg: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featuredBody: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 6,
  },
  featuredCat: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  featuredTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  featuredMeta: {
    fontSize: 11,
  },

  // List
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
    gap: 10,
    paddingHorizontal: 16,
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
    gap: 12,
  },
  cardThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardThumbImg: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  catBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  cardExcerpt: {
    lineHeight: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray400,
  },

  // States
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 8,
  },
  loadMore: {
    paddingVertical: 16,
  },
});
