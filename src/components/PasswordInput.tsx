/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — PASSWORD INPUT (with visibility toggle + strength)
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../theme/colors';
import { Radius, Space } from '../theme/style';
import { Typography } from '../typography';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string[];
  showStrength?: boolean;
  confirmValue?: string; // for confirmation match indicator
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: Colors.gray300 };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak / कमजोर', color: Colors.danger };
  if (score <= 4) return { score, label: 'Medium / मध्यम', color: Colors.warning };
  return { score, label: 'Strong / मजबूत', color: Colors.success };
}

export default function PasswordInput({
  value,
  onChangeText,
  placeholder = 'Enter your password',
  label = 'Password / पासवर्ड',
  error,
  showStrength = false,
  confirmValue,
}: PasswordInputProps): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  const strength = useMemo(() => calculateStrength(value), [value]);

  const matchesConfirm = confirmValue !== undefined && value === confirmValue && value.length > 0;
  const mismatchesConfirm = confirmValue !== undefined && value !== confirmValue && confirmValue.length > 0;

  return (
    <View style={styles.container}>
      <Typography variant="label" style={styles.label}>
        {label}
      </Typography>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, error && error.length > 0 && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray400}
          secureTextEntry={!isVisible}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsVisible((v) => !v)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={Colors.gray500}
          />
        </TouchableOpacity>
      </View>

      {error?.map((err, i) => (
        <Typography key={i} variant="caption" style={styles.errorText}>
          {err}
        </Typography>
      ))}

      {showStrength && value.length > 0 && (
        <View style={styles.strengthRow}>
          <View style={styles.strengthBarContainer}>
            {[1, 2, 3, 4, 5].map((slot) => (
              <View
                key={slot}
                style={[
                  styles.strengthBar,
                  slot <= strength.score && { backgroundColor: strength.color },
                ]}
              />
            ))}
          </View>
          <Typography variant="caption" style={[styles.strengthLabel, { color: strength.color }]}>
            {strength.label}
          </Typography>
        </View>
      )}

      {matchesConfirm && (
        <Typography variant="caption" style={styles.matchText}>
          Passwords match / पासवर्ड मेल खाते हैं
        </Typography>
      )}
      {mismatchesConfirm && (
        <Typography variant="caption" style={styles.mismatchText}>
          Passwords do not match / पासवर्ड मेल नहीं खाते
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space[1],
  },
  label: {
    color: Colors.gray700,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
    paddingLeft: Space[4],
  },
  input: {
    flex: 1,
    paddingVertical: Space[3],
    fontSize: 16,
    color: Colors.gray900,
    fontFamily: 'DMSans-Regular',
  },
  inputError: {
    borderColor: Colors.danger,
  },
  eyeButton: {
    paddingHorizontal: Space[3],
    paddingVertical: Space[3],
  },
  errorText: {
    color: Colors.danger,
    marginTop: 2,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
    marginTop: Space[1],
  },
  strengthBarContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.gray200,
  },
  strengthLabel: {
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
  matchText: {
    color: Colors.success,
    marginTop: 2,
  },
  mismatchText: {
    color: Colors.danger,
    marginTop: 2,
  },
});
