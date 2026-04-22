/**
 * PORTARIA EXPEDIÇÃO - Service de Combos
 * Responsável por carregar transportadoras, tipos de veículo e placas para o
 * formulário de Expedição de forma isolada.
 *
 * Autor: Antonio Marcos de Souza Santos
 * Cargo: Developer Full Stack
 * Data: 10/04/2026
 */

import { api } from '../../../../../services/api';

export interface BioVeiculoTransportadoraExpedicao {
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

export const expedicaoService = {
  /**
   * Carrega os veículos com transportadoras para popular os combos.
   */
  async getBioVeiculosTransportadoras(): Promise<BioVeiculoTransportadoraExpedicao[]> {
    console.log('📡 [EXPEDICAO] Chamando API: /bio-veiculos-transportadoras');
    const response = await api.get<BioVeiculoTransportadoraExpedicao[]>('/bio-veiculos-transportadoras');
    return response.data;
  },

  /**
   * Retorna lista de transportadoras únicas e adiciona "Outros" ao final.
   */
  async getTransportadoras(): Promise<{ id: string; nomeFantasia: string }[]> {
    const veiculos = await this.getBioVeiculosTransportadoras();

    const transportadorasMap = new Map<string, { id: string; nomeFantasia: string }>();

    veiculos.forEach(v => {
      const id = String(v.bioTransportadora.id);
      if (!transportadorasMap.has(id)) {
        transportadorasMap.set(id, {
          id,
          nomeFantasia: v.bioTransportadora.nomeFantasia,
        });
      }
    });

    return [
      ...Array.from(transportadorasMap.values()),
      { id: 'outros', nomeFantasia: 'Outros' },
    ];
  },

  /**
   * Retorna tipos de veículo únicos para o combo.
   */
  async getTiposVeiculo(): Promise<{ id: string; label: string; value: string }[]> {
    const veiculos = await this.getBioVeiculosTransportadoras();
    const tiposArray = Array.from(new Set(veiculos.map(v => v.tipo)));

    return tiposArray.map((tipo, index) => ({
      id: String(index),
      label: tipo,
      value: tipo,
    }));
  },

  /**
   * Retorna placas filtradas pela transportadora selecionada.
   */
  async getPlacasByTransportadora(transportadoraId: string): Promise<{ id: string; placa: string }[]> {
    if (!transportadoraId || transportadoraId === 'outros') return [];

    const veiculos = await this.getBioVeiculosTransportadoras();

    return veiculos
      .filter(v => String(v.bioTransportadora.id) === transportadoraId)
      .map(v => ({
        id: String(v.id),
        placa: v.placa.trim(),
      }));
  },
};
