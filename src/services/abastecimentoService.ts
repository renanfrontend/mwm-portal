import { api } from './api';

export interface ExcluirAbastecimentoPayload {
  registroId: string;
  tipoRegistro: 'ABASTECIMENTO';
  abastecimentoId: string;
  transportadoraId?: string;
  veiculoId?: string;
  transportadoraManual?: string;
  placaManual?: string;
  origemTransportadora: 'CADASTRADA' | 'OUTROS';
  excluirTransportadora: boolean;
  excluirVeiculo: boolean;
}

export const excluirAbastecimento = async (payload: ExcluirAbastecimentoPayload): Promise<void> => {
  await api.post('/portaria/abastecimento/excluir', payload);
};
