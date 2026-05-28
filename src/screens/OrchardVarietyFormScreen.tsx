/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — ORCHARD VARIETY FORM SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Add or edit varieties linked to an orchard.
 *
 * ADD mode (bulk):
 *   - Pick ONE or MORE varieties via checkboxes
 *   - For each selected variety, pick ONE or MORE rootstocks
 *   - Creates one orchard_variety record per variety-rootstock pair
 *   - Optional fields (custom name, trees, year, notes) apply to all
 *
 * EDIT mode:
 *   - Variety shown read-only
 *   - Single rootstock select (editing one record)
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
import { fetchRootstocks, type RootstockListItem } from '../services/rootstockApi';
import type { MyOrchardStackParamList } from '../navigation/stacks/MyOrchardStack';

type NavProp = NativeStackNavigationProp<MyOrchardStackParamList>;
type RouteProps = RouteProp<MyOrchardStackParamList, 'OrchardVarietyForm'>;

interface VarietySelection {
  variety_id: number;
  rootstock_ids: number[];
}

export default function OrchardVarietyFormScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { orchardId, varietyId } = route.params ?? {};
  const isEditing = !!varietyId;

  const [varieties, setVarieties] = useState<VarietyListItem[]>([]);
  const [rootstocks, setRootstocks] = useState<RootstockListItem[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Bulk add state
  const [selections, setSelections] = useState<VarietySelection[]>([]);

  // Optional fields applied to all created records
  const [optionalFields, setOptionalFields] = useState<{
    variety_name_custom?: string;
    num_trees?: number;
    planted_year?: number;
    notes?: string;
  }>({});

  // Edit mode single-record state
  const [editForm, setEditForm] = useState<CreateOrchardVarietyRequest>({
    variety_id: 0,
    rootstock_id: 0,
  });

  useEffect(() => {
    fetchVarieties({ per_page: 100 })
      .then((res) => setVarieties(res.data))
      .catch(() => showToast('Failed to load varieties', 'error'));

    fetchRootstocks({ per_page: 100 })
      .then((res) => setRootstocks(res.data))
      .catch(() => showToast('Failed to load rootstocks', 'error'));
  }, []);

  useEffect(() => {
    if (!varietyId || !orchardId) return;
    fetchOrchardVarieties(orchardId)
      .then((res) => {
        const variety = res.data.find((v) => v.id === varietyId);
        if (variety) {
          setEditForm({
            variety_id: variety.variety_id,
            variety_name_custom: variety.variety_name_custom ?? undefined,
            num_trees: variety.num_trees ?? undefined,
            rootstock_id: variety.rootstock_id,
            planted_year: variety.planted_year ?? undefined,
            notes: variety.notes ?? undefined,
          });
        }
      })
      .catch(() => showToast('Failed to load variety', 'error'))
      .finally(() => setLoading(false));
  }, [orchardId, varietyId]);

  const toggleVariety = useCallback((varietyId: number) => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.variety_id === varietyId);
      if (exists) {
        return prev.filter((s) => s.variety_id !== varietyId);
      }
      return [...prev, { variety_id: varietyId, rootstock_ids: [] }];
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.selections;
      return next;
    });
  }, []);

  const toggleRootstock = useCallback((varietyId: number, rootstockId: number) => {
    setSelections((prev) =>
      prev.map((s) => {
        if (s.variety_id !== varietyId) return s;
        const has = s.rootstock_ids.includes(rootstockId);
        return {
          ...s,
          rootstock_ids: has
            ? s.rootstock_ids.filter((id) => id !== rootstockId)
            : [...s.rootstock_ids, rootstockId],
        };
      })
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next.selections;
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (isEditing) {
      if (!editForm.variety_id) {
        showToast('Please select a variety', 'warning');
        return;
      }
      if (!editForm.rootstock_id) {
        showToast('Please select a rootstock', 'warning');
        return;
      }
      setSaving(true);
      try {
        await updateOrchardVariety(orchardId!, varietyId!, editForm);
        showToast('Variety updated', 'success');
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
      return;
    }

    // Bulk add validation
    if (selections.length === 0) {
      setErrors({ selections: ['Please select at least one variety'] });
      showToast('Please select at least one variety', 'warning');
      return;
    }
    const incomplete = selections.filter((s) => s.rootstock_ids.length === 0);
    if (incomplete.length > 0) {
      setErrors({ selections: ['Please select at least one rootstock for each variety'] });
      showToast('Please select at least one rootstock for each variety', 'warning');
      return;
    }

    setSaving(true);
    setErrors({});

    const results: Awaited<ReturnType<typeof createOrchardVariety>>[] = [];
    const failMessages: string[] = [];

    for (const sel of selections) {
      for (const rootstockId of sel.rootstock_ids) {
        try {
          const res = await createOrchardVariety(orchardId!, {
            variety_id: sel.variety_id,
            rootstock_id: rootstockId,
            variety_name_custom: optionalFields.variety_name_custom || undefined,
            num_trees: optionalFields.num_trees || undefined,
            planted_year: optionalFields.planted_year || undefined,
            notes: optionalFields.notes || undefined,
          });
          results.push(res);
        } catch (err: any) {
          const varietyName = varieties.find((v) => v.id === sel.variety_id)?.name_en ?? 'Unknown';
          const rootstockName = rootstocks.find((r) => r.id === rootstockId)?.name ?? 'Unknown';
          failMessages.push(`${varietyName} / ${rootstockName}`);
        }
      }
    }

    setSaving(false);

    if (failMessages.length > 0 && results.length === 0) {
      showToast('Failed to add any varieties', 'error');
    } else if (failMessages.length > 0) {
      showToast(`Added ${results.length}, ${failMessages.length} failed`, 'warning');
      navigation.goBack();
    } else {
      showToast(`Added ${results.length} variety-rootstock pairs`, 'success');
      navigation.goBack();
    }
  }, [isEditing, editForm, selections, optionalFields, orchardId, varietyId, navigation, varieties, rootstocks]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Icon name="arrow-left" size={24} color={Colors.gray700} />
            </TouchableOpacity>
            <PrimaryHeading style={styles.title}>{isEditing ? 'Edit Variety' : 'Add Varieties'}</PrimaryHeading>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {isEditing ? (
              <>
                {/* Edit Mode: Single variety + rootstock */}
                <View style={styles.inputGroup}>
                  <Typography variant="label" style={styles.label}>Variety / किस्म *</Typography>
                  <View style={styles.readOnlyChip}>
                    <Typography variant="body" style={styles.readOnlyChipText}>
                      {varieties.find((v) => v.id === editForm.variety_id)?.name_en ?? 'Unknown'}
                    </Typography>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Typography variant="label" style={styles.label}>Rootstock / रूटस्टॉक *</Typography>
                  <View style={styles.chipRowWrap}>
                    {rootstocks.map((rs) => {
                      const isSelected = editForm.rootstock_id === rs.id;
                      return (
                        <TouchableOpacity
                          key={rs.id}
                          style={[styles.chip, isSelected && styles.chipActive]}
                          onPress={() => setEditForm((prev) => ({ ...prev, rootstock_id: rs.id }))}
                          activeOpacity={0.8}
                        >
                          <Typography variant="caption" style={isSelected ? styles.chipTextActive : styles.chipText}>
                            {rs.name}
                          </Typography>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <FormInput
                  label="Custom Name (optional) / कस्टम नाम"
                  value={editForm.variety_name_custom ?? ''}
                  onChangeText={(t) => setEditForm((prev) => ({ ...prev, variety_name_custom: t || undefined }))}
                />
                <FormInput
                  label="Trees / पेड़"
                  value={editForm.num_trees?.toString() ?? ''}
                  onChangeText={(t) => setEditForm((prev) => ({ ...prev, num_trees: t ? parseInt(t, 10) : undefined }))}
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Planted Year / रोपण वर्ष"
                  value={editForm.planted_year?.toString() ?? ''}
                  onChangeText={(t) => setEditForm((prev) => ({ ...prev, planted_year: t ? parseInt(t, 10) : undefined }))}
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Notes / नोट्स"
                  value={editForm.notes ?? ''}
                  onChangeText={(t) => setEditForm((prev) => ({ ...prev, notes: t || undefined }))}
                  multiline
                />
              </>
            ) : (
              <>
                {/* Add Mode: Variety + Rootstock cards */}
                <View style={styles.inputGroup}>
                  <Typography variant="label" style={styles.label}>Varieties & Rootstocks / किस्में और रूटस्टॉक *</Typography>
                  <Typography variant="captionMuted" style={styles.hint}>
                    Select varieties and choose one or more rootstocks for each
                  </Typography>

                  <View style={styles.checkboxList}>
                    {varieties.map((v) => {
                      const sel = selections.find((s) => s.variety_id === v.id);
                      const isSelected = !!sel;
                      return (
                        <View key={v.id} style={[styles.varietyCard, isSelected && styles.varietyCardSelected]}>
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
                            <View style={styles.rootstockWrap}>
                              <Typography variant="caption" style={styles.rootstockLabel}>Rootstocks:</Typography>
                              <View style={styles.chipRowWrap}>
                                {rootstocks.map((rs) => {
                                  const rsSelected = sel!.rootstock_ids.includes(rs.id);
                                  return (
                                    <TouchableOpacity
                                      key={rs.id}
                                      style={[styles.chip, rsSelected && styles.chipActive]}
                                      onPress={() => toggleRootstock(v.id, rs.id)}
                                      activeOpacity={0.8}
                                    >
                                      <Typography variant="caption" style={rsSelected ? styles.chipTextActive : styles.chipText}>
                                        {rs.name}
                                      </Typography>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  {errors.selections?.map((err, i) => (
                    <Typography key={i} variant="caption" style={styles.errorText}>{err}</Typography>
                  ))}
                </View>

                {/* Optional fields applied to all */}
                <View style={styles.divider} />
                <Typography variant="body" style={styles.sectionTitle}>Optional Details (applied to all)</Typography>

                <FormInput
                  label="Custom Name / कस्टम नाम"
                  value={optionalFields.variety_name_custom ?? ''}
                  onChangeText={(t) => setOptionalFields((prev) => ({ ...prev, variety_name_custom: t || undefined }))}
                />
                <FormInput
                  label="Trees (all entries) / पेड़"
                  value={optionalFields.num_trees?.toString() ?? ''}
                  onChangeText={(t) => setOptionalFields((prev) => ({ ...prev, num_trees: t ? parseInt(t, 10) : undefined }))}
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Planted Year / रोपण वर्ष"
                  value={optionalFields.planted_year?.toString() ?? ''}
                  onChangeText={(t) => setOptionalFields((prev) => ({ ...prev, planted_year: t ? parseInt(t, 10) : undefined }))}
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Notes / नोट्स"
                  value={optionalFields.notes ?? ''}
                  onChangeText={(t) => setOptionalFields((prev) => ({ ...prev, notes: t || undefined }))}
                  multiline
                />
              </>
            )}
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.saveButton, saving && styles.buttonDisabled]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
              {saving ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Typography variant="button" style={styles.saveButtonText}>
                  {isEditing ? 'Save / सहेजें' : 'Add / जोड़ें'}
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  hint: { marginBottom: 6, fontSize: 12 },
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.gray700, marginBottom: 10 },
  divider: { height: 1, backgroundColor: Colors.gray200, marginVertical: 16 },
  readOnlyChip: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignSelf: 'flex-start',
  },
  readOnlyChipText: { color: Colors.gray800, fontSize: 14, fontWeight: '600' },
  checkboxList: { gap: 8 },
  varietyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
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
  rootstockWrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  rootstockLabel: {
    color: Colors.gray600,
    fontSize: 12,
    marginBottom: 8,
  },
  chipRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.gray700, fontSize: 12 },
  chipTextActive: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 80,
    backgroundColor: Colors.gray50,
  },
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
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
