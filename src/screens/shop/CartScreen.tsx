/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CART SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useCart } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../store/toastStore';
import { navigateToLogin } from '../../navigation/navigationRef';
import QuantitySelector from '../../components/shop/QuantitySelector';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type CartNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function CartScreen(): React.JSX.Element {
  const navigation = useNavigation<CartNavProp>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cart = useCart();
  const insets = useSafeAreaInsets();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleUpdateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      setUpdatingItemId(itemId);
      try {
        if (quantity <= 0) {
          await cart.removeItem(itemId);
          showToast('Item removed', 'success');
        } else {
          await cart.updateItem(itemId, quantity);
        }
      } catch (err: any) {
        showToast(err?.message ?? 'Failed to update cart', 'error');
      } finally {
        setUpdatingItemId(null);
      }
    },
    [cart]
  );

  const handleRefresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    await cart.loadCart();
    setRefreshing(false);
  }, [isAuthenticated, cart]);

  const handleCheckout = useCallback(() => {
    if (cart.items.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }
    navigation.navigate('Checkout');
  }, [cart.items.length, navigation]);

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="cart-off" size={64} color={Colors.gray300} />
        <Typography variant="bodyMuted" center style={styles.emptyText}>
          Please sign in to view your cart
        </Typography>
        <TouchableOpacity
          style={styles.authButton}
          onPress={navigateToLogin}
          activeOpacity={0.8}
        >
          <Typography variant="button" style={styles.authButtonText}>Sign In</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  if (cart.isLoading && cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>My Cart</Typography>
        <View style={{ width: 40 }} />
      </View>

      {cart.items.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="cart-outline" size={64} color={Colors.gray300} />
          <Typography variant="bodyMuted" center style={styles.emptyText}>
            Your cart is empty
          </Typography>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.8}
          >
            <Typography variant="button" style={styles.shopButtonText}>Start Shopping</Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} />}
          >
            {cart.items.map((item) => (
              <View key={item.id} style={globalStyle.card}>
                <View style={globalStyle.row}>
                  <FastImage
                    source={{
                      uri: item.featured_image ?? 'https://via.placeholder.com/100?text=No+Image',
                      priority: FastImage.priority.normal,
                    }}
                    style={styles.itemImage}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={styles.itemInfo}>
                    <Typography variant="body" style={styles.itemName} numberOfLines={2}>
                      {item.product_name}
                    </Typography>
                    <Typography variant="caption" style={styles.itemVariant}>
                      {item.variant_name}
                    </Typography>
                    <Typography variant="body" style={styles.itemPrice}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </Typography>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  />
                  {updatingItemId === item.id ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.id, 0)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="delete-outline" size={22} color={Colors.danger} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Price Breakdown */}
            <View style={globalStyle.card}>
              <Typography variant="sectionTitle" style={styles.summaryTitle}>Order Summary</Typography>
              <View style={styles.summaryRow}>
                <Typography variant="body" style={styles.summaryLabel}>Subtotal</Typography>
                <Typography variant="body" style={styles.summaryValue}>₹{cart.subtotal.toLocaleString('en-IN')}</Typography>
              </View>
              {cart.discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Typography variant="body" style={styles.summaryLabel}>Discount</Typography>
                  <Typography variant="body" style={[styles.summaryValue, styles.discountValue]}>
                    -₹{cart.discountAmount.toLocaleString('en-IN')}
                  </Typography>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Typography variant="body" style={styles.summaryLabel}>Shipping</Typography>
                <Typography variant="body" style={styles.summaryValue}>
                  {cart.shippingAmount === 0 ? 'Free' : `₹${cart.shippingAmount.toLocaleString('en-IN')}`}
                </Typography>
              </View>
              <View style={styles.summaryRow}>
                <Typography variant="body" style={styles.summaryLabel}>Tax</Typography>
                <Typography variant="body" style={styles.summaryValue}>₹{cart.taxAmount.toLocaleString('en-IN')}</Typography>
              </View>
              <View style={globalStyle.divider} />
              <View style={styles.summaryRow}>
                <Typography variant="body" style={styles.totalLabel}>Total</Typography>
                <Typography variant="displayHeading" style={styles.totalValue}>
                  ₹{cart.total.toLocaleString('en-IN')}
                </Typography>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Button */}
          <View style={[styles.bottomBar, { paddingBottom: 16 + insets.bottom }]}>
            <View>
              <Typography variant="caption" style={styles.totalLabelSmall}>Total ({cart.itemCount} items)</Typography>
              <Typography variant="displayHeading" style={styles.totalPrice}>
                ₹{cart.total.toLocaleString('en-IN')}
              </Typography>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.8}>
              <Typography variant="button" style={styles.checkoutText}>Checkout →</Typography>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  emptyText: {
    marginTop: 16,
    color: Colors.gray400,
  },
  authButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
  },
  authButtonText: {
    color: Colors.white,
  },
  shopButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
  },
  shopButtonText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.gray100,
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontWeight: '600',
    color: Colors.gray800,
    lineHeight: 20,
  },
  itemVariant: {
    color: Colors.gray400,
  },
  itemPrice: {
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  summaryTitle: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: Colors.gray500,
  },
  summaryValue: {
    color: Colors.gray800,
    fontWeight: '600',
  },
  discountValue: {
    color: Colors.success,
  },
  totalLabel: {
    color: Colors.gray800,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: Colors.primary,
  },
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  totalLabelSmall: {
    color: Colors.gray400,
  },
  totalPrice: {
    fontSize: 20,
    color: Colors.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
