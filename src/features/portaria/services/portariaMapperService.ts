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
      data_entrada: new Date(apiData.data_entrada),
      hora_entrada: apiData.hora_entrada,
      tipo_registro: apiData.tipo_registro,
      status: apiData.status,
      data_saida: apiData.data_saida ? new Date(apiData.data_saida) : null,
      hora_saida: apiData.hora_saida ?? null,
      origem_entrada: apiData.origem_entrada,
      observacoes: apiData.observacoes ?? null,
      responsavel_id: apiData.responsavel_id ?? null,
      agenda_realizada_id: apiData.agenda_realizada_id ?? null,
      criado_em: new Date(apiData.criado_em),
      atualizado_em: new Date(apiData.atualizado_em),

      abastecimento: null,
      entrega_dejetos: apiData.entrega_dejetos ? this.mapApiToEntregaDejetos(apiData.entrega_dejetos as Record<string, unknown>) : null,
      entrega_insumo: null,
      expedicao: null,
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
    const data = new Date(apiData.data_entrada);
    const hora = apiData.hora_entrada;

    // Extrair nome, placa, veiculoId e responsavel de acordo com o tipo de registro
    let nome = '';
    let placa = '';
    let veiculoId = '';
    let responsavel = null;

    // Se tem entrega_dejetos, extrair dados de lá
    if (apiData.entrega_dejetos) {
      nome = (apiData.entrega_dejetos as any).motorista_nome || '';
      placa = (apiData.entrega_dejetos as any).placa || (apiData.entrega_dejetos as any).placa_manual || '';
      veiculoId = (apiData.entrega_dejetos as any).veiculo_id || '';
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
   * Mapear Visita
   */
  mapApiToVisita(apiData: Record<string, unknown>): PortariaVisita {
    return apiData as unknown as PortariaVisita;
  },
};
