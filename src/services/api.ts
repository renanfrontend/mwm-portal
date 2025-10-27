// src/services/api.ts
import axios from 'axios';
import {
  type Metric,
  type StockItem,
  type CooperativeAnalysisItem,
  type AbastecimentoItem,
  type DashboardData,
  type AbastecimentoSummaryItem,
  type FaturamentoItem,
  type AbastecimentoVolumeItem,
  type AbastecimentoReportItem,
  type AbastecimentoVolumePorDiaItem,
  type ColetaItem,
  type CooperadoItem,
  type CalendarEvent,
  type AgendaItem,
  type AgendaData,
  type PortariaItem,
  type QualidadeDejetosItem,
  mockFetchCooperadosData,
  mockFetchColetaData,
  mockUpdateColetaItem,
  mockCreateColetaItem,
  mockFetchAbastecimentoReportData,
  mockFetchAbastecimentoVolumePorDiaData,
  mockAddAbastecimentoReportItem,
  mockFetchAbastecimentoAggregatedVolumeData,
  mockFetchFaturamentoData,
  mockFetchAbastecimentoVolumeData,
  mockFetchDashboardData,
  mockFetchAbastecimentoSummaryData, mockFetchPortariaData, mockFetchNewAgendaData, mockFetchQualidadeDejetosData, mockCreateAnaliseQualidade
} from './mock/api.mock';

// Cria uma instância do axios para a API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

/**
 * Dados Mockados
 */
/* Os dados mockados são mantidos para referência ou para testes, mas não são mais usados pelas funções da API.
let abastecimentoReportMockData: AbastecimentoReportItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:09:21",
    horaTermino: "17:09:21",
    volume: 134.56,
    odometro: 391396,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:08:56",
    horaTermino: "17:08:56",
    volume: 157.66,
    odometro: 370306,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:05:53",
    horaTermino: "17:05:53",
    volume: 166.03,
    odometro: 381134,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:05:32",
    horaTermino: "17:05:33",
    volume: 206.63,
    odometro: 384328,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:04:57",
    horaTermino: "17:04:58",
    volume: 136.78,
    odometro: 390768,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:04:10",
    horaTermino: "17:04:10",
    volume: 94.72,
    odometro: 370055,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:03:29",
    horaTermino: "17:03:30",
    volume: 171.27,
    odometro: 534723,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:03:01",
    horaTermino: "17:03:01",
    volume: 107.41,
    odometro: 399801,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C54",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:02:32",
    horaTermino: "17:02:33",
    volume: 30.46,
    odometro: 394095,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C54",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:02:04",
    horaTermino: "17:02:05",
    volume: 94.72,
    odometro: 389858,
    usuario: "vanessa",
  },
];*/

/*const faturamentoMockData: FaturamentoItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  { name: "Janeiro", faturamento: 2774.38, label: "3.50" },
  { name: "Fevereiro", faturamento: 2637.99, label: "3.72" },
  { name: "Março", faturamento: 5027.0, label: "3.70" },
  { name: "Abril", faturamento: 3847.0, label: "3.60" },
  { name: "Maio", faturamento: 5122.71, label: "3.50" },
  { name: "Junho", faturamento: 18231.53, label: "3.46" },
  { name: "Julho", faturamento: 26145.7, label: "3.46" },
  { name: "Agosto", faturamento: 30948.37, label: "3.47" },
  { name: "Setembro", faturamento: 0, label: "0.0" },
  { name: "Outubro", faturamento: 0, label: "0.0" },
  { name: "Novembro", faturamento: 0, label: "0.0" },
  { name: "Dezembro", faturamento: 0, label: "0.0" },
];*/

/*const abastecimentoMockData: AbastecimentoItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  { veiculo: "Veículo 1", m3: 2500 },
  { veiculo: "Veículo 2", m3: 1500 },
  { veiculo: "Veículo 3", m3: 800 },
  { veiculo: "Veículo 4", m3: 4200 },
  { veiculo: "Veículo 5", m3: 1000 },
];*/

