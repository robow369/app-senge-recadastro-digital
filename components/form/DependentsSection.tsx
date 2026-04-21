/**
 * DependentsSection – renders the "DEPENDENTES PARA UNIMED" table.
 * Supports up to 5 dependent rows. Each row has: nome, parentesco,
 * nascimento (date), and CPF. Fields are validated on blur/submit.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Dependent, FormErrors } from '@/types/form';
import { COLORS } from '@/constants/colors';
import LabeledInput from './LabeledInput';
import { formatCPF, formatDate } from '@/utils/formatters';

const MAX_DEPENDENTS = 5;

interface Props {
  dependentes: Dependent[];
  errors: FormErrors;
  /** Called when a dependent field changes; index identifies the row */
  onChange: (index: number, field: keyof Dependent, value: string) => void;
  /** Adds a new empty dependent row */
  onAdd: () => void;
  /** Removes the dependent at the given index */
  onRemove: (index: number) => void;
}

export default function DependentsSection({
  dependentes,
  errors,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <View>
      {/* Column headers */}
      <View style={styles.headerRow}>
        {['NOME', 'PARENTESCO', 'NASC.', 'CPF', ''].map((col, i) => (
          <Text key={i} style={[styles.colHeader, i === 0 && { flex: 2 }]}>
            {col}
          </Text>
        ))}
      </View>

      {/* Dependent rows */}
      {dependentes.map((dep, idx) => (
        <View key={idx} style={styles.depRow}>
          {/* Nome */}
          <View style={{ flex: 2 }}>
            <LabeledInput
              label=""
              value={dep.nome}
              onChangeText={(v) => onChange(idx, 'nome', v)}
              error={errors[`dependentes.${idx}.nome`]}
              required={false}
              autoCapitalize="words"
            />
          </View>

          {/* Parentesco */}
          <View style={{ flex: 1 }}>
            <LabeledInput
              label=""
              value={dep.parentesco}
              onChangeText={(v) => onChange(idx, 'parentesco', v)}
              error={errors[`dependentes.${idx}.parentesco`]}
              required={false}
              autoCapitalize="words"
            />
          </View>

          {/* Nascimento */}
          <View style={{ flex: 1 }}>
            <LabeledInput
              label=""
              value={dep.nascimento}
              onChangeText={(v) => onChange(idx, 'nascimento', formatDate(v))}
              error={errors[`dependentes.${idx}.nascimento`]}
              required={false}
              keyboardType="numeric"
              placeholder="DD/MM/AAAA"
            />
          </View>

          {/* CPF */}
          <View style={{ flex: 1.2 }}>
            <LabeledInput
              label=""
              value={dep.cpf}
              onChangeText={(v) => onChange(idx, 'cpf', formatCPF(v))}
              error={errors[`dependentes.${idx}.cpf`]}
              required={false}
              keyboardType="numeric"
              placeholder="000.000.000-00"
            />
          </View>

          {/* Remove button */}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => onRemove(idx)}
          >
            <Trash2 size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add dependent button (visible only when under the max limit) */}
      {dependentes.length < MAX_DEPENDENTS && (
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Plus size={14} color={COLORS.accent} />
          <Text style={styles.addBtnText}>Adicionar dependente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.rowBg,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colHeader: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  depRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rowBg,
  },
  removeBtn: {
    paddingTop: 10,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 6,
  },
  addBtnText: {
    fontSize: 12,
    color: COLORS.accent,
    fontFamily: 'Roboto-Medium',
  },
});
