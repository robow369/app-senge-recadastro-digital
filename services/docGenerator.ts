/**
 * docGenerator – builds an ATUALIZAÇÃO CADASTRAL .docx file from the
 * submitted form data, mirroring the layout of the official SENGE-CE form.
 *
 * On web the file is downloaded via the browser's save dialog (file-saver).
 * On native (iOS/Android) it is written to the app's cache directory and
 * then shared via the OS share sheet using expo-file-system.
 */


import * as FileSystem from 'expo-file-system/legacy' //UNDEFINED??
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  HeadingLevel,
  VerticalAlign,
} from 'docx';
import { FormData } from '@/types/form';

/* ── Colour constants matching SENGE-CE palette ───────────────────────── */
const HEADER_BG = '4AABE0';   // Sky-blue section bars
const HEADER_FG = 'FFFFFF';   // White text on section bars
const LABEL_BG  = 'EBF5FB';   // Very light blue for label cells
const BORDER_COLOR = 'B8D0E4';

/* ── Shared border definition for table cells ────────────────────────── */
const cellBorder = {
  top:    { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  left:   { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  right:  { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

/* ── Helper: blue section-header row spanning all columns ────────────── */
function sectionHeaderRow(title: string, columnSpan = 4): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        columnSpan,
        shading: { type: ShadingType.SOLID, color: HEADER_BG },
        borders: cellBorder,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                color: HEADER_FG,
                size: 22,
                font: 'Calibri',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/** Helper: creates a label cell (light-blue background) */
function labelCell(text: string, width = 20): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: LABEL_BG },
    borders: cellBorder,
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, size: 18, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

/** Helper: creates a value cell (white background) */
function valueCell(text: string, width = 30): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: cellBorder,
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: text || ' ', size: 18, font: 'Calibri' }),
        ],
      }),
    ],
  });
}

/** Helper: a full-width label+value pair in a single row (2 cells) */
function fullWidthRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      labelCell(label, 25),
      valueCell(value, 75),
    ],
  });
}

/** Helper: two label+value pairs side-by-side in one row (4 cells) */
function doubleRow(
  label1: string, value1: string,
  label2: string, value2: string,
): TableRow {
  return new TableRow({
    children: [
      labelCell(label1, 15),
      valueCell(value1, 35),
      labelCell(label2, 15),
      valueCell(value2, 35),
    ],
  });
}

/**
 * Builds a complete .docx Document from the given FormData.
 * Sections match the printed ATUALIZAÇÃO CADASTRAL layout.
 */
