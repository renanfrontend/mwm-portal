/**
 * PORTARIA REGISTRO - Mensagens de Erro
 * Define constantes para mensagens de erro
 * Data: 24/03/2026
 */

// ============================================================================
// MENSAGENS DE ERRO DE VALIDAÇÃO
// ============================================================================

export const PORTARIA_VALIDATION_ERRORS = {
  TIPO_OBRIGATORIO: 'Tipo de registro é obrigatório',
  DATA_OBRIGATORIA: 'Data é obrigatória',
  HORA_OBRIGATORIA: 'Hora é obrigatória',
  MOTORISTA_OBRIGATORIO: 'Motorista é obrigatório para abastecimento',
  CPF_OBRIGATORIO: 'CPF é obrigatório',
  CPF_INVALIDO: 'CPF deve estar no formato 000.000.000-00',
  PRODUTOR_OBRIGATORIO: 'Produtor é obrigatório para entrega de dejetos',
  VISITANTE_OBRIGATORIO: 'Nome do visitante é obrigatório',
  DOCUMENTO_OBRIGATORIO: 'Documento do visitante é obrigatório',
  EMPRESA_OBRIGATORIA: 'Empresa é obrigatória para entrega de insumo',
  NOTA_FISCAL_OBRIGATORIA: 'Nota fiscal é obrigatória',
  TIPO_VEICULO_OBRIGATORIO: 'Tipo de veículo é obrigatório',
  DATA_FUTURA: 'Data não pode ser no futuro',
  HORA_INVALIDA: 'Hora deve estar no formato HH:mm',
  DENSIDADE_INVALIDA: 'Densidade deve estar entre 1000 e 1050',
  DATA_SAIDA_ANTES_ENTRADA: 'Data de saída não pode ser antes da entrada',
} as const;

// ============================================================================
// MENSAGENS DE ERRO DE API
// ============================================================================

export const PORTARIA_API_ERRORS = {
  FETCH_FAILED: 'Erro ao buscar registros',
  CREATE_FAILED: 'Erro ao criar registro',
  UPDATE_FAILED: 'Erro ao atualizar registro',
  DELETE_FAILED: 'Erro ao deletar registro',
  DELETE_MULTIPLE_FAILED: 'Erro ao deletar registros',
  FETCH_BY_ID_FAILED: 'Erro ao buscar registro',
  UNKNOWN_ERROR: 'Erro desconhecido ao processar solicitação',
  NETWORK_ERROR: 'Erro de conexão com servidor',
  TIMEOUT_ERROR: 'Tempo limite excedido na requisição',
  NOT_FOUND: 'Registro não encontrado',
  UNAUTHORIZED: 'Sem autorização para executar esta ação',
  FORBIDDEN: 'Acesso negado',
  CONFLICT: 'Conflito ao processar solicitação',
  SERVER_ERROR: 'Erro no servidor',
} as const;

// ============================================================================
// MENSAGENS DE ERRO GENÉRICAS
// ============================================================================

export const PORTARIA_GENERIC_ERRORS = {
  INVALID_DATA: 'Dados inválidos',
  INVALID_FORMAT: 'Formato inválido',
  INVALID_DATE: 'Data inválida',
  INVALID_TYPE: 'Tipo inválido',
  FK_INVALID: 'Referência inválida',
  REQUIRED_FIELD: 'Campo obrigatório',
} as const;

// ============================================================================
// MAPEAMENTO DE ERROS
// ============================================================================

export const PORTARIA_ERROR_MESSAGES: Record<string, string> = {
  // Validation
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_FORMAT: 'Formato inválido',
  INVALID_DATE: 'Data inválida',
  INVALID_CPF: 'CPF inválido',
  INVALID_TYPE: 'Tipo inválido',
  FUTURE_DATE: 'Data não pode ser no futuro',

  // Business logic
  MOTORISTA_REQUIRED: 'Motorista é obrigatório',
  PRODUTOR_REQUIRED: 'Produtor é obrigatório',
  VISITANTE_REQUIRED: 'Visitante é obrigatório',
  DENSIDADE_OUT_OF_RANGE: 'Densidade deve estar entre 1000 e 1050',

  // FK errors
  FK_INVALID: 'Referência inválida',
  MOTORISTA_NOT_FOUND: 'Motorista não encontrado',
  PRODUTOR_NOT_FOUND: 'Produtor não encontrado',
  TRANSPORTADORA_NOT_FOUND: 'Transportadora não encontrada',
  VEICULO_NOT_FOUND: 'Veículo não encontrado',
  MOTIVO_VISITA_NOT_FOUND: 'Motivo de visita não encontrado',

  // API errors
  NETWORK_ERROR: 'Erro de conexão',
  SERVER_ERROR: 'Erro no servidor',
  NOT_FOUND: 'Registro não encontrado',
  UNAUTHORIZED: 'Sem autenticac ão',
  FORBIDDEN: 'Acesso negado',
  CONFLICT: 'Conflito ao processar',
  UNKNOWN_ERROR: 'Erro desconhecido',
};
