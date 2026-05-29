/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORDER LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useOrders } from '../../hooks/useOrders';
import type { Order } from '../../services/shopApi';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type OrderListNavProp = NativeStackNavigationProp<ShopStackParamList>;

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

function OrderCard({ order, onPress }: { order: Order; onPress: (orderNumber: string) => void }) {
  const statusColor = STATUS_COLORS[order.status] ?? Colors.gray400;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(order.order_number)}
      style={globalStyle.card}
    >
      <View style={globalStyle.rowBetween}>
        <Typography variant="body" style={styles.orderNumber}>#{order.order_number}</Typography>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <Typography variant="caption" style={[styles.statusText, { color: statusColor }]}>
            {order.status.replace(/_/g, ' ').toUpperCase()}
          </Typography>
        </View>
      </View>

      <Typography variant="caption" style={styles.date}>
        Placed on {new Date(order.placed_at).toLocaleDateString('en-IN')}
      </Typography>

      <View style={globalStyle.divider} />

      <View style={globalStyle.rowBetween}>
        <Typography variant="bodySmall" style={styles.itemsCount}>
          {order.items?.length ?? 0} items
        </Typography>
        <Typography variant="body" style={styles.total}>
          ₹{order.total.toLocaleString('en-IN')}
        </Typography>
      </View>

      <View style={globalStyle.row}>
        <MaterialCommunityIcons
          name={order.payment_status === 'paid' ? 'check-circle-outline' : 'clock-outline'}
          size={14}
          color={order.payment_status === 'paid' ? Colors.success : Colors.warning}
        />
        <Typography variant="caption" style={[styles.paymentStatus, { color: order.payment_status === 'paid' ? Colors.success : Colors.warning }]}>
          {order.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}

export default function OrderListScreen(): React.JSX.Element {
  const navigation = useNavigation<OrderListNavProp>();
  const { orders, loading, error, refresh, loadMore, hasMore } = useOrders();

  const goToOrderDetail = useCallback(
    (orderNumber: string) => {
      navigation.navigate('OrderDetail', { orderNumber });
    },
    [navigation]
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return <ActivityIndicator style={styles.footerLoader} color={Colors.primary} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>My Orders</Typography>
        <View style={{ width: 40 }} />
      </View>

      {error ? (
        <View style={styles.centered}>
          <Typography variant="bodyMuted" center>{error}</Typography>
          <TouchableOpacity onPress={refresh} style={styles.retryButton} activeOpacity={0.7}>
            <Typography variant="button" style={styles.retryText}>Retry</Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_number}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <OrderCard order={item} onPress={goToOrderDetail} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} colors={[Colors.primary]} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.centered}>
                <MaterialCommunityIcons name="package-variant" size={64} color={Colors.gray300} />
                <Typography variant="bodyMuted" center style={styles.emptyText}>No orders yet.</Typography>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
  emptyText: {
    marginTop: 12,
    color: Colors.gray400,
  },
  orderNumber: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 10,
  },
  date: {
    color: Colors.gray400,
    marginTop: 4,
  },
  itemsCount: {
    color: Colors.gray500,
  },
  total: {
    color: Colors.primary,
    fontWeight: '700',
  },
  paymentStatus: {
    marginLeft: 4,
    fontWeight: '600',
  },
  footerLoader: {
    marginVertical: 16,
  },
});
