/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — GROUP CREATE SCREEN
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography, HindiText } from '../typography';
import { showToast } from '../store/toastStore';
import type { HomeNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { createGroup } from '../services/groupApi';
import { launchImageLibrary } from 'react-native-image-picker';

export default function GroupCreateScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeNavigationProp>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [cover, setCover] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [avatar, setAvatar] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [rules, setRules] = useState<{ title: string; body: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const pickImage = (type: 'cover' | 'avatar') => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets?.[0]) {
        const a = response.assets[0];
        const img = { uri: a.uri!, type: a.type ?? 'image/jpeg', name: a.fileName ?? `group_${type}_${Date.now()}.jpg` };
        if (type === 'cover') setCover(img);
        else setAvatar(img);
      }
    });
  };

  const addRule = () => {
    setRules(prev => [...prev, { title: '', body: '' }]);
  };

  const updateRule = (index: number, field: 'title' | 'body', value: string) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showToast('Group name is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const group = await createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
        cover: cover || undefined,
        avatar: avatar || undefined,
        rules: rules.filter(r => r.title.trim()).length > 0 ? rules.filter(r => r.title.trim()) : undefined,
      });
      showToast('Group created!', 'success');
      navigation.replace('GroupDetail', { slug: group.slug });
    } catch (err: any) {
      console.error('[GroupCreate] failed:', err.response?.data ?? err.message);
      showToast(err.response?.data?.message || 'Failed to create group', 'error');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
            <Icon name="arrow-left" size={24} color={Colors.gray800} />
          </TouchableOpacity>
          <Typography variant="body" style={styles.headerTitle}>Create Group / समूह बनाएं</Typography>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? <ActivityIndicator size="small" color={Colors.white} /> : <Typography variant="caption" style={styles.saveBtnText}>Save</Typography>}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Basic Info / मूल जानकारी</Typography>
            <FormField label="Group Name / समूह का नाम *" value={name} onChangeText={setName} icon="account-group-outline" />
            <FormField label="Description / विवरण" value={description} onChangeText={setDescription} icon="text-box-outline" multiline />
          </View>

          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Visibility / दृश्यता</Typography>
            <View style={styles.visibilityRow}>
              <VisibilityPill label="Public / सार्वजनिक" icon="earth" active={visibility === 'public'} onPress={() => setVisibility('public')} />
              <VisibilityPill label="Private / निजी" icon="lock-outline" active={visibility === 'private'} onPress={() => setVisibility('private')} />
            </View>
          </View>

          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Images / छवियां</Typography>
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('cover')} activeOpacity={0.8}>
              <Icon name="image-outline" size={24} color={Colors.primary} />
              <Typography variant="caption" style={styles.imagePickerText}>
                {cover ? 'Cover selected / कवर चुना गया' : 'Pick Cover / कवर छवि चुनें'}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('avatar')} activeOpacity={0.8}>
              <Icon name="image-outline" size={24} color={Colors.primary} />
              <Typography variant="caption" style={styles.imagePickerText}>
                {avatar ? 'Avatar selected / अवतार चुना गया' : 'Pick Avatar / अवतार छवि चुनें'}
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.rulesHeader}>
              <Typography variant="body" style={styles.sectionTitle}>Rules / नियम</Typography>
              <TouchableOpacity style={styles.addRuleBtn} onPress={addRule} activeOpacity={0.8}>
                <Icon name="plus" size={16} color={Colors.primary} />
                <Typography variant="caption" style={styles.addRuleText}>Add</Typography>
              </TouchableOpacity>
            </View>
            {rules.map((rule, idx) => (
              <View key={idx} style={styles.ruleInputWrap}>
                <TextInput
                  style={styles.ruleInput}
                  placeholder="Rule title / नियम का शीर्षक"
                  placeholderTextColor={Colors.gray400}
                  value={rule.title}
                  onChangeText={(text) => updateRule(idx, 'title', text)}
                />
                <TextInput
                  style={[styles.ruleInput, { minHeight: 60 }]}
                  placeholder="Description (optional) / विवरण (वैकल्पिक)"
                  placeholderTextColor={Colors.gray400}
                  value={rule.body}
                  onChangeText={(text) => updateRule(idx, 'body', text)}
                  multiline
                />
                <TouchableOpacity onPress={() => removeRule(idx)} style={styles.removeRuleBtn}>
                  <Icon name="trash-can-outline" size={16} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, value, onChangeText, icon, multiline }: {
  label: string; value: string; onChangeText: (t: string) => void; icon: string; multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Typography variant="caption" style={styles.fieldLabel}>{label}</Typography>
      <View style={styles.inputWrap}>
        <Icon name={icon} size={18} color={Colors.gray400} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.gray400}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

function VisibilityPill({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.visPill, active && styles.visPillActive]} onPress={onPress} activeOpacity={0.8}>
      <Icon name={icon} size={18} color={active ? Colors.primary : Colors.gray500} />
      <Typography variant="caption" style={[styles.visPillText, active && styles.visPillTextActive]}>{label}</Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space[4], paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100, backgroundColor: Colors.surface,
  },
  headerBtn: { padding: 4, width: 40, alignItems: 'center' },
  headerTitle: { fontWeight: '700', fontSize: 16 },
  saveBtn: { backgroundColor: Colors.primary, paddingHorizontal: Space[4], paddingVertical: 6, borderRadius: Radius.md },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  scrollContent: { padding: Space[4], gap: Space[4] },
  card: { backgroundColor: Colors.surface, borderRadius: Radius['2xl'], padding: Space[4], ...Shadows.medium },
  sectionTitle: { fontWeight: '800', fontSize: 15, color: Colors.gray900, marginBottom: Space[3] },
  fieldWrap: { marginBottom: Space[3] },
  fieldLabel: { fontWeight: '600', color: Colors.gray600, marginBottom: 6, fontSize: 12 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: 'transparent', paddingHorizontal: Space[3],
  },
  inputIcon: { marginRight: Space[2] },
  input: { flex: 1, fontSize: 15, color: Colors.gray800, paddingVertical: Space[3], minHeight: 48 },
  visibilityRow: { flexDirection: 'row', gap: Space[3] },
  visPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center',
    paddingVertical: Space[3], borderRadius: Radius.md, backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  visPillActive: { backgroundColor: Colors.primary + '12', borderColor: Colors.primary + '40' },
  visPillText: { fontWeight: '600', color: Colors.gray600 },
  visPillTextActive: { color: Colors.primary, fontWeight: '700' },
  imagePicker: {
    flexDirection: 'row', alignItems: 'center', gap: Space[2],
    backgroundColor: Colors.surfaceSubtle, padding: Space[3],
    borderRadius: Radius.lg, marginBottom: Space[2],
  },
  imagePickerText: { color: Colors.primary, fontWeight: '600' },
  rulesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Space[2] },
  addRuleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary + '10', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.md },
  addRuleText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  ruleInputWrap: { marginBottom: Space[3], position: 'relative' },
  ruleInput: {
    backgroundColor: Colors.surfaceSubtle, borderRadius: Radius.lg,
    paddingHorizontal: Space[3], paddingVertical: 10,
    fontSize: 14, color: Colors.gray800, marginBottom: Space[2],
  },
  removeRuleBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: Colors.danger + '10', padding: 6, borderRadius: Radius.full },
});
