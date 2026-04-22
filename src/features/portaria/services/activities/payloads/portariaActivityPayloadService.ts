import type { PortariaDrawerFormState, PortariaOrigem, PortariaRegistroFormData, PortariaTipo, TipoDocumento, TipoVeiculo } from '../../../types';
import { buildTransportCreatePayload } from '../shared/transportPayload';

const formatDateValue = (value: Date | string | null | undefined): Date | string => {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  return value || '';
};

const formatTimeValue = (value: Date | string | null | undefined): string => {
  if (value instanceof Date) {
    return value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return value || '';
};

const inferTipoDocumento = (documento: string): TipoDocumento => {
  const digitsOnly = documento.replace(/\D/g, '');
  return digitsOnly.length === 11 ? 'CPF' : 'Passaporte';
};

const isMotivoManual = (motivo: string): boolean => motivo === 'Outros' || motivo === 'outros';

const buildBasePayload = (entry: PortariaDrawerFormState): PortariaRegistroFormData => ({
  tipoRegistro: portariaActivityPayloadService.mapAtividadeToTipoRegistro(entry.atividade),
  data_entrada: formatDateValue(entry.data),
  hora_entrada: formatTimeValue(entry.horario),
  data_saida: entry.dataSaida ? formatDateValue(entry.dataSaida) : undefined,
  hora_saida: entry.horarioSaida ? formatTimeValue(entry.horarioSaida) : undefined,
  observacoes: entry.observacoes,
  status: entry.status || 'Em andamento',
  origem_entrada: entry.origem_entrada || ('ESPONTANEA' as PortariaOrigem),
});

const buildEntregaDejetosCreatePayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => ({
  ...basePayload,
  entrega_dejetos: {
    ...buildTransportCreatePayload(entry),
    produtor_id: entry.cooperado || '',
    densidade: entry.densidade || '',
  },
});

const buildEntregaDejetosUpdatePayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => (
  buildEntregaDejetosCreatePayload(entry, basePayload)
);

const buildAbastecimentoPayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => ({
  ...basePayload,
  abastecimento: {
    ...buildTransportCreatePayload(entry),
  },
});

const buildEntregaInsumoPayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => ({
  ...basePayload,
  entrega_insumo: {
    ...buildTransportCreatePayload(entry),
    empresa: entry.empresa || '',
    nota_fiscal: entry.notaFiscal || null,
  },
});

const buildExpedicaoPayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => ({
  ...basePayload,
  expedicao: {
    ...buildTransportCreatePayload(entry),
    nota_fiscal: entry.notaFiscal || null,
  },
});

const buildVisitaPayload = (entry: PortariaDrawerFormState, basePayload: PortariaRegistroFormData): PortariaRegistroFormData => ({
  ...basePayload,
  visita: {
    visitante_nome: entry.visitante || '',
    documento_visitante: entry.cpf || '',
    tipo_documento: inferTipoDocumento(entry.cpf || ''),
    visitante_id: null,
    motivo_visita_id: isMotivoManual(entry.motivo) ? null : (entry.motivo || null),
    motivo_manual: isMotivoManual(entry.motivo) ? (entry.motivoManual || null) : null,
    veiculo_id: entry.veiculoId || null,
    placa_manual: entry.placaManual || null,
    tipo_veiculo: (entry.tipoVeiculo || 'Carro') as TipoVeiculo,
  },
});

export const portariaActivityPayloadService = {
  mapAtividadeToTipoRegistro(atividade: string): PortariaTipo {
    switch (atividade) {
      case 'Abastecimento':
        return 'ABASTECIMENTO';
      case 'Entrega de dejetos':
        return 'ENTREGA_DEJETOS';
      case 'Entrega de insumo':
        return 'ENTREGA_INSUMO';
      case 'Expedição':
        return 'EXPEDICAO';
      case 'Visita':
        return 'VISITA';
      default:
        throw new Error(`Atividade desconhecida: ${atividade}`);
    }
  },

  buildPayload(entry: PortariaDrawerFormState): PortariaRegistroFormData {
    const basePayload = buildBasePayload(entry);

    switch (entry.atividade) {
      case 'Entrega de dejetos':
        return buildEntregaDejetosCreatePayload(entry, basePayload);

      case 'Abastecimento':
        return buildAbastecimentoPayload(entry, basePayload);

      case 'Entrega de insumo':
        return buildEntregaInsumoPayload(entry, basePayload);

      case 'Expedição':
        return buildExpedicaoPayload(entry, basePayload);

      case 'Visita':
        return buildVisitaPayload(entry, basePayload);

      default:
        return basePayload;
    }
  },

  buildUpdatePayload(entry: PortariaDrawerFormState): PortariaRegistroFormData {
    const basePayload = buildBasePayload(entry);

    switch (entry.atividade) {
      case 'Entrega de dejetos':
        return buildEntregaDejetosUpdatePayload(entry, basePayload);

      case 'Entrega de insumo':
        return buildEntregaInsumoPayload(entry, basePayload);

      case 'Expedição':
        return buildExpedicaoPayload(entry, basePayload);

      default:
        return this.buildPayload(entry);
    }
  },
};
