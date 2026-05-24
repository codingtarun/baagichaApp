/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD VARIETY FORM SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Add or edit a variety linked to an orchard.
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
import {
  createOrchardVariety,
  updateOrchardVariety,
  fetchOrchardVarieties,
  type CreateOrchardVarietyRequest,
} from '../services/orchardApi';
import { fetchVarieties, type VarietyListItem } from '../services/varietyApi';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'OrchardVarietyForm'>;

export default function OrchardVarietyFormScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { orchardId, varietyId } = route.params ?? {};
  const isEditing = !!varietyId;

  const [form, setForm] = useState<CreateOrchardVarietyRequest>({
    variety_id: 0,
  });
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
    if (!varietyId || !orchardId) return;
    fetchOrchardVarieties(orchardId)
      .then((res) => {
        const variety = res.data.find((v) => v.id === varietyId);
        if (variety) {
          setForm({
            variety_id: variety.variety_id,
            variety_name_custom: variety.variety_name_custom ?? undefined,
            is_primary_variety: variety.is_primary_variety,
            num_trees: variety.num_trees ?? undefined,
            tree_age_years: variety.tree_age_years ?? undefined,
            rootstock: variety.rootstock ?? undefined,
            planted_year: variety.planted_year ?? undefined,
            notes: variety.notes ?? undefined,
          });
        }
      })
      .catch(() => showToast('Failed to load variety', 'error'))
      .finally(() => setLoading(false));
  }, [orchardId, varietyId]);

  const updateField = useCallback(<K extends keyof CreateOrchardVarietyRequest>(field: K, value: CreateOrchardVarietyRequest[K]) => {
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
      if (isEditing && varietyId && orchardId) {
        await updateOrchardVariety(orchardId, varietyId, form);
        showToast('Variety updated', 'success');
      } else if (orchardId) {
        await createOrchardVariety(orchardId, form);
        showToast('Variety added', 'success');
      }
      navigation.goBack();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        showToast('Please fix the errors', 'warning');
      } else {
        showToast(err?.response?.data?.message ?? 'Failed to save variety', 'error');
      }
    } finally {
      setSaving(false);
    }
  }, [form, isEditing, orchardId, varietyId, navigation]);

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
          <PrimaryHeading style={styles.title}>{isEditing ? 'Edit Variety' : 'Add Variety'}</PrimaryHeading>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Variety Selector */}
          <View style={styles.inputGroup}>
            <Typography variant="label" style={styles.label}>Variety / किस्म *</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {varieties.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.chip, form.variety_id === v.id && styles.chipActive]}
                  onPress={() => updateField('variety_id', v.id)}
                  activeOpacity={0.8}
                >
                  <Typography variant="caption" style={form.variety_id === v.id ? styles.chipTextActive : styles.chipText}>
                    {v.name_en}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.variety_id?.map((err, i) => (
              <Typography key={i} variant="caption" style={styles.errorText}>{err}</Typography>
            ))}
          </View>

          <FormInput
            label="Custom Name (optional) / कस्टम नाम"
            value={form.variety_name_custom ?? ''}
            onChangeText={(t) => updateField('variety_name_custom', t || undefined)}
          />

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <FormInput
                label="Trees / पेड़"
                value={form.num_trees?.toString() ?? ''}
                onChangeText={(t) => updateField('num_trees', t ? parseInt(t, 10) : undefined)}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.flex1}>
              <FormInput
                label="Age (yrs) / उम्र"
                value={form.tree_age_years?.toString() ?? ''}
                onChangeText={(t) => updateField('tree_age_years', t ? parseInt(t, 10) : undefined)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.flex1}>
              <FormInput
                label="Planted Year / रोपण वर्ष"
                value={form.planted_year?.toString() ?? ''}
                onChangeText={(t) => updateField('planted_year', t ? parseInt(t, 10) : undefined)}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.flex1}>
              <FormInput
                label="Rootstock / रूटस्टॉक"
                value={form.rootstock ?? ''}
                onChangeText={(t) => updateField('rootstock', t || undefined)}
              />
            </View>
          </View>

          <FormToggle
            label="Primary Variety / मुख्य किस्म"
            value={!!form.is_primary_variety}
            onToggle={() => updateField('is_primary_variety', !form.is_primary_variety)}
          />

          <FormInput
            label="Notes / नोट्स"
            value={form.notes ?? ''}
            onChangeText={(t) => updateField('notes', t || undefined)}
            multiline
          />

          <TouchableOpacity style={[styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Typography variant="button" style={styles.saveButtonText}>
                {isEditing ? 'Save / सहेजें' : 'Add / जोड़ें'}
              </Typography>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormInput({ label, value, onChangeText, error, keyboardType, multiline }: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string[];
  keyboardType?: 'default' | 'number-pad';
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
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
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
