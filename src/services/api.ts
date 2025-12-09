// src/services/api.ts

import axios from 'axios';
import type { CooperadoItem, TransportadoraItem } from '../types/models';

export type { CooperadoItem, TransportadoraItem };

export type {
  Metric, StockItem, CooperativeAnalysisItem, AbastecimentoItem, DashboardData,
  AbastecimentoSummaryItem, FaturamentoItem, AbastecimentoVolumeItem, AbastecimentoReportItem,
  AbastecimentoVolumePorDiaItem, ColetaItem, CalendarEvent, AgendaItem, AgendaData,
  PortariaItem, QualidadeDejetosItem
} from './mock/api.mock';

import {
  mockFetchCooperadosData,
  mockFetchTransportadorasData, // <--- ÚNICO ADD
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

import type {
  AbastecimentoReportItem, AbastecimentoSummaryItem, AbastecimentoVolumeItem,
  AbastecimentoVolumePorDiaItem, AgendaData, ColetaItem, DashboardData,
  FaturamentoItem, PortariaItem, QualidadeDejetosItem
} from './mock/api.mock';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- FUNÇÕES DE FETCH ---

export const fetchCooperadosData = (): Promise<CooperadoItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchCooperadosData();
  return api.get('/cooperados').then(response => response.data);
};

// --- NOVA FUNÇÃO ---
export const fetchTransportadorasData = (): Promise<TransportadoraItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchTransportadorasData();
  return api.get('/transportadoras').then(response => response.data);
};

export const fetchColetaData = (): Promise<ColetaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchColetaData();
  return api.get('/coletas').then(res => res.data);
};

export const updateColetaItem = (item: ColetaItem): Promise<ColetaItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockUpdateColetaItem(item);
  return api.put(`/coletas/${item.id}`, item).then(res => res.data);
};

export const createColetaItem = (item: any): Promise<ColetaItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockCreateColetaItem(item);
  return api.post('/coletas', item).then(res => res.data);
};

export const fetchAbastecimentoReportData = (s?: string, e?: string): Promise<AbastecimentoReportItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoReportData(s, e);
  return api.get('/abastecimentos/report').then(res => res.data);
};

export const fetchFaturamentoData = (): Promise<FaturamentoItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchFaturamentoData();
  return api.get('/faturamentos').then(res => res.data);
};

export const fetchAbastecimentoVolumeData = (): Promise<AbastecimentoVolumeItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoVolumeData();
  return api.get('/abastecimentos/volume').then(res => res.data);
};

export const fetchAbastecimentoVolumePorDiaData = (s?: string, e?: string): Promise<AbastecimentoVolumePorDiaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoVolumePorDiaData(s, e);
  return api.get('/abastecimentos/volume-dia').then(res => res.data);
};

export const addAbastecimentoReportItem = (item: any): Promise<AbastecimentoReportItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockAddAbastecimentoReportItem(item);
  return api.post('/abastecimentos', item).then(res => res.data);
};

export const fetchDashboardData = (): Promise<DashboardData> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchDashboardData();
  return api.get('/dashboard').then(res => res.data);
};

export const fetchAbastecimentoSummaryData = (s?: string, e?: string): Promise<AbastecimentoSummaryItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoSummaryData(s, e);
  return api.get('/abastecimentos/summary').then(res => res.data);
};

export const fetchPortariaData = (): Promise<PortariaItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchPortariaData();
  return api.get('/portaria').then(res => res.data);
};

export const fetchNewAgendaData = (): Promise<AgendaData[]> => {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') return mockFetchNewAgendaData();
  return api.get('/agenda').then(res => res.data);
};

export const fetchQualidadeDejetosData = (): Promise<QualidadeDejetosItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchQualidadeDejetosData();
  return api.get('/qualidade').then(res => res.data);
};

export const createAnaliseQualidade = (item: any): Promise<QualidadeDejetosItem> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockCreateAnaliseQualidade(item);
  return api.post('/qualidade', item).then(res => res.data);
};

export const fetchAbastecimentoAggregatedVolumeData = (p: any): Promise<AbastecimentoVolumeItem[]> => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return mockFetchAbastecimentoAggregatedVolumeData(p);
  return api.get('/abastecimentos/agg').then(res => res.data);
};