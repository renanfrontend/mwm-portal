/**
 * PORTARIA REGISTRO - Hook usePortariaRegistroList
 * Gerencia lista com paginação e filtros
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  PortariaRegistro,
  PortariaRegistroFilters,
} from '../../types';
import { portariaRegistroService } from '../../services';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePortariaRegistroListReturn {
  data: PortariaRegistro[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: PortariaRegistroFilters;

  // Ações
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: PortariaRegistroFilters) => void;
  refetch: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

export const usePortariaRegistroList = (
  initialFilters?: PortariaRegistroFilters
): UsePortariaRegistroListReturn => {

  // Estado local
  const [data, setData] = useState<PortariaRegistro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0 as number,
    pageSize: 5 as number,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFiltersState] = useState<PortariaRegistroFilters>({
    status: 'Em andamento',
    page: 0,
    pageSize: 5,
    ...initialFilters,
  });

  /**
   * Buscar dados
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await portariaRegistroService.listRegistros(filters);

      setData(response.data);
      setPagination({
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar registros');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Buscar quando filtros mudam
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Alterar página
   */
  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  /**
   * Alterar quantidade por página
   */
  const setPageSize = useCallback((size: number) => {
    setFiltersState((prev) => ({
      ...prev,
      pageSize: size,
      page: 0, // Volta para primeira página
    }));
  }, []);

  /**
   * Alterar filtros
   */
  const setFilters = useCallback((newFilters: PortariaRegistroFilters) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: 0, // Volta para primeira página
    }));
  }, []);

  /**
   * Recarregar dados
   */
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    setPage,
    setPageSize,
    setFilters,
    refetch,
  };
};
