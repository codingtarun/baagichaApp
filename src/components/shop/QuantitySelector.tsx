/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — QUANTITY SELECTOR
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantitySelectorProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrease}
        disabled={quantity <= min}
        style={[styles.button, quantity <= min && styles.buttonDisabled]}
      >
        <Typography variant="body" style={[styles.buttonText, quantity <= min && styles.buttonTextDisabled]}>
          −
        </Typography>
      </TouchableOpacity>

      <Typography variant="body" style={styles.quantity}>
        {quantity}
      </Typography>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrease}
        disabled={quantity >= max}
        style={[styles.button, quantity >= max && styles.buttonDisabled]}
      >
        <Typography variant="body" style={[styles.buttonText, quantity >= max && styles.buttonTextDisabled]}>
          +
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  buttonTextDisabled: {
    color: Colors.gray300,
  },
  quantity: {
    width: 32,
    textAlign: 'center',
    fontWeight: '700',
    color: Colors.gray800,
  },
});
