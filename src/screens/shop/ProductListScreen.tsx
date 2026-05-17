/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PRODUCT LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import ScreenLayout from '../../components/ScreenLayout';
import ProductCard from '../../components/shop/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type ProductListRouteProp = RouteProp<ShopStackParamList, 'ProductList'>;
type ProductListNavProp = NativeStackNavigationProp<ShopStackParamList>;

const SORT_OPTIONS = [
  { key: 'latest', label: 'Latest' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
];

export default function ProductListScreen(): React.JSX.Element {
  const navigation = useNavigation<ProductListNavProp>();
  const route = useRoute<ProductListRouteProp>();
  const { category, brand, query } = route.params ?? {};

  const [showSort, setShowSort] = useState(false);
  const { products, loading, error, refresh, loadMore, hasMore, filters, setFilters } = useProducts();

  // Apply initial filters from route params
  React.useEffect(() => {
    const newFilters: any = {};
    if (category) newFilters.category = category;
    if (brand) newFilters.brand = brand;
    if (query) newFilters.q = query;
    setFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, brand, query]);

  const goToProductDetail = useCallback(
    (slug: string) => {
      navigation.navigate('ProductDetail', { slug });
    },
    [navigation]
  );

  const handleSort = useCallback(
    (sortKey: string) => {
      setFilters({ ...filters, sort: sortKey });
      setShowSort(false);
    },
    [filters, setFilters]
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return <ActivityIndicator style={styles.footerLoader} color={Colors.primary} />;
  };

  return (
    <ScreenLayout>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title} numberOfLines={1}>
          {query ? `Search: ${query}` : category ?? brand ?? 'All Products'}
        </Typography>
        <TouchableOpacity onPress={() => setShowSort(!showSort)} activeOpacity={0.7} style={styles.sortButton}>
          <MaterialCommunityIcons name="sort-variant" size={22} color={Colors.gray700} />
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortOption, filters.sort === opt.key && styles.sortOptionActive]}
              onPress={() => handleSort(opt.key)}
              activeOpacity={0.7}
            >
              <Typography variant="body" style={filters.sort === opt.key ? styles.sortTextActive : styles.sortText}>
                {opt.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Product Grid */}
      {error ? (
        <View style={styles.centered}>
          <Typography variant="bodyMuted" center>{error}</Typography>
          <TouchableOpacity onPress={refresh} style={styles.retryButton} activeOpacity={0.7}>
            <Typography variant="button" style={styles.retryText}>Retry</Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={{ width: '48%' }}>
              <ProductCard product={item} onPress={goToProductDetail} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={[Colors.primary]} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centered}>
                <Typography variant="bodyMuted" center>No products found.</Typography>
              </View>
            ) : null
          }
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  sortButton: {
    padding: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
  },
  sortDropdown: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    overflow: 'hidden',
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary + '10',
  },
  sortText: {
    color: Colors.gray700,
  },
  sortTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: Colors.white,
  },
  footerLoader: {
    marginVertical: 16,
  },
});
