/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ADDRESS LIST SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useAddresses } from '../../hooks/useAddresses';
import { showToast } from '../../store/toastStore';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type AddressNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function AddressListScreen(): React.JSX.Element {
  const navigation = useNavigation<AddressNavProp>();
  const { addresses, loading, refresh, remove, setDefault } = useAddresses();

  const handleDelete = (id: number) => {
    remove(id)
      .then(() => showToast('Address deleted', 'success'))
      .catch((err: any) => showToast(err?.message ?? 'Failed to delete', 'error'));
  };

  const handleSetDefault = (id: number) => {
    setDefault(id)
      .then(() => showToast('Default address updated', 'success'))
      .catch((err: any) => showToast(err?.message ?? 'Failed to update', 'error'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>My Addresses</Typography>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddEditAddress', { address: undefined })}
          activeOpacity={0.7}
          style={styles.addButton}
        >
          <MaterialCommunityIcons name="plus" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && addresses.length === 0 ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={loading && addresses.length > 0} onRefresh={refresh} colors={[Colors.primary]} />}
        >
          {addresses.map((address) => (
            <View key={address.id} style={[globalStyle.card, address.is_default && styles.defaultCard]}>
              <View style={globalStyle.rowBetween}>
                <View style={globalStyle.row}>
                  <MaterialCommunityIcons
                    name={address.type === 'billing' ? 'file-document-outline' : 'home-outline'}
                    size={18}
                    color={Colors.primary}
                  />
                  <Typography variant="body" style={styles.addressLabel}>{address.label}</Typography>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Typography variant="caption" style={styles.defaultBadgeText}>Default</Typography>
                    </View>
                  )}
                </View>
                <View style={globalStyle.row}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditAddress', { address })}
                    activeOpacity={0.7}
                    style={styles.actionIcon}
                  >
                    <MaterialCommunityIcons name="pencil-outline" size={18} color={Colors.gray500} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(address.id)}
                    activeOpacity={0.7}
                    style={styles.actionIcon}
                  >
                    <MaterialCommunityIcons name="delete-outline" size={18} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>

              <Typography variant="body" style={styles.name}>{address.name}</Typography>
              <Typography variant="bodySmall" style={styles.text}>
                {address.line1}{address.line2 ? `, ${address.line2}` : ''}
              </Typography>
              <Typography variant="bodySmall" style={styles.text}>
                {address.city}, {address.state} - {address.pincode}
              </Typography>
              <Typography variant="bodySmall" style={styles.text}>Phone: {address.phone}</Typography>

              {!address.is_default && (
                <TouchableOpacity onPress={() => handleSetDefault(address.id)} activeOpacity={0.7} style={styles.setDefault}>
                  <Typography variant="caption" style={styles.setDefaultText}>Set as Default</Typography>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {addresses.length === 0 && (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="map-marker-off" size={48} color={Colors.gray300} />
              <Typography variant="bodyMuted" center style={styles.emptyText}>No addresses saved yet.</Typography>
            </View>
          )}
        </ScrollView>
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
  },
  loader: {
    marginTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  defaultCard: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  addressLabel: {
    marginLeft: 6,
    fontWeight: '700',
    color: Colors.gray800,
  },
  defaultBadge: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    color: Colors.white,
    fontWeight: '700',
  },
  actionIcon: {
    padding: 6,
    marginLeft: 4,
  },
  name: {
    marginTop: 8,
    fontWeight: '600',
    color: Colors.gray800,
  },
  text: {
    color: Colors.gray600,
    marginTop: 2,
  },
  setDefault: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    color: Colors.gray400,
  },
});
