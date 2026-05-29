/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Main shop hub: search, categories, featured products.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { globalStyle, Shadows, Radius } from '../theme/style';
import { Typography, HindiText } from '../typography';
import ScreenLayout from '../components/ScreenLayout';
import ProductCard from '../components/shop/ProductCard';
import CategoryCard from '../components/shop/CategoryCard';
import { useProducts } from '../hooks/useProducts';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../store/toastStore';
import { navigateToLogin } from '../navigation/navigationRef';
import type { ShopStackParamList } from '../navigation/stacks/ShopStack';

type ShopNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function ShopScreen(): React.JSX.Element {
  const navigation = useNavigation<ShopNavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { products, featured, loading, error, refresh, filters, setFilters } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const onSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      navigation.navigate('ProductList', { query: searchQuery.trim() });
    }
  }, [searchQuery, navigation]);

  const goToProductList = useCallback(
    (categorySlug?: string) => {
      navigation.navigate('ProductList', { category: categorySlug });
    },
    [navigation]
  );

  const goToProductDetail = useCallback(
    (slug: string) => {
      navigation.navigate('ProductDetail', { slug });
    },
    [navigation]
  );

  const goToCart = useCallback(() => {
    if (!isAuthenticated) {
      showToast('Please sign in to view your cart', 'warning');
      navigateToLogin();
      return;
    }
    navigation.navigate('Cart');
  }, [isAuthenticated, navigation]);

  return (
    <ScreenLayout>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Typography variant="displayHeading" style={styles.title}>
          Shop / दुकान
        </Typography>
        <TouchableOpacity onPress={goToCart} style={styles.cartButton} activeOpacity={0.7}>
          <MaterialCommunityIcons name="cart-outline" size={24} color={Colors.gray700} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={Colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products / उत्पाद खोजें..."
          placeholderTextColor={Colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearchSubmit}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={[Colors.primary]} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Products */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <View style={globalStyle.rowBetween}>
              <Typography variant="sectionTitle">Featured / विशेष</Typography>
              <TouchableOpacity onPress={() => goToProductList()} activeOpacity={0.7}>
                <Typography variant="link" style={styles.seeAll}>See All</Typography>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} onPress={goToProductDetail} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Categories / श्रेणियाँ</Typography>
          <View style={styles.categoriesGrid}>
            {/* Hardcoded categories for now - in production fetch from API */}
            {[
              { id: 1, name: 'Fertilizers', slug: 'fertilizers', color_hex: '#3a7d44', icon: null },
              { id: 2, name: 'Pesticides', slug: 'pesticides', color_hex: '#e8b84b', icon: null },
              { id: 3, name: 'Tools', slug: 'tools', color_hex: '#3b82f6', icon: null },
              { id: 4, name: 'Grafting', slug: 'grafting', color_hex: '#ef4444', icon: null },
              { id: 5, name: 'Seeds', slug: 'seeds', color_hex: '#8b5cf6', icon: null },
              { id: 6, name: 'Irrigation', slug: 'irrigation', color_hex: '#06b6d4', icon: null },
            ].map((cat) => (
              <CategoryCard key={cat.id} category={cat as any} onPress={goToProductList} />
            ))}
          </View>
        </View>

        {/* All Products */}
        <View style={styles.section}>
          <View style={globalStyle.rowBetween}>
            <Typography variant="sectionTitle">All Products / सभी उत्पाद</Typography>
            <TouchableOpacity onPress={() => goToProductList()} activeOpacity={0.7}>
              <Typography variant="link" style={styles.seeAll}>See All</Typography>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.centered}>
              <Typography variant="bodyMuted" center>{error}</Typography>
              <TouchableOpacity onPress={refresh} style={styles.retryButton} activeOpacity={0.7}>
                <Typography variant="button" style={styles.retryText}>Retry</Typography>
              </TouchableOpacity>
            </View>
          ) : products.length === 0 && loading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.productGrid}>
              {products.slice(0, 6).map((product) => (
                <View key={product.id} style={{ width: '48%' }}>
                  <ProductCard product={product} onPress={goToProductDetail} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    color: Colors.gray900,
  },
  cartButton: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    ...Shadows.subtle,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    height: 48,
    ...Shadows.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
    paddingVertical: 8,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  horizontalScroll: {
    gap: 12,
    paddingRight: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  seeAll: {
    fontSize: 13,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  retryText: {
    color: Colors.white,
  },
  loader: {
    marginTop: 40,
  },
});
