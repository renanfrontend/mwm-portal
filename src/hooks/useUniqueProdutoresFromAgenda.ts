import { useMemo } from 'react';
import type { AgendaPlanejadaLinha } from '../types/agenda';

/**
 * Hook para extrair nomes únicos de produtores de um array de linhas da agenda.
 * @param linhas Array de AgendaPlanejadaLinha
 * @returns Array de nomes únicos de produtores (ordenados)
 */
export function useUniqueProdutoresFromAgenda(linhas: AgendaPlanejadaLinha[] = []): string[] {
  return useMemo(() => {
    const nomes = linhas.map(linha => linha.produtor).filter(Boolean);
    return Array.from(new Set(nomes)).sort();
  }, [linhas]);
}
