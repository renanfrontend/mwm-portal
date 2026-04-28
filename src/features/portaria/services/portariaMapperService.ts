/**
 * PORTARIA REGISTRO - Service de Mapper
 * Responsável por transformação de dados (API ↔ Frontend)
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type {
  PortariaRegistro,
  PortariaRegistroTableRow,
  PortariaRegistroFormData,
  PortariaRegistroApiData,
  PortariaAbastecimento,
  PortariaEntregaDejetos,
  PortariaEntregaInsumo,
  PortariaExpedicao,
  PortariaVisita,
} from '../types';
import { portariaFormatterService } from './portariaFormatterService';
import { PORTARIA_TIPOS_LABEL } from '../constants';

// ============================================================================
// MAPPER SERVICE
// ============================================================================

export const portariaMapperService = {
  /**
   * API → Frontend (para exibição/edição completa)
   */
  mapApiToRegistro(apiData: PortariaRegistroApiData): PortariaRegistro {
    return {
      id: apiData.id,
      data_entrada: new Date(apiData.data_entrada + 'T12:00:00'),
      hora_entrada: apiData.hora_entrada,
      tipo_registro: apiData.tipo_registro,
      status: apiData.status,
      data_saida: apiData.data_saida ? new Date(apiData.data_saida + 'T12:00:00') : null,
      hora_saida: apiData.hora_saida ?? null,
      origem_entrada: apiData.origem_entrada,
      observacoes: apiData.observacoes ?? null,
      responsavel_id: apiData.responsavel_id ?? null,
      agenda_realizada_id: apiData.agenda_realizada_id ?? null,
      criado_em: new Date(apiData.criado_em),
      atualizado_em: new Date(apiData.atualizado_em),

      abastecimento: apiData.abastecimento ? this.mapApiToAbastecimento(apiData.abastecimento as Record<string, unknown>) : null,
      entrega_dejetos: apiData.entrega_dejetos ? this.mapApiToEntregaDejetos(apiData.entrega_dejetos as Record<string, unknown>) : null,
      entrega_insumo: apiData.entrega_insumo ? this.mapApiToEntregaInsumo(apiData.entrega_insumo as Record<string, unknown>) : null,
      expedicao: apiData.expedicao ? this.mapApiToExpedicao(apiData.expedicao as Record<string, unknown>) : null,
      visita: apiData.visita ? this.mapApiToVisita(apiData.visita as Record<string, unknown>) : null,
    };
  },

  /**
   * Frontend → API (para envio)
   */
  mapFormToApi(formData: PortariaRegistroFormData): Record<string, unknown> {
    return {
      data_entrada: formData.data_entrada,
      hora_entrada: formData.hora_entrada,
      tipoRegistro: formData.tipoRegistro,
      data_saida: formData.data_saida || null,
      hora_saida: formData.hora_saida || null,
      observacoes: formData.observacoes || null,
      status: formData.status || 'Em andamento',
      origem_entrada: formData.origem_entrada || 'ESPONTANEA',

      abastecimento: formData.abastecimento || null,
      entrega_dejetos: formData.entrega_dejetos || null,
      entrega_insumo: formData.entrega_insumo || null,
      expedicao: formData.expedicao || null,
      visita: formData.visita || null,
    };
  },

  /**
    * API → Linha da Tabela (para grid)
    */
  mapApiToTableRow(apiData: PortariaRegistroApiData): PortariaRegistroTableRow {
    const data = new Date(apiData.data_entrada + 'T12:00:00');
    const hora = apiData.hora_entrada;

    // Extrair nome, placa, veiculoId e responsavel de acordo com o tipo de registro
    let nome = '';
    let placa = '';
    let veiculoId = '';
    let responsavel = null;

    // Para Entrega de dejetos, usar apenas o próprio bloco de dados.
    if (apiData.tipo_registro === 'ENTREGA_DEJETOS' && apiData.entrega_dejetos) {
      nome =
        (apiData.entrega_dejetos as any).motorista_nome ||
        (apiData.entrega_dejetos as any).motoristaNome ||
        '';
      placa =
        (apiData.entrega_dejetos as any).placa ||
        (apiData.entrega_dejetos as any).placa_manual ||
        (apiData.entrega_dejetos as any).placaManual ||
        '';
      veiculoId =
        (apiData.entrega_dejetos as any).veiculo_id ||
        (apiData.entrega_dejetos as any).veiculoId ||
        '';
    }

    if (apiData.entrega_insumo) {
      nome =
        nome ||
        (apiData.entrega_insumo as any).motorista_nome ||
        (apiData.entrega_insumo as any).motoristaNome ||
        (apiData.entrega_insumo as any).empresa ||
        '';
      placa =
        placa ||
        (apiData.entrega_insumo as any).placa ||
        (apiData.entrega_insumo as any).placa_manual ||
        (apiData.entrega_insumo as any).placaManual ||
        '';
      veiculoId =
        veiculoId ||
        (apiData.entrega_insumo as any).veiculo_id ||
        (apiData.entrega_insumo as any).veiculoId ||
        '';
    }

    if (apiData.expedicao) {
      nome =
        nome ||
        (apiData.expedicao as any).motorista_nome ||
        (apiData.expedicao as any).motoristaNome ||
        '';
      placa =
        placa ||
        (apiData.expedicao as any).placa ||
        (apiData.expedicao as any).placa_manual ||
        (apiData.expedicao as any).placaManual ||
        '';
      veiculoId =
        veiculoId ||
        (apiData.expedicao as any).veiculo_id ||
        (apiData.expedicao as any).veiculoId ||
        '';
    }

    if (apiData.visita) {
      nome =
        (apiData.visita as any).visitante_nome ||
        (apiData.visita as any).visitanteNome ||
        nome;
      placa =
        placa ||
        (apiData.visita as any).placa ||
        (apiData.visita as any).placa_manual ||
        (apiData.visita as any).placaManual ||
        '';
      veiculoId =
        veiculoId ||
        (apiData.visita as any).veiculo_id ||
        (apiData.visita as any).veiculoId ||
        '';
    }

    // Para abastecimento, aceitar tanto snake_case quanto camelCase do backend.
    if (apiData.tipo_registro === 'ABASTECIMENTO' && apiData.abastecimento) {
      nome =
        nome ||
        (apiData.abastecimento as any).motoristaNome ||
        (apiData.abastecimento as any).motorista_nome ||
        '';
      placa =
        placa ||
        (apiData.abastecimento as any).placa ||
        (apiData.abastecimento as any).placaManual ||
        (apiData.abastecimento as any).placa_manual ||
        '';
      veiculoId =
        veiculoId ||
        (apiData.abastecimento as any).veiculoId ||
        (apiData.abastecimento as any).veiculo_id ||
        '';
    }
    
    // Responsável vem direto da API
    responsavel = apiData.responsavel_id ? `Responsável #${apiData.responsavel_id}` : null;

    return {
      id: apiData.id,
      data: portariaFormatterService.formatDataBr(data),
      hora: hora,
      responsavel: responsavel,
      atividade: PORTARIA_TIPOS_LABEL[apiData.tipo_registro] || apiData.tipo_registro,
      nome,
      placa,
      veiculoId,
      status: apiData.status,
    };
  },

  /**
   * Mapear Abastecimento
   */
  mapApiToAbastecimento(apiData: Record<string, unknown>): PortariaAbastecimento {
    return apiData as unknown as PortariaAbastecimento;
  },

  /**
   * Mapear Entrega Dejetos
   */
  mapApiToEntregaDejetos(apiData: Record<string, unknown>): PortariaEntregaDejetos {
    return apiData as unknown as PortariaEntregaDejetos;
  },

  /**
   * Mapear Entrega Insumo
   */
  mapApiToEntregaInsumo(apiData: Record<string, unknown>): PortariaEntregaInsumo {
    return apiData as unknown as PortariaEntregaInsumo;
  },

  /**
   * Mapear Expedição
   */
  mapApiToExpedicao(apiData: Record<string, unknown>): PortariaExpedicao {
    return apiData as unknown as PortariaExpedicao;
  },

  /**
   * Mapear Visita
   */
  mapApiToVisita(apiData: Record<string, unknown>): PortariaVisita {
    return apiData as unknown as PortariaVisita;
  },
};
