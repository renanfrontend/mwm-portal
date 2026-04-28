import type {
  ExtractedEntregaDejetosData,
  PortariaDrawerFormState,
  PortariaRegistro,
  PortariaRegistroApiData
} from '../../../types';

// Tipos auxiliares
export type PortariaDrawerLegacyFields = {
  atividade?: string;
  tipoRegistro?: string;
  data?: string | Date | null;
  horario?: string | Date | null;
  hora?: string | Date | null;
  dataSaida?: string | Date | null;
  horarioSaida?: string | Date | null;
  empresa?: string;
  notaFiscal?: string;
  visitante?: string;
  motivoManual?: string;
};

export type PortariaDrawerSource = (PortariaRegistroApiData | PortariaRegistro | Record<string, any>) & PortariaDrawerLegacyFields;

export type TransportSection = Record<string, any> | null | undefined;

export type ExtractedTransportData = ExtractedEntregaDejetosData & {
  empresa?: string;
  notaFiscal?: string;
  visitante?: string;
  motivo?: string;
  motivoManual?: string;
};

const extractTransportData = (section: TransportSection): ExtractedTransportData => ({
  produtorId: section?.produtor_id ? String(section.produtor_id) : '',
  motorista: section?.motorista_nome || section?.motoristaNome || '',
  cpf: section?.cpf_motorista || section?.cpfMotorista || '',
  transportadoraManual: section?.transportadora_manual || section?.transportadoraManual || '',
  placaManual: section?.placa_manual || section?.placaManual || '',
  placa: section?.placa || '',
  veiculoId: section?.veiculo_id ? String(section.veiculo_id) : (section?.veiculoId ? String(section.veiculoId) : ''),
  tipoVeiculo: section?.tipo_veiculo || section?.tipoVeiculo || '',
  pesoInicial: section?.peso_inicial ? (Number(section.peso_inicial) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '',
  pesoFinal: section?.peso_final ? (Number(section.peso_final) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '',
  densidade: section?.densidade || '',
  transportadoraId: section?.transportadora_id ? String(section.transportadora_id) : (section?.transportadoraId ? String(section.transportadoraId) : ''),
  empresa: section?.empresa || '',
  notaFiscal: section?.nota_fiscal || section?.notaFiscal || '',
});

export const portariaDrawerHydrationService = {
  mapTipoRegistroToAtividade(tipoRegistro?: string, atividade?: string): string {
    if (tipoRegistro === 'ENTREGA_DEJETOS') return 'Entrega de dejetos';
    if (tipoRegistro === 'ABASTECIMENTO') return 'Abastecimento';
    if (tipoRegistro === 'ENTREGA_INSUMO') return 'Entrega de insumo';
    if (tipoRegistro === 'EXPEDICAO') return 'Expedição';
    if (tipoRegistro === 'VISITA') return 'Visita';
    return atividade || '';
  },

  isTransportadoraManual(transportadoraManual: string): boolean {
    return !!transportadoraManual && transportadoraManual.trim().length > 0;
  },

  extractEntregaDejetosData(initialData: PortariaDrawerSource) {
    return extractTransportData(initialData?.entrega_dejetos);
  },

  extractEntregaInsumoData(initialData: PortariaDrawerSource) {
    return {
      ...extractTransportData(initialData?.entrega_insumo),
      densidade: '',
    };
  },

  extractExpedicaoData(initialData: PortariaDrawerSource) {
    return {
      ...extractTransportData(initialData?.expedicao),
      densidade: '',
    };
  },

  extractAbastecimentoData(initialData: PortariaDrawerSource) {
    return {
      ...extractTransportData(initialData?.abastecimento),
      densidade: '',
    };
  },

  extractVisitaData(initialData: PortariaDrawerSource): ExtractedTransportData {
    const visita = initialData?.visita as any;
    const motivoManual = visita?.motivo_manual || visita?.motivoManual || '';
    const motivo =
      motivoManual
        ? 'Outros'
        : (visita?.motivo_visita_nome || visita?.motivoVisitaNome || visita?.motivo_visita_id || visita?.motivoVisitaId || '');

    return {
      produtorId: '',
      motorista: '',
      cpf: visita?.documento_visitante || visita?.documentoVisitante || '',
      transportadoraManual: '',
      placaManual: visita?.placa_manual || visita?.placaManual || '',
      placa: visita?.placa || '',
      veiculoId: visita?.veiculo_id ? String(visita.veiculo_id) : (visita?.veiculoId ? String(visita.veiculoId) : ''),
      tipoVeiculo: visita?.tipo_veiculo || visita?.tipoVeiculo || '',
      pesoInicial: '',
      pesoFinal: '',
      densidade: '',
      transportadoraId: '',
      empresa: '',
      notaFiscal: '',
      visitante: visita?.visitante_nome || visita?.visitanteNome || '',
      motivo,
      motivoManual,
    };
  },

  extractByActivity(initialData: PortariaDrawerSource, atividade: string) {
    if (atividade === 'Abastecimento') {
      return this.extractAbastecimentoData(initialData);
    }
    if (atividade === 'Entrega de insumo') {
      return this.extractEntregaInsumoData(initialData);
    }
    if (atividade === 'Expedição') {
      return this.extractExpedicaoData(initialData);
    }
    if (atividade === 'Visita') {
      return this.extractVisitaData(initialData);
    }
    return this.extractEntregaDejetosData(initialData);
  },

  buildInitialForm(initialData: PortariaDrawerSource, parseDate: (value: string | Date | null | undefined) => Date | null, parseTime: (value: string | Date | null | undefined) => Date | null): PortariaDrawerFormState {
    const atividade = this.mapTipoRegistroToAtividade(initialData.tipo_registro || initialData.tipoRegistro, initialData.atividade);
    const dadosExtraidos = this.extractByActivity(initialData, atividade);
    const isOutros = this.isTransportadoraManual(dadosExtraidos.transportadoraManual);

    return {
      id: initialData.id,
      data: parseDate(initialData.data_entrada || initialData.data) || new Date(),
      horario: parseTime(initialData.hora_entrada || initialData.horario || initialData.hora) || new Date(),
      dataSaida: parseDate(initialData.data_saida || initialData.dataSaida),
      horarioSaida: parseTime(initialData.hora_saida || initialData.horarioSaida),
      atividade,
      cooperado: atividade === 'Abastecimento' ? '' : dadosExtraidos.produtorId,
      transportadora: isOutros ? 'outros' : (dadosExtraidos.transportadoraId || ''),
      transportadoraManual: dadosExtraidos.transportadoraManual,
      veiculoId: dadosExtraidos.veiculoId,
      placa: dadosExtraidos.placa || (isOutros ? 'Outros' : ''),
      placaManual: dadosExtraidos.placaManual || dadosExtraidos.placa || '',
      motivo: dadosExtraidos.motivo || '',
      motorista: dadosExtraidos.motorista,
      cpf: dadosExtraidos.cpf,
      tipoVeiculo: dadosExtraidos.tipoVeiculo,
      pesoInicial: dadosExtraidos.pesoInicial,
      pesoFinal: dadosExtraidos.pesoFinal,
      status: initialData.status || 'Em andamento',
      origem_entrada: initialData.origem_entrada,
      observacoes: initialData.observacoes || '',
      densidade: dadosExtraidos.densidade,
      empresa: dadosExtraidos.empresa || initialData.empresa || '',
      notaFiscal: dadosExtraidos.notaFiscal || initialData.notaFiscal || '',
      visitante: dadosExtraidos.visitante || initialData.visitante || '',
      motivoManual: dadosExtraidos.motivoManual || initialData.motivoManual || '',
    };
  },

  buildEmptyForm(): PortariaDrawerFormState {
    return {
      data: new Date(),
      horario: new Date(),
      atividade: '',
      transportadora: '',
      transportadoraManual: '',
      veiculoId: '',
      placa: '',
      placaManual: '',
      tipoVeiculo: '',
      motorista: '',
      cpf: '',
      pesoInicial: '',
      pesoFinal: '',
      dataSaida: null,
      horarioSaida: null,
      origem_entrada: 'ESPONTANEA',
      observacoes: '',
      cooperado: '',
      empresa: '',
      notaFiscal: '',
      visitante: '',
      motivo: '',
      motivoManual: '',
      densidade: '',
      status: 'Em andamento',
    };
  },
};
