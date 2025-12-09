// src/types/models.ts

export interface MockUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'administrador' | 'editor' | 'leitor';
  filiais?: string[];
}

export interface Metric {
  id: number;
  icon: string;
  label: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  unit?: string;
}

export interface StockItem {
  id: number;
  label: string;
  value: number;
  capacity: number;
  unit: string;
  color: "is-primary" | "is-link" | "is-info" | "is-success" | "is-warning" | "is-danger";
}

export interface CooperativeAnalysisItem {
  name: string;
  value: number;
  color: string;
}

export interface AbastecimentoItem {
  veiculo: string;
  m3: number;
}

export interface DashboardData {
  metrics: Metric[];
  stock: StockItem[];
  cooperativeAnalysis: CooperativeAnalysisItem[];
  abastecimentos?: AbastecimentoItem[];
}

export interface AbastecimentoSummaryItem {
  veiculo: string;
  placa: string;
  volumeTotal: number;
}

export interface FaturamentoItem {
  name: string;
  faturamento: number;
  label: string;
}

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

export interface AbastecimentoVolumePorDiaItem {
  data: string;
  volumeTotal: number;
}

export interface ColetaItem {
  id: string;
  cooperado: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  odometro: number;
  dataPrevisao: string;
  horaPrevisao: string;
  status: "Pendente" | "Entregue" | "Atrasado";
}

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
  // Novos campos
  cpfCnpj?: string;
  cabecasAlojadas?: string | number;
  tecnico?: string;
  telefone?: string;
  numPropriedade?: string;
  numEstabelecimento?: string;
  municipio?: string;
  latitude?: string;
  longitude?: string;
  distancia?: string;
  responsavel?: string;
  emailResponsavel?: string;
  telefoneTecnico?: string;
  emailTecnico?: string;
  modalidade?: string;
}

// --- INTERFACES PARA TRANSPORTADORA (NOVO) ---
export interface ContactInfo {
  nome: string;
  telefone: string;
  email: string;
}

export interface VeiculoInfo {
  tipo: string;
  capacidade: string;
}

export interface TransportadoraItem {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  endereco?: string;
  categoria?: string;
  // Detalhes
  contatoPrincipal?: ContactInfo;
  contatoComercial?: ContactInfo;
  contatoFinanceiro?: ContactInfo;
  contatoJuridico?: ContactInfo;
  veiculos?: VeiculoInfo[];
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

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
  status: 'Concluído' | 'Pendente' | 'Em processo' | 'Pesagem';
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