/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — STORY COMPOSER (Bottom Sheet)
 * ═══════════════════════════════════════════════════════════════
 *
 * Instagram-style bottom sheet for creating stories.
 * Options: Camera, Gallery, Text.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { Colors } from '../theme/colors';
import { Space, Radius, Shadows } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string, type: string) => void;
  onVideoSelected: (uri: string, type: string) => void;
  onTextSelected: () => void;
}

const SCREEN_H = Dimensions.get('window').height;

export default function StoryComposer({ visible, onClose, onImageSelected, onVideoSelected, onTextSelected }: Props): React.JSX.Element {
  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'mixed',
        saveToPhotos: true,
        quality: 0.9,
        videoQuality: 'medium',
        durationLimit: 60,
      },
      (response) => {
        onClose();
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (!asset) return;

        if (asset.type?.startsWith('video')) {
          onVideoSelected(asset.uri!, asset.type);
        } else {
          onImageSelected(asset.uri!, asset.type || 'image/jpeg');
        }
      }
    );
  };

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        quality: 0.9,
        selectionLimit: 1,
      },
      (response) => {
        onClose();
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (!asset) return;

        if (asset.type?.startsWith('video')) {
          onVideoSelected(asset.uri!, asset.type);
        } else {
          onImageSelected(asset.uri!, asset.type || 'image/jpeg');
        }
      }
    );
  };

  const options = [
    { icon: 'camera', label: 'Camera', color: Colors.primary, onPress: handleCamera },
    { icon: 'image', label: 'Gallery', color: Colors.info, onPress: handleGallery },
    { icon: 'format-text', label: 'Text', color: Colors.warning, onPress: () => { onClose(); onTextSelected(); } },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />
          <Typography variant="body" style={styles.title}>Add to Story</Typography>

          <View style={styles.optionsRow}>
            {options.map((opt) => (
              <TouchableOpacity key={opt.label} style={styles.option} onPress={opt.onPress} activeOpacity={0.7}>
                <View style={[styles.optionIcon, { backgroundColor: opt.color + '18' }]}>
                  <Icon name={opt.icon} size={28} color={opt.color} />
                </View>
                <Typography variant="caption" style={styles.optionLabel}>{opt.label}</Typography>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Typography variant="body" style={styles.cancelText}>Cancel</Typography>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Space[4],
    paddingTop: Space[3],
    paddingBottom: Space[6],
    ...Shadows.strong,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Space[4],
  },
  title: {
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Space[4],
    color: Colors.gray900,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Space[6],
  },
  option: {
    alignItems: 'center',
    gap: Space[2],
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontWeight: '600',
    color: Colors.gray700,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Space[3],
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  cancelText: {
    fontWeight: '700',
    color: Colors.gray500,
  },
});
