/**
 * PORTARIA REGISTRO - Hook usePortariaSync
 * Gerencia sincronização de dados em background
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { PortariaRegistroFilters } from '../../types';
import { portariaRegistroService } from '../../services';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePortariaSyncReturn {
  isSyncing: boolean;
  lastSync: Date | null;
  error: string | null;

  // Ações
  syncNow: (filters?: PortariaRegistroFilters) => Promise<void>;
  startAutoSync: (intervalMs?: number, filters?: PortariaRegistroFilters) => void;
  stopAutoSync: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

const DEFAULT_SYNC_INTERVAL = 30000; // 30 segundos

export const usePortariaSync = (): UsePortariaSyncReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Sincronizar agora
   */
  const syncNow = useCallback(async (filters?: PortariaRegistroFilters) => {
    try {
      setIsSyncing(true);
      setError(null);

      await portariaRegistroService.listRegistros(filters);

      setLastSync(new Date());
    } catch (err: any) {
      setError(err.message || 'Erro ao sincronizar');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  /**
   * Iniciar sincronização automática
   */
  const startAutoSync = useCallback(
    (intervalMs: number = DEFAULT_SYNC_INTERVAL, filters?: PortariaRegistroFilters) => {
      // Parar qualquer sincronização anterior
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Sincronizar imediatamente
      syncNow(filters);

      // Sincronizar periodicamente
      intervalRef.current = setInterval(() => {
        syncNow(filters);
      }, intervalMs);
    },
    [syncNow]
  );

  /**
   * Parar sincronização automática
   */
  const stopAutoSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Limpar ao desmontar
   */
  useEffect(() => {
    return () => {
      stopAutoSync();
    };
  }, [stopAutoSync]);

  return {
    isSyncing,
    lastSync,
    error,
    syncNow,
    startAutoSync,
    stopAutoSync,
  };
};
