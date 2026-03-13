import { useMemo } from 'react';
import type { AgendaData } from '../types/models';
import { getUniqueTransportadoras } from '../utils/transportadoraUtils';

/**
 * Hook para extrair transportadoras únicas de um array de AgendaData.
 * @param agendaData Lista de registros AgendaData
 * @returns Lista de nomes únicos de transportadoras
 */
export function useTransportadoras(agendaData: AgendaData[]): string[] {
  return useMemo(() => getUniqueTransportadoras(agendaData), [agendaData]);
}
