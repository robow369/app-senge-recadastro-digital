/**
 * Main form screen – ATUALIZAÇÃO CADASTRAL (Registration Update).
 * Composes all form sections, the header, the dependents table,
 * and the submit button. Manages keyboard-avoiding behavior and
 * displays a submission result banner.
 */

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFonts } from 'expo-font';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Send } from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { useFormState } from '@/hooks/useFormState';
import FormHeader from '@/components/FormHeader';
import FormSection from '@/components/form/FormSection';
import DadosPessoaisSection from '@/components/form/DadosPessoaisSection';
import EnderecoSection from '@/components/form/EnderecoSection';
import DadosProfissionaisSection from '@/components/form/DadosProfissionaisSection';
import AtividadesSection from '@/components/form/AtividadesSection';
import DependentsSection from '@/components/form/DependentsSection';

/* Prevent splash screen from hiding until fonts are loaded */
SplashScreen.preventAutoHideAsync();

export default function FormScreen() {
  /* ── Load Google Fonts ────────────────────────────────────────────── */
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  /* Keep splash visible while fonts load */
  if (!fontsLoaded && !fontError) return null;

  /* ── Form state from custom hook ──────────────────────────────────── */
  return <FormContent />;
}

/**
 * Inner component that consumes the form state hook.
 * Separated so the font-loading guard above doesn't cause
 * hook order issues with useFormState.
 */
function FormContent() {
  const {
    form,
    errors,
    isSubmitting,
    submitResult,
    setField,
    setCPF,
    setRG,
    setCEP,
    setTelefoneContato,
    setCelular,
    setTelefoneEmpresa,
    setDataNascimento,
    setDataEmissao,
    setDataAdmissao,
    setAnoColacaoGrau,
    updateDependent,
    addDependent,
    removeDependent,
    handleSubmit,
  } = useFormState();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Institutional header ────────────────────────────────── */}
          <FormHeader />

          <View style={styles.formBody}>
            {/* ── DADOS PESSOAIS ──────────────────────────────────── */}
            <DadosPessoaisSection
              form={form}
              errors={errors}
              setField={setField}
              setCPF={setCPF}
              setRG={setRG}
              setDataNascimento={setDataNascimento}
            />

            {/* ── ENDEREÇO ────────────────────────────────────────── */}
            <EnderecoSection
              form={form}
              errors={errors}
              setField={setField}
              setCEP={setCEP}
              setTelefoneContato={setTelefoneContato}
              setCelular={setCelular}
            />

            {/* ── DADOS PROFISSIONAIS ─────────────────────────────── */}
            <DadosProfissionaisSection
              form={form}
              errors={errors}
              setField={setField}
              setAnoColacaoGrau={setAnoColacaoGrau}
              setDataEmissao={setDataEmissao}
            />

            {/* ── ATIVIDADES PROFISSIONAIS ─────────────────────────── */}
            <AtividadesSection
              form={form}
              errors={errors}
              setField={setField}
              setDataAdmissao={setDataAdmissao}
              setTelefoneEmpresa={setTelefoneEmpresa}
            />

            {/* ── DEPENDENTES PARA UNIMED ─────────────────────────── */}
            <FormSection title="Dependentes para Unimed" />
            <DependentsSection
              dependentes={form.dependentes}
              errors={errors}
              onChange={updateDependent}
              onAdd={addDependent}
              onRemove={removeDependent}
            />

            {/* ── Observations ─────────────────────────────────────── */}
            <View style={styles.observacoes}>
              <Text style={styles.obsTitle}>Observação:</Text>
              <Text style={styles.obsText}>
                1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;
              </Text>
              <Text style={styles.obsText}>
                2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)
              </Text>
            </View>

            {/* ── Submission result banner ─────────────────────────── */}
            {submitResult && (
              <View
                style={[
                  styles.resultBanner,
                  submitResult.success ? styles.resultSuccess : styles.resultError,
                ]}
              >
                {submitResult.success ? (
                  <CheckCircle size={18} color={COLORS.white} />
                ) : (
                  <AlertCircle size={18} color={COLORS.white} />
                )}
                <Text style={styles.resultText}>{submitResult.message}</Text>
              </View>
            )}

            {/* ── Submit button ─────────────────────────────────────── */}
            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Send size={16} color={COLORS.white} />
                  <Text style={styles.submitBtnText}>Enviar Atualização</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Bottom spacer */}
            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  observacoes: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.rowBg,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  obsTitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  obsText: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 4,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  resultSuccess: {
    backgroundColor: COLORS.success,
  },
  resultError: {
    backgroundColor: COLORS.error,
  },
  resultText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    flex: 1,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.disabled,
  },
  submitBtnText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
