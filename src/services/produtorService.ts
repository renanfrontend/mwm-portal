import axios from 'axios';
import type { CooperadoAPIInput, CooperadoResponse, ProdutorListResponse } from '../types/cooperado';

// URL base da API
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Interceptor para adicionar token se necessário (copiado do padrão do projeto)
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
      // O servidor respondeu com status fora de 2xx
      console.error('🔴 Erro de resposta da API:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('🔴 Sem resposta da API:', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      // Erro ao configurar a requisição
      console.error('🔴 Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export const ProdutorService = {
  list: async (plantaId: number, filiadaId: number, page: number = 1, pageSize: number = 9999): Promise<ProdutorListResponse> => {
    const response = await api.get<ProdutorListResponse>('/logistica/produtores', {
      params: { plantaId, filiadaId, page, pageSize }
    });
    return response.data;
  },

  create: async (payload: CooperadoAPIInput): Promise<CooperadoResponse> => {
    const response = await api.post<CooperadoResponse>('/logistica/produtores', payload);
    return response.data;
  },

  update: async (id: number, payload: CooperadoAPIInput): Promise<CooperadoResponse> => {
    const response = await api.put<CooperadoResponse>(`/logistica/produtores/${id}`, payload);
    return response.data;
  },

  getById: async (id: number): Promise<CooperadoResponse> => {
    const response = await api.get<CooperadoResponse>(`/logistica/produtores/${id}`);
    return response.data;
  }
};
