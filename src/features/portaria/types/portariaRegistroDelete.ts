import type { PortariaRegistro, PortariaTipo } from './portariaRegistro';

export type PortariaDeleteTransportOrigin = 'OUTROS' | 'SELECIONADA' | 'NAO_APLICAVEL';

interface PortariaRegistroDeletePayloadBase {
  registroId: string;
  tipoRegistro: PortariaTipo;
}

interface PortariaTransportDeleteContext {
  transportadoraId: string | null;
  veiculoId: string | null;
  transportadoraManual: string | null;
  placaManual: string | null;
  origemTransportadora: PortariaDeleteTransportOrigin;
  excluirTransportadora: boolean;
  excluirVeiculo: boolean;
}

export interface PortariaAbastecimentoDeletePayload
  extends PortariaRegistroDeletePayloadBase,
    PortariaTransportDeleteContext {
  abastecimentoId: string | null;
}

export interface PortariaEntregaDejetosDeletePayload
  extends PortariaRegistroDeletePayloadBase,
    PortariaTransportDeleteContext {
  entregaDejetosId: string | null;
}

export type PortariaRegistroDeletePayload =
  | PortariaAbastecimentoDeletePayload
  | PortariaEntregaDejetosDeletePayload;

export interface PortariaRegistroDeleteContext {
  registro: PortariaRegistro;
  payload: PortariaRegistroDeletePayload;
}