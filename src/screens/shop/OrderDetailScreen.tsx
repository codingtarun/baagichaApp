/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORDER DETAIL SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useOrderDetail } from '../../hooks/useOrders';
import { showToast } from '../../store/toastStore';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type OrderDetailRouteProp = RouteProp<ShopStackParamList, 'OrderDetail'>;
type OrderDetailNavProp = NativeStackNavigationProp<ShopStackParamList>;

const STATUS_COLORS: Record<string, string> = {
  pending: Colors.warning,
  confirmed: Colors.info,
  processing: Colors.info,
  shipped: Colors.primary,
  out_for_delivery: Colors.primary,
  delivered: Colors.success,
  cancelled: Colors.danger,
  returned: Colors.danger,
  refunded: Colors.gray400,
};

export default function OrderDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<OrderDetailNavProp>();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderNumber } = route.params;
  const { order, loading, error, refresh, cancel } = useOrderDetail(orderNumber);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancel();
              showToast('Order cancelled', 'success');
            } catch (err: any) {
              showToast(err?.message ?? 'Failed to cancel order', 'error');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  }, [cancel]);

  if (loading && !order) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.centered}>
        <Typography variant="bodyMuted" center>{error ?? 'Order not found'}</Typography>
        <TouchableOpacity onPress={refresh} style={styles.retryButton} activeOpacity={0.7}>
          <Typography variant="button" style={styles.retryText}>Retry</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[order.status] ?? Colors.gray400;
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>Order #{order.order_number}</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading && !!order} onRefresh={refresh} colors={[Colors.primary]} />}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor + '12' }]}>
          <MaterialCommunityIcons
            name={order.status === 'delivered' ? 'check-circle' : order.status === 'cancelled' ? 'close-circle' : 'truck-delivery'}
            size={28}
            color={statusColor}
          />
          <View style={styles.statusInfo}>
            <Typography variant="body" style={[styles.statusTitle, { color: statusColor }]}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            <Typography variant="caption" style={styles.statusSub}>
              {order.payment_status === 'paid' ? 'Payment received' : 'Payment pending'}
            </Typography>
          </View>
        </View>

        {/* Items */}
        <View style={globalStyle.card}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Items</Typography>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Typography variant="body" style={styles.itemName} numberOfLines={1}>{item.product_name}</Typography>
                <Typography variant="caption" style={styles.itemVariant}>{item.variant_name}</Typography>
              </View>
              <View style={styles.itemPriceCol}>
                <Typography variant="bodySmall" style={styles.itemQty}>× {item.quantity}</Typography>
                <Typography variant="body" style={styles.itemTotal}>₹{item.item_total.toLocaleString('en-IN')}</Typography>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        {order.shipping_address && (
          <View style={globalStyle.card}>
            <Typography variant="sectionTitle" style={styles.sectionTitle}>Shipping Address</Typography>
            <Typography variant="body" style={styles.addressName}>{order.shipping_address.name}</Typography>
            <Typography variant="bodySmall" style={styles.addressText}>
              {order.shipping_address.line1}
              {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}
            </Typography>
            <Typography variant="bodySmall" style={styles.addressText}>
              {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
            </Typography>
            <Typography variant="bodySmall" style={styles.addressText}>Phone: {order.shipping_address.phone}</Typography>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={globalStyle.card}>
          <Typography variant="sectionTitle" style={styles.sectionTitle}>Price Details</Typography>
          <View style={styles.summaryRow}>
            <Typography variant="bodySmall" style={styles.summaryLabel}>Subtotal</Typography>
            <Typography variant="bodySmall" style={styles.summaryValue}>₹{order.subtotal.toLocaleString('en-IN')}</Typography>
          </View>
          {order.discount_amount > 0 && (
            <View style={styles.summaryRow}>
              <Typography variant="bodySmall" style={styles.summaryLabel}>Discount</Typography>
              <Typography variant="bodySmall" style={[styles.summaryValue, styles.discountValue]}>
                -₹{order.discount_amount.toLocaleString('en-IN')}
              </Typography>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Typography variant="bodySmall" style={styles.summaryLabel}>Shipping</Typography>
            <Typography variant="bodySmall" style={styles.summaryValue}>
              {order.shipping_amount === 0 ? 'Free' : `₹${order.shipping_amount.toLocaleString('en-IN')}`}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="bodySmall" style={styles.summaryLabel}>Tax</Typography>
            <Typography variant="bodySmall" style={styles.summaryValue}>₹{order.tax_amount.toLocaleString('en-IN')}</Typography>
          </View>
          <View style={globalStyle.divider} />
          <View style={styles.summaryRow}>
            <Typography variant="body" style={styles.totalLabel}>Total</Typography>
            <Typography variant="displayHeading" style={styles.totalValue}>
              ₹{order.total.toLocaleString('en-IN')}
            </Typography>
          </View>
        </View>

        {/* Status History */}
        {order.status_history && order.status_history.length > 0 && (
          <View style={globalStyle.card}>
            <Typography variant="sectionTitle" style={styles.sectionTitle}>Order History</Typography>
            {order.status_history.map((history, index) => (
              <View key={index} style={styles.historyRow}>
                <View style={styles.historyDot} />
                <View style={styles.historyInfo}>
                  <Typography variant="bodySmall" style={styles.historyStatus}>
                    {history.status.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                  {history.comment && (
                    <Typography variant="caption" style={styles.historyComment}>{history.comment}</Typography>
                  )}
                  <Typography variant="caption" style={styles.historyDate}>
                    {new Date(history.created_at).toLocaleString('en-IN')}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
            activeOpacity={0.8}
          >
            {cancelling ? (
              <ActivityIndicator color={Colors.danger} />
            ) : (
              <Typography variant="button" style={styles.cancelText}>Cancel Order</Typography>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusInfo: {
    marginLeft: 12,
  },
  statusTitle: {
    fontWeight: '800',
    fontSize: 15,
  },
  statusSub: {
    color: Colors.gray500,
    marginTop: 2,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontWeight: '600',
    color: Colors.gray800,
  },
  itemVariant: {
    color: Colors.gray400,
    marginTop: 2,
  },
  itemPriceCol: {
    alignItems: 'flex-end',
  },
  itemQty: {
    color: Colors.gray400,
  },
  itemTotal: {
    color: Colors.primary,
    fontWeight: '700',
  },
  addressName: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  addressText: {
    color: Colors.gray600,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  historyRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyStatus: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  historyComment: {
    color: Colors.gray500,
    marginTop: 2,
  },
  historyDate: {
    color: Colors.gray400,
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: Colors.danger + '08',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
  },
  cancelText: {
    color: Colors.danger,
    fontWeight: '700',
  },
});
