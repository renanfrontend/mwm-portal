/**
 * PORTARIA REGISTRO - Status e Cores
 * Define constantes para status de registro
 * Data: 24/03/2026
 */

import type { PortariaStatus } from '../types';

// ============================================================================
// STATUS
// ============================================================================

export const PORTARIA_STATUS = {
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
} as const;

export const PORTARIA_STATUS_LIST: Array<{
  value: PortariaStatus;
  label: string;
}> = [
  { value: 'Em andamento', label: 'Em andamento' },
  { value: 'Concluído', label: 'Concluído' },
];

// ============================================================================
// CORES E ESTILOS
// ============================================================================

export const PORTARIA_STATUS_COLORS: Record<PortariaStatus, string> = {
  'Em andamento': '#FF832B',
  'Concluído': '#50883C',
};

export const PORTARIA_STATUS_BG_COLORS: Record<PortariaStatus, string> = {
  'Em andamento': 'rgba(255, 131, 43, 0.1)',
  'Concluído': 'rgba(80, 136, 60, 0.1)',
};

// ============================================================================
// CONFIGURAÇÕES DE PAGINAÇÃO
// ============================================================================

export const PORTARIA_PAGINATION_DEFAULTS = {
  PAGE: 0,
  PAGE_SIZE: 5,
  PAGE_SIZE_OPTIONS: [5, 10, 25],
} as const;

// ============================================================================
// CONFIGURAÇÕES DE DADOS
// ============================================================================

export const PORTARIA_DATA_DEFAULTS = {
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
} as const;
