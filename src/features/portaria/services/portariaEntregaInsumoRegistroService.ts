/**
 * PORTARIA ENTREGA INSUMO - Registro Service
 * Implementa a estratégia para registro de Entrega de Insumo
 * Isolado conforme padrão SOLID
 */

import { api } from '../../../services/api';

export const portariaEntregaInsumoRegistroService = {
  async criar(dados: any) {
    // Ajuste o endpoint conforme necessário
    const response = await api.post('/portaria/entrega-insumo', dados);
    return response.data;
  },
};
