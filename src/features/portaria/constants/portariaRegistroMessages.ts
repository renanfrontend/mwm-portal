/**
 * PORTARIA REGISTRO - Mensagens de Sucesso/Info
 * Define constantes para mensagens positivas
 * Data: 24/03/2026
 */

// ============================================================================
// MENSAGENS DE SUCESSO
// ============================================================================

export const PORTARIA_SUCCESS_MESSAGES = {
  CREATE_SUCCESS: 'Registro criado com sucesso',
  UPDATE_SUCCESS: 'Registro atualizado com sucesso',
  DELETE_SUCCESS: 'Registro deletado com sucesso',
  DELETE_MULTIPLE_SUCCESS: 'Registros deletados com sucesso',
  FETCH_SUCCESS: 'Registros carregados com sucesso',
} as const;

// ============================================================================
// MENSAGENS DE CONFIRMAÇÃO
// ============================================================================

export const PORTARIA_CONFIRMATION_MESSAGES = {
  DELETE_CONFIRMATION: 'Tem certeza que deseja deletar este registro?',
  DELETE_MULTIPLE_CONFIRMATION: 'Tem certeza que deseja deletar {count} registros?',
  UNSAVED_CHANGES: 'Existem alterações não salvas. Deseja sair sem salvar?',
} as const;

// ============================================================================
// MENSAGENS INFORMATIVAS
// ============================================================================

export const PORTARIA_INFO_MESSAGES = {
  NO_REGISTROS: 'Nenhum registro encontrado',
  LOADING: 'Carregando registros...',
  EMPTY_STATE: 'Área sem registros',
  VALIDATION_ERROR: 'Preencha todos os campos obrigatórios',
  FORM_SUBMITTING: 'Salvando...',
} as const;

// ============================================================================
// PLACEHOLDERS
// ============================================================================

export const PORTARIA_PLACEHOLDERS = {
  SEARCH: 'Buscar por data, hora, nome, placa...',
  MOTORISTA_NOME: 'Ex: José da Silva',
  CPF: '000.000.000-00',
  VISITANTE_NOME: 'Ex: Mariana Silva',
  DOCUMENTO: '000.000.000-00 ou número do passaporte',
  EMPRESA: 'Ex: Empresa XYZ',
  NOTA_FISCAL: '000000000',
  DENSIDADE: '1000-1050',
  PLACA: 'ABC-1234',
  OBSERVACOES: 'Observações adicionais (opcional)',
} as const;

// ============================================================================
// LABELS DE CAMPOS
// ============================================================================

export const PORTARIA_FIELD_LABELS = {
  // Comum
  data_entrada: 'Data de entrada',
  hora_entrada: 'Hora de entrada',
  data_saida: 'Data de saída',
  hora_saida: 'Hora de saída',
  tipo_registro: 'Tipo de atividade',
  status: 'Status',
  observacoes: 'Observações',

  // Abastecimento
  motorista_nome: 'Nome do motorista',
  cpf_motorista: 'CPF do motorista',
  transportadora: 'Transportadora',
  veiculo: 'Veículo',
  placa: 'Placa',
  tipo_veiculo: 'Tipo de veículo',
  peso_inicial: 'Peso inicial (kg)',
  peso_final: 'Peso final (kg)',

  // Entrega Dejetos
  produtor: 'Produtor',
  densidade: 'Densidade',

  // Entrega Insumo
  empresa: 'Empresa',
  nota_fiscal: 'Nota Fiscal',

  // Visita
  visitante_nome: 'Nome do visitante',
  documento_visitante: 'Documento do visitante',
  tipo_documento: 'Tipo de documento',
  motivo_visita: 'Motivo da visita',
} as const;

// ============================================================================
// DESCRIÇÕES DE CAMPOS
// ============================================================================

export const PORTARIA_FIELD_DESCRIPTIONS: Record<string, string> = {
  motorista_nome: 'Nome completo do motorista responsável',
  cpf_motorista: 'CPF do motorista no formato 000.000.000-00',
  transportadora: 'Transportadora responsável pelo transporte',
  densidade: 'Densidade do material entregue (1000-1050)',
  nota_fiscal: 'Número da nota fiscal do transporte',
  observacoes: 'Informações adicionais sobre o registro',
};
