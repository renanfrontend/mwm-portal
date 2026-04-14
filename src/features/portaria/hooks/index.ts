/**
 * PORTARIA REGISTRO - Exports de Hooks (Central)
 * Centraliza todos os hooks do módulo
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

// Hooks de Registro
export {
  usePortariaRegistroList,
  usePortariaRegistroForm,
  usePortariaRegistroDelete,
} from './portariaRegistro';

export type {
  UsePortariaRegistroListReturn,
  UsePortariaRegistroFormReturn,
  UsePortariaRegistroDeleteReturn,
} from './portariaRegistro';

// Hooks Shared
export {
  usePortariaFilters,
  usePortariaSync,
} from './shared';

export type {
  UsePortariaFiltersReturn,
  UsePortariaSyncReturn,
} from './shared';
