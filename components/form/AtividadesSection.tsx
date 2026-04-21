/**
 * AtividadesSection – renders the "ATIVIDADES PROFISSIONAIS" section.
 * Fields: Empresa onde trabalha, Data de admissão, Cargo, Telefone, Endereço.
 */

import React from 'react';
import { View } from 'react-native';
import { FormData, FormErrors } from '@/types/form';
import LabeledInput from './LabeledInput';
import FormSection from './FormSection';

interface Props {
  form: FormData;
  errors: FormErrors;
  setField: (field: keyof FormData, value: string) => void;
  setDataAdmissao: (v: string) => void;
  setTelefoneEmpresa: (v: string) => void;
}

export default function AtividadesSection({
  form,
  errors,
  setField,
  setDataAdmissao,
  setTelefoneEmpresa,
}: Props) {
  return (
    <View>
      <FormSection title="Atividades Profissionais" />

      {/* Empresa onde trabalha */}
      <LabeledInput
        label="Empresa onde trabalha"
        value={form.empresaOndeTrabalha}
        onChangeText={(v) => setField('empresaOndeTrabalha', v)}
        error={errors.empresaOndeTrabalha}
        autoCapitalize="words"
        placeholder="Nome da empresa"
      />

      {/* Data de admissão | Cargo | Telefone */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Data de admissão"
          value={form.dataAdmissao}
          onChangeText={setDataAdmissao}
          error={errors.dataAdmissao}
          keyboardType="numeric"
          placeholder="DD/MM/AAAA"
        />
        <LabeledInput
          label="Cargo"
          value={form.cargo}
          onChangeText={(v) => setField('cargo', v)}
          error={errors.cargo}
          autoCapitalize="words"
          placeholder="Ex: Engenheiro Sênior"
        />
        <LabeledInput
          label="Telefone"
          value={form.telefoneEmpresa}
          onChangeText={setTelefoneEmpresa}
          error={errors.telefoneEmpresa}
          keyboardType="phone-pad"
          placeholder="(00) 0000-0000"
        />
      </View>

      {/* Endereço da empresa */}
      <LabeledInput
        label="Endereço"
        value={form.enderecoEmpresa}
        onChangeText={(v) => setField('enderecoEmpresa', v)}
        error={errors.enderecoEmpresa}
        autoCapitalize="words"
        placeholder="Endereço completo da empresa"
      />
    </View>
  );
}
