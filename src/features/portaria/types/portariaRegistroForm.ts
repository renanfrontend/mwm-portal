/**
 * PORTARIA REGISTRO - Types do Formulário
 * Define dados que vêm do formulário
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type {
  PortariaTipo,
  PortariaStatus,
  PortariaOrigem,
  TipoDocumento,
  TipoVeiculo,
  PortariaRegistroApiData,
} from './portariaRegistro';

// ============================================================================
// FORM DATA
// ============================================================================

export interface PortariaRegistroFormData {
  tipoRegistro: PortariaTipo;
  data_entrada: Date | string;
  hora_entrada: string;
  data_saida?: Date | string | null;
  hora_saida?: string | null;
  observacoes?: string;
  status?: PortariaStatus;
  origem_entrada?: PortariaOrigem;

  // Dados específicos por tipo
  abastecimento?: PortariaAbastecimentoForm;
  entrega_dejetos?: PortariaEntregaDejetosForm;
  entrega_insumo?: PortariaEntregaInsumoForm;
  expedicao?: PortariaExpedicaoForm;
  visita?: PortariaVisitaForm;
}

// ============================================================================
// TRANSPORTE FORM BASE
// ============================================================================

export interface PortariaTransportFormBase {
  motorista_nome: string;
  cpf_motorista: string;
  motorista_id?: string | null;
  transportadora_id?: string | null;
  transportadora_manual?: string | null;
  veiculo_id?: string | null;
  placa?: string | null;
  placa_manual?: string | null;
  tipo_veiculo: TipoVeiculo;
  peso_inicial?: number | null;
  peso_final?: number | null;
}

// ============================================================================
// ABASTECIMENTO FORM
// ============================================================================

export interface PortariaAbastecimentoForm extends PortariaTransportFormBase {}

// ============================================================================
// ENTREGA DEJETOS FORM
// ============================================================================

export interface PortariaEntregaDejetosForm extends PortariaTransportFormBase {
  produtor_id: string;
  densidade?: string | null;
}

// ============================================================================
// ENTREGA INSUMO FORM
// ============================================================================

export interface PortariaEntregaInsumoForm extends PortariaTransportFormBase {
  empresa: string;
  nota_fiscal?: string | null;
}

// ============================================================================
// EXPEDIÇÃO FORM
// ============================================================================

export interface PortariaExpedicaoForm extends PortariaTransportFormBase {
  nota_fiscal?: string | null;
}

// ============================================================================
// VISITA FORM
// ============================================================================

export interface PortariaVisitaForm {
  visitante_nome: string;
  documento_visitante: string;
  tipo_documento: TipoDocumento;
  visitante_id?: string | null;
  motivo_visita_id?: string | null;
  motivo_manual?: string | null;
  veiculo_id?: string | null;
  placa_manual?: string | null;
  tipo_veiculo: TipoVeiculo;
}

// ============================================================================
// VALIDATION ERROR
// ============================================================================

export interface PortariaRegistroValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PortariaRegistroValidationResult {
  isValid: boolean;
  errors: PortariaRegistroValidationError[];
}

// ============================================================================
// PORTARIA DRAWER FORM STATE
// ============================================================================

/**
 * Estado do formulário do PortariaDrawer
 * Contém todos os campos possíveis do formulário, com tipagem forte
 * Valores podem ser vazios/null para novos registros
 */
export interface PortariaDrawerFormState {
  // ID (para modo edit)
  id?: string | number;

  // Datas e horários
  data: Date | null;
  horario: Date | null;
  dataSaida: Date | null;
  horarioSaida: Date | null;

  // Atividade selecionada
  atividade: string;
  status: PortariaStatus;
  origem_entrada?: PortariaOrigem;
  observacoes?: string;

  // Transportadora (Entrega de Dejetos)
  transportadora: string; // ID da transportadora ou 'outros'
  transportadoraManual: string; // Transportadora digitada manualmente

  // Veículo e Placa (Entrega de Dejetos)
  veiculoId: string; // ID do veículo
  placa: string; // Placa selecionada ou 'Outros'
  placaManual: string; // Placa digitada manualmente

  // Motorista
  motorista: string;
  cpf: string;

  // Tipo de Veículo
  tipoVeiculo: string;

  // Pesos
  pesoInicial: string;
  pesoFinal: string;

  // Produtor (Entrega de Dejetos)
  cooperado: string;

  // Empresa (Entrega de Insumo)
  empresa: string;

  // Nota Fiscal
  notaFiscal: string;

  // Visitante (Visita)
  visitante: string;

  // Motivo (Visita)
  motivo: string;
  motivoManual: string;

  // Densidade (Entrega de Dejetos)
  densidade: string;
}

/**
 * Dados de Entrega de Dejetos extraídos e normalizados
 * Usado internamente para processar dados vindo da API
 */
export interface ExtractedEntregaDejetosData {
  produtorId: string;
  motorista: string;
  cpf: string;
  transportadoraManual: string;
  placaManual: string;
  placa: string;
  veiculoId: string;
  tipoVeiculo: string;
  pesoInicial: string;
  pesoFinal: string;
  densidade: string;
  transportadoraId: string;
}

/**
 * Props do PortariaDrawer
 * Define o contrato (interface) do componente
 */
export interface PortariaDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: PortariaDrawerFormState) => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: PortariaRegistroApiData | null | any;
}
