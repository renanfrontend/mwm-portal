/**
 * PORTARIA REGISTRO - Exports Públicos
 * Centraliza todos os exports da feature
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

// Hooks
export {
  usePortariaRegistroList,
  usePortariaRegistroForm,
  usePortariaRegistroDelete,
  usePortariaFilters,
  usePortariaSync,
} from './hooks';

// Services
export {
  portariaRegistroService,
  portariaValidationService,
  portariaMapperService,
  portariaFormatterService,
} from './services';

// Types
export type {
  PortariaTipo,
  PortariaStatus,
  PortariaRegistro,
  PortariaRegistroFormData,
  PortariaRegistroFilters,
} from './types';

// Constants
export {
  PORTARIA_TIPOS,
  PORTARIA_TIPOS_LABEL,
  PORTARIA_STATUS,
  PORTARIA_STATUS_COLORS,
} from './constants';
