/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — BLOCK FORM SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Create or edit an orchard block.
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
import { Typography, PrimaryHeading } from '../typography';
import { showToast } from '../store/toastStore';
import { createBlock, updateBlock, fetchBlocks, type CreateBlockRequest } from '../services/orchardApi';
import { fetchVarieties, type VarietyListItem } from '../services/varietyApi';
import { fetchRootstocks, type RootstockListItem } from '../services/rootstockApi';
import FormDropdown from '../components/FormDropdown';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'BlockForm'>;

const AREA_UNITS = [
  { value: 'bigha', label: 'Bigha (HP)' },
  { value: 'kanal', label: 'Kanal (J&K)' },
  { value: 'nali', label: 'Nali (UK)' },
  { value: 'hectare', label: 'Hectare' },
];

const SOIL_TYPES = [
  { value: 'loam', label: 'Loam' },
  { value: 'clay', label: 'Clay' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'silty', label: 'Silty' },
  { value: 'peaty', label: 'Peaty' },
];

const ASPECTS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'flat', label: 'Flat' },
];

const WIND_EXPOSURES = [
  { value: 'sheltered', label: 'Sheltered' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'exposed', label: 'Exposed' },
];

const FROST_RISKS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function BlockFormScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { orchardId, blockId } = route.params ?? {};
  const isEditing = !!blockId;

  const [form, setForm] = useState<CreateBlockRequest>({ name: '' });
  const [varieties, setVarieties] = useState<VarietyListItem[]>([]);
  const [rootstocks, setRootstocks] = useState<RootstockListItem[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchVarieties({ per_page: 100 })
      .then((res) => setVarieties(res.data))
      .catch(() => showToast('Failed to load varieties', 'error'));

    fetchRootstocks({ per_page: 100 })
      .then((res) => setRootstocks(res.data))
      .catch(() => showToast('Failed to load rootstocks', 'error'));
  }, []);

  useEffect(() => {
    if (!blockId || !orchardId) return;
    fetchBlocks(orchardId)
      .then((res) => {
        const block = res.blocks.find((b) => b.id === blockId);
        if (block) {
          setForm({
            name: block.name,
            block_varieties: block.block_varieties?.map((bv) => ({
              variety_id: bv.variety_id,
              rootstock_id: bv.rootstock_id,
            })) ?? undefined,
            area_unit: (block.area_unit as any) ?? undefined,
            area_local_value: block.area_local_value ?? undefined,
            plant_count: block.plant_count ?? undefined,
            spacing_meters: block.spacing_meters ?? undefined,
            soil_type: (block.soil_type as any) ?? undefined,
            soil_ph: block.soil_ph ?? undefined,
            irrigation_type: (block.irrigation_type as any) ?? undefined,
            aspect: (block.aspect as any) ?? undefined,
            slope_percent: block.slope_percent ?? undefined,
            is_sunny_exposure: block.is_sunny_exposure,
            wind_exposure: (block.wind_exposure as any) ?? undefined,
            frost_pocket_risk: (block.frost_pocket_risk as any) ?? undefined,
          });
        }
      })
      .catch(() => showToast('Failed to load block', 'error'))
      .finally(() => setLoading(false));
  }, [orchardId, blockId]);

  const updateField = useCallback(<K extends keyof CreateBlockRequest>(field: K, value: CreateBlockRequest[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const toggleVariety = useCallback((varietyId: number) => {
    setForm((prev) => {
      const current = prev.block_varieties ?? [];
      const exists = current.find((v) => v.variety_id === varietyId);
      if (exists) {
        const next = current.filter((v) => v.variety_id !== varietyId);
        return { ...prev, block_varieties: next.length > 0 ? next : undefined };
      }
      // Auto-select first rootstock so the entry is never incomplete
      const defaultRootstockId = rootstocks[0]?.id;
      return {
        ...prev,
        block_varieties: [...current, { variety_id: varietyId, rootstock_id: defaultRootstockId }],
      };
    });
  }, [rootstocks]);

  const setVarietyRootstock = useCallback((varietyId: number, rootstockId: number | undefined) => {
    setForm((prev) => {
      const current = prev.block_varieties ?? [];
      const next = current.map((v) =>
        v.variety_id === varietyId ? { ...v, rootstock_id: rootstockId } : v
      );
      return { ...prev, block_varieties: next };
    });
  }, []);

  const handleSave = useCallback(async () => {
    const bvs = form.block_varieties ?? [];
    const missingRootstock = bvs.filter((bv) => !bv.rootstock_id);
    if (missingRootstock.length > 0) {
      showToast('Please select a rootstock for each variety', 'warning');
      setErrors({ block_varieties: ['Please select a rootstock for each variety'] });
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      if (isEditing && blockId && orchardId) {
        await updateBlock(orchardId, blockId, form);
        showToast('Block updated', 'success');
      } else if (orchardId) {
        await createBlock(orchardId, form);
        showToast('Block created', 'success');
      }
      navigation.goBack();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        showToast('Please fix the errors', 'warning');
      } else {
        showToast(err?.response?.data?.message ?? 'Failed to save block', 'error');
      }
    } finally {
      setSaving(false);
    }
  }, [form, isEditing, orchardId, blockId, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const selectedBlockVarieties = form.block_varieties ?? [];
  const rootstockOptions = rootstocks.map((rs) => ({ value: String(rs.id), label: rs.name }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Icon name="arrow-left" size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <PrimaryHeading style={styles.title}>{isEditing ? 'Edit Block' : 'New Block'}</PrimaryHeading>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <FormInput label="Block Name / ब्लॉक का नाम *" value={form.name} onChangeText={(t) => updateField('name', t)} error={errors.name} />

            {/* Variety Multi-Select with Rootstock */}
            <View style={styles.inputGroup}>
              <Typography variant="label" style={styles.label}>Varieties & Rootstocks / किस्में और रूटस्टॉक</Typography>
              <View style={styles.checkboxList}>
                {varieties.map((v) => {
                  const selected = selectedBlockVarieties.find((bv) => bv.variety_id === v.id);
                  const isSelected = !!selected;
                  return (
                    <View key={v.id} style={styles.varietyCardShadow}>
                      <View style={[styles.varietyCardInner, isSelected && styles.varietyCardSelected]}>
                        <TouchableOpacity
                          style={styles.varietyRow}
                          onPress={() => toggleVariety(v.id)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                            {isSelected && <Icon name="check" size={14} color={Colors.white} />}
                          </View>
                          <Typography variant="body" style={styles.checkboxLabel}>{v.name_en}</Typography>
                        </TouchableOpacity>

                        {isSelected && (
                          <View style={styles.rootstockDropdownWrap}>
                            <FormDropdown
                              label="Rootstock / रूटस्टॉक *"
                              value={selected.rootstock_id ? String(selected.rootstock_id) : ''}
                              options={rootstockOptions}
                              onChange={(val) => setVarietyRootstock(v.id, val ? parseInt(val, 10) : undefined)}
                              placeholder="Select rootstock"
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
                {varieties.length === 0 && (
                  <Typography variant="captionMuted" style={styles.emptyText}>No varieties available</Typography>
                )}
              </View>
              {errors.block_varieties?.map((err, i) => (
                <Typography key={i} variant="caption" style={styles.errorText}>{err}</Typography>
              ))}
            </View>

            {/* Area with unit dropdown */}
            <View style={styles.rowInputs}>
              <View style={styles.flex1}>
                <FormInput label="Area Value" value={form.area_local_value?.toString() ?? ''} onChangeText={(t) => updateField('area_local_value', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
              </View>
              <View style={styles.flex1}>
                <FormDropdown
                  label="Unit / इकाई"
                  value={form.area_unit ?? ''}
                  options={AREA_UNITS}
                  onChange={(v) => updateField('area_unit', v as any)}
                  placeholder="Select unit"
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.flex1}>
                <FormInput label="Plants" value={form.plant_count?.toString() ?? ''} onChangeText={(t) => updateField('plant_count', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={styles.flex1}>
                <FormInput label="Spacing (m)" value={form.spacing_meters ?? ''} onChangeText={(t) => updateField('spacing_meters', t || undefined)} />
              </View>
              <View style={styles.flex1}>
                <FormInput label="Soil pH" value={form.soil_ph?.toString() ?? ''} onChangeText={(t) => updateField('soil_ph', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
              </View>
            </View>

            <FormSelect label="Soil Type / मिट्टी का प्रकार" value={form.soil_type ?? ''} options={SOIL_TYPES} onChange={(v) => updateField('soil_type', v as any)} nullable />
            <FormSelect label="Aspect / दिशा" value={form.aspect ?? ''} options={ASPECTS} onChange={(v) => updateField('aspect', v as any)} nullable />
            <FormSelect label="Wind Exposure / हवा का संपर्क" value={form.wind_exposure ?? ''} options={WIND_EXPOSURES} onChange={(v) => updateField('wind_exposure', v as any)} nullable />
            <FormSelect label="Frost Risk / पाला जोखिम" value={form.frost_pocket_risk ?? ''} options={FROST_RISKS} onChange={(v) => updateField('frost_pocket_risk', v as any)} nullable />

            <FormToggle label="Sunny Exposure / धूप वाला" value={!!form.is_sunny_exposure} onToggle={() => updateField('is_sunny_exposure', !form.is_sunny_exposure)} />
          </ScrollView>

          {/* Save Button — fixed at bottom, outside ScrollView */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
              {saving ? <ActivityIndicator color={Colors.white} /> : <Typography variant="button" style={styles.saveButtonText}>{isEditing ? 'Save / सहेजें' : 'Create / बनाएं'}</Typography>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormInput({ label, value, onChangeText, error, keyboardType }: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string[];
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
}) {
  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>{label}</Typography>
      <TextInput style={[styles.input, error && styles.inputError]} value={value} onChangeText={onChangeText} placeholderTextColor={Colors.gray400} keyboardType={keyboardType} />
      {error?.map((err, i) => <Typography key={i} variant="caption" style={styles.errorText}>{err}</Typography>)}
    </View>
  );
}

function FormSelect({ label, value, options, onChange, nullable }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  nullable?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>{label}</Typography>
      <View style={styles.chipRow}>
        {nullable && (
          <TouchableOpacity style={[styles.chip, value === '' && styles.chipActive]} onPress={() => onChange('')} activeOpacity={0.8}>
            <Typography variant="caption" style={value === '' ? styles.chipTextActive : styles.chipText}>None</Typography>
          </TouchableOpacity>
        )}
        {options.map((opt) => (
          <TouchableOpacity key={opt.value} style={[styles.chip, value === opt.value && styles.chipActive]} onPress={() => onChange(opt.value)} activeOpacity={0.8}>
            <Typography variant="caption" style={value === opt.value ? styles.chipTextActive : styles.chipText}>{opt.label}</Typography>
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
      <View style={[styles.toggleBox, value && styles.toggleBoxActive]}>{value && <Icon name="check" size={14} color={Colors.white} />}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  keyboardView: { flex: 1 },
  contentWrapper: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 26, marginTop: 8 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 140 },
  inputGroup: { marginBottom: 14, gap: 6 },
  label: { color: Colors.gray700, fontSize: 13 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, marginTop: 2, fontSize: 12 },
  rowInputs: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  checkboxList: { gap: 8 },
  varietyCardShadow: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  varietyCardInner: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  varietyCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  varietyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.gray800,
  },
  rootstockDropdownWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  emptyText: { marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 2 },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    marginRight: 6,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.gray700, fontSize: 12 },
  chipTextActive: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
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
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 80,
    backgroundColor: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
