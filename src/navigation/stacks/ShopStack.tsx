/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHOP STACK NAVIGATOR
 * ═══════════════════════════════════════════════════════════════
 *
 * Nested stack for the Shop tab. Keeps bottom navbar visible
 * when pushing screens from the Shop tab.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopScreen from '../../screens/ShopScreen';
import ProductListScreen from '../../screens/shop/ProductListScreen';
import ProductDetailScreen from '../../screens/shop/ProductDetailScreen';
import CartScreen from '../../screens/shop/CartScreen';
import CheckoutScreen from '../../screens/shop/CheckoutScreen';
import AddressListScreen from '../../screens/shop/AddressListScreen';
import AddEditAddressScreen from '../../screens/shop/AddEditAddressScreen';
import OrderListScreen from '../../screens/shop/OrderListScreen';
import OrderDetailScreen from '../../screens/shop/OrderDetailScreen';
import type { Address } from '../../services/shopApi';

export type ShopStackParamList = {
  Shop: undefined;
  ProductList: { category?: string; brand?: string; query?: string } | undefined;
  ProductDetail: { slug: string };
  Cart: undefined;
  Checkout: undefined;
  AddressList: undefined;
  AddEditAddress: { address?: Address } | undefined;
  OrderList: undefined;
  OrderDetail: { orderNumber: string };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="AddressList" component={AddressListScreen} />
      <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} />
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
