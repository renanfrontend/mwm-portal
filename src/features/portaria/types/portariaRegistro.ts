/**
 * PORTARIA REGISTRO - Types Principais
 * Define as interfaces e tipos para registros de portaria
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type { PortariaRegistroFilters } from './portariaRegistroFilters';

// ============================================================================
// TIPOS ENUMERADOS
// ============================================================================

export type PortariaTipo =
  | 'ABASTECIMENTO'
  | 'ENTREGA_DEJETOS'
  | 'ENTREGA_INSUMO'
  | 'EXPEDICAO'
  | 'VISITA';

export type PortariaStatus = 'Em andamento' | 'Concluído';

export type PortariaOrigem = 'AGENDADA' | 'ESPONTANEA';

export type TipoDocumento = 'CPF' | 'Passaporte';

export type TipoVeiculo = 'Caminhão' | 'Carro' | 'Moto';

// ============================================================================
// REGISTRO BASE
// ============================================================================

export interface PortariaRegistro {
  id: string;
  data_entrada: Date | string;
  hora_entrada: string;
  tipo_registro: PortariaTipo;
  status: PortariaStatus;
  data_saida: Date | string | null;
  hora_saida: string | null;
  origem_entrada: PortariaOrigem;
  observacoes: string | null;
  responsavel_id: string | null;
  agenda_realizada_id: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;

  // Dados específicos por tipo
  abastecimento?: PortariaAbastecimento | null;
  entrega_dejetos?: PortariaEntregaDejetos | null;
  entrega_insumo?: PortariaEntregaInsumo | null;
  expedicao?: PortariaExpedicao | null;
  visita?: PortariaVisita | null;
}

// ============================================================================
// ABASTECIMENTO (Base para Dejetos, Insumo, Expedição)
// ============================================================================

export interface PortariaAbastecimento {
  id: string;
  registro_id: string;
  motorista_id: string | null;
  motorista_nome: string;
  cpf_motorista: string;
  transportadora_id: string | null;
  transportadora_manual: string | null;
  transportadora_nome?: string; // Lookup
  veiculo_id: string | null;
  placa_manual: string | null;
  placa?: string; // Lookup
  tipo_veiculo: TipoVeiculo;
  peso_inicial: number | null;
  peso_final: number | null;
  densidade?: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

// ============================================================================
// ENTREGA DE DEJETOS
// ============================================================================

export interface PortariaEntregaDejetos {
  id: string;
  abastecimento_id: string;
  produtor_id: string;
  produtor_nome?: string; // Lookup
  densidade: string | null;
  agenda_realizada_id: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

// ============================================================================
// ENTREGA DE INSUMO
// ============================================================================

export interface PortariaEntregaInsumo {
  id: string;
  abastecimento_id: string;
  empresa: string;
  nota_fiscal: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

// ============================================================================
// EXPEDIÇÃO
// ============================================================================

export interface PortariaExpedicao {
  id: string;
  abastecimento_id: string;
  nota_fiscal: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

// ============================================================================
// VISITA
// ============================================================================

export interface PortariaVisita {
  id: string;
  registro_id: string;
  visitante_id: string | null;
  visitante_nome: string;
  documento_visitante: string;
  tipo_documento: TipoDocumento;
  motivo_visita_id: string | null;
  motivo_visita_nome?: string; // Lookup
  motivo_manual: string | null;
  veiculo_id: string | null;
  placa_manual: string | null;
  placa?: string; // Lookup
  tipo_veiculo: TipoVeiculo;
  criado_em: Date | string;
  atualizado_em: Date | string;
}

// ============================================================================
// RESPOSTAS DA API
// ============================================================================

export interface PortariaRegistroResponse {
  data: PortariaRegistro[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface PortariaRegistroSingleResponse {
  data: PortariaRegistro;
}

// ============================================================================
// TABELA (para exibição no grid)
// ============================================================================

export interface PortariaRegistroTableRow {
  id: string;
  data: string; // formatada "dd/mm/yyyy"
  hora: string; // "HH:mm"
  responsavel: string | null;
  atividade: string; // ABASTECIMENTO → "Abastecimento"
  nome: string; // motorista_nome, visitante_nome, empresa, produtor
  placa: string; // placa do veículo
  veiculoId?: string; // ID do veículo selecionado
  status: PortariaStatus;
}

// ============================================================================
// API RESPONSE (dados brutos do backend)
// ============================================================================

export interface PortariaRegistroApiData {
  id: string;
  data_entrada: string | Date;
  hora_entrada: string;
  tipo_registro: PortariaTipo;
  status: PortariaStatus;
  data_saida?: string | Date | null;
  hora_saida?: string | null;
  origem_entrada: PortariaOrigem;
  observacoes?: string | null;
  responsavel_id?: string | null;
  agenda_realizada_id?: string | null;
  criado_em: string | Date;
  atualizado_em: string | Date;
  abastecimento?: Record<string, unknown> | null;
  entrega_dejetos?: Record<string, unknown> | null;
  entrega_insumo?: Record<string, unknown> | null;
  expedicao?: Record<string, unknown> | null;
  visita?: Record<string, unknown> | null;
}

// ============================================================================
// ERRO
// ============================================================================

export interface PortariaRegistroError {
  code: string;
  message: string;
  statusCode?: number;
  details?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// ============================================================================
// STATE REDUX
// ============================================================================

export interface PortariaRegistroState {
  registros: PortariaRegistro[];
  selectedRegistro: PortariaRegistro | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: PortariaRegistroFilters;
  drawer: {
    open: boolean;
    mode: 'view' | 'edit' | 'add';
  };
  selectedIds: string[];
}
