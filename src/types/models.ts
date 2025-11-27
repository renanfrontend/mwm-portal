// src/types/models.ts

// Interface para um item de usuário mockado
export interface MockUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'administrador' | 'editor' | 'leitor';
  filiais?: string[];
}

// Tipo para os cards de métricas no topo do dashboard
export interface Metric {
  id: number;
  icon: string;
  label: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  unit?: string;
}

// Tipo para cada item na lista de estoque
export interface StockItem {
  id: number;
  label: string;
  value: number;
  capacity: number;
  unit: string;
  color:
    | "is-primary"
    | "is-link"
    | "is-info"
    | "is-success"
    | "is-warning"
    | "is-danger";
}

// Tipo para os dados do gráfico de Análise de Cooperados
export interface CooperativeAnalysisItem {
  name: string;
  value: number;
  color: string;
}

// Tipo para os dados do gráfico de Abastecimento por Veículo
export interface AbastecimentoItem {
  veiculo: string;
  m3: number;
}

// Estrutura completa dos dados do dashboard
export interface DashboardData {
  metrics: Metric[];
  stock: StockItem[];
  cooperativeAnalysis: CooperativeAnalysisItem[];
  abastecimentos?: AbastecimentoItem[];
}

// Tipo para o sumário de abastecimento
export interface AbastecimentoSummaryItem {
  veiculo: string;
  placa: string;
  volumeTotal: number;
}

// Tipos e dados mockados para Faturamentos
export interface FaturamentoItem {
  name: string;
  faturamento: number;
  label: string;
}

// Tipos e dados mockados para Abastecimentos
export interface AbastecimentoVolumeItem {
  name: string;
  volume: number;
}

export interface AbastecimentoReportItem {
  status: string;
  cliente: string;
  veiculo: string;
  placa: string;
  data: string;
  horaInicio: string;
  horaTermino: string;
  volume: number;
  odometro: number;
  usuario: string;
  produto: string;
}

// Tipo para o volume de abastecimento por dia
export interface AbastecimentoVolumePorDiaItem {
  data: string;
  volumeTotal: number;
}

// Interface para um item da lista de coleta
export interface ColetaItem {
  id: string; // Usar UUID para ID único
  cooperado: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  odometro: number;
  dataPrevisao: string;
  horaPrevisao: string;
  status: "Pendente" | "Entregue" | "Atrasado";
}

// Interface para um item de Cooperado
export interface CooperadoItem {
  id: string;
  matricula: number;
  filial: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  certificado: "Ativo" | "Inativo";
  doamDejetos: "Sim" | "Não";
  fase: string;
}

// Novo tipo para os eventos do calendário
export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

// Novo tipo para os dados da agenda customizada
export interface AgendaItem {
  id: number;
  cooperado: string;
  filial: "Primato" | "Agrocampo";
  coletas: { date: string; value: number | null; fullDate: string }[];
  somaColetas: number;
  km: number;
}

export interface AgendaData {
  id: number;
  cooperado: string;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  qtd: number;
  km: number;
  transportadora: "Primato" | "Agrocampo";
  status: "Realizado" | "Planejado";
}

// Interface da Portaria Atualizada
export interface PortariaItem {
  id: string;
  categoria: 'Entregas' | 'Abastecimentos' | 'Coletas' | 'Visitas';
  data: string;
  horario: string;
  empresa: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  atividade: string;
  
  // Status atualizado para incluir os passos
  status: 'Concluído' | 'Pendente' | 'Em processo' | 'Pesagem';
  
  // Campos novos (opcionais) que adicionamos
  cpf_cnpj?: string;
  balancaEntrada?: string;
  balancaSaida?: string;
}


export interface QualidadeDejetosItem {
  id: string;
  dataColeta: string;
  cooperado: string; 
  placa: string; 
  ph: number | string;
  densidade: number | string;
  entregaReferencia?: string;
  id_recipiente_amostra?: string;
  id_recipiente_duplicata?: string;
  peso_recip_amostra?: string;
  peso_recip_duplicata?: string;
  pesagem_p2_amostra?: string;
  pesagem_p2_duplicata?: string;
  pesagem_p3_amostra?: string;
  recip_st_duplicata?: string;
  pesagem_p4_amostra?: string;
  recip_sf_duplicata?: string;
}

export interface CooperadoItem {
  id: string;
  matricula: number;
  filial: string; // Isso será usado como "Transportadora"
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  certificado: "Ativo" | "Inativo";
  doamDejetos: "Sim" | "Não";
  fase: string;
  
  // --- NOVOS CAMPOS PARA O FORMULÁRIO COMPLETO ---
  cpfCnpj?: string;
  cabecasAlojadas?: string | number;
  tecnico?: string;
  telefone?: string;
  numPropriedade?: string;
  numEstabelecimento?: string;
  municipio?: string;
  latitude?: string;
  longitude?: string;
}