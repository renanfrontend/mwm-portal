import type { PortariaTipo } from '../types';
import { portariaEntregaDejetosRegistroService } from './portariaEntregaDejetosRegistroService';
import { portariaAbastecimentoRegistroService } from './portariaAbastecimentoRegistroService';
import { portariaEntregaInsumoRegistroService } from './portariaEntregaInsumoRegistroService';

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

      case 'ENTREGA_INSUMO':
        return portariaEntregaInsumoRegistroService;

      default:
        throw new Error(`Exclusão não implementada para o tipo ${tipoRegistro}`);
    }
  }
}