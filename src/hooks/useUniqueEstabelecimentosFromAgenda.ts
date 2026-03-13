import { useMemo } from 'react';
import type { AgendaPlanejadaLinha } from '../types/agenda';

/**
 * Hook para extrair IDs únicos de estabelecimentos de um array de linhas da agenda.
 * @param linhas Array de AgendaPlanejadaLinha
 * @returns Array de IDs únicos de estabelecimentos (ordenados)
 */
export function useUniqueEstabelecimentosFromAgenda(linhas: AgendaPlanejadaLinha[] = []): number[] {
  return useMemo(() => {
    const ids = linhas.map(linha => linha.idEstabelecimento).filter(Boolean);
    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }, [linhas]);
}
