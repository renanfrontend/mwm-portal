import { api } from './api';

export interface ExcluirEntregaDejetosPayload {
  registroId: string;
  tipoRegistro: 'ENTREGA_DEJETOS';
  entregaDejetosId: string;
  transportadoraId: string;
  veiculoId: string;
  transportadoraManual: string | null;
  placaManual: string | null;
  origemTransportadora: 'SELECIONADA' | 'OUTROS';
  excluirTransportadora: boolean;
  excluirVeiculo: boolean;
}

export const excluirEntregaDejetos = async (payload: ExcluirEntregaDejetosPayload): Promise<void> => {
  await api.post('/portaria/entrega_de_dejetos/excluir', payload);
};
