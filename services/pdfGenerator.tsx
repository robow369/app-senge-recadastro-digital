/**
 * PDF generator utility for the SENGE-CE registration update form.
 * Creates a formatted PDF document matching the ATUALIZAÇÃO CADASTRAL layout.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { FormData, Dependent } from '@/types/form';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D2B5E',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#4A5568',
    marginBottom: 2,
  },
  headerInfo: {
    fontSize: 8,
    color: '#4A5568',
  },
  titleBanner: {
    backgroundColor: '#0D2B5E',
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#4AABE0',
    padding: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionHeaderText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 5,
  },
  fieldLabel: {
    fontWeight: 'bold',
    width: '35%',
  },
  fieldValue: {
    width: '65%',
  },
  dependentsTable: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EBF5FB',
    padding: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
    padding: 5,
  },
  tableColNome: {
    width: '40%',
  },
  tableColParentesco: {
    width: '20%',
  },
  tableColNasc: {
    width: '20%',
  },
  tableColCpf: {
    width: '20%',
  },
  observationSection: {
    marginTop: 20,
  },
  observationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  observationText: {
    fontSize: 9,
    marginBottom: 3,
  },
});

/**
 * Creates a section header component.
 */
function SectionHeader({ text }: { text: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{text}</Text>
    </View>
  );
}

/**
 * Creates a field row component.
 */
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value || '-'}</Text>
    </View>
  );
}

/**
 * Creates the dependents table.
 */
function DependentsTable({ dependentes }: { dependentes: Dependent[] }) {
  if (dependentes.length === 0) {
    return <Text style={{ paddingHorizontal: 5, marginBottom: 10 }}>Nenhum dependente cadastrado</Text>;
  }

  return (
    <View style={styles.dependentsTable}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableColNome, { fontWeight: 'bold' }]}>NOME</Text>
        <Text style={[styles.tableColParentesco, { fontWeight: 'bold' }]}>PARENTESCO</Text>
        <Text style={[styles.tableColNasc, { fontWeight: 'bold' }]}>NASC.</Text>
        <Text style={[styles.tableColCpf, { fontWeight: 'bold' }]}>CPF</Text>
      </View>
      {dependentes.map((dep, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableColNome}>{dep.nome || '-'}</Text>
          <Text style={styles.tableColParentesco}>{dep.parentesco || '-'}</Text>
          <Text style={styles.tableColNasc}>{dep.nascimento || '-'}</Text>
          <Text style={styles.tableColCpf}>{dep.cpf || '-'}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Generates a PDF document from the form data.
 * @param formData - The registration form data
 * @returns A Document object ready to be rendered
 */
export function generateRegistrationPdf(formData: FormData) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SENGE.CE</Text>
          <Text style={styles.headerSubtitle}>Sindicato dos Engenheiros no Estado do Ceará</Text>
          <Text style={styles.headerInfo}>Rua: Alegre, 01 Praia de Iracema, CEP: 60.060-280 – Fortaleza-CE</Text>
          <Text style={styles.headerInfo}>CNPJ: 05.242.714/0001-20  Fone: (85) 3219-0099</Text>
          <Text style={styles.headerInfo}>E-mail: atendimento@sengece.org.br | Site: www.sengece.org.br</Text>
        </View>

        {/* Title Banner */}
        <View style={styles.titleBanner}>
          <Text style={styles.titleText}>ATUALIZAÇÃO CADASTRAL</Text>
        </View>

        {/* DADOS PESSOAIS */}
        <SectionHeader text="Dados Pessoais" />
        <FieldRow label="Nome" value={formData.nome} />
        <FieldRow label="Nome da mãe" value={formData.nomeMae} />
        <FieldRow label="Data de Nascimento" value={formData.dataNascimento} />
        <FieldRow label="Estado Civil" value={formData.estadoCivil} />
        <FieldRow label="Nacionalidade" value={formData.nacionalidade} />
        <FieldRow label="Naturalidade" value={formData.naturalidade} />
        <FieldRow label="CPF" value={formData.cpf} />
        <FieldRow label="RG" value={formData.rg} />

        {/* ENDEREÇO */}
        <SectionHeader text="Endereço" />
        <FieldRow label="Residência" value={formData.residencia} />
        <FieldRow label="Bairro" value={formData.bairro} />
        <FieldRow label="CEP" value={formData.cep} />
        <FieldRow label="Cidade" value={formData.cidade} />
        <FieldRow label="Estado" value={formData.estado} />
        <FieldRow label="Telefone de Contato" value={formData.telefoneContato} />
        <FieldRow label="Celular (WhatsApp)" value={formData.celularWhatsapp} />
        <FieldRow label="E-mail" value={formData.email} />

        {/* DADOS PROFISSIONAIS */}
        <SectionHeader text="Dados Profissionais" />
        <FieldRow label="Curso de Graduação" value={formData.cursoGraduacao} />
        <FieldRow label="Outras Titulações" value={formData.outrasTitulacoes} />
        <FieldRow label="Instituição" value={formData.instituicao} />
        <FieldRow label="Ano da Colação de Grau" value={formData.anoColacaoGrau} />
        <FieldRow label="Carteira Confea-RNP nº" value={formData.carteiraConfeaRNP} />
        <FieldRow label="Data de Emissão" value={formData.dataEmissao} />

        {/* ATIVIDADES PROFISSIONAIS */}
        <SectionHeader text="Atividades Profissionais" />
        <FieldRow label="Empresa onde trabalha" value={formData.empresaOndeTrabalha} />
        <FieldRow label="Data de admissão" value={formData.dataAdmissao} />
        <FieldRow label="Cargo" value={formData.cargo} />
        <FieldRow label="Telefone" value={formData.telefoneEmpresa} />
        <FieldRow label="Endereço" value={formData.enderecoEmpresa} />

        {/* DEPENDENTES PARA UNIMED */}
        <SectionHeader text="Dependentes para Unimed" />
        <DependentsTable dependentes={formData.dependentes} />

        {/* Observações */}
        <View style={styles.observationSection}>
          <Text style={styles.observationTitle}>Observação:</Text>
          <Text style={styles.observationText}>
            1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;
          </Text>
          <Text style={styles.observationText}>
            2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)
          </Text>
        </View>
      </Page>
    </Document>
  );
}