function buildDocument(data: FormData): Document {
  /* ── Institutional header paragraphs ─────────────────────────────── */
  const institutionHeader = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'SINDICATO DOS ENGENHEIROS NO ESTADO DO CEARÁ',
          bold: true, size: 24, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Rua: Alegre, 01 Praia de Iracema, CEP: 60.060-280 – Fortaleza-CE', size: 18, font: 'Calibri' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'CNPJ: 05.242.714/0001-20  Fone: (85) 3219-0099', size: 18, font: 'Calibri' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'E-mail: atendimento@sengece.org.br  |  Site: www.sengece.org.br', size: 18, font: 'Calibri' })],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: 'ATUALIZAÇÃO CADASTRAL',
          bold: true, size: 28, color: HEADER_BG, font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({ text: '' }),
  ];

  /* ── DADOS PESSOAIS table ─────────────────────────────────────────── */
  const dadosPessoaisTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      sectionHeaderRow('Dados Pessoais', 4),
      fullWidthRow('Nome:', data.nome),
      fullWidthRow('Nome da mãe:', data.nomeMae),
      doubleRow('Data de Nascimento:', data.dataNascimento, 'Estado Civil:', data.estadoCivil),
      doubleRow('Nacionalidade:', data.nacionalidade, 'Naturalidade:', data.naturalidade),
      doubleRow('CPF:', data.cpf, 'RG:', data.rg),
    ],
  });

  /* ── ENDEREÇO table ───────────────────────────────────────────────── */
  const enderecoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      sectionHeaderRow('Endereço', 4),
      fullWidthRow('Residência:', data.residencia),
      new TableRow({
        children: [
          labelCell('Bairro:', 15),
          valueCell(data.bairro, 25),
          labelCell('CEP:', 10),
          valueCell(data.cep, 15),
          labelCell('Cidade:', 15),
          valueCell(data.cidade, 10),
          labelCell('Estado:', 5),
          valueCell(data.estado, 5),
        ],
      }),
      doubleRow('Tel. de Contato:', data.telefoneContato, 'Celular (WhatsApp):', data.celularWhatsapp),
      fullWidthRow('E-mail:', data.email),
    ],
  });

  /* ── DADOS PROFISSIONAIS table ───────────────────────────────────── */
  const dadosProfissionaisTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      sectionHeaderRow('Dados Profissionais', 4),
      fullWidthRow('Curso de Graduação:', data.cursoGraduacao),
      fullWidthRow('Outras Titulações:', data.outrasTitulacoes),
      doubleRow('Instituição:', data.instituicao, 'Ano da Colação de Grau:', data.anoColacaoGrau),
      doubleRow('Carteira Confea-RNP nº:', data.carteiraConfeaRNP, 'Data de Emissão:', data.dataEmissao),
    ],
  });

  /* ── ATIVIDADES PROFISSIONAIS table ──────────────────────────────── */
  const atividadesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      sectionHeaderRow('Atividades Profissionais', 4),
      fullWidthRow('Empresa onde trabalha:', data.empresaOndeTrabalha),
      new TableRow({
        children: [
          labelCell('Data de admissão:', 15),
          valueCell(data.dataAdmissao, 20),
          labelCell('Cargo:', 15),
          valueCell(data.cargo, 20),
          labelCell('Telefone:', 15),
          valueCell(data.telefoneEmpresa, 15),
        ],
      }),
      fullWidthRow('Endereço:', data.enderecoEmpresa),
    ],
  });

  /* ── DEPENDENTES PARA UNIMED table ───────────────────────────────── */
  const depHeaderRow = new TableRow({
    children: [
      new TableCell({
        shading: { type: ShadingType.SOLID, color: LABEL_BG },
        borders: cellBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'NOME', bold: true, size: 18, font: 'Calibri' })] })],
      }),
      new TableCell({
        shading: { type: ShadingType.SOLID, color: LABEL_BG },
        borders: cellBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'PARENTESCO', bold: true, size: 18, font: 'Calibri' })] })],
      }),
      new TableCell({
        shading: { type: ShadingType.SOLID, color: LABEL_BG },
        borders: cellBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'NASCIMENTO', bold: true, size: 18, font: 'Calibri' })] })],
      }),
      new TableCell({
        shading: { type: ShadingType.SOLID, color: LABEL_BG },
        borders: cellBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'CPF', bold: true, size: 18, font: 'Calibri' })] })],
      }),
    ],
  });

  /* Ensure at least 3 blank rows even if no dependents were added */
  const depDataRows = Array.from({ length: Math.max(data.dependentes.length, 3) }, (_, i) => {
    const dep = data.dependentes[i] ?? { nome: '', parentesco: '', nascimento: '', cpf: '' };
    return new TableRow({
      children: [
        valueCell(dep.nome, 25),
        valueCell(dep.parentesco, 25),
        valueCell(dep.nascimento, 25),
        valueCell(dep.cpf, 25),
      ],
    });
  });

  const dependentesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      sectionHeaderRow('Dependentes para Unimed', 4),
      depHeaderRow,
      ...depDataRows,
    ],
  });

  /* ── Observations ────────────────────────────────────────────────── */
  const observations = [
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: 'Observação:', bold: true, size: 20, font: 'Calibri' })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;', size: 18, font: 'Calibri' })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)', size: 18, font: 'Calibri' })],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [new TextRun({ text: `Gerado em: ${new Date().toLocaleString('pt-BR')}`, size: 16, color: '888888', font: 'Calibri' })],
    }),
  ];

  return new Document({
    sections: [
      {
        properties: {},
        children: [
          ...institutionHeader,
          dadosPessoaisTable,
          new Paragraph({ text: '' }),
          enderecoTable,
          new Paragraph({ text: '' }),
          dadosProfissionaisTable,
          new Paragraph({ text: '' }),
          atividadesTable,
          new Paragraph({ text: '' }),
          dependentesTable,
          ...observations,
        ],
      },
    ],
  });
}

/**
 * Generates the .docx file and triggers a download/share.
 *
 * - Web: uses file-saver to prompt the browser's "Save As" dialog.
 * - Native: writes the file to the cache directory, then opens the
 *   OS share sheet via expo-file-system so the user can save/send it.
 *
 * due to blob and file system, it only works on web, will give an error on mobile when saving file!
 * @param data - Validated form data
 */
export async function generateAndDownloadDocx(data: FormData): Promise<void> {
  const doc = buildDocument(data);
  const fileName = `atualizacao_cadastral_${data.cpf.replace(/\D/g, '')}.docx`;

  try {
      Alert.alert("FileSystem is: " + typeof(FileSystem));
      console.log("FileSystem is: " + typeof(FileSystem))

    if (Platform.OS === 'web') {
      // ── Web Path ──────────────────────────────────────────
      const { saveAs } = await import('file-saver');
      const blob = await Packer.toBlob(doc);
      saveAs(blob, fileName);
    } else {
      // ── Native Path ───────────────────────────────────────
      // 1. Generate Base64 string directly from the Packer
      const base64 = await Packer.toBase64String(doc);
      
      // 2. Define the path in the cache directory
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;

      // 3. Write the file using Base64 encoding
      await FileSystem.writeAsStringAsync(filePath, base64, {
        // encoding: FileSystem.EncodingType.Base64,
        encoding: 'base64'
      });
      

      // 4. Share the file
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          dialogTitle: 'Salvar Atualização Cadastral',
          UTI: 'com.microsoft.word.doc', // Better UTI for iOS Word docs
        });
      } else {
        console.error("Sharing is not available on this device");
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
