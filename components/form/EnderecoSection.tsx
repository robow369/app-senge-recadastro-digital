/**
 * EnderecoSection – renders the "ENDEREÇO" section of the form.
 * Fields: Residência, Bairro, CEP, Cidade, Estado,
 *         Telefones de Contato, Celular (WhatsApp), E-mail.
 */

import React from 'react';
import { View } from 'react-native';
import { FormData, FormErrors, ESTADOS_BR } from '@/types/form';
import LabeledInput from './LabeledInput';
import SelectPicker from './SelectPicker';
import FormSection from './FormSection';

interface Props {
  form: FormData;
  errors: FormErrors;
  setField: (field: keyof FormData, value: string) => void;
  setCEP: (v: string) => void;
  setTelefoneContato: (v: string) => void;
  setCelular: (v: string) => void;
}

export default function EnderecoSection({
  form,
  errors,
  setField,
  setCEP,
  setTelefoneContato,
  setCelular,
}: Props) {
  return (
    <View>
      <FormSection title="Endereço" />

      {/* Residência (full-width) */}
      <LabeledInput
        label="Residência"
        value={form.residencia}
        onChangeText={(v) => setField('residencia', v)}
        error={errors.residencia}
        autoCapitalize="words"
        placeholder="Rua, número, complemento"
      />

      {/* Bairro | CEP | Cidade | Estado */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Bairro"
          value={form.bairro}
          onChangeText={(v) => setField('bairro', v)}
          error={errors.bairro}
          autoCapitalize="words"
          placeholder="Bairro"
        />
        <LabeledInput
          label="CEP"
          flex={0.7}
          value={form.cep}
          onChangeText={setCEP}
          error={errors.cep}
          keyboardType="numeric"
          placeholder="00000-000"
        />
        <LabeledInput
          label="Cidade"
          value={form.cidade}
          onChangeText={(v) => setField('cidade', v)}
          error={errors.cidade}
          autoCapitalize="words"
          placeholder="Cidade"
        />
        <SelectPicker
          label="Estado"
          flex={0.6}
          value={form.estado}
          options={ESTADOS_BR}
          onSelect={(v) => setField('estado', v)}
          error={errors.estado}
        />
      </View>

      {/* Telefones de Contato | Celular (WhatsApp) */}
      <View style={{ flexDirection: 'row' }}>
        <LabeledInput
          label="Telefones de Contato"
          value={form.telefoneContato}
          onChangeText={setTelefoneContato}
          error={errors.telefoneContato}
          keyboardType="phone-pad"
          placeholder="(00) 0000-0000"
        />
        <LabeledInput
          label="Celular (WhatsApp)"
          value={form.celularWhatsapp}
          onChangeText={setCelular}
          error={errors.celularWhatsapp}
          keyboardType="phone-pad"
          placeholder="(00) 00000-0000"
        />
      </View>

      {/* E-mail */}
      <LabeledInput
        label="E-mail"
        value={form.email}
        onChangeText={(v) => setField('email', v.toLowerCase())}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="exemplo@email.com"
      />
    </View>
  );
}
