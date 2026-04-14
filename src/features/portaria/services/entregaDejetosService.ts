import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Erro de resposta da API (Entrega de Dejetos):', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export interface BioVeiculoTransportadora {
  id: number;
  bioTransportadora: {
    id: number;
    nomeFantasia: string;
    [key: string]: any;
  };
  tipo: string;
  placa: string;
  [key: string]: any;
}

export interface EntregaDejetosSelects {
  transportadoras: { id: string; nomeFantasia: string }[];
  tiposVeiculo: { id: string; label: string; value: string }[];
  placas: { id: string; placa: string }[];
}

export const entregaDejetosService = {
  /**
   * Carrega todos os veículos com suas transportadoras
   */
  async getBioVeiculosTransportadoras(): Promise<BioVeiculoTransportadora[]> {
    console.log('📡 Chamando API: /bio-veiculos-transportadoras');
    const response = await api.get<BioVeiculoTransportadora[]>('/bio-veiculos-transportadoras');
    console.log('📡 Resposta recebida:', response.data);
    return response.data;
  },

  /**
   * Retorna lista de transportadoras únicas com 'Outros' no final
   */
  async getTransportadoras(): Promise<{ id: string; nomeFantasia: string }[]> {
    const veiculos = await this.getBioVeiculosTransportadoras();
    
    // Extrai transportadoras únicas
    const transportadorasMap = new Map();
    veiculos.forEach(v => {
      const id = String(v.bioTransportadora.id);
      if (!transportadorasMap.has(id)) {
        transportadorasMap.set(id, {
          id,
          nomeFantasia: v.bioTransportadora.nomeFantasia
        });
      }
    });

    // Converte para array e adiciona 'Outros' no final
    const lista = Array.from(transportadorasMap.values());
    return [
      ...lista,
      { id: 'outros', nomeFantasia: 'Outros' }
    ];
  },

  /**
   * Retorna tipos de veículo únicos
   */
  async getTiposVeiculo(): Promise<{ id: string; label: string; value: string }[]> {
    const veiculos = await this.getBioVeiculosTransportadoras();
    
    // Extrai tipos únicos
    const tiposSet = new Set(veiculos.map(v => v.tipo));
    const tiposArray = Array.from(tiposSet);
    
    return tiposArray.map((tipo, index) => ({
      id: String(index),
      label: tipo,
      value: tipo
    }));
  },

  /**
   * Retorna placas filtradas por transportadora
   */
  async getPlacasByTransportadora(transportadoraId: string): Promise<{ id: string; placa: string }[]> {
    if (!transportadoraId || transportadoraId === 'outros') return [];
    
    const veiculos = await this.getBioVeiculosTransportadoras();
    
    // Filtra veículos da transportadora selecionada
    const placas = veiculos
      .filter(v => String(v.bioTransportadora.id) === transportadoraId)
      .map(v => ({
        id: String(v.id),
        placa: v.placa.trim()
      }));
    
    return placas;
  }
};
