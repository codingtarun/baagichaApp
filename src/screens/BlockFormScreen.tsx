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
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'BlockForm'>;

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
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchVarieties({ per_page: 100 })
      .then((res) => setVarieties(res.data))
      .catch(() => showToast('Failed to load varieties', 'error'));
  }, []);

  useEffect(() => {
    if (!blockId || !orchardId) return;
    fetchBlocks(orchardId)
      .then((res) => {
        const block = res.blocks.find((b) => b.id === blockId);
        if (block) {
          setForm({
            name: block.name,
            variety_id: block.variety_id ?? undefined,
            area_kanal: block.area_kanal ?? undefined,
            plant_count: block.plant_count ?? undefined,
            tree_age_years: block.tree_age_years ?? undefined,
            spacing_meters: block.spacing_meters ?? undefined,
            soil_type: (block.soil_type as any) ?? undefined,
            soil_ph: block.soil_ph ?? undefined,
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

  const handleSave = useCallback(async () => {
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color={Colors.gray700} />
          </TouchableOpacity>
          <PrimaryHeading style={styles.title}>{isEditing ? 'Edit Block' : 'New Block'}</PrimaryHeading>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormInput label="Block Name / ब्लॉक का नाम *" value={form.name} onChangeText={(t) => updateField('name', t)} error={errors.name} />

          {/* Variety Selector */}
          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Variety / किस्म</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              <TouchableOpacity style={[styles.chip, !form.variety_id && styles.chipActive]} onPress={() => updateField('variety_id', undefined)} activeOpacity={0.8}>
                <Typography variant="caption" style={!form.variety_id ? styles.chipTextActive : styles.chipText}>None</Typography>
              </TouchableOpacity>
              {varieties.map((v) => (
                <TouchableOpacity key={v.id} style={[styles.chip, form.variety_id === v.id && styles.chipActive]} onPress={() => updateField('variety_id', v.id)} activeOpacity={0.8}>
                  <Typography variant="caption" style={form.variety_id === v.id ? styles.chipTextActive : styles.chipText}>{v.name_en}</Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <FormInput label="Area (kanal)" value={form.area_kanal?.toString() ?? ''} onChangeText={(t) => updateField('area_kanal', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />
            </View>
            <View style={styles.flex1}>
              <FormInput label="Plants" value={form.plant_count?.toString() ?? ''} onChangeText={(t) => updateField('plant_count', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <FormInput label="Tree Age (yrs)" value={form.tree_age_years?.toString() ?? ''} onChangeText={(t) => updateField('tree_age_years', t ? parseInt(t, 10) : undefined)} keyboardType="number-pad" />
            </View>
            <View style={styles.flex1}>
              <FormInput label="Spacing (m)" value={form.spacing_meters ?? ''} onChangeText={(t) => updateField('spacing_meters', t || undefined)} />
            </View>
          </View>

          <FormInput label="Soil pH" value={form.soil_ph?.toString() ?? ''} onChangeText={(t) => updateField('soil_ph', t ? parseFloat(t) : undefined)} keyboardType="decimal-pad" />

          <FormSelect label="Soil Type / मिट्टी का प्रकार" value={form.soil_type ?? ''} options={SOIL_TYPES} onChange={(v) => updateField('soil_type', v as any)} nullable />
          <FormSelect label="Aspect / दिशा" value={form.aspect ?? ''} options={ASPECTS} onChange={(v) => updateField('aspect', v as any)} nullable />
          <FormSelect label="Wind Exposure / हवा का संपर्क" value={form.wind_exposure ?? ''} options={WIND_EXPOSURES} onChange={(v) => updateField('wind_exposure', v as any)} nullable />
          <FormSelect label="Frost Risk / पाला जोखिम" value={form.frost_pocket_risk ?? ''} options={FROST_RISKS} onChange={(v) => updateField('frost_pocket_risk', v as any)} nullable />

          <FormToggle label="Sunny Exposure / धूप वाला" value={!!form.is_sunny_exposure} onToggle={() => updateField('is_sunny_exposure', !form.is_sunny_exposure)} />

          <TouchableOpacity style={[styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            {saving ? <ActivityIndicator color={Colors.white} /> : <Typography variant="button" style={styles.saveButtonText}>{isEditing ? 'Save / सहेजें' : 'Create / बनाएं'}</Typography>}
          </TouchableOpacity>
        </ScrollView>
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 26, marginTop: 8 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
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
  errorText: { color: Colors.danger, marginTop: 2, fontSize: 12 },
  rowInputs: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 2 },
  chip: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
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
