/**
 * PORTARIA REGISTRO - Types de Erro
 * Define tipos e classes de erro
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

// ============================================================================
// CUSTOM ERROR CLASS
// ============================================================================

export class PortariaRegistroError extends Error {
  code: string;
  statusCode?: number;
  details?: any[];

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: any[]
  ) {
    super(message);
    this.name = 'PortariaRegistroError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ============================================================================
// API ERROR RESPONSE
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  message: string;
  code: string;
  statusCode: number;
  timestamp: string;
  details?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// ============================================================================
// ERROR MAPPING
// ============================================================================

export const ERROR_CODES = {
  // Validation errors
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_CPF: 'INVALID_CPF',
  INVALID_TYPE: 'INVALID_TYPE',
  FUTURE_DATE: 'FUTURE_DATE',

  // Business logic errors
  MOTORISTA_REQUIRED: 'MOTORISTA_REQUIRED',
  PRODUTOR_REQUIRED: 'PRODUTOR_REQUIRED',
  VISITANTE_REQUIRED: 'VISITANTE_REQUIRED',
  DENSIDADE_OUT_OF_RANGE: 'DENSIDADE_OUT_OF_RANGE',

  // FK errors
  FK_INVALID: 'FK_INVALID',
  MOTORISTA_NOT_FOUND: 'MOTORISTA_NOT_FOUND',
  PRODUTOR_NOT_FOUND: 'PRODUTOR_NOT_FOUND',
  TRANSPORTADORA_NOT_FOUND: 'TRANSPORTADORA_NOT_FOUND',
  VEICULO_NOT_FOUND: 'VEICULO_NOT_FOUND',
  MOTIVO_VISITA_NOT_FOUND: 'MOTIVO_VISITA_NOT_FOUND',

  // API errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
