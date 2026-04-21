/**
 * Type definitions for the SENGE-CE registration update form.
 * Covers all sections: personal data, address, professional data,
 * professional activities, and Unimed dependents.
 */

/** A single dependent entry for the Unimed health plan table */
export interface Dependent {
  nome: string;
  parentesco: string;
  nascimento: string;
  cpf: string;
}

/** Complete form data structure matching the ATUALIZAÇÃO CADASTRAL form */
export interface FormData {
  /* ── Dados Pessoais ───────────────────────────── */
  nome: string;
  nomeMae: string;
  dataNascimento: string;
  estadoCivil: string;
  nacionalidade: string;
  naturalidade: string;
  cpf: string;
  rg: string;

  /* ── Endereço ─────────────────────────────────── */
  residencia: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  telefoneContato: string;
  celularWhatsapp: string;
  email: string;

  /* ── Dados Profissionais ──────────────────────── */
  cursoGraduacao: string;
  outrasTitulacoes: string;
  instituicao: string;
  anoColacaoGrau: string;
  carteiraConfeaRNP: string;
  dataEmissao: string;

  /* ── Atividades Profissionais ─────────────────── */
  empresaOndeTrabalha: string;
  dataAdmissao: string;
  cargo: string;
  telefoneEmpresa: string;
  enderecoEmpresa: string;

  /* ── Dependentes para Unimed ──────────────────── */
  dependentes: Dependent[];
}

/** Per-field error messages; keyed by field name or "dependentes.{index}.{field}" */
export interface FormErrors {
  [key: string]: string;
}

/** Options for the Estado Civil (marital status) picker */
export const ESTADO_CIVIL_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Separado(a)',
  'Viúvo(a)',
  'União Estável',
];

/** Brazilian state abbreviations for the Estado address field */
export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
