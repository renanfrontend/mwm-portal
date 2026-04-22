import type { PortariaRegistro, PortariaRegistroDeleteContext } from '../../types';
import { portariaDeletionPayloadService } from '../activities';
import { PortariaRegistroDeletionFactory } from '../portariaRegistroDeletionFactory';

export const portariaDeletionService = {
  async deleteRegistro(registro: PortariaRegistro): Promise<void> {
    const strategy = PortariaRegistroDeletionFactory.getStrategy(registro.tipo_registro);
    const payload = portariaDeletionPayloadService.buildPayload(registro);

    await strategy.deletar(payload);
  },

  async deleteMultiple(registros: PortariaRegistro[]): Promise<PortariaRegistroDeleteContext[]> {
    const processed: PortariaRegistroDeleteContext[] = [];

    for (const registro of registros) {
      const payload = portariaDeletionPayloadService.buildPayload(registro);
      const strategy = PortariaRegistroDeletionFactory.getStrategy(registro.tipo_registro);

      await strategy.deletar(payload);
      processed.push({ registro, payload });
    }

    return processed;
  },
};