/**
 * PORTARIA REGISTRO - Hook usePortariaRegistroDelete
 * Gerencia exclusão de registros
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import { useState, useCallback } from 'react';
import { portariaRegistroService } from '../../services';

// ============================================================================
// TYPES
// ============================================================================

export interface UsePortariaRegistroDeleteReturn {
  isDeleting: boolean;
  error: string | null;

  // Ações
  deleteRegistro: (id: string, onSuccess?: () => void) => Promise<void>;
  deleteMultiple: (ids: string[], onSuccess?: () => void) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export const usePortariaRegistroDelete = (): UsePortariaRegistroDeleteReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Deletar um registro
   */
  const deleteRegistro = useCallback(
    async (id: string, onSuccess?: () => void) => {
      try {
        setIsDeleting(true);
        setError(null);

        await portariaRegistroService.deleteRegistro(id);

        if (onSuccess) {
          onSuccess();
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao deletar registro');
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  /**
   * Deletar múltiplos registros
   */
  const deleteMultiple = useCallback(
    async (ids: string[], onSuccess?: () => void) => {
      try {
        setIsDeleting(true);
        setError(null);

        await portariaRegistroService.deleteMultipleRegistros(ids);

        if (onSuccess) {
          onSuccess();
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao deletar registros');
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isDeleting,
    error,
    deleteRegistro,
    deleteMultiple,
    clearError,
  };
};
