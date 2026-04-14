/**
 * PORTARIA ENTREGA DE DEJETOS - Serviço Isolado
 * Responsável por chamadas HTTP específicas para Entrega de Dejetos
 * Endpoint: POST /api/portaria/entrega_de_dejetos
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ENDPOINT = '/portaria/entrega_de_dejetos';

// Interface do Request
export interface PortariaEntregaDejetosRequest {
  tipoRegistro: string;
  data_entrada: string;
  hora_entrada: string;
  data_saida?: string;
  hora_saida?: string;
  observacoes?: string;
  status: string;
  origem_entrada: string;
  entrega_dejetos: {
    produtor_id: string;
    motorista_nome: string;
    cpf_motorista: string;
    motorista_id?: string | null;
    transportadora_id?: string | null;
    transportadora_manual?: string | null;
    veiculo_id?: string | null;
    placa?: string | null;
    placa_manual?: string | null;
    tipo_veiculo: string;
    peso_inicial: number;
    peso_final: number;
    densidade?: string;
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
    console.error('🔴 Erro na requisição Entrega de Dejetos:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const portariaEntregaDejetosRegistroService = {
  /**
   * Implementa a interface PortariaRegistroStrategy
   * Método padrão chamado pela Factory
   */
  async criar(data: PortariaEntregaDejetosRequest): Promise<any> {
    return this.createEntregaDejetos(data);
  },

  /**
   * Criar novo registro de Entrega de Dejetos
   * POST /api/portaria/entrega_de_dejetos
   */
  async createEntregaDejetos(data: PortariaEntregaDejetosRequest): Promise<any> {
    try {
      console.log('📡 Enviando Entrega de Dejetos para:', `${API_BASE_URL}${ENDPOINT}`);
      console.log('📦 Dados:', JSON.stringify(data, null, 2));
      
      const response = await api.post(ENDPOINT, data);
      
      console.log('✅ Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar Entrega de Dejetos:', error);
      throw error;
    }
  },
} as any;  // 'as any' para satisfazer a interface PortariaRegistroStrategy
