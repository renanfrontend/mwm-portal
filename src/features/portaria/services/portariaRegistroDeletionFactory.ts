import type { PortariaTipo } from '../types';
import { portariaEntregaDejetosRegistroService } from './portariaEntregaDejetosRegistroService';
import { portariaAbastecimentoRegistroService } from './portariaAbastecimentoRegistroService';

export interface PortariaRegistroDeletionStrategy {
  deletar(dados: unknown): Promise<unknown>;
}

export class PortariaRegistroDeletionFactory {
  static getStrategy(tipoRegistro: PortariaTipo): PortariaRegistroDeletionStrategy {
    switch (tipoRegistro) {
      case 'ENTREGA_DEJETOS':
        return portariaEntregaDejetosRegistroService;

      case 'ABASTECIMENTO':
        return portariaAbastecimentoRegistroService;

      default:
        throw new Error(`Exclusão não implementada para o tipo ${tipoRegistro}`);
    }
  }
}