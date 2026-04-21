/**
 * useFormState – central state management hook for the ATUALIZAÇÃO CADASTRAL form.
 * Handles field updates, input masking, per-field validation, and form submission.
 * Returns all state and handlers needed by the form screen and section components.
 */

import { useState, useCallback } from 'react';
import { FormData, FormErrors, Dependent } from '@/types/form';
import {
  formatCPF,
  formatRG,
  formatCEP,
  formatPhone,
  formatDate,
  formatYear,
} from '@/utils/formatters';
import {
  validateCPF,
  validateRG,
  validateCEP,
  validatePhone,
  validateEmail,
  validateDate,
  validateYear,
  validateRequired,
} from '@/utils/validators';
import { submitRegistrationUpdate } from '@/services/api';

/** Initial empty form state */
const INITIAL_FORM: FormData = {
  nome: '',
  nomeMae: '',
  dataNascimento: '',
  estadoCivil: '',
  nacionalidade: '',
  naturalidade: '',
  cpf: '',
  rg: '',
  residencia: '',
  bairro: '',
  cep: '',
  cidade: '',
  estado: '',
  telefoneContato: '',
  celularWhatsapp: '',
  email: '',
  cursoGraduacao: '',
  outrasTitulacoes: '',
  instituicao: '',
  anoColacaoGrau: '',
  carteiraConfeaRNP: '',
  dataEmissao: '',
  empresaOndeTrabalha: '',
  dataAdmissao: '',
  cargo: '',
  telefoneEmpresa: '',
  enderecoEmpresa: '',
  dependentes: [],
};

/** Empty dependent template */
const EMPTY_DEPENDENT: Dependent = { nome: '', parentesco: '', nascimento: '', cpf: '' };

