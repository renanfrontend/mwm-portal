import type {
  PortariaAbastecimentoDeletePayload,
  PortariaEntregaDejetosDeletePayload,
  PortariaEntregaInsumoDeletePayload,
  PortariaRegistro,
  PortariaRegistroDeletePayload,
} from '../../../types';
import { buildTransportDeleteContext } from '../shared/transportPayload';

const buildEntregaDejetosDeletePayload = (registro: PortariaRegistro): PortariaEntregaDejetosDeletePayload => ({
  registroId: registro.id,
  tipoRegistro: registro.tipo_registro,
  entregaDejetosId: registro.entrega_dejetos?.id ?? null,
  ...buildTransportDeleteContext(registro.entrega_dejetos),
});

const buildAbastecimentoDeletePayload = (registro: PortariaRegistro): PortariaAbastecimentoDeletePayload => ({
  registroId: registro.id,
  tipoRegistro: registro.tipo_registro,
  abastecimentoId: registro.abastecimento?.id ?? null,
  ...buildTransportDeleteContext(registro.abastecimento),
});

const buildEntregaInsumoDeletePayload = (registro: PortariaRegistro): PortariaEntregaInsumoDeletePayload => ({
  registroId: registro.id,
  tipoRegistro: registro.tipo_registro,
  entregaInsumoId: registro.entrega_insumo?.id ?? null,
  ...buildTransportDeleteContext(registro.entrega_insumo as any),
});

export const portariaDeletionPayloadService = {
  buildPayload(registro: PortariaRegistro): PortariaRegistroDeletePayload {
    switch (registro.tipo_registro) {
      case 'ENTREGA_DEJETOS':
        return buildEntregaDejetosDeletePayload(registro);

      case 'ABASTECIMENTO':
        return buildAbastecimentoDeletePayload(registro);

      case 'ENTREGA_INSUMO':
        return buildEntregaInsumoDeletePayload(registro);

      default:
        throw new Error(`Exclusão não implementada para o tipo ${registro.tipo_registro}`);
    }
  },
};
