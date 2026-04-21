/**
 * SelectPicker – a custom dropdown component built with React Native Modal
 * and FlatList. Used for Estado Civil and Brazilian state (UF) fields
 * since @react-native-picker/picker is not available in this project.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface Props {
  /** Field label */
  label: string;
  /** Currently selected value */
  value: string;
  /** List of selectable options */
  options: string[];
  /** Called when the user selects an option */
  onSelect: (value: string) => void;
  /** Error message; empty hides it */
  error?: string;
  /** Flex weight within a horizontal row (default 1) */
  flex?: number;
  /** Whether this field is required */
  required?: boolean;
}

export default function SelectPicker({
  label,
  value,
  options,
  onSelect,
  error,
  flex = 1,
  required = true,
}: Props) {
  const [visible, setVisible] = useState(false);

  /** Handles option selection and closes the modal */
  const handleSelect = (option: string) => {
    onSelect(option);
    setVisible(false);
  };

  return (
    <View style={[styles.wrapper, { flex }]}>
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>

      {/* Trigger button that mimics a text input */}
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.valueText : styles.placeholderText} numberOfLines={1}>
          {value || 'Selecionar...'}
        </Text>
        <ChevronDown size={14} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Inline validation error */}
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {/* Options modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <SafeAreaView style={styles.sheet}>
            {/* Modal header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Options list */}
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
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
  trigger: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: COLORS.error,
  },
  valueText: {
    fontSize: 13,
    color: COLORS.text,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.placeholder,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  errorText: {
    fontSize: 10,
    color: COLORS.error,
    marginTop: 2,
    fontFamily: 'Roboto-Regular',
  },
  /* Modal styles */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: COLORS.text,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rowBg,
  },
  optionSelected: {
    backgroundColor: COLORS.rowBg,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'Roboto-Regular',
  },
  optionTextSelected: {
    color: COLORS.accent,
    fontFamily: 'Roboto-Bold',
  },
});
