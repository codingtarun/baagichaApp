/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ROOTSTOCK LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Rootstock guide with vigour filter pills and card grid.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';
import { useRootstocks } from '../hooks/useRootstocks';
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function RootstockListScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const {
    rootstocks,
    vigourFilters,
    loading,
    error,
    activeVigour,
    setActiveVigour,
    refresh,
    hasMore,
    loadMore,
  } = useRootstocks();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Page Header ── */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: '#ecfdf5' }]}>
            <Icon name="tree" size={20} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Typography variant="displayHeading" style={styles.pageTitle}>
              Rootstock Guide
            </Typography>
            <Typography variant="hindiDisplaySection" style={styles.pageSub}>
              मूलवृंत गाइड
            </Typography>
          </View>
        </View>
      </View>

      {/* ── Vigour Filter Pills ── */}
      <View style={styles.filterScroller}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={vigourFilters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterPillsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveVigour(item.key)}
              activeOpacity={0.7}
              style={[
                globalStyle.filterPill,
                activeVigour === item.key && globalStyle.filterPillActive,
              ]}
            >
              <Typography
                variant="badgeText"
                color={activeVigour === item.key ? Colors.white : Colors.gray600}
              >
                {item.label}
              </Typography>
              {item.labelHi ? (
                <Typography
                  variant="hindiMeta"
                  color={activeVigour === item.key ? 'rgba(255,255,255,0.85)' : Colors.gray400}
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

      {/* ── Rootstock Grid ── */}
      <FlatList
        data={rootstocks}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && rootstocks.length === 0} onRefresh={refresh} />
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.centered}>
              <Typography variant="bodyMuted">No rootstocks found.</Typography>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && rootstocks.length > 0 ? (
            <ActivityIndicator style={styles.loadMore} color={Colors.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <RootstockCard
            item={item}
            onPress={() => navigation.navigate('RootstockDetail', { slug: item.slug })}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ── Rootstock Card Component ──

function RootstockCard({
  item,
  onPress,
}: {
  item: import('../services/rootstockApi').RootstockListItem;
  onPress: () => void;
}) {
  const vc = item.vigour_color;

  return (
    <View style={[styles.cardShadow, { borderColor: `${vc}30` }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cardInner}
      >
        {/* Hero area */}
        <View style={[styles.cardHero, { backgroundColor: `${vc}12` }]}>
          {item.hero_image ? (
            <Image source={{ uri: item.hero_image }} style={styles.cardHeroImg} />
          ) : (
            <Icon name="tree" size={28} color={vc} />
          )}
          {/* Vigour badge */}
          <View style={[styles.vigourBadge, { backgroundColor: `${vc}18`, borderColor: `${vc}40` }]}>
            <View style={[styles.vigourDot, { backgroundColor: vc }]} />
            <Typography variant="overline" style={[styles.vigourBadgeText, { color: vc }]}>
              {item.vigour_label}
            </Typography>
          </View>
          {item.hp_recommended && (
            <View style={[styles.hpBadge, { backgroundColor: Colors.primary }]}>
              <Typography variant="overline" color={Colors.white} style={{ fontSize: 7 }}>
                HP
              </Typography>
            </View>
          )}
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Typography variant="cardTitle" lines={1} style={styles.name}>
            {item.name}
          </Typography>
          {item.name_hi ? (
            <Typography variant="hindiMeta" color={Colors.gray400} lines={1}>
              {item.name_hi}
            </Typography>
          ) : null}
          {/* Rating */}
          {item.avg_rating !== null && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={10} color="#f59e0b" />
              <Typography variant="metaText" color={Colors.gray500}>
                {item.avg_rating.toFixed(1)} ({item.rating_count})
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  filterPillsRow: {
    paddingHorizontal: 12,
    gap: 8,
  },

  // Grid
  gridRow: {
    gap: 10,
    paddingHorizontal: 16,
  },
  gridContent: {
    paddingTop: 12,
    paddingBottom: 100,
    gap: 10,
  },

  // Card
  cardShadow: {
    flex: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInner: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    overflow: 'hidden',
  },
  cardHero: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeroImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  vigourBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  vigourDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  vigourBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  hpBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  cardBody: {
    gap: 2,
  },
  name: {
    marginBottom: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
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
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 999,
  },
  loadMore: {
    paddingVertical: 16,
  },
});
