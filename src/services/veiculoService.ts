import axios from 'axios';

export interface VeiculoTipoOption {
  id: number;
  label: string;
  value: string;
}

export interface VeiculoCombustivelOption {
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
      console.error('🔴 Erro de resposta da API (Veículo):', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('🔴 Sem resposta da API (Veículo):', {
        url: error.config?.url,
        method: error.config?.method,
        message: 'Servidor não respondeu - verifique se a API está rodando'
      });
    } else {
      console.error('🔴 Erro ao configurar requisição (Veículo):', error.message);
    }
    return Promise.reject(error);
  }
);

export const VeiculoService = {
  /**
   * Lista todos os tipos de veículo
   */
  listTipos: async (): Promise<VeiculoTipoOption[]> => {
    console.log('📡 Buscando tipos de veículo da API...');
    console.log('📡 Token:', localStorage.getItem('token') ? 'Present' : 'Absent');
    console.log('📡 URL:', `${API_URL}/veiculo/tipo`);
    try {
      const response = await api.get<VeiculoTipoOption[]>('/veiculo/tipo');
      console.log('📡 Resposta da API de tipos de veículo:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro detalhado em listTipos:', error);
      throw error;
    }
  },

  /**
   * Lista todos os tipos de combustível
   */
  listCombustiveis: async (): Promise<VeiculoCombustivelOption[]> => {
    console.log('📡 Buscando tipos de combustível da API...');
    console.log('📡 Token:', localStorage.getItem('token') ? 'Present' : 'Absent');
    console.log('📡 URL:', `${API_URL}/veiculo/combustivel`);
    try {
      const response = await api.get<VeiculoCombustivelOption[]>('/veiculo/combustivel');
      console.log('📡 Resposta da API de combustíveis:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro detalhado em listCombustiveis:', error);
      throw error;
    }
  }
};
