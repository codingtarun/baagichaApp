/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — REPORT COMPOSER SHEET
 * ═══════════════════════════════════════════════════════════════
 *
 * Bottom sheet for submitting community event reports.
 *   - Select event type (with urgency color coding)
 *   - Disease picker (for disease/pest reports)
 *   - Auto-captured GPS location
 *   - Optional notes + photo
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { fetchReportTypes, createReportPost, type ReportType, type DiseasePickerItem } from '../services/reportApi';
import type { FeedPost } from '../services/postApi';

interface ReportComposerSheetProps {
  visible: boolean;
  onClose: () => void;
  onReportSubmitted: (post: FeedPost) => void;
}

function urgencyColor(level: string): string {
  switch (level) {
    case 'critical': return Colors.danger;
    case 'high': return Colors.sevHigh;
    case 'medium': return Colors.warning;
    case 'low': return Colors.success;
    default: return Colors.gray500;
  }
}

export default function ReportComposerSheet({ visible, onClose, onReportSubmitted }: ReportComposerSheetProps): React.JSX.Element {
  const { location, loading: locationLoading, getLocation } = useCurrentLocation();

  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [diseases, setDiseases] = useState<DiseasePickerItem[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<DiseasePickerItem | null>(null);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch report types when sheet opens
  useEffect(() => {
    if (!visible) return;

    setLoadingTypes(true);
    fetchReportTypes()
      .then((data) => {
        setReportTypes(data.report_types);
        setDiseases(data.diseases);
      })
      .catch((err) => {
        console.error('[ReportComposer] Failed to fetch types:', err);
        showToast('Failed to load report types', 'error');
      })
      .finally(() => setLoadingTypes(false));

    // Reset state
    setSelectedType(null);
    setSelectedDisease(null);
    setNotes('');
    setPhoto(null);
  }, [visible]);

  // Auto-fetch location when sheet opens
  useEffect(() => {
    if (visible) {
      getLocation();
    }
  }, [visible, getLocation]);

  const handlePickPhoto = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.assets?.[0]?.uri) {
        const a = response.assets[0];
        setPhoto({
          uri: a.uri!,
          type: a.type ?? 'image/jpeg',
          name: a.fileName ?? `report_${Date.now()}.jpg`,
        });
      }
    });
  }, []);

  const handleSubmit = async () => {
    if (!selectedType) {
      showToast('Please select an event type', 'warning');
      return;
    }
    if (!location) {
      showToast('Location is required. Please enable GPS.', 'warning');
      return;
    }
    if (selectedType.category === 'disease' && !selectedDisease) {
      showToast('Please select a disease', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const post = await createReportPost({
        report_type_id: selectedType.id,
        latitude: location.latitude,
        longitude: location.longitude,
        disease_id: selectedDisease?.id,
        body: notes.trim(),
        images: photo ? [photo] : undefined,
      });

      showToast('Report submitted successfully!', 'success');
      onReportSubmitted(post);
      onClose();
    } catch (err: any) {
      console.error('[ReportComposer] Submit failed:', err.response?.data ?? err.message);
      showToast('Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = selectedType && location && !submitting && !(selectedType.category === 'disease' && !selectedDisease);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Icon name="close" size={22} color={Colors.gray600} />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Icon name="alert-circle" size={24} color={Colors.danger} />
            <Typography variant="body" style={styles.headerTitle}>Report an Event</Typography>
            <Typography variant="captionMuted">रिपोर्ट करें</Typography>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Event Type Selection */}
            <View style={styles.section}>
              <Typography variant="caption" style={styles.sectionLabel}>Select Event Type *</Typography>
              {loadingTypes ? (
                <ActivityIndicator color={Colors.primary} style={{ marginVertical: 20 }} />
              ) : (
                <View style={styles.typeGrid}>
                  {reportTypes.map((rt) => (
                    <TouchableOpacity
                      key={rt.id}
                      style={[
                        styles.typeChip,
                        selectedType?.id === rt.id && { borderColor: urgencyColor(rt.urgency_level), backgroundColor: urgencyColor(rt.urgency_level) + '12' },
                      ]}
                      onPress={() => {
                        setSelectedType(rt);
                        setSelectedDisease(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.urgencyDot, { backgroundColor: urgencyColor(rt.urgency_level) }]} />
                      <Icon name={rt.icon ?? 'alert'} size={16} color={urgencyColor(rt.urgency_level)} />
                      <Typography variant="caption" style={styles.typeChipText}>{rt.name_en}</Typography>
                      <Typography variant="captionMuted" style={styles.typeChipHi}>{rt.name_hi}</Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Disease Picker */}
            {selectedType?.category === 'disease' && (
              <View style={styles.section}>
                <Typography variant="caption" style={styles.sectionLabel}>Select Disease / Pest *</Typography>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.diseaseScroll}>
                  {diseases.map((d) => (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.diseaseChip,
                        selectedDisease?.id === d.id && styles.diseaseChipSelected,
                      ]}
                      onPress={() => setSelectedDisease(d)}
                      activeOpacity={0.7}
                    >
                      <Typography variant="caption" style={[styles.diseaseText, selectedDisease?.id === d.id && { color: Colors.primary, fontWeight: '700' }]}>
                        {d.name_en}
                      </Typography>
                      {d.name_hi && (
                        <Typography variant="captionMuted" style={{ fontSize: 10 }}>{d.name_hi}</Typography>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Location */}
            <View style={styles.section}>
              <Typography variant="caption" style={styles.sectionLabel}>Location *</Typography>
              <View style={styles.locationBox}>
                <Icon name="map-marker" size={18} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  {locationLoading ? (
                    <Typography variant="captionMuted">Fetching location...</Typography>
                  ) : location ? (
                    <>
                      <Typography variant="caption" style={styles.locationName}>{location.name}</Typography>
                      <Typography variant="captionMuted">{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</Typography>
                    </>
                  ) : (
                    <Typography variant="captionMuted">Location unavailable</Typography>
                  )}
                </View>
                <TouchableOpacity onPress={getLocation} disabled={locationLoading} activeOpacity={0.7}>
                  <Icon name="refresh" size={18} color={locationLoading ? Colors.gray300 : Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Weather Note */}
            <View style={styles.section}>
              <Typography variant="caption" style={styles.sectionLabel}>Weather</Typography>
              <View style={styles.weatherBox}>
                <Icon name="cloud-check" size={18} color={Colors.info} />
                <Typography variant="captionMuted" style={{ flex: 1, marginLeft: 8 }}>
                  Current weather will be auto-attached from your location.
                </Typography>
              </View>
            </View>

            {/* Optional Notes */}
            <View style={styles.section}>
              <Typography variant="caption" style={styles.sectionLabel}>Additional Notes</Typography>
              <TextInput
                style={styles.notesInput}
                placeholder="Any extra details..."
                placeholderTextColor={Colors.gray400}
                value={notes}
                onChangeText={setNotes}
                multiline
                maxLength={200}
              />
              <Typography variant="captionMuted" style={styles.charCount}>{notes.length}/200</Typography>
            </View>

            {/* Optional Photo */}
            <View style={styles.section}>
              <Typography variant="caption" style={styles.sectionLabel}>Photo (optional)</Typography>
              {photo ? (
                <View style={styles.photoWrap}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <TouchableOpacity style={styles.removePhoto} onPress={() => setPhoto(null)} activeOpacity={0.7}>
                    <Icon name="close-circle" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.photoBtn} onPress={handlePickPhoto} activeOpacity={0.7}>
                  <Icon name="camera-plus" size={24} color={Colors.primary} />
                  <Typography variant="caption" style={{ color: Colors.primary }}>Add Photo</Typography>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Submit */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Typography variant="body" style={styles.submitBtnText}>Submit Report</Typography>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    maxHeight: '90%',
    ...Shadows.strong,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Space[3],
    paddingHorizontal: Space[4],
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray300,
  },
  closeBtn: {
    position: 'absolute',
    right: Space[4],
    top: Space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
    paddingHorizontal: Space[4],
    paddingTop: Space[3],
    paddingBottom: Space[2],
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: Colors.gray900,
  },
  scrollContent: {
    paddingHorizontal: Space[4],
    paddingBottom: Space[4],
  },
  section: {
    marginTop: Space[4],
  },
  sectionLabel: {
    fontWeight: '700',
    color: Colors.gray700,
    marginBottom: Space[2],
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space[2],
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Space[3],
    paddingVertical: Space[2],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    minWidth: 100,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray800,
  },
  typeChipHi: {
    fontSize: 10,
    marginLeft: 2,
  },
  diseaseScroll: {
    gap: Space[2],
  },
  diseaseChip: {
    paddingHorizontal: Space[3],
    paddingVertical: Space[2],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  diseaseChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  diseaseText: {
    fontSize: 12,
    color: Colors.gray700,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[3],
    backgroundColor: Colors.primary50,
    borderRadius: Radius.lg,
    padding: Space[3],
  },
  locationName: {
    fontWeight: '700',
    color: Colors.gray800,
  },
  weatherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.infoLight,
    borderRadius: Radius.lg,
    padding: Space[3],
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
    padding: Space[3],
    fontSize: 14,
    color: Colors.gray900,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: Space[1],
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space[2],
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    paddingVertical: Space[4],
  },
  photoWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: Radius.lg,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: Radius.full,
  },
  footer: {
    padding: Space[4],
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  submitBtn: {
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
});