export function useFormState() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  /* ── Generic field update helper ─────────────────────────────────── */

  /**
   * Updates a single top-level field in the form state.
   * Clears the corresponding error when the user starts typing.
   */
  const setField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  }, []);

  /* ── Masked field updaters ────────────────────────────────────────── */

  const setCPF = (v: string) => setField('cpf', formatCPF(v));
  const setRG = (v: string) => setField('rg', formatRG(v));
  const setCEP = (v: string) => setField('cep', formatCEP(v));
  const setTelefoneContato = (v: string) => setField('telefoneContato', formatPhone(v));
  const setCelular = (v: string) => setField('celularWhatsapp', formatPhone(v));
  const setTelefoneEmpresa = (v: string) => setField('telefoneEmpresa', formatPhone(v));
  const setDataNascimento = (v: string) => setField('dataNascimento', formatDate(v));
  const setDataEmissao = (v: string) => setField('dataEmissao', formatDate(v));
  const setDataAdmissao = (v: string) => setField('dataAdmissao', formatDate(v));
  const setAnoColacaoGrau = (v: string) => setField('anoColacaoGrau', formatYear(v));

  /* ── Dependents ───────────────────────────────────────────────────── */

  /** Updates a single field in a dependent row */
  const updateDependent = useCallback(
    (index: number, field: keyof Dependent, value: string) => {
      setForm((prev) => {
        const updated = [...prev.dependentes];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, dependentes: updated };
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`dependentes.${index}.${field}`];
        return next;
      });
    },
    [],
  );

  /** Appends a new empty dependent row */
  const addDependent = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      dependentes: [...prev.dependentes, { ...EMPTY_DEPENDENT }],
    }));
  }, []);

  /** Removes the dependent at the given index */
  const removeDependent = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      dependentes: prev.dependentes.filter((_, i) => i !== index),
    }));
  }, []);

  /* ── Full-form validation ─────────────────────────────────────────── */

  /**
   * Runs all field validators and populates the errors map.
   * Returns true when the form is valid (no errors found).
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    /* Dados Pessoais */
    const reqPersonal: Array<[keyof FormData, string]> = [
      ['nome', 'Nome'],
      ['nomeMae', 'Nome da mãe'],
      ['estadoCivil', 'Estado Civil'],
      ['nacionalidade', 'Nacionalidade'],
      ['naturalidade', 'Naturalidade'],
    ];
    reqPersonal.forEach(([field, label]) => {
      const err = validateRequired(form[field] as string, label);
      if (err) newErrors[field] = err;
    });

    const dateNasc = validateDate(form.dataNascimento);
    if (dateNasc) newErrors.dataNascimento = dateNasc || validateRequired(form.dataNascimento, 'Data de Nascimento');

    const cpfErr = validateCPF(form.cpf) || validateRequired(form.cpf, 'CPF');
    if (cpfErr) newErrors.cpf = cpfErr;

    const rgErr = validateRG(form.rg) || validateRequired(form.rg, 'RG');
    if (rgErr) newErrors.rg = rgErr;

    /* Endereço */
    const reqAddress: Array<[keyof FormData, string]> = [
      ['residencia', 'Residência'],
      ['bairro', 'Bairro'],
      ['cidade', 'Cidade'],
      ['estado', 'Estado'],
    ];
    reqAddress.forEach(([field, label]) => {
      const err = validateRequired(form[field] as string, label);
      if (err) newErrors[field] = err;
    });

    const cepErr = validateCEP(form.cep) || validateRequired(form.cep, 'CEP');
    if (cepErr) newErrors.cep = cepErr;

    if (form.telefoneContato) {
      const tel = validatePhone(form.telefoneContato);
      if (tel) newErrors.telefoneContato = tel;
    } else {
      newErrors.telefoneContato = 'Telefone de Contato é obrigatório(a)';
    }

    const celErr = validatePhone(form.celularWhatsapp) || validateRequired(form.celularWhatsapp, 'Celular (WhatsApp)');
    if (celErr) newErrors.celularWhatsapp = celErr;

    const emailErr = validateEmail(form.email) || validateRequired(form.email, 'E-mail');
    if (emailErr) newErrors.email = emailErr;

    /* Dados Profissionais */
    const reqProf: Array<[keyof FormData, string]> = [
      ['cursoGraduacao', 'Curso de Graduação'],
      ['instituicao', 'Instituição'],
      ['carteiraConfeaRNP', 'Carteira Confea-RNP'],
    ];
    reqProf.forEach(([field, label]) => {
      const err = validateRequired(form[field] as string, label);
      if (err) newErrors[field] = err;
    });

    const anoErr = validateYear(form.anoColacaoGrau) || validateRequired(form.anoColacaoGrau, 'Ano de Colação de Grau');
    if (anoErr) newErrors.anoColacaoGrau = anoErr;

    const emissaoErr = validateDate(form.dataEmissao) || validateRequired(form.dataEmissao, 'Data de Emissão');
    if (emissaoErr) newErrors.dataEmissao = emissaoErr;

    /* Atividades Profissionais */
    const reqAtiv: Array<[keyof FormData, string]> = [
      ['empresaOndeTrabalha', 'Empresa onde trabalha'],
      ['cargo', 'Cargo'],
      ['enderecoEmpresa', 'Endereço da empresa'],
    ];
    reqAtiv.forEach(([field, label]) => {
      const err = validateRequired(form[field] as string, label);
      if (err) newErrors[field] = err;
    });

    const admErr = validateDate(form.dataAdmissao) || validateRequired(form.dataAdmissao, 'Data de Admissão');
    if (admErr) newErrors.dataAdmissao = admErr;

    if (form.telefoneEmpresa) {
      const t = validatePhone(form.telefoneEmpresa);
      if (t) newErrors.telefoneEmpresa = t;
    } else {
      newErrors.telefoneEmpresa = 'Telefone da empresa é obrigatório(a)';
    }

    /* Dependentes – validate only rows that have at least one filled field */
    form.dependentes.forEach((dep, idx) => {
      const hasAny = dep.nome || dep.parentesco || dep.nascimento || dep.cpf;
      if (!hasAny) return;

      if (!dep.nome.trim()) newErrors[`dependentes.${idx}.nome`] = 'Nome é obrigatório';
      if (!dep.parentesco.trim()) newErrors[`dependentes.${idx}.parentesco`] = 'Parentesco é obrigatório';

      if (dep.nascimento) {
        const d = validateDate(dep.nascimento);
        if (d) newErrors[`dependentes.${idx}.nascimento`] = d;
      } else {
        newErrors[`dependentes.${idx}.nascimento`] = 'Nascimento é obrigatório';
      }

      if (dep.cpf) {
        const c = validateCPF(dep.cpf);
        if (c) newErrors[`dependentes.${idx}.cpf`] = c;
      } else {
        newErrors[`dependentes.${idx}.cpf`] = 'CPF é obrigatório';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Form submission ──────────────────────────────────────────────── */

  /**
   * Validates the form and, if valid, submits it via the API service.
   * Updates submitResult with the server response.
   */
  const handleSubmit = async () => {
    setSubmitResult(null);
    // if (!validate()) return; // testing purposes, remove this
 
    setIsSubmitting(true);
    try {
      const result = await submitRegistrationUpdate(form);
      setSubmitResult(result);
      if (result.success) setForm(INITIAL_FORM);
    } catch {
      setSubmitResult({ success: false, message: 'Erro ao enviar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    isSubmitting,
    submitResult,
    setField,
    /* Masked setters */
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
    /* Dependents */
    updateDependent,
    addDependent,
    removeDependent,
    /* Actions */
    handleSubmit,
  };
}
