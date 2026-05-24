/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD FORM SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Create or edit an orchard.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography, PrimaryHeading, HindiText } from '../typography';
import { showToast } from '../store/toastStore';
import { createOrchard, updateOrchard, fetchOrchard, type CreateOrchardRequest } from '../services/orchardApi';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'OrchardForm'>;

const FARMING_TYPES = [
  { value: 'conventional', label: 'Conventional', labelHi: 'पारंपरिक' },
  { value: 'integrated', label: 'Integrated', labelHi: 'एकीकृत' },
  { value: 'organic', label: 'Organic', labelHi: 'जैविक' },
  { value: 'transitioning_organic', label: 'Transitioning to Organic', labelHi: 'जैविक में परिवर्तन' },
];

const IRRIGATION_TYPES = [
  { value: 'rain_fed', label: 'Rain-fed', labelHi: 'वर्षा-आधारित' },
  { value: 'drip', label: 'Drip', labelHi: 'ड्रिप' },
  { value: 'sprinkler', label: 'Sprinkler', labelHi: 'स्प्रिंकलर' },
  { value: 'flood', label: 'Flood', labelHi: 'बाढ़ सिंचाई' },
  { value: 'mixed', label: 'Mixed', labelHi: 'मिश्रित' },
];

const AREA_UNITS = [
  { value: 'bigha', label: 'Bigha (HP)', labelHi: 'बीघा' },
  { value: 'kanal', label: 'Kanal (J&K)', labelHi: 'कनाल' },
  { value: 'nali', label: 'Nali (UK)', labelHi: 'नाली' },
  { value: 'hectare', label: 'Hectare', labelHi: 'हेक्टेयर' },
];

const ASPECTS = [
  { value: 'north', label: 'North', labelHi: 'उत्तर' },
  { value: 'south', label: 'South', labelHi: 'दक्षिण' },
  { value: 'east', label: 'East', labelHi: 'पूर्व' },
  { value: 'west', label: 'West', labelHi: 'पश्चिम' },
  { value: 'mixed', label: 'Mixed', labelHi: 'मिश्रित' },
];

const ALTITUDE_SOURCES = [
  { value: 'manual', label: 'Manual', labelHi: 'मैनुअल' },
  { value: 'gps', label: 'GPS', labelHi: 'जीपीएस' },
  { value: 'map', label: 'Map', labelHi: 'नक्शा' },
];

const PRIMARY_MARKETS = [
  { value: 'mandi', label: 'Mandi', labelHi: 'मंडी' },
  { value: 'direct_buyer', label: 'Direct Buyer', labelHi: 'सीधा खरीदार' },
  { value: 'cooperative', label: 'Cooperative', labelHi: 'सहकारी' },
  { value: 'export', label: 'Export', labelHi: 'निर्यात' },
  { value: 'mixed', label: 'Mixed', labelHi: 'मिश्रित' },
];

