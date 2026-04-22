/**
 * PORTARIA REGISTRO - Exports de Types
 * Centraliza todos os tipos do módulo
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

// Tipos principais
export type {
  PortariaTipo,
  PortariaStatus,
  PortariaOrigem,
  TipoDocumento,
  TipoVeiculo,
  PortariaRegistro,
  PortariaAbastecimento,
  PortariaEntregaDejetos,
  PortariaEntregaInsumo,
  PortariaExpedicao,
  PortariaVisita,
  PortariaRegistroResponse,
  PortariaRegistroSingleResponse,
  PortariaRegistroTableRow,
  PortariaRegistroApiData,
  PortariaRegistroError as PortariaRegistroErrorType,
  PortariaRegistroState,
} from './portariaRegistro';

// Tipos de filtros
export type {
  PortariaRegistroFilters,
  PortariaRegistroListRequest,
} from './portariaRegistroFilters';

// Tipos de formulário
export type {
  PortariaRegistroFormData,
  PortariaAbastecimentoForm,
  PortariaEntregaDejetosForm,
  PortariaEntregaInsumoForm,
  PortariaExpedicaoForm,
  PortariaVisitaForm,
  PortariaRegistroValidationError,
  PortariaRegistroValidationResult,
  PortariaDrawerFormState,
  ExtractedEntregaDejetosData,
  PortariaDrawerProps,
} from './portariaRegistroForm';

export type {
  PortariaDeleteTransportOrigin,
  PortariaAbastecimentoDeletePayload,
  PortariaEntregaDejetosDeletePayload,
  PortariaRegistroDeletePayload,
  PortariaRegistroDeleteContext,
} from './portariaRegistroDelete';

// Tipos e classes de erro
export {
  PortariaRegistroError,
  ERROR_CODES,
} from './portariaRegistroErrors';

export type {
  ApiErrorResponse,
  ErrorCode,
} from './portariaRegistroErrors';
