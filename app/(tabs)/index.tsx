/**
 * Main form screen – ATUALIZAÇÃO CADASTRAL (Registration Update).
 * Composes all form sections, the header, the dependents table,
 * and the submit button. Manages keyboard-avoiding behavior and
 * displays a submission result banner.
 */

import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { useFonts } from 'expo-font';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  CircleCheck as CheckCircle,
  CircleAlert as AlertCircle,
  Send,
  FileText,
  FileImage,
  X,
} from 'lucide-react-native';

import { COLORS } from '@/constants/colors';
import { useFormState } from '@/hooks/useFormState';
import { ExportFormat } from '@/services/api';
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

  if (!fontsLoaded && !fontError) return null;

  return <FormContent />;
}

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

  const [formatModalVisible, setFormatModalVisible] = useState(false);

  const openFormatPicker = () => setFormatModalVisible(true);

  const confirmFormat = (format: ExportFormat) => {
    setFormatModalVisible(false);
    handleSubmit(format);
  };

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
          <FormHeader />

          <View style={styles.formBody}>
            <DadosPessoaisSection
              form={form}
              errors={errors}
              setField={setField}
              setCPF={setCPF}
              setRG={setRG}
              setDataNascimento={setDataNascimento}
            />

            <EnderecoSection
              form={form}
              errors={errors}
              setField={setField}
              setCEP={setCEP}
              setTelefoneContato={setTelefoneContato}
              setCelular={setCelular}
            />

            <DadosProfissionaisSection
              form={form}
              errors={errors}
              setField={setField}
              setAnoColacaoGrau={setAnoColacaoGrau}
              setDataEmissao={setDataEmissao}
            />

            <AtividadesSection
              form={form}
              errors={errors}
              setField={setField}
              setDataAdmissao={setDataAdmissao}
              setTelefoneEmpresa={setTelefoneEmpresa}
            />

            <FormSection title="Dependentes para Unimed" />
            <DependentsSection
              dependentes={form.dependentes}
              errors={errors}
              onChange={updateDependent}
              onAdd={addDependent}
              onRemove={removeDependent}
            />

            <View style={styles.observacoes}>
              <Text style={styles.obsTitle}>Observação:</Text>
              <Text style={styles.obsText}>
                1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;
              </Text>
              <Text style={styles.obsText}>
                2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)
              </Text>
            </View>

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

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={openFormatPicker}
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

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Format picker modal ──────────────────────────────────── */}
      <Modal
        visible={formatModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFormatModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFormatModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher formato do arquivo</Text>
              <TouchableOpacity onPress={() => setFormatModalVisible(false)}>
                <X size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecione o formato em que deseja salvar o formulário preenchido.
            </Text>

            <View style={styles.formatOptions}>
              {/* DOCX option */}
              <TouchableOpacity
                style={styles.formatCard}
                onPress={() => confirmFormat('docx')}
                activeOpacity={0.75}
              >
                <View style={[styles.formatIconWrap, { backgroundColor: '#E8F4FD' }]}>
                  <FileText size={28} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.formatCardTitle}>Word (.docx)</Text>
                <Text style={styles.formatCardDesc}>
                  Editável no Microsoft Word ou Google Docs
                </Text>
              </TouchableOpacity>

              {/* PDF option */}
              <TouchableOpacity
                style={styles.formatCard}
                onPress={() => confirmFormat('pdf')}
                activeOpacity={0.75}
              >
                <View style={[styles.formatIconWrap, { backgroundColor: '#FEF0EC' }]}>
                  <FileImage size={28} color="#C0392B" />
                </View>
                <Text style={styles.formatCardTitle}>PDF (.pdf)</Text>
                <Text style={styles.formatCardDesc}>
                  Ideal para impressão e assinatura digital
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 24 : 36,
    paddingTop: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: COLORS.text,
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  formatOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  formatCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
  },
  formatIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  formatCardTitle: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  formatCardDesc: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
