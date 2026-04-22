/**
 * PORTARIA ABASTECIMENTO - Serviço Isolado
 * Responsável por chamadas HTTP específicas para Abastecimento
 * Endpoint: POST /api/portaria/abastecimento
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ENDPOINT = '/portaria/abastecimento';

// Interface do Request
export interface PortariaAbastecimentoRequest {
  tipoRegistro: 'ABASTECIMENTO';
  data_entrada: string;
  hora_entrada: string;
  data_saida?: string;
  hora_saida?: string;
  observacoes?: string;
  status: string;
  origem_entrada: string;
  abastecimento: {
    motorista_nome: string;
    cpf_motorista: string;
    motorista_id?: string | null;
    transportadora_id?: string | null;
    transportadora_manual?: string | null;
    veiculo_id?: string | null;
    placa?: string | null;
    placa_manual?: string | null;
    tipo_veiculo: string;
    peso_inicial?: number | null;
    peso_final?: number | null;
  };
}

// Criar instância axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Erro na requisição Abastecimento:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const abastecimentoRegistroService = {
  /**
   * Criar novo registro de Abastecimento
   * POST /api/portaria/abastecimento
   */
  async createAbastecimento(data: PortariaAbastecimentoRequest): Promise<any> {
    try {
      console.log('📡 Enviando Abastecimento para:', `${API_BASE_URL}${ENDPOINT}`);
      console.log('📦 Dados:', JSON.stringify(data, null, 2));
      const response = await api.post(ENDPOINT, data);
      console.log('✅ Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar Abastecimento:', error);
      throw error;
    }
  },
};
