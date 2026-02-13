// src/services/filiadaService.ts

import axios from 'axios';

export interface FiliadaOption {
  id: number;
  codigo_filiada: string;
  nome: string;
  estado: string;
  cidade: string;
}

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
      console.error('🔴 Erro de resposta da API (Filiada):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('🔴 Sem resposta da API (Filiada):', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      console.error('🔴 Erro ao configurar requisição (Filiada):', error.message);
    }
    return Promise.reject(error);
  }
);

export const FiliadaService = {
  /**
   * Lista todas as filiadas ativas
   */
  list: async (): Promise<FiliadaOption[]> => {
    console.log('📡 Buscando filiadas da API...');
    const response = await api.get<FiliadaOption[]>('/filiadas');
    console.log('📡 Resposta da API de filiadas:', response.data);
    return response.data;
  }
};