/**
 * PORTARIA ABASTECIMENTO - Serviço Isolado
 * Responsável por chamadas HTTP específicas para Abastecimento.
 * Endpoint: POST /api/portaria/abastecimento
 *
 * Autor: Antonio Marcos de Souza Santos
 * Cargo: Developer Full Stack
 * Data: 10/04/2026
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ENDPOINT = '/portaria/abastecimento';

export interface PortariaAbastecimentoRequest {
  tipoRegistro: string;
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
    peso_inicial?: number;
    peso_final?: number;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
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

export const portariaAbastecimentoRegistroService = {
  /**
   * Implementa a interface PortariaRegistroStrategy.
   */
  async criar(data: PortariaAbastecimentoRequest): Promise<any> {
    return this.createAbastecimento(data);
  },

  /**
   * Cria novo registro de Abastecimento.
   */
  async createAbastecimento(data: PortariaAbastecimentoRequest): Promise<any> {
    try {
      console.log('📡 [ABASTECIMENTO] Enviando para:', `${API_BASE_URL}${ENDPOINT}`);
      console.log('📦 [ABASTECIMENTO] Payload:', JSON.stringify(data, null, 2));

      const response = await api.post(ENDPOINT, data);
      console.log('✅ [ABASTECIMENTO] Resposta:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [ABASTECIMENTO] Erro ao criar registro:', error);
      throw error;
    }
  },
} as any;