export default function OrchardFormScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const orchardId = route.params?.orchardId;
  const isEditing = !!orchardId;

  const [form, setForm] = useState<CreateOrchardRequest>({
    orchard_name: '',
    state: '',
    district: '',
    farming_type: 'conventional',
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!orchardId) return;
    fetchOrchard(orchardId)
      .then((res) => {
        const o = res.data;
        setForm({
          orchard_name: o.orchard_name,
          is_primary: o.is_primary,
          state: o.state,
          district: o.district,
          tehsil: o.tehsil ?? undefined,
          village: o.village ?? undefined,
          pincode: o.pincode ?? undefined,
          latitude: o.latitude ?? undefined,
          longitude: o.longitude ?? undefined,
          altitude_meters: o.altitude_meters ?? undefined,
          area_unit: (o.area_unit as any) ?? undefined,
          area_local_value: o.area_local_value ?? undefined,
          total_trees: o.total_trees ?? undefined,
          avg_tree_age_years: o.avg_tree_age_years ?? undefined,
          farming_type: o.farming_type as any,
          irrigation_type: (o.irrigation_type as any) ?? undefined,
          has_cold_storage: o.has_cold_storage,
          has_ca_storage: o.has_ca_storage,
          has_packing_house: o.has_packing_house,
          uses_anti_hail_net: o.uses_anti_hail_net,
          is_frost_prone: o.is_frost_prone,
          is_hail_prone: o.is_hail_prone,
          is_near_water_body: o.is_near_water_body,
          microclimate_notes: o.microclimate_notes ?? undefined,
          primary_market: (o.primary_market as any) ?? undefined,
        });
      })
      .catch(() => showToast('Failed to load orchard', 'error'))
      .finally(() => setLoading(false));
  }, [orchardId]);

  const updateField = useCallback(<K extends keyof CreateOrchardRequest>(field: K, value: CreateOrchardRequest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const toggleBool = useCallback((field: keyof CreateOrchardRequest) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setErrors({});
    try {
      if (isEditing && orchardId) {
        await updateOrchard(orchardId, form);
        showToast('Orchard updated', 'success');
      } else {
        await createOrchard(form);
        showToast('Orchard created', 'success');
      }
      navigation.goBack();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        showToast('Please fix the errors', 'warning');
      } else {
        showToast(err?.response?.data?.message ?? 'Failed to save orchard', 'error');
      }
    } finally {
      setSaving(false);
    }
  }, [form, isEditing, orchardId, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color={Colors.gray700} />
          </TouchableOpacity>
          <PrimaryHeading style={styles.title}>
            {isEditing ? 'Edit Orchard' : 'New Orchard'}
          </PrimaryHeading>
          <HindiText style={styles.subtitleHi}>
            {isEditing ? 'बाग संपादित करें' : 'नया बाग'}
          </HindiText>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Basic Info */}
          <FormSection title="Basic Info / मूल जानकारी">
            <FormInput label="Orchard Name / बाग का नाम *" value={form.orchard_name} onChangeText={(t) => updateField('orchard_name', t)} error={errors.orchard_name} />
            <FormInput label="State / राज्य *" value={form.state} onChangeText={(t) => updateField('state', t)} error={errors.state} />
            <FormInput label="District / जिला *" value={form.district} onChangeText={(t) => updateField('district', t)} error={errors.district} />
            <FormInput label="Tehsil / तहसील" value={form.tehsil ?? ''} onChangeText={(t) => updateField('tehsil', t || undefined)} />
            <FormInput label="Village / गांव" value={form.village ?? ''} onChangeText={(t) => updateField('village', t || undefined)} />
            <FormInput label="Pincode / पिन कोड" value={form.pincode ?? ''} onChangeText={(t) => updateField('pincode', t || undefined)} keyboardType="number-pad" />
          </FormSection>

          {/* Area & Trees */}
          <FormSection title="Area & Trees / क्षेत्र और पेड़">
            <View style={styles.rowInputs}>
              <View style={styles.flex1}>
                <FormInput label="Area Value" value={form.area_local_value?.toString() ?? ''} onChangeText={(t) => updateField('area_local_value', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
              </View>
              <View style={styles.flex1}>
                <FormSelect label="Unit / इकाई" value={form.area_unit ?? ''} options={AREA_UNITS} onChange={(v) => updateField('area_unit', v as any)} nullable />
              </View>
            </View>
            <FormInput label="Total Trees / कुल पेड़" value={form.total_trees?.toString() ?? ''} onChangeText={(t) => updateField('total_trees', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
            <FormInput label="Avg Tree Age (years) / औसत उम्र" value={form.avg_tree_age_years?.toString() ?? ''} onChangeText={(t) => updateField('avg_tree_age_years', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
          </FormSection>

          {/* Farming */}
          <FormSection title="Farming / खेती">
            <FormSelect label="Farming Type / खेती का प्रकार *" value={form.farming_type} options={FARMING_TYPES} onChange={(v) => updateField('farming_type', v as any)} />
            <FormSelect label="Irrigation Type / सिंचाई का प्रकार" value={form.irrigation_type ?? ''} options={IRRIGATION_TYPES} onChange={(v) => updateField('irrigation_type', v as any)} nullable />
            <FormSelect label="Aspect / दिशा" value={form.aspect ?? ''} options={ASPECTS} onChange={(v) => updateField('aspect', v as any)} nullable />
            <FormSelect label="Primary Market / मुख्य बाजार" value={form.primary_market ?? ''} options={PRIMARY_MARKETS} onChange={(v) => updateField('primary_market', v as any)} nullable />
          </FormSection>

          {/* Facilities */}
          <FormSection title="Facilities / सुविधाएँ">
            <FormToggle label="Cold Storage / ठंडा भंडार" value={!!form.has_cold_storage} onToggle={() => toggleBool('has_cold_storage')} />
            <FormToggle label="CA Storage / नियंत्रित वायु भंडार" value={!!form.has_ca_storage} onToggle={() => toggleBool('has_ca_storage')} />
            <FormToggle label="Packing House / पैकिंग हाउस" value={!!form.has_packing_house} onToggle={() => toggleBool('has_packing_house')} />
            <FormToggle label="Anti-Hail Net / ओल रोधी जाल" value={!!form.uses_anti_hail_net} onToggle={() => toggleBool('uses_anti_hail_net')} />
            <FormToggle label="Frost Prone / पाला-प्रवण" value={!!form.is_frost_prone} onToggle={() => toggleBool('is_frost_prone')} />
            <FormToggle label="Hail Prone / ओला-प्रवण" value={!!form.is_hail_prone} onToggle={() => toggleBool('is_hail_prone')} />
            <FormToggle label="Near Water Body / जल निकट" value={!!form.is_near_water_body} onToggle={() => toggleBool('is_near_water_body')} />
            <FormToggle label="Primary Orchard / मुख्य बाग" value={!!form.is_primary} onToggle={() => toggleBool('is_primary')} />
          </FormSection>

          {/* Location Details */}
          <FormSection title="Location Details / स्थान विवरण">
            <FormInput label="Latitude / अक्षांश" value={form.latitude?.toString() ?? ''} onChangeText={(t) => updateField('latitude', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
            <FormInput label="Longitude / देशांतर" value={form.longitude?.toString() ?? ''} onChangeText={(t) => updateField('longitude', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
            <FormInput label="Altitude (meters) / ऊंचाई (मीटर)" value={form.altitude_meters?.toString() ?? ''} onChangeText={(t) => updateField('altitude_meters', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
            <FormSelect label="Altitude Source / ऊंचाई स्रोत" value={form.altitude_source ?? ''} options={ALTITUDE_SOURCES} onChange={(v) => updateField('altitude_source', v as any)} nullable />
          </FormSection>

          {/* Notes */}
          <FormSection title="Notes / नोट्स">
            <FormInput label="Microclimate Notes / जलवायु नोट्स" value={form.microclimate_notes ?? ''} onChangeText={(t) => updateField('microclimate_notes', t || undefined)} multiline />
          </FormSection>

          {/* Save Button */}
          <TouchableOpacity style={[styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            {saving ? <ActivityIndicator color={Colors.white} /> : <Typography variant="button" style={styles.saveButtonText}>{isEditing ? 'Save Changes / परिवर्तन सहेजें' : 'Create Orchard / बाग बनाएं'}</Typography>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Typography variant="body" style={styles.sectionTitle}>{title}</Typography>
      {children}
    </View>
  );
}

function FormInput({ label, value, onChangeText, error, keyboardType, multiline }: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string[];
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>{label}</Typography>
      <TextInput
        style={[styles.input, error && styles.inputError, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.gray400}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {error?.map((err, i) => <Typography key={i} variant="caption" style={styles.errorText}>{err}</Typography>)}
    </View>
  );
}

function FormSelect({ label, value, options, onChange, nullable }: {
  label: string;
  value: string;
  options: { value: string; label: string; labelHi?: string }[];
  onChange: (v: string) => void;
  nullable?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>{label}</Typography>
      <View style={styles.selectRow}>
        {nullable && (
          <TouchableOpacity style={[styles.selectChip, value === '' && styles.selectChipActive]} onPress={() => onChange('')} activeOpacity={0.8}>
            <Typography variant="caption" style={value === '' ? styles.selectChipTextActive : styles.selectChipText}>None</Typography>
          </TouchableOpacity>
        )}
        {options.map((opt) => (
          <TouchableOpacity key={opt.value} style={[styles.selectChip, value === opt.value && styles.selectChipActive]} onPress={() => onChange(opt.value)} activeOpacity={0.8}>
            <Typography variant="caption" style={value === opt.value ? styles.selectChipTextActive : styles.selectChipText}>{opt.label}</Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function FormToggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.8}>
      <Typography variant="body" style={styles.toggleLabel}>{label}</Typography>
      <View style={[styles.toggleBox, value && styles.toggleBoxActive]}>
        {value && <Icon name="check" size={14} color={Colors.white} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  keyboardView: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 26, marginTop: 8 },
  subtitleHi: { fontSize: 16, color: Colors.gray500, marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.gray700, marginBottom: 10 },
  inputGroup: { marginBottom: 14, gap: 6 },
  label: { color: Colors.gray700, fontSize: 13 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
  },
  inputError: { borderColor: Colors.danger },
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  errorText: { color: Colors.danger, marginTop: 2, fontSize: 12 },
  rowInputs: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectChip: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  selectChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectChipText: { color: Colors.gray700, fontSize: 12 },
  selectChipTextActive: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  toggleLabel: { color: Colors.gray800, fontSize: 14 },
  toggleBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBoxActive: { backgroundColor: Colors.primary },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
