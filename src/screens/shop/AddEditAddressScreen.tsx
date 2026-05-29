/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ADD/EDIT ADDRESS SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../../theme/colors';
import { globalStyle } from '../../theme/style';
import { Typography } from '../../typography';
import { useAddresses } from '../../hooks/useAddresses';
import { showToast } from '../../store/toastStore';
import type { ShopStackParamList } from '../../navigation/stacks/ShopStack';

type AddEditRouteProp = RouteProp<ShopStackParamList, 'AddEditAddress'>;
type AddEditNavProp = NativeStackNavigationProp<ShopStackParamList>;

export default function AddEditAddressScreen(): React.JSX.Element {
  const navigation = useNavigation<AddEditNavProp>();
  const route = useRoute<AddEditRouteProp>();
  const existing = route.params?.address;
  const { add, update } = useAddresses();

  const [form, setForm] = useState({
    label: existing?.label ?? 'Home',
    name: existing?.name ?? '',
    phone: existing?.phone ?? '',
    line1: existing?.line1 ?? '',
    line2: existing?.line2 ?? '',
    city: existing?.city ?? '',
    state: existing?.state ?? '',
    pincode: existing?.pincode ?? '',
    type: (existing?.type ?? 'shipping') as 'shipping' | 'billing',
    is_default: existing?.is_default ?? false,
  });
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        country: 'India',
        gstin: null,
      };

      if (existing) {
        await update(existing.id, payload);
        showToast('Address updated', 'success');
      } else {
        await add(payload);
        showToast('Address added', 'success');
      }
      navigation.goBack();
    } catch (err: any) {
      showToast(err?.message ?? 'Failed to save address', 'error');
    } finally {
      setSaving(false);
    }
  }, [form, existing, add, update, navigation]);

  const inputStyle = (field: string) => [
    styles.input,
    !form[field as keyof typeof form] && styles.inputRequired,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.gray700} />
        </TouchableOpacity>
        <Typography variant="displayHeading" style={styles.title}>
          {existing ? 'Edit Address' : 'New Address'}
        </Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={globalStyle.card}>
          <Typography variant="label" style={styles.label}>Label (e.g. Home, Office)</Typography>
          <TextInput style={styles.input} value={form.label} onChangeText={(t) => updateField('label', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>Full Name *</Typography>
          <TextInput style={inputStyle('name')} value={form.name} onChangeText={(t) => updateField('name', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>Phone *</Typography>
          <TextInput style={inputStyle('phone')} value={form.phone} onChangeText={(t) => updateField('phone', t)} keyboardType="phone-pad" placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>Address Line 1 *</Typography>
          <TextInput style={inputStyle('line1')} value={form.line1} onChangeText={(t) => updateField('line1', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>Address Line 2</Typography>
          <TextInput style={styles.input} value={form.line2 ?? ''} onChangeText={(t) => updateField('line2', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>City *</Typography>
          <TextInput style={inputStyle('city')} value={form.city} onChangeText={(t) => updateField('city', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>State *</Typography>
          <TextInput style={inputStyle('state')} value={form.state} onChangeText={(t) => updateField('state', t)} placeholderTextColor={Colors.gray400} />

          <Typography variant="label" style={styles.label}>PIN Code *</Typography>
          <TextInput style={inputStyle('pincode')} value={form.pincode} onChangeText={(t) => updateField('pincode', t)} keyboardType="number-pad" placeholderTextColor={Colors.gray400} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Typography variant="button" style={styles.saveButtonText}>
              {existing ? 'Update Address' : 'Save Address'}
            </Typography>
          )}
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  label: {
    color: Colors.gray600,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.gray800,
    fontFamily: 'DMSans-Regular',
  },
  inputRequired: {
    borderColor: Colors.gray300,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
