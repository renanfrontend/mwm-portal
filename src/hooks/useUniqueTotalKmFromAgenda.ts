import { useMemo } from 'react';
import type { AgendaPlanejadaLinha } from '../types/agenda';

/**
 * Hook para extrair totais únicos de KM de um array de linhas da agenda.
 * @param linhas Array de AgendaPlanejadaLinha
 * @returns Array de totais únicos de KM (ordenados)
 */
export function useUniqueTotalKmFromAgenda(linhas: AgendaPlanejadaLinha[] = []): number[] {
  return useMemo(() => {
    // Usa apenas o campo 'distanciaKm' (total de KM)
    const totais = linhas.map(linha => linha.distanciaKm).filter((d) => d !== undefined && d !== null);
    return Array.from(new Set(totais)).sort((a, b) => a - b);
  }, [linhas]);
}
