import type {
  PortariaAbastecimentoDeletePayload,
  PortariaEntregaDejetosDeletePayload,
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

export const portariaDeletionPayloadService = {
  buildPayload(registro: PortariaRegistro): PortariaRegistroDeletePayload {
    switch (registro.tipo_registro) {
      case 'ENTREGA_DEJETOS':
        return buildEntregaDejetosDeletePayload(registro);

      case 'ABASTECIMENTO':
        return buildAbastecimentoDeletePayload(registro);

      default:
        throw new Error(`Exclusão não implementada para o tipo ${registro.tipo_registro}`);
    }
  },
};
