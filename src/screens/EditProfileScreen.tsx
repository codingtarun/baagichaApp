/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — EDIT PROFILE SCREEN
 * ═══════════════════════════════════════════════════════════════
 *
 * Allows the logged-in user to update their profile information.
 */

import React, { useState, useCallback } from 'react';
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
import { useAuthStore } from '../store/authStore';
import { updateProfile, type UpdateProfileRequest } from '../services/authApi';
import type { MyOrchardNavigationProp } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<MyOrchardNavigationProp>();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [village, setVillage] = useState(user?.profile?.village ?? '');
  const [district, setDistrict] = useState(user?.profile?.district ?? '');
  const [state, setState] = useState(user?.profile?.state ?? '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>(
    (user?.preferred_language as 'en' | 'hi') ?? 'en'
  );
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      showToast('Name is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateProfileRequest = {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        village: village.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        preferred_language: preferredLanguage,
      };

      const response = await updateProfile(payload);
      if (response.success && response.data.user) {
        updateUser(response.data.user);
        showToast('Profile updated successfully!', 'success');
        navigation.goBack();
      } else {
        showToast(response.message || 'Update failed', 'error');
      }
    } catch (err: any) {
      console.error('[EditProfile] Save failed:', err.response?.data ?? err.message);
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  }, [name, email, phone, village, district, state, preferredLanguage, updateUser, navigation]);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <Typography variant="captionMuted">Please sign in to edit your profile</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.headerBtn}>
            <Icon name="arrow-left" size={24} color={Colors.gray800} />
          </TouchableOpacity>
          <Typography variant="body" style={styles.headerTitle}>Edit Profile</Typography>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Typography variant="caption" style={styles.saveBtnText}>Save</Typography>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Personal Information</Typography>
            <HindiText style={styles.sectionTitleHi}>व्यक्तिगत जानकारी</HindiText>

            <FormField label="Full Name / पूरा नाम" value={name} onChangeText={setName} icon="account-outline" />
            <FormField label="Email / ईमेल" value={email} onChangeText={setEmail} icon="email-outline" keyboardType="email-address" autoCapitalize="none" />
            <FormField label="Phone / फ़ोन" value={phone} onChangeText={setPhone} icon="phone-outline" keyboardType="phone-pad" />
          </View>

          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Location</Typography>
            <HindiText style={styles.sectionTitleHi}>स्थान</HindiText>

            <FormField label="Village / गाँव" value={village} onChangeText={setVillage} icon="home-outline" />
            <FormField label="District / जिला" value={district} onChangeText={setDistrict} icon="map-marker-outline" />
            <FormField label="State / राज्य" value={state} onChangeText={setState} icon="map-outline" />
          </View>

          <View style={styles.card}>
            <Typography variant="body" style={styles.sectionTitle}>Preferences</Typography>
            <HindiText style={styles.sectionTitleHi}>प्राथमिकताएँ</HindiText>

            <Typography variant="caption" style={styles.fieldLabel}>Preferred Language / पसंदीदा भाषा</Typography>
            <View style={styles.langRow}>
              <LangPill
                label="English"
                active={preferredLanguage === 'en'}
                onPress={() => setPreferredLanguage('en')}
              />
              <LangPill
                label="हिन्दी"
                active={preferredLanguage === 'hi'}
                onPress={() => setPreferredLanguage('hi')}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FormField({
  label,
  value,
  onChangeText,
  icon,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Typography variant="caption" style={styles.fieldLabel}>{label}</Typography>
      <View style={styles.inputWrap}>
        <Icon name={icon} size={18} color={Colors.gray400} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          placeholderTextColor={Colors.gray400}
        />
      </View>
    </View>
  );
}

function LangPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.langPill, active && styles.langPillActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Typography variant="caption" style={[styles.langPillText, active && styles.langPillTextActive]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[4],
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    backgroundColor: Colors.surface,
  },
  headerBtn: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Space[4],
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: Space[4],
    gap: Space[4],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Space[4],
    ...Shadows.medium,
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.gray900,
  },
  sectionTitleHi: {
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
    marginBottom: Space[3],
  },
  fieldWrap: {
    marginBottom: Space[3],
  },
  fieldLabel: {
    fontWeight: '600',
    color: Colors.gray600,
    marginBottom: 6,
    fontSize: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: Space[3],
  },
  inputIcon: {
    marginRight: Space[2],
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.gray800,
    paddingVertical: Space[3],
    minHeight: 48,
  },
  langRow: {
    flexDirection: 'row',
    gap: Space[3],
    marginTop: Space[2],
  },
  langPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Space[3],
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  langPillActive: {
    backgroundColor: Colors.primary + '12',
    borderColor: Colors.primary + '40',
  },
  langPillText: {
    fontWeight: '600',
    color: Colors.gray600,
  },
  langPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
