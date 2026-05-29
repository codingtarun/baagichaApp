/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — VARIETY SCREEN (List)
 * ═══════════════════════════════════════════════════════════════
 *
 * Apple variety guide with season filters and a card grid.
 *
 * LEARN: This screen has two modes:
 *   1. BROWSE mode — tap a card to see variety details
 *   2. COMPARE mode — tap the Compare button, select up to 3
 *      varieties, then tap Compare to see a comparison chart.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { globalStyle } from '../theme/style';
import { Typography } from '../typography';
import { useVarieties, type AltitudeRange } from '../hooks/useVarieties';
// LEARN: VarietyListItem type is used internally by the useVarieties hook.
// We don't need to import it here since the hook already types its return.
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import VarietyCard from '../components/VarietyCard';

const MAX_COMPARE = 3;

export default function VarietyScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const {
    varieties,
    seasonFilters,
    loading,
    error,
    activeSeason,
    setActiveSeason,
    activeAltitude,
    setActiveAltitude,
    altitudeFilters,
    refresh,
    hasMore,
    loadMore,
  } = useVarieties();

  // ── Compare mode state ──
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Orchard ownership state (placeholder) ──
  const [orchardSet, setOrchardSet] = useState<Set<number>>(new Set());

  const toggleOrchard = useCallback((id: number) => {
    setOrchardSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelection = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (next.size < MAX_COMPARE) {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const enterCompareMode = () => {
    setCompareMode(true);
    setSelected(new Set());
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelected(new Set());
  };

  const goToCompare = () => {
    if (selected.size < 2) return;
    const slugs = Array.from(selected);
    navigation.navigate('VarietyCompare', { slugs });
    // Reset after navigation
    setTimeout(() => exitCompareMode(), 300);
  };

  const handleCardPress = (slug: string) => {
    if (compareMode) {
      toggleSelection(slug);
    } else {
      navigation.navigate('VarietyDetail', { slug });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Page Header ── */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: '#fee2e2' }]}>
            <Icon name="apple" size={20} color="#dc2626" />
          </View>
          <View style={styles.headerText}>
            <Typography variant="displayHeading" style={styles.pageTitle}>
              Apple Varieties
            </Typography>
            <Typography variant="hindiDisplaySection" style={styles.pageSub}>
              किस्म चुनाव एवं जानकारी
            </Typography>
          </View>
        </View>

        {/* Compare / Cancel button */}
        {compareMode ? (
          <TouchableOpacity onPress={exitCompareMode} style={styles.headerBtn}>
            <Typography variant="badgeText" color={Colors.danger}>
              Cancel
            </Typography>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={enterCompareMode} style={styles.headerBtn}>
            <Icon name="chart-bar" size={18} color={Colors.primary} />
            <Typography variant="badgeText" color={Colors.primary} style={styles.headerBtnText}>
              Compare
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Compare hint banner ── */}
      {compareMode && (
        <View style={styles.compareBanner}>
          <Icon name="information" size={14} color={Colors.primary} />
          <Typography variant="bodySmall" color={Colors.primary} style={styles.compareBannerText}>
            Select up to {MAX_COMPARE} varieties to compare
          </Typography>
          <Typography variant="badgeText" color={Colors.primary}>
            {selected.size}/{MAX_COMPARE}
          </Typography>
        </View>
      )}

      {/* ── Season Filter Pills ── */}
      <View style={styles.filterScroller}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={seasonFilters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterPillsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveSeason(item.key)}
              activeOpacity={0.7}
              style={[
                globalStyle.filterPill,
                activeSeason === item.key && globalStyle.filterPillActive,
              ]}
            >
              <Typography
                variant="badgeText"
                color={activeSeason === item.key ? Colors.white : Colors.gray600}
              >
                {item.label}
              </Typography>
              {item.labelHi ? (
                <Typography
                  variant="hindiMeta"
                  color={activeSeason === item.key ? 'rgba(255,255,255,0.85)' : Colors.gray400}
                  style={{ marginTop: 0 }}
                >
                  {' '}{item.labelHi}
                </Typography>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Altitude Filter Pills ── */}
      <View style={[styles.filterScroller, styles.altitudeScroller]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={altitudeFilters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterPillsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveAltitude(item.key as AltitudeRange)}
              activeOpacity={0.7}
              style={[
                styles.altitudePill,
                activeAltitude === item.key && styles.altitudePillActive,
              ]}
            >
              <Icon
                name="terrain"
                size={10}
                color={activeAltitude === item.key ? Colors.white : Colors.gray500}
              />
              <Typography
                variant="badgeText"
                color={activeAltitude === item.key ? Colors.white : Colors.gray600}
              >
                {item.label}
              </Typography>
              <Typography
                variant="hindiMeta"
                color={activeAltitude === item.key ? 'rgba(255,255,255,0.85)' : Colors.gray400}
                style={{ marginTop: 0 }}
              >
                {' '}{item.labelHi}
              </Typography>
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

      {/* ── Variety Grid ── */}
      <FlatList
        data={varieties}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && varieties.length === 0} onRefresh={refresh} />
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.centered}>
              <Typography variant="bodyMuted">No varieties found.</Typography>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && varieties.length > 0 ? (
            <ActivityIndicator style={styles.loadMore} color={Colors.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <VarietyCard
            item={item}
            onPress={() => handleCardPress(item.slug)}
            compareMode={compareMode}
            isSelected={selected.has(item.slug)}
            inOrchard={orchardSet.has(item.id)}
            onToggleOrchard={() => toggleOrchard(item.id)}
          />
        )}
      />

      {/* ── Compare Action Bar ── */}
      {compareMode && selected.size >= 2 && (
        <View style={styles.compareBar}>
          <TouchableOpacity onPress={goToCompare} style={styles.compareBarBtn}>
            <Typography variant="body" color={Colors.white}>
              Compare {selected.size} varieties
            </Typography>
            <Icon name="arrow-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    justifyContent: 'space-between',
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
    borderRadius: 999,
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
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  headerBtnText: {
    fontSize: 12,
  },

  // Compare banner
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: `${Colors.primary}10`,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.primary}20`,
  },
  compareBannerText: {
    fontWeight: '600',
  },

  // Filter pills
  filterScroller: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  altitudeScroller: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  filterPillsRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  altitudePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray50,
    borderRadius: 14,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  altitudePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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

  // Compare action bar
  compareBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  compareBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
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
