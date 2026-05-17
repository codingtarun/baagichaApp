/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — CHECKOUT SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Razorpay payment flow. No COD option.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useCart } from '../../hooks/useCart';
import { useAddresses } from '../../hooks/useAddresses';
import { createCheckout, verifyRazorpayPayment } from '../../services/shopApi';
import { showToast } from '../../store/toastStore';
import { ENV } from '../../config/env';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type CheckoutNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function CheckoutScreen(): React.JSX.Element {
  const navigation = useNavigation<CheckoutNavProp>();
  const cart = useCart();
  const { addresses, loading: addressesLoading } = useAddresses();
  const insets = useSafeAreaInsets();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? defaultAddress;

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddress) {
      showToast('Please add a shipping address', 'warning');
      navigation.navigate('AddressList');
      return;
    }

    setPlacingOrder(true);
    try {
      // 1. Create order on backend
      const checkoutData = await createCheckout({
        shipping_address_id: selectedAddress.id,
        billing_address_id: selectedAddress.id,
        payment_method: 'razorpay',
      });

      const razorpay = checkoutData.razorpay;
      if (!razorpay) {
        throw new Error('Razorpay checkout data missing');
      }

      // 2. Open Razorpay checkout
      const options = {
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: razorpay.name,
        description: razorpay.description,
        order_id: razorpay.order_id,
        prefill: razorpay.prefill,
        theme: { color: Colors.primary },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData: any) => {
          // 3. Verify payment with backend
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: razorpay.order_id,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_signature: paymentData.razorpay_signature,
            });

            showToast('Payment successful! Order placed.', 'success');
            cart.clearCart();
            navigation.replace('OrderDetail', { orderNumber: checkoutData.order.order_number });
          } catch (verifyErr: any) {
            showToast('Payment verification failed. Please contact support.', 'error');
            navigation.replace('OrderList');
          }
        })
        .catch((error: any) => {
          console.warn('[Razorpay] Payment failed:', error);
          showToast('Payment cancelled or failed', 'error');
        });
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to place order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  }, [selectedAddress, cart, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>Checkout</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Shipping Address */}
        <View style={globalStyle.card}>
          <View style={globalStyle.rowBetween}>
            <Typography variant="sectionTitle" style={styles.sectionTitle}>Shipping Address</Typography>
            <TouchableOpacity onPress={() => navigation.navigate('AddressList')} activeOpacity={0.7}>
              <Typography variant="link" style={styles.changeText}>
                {selectedAddress ? 'Change' : 'Add'}
              </Typography>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.addressBox}>
              <Typography variant="body" style={styles.addressName}>{selectedAddress.name}</Typography>
              <Typography variant="bodySmall" style={styles.addressText}>
                {selectedAddress.line1}
                {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
              </Typography>
              <Typography variant="bodySmall" style={styles.addressText}>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </Typography>
              <Typography variant="bodySmall" style={styles.addressText}>Phone: {selectedAddress.phone}</Typography>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAddressBox}
              onPress={() => navigation.navigate('AddressList')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color={Colors.primary} />
              <Typography variant="body" style={styles.addAddressText}>Add Shipping Address</Typography>
            </TouchableOpacity>
          )}
        </View>

        {/* Order Items */}
        <View style={globalStyle.card}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Order Items ({cart.itemCount})</Typography>
          {cart.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Typography variant="bodySmall" style={styles.orderItemName} numberOfLines={1}>
                {item.product_name} × {item.quantity}
              </Typography>
              <Typography variant="bodySmall" style={styles.orderItemPrice}>
                ₹{item.item_total.toLocaleString('en-IN')}
              </Typography>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={globalStyle.card}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Payment Method</Typography>
          <View style={styles.paymentMethod}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color={Colors.primary} />
            <View style={styles.paymentInfo}>
              <Typography variant="body" style={styles.paymentTitle}>Razorpay Secure Payment</Typography>
              <Typography variant="caption" style={styles.paymentSub}>UPI, Cards, NetBanking, Wallets</Typography>
            </View>
          </View>
        </View>

        {/* Price Summary */}
        <View style={globalStyle.card}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Order Summary</Typography>
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
            <Typography variant="body" style={styles.totalLabel}>Total Payable</Typography>
            <Typography variant="displayHeading" style={styles.totalValue}>
              ₹{cart.total.toLocaleString('en-IN')}
            </Typography>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomBar, { paddingBottom: 16 + insets.bottom }]}>
        <View>
          <Typography variant="caption" style={styles.totalLabelSmall}>Total</Typography>
          <Typography variant="displayHeading" style={styles.totalPrice}>
            ₹{cart.total.toLocaleString('en-IN')}
          </Typography>
        </View>
        <TouchableOpacity
          style={[styles.placeButton, placingOrder && styles.placeButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={placingOrder || cart.items.length === 0}
          activeOpacity={0.8}
        >
          {placingOrder ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Typography variant="button" style={styles.placeButtonText}>Pay Now →</Typography>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  changeText: {
    fontSize: 13,
  },
  addressBox: {
    backgroundColor: Colors.gray50,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  addressName: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  addressText: {
    color: Colors.gray600,
  },
  addAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addAddressText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  orderItemName: {
    color: Colors.gray700,
    flex: 1,
    marginRight: 8,
  },
  orderItemPrice: {
    color: Colors.gray800,
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.gray50,
    borderRadius: 12,
  },
  paymentInfo: {
    gap: 2,
  },
  paymentTitle: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  paymentSub: {
    color: Colors.gray400,
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
  placeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  placeButtonDisabled: {
    opacity: 0.6,
  },
  placeButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
