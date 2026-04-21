/**
 * DadosPessoaisSection – renders the "DADOS PESSOAIS" section of the form.
 * Fields: Nome, Nome da mãe, Data de Nascimento, Estado Civil,
 *         Nacionalidade, Naturalidade, CPF, RG.
 */

import React from 'react';
import { View } from 'react-native';
import { FormData, FormErrors, ESTADO_CIVIL_OPTIONS } from '@/types/form';
import LabeledInput from './LabeledInput';
import SelectPicker from './SelectPicker';
import FormSection from './FormSection';

interface Props {
  form: FormData;
  errors: FormErrors;
  setField: (field: keyof FormData, value: string) => void;
  setCPF: (v: string) => void;
  setRG: (v: string) => void;
  setDataNascimento: (v: string) => void;
}

export default function DadosPessoaisSection({
  form,
  errors,
  setField,
  setCPF,
  setRG,
  setDataNascimento,
}: Props) {
  return (
    <View>
      <FormSection title="Dados Pessoais" />

      {/* Nome */}
      <LabeledInput
        label="Nome"
        value={form.nome}
        onChangeText={(v) => setField('nome', v)}
        error={errors.nome}
        autoCapitalize="words"
        placeholder="Nome completo"
      />

      {/* Nome da mãe */}
      <LabeledInput
        label="Nome da mãe"
        value={form.nomeMae}
        onChangeText={(v) => setField('nomeMae', v)}
        error={errors.nomeMae}
        autoCapitalize="words"
        placeholder="Nome completo da mãe"
      />

      {/* Data de Nascimento | Estado Civil */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Data de Nascimento"
          value={form.dataNascimento}
          onChangeText={setDataNascimento}
          error={errors.dataNascimento}
          keyboardType="numeric"
          placeholder="DD/MM/AAAA"
        />
        <SelectPicker
          label="Estado Civil"
          value={form.estadoCivil}
          options={ESTADO_CIVIL_OPTIONS}
          onSelect={(v) => setField('estadoCivil', v)}
          error={errors.estadoCivil}
        />
      </View>

      {/* Nacionalidade | Naturalidade */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Nacionalidade"
          value={form.nacionalidade}
          onChangeText={(v) => setField('nacionalidade', v)}
          error={errors.nacionalidade}
          autoCapitalize="words"
          placeholder="Ex: Brasileira"
        />
        <LabeledInput
          label="Naturalidade"
          value={form.naturalidade}
          onChangeText={(v) => setField('naturalidade', v)}
          error={errors.naturalidade}
          autoCapitalize="words"
          placeholder="Cidade/Estado"
        />
      </View>

      {/* CPF | RG */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="CPF"
          value={form.cpf}
          onChangeText={setCPF}
          error={errors.cpf}
          keyboardType="numeric"
          placeholder="000.000.000-00"
        />
        <LabeledInput
          label="RG"
          value={form.rg}
          onChangeText={setRG}
          error={errors.rg}
          keyboardType="numeric"
          placeholder="00.000.000-00"
        />
      </View>
    </View>
  );
}
