/**
 * PORTARIA REGISTRO - Factory Service
 * Padrão Strategy: Retorna o serviço correto baseado no tipo de atividade
 * Aplicando SOLID - Single Responsibility Principle
 */

import { portariaEntregaDejetosRegistroService } from './portariaEntregaDejetosRegistroService';
import { portariaAbastecimentoRegistroService } from './portariaAbastecimentoRegistroService';
import { portariaEntregaInsumoRegistroService } from './portariaEntregaInsumoRegistroService';

export interface PortariaRegistroStrategy {
  criar(dados: any): Promise<any>;
}

export class PortariaRegistroFactory {
  /**
   * Retorna a estratégia (serviço) correta baseada na atividade
   */
  static getStrategy(atividade: string): PortariaRegistroStrategy {
    console.log(`🏭 Factory: Selecionando estratégia para "${atividade}"`);
    
    switch (atividade) {
      case 'Entrega de dejetos':
        return portariaEntregaDejetosRegistroService;
      
      case 'Entrega de insumo':
        return portariaEntregaInsumoRegistroService;
      
      case 'Expedição':
        // TODO: Implementar portariaExpedicaoRegistroService
        throw new Error('Endpoint para Expedição ainda não implementado');
      
      case 'Abastecimento':
        return portariaAbastecimentoRegistroService;
      
      case 'Visita':
        // TODO: Implementar portariaVisitaRegistroService
        throw new Error('Endpoint para Visita ainda não implementado');
      
      default:
        throw new Error(`Atividade desconhecida: ${atividade}`);
    }
  }
}
