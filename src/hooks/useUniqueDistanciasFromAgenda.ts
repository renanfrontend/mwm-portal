import { useMemo } from 'react';
import type { AgendaPlanejadaLinha } from '../types/agenda';

/**
 * Hook para extrair distâncias únicas de um array de linhas da agenda.
 * @param linhas Array de AgendaPlanejadaLinha
 * @returns Array de distâncias únicas (ordenadas)
 */
export function useUniqueDistanciasFromAgenda(linhas: AgendaPlanejadaLinha[] = []): number[] {
  return useMemo(() => {
    const distancias = linhas.map(linha => linha.distanciaKm).filter((d) => d !== undefined && d !== null);
    return Array.from(new Set(distancias)).sort((a, b) => a - b);
  }, [linhas]);
}
