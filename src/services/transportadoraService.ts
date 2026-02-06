// src/services/transportadoraService.ts

import axios from 'axios';
import type { 
  TransportadoraFormInput, 
  TransportadoraResponse, 
  TransportadoraListResponse,
  AddVeiculoRequest,
  VeiculoResponse 
} from '../types/transportadora';

// URL base da API
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Interceptor para adicionar token (padrão do projeto)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta para logar erros detalhadamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('🔴 Erro de resposta da API (Transportadora):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('🔴 Sem resposta da API (Transportadora):', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      console.error('🔴 Erro ao configurar requisição (Transportadora):', error.message);
    }
    return Promise.reject(error);
  }
);

export const TransportadoraService = {
  /**
   * Lista todas as transportadoras com paginação e busca
   */
  list: async (page: number = 1, pageSize: number = 10, search: string = ''): Promise<TransportadoraListResponse> => {
    const response = await api.get<TransportadoraListResponse>('/logistica/transportadoras', {
      params: { page, pageSize, search }
    });
    return response.data;
  },

  /**
   * Busca uma transportadora por ID
   */
  getById: async (id: string): Promise<TransportadoraResponse> => {
    const response = await api.get<TransportadoraResponse>(`/logistica/transportadoras/${id}`);
    return response.data;
  },

  /**
   * Cria uma nova transportadora
   */
  create: async (payload: TransportadoraFormInput): Promise<TransportadoraResponse> => {
    const response = await api.post<TransportadoraResponse>('/logistica/transportadoras', payload);
    return response.data;
  },

  /**
   * Atualiza uma transportadora existente
   */
  update: async (id: string, payload: TransportadoraFormInput): Promise<TransportadoraResponse> => {
    const response = await api.put<TransportadoraResponse>(`/logistica/transportadoras/${id}`, payload);
    return response.data;
  },

  /**
   * Deleta uma transportadora
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/logistica/transportadoras/${id}`);
  },

  // ========== SUB-RECURSO: VEÍCULOS ==========

  /**
   * Adiciona um veículo a uma transportadora
   */
  addVeiculo: async (transportadoraId: string, veiculo: AddVeiculoRequest): Promise<VeiculoResponse> => {
    const response = await api.post<VeiculoResponse>(
      `/logistica/transportadoras/${transportadoraId}/veiculos`,
      veiculo
    );
    return response.data;
  },

  /**
   * Remove um veículo de uma transportadora
   */
  removeVeiculo: async (transportadoraId: string, veiculoId: string): Promise<void> => {
    await api.delete(`/logistica/transportadoras/${transportadoraId}/veiculos/${veiculoId}`);
  },

  /**
   * Atualiza um veículo de uma transportadora
   */
  updateVeiculo: async (transportadoraId: string, veiculoId: string, veiculo: AddVeiculoRequest): Promise<VeiculoResponse> => {
    const response = await api.put<VeiculoResponse>(
      `/logistica/transportadoras/${transportadoraId}/veiculos/${veiculoId}`,
      veiculo
    );
    return response.data;
  }
};
