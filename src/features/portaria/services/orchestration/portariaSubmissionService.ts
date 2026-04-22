import type { PortariaDrawerFormState, PortariaRegistro } from '../../types';
import { portariaActivityPayloadService } from '../activities';
import { PortariaRegistroFactory } from '../portariaRegistroFactory';
import { portariaRegistroService } from '../portariaRegistroService';

export const portariaSubmissionService = {
  async create(entry: PortariaDrawerFormState): Promise<any> {
    const strategy = PortariaRegistroFactory.getStrategy(entry.atividade);
    const payload = portariaActivityPayloadService.buildPayload(entry);
    return strategy.criar(payload);
  },

  async update(entry: PortariaDrawerFormState): Promise<PortariaRegistro> {
    const payload = portariaActivityPayloadService.buildUpdatePayload(entry);
    return portariaRegistroService.updateRegistro(String(entry.id), payload);
  },
};