/**
 * DadosProfissionaisSection – renders the "DADOS PROFISSIONAIS" section.
 * Fields: Curso de Graduação, Outras Titulações, Instituição,
 *         Ano da Colação de Grau, Carteira Confea-RNP nº, Data de Emissão.
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
  setAnoColacaoGrau: (v: string) => void;
  setDataEmissao: (v: string) => void;
}

export default function DadosProfissionaisSection({
  form,
  errors,
  setField,
  setAnoColacaoGrau,
  setDataEmissao,
}: Props) {
  return (
    <View>
      <FormSection title="Dados Profissionais" />

      {/* Curso de Graduação */}
      <LabeledInput
        label="Curso de Graduação"
        value={form.cursoGraduacao}
        onChangeText={(v) => setField('cursoGraduacao', v)}
        error={errors.cursoGraduacao}
        autoCapitalize="words"
        placeholder="Ex: Engenharia Civil"
      />

      {/* Outras Titulações */}
      <LabeledInput
        label="Outras Titulações"
        value={form.outrasTitulacoes}
        onChangeText={(v) => setField('outrasTitulacoes', v)}
        error={errors.outrasTitulacoes}
        autoCapitalize="sentences"
        placeholder="Especialização, MBA, Mestrado, etc."
        required={false}
      />

      {/* Instituição | Ano da Colação de Grau */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Instituição"
          value={form.instituicao}
          onChangeText={(v) => setField('instituicao', v)}
          error={errors.instituicao}
          autoCapitalize="words"
          placeholder="Nome da instituição"
        />
        <LabeledInput
          label="Ano da Colação de Grau"
          flex={0.7}
          value={form.anoColacaoGrau}
          onChangeText={setAnoColacaoGrau}
          error={errors.anoColacaoGrau}
          keyboardType="numeric"
          placeholder="AAAA"
        />
      </View>

      {/* Carteira Confea-RNP nº | Data de Emissão */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Carteira Confea-RNP nº"
          value={form.carteiraConfeaRNP}
          onChangeText={(v) => setField('carteiraConfeaRNP', v)}
          error={errors.carteiraConfeaRNP}
          keyboardType="default"
          placeholder="Número da carteira"
        />
        <LabeledInput
          label="Data de Emissão"
          flex={0.7}
          value={form.dataEmissao}
          onChangeText={setDataEmissao}
          error={errors.dataEmissao}
          keyboardType="numeric"
          placeholder="DD/MM/AAAA"
        />
      </View>
    </View>
  );
}
