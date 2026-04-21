/**
 * LabeledInput – a reusable form field component that renders a label
 * above a text input, with inline error display below.
 * Supports optional masking via an `onChangeText` override.
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COLORS } from '@/constants/colors';

interface Props extends TextInputProps {
  /** Field label displayed above the input */
  label: string;
  /** Current value of the input */
  value: string;
  /** Called whenever text changes (may include masking logic) */
  onChangeText: (text: string) => void;
  /** Error message to display below the input; empty string hides it */
  error?: string;
  /** Flex weight within a horizontal row (default 1) */
  flex?: number;
  /** Whether this field is required (appends * to label) */
  required?: boolean;
}

export default function LabeledInput({
  label,
  value,
  onChangeText,
  error,
  flex = 1,
  required = true,
  ...rest
}: Props) {
  return (
    <View style={[styles.wrapper, { flex }]}>
      {/* Field label with optional required indicator */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>

      {/* Text input */}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.placeholder}
        {...rest}
      />

      {/* Inline validation error */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Medium',
    marginBottom: 3,
  },
  asterisk: {
    color: COLORS.error,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    fontFamily: 'Roboto-Regular',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 10,
    color: COLORS.error,
    marginTop: 2,
    fontFamily: 'Roboto-Regular',
  },
});
