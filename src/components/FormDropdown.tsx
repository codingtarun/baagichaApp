/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — FORM DROPDOWN COMPONENT
 * ═══════════════════════════════════════════════════════════════
 *
 * Custom modal-based dropdown for React Native.
 * No external native dependencies required.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Typography } from '../typography';

export interface DropdownOption {
  value: string;
  label: string;
}

interface FormDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string[];
  loading?: boolean;
  disabled?: boolean;
}

export default function FormDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  error,
  loading,
  disabled,
}: FormDropdownProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setVisible(false);
    },
    [onChange]
  );

  return (
    <View style={styles.inputGroup}>
      <Typography variant="label" style={styles.label}>{label}</Typography>

      <TouchableOpacity
        style={[
          styles.trigger,
          error && styles.triggerError,
          disabled && styles.triggerDisabled,
        ]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Typography
          variant="body"
          style={[styles.triggerText, !selectedLabel && styles.placeholderText]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Typography>
        {loading ? (
          <Icon name="loading" size={20} color={Colors.gray400} />
        ) : (
          <Icon name="chevron-down" size={20} color={Colors.gray500} />
        )}
      </TouchableOpacity>

      {error?.map((err, i) => (
        <Typography key={i} variant="caption" style={styles.errorText}>
          {err}
        </Typography>
      ))}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Typography variant="body" style={styles.modalTitle}>
                  {label}
                </Typography>
                <TouchableOpacity onPress={() => setVisible(false)} activeOpacity={0.7}>
                  <Icon name="close" size={24} color={Colors.gray500} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.option, isSelected && styles.optionSelected]}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={0.7}
                    >
                      <Typography
                        variant="body"
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Typography>
                      {isSelected && (
                        <Icon name="check" size={20} color={Colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 14,
    gap: 6,
  },
  label: {
    color: Colors.gray700,
    fontSize: 13,
  },
  trigger: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: Colors.danger,
  },
  triggerDisabled: {
    backgroundColor: Colors.surfaceSubtle,
    opacity: 0.7,
  },
  triggerText: {
    fontSize: 15,
    color: Colors.gray900,
    flex: 1,
  },
  placeholderText: {
    color: Colors.gray400,
  },
  errorText: {
    color: Colors.danger,
    marginTop: 2,
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    maxHeight: '70%',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 12,
    shadowColor: Colors.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray800,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray50,
  },
  optionSelected: {
    backgroundColor: Colors.primary + '08',
  },
  optionText: {
    fontSize: 15,
    color: Colors.gray800,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
