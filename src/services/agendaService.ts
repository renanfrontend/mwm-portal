// src/services/agendaService.ts

import axios from 'axios';
import type { AgendaPlanejadaDiaPayload, AgendaPlanejadaSemanaResponse } from '../types/agenda';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('🔴 Erro de resposta da API (Agenda):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('🔴 Sem resposta da API (Agenda):', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      console.error('🔴 Erro ao configurar requisição (Agenda):', error.message);
    }
    return Promise.reject(error);
  }
);

export const AgendaService = {
  listPlanejadoSemana: async (
    idBioplanta: number,
    idFiliada: number,
    dataInicio: string,
    dataFim: string
  ): Promise<AgendaPlanejadaSemanaResponse> => {
    const response = await api.get<AgendaPlanejadaSemanaResponse>('/agenda/planejado/semana', {
      params: { idBioplanta, idFiliada, dataInicio, dataFim }
    });
    return response.data;
  },

  savePlanejadoDia: async (payload: AgendaPlanejadaDiaPayload): Promise<void> => {
    await api.post('/agenda/planejado/dia', payload);
  },

  copiarSemana: async (payload: {
    idBioplanta: number;
    idFiliada: number;
    dataInicioOrigem: string;
    dataInicioDestino: string;
    idsEstabelecimentos: number[];
  }): Promise<void> => {
    await api.post('/agenda/planejado/copiar', payload);
  },

  limparSemana: async (payload: {
    idBioplanta: number;
    idFiliada: number;
    dataInicio: string;
    dataFim: string;
    idsEstabelecimentos: number[];
  }): Promise<void> => {
    await api.post('/agenda/planejado/limpar-semana', payload);
  },

  verificarDadosSemana: async (
    idBioplanta: number,
    idFiliada: number,
    dataInicio: string,
    dataFim: string
  ): Promise<boolean> => {
    const response = await api.get<boolean>('/agenda/planejado/existe-dados', {
      params: { idBioplanta, idFiliada, dataInicio, dataFim }
    });
    return response.data;
  }
};
