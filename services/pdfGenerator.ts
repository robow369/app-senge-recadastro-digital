/**
 * pdfGenerator – generates an ATUALIZAÇÃO CADASTRAL PDF from form data.
 *
 * Uses jsPDF (a pure-JS PDF library) to build the document layout.
 * On web the file is downloaded via the browser. On native it is
 * written to the cache directory and shared via the OS share sheet.
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { FormData } from '@/types/form';

/* ── Colour constants matching SENGE-CE palette ───────────────────────── */
const HEADER_BG: [number, number, number] = [74, 171, 224];   // #4AABE0
const HEADER_FG: [number, number, number] = [255, 255, 255];
const LABEL_BG: [number, number, number]  = [235, 245, 251];  // #EBF5FB
const BORDER_COLOR: [number, number, number] = [184, 208, 228]; // #B8D0E4
const TEXT_COLOR: [number, number, number] = [26, 26, 26];
const LABEL_TEXT: [number, number, number] = [74, 85, 104];
const PRIMARY_DARK: [number, number, number] = [13, 43, 94];   // #0D2B5E

type JsPDF = import('jspdf').jsPDF;

/** Draws a filled rectangle header row */
function drawSectionHeader(doc: JsPDF, y: number, title: string, pageWidth: number, margin: number): number {
  const rowH = 8;
  doc.setFillColor(...HEADER_BG);
  doc.rect(margin, y, pageWidth - margin * 2, rowH, 'F');
  doc.setTextColor(...HEADER_FG);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), pageWidth / 2, y + rowH / 2 + 3, { align: 'center' });
  return y + rowH;
}

/** Draws a label cell */
function drawLabelCell(doc: JsPDF, x: number, y: number, w: number, h: number, text: string) {
  doc.setFillColor(...LABEL_BG);
  doc.setDrawColor(...BORDER_COLOR);
  doc.rect(x, y, w, h, 'FD');
  doc.setTextColor(...LABEL_TEXT);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x + 2, y + h / 2 + 2.5);
}

/** Draws a value cell */
function drawValueCell(doc: JsPDF, x: number, y: number, w: number, h: number, text: string) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.rect(x, y, w, h, 'FD');
  doc.setTextColor(...TEXT_COLOR);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const truncated = doc.splitTextToSize(text || '', w - 4)[0] ?? '';
  doc.text(truncated, x + 2, y + h / 2 + 2.5);
}

/** Draws a full-width label+value row and returns the new Y */
function drawFullRow(
  doc: JsPDF,
  y: number,
  label: string,
  value: string,
  usableW: number,
  margin: number,
  rowH = 7,
): number {
  const labelW = usableW * 0.28;
  const valueW = usableW - labelW;
  drawLabelCell(doc, margin, y, labelW, rowH, label);
  drawValueCell(doc, margin + labelW, y, valueW, rowH, value);
  return y + rowH;
}

/** Draws two label+value pairs on a single row and returns new Y */
function drawDoubleRow(
  doc: JsPDF,
  y: number,
  label1: string,
  value1: string,
  label2: string,
  value2: string,
  usableW: number,
  margin: number,
  rowH = 7,
): number {
  const halfW = usableW / 2;
  const lw = halfW * 0.38;
  const vw = halfW - lw;
  drawLabelCell(doc, margin, y, lw, rowH, label1);
  drawValueCell(doc, margin + lw, y, vw, rowH, value1);
  drawLabelCell(doc, margin + halfW, y, lw, rowH, label2);
  drawValueCell(doc, margin + halfW + lw, y, vw, rowH, value2);
  return y + rowH;
}

/**
 * Builds the PDF document and returns a base64 string.
 */