/*const mockData: DashboardData = { // REMOVIDO: Movido para mock/api.mock.ts
  metrics: [
    {
      id: 1,
      icon: "density_medium",
      label: "Densidade dos dejetos",
      value: 1014,
      trend: "up",
    },
    {
      id: 2,
      icon: "water_drop",
      label: "Volume recebido",
      value: "34.6M",
      trend: "up",
      unit: "M³",
    },
    {
      id: 3,
      icon: "timer",
      label: "TMO diário",
      value: "16:00:00",
      trend: "up",
    },
    {
      id: 4,
      icon: "power_settings_new",
      label: "Status operacional",
      value: "Operando",
      trend: "up",
    },
  ],
  stock: [
    {
      id: 1,
      label: "Fertilizantes",
      value: 74480,
      capacity: 78400,
      unit: "t",
      color: "is-link",
    },
    {
      id: 2,
      label: "Bio Metano",
      value: 65000,
      capacity: 100000,
      unit: "M³",
      color: "is-success",
    },
    {
      id: 3,
      label: "CO₂",
      value: 38000,
      capacity: 100000,
      unit: "M³",
      color: "is-warning",
    },
  ],
  cooperativeAnalysis: [
    { name: "Ademir E.", value: 2.5, color: "#334bff" },
    { name: "Ademir M.", value: 2.5, color: "#334bff" },
    { name: "Ademir R.", value: 3.5, color: "#334bff" },
    { name: "André S.", value: -1.5, color: "#ef4444" },
    { name: "Arsênio W.", value: 3.5, color: "#334bff" },
    { name: "Carlos P.", value: 2.5, color: "#334bff" },
    { name: "Clarindo M.", value: -0.5, color: "#ef4444" },
    { name: "Delcio R.", value: 2.5, color: "#334bff" },
    { name: "Divino", value: 1.5, color: "#334bff" },
    { name: "Ederson D.", value: 3.5, color: "#334bff" },
    { name: "Egon P.", value: 1.5, color: "#334bff" },
    { name: "Fazenda E.", value: 0.5, color: "#334bff" },
    { name: "Francisco", value: -1.5, color: "#ef4444" },
    { name: "Gelson R.", value: 3.5, color: "#334bff" },
    { name: "Gilberto", value: 1.5, color: "#334bff" },
    { name: "Gilmar P.", value: -0.5, color: "#ef4444" },
    { name: "Guido D.", value: 1.5, color: "#334bff" },
    { name: "Jacir M.", value: 5.5, color: "#334bff" },
    { name: "Jose F.", value: 1.5, color: "#334bff" },
    { name: "Ladir N.", value: 3.5, color: "#334bff" },
    { name: "Ladir R.", value: 3.5, color: "#334bff" },
    { name: "Laurindo M.", value: 3.5, color: "#334bff" },
    { name: "Marcelo", value: 3.5, color: "#334bff" },
    { name: "Marcos C.", value: 3.5, color: "#334bff" },
    { name: "Marcos S.", value: 7.5, color: "#334bff" },
    { name: "Marina K.", value: 2.5, color: "#334bff" },
    { name: "Marines C.", value: 3.5, color: "#334bff" },
    { name: "Marlise K.", value: 2.5, color: "#334bff" },
    { name: "Nelson B.", value: 4.5, color: "#334bff" },
    { name: "Oswaldo G.", value: 4.5, color: "#334bff" },
    { name: "Renato I.", value: 1.5, color: "#334bff" },
  ],
  abastecimentos: [],
};*/

