// src/services/api.ts
import axios from 'axios';

// Exporta os tipos para a aplicação
export type {
  Metric,
  StockItem,
  CooperativeAnalysisItem,
  AbastecimentoItem,
  DashboardData,
  AbastecimentoSummaryItem,
  FaturamentoItem,
  AbastecimentoVolumeItem,
  AbastecimentoReportItem,
  AbastecimentoVolumePorDiaItem,
  ColetaItem,
  CooperadoItem,
  CalendarEvent,
  AgendaItem,
  AgendaData,
  PortariaItem,
  QualidadeDejetosItem,
} from './mock/api.mock';

// Importação das funções mock
import {
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
  mockFetchAbastecimentoSummaryData, 
  mockFetchPortariaData, 
  mockFetchNewAgendaData, 
  mockFetchQualidadeDejetosData, 
  mockCreateAnaliseQualidade
} from './mock/api.mock';

// Importação dos tipos
import type {
  AbastecimentoReportItem,
  AbastecimentoSummaryItem,
  AbastecimentoVolumeItem,
  AbastecimentoVolumePorDiaItem,
  AgendaData,
  ColetaItem,
  CooperadoItem,
  DashboardData,
  FaturamentoItem,
  PortariaItem,
  QualidadeDejetosItem
} from './mock/api.mock';

// Cria uma instância do axios para a API
// Garante que aponta para a porta 8081 onde o backend está rodando
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// --- INTERCEPTOR DE SEGURANÇA ---
// Injeta o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --------------------------------

// --- FUNÇÕES DA API ---

export const fetchCooperadosData = (): Promise<CooperadoItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchCooperadosData();
  return api.get('/cooperados').then(response => response.data);
};

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

export const fetchPortariaData = (): Promise<PortariaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchPortariaData();
  return api.get('/portaria').then(response => response.data);
};

export const fetchNewAgendaData = (): Promise<AgendaData[]> => { 
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchNewAgendaData();
  return api.get('/agenda').then(response => response.data);
};

export const fetchQualidadeDejetosData = (): Promise<QualidadeDejetosItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchQualidadeDejetosData();
  return api.get('/qualidade-dejetos').then(response => response.data);
};

export const createAnaliseQualidade = (analise: Partial<QualidadeDejetosItem>): Promise<QualidadeDejetosItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockCreateAnaliseQualidade(analise);
  return api.post('/qualidade-dejetos', analise).then(response => response.data);
};

export const fetchAbastecimentoAggregatedVolumeData = (
  period: "day" | "week" | "month"
): Promise<AbastecimentoVolumeItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoAggregatedVolumeData(period);
  return api.get('/abastecimentos/aggregated-volume', { params: { period } }).then(response => response.data);
};