async function buildPdf(data: FormData): Promise<string> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const usableW = pageWidth - margin * 2;
  let y = 14;

  // ── Institutional header ──────────────────────────────────────────
  doc.setFillColor(...PRIMARY_DARK);
  doc.rect(0, 0, pageWidth, 6, 'F');

  y = 12;
  doc.setTextColor(...PRIMARY_DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SINDICATO DOS ENGENHEIROS NO ESTADO DO CEARÁ', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...LABEL_TEXT);
  doc.text('Rua: Alegre, 01 Praia de Iracema, CEP: 60.060-280 – Fortaleza-CE', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('CNPJ: 05.242.714/0001-20  |  Fone: (85) 3219-0099  |  E-mail: atendimento@sengece.org.br  |  www.sengece.org.br', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Title banner
  doc.setFillColor(...HEADER_BG);
  doc.rect(margin, y, usableW, 9, 'F');
  doc.setTextColor(...HEADER_FG);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('ATUALIZAÇÃO CADASTRAL', pageWidth / 2, y + 6.5, { align: 'center' });
  y += 13;

  // ── DADOS PESSOAIS ───────────────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Dados Pessoais', pageWidth, margin);
  y = drawFullRow(doc, y, 'Nome:', data.nome, usableW, margin);
  y = drawFullRow(doc, y, 'Nome da mãe:', data.nomeMae, usableW, margin);
  y = drawDoubleRow(doc, y, 'Data de Nascimento:', data.dataNascimento, 'Estado Civil:', data.estadoCivil, usableW, margin);
  y = drawDoubleRow(doc, y, 'Nacionalidade:', data.nacionalidade, 'Naturalidade:', data.naturalidade, usableW, margin);
  y = drawDoubleRow(doc, y, 'CPF:', data.cpf, 'RG:', data.rg, usableW, margin);
  y += 3;

  // ── ENDEREÇO ─────────────────────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Endereço', pageWidth, margin);
  y = drawFullRow(doc, y, 'Residência:', data.residencia, usableW, margin);

  // Bairro | CEP | Cidade | Estado – 4 cells on one row
  const rowH = 7;
  const bairroW = usableW * 0.28;
  const cepW    = usableW * 0.16;
  const cidadeW = usableW * 0.32;
  const estadoW = usableW - bairroW - cepW - cidadeW;
  const bairroLW = bairroW * 0.4; const bairroVW = bairroW - bairroLW;
  const cepLW   = cepW   * 0.4; const cepVW   = cepW   - cepLW;
  const cidadeLW= cidadeW* 0.35; const cidadeVW= cidadeW- cidadeLW;
  const estadoLW= estadoW* 0.5;  const estadoVW= estadoW- estadoLW;
  drawLabelCell(doc, margin, y, bairroLW, rowH, 'Bairro:');
  drawValueCell(doc, margin + bairroLW, y, bairroVW, rowH, data.bairro);
  drawLabelCell(doc, margin + bairroW, y, cepLW, rowH, 'CEP:');
  drawValueCell(doc, margin + bairroW + cepLW, y, cepVW, rowH, data.cep);
  drawLabelCell(doc, margin + bairroW + cepW, y, cidadeLW, rowH, 'Cidade:');
  drawValueCell(doc, margin + bairroW + cepW + cidadeLW, y, cidadeVW, rowH, data.cidade);
  drawLabelCell(doc, margin + bairroW + cepW + cidadeW, y, estadoLW, rowH, 'UF:');
  drawValueCell(doc, margin + bairroW + cepW + cidadeW + estadoLW, y, estadoVW, rowH, data.estado);
  y += rowH;

  y = drawDoubleRow(doc, y, 'Tel. de Contato:', data.telefoneContato, 'Celular (WhatsApp):', data.celularWhatsapp, usableW, margin);
  y = drawFullRow(doc, y, 'E-mail:', data.email, usableW, margin);
  y += 3;

  // ── DADOS PROFISSIONAIS ──────────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Dados Profissionais', pageWidth, margin);
  y = drawFullRow(doc, y, 'Curso de Graduação:', data.cursoGraduacao, usableW, margin);
  y = drawFullRow(doc, y, 'Outras Titulações:', data.outrasTitulacoes, usableW, margin);
  y = drawDoubleRow(doc, y, 'Instituição:', data.instituicao, 'Ano da Colação de Grau:', data.anoColacaoGrau, usableW, margin);
  y = drawDoubleRow(doc, y, 'Carteira Confea-RNP nº:', data.carteiraConfeaRNP, 'Data de Emissão:', data.dataEmissao, usableW, margin);
  y += 3;

  // ── ATIVIDADES PROFISSIONAIS ─────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Atividades Profissionais', pageWidth, margin);
  y = drawFullRow(doc, y, 'Empresa onde trabalha:', data.empresaOndeTrabalha, usableW, margin);

  // Data admissão | Cargo | Telefone – 3 cells
  const admW = usableW / 3;
  const admLW = admW * 0.45; const admVW = admW - admLW;
  const cargoLW = admW * 0.3; const cargoVW = admW - cargoLW;
  const telLW = admW * 0.35; const telVW = admW - telLW;
  drawLabelCell(doc, margin, y, admLW, rowH, 'Data admissão:');
  drawValueCell(doc, margin + admLW, y, admVW, rowH, data.dataAdmissao);
  drawLabelCell(doc, margin + admW, y, cargoLW, rowH, 'Cargo:');
  drawValueCell(doc, margin + admW + cargoLW, y, cargoVW, rowH, data.cargo);
  drawLabelCell(doc, margin + admW * 2, y, telLW, rowH, 'Telefone:');
  drawValueCell(doc, margin + admW * 2 + telLW, y, telVW, rowH, data.telefoneEmpresa);
  y += rowH;

  y = drawFullRow(doc, y, 'Endereço:', data.enderecoEmpresa, usableW, margin);
  y += 3;

  // ── DEPENDENTES PARA UNIMED ──────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Dependentes para Unimed', pageWidth, margin);

  // Column header row
  const depColW = usableW / 4;
  const depCols = ['NOME', 'PARENTESCO', 'NASCIMENTO', 'CPF'];
  depCols.forEach((col, i) => {
    drawLabelCell(doc, margin + i * depColW, y, depColW, rowH, col);
  });
  y += rowH;

  const depRows = Math.max(data.dependentes.length, 3);
  for (let i = 0; i < depRows; i++) {
    const dep = data.dependentes[i] ?? { nome: '', parentesco: '', nascimento: '', cpf: '' };
    drawValueCell(doc, margin, y, depColW, rowH, dep.nome);
    drawValueCell(doc, margin + depColW, y, depColW, rowH, dep.parentesco);
    drawValueCell(doc, margin + depColW * 2, y, depColW, rowH, dep.nascimento);
    drawValueCell(doc, margin + depColW * 3, y, depColW, rowH, dep.cpf);
    y += rowH;
  }
  y += 5;

  // ── Observations ─────────────────────────────────────────────────
  doc.setTextColor(...LABEL_TEXT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Observação:', margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;', margin, y);
  y += 4;
  doc.text('2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)', margin, y);
  y += 8;

  doc.setFontSize(7);
  doc.setTextColor(136, 136, 136);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, y);

  return doc.output('datauristring').split(',')[1];
}

/**
 * Generates the PDF and triggers download/share depending on platform.
 */
export async function generateAndDownloadPdf(data: FormData): Promise<void> {
  const fileName = `atualizacao_cadastral_${data.cpf.replace(/\D/g, '')}.pdf`;

  const base64 = await buildPdf(data);

  if (Platform.OS === 'web') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, base64, { encoding: 'base64' });
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Salvar Atualização Cadastral',
        UTI: 'com.adobe.pdf',
      });
    }
  }
}