/*let mockColetaData: ColetaItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  {
    id: "1",
    cooperado: "Primato",
    motorista: "Luiz Carlos",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    odometro: 123456,
    dataPrevisao: "2025-01-01",
    horaPrevisao: "15:00",
    status: "Pendente",
  },
  {
    id: "2",
    cooperado: "Primato",
    motorista: "Marcos Paulo",
    tipoVeiculo: "Caminhão de ração",
    placa: "XYZ-4567",
    odometro: 234567,
    dataPrevisao: "2025-01-02",
    horaPrevisao: "10:00",
    status: "Entregue",
  },
  {
    id: "3",
    cooperado: "Primato",
    motorista: "Ana Cássia",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "GHI-7890",
    odometro: 345678,
    dataPrevisao: "2025-01-03",
    horaPrevisao: "11:30",
    status: "Atrasado",
  },
];*/

/*let mockCooperadosData: CooperadoItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  {
    id: "1",
    matricula: 102646,
    filial: "Primato",
    motorista: "Renato Ivan",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Inativo",
    doamDejetos: "Não",
    fase: "Fase Term. Firmesa",
  },
  {
    id: "2",
    matricula: 102284,
    filial: "Primato",
    motorista: "Ademir Machioro",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "GRSC",
  },
  {
    id: "3",
    matricula: 103034,
    filial: "Primato",
    motorista: "Carlos Jaime Pauly",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "Fase Crecjário",
  },
  {
    id: "4",
    matricula: 100173,
    filial: "Primato",
    motorista: "Clarindo Mazzarollo",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "UPD",
  },
];*/

export const fetchCooperadosData = (): Promise<CooperadoItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchCooperadosData();
  return api.get('/cooperados').then(response => response.data);
};

/*const newMockAgendaData: AgendaData[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  {
    id: 1,
    cooperado: "Ademir Engelsing",
    transportadora: "Primato",
    seg: 0,
    ter: 2,
    qua: 0,
    qui: 0,
    sex: 0,
    qtd: 2,
    km: 300,
    status: "Realizado",
  },
  {
    id: 2,
    cooperado: "Ademir Marchioro",
    transportadora: "Primato",
    seg: 4,
    ter: 2,
    qua: 0,
    qui: 4,
    sex: 0,
    qtd: 10,
    km: 300,
    status: "Realizado",
  },
  {
    id: 3,
    cooperado: "Arseno Weschendeider",
    transportadora: "Primato",
    seg: 10,
    ter: 4,
    qua: 4,
    qui: 6,
    sex: 0,
    qtd: 34,
    km: 300,
    status: "Realizado",
  },
  {
    id: 4,
    cooperado: "Carlos Jaime Pauly",
    transportadora: "Primato",
    seg: 10,
    ter: 9,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 49,
    km: 300,
    status: "Realizado",
  },
  {
    id: 5,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
  {
    id: 6,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
  {
    id: 7,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
];*/

export const fetchColetaData = (): Promise<ColetaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchColetaData();
  return api.get('/coletas').then(response => response.data);
};

export const updateColetaItem = (item: ColetaItem): Promise<ColetaItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockUpdateColetaItem(item);
  return api.put(`/coletas/${item.id}`, item).then(response => response.data);
};

export const createColetaItem = (
  item: Omit<ColetaItem, "id">
): Promise<ColetaItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockCreateColetaItem(item);
  return api.post('/coletas', item).then(response => response.data);
};

export const fetchAbastecimentoReportData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoReportItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoReportData(startDate, endDate);
  return api.get('/abastecimentos/report', { params: { startDate, endDate } }).then(response => response.data);
};

export const fetchFaturamentoData = (): Promise<FaturamentoItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchFaturamentoData();
  return api.get('/faturamentos').then(response => response.data);
};

export const fetchAbastecimentoVolumeData = (): Promise<
  AbastecimentoVolumeItem[]
> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoVolumeData();
  return api.get('/abastecimentos/volume-por-mes').then(response => response.data);
};

export const fetchAbastecimentoVolumePorDiaData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoVolumePorDiaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoVolumePorDiaData(startDate, endDate);
  return api.get('/abastecimentos/volume-por-dia', { params: { startDate, endDate } }).then(response => response.data);
};

