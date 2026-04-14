/**
 * PORTARIA REGISTRO - Hook usePortariaFilters
 * Gerencia filtros avançados
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import { useState, useCallback } from 'react';
import type { PortariaRegistroFilters, PortariaTipo, PortariaStatus } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePortariaFiltersReturn {
  filters: PortariaRegistroFilters;

  // Ações
  filterByStatus: (status: PortariaStatus) => void;
  filterByTipo: (tipo: PortariaTipo) => void;
  filterByData: (dataInicio: Date | string, dataFim: Date | string) => void;
  filterBySearch: (search: string) => void;
  clearFilters: () => void;
  setFilters: (filters: PortariaRegistroFilters) => void;
}

// ============================================================================
// HOOK
// ============================================================================

export const usePortariaFilters = (
  initialFilters?: PortariaRegistroFilters
): UsePortariaFiltersReturn => {
  const [filters, setFiltersState] = useState<PortariaRegistroFilters>({
    ...initialFilters,
  });

  /**
   * Filtrar por status
   */
  const filterByStatus = useCallback((status: PortariaStatus) => {
    setFiltersState((prev) => ({
      ...prev,
      status,
      page: 0,
    }));
  }, []);

  /**
   * Filtrar por tipo de registro
   */
  const filterByTipo = useCallback((tipo: PortariaTipo) => {
    setFiltersState((prev) => ({
      ...prev,
      tipoRegistro: tipo,
      page: 0,
    }));
  }, []);

  /**
   * Filtrar por data
   */
  const filterByData = useCallback((dataInicio: Date | string, dataFim: Date | string) => {
    setFiltersState((prev) => ({
      ...prev,
      dataInicio,
      dataFim,
      page: 0,
    }));
  }, []);

  /**
   * Filtrar por busca
   */
  const filterBySearch = useCallback((search: string) => {
    setFiltersState((prev) => ({
      ...prev,
      search,
      page: 0,
    }));
  }, []);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  /**
   * Atualizar filtros
   */
  const setFilters = useCallback((newFilters: PortariaRegistroFilters) => {
    setFiltersState(newFilters);
  }, []);

  return {
    filters,
    filterByStatus,
    filterByTipo,
    filterByData,
    filterBySearch,
    clearFilters,
    setFilters,
  };
};
