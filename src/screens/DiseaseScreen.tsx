/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — DISEASE SCREEN (List)
 * ═══════════════════════════════════════════════════════════════
 *
 * Disease and pest library with severity filters and card grid.
 */

import React from 'react';
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
import { useDiseases } from '../hooks/useDiseases';
import type { DiscoverNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function DiseaseScreen(): React.JSX.Element {
  const navigation = useNavigation<DiscoverNavigationProp>();

  const {
    diseases,
    severityFilters,
    loading,
    error,
    activeSeverity,
    setActiveSeverity,
    refresh,
    hasMore,
    loadMore,
  } = useDiseases();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Page Header ── */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: '#fee2e2' }]}>
            <Icon name="virus" size={20} color="#dc2626" />
          </View>
          <View style={styles.headerText}>
            <Typography variant="displayHeading" style={styles.pageTitle}>
              Disease Library
            </Typography>
            <Typography variant="hindiDisplaySection" style={styles.pageSub}>
              रोग पहचान एवं प्रबंधन
            </Typography>
          </View>
        </View>
      </View>

      {/* ── Severity Filter Pills ── */}
      <View style={styles.filterScroller}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={severityFilters}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterPillsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveSeverity(item.key)}
              activeOpacity={0.7}
              style={[
                globalStyle.filterPill,
                activeSeverity === item.key && globalStyle.filterPillActive,
              ]}
            >
              <Typography
                variant="badgeText"
                color={activeSeverity === item.key ? Colors.white : Colors.gray600}
              >
                {item.label}
              </Typography>
              {item.labelHi ? (
                <Typography
                  variant="hindiMeta"
                  color={activeSeverity === item.key ? 'rgba(255,255,255,0.85)' : Colors.gray400}
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

      {/* ── Disease Grid ── */}
      <FlatList
        data={diseases}
        keyExtractor={(item) => item.slug}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && diseases.length === 0} onRefresh={refresh} />
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.centered}>
              <Typography variant="bodyMuted">No diseases found.</Typography>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && diseases.length > 0 ? (
            <ActivityIndicator style={styles.loadMore} color={Colors.primary} />
          ) : null
        }
        renderItem={({ item }) => (
          <DiseaseCard
            item={item}
            onPress={() => navigation.navigate('DiseaseDetail', { slug: item.slug })}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ── Disease Card Component ──

function DiseaseCard({
  item,
  onPress,
}: {
  item: import('../services/diseaseApi').DiseaseListItem;
  onPress: () => void;
}) {
  const sev = item.severity_label;
  const cat = item.category_label;

  // Map severity to MaterialCommunityIcons
  const sevIconMap: Record<string, string> = {
    critical: 'alert-octagon',
    high: 'alert-circle',
    medium: 'information',
    low: 'information',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, { borderColor: `${sev.color}30` }]}
    >
      {/* Hero area with icon */}
      <View style={[styles.cardHero, { backgroundColor: `${sev.color}12` }]}>
        <Icon name={sevIconMap[item.severity] ?? 'information'} size={28} color={sev.color} />
        <View style={[styles.sevBadge, { backgroundColor: `${sev.color}18`, borderColor: `${sev.color}40` }]}>
          <Icon name={sevIconMap[item.severity] ?? 'information'} size={8} color={sev.color} />
          <Typography variant="overline" style={[styles.sevBadgeText, { color: sev.color }]}>
            {sev.label}
          </Typography>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Typography variant="cardTitle" lines={1} style={styles.name}>
          {item.name_en}
        </Typography>
        {item.name_hi ? (
          <Typography variant="hindiMeta" color={Colors.gray400} lines={1}>
            {item.name_hi}
          </Typography>
        ) : null}
        <Typography variant="bodySmall" color={Colors.gray500} lines={2} style={styles.desc}>
          {typeof item.description === 'string' ? item.description : JSON.stringify(item.description)}
        </Typography>
      </View>

      {/* Category chip */}
      <View style={[styles.catChip, { backgroundColor: `${Colors.primary}10` }]}>
        <Icon name="tag" size={8} color={Colors.primary} />
        <Typography variant="overline" style={styles.catChipText}>
          {cat.label}
        </Typography>
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
  card: {
    flex: 1,
    backgroundColor: Colors.gray50,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHero: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  sevBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  sevBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  cardBody: {
    gap: 2,
  },
  name: {
    marginBottom: 1,
  },
  desc: {
    marginTop: 4,
    lineHeight: 16,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  catChipText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '600',
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