export const addAbastecimentoReportItem = (
  item: Omit<AbastecimentoReportItem, "status" | "cliente" | "horaTermino">
): Promise<AbastecimentoReportItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockAddAbastecimentoReportItem(item);
  return api.post('/abastecimentos/report', item).then(response => response.data);
};

export const fetchDashboardData = (): Promise<DashboardData> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchDashboardData();
  return api.get('/dashboard').then(response => response.data);
};

export const fetchAbastecimentoSummaryData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoSummaryItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoSummaryData(startDate, endDate);
  return api.get('/abastecimentos/summary', { params: { startDate, endDate } }).then(response => response.data);
};


/**
 * Novos Dados Mockados para a Portaria
 */
/*const mockPortariaData: PortariaItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  { id: 'ENT-001', categoria: 'Entregas', data: '01/01/2026', horario: '10:00H', empresa: 'Primato', motorista: 'Ademir Engelsing', tipoVeiculo: 'Caminhão de dejetos', placa: 'ABC-1D23', atividade: 'Entrega de dejetos', status: 'Concluído' },
  { id: 'ENT-002', categoria: 'Entregas', data: '01/01/2026', horario: '13:00H', empresa: 'Mosaic', motorista: 'Renato Ivan', tipoVeiculo: 'Caminhão de entrega', placa: 'ABC-1D23', atividade: 'Entrega de materiais', status: 'Pendente' },
  { id: 'ABS-001', categoria: 'Abastecimentos', data: '02/01/2026', horario: '09:30H', empresa: 'Transportadora XYZ', motorista: 'Carlos Silva', tipoVeiculo: 'Caminhão Tanque', placa: 'DEF-4567', atividade: 'Abastecimento de Diesel', status: 'Concluído' },
];*/

/**
 * Nova Função Fetch para a Portaria
 */
export const fetchPortariaData = (): Promise<PortariaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchPortariaData();
  return api.get('/portaria').then(response => response.data);
};

/**
 * Nova Função Fetch (que estava faltando)
 */
export const fetchNewAgendaData = (): Promise<AgendaData[]> => { // Renomeado de fetchAgendaData para fetchNewAgendaData
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchNewAgendaData();
  return api.get('/agenda').then(response => response.data);
};

/**
 * Novos Dados Mockados para Qualidade
 */
/*let mockQualidadeDejetosData: QualidadeDejetosItem[] = [ // REMOVIDO: Movido para mock/api.mock.ts
  { id: 'DEJ-001', dataColeta: '13/10/2025', cooperado: 'Ademir Engelsing', placa: 'ABC-1D23', ph: 7.2, densidade: 1025, entregaReferencia: 'ENT-54321' },
  { id: 'DEJ-002', dataColeta: '13/10/2025', cooperado: 'Ademir Marchioro', placa: 'DEF-4567', ph: 7.5, densidade: 'N/A', entregaReferencia: 'ENT-54322' },
];*/

/**
 * Função Fetch para a Qualidade dos Dejetos
 */
export const fetchQualidadeDejetosData = (): Promise<QualidadeDejetosItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchQualidadeDejetosData();
  return api.get('/qualidade-dejetos').then(response => response.data);
};

/**
 * Função para CRIAR uma Análise de Qualidade (simulação)
 */
export const createAnaliseQualidade = (analise: Partial<QualidadeDejetosItem>): Promise<QualidadeDejetosItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockCreateAnaliseQualidade(analise);
  return api.post('/qualidade-dejetos', analise).then(response => response.data);
};

type Period = "day" | "week" | "month";

export const fetchAbastecimentoAggregatedVolumeData = (
  period: Period
): Promise<AbastecimentoVolumeItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoAggregatedVolumeData(period);
  return api.get('/abastecimentos/aggregated-volume', { params: { period } }).then(response => response.data);
};