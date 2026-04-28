/**
 * PORTARIA ENTREGA INSUMO - Serviço Isolado
 * Responsável por chamadas HTTP específicas para Entrega de Insumo
 * Endpoint: POST /api/bio-portaria-entrega-insumo
 */

import axios from 'axios';
import type { PortariaEntregaInsumoDeletePayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ENDPOINT = '/bio-portaria-entrega-insumo';

// Interface do Request
export interface PortariaEntregaInsumoRequest {
  tipoRegistro: string;
  data_entrada: string;
  hora_entrada: string;
  data_saida?: string;
  hora_saida?: string;
  observacoes?: string;
  status: string;
  origem_entrada: string;
  entrega_insumo: {
    motorista_nome: string;
    cpf_motorista: string;
    motoristamotorista_id?: string | null;
    transportadora_id?: number | null;
    transportadora_manual?: string | null;
    veiculo_id?: number | null;
    placa?: string | null;
    placa_manual?: string | null;
    tipo_veiculo: string;
    peso_inicial: number;
    peso_final: number;
    empresa: string;
    nota_fiscal: string;
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
    console.error('🔴 Erro na requisição Entrega de Insumo:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const portariaEntregaInsumoRegistroService = {
  /**
   * Implementa a interface PortariaRegistroStrategy
   * Método padrão chamado pela Factory
   */
  async criar(data: PortariaEntregaInsumoRequest): Promise<any> {
    return this.createEntregaInsumo(data);
  },

  async deletar(data: PortariaEntregaInsumoDeletePayload): Promise<any> {
    return this.deleteEntregaInsumo(data);
  },

  /**
   * Criar novo registro de Entrega de Insumo
   * POST /api/bio-portaria-entrega-insumo
   */
  async createEntregaInsumo(data: PortariaEntregaInsumoRequest): Promise<any> {
    try {
      console.log('📡 [ENTREGA INSUMO] Enviando para:', `${API_BASE_URL}${ENDPOINT}`);
      console.log('📦 [ENTREGA INSUMO] Payload:', JSON.stringify(data, null, 2));
      
      const response = await api.post(ENDPOINT, data);
      
      console.log('✅ [ENTREGA INSUMO] Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [ENTREGA INSUMO] Erro ao criar:', error);
      throw error;
    }
  },

  async deleteEntregaInsumo(data: PortariaEntregaInsumoDeletePayload): Promise<any> {
    try {
      console.log('🟡 [ENTREGA INSUMO] Payload enviado para exclusão:', data);
      console.log('🗑️ [ENTREGA INSUMO] Excluindo em:', `${API_BASE_URL}${ENDPOINT}`);

      const response = await api.post(`${ENDPOINT}/excluir`, data);

      console.log('✅ [ENTREGA INSUMO] Exclusão concluída:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [ENTREGA INSUMO] Erro ao excluir:', error);
      throw error;
    }
  },
} as any;