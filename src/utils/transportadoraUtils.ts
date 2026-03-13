import type { AgendaData } from '../types/models';

/**
 * Extrai nomes únicos de transportadoras de um array de AgendaData.
 * @param agenda Array de registros AgendaData
 * @returns Array de nomes únicos de transportadoras (ordenados)
 */
export function getUniqueTransportadoras(agenda: AgendaData[]): string[] {
  const nomes = agenda.map(item => item.transportadora).filter(Boolean);
  return Array.from(new Set(nomes)).sort();
}
