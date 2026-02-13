// src/services/categoriaService.ts

import axios from 'axios';

export interface CategoriaOption {
  id: number;
  label: string;
  value: string;
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
      console.error('🔴 Erro de resposta da API (Categoria):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('🔴 Sem resposta da API (Categoria):', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      console.error('🔴 Erro ao configurar requisição (Categoria):', error.message);
    }
    return Promise.reject(error);
  }
);

export const CategoriaService = {
  /**
   * Lista todas as categorias de transportadora
   */
  list: async (): Promise<CategoriaOption[]> => {
    console.log('📡 Buscando categorias da API...');
    const response = await api.get<CategoriaOption[]>('/categoria');
    console.log('📡 Resposta da API de categorias:', response.data);
    return response.data;
  }
};
