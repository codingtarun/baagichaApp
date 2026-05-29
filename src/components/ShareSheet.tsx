/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — SHARE SHEET
 * ═══════════════════════════════════════════════════════════════
 *
 * Bottom-sheet modal for sharing content.
 * Options: WhatsApp, Copy Link, More (native share)
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Clipboard,
  Share as NativeShare,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Space, Radius } from '../theme/style';
import { Typography } from '../typography';
import { showToast } from '../store/toastStore';

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  url?: string;
}

const SHARE_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', labelHi: 'व्हाट्सएप', icon: 'whatsapp', color: '#25D366' },
  { id: 'copy', label: 'Copy Link', labelHi: 'लिंक कॉपी करें', icon: 'link-variant', color: Colors.primary },
  { id: 'more', label: 'More', labelHi: 'और', icon: 'dots-horizontal', color: Colors.gray500 },
];

export default function ShareSheet({ visible, onClose, title, message, url }: ShareSheetProps): React.JSX.Element {
  const shareText = url ? `${message}\n${url}` : message;

  const handleWhatsApp = async () => {
    const encoded = encodeURIComponent(shareText);
    const waUrl = `whatsapp://send?text=${encoded}`;
    const canOpen = await Linking.canOpenURL(waUrl);
    if (canOpen) {
      await Linking.openURL(waUrl);
    } else {
      await Linking.openURL(`https://wa.me/?text=${encoded}`);
    }
    onClose();
  };

  const handleCopyLink = () => {
    Clipboard.setString(url || message);
    showToast('Link copied to clipboard', 'success');
    onClose();
  };

  const handleNativeShare = async () => {
    try {
      await NativeShare.share({
        title,
        message: shareText,
        url,
      });
    } catch {
      // User dismissed
    }
    onClose();
  };

  const handlers: Record<string, () => void> = {
    whatsapp: handleWhatsApp,
    copy: handleCopyLink,
    more: handleNativeShare,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Typography variant="body" style={styles.sheetTitle}>Share</Typography>
          <Typography variant="hindiBody" style={styles.sheetTitleHi}>साझा करें</Typography>

          <View style={styles.optionsRow}>
            {SHARE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.option}
                onPress={handlers[opt.id]}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIconWrap, { backgroundColor: opt.color + '12' }]}>
                  <Icon name={opt.icon} size={28} color={opt.color} />
                </View>
                <Typography variant="caption" style={styles.optionLabel}>{opt.label}</Typography>
                <Typography variant="hindiMicro" style={styles.optionLabelHi}>{opt.labelHi}</Typography>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Typography variant="body" style={styles.cancelText}>Cancel</Typography>
          </TouchableOpacity>
        </View>
      </Pressable>
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
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Space[3],
  },
  sheetTitle: {
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  sheetTitleHi: {
    textAlign: 'center',
    color: Colors.gray400,
    marginBottom: Space[4],
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Space[4],
  },
  option: {
    alignItems: 'center',
    width: 80,
  },
  optionIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space[2],
  },
  optionLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  optionLabelHi: {
    color: Colors.gray400,
    fontSize: 10,
  },
  cancelBtn: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.xl,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '700',
    color: Colors.gray700,
  },
});
