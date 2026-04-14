/**
 * PORTARIA REGISTRO - Tipos e Labels
 * Define constantes para tipos de registro
 * Data: 24/03/2026
 */

import type { PortariaTipo } from '../types';

// ============================================================================
// TIPOS DE REGISTRO
// ============================================================================

export const PORTARIA_TIPOS = {
  ABASTECIMENTO: 'ABASTECIMENTO',
  ENTREGA_DEJETOS: 'ENTREGA_DEJETOS',
  ENTREGA_INSUMO: 'ENTREGA_INSUMO',
  EXPEDICAO: 'EXPEDICAO',
  VISITA: 'VISITA',
} as const;

export const PORTARIA_TIPOS_LABEL: Record<PortariaTipo, string> = {
  ABASTECIMENTO: 'Abastecimento',
  ENTREGA_DEJETOS: 'Entrega de dejetos',
  ENTREGA_INSUMO: 'Entrega de insumo',
  EXPEDICAO: 'Expedição',
  VISITA: 'Visita',
};

export const PORTARIA_TIPOS_DESCRICAO: Record<PortariaTipo, string> = {
  ABASTECIMENTO: 'Reabastecimento de combustível',
  ENTREGA_DEJETOS: 'Entrega de dejetos de propriedade',
  ENTREGA_INSUMO: 'Entrega de insumo para propriedade',
  EXPEDICAO: 'Expedição de produto da propriedade',
  VISITA: 'Visita de terceiro à propriedade',
};

// ============================================================================
// LISTA DE TIPOS (para selects)
// ============================================================================

export const PORTARIA_TIPOS_LIST: Array<{
  value: PortariaTipo;
  label: string;
  descricao: string;
}> = [
  {
    value: 'ABASTECIMENTO',
    label: PORTARIA_TIPOS_LABEL.ABASTECIMENTO,
    descricao: PORTARIA_TIPOS_DESCRICAO.ABASTECIMENTO,
  },
  {
    value: 'ENTREGA_DEJETOS',
    label: PORTARIA_TIPOS_LABEL.ENTREGA_DEJETOS,
    descricao: PORTARIA_TIPOS_DESCRICAO.ENTREGA_DEJETOS,
  },
  {
    value: 'ENTREGA_INSUMO',
    label: PORTARIA_TIPOS_LABEL.ENTREGA_INSUMO,
    descricao: PORTARIA_TIPOS_DESCRICAO.ENTREGA_INSUMO,
  },
  {
    value: 'EXPEDICAO',
    label: PORTARIA_TIPOS_LABEL.EXPEDICAO,
    descricao: PORTARIA_TIPOS_DESCRICAO.EXPEDICAO,
  },
  {
    value: 'VISITA',
    label: PORTARIA_TIPOS_LABEL.VISITA,
    descricao: PORTARIA_TIPOS_DESCRICAO.VISITA,
  },
];

// ============================================================================
// TIPOS DE VEÍCULO
// ============================================================================

export const PORTARIA_TIPOS_VEICULO = {
  CAMINHAO: 'Caminhão',
  CARRO: 'Carro',
  MOTO: 'Moto',
} as const;

export const PORTARIA_TIPOS_VEICULO_LIST = [
  { value: 'Caminhão', label: 'Caminhão' },
  { value: 'Carro', label: 'Carro' },
  { value: 'Moto', label: 'Moto' },
];

// ============================================================================
// TIPOS DE DOCUMENTO
// ============================================================================

export const PORTARIA_TIPOS_DOCUMENTO = {
  CPF: 'CPF',
  PASSAPORTE: 'Passaporte',
} as const;

export const PORTARIA_TIPOS_DOCUMENTO_LIST = [
  { value: 'CPF', label: 'CPF' },
  { value: 'Passaporte', label: 'Passaporte' },
];

// ============================================================================
// ORIGEM ENTRADA
// ============================================================================

export const PORTARIA_ORIGEM = {
  AGENDADA: 'AGENDADA',
  ESPONTANEA: 'ESPONTANEA',
} as const;

export const PORTARIA_ORIGEM_LABEL = {
  AGENDADA: 'Agendada',
  ESPONTANEA: 'Espontânea',
} as const;
