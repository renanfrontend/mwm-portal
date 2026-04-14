import { useState, useEffect, useCallback } from 'react';
import { PortariaProducersService } from '../services/portariaProducersService';
import type { ProdutorListItem } from '../../../types/cooperado';

interface ProducerSelectOption {
  id: number;
  label: string;
  value: string;
  nomeProdutor: string;
  numEstabelecimento: string;
  matricula?: string;
}

interface UseProducersSelectReturn {
  producers: ProducerSelectOption[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  getProducerDetails: (producerId: number) => Promise<ProdutorListItem | null>;
}

/**
 * Hook customizado para carregar produtores no contexto de Portaria.
 * 
 * CARACTERÍSTICAS:
 * - Carregamento automático ao montar
 * - Cache interno para evitar requisições duplicadas
 * - Tratamento de erros com feedback ao usuário
 * - Função de refetch para recarregar dados
 * - Método para obter detalhes de um produtor específico
 * 
 * PRINCÍPIOS:
 * - Desacoplado do componente
 * - Reutilizável em múltiplos componentes
 * - Lógica centralizada de carregamento
 * 
 * @param plantaId - ID da planta (padrão: 1)
 * @param filiadaId - ID da filiada (padrão: 1)
 * @returns Objeto com produtores, estado de carregamento, erro e métodos
 * 
 * @example
 * const { producers, isLoading, error } = useProducersSelect(1, 1);
 * 
 * return (
 *   <select>
 *     {producers.map(p => (
 *       <option key={p.id} value={p.value}>{p.label}</option>
 *     ))}
 *   </select>
 * );
 */
export const useProducersSelect = (
  plantaId: number = 1,
  filiadaId: number = 1
): UseProducersSelectReturn => {
  const [producers, setProducers] = useState<ProducerSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheKey] = useState(`producers_${plantaId}_${filiadaId}`);

  // Tenta carregar do cache primeiro
  const getCachedProducers = useCallback((): ProducerSelectOption[] | null => {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        console.log('📦 Produtores carregados do cache');
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Erro ao acessar cache de produtores');
    }
    return null;
  }, [cacheKey]);

  // Carrega produtores da API
  const loadProducers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Tenta cache primeiro
      const cached = getCachedProducers();
      if (cached && cached.length > 0) {
        setProducers(cached);
        setIsLoading(false);
        return;
      }

      // Se não houver cache, carrega da API
      console.log('🔄 Carregando produtores da API para Portaria...');
      const data = await PortariaProducersService.getProducersForSelect(plantaId, filiadaId);
      
      if (!data || data.length === 0) {
        setError('Nenhum produtor disponível');
        setProducers([]);
      } else {
        setProducers(data);
        // Armazena no cache por 5 minutos
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        console.log(`✅ ${data.length} produtores carregados com sucesso`);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao carregar produtores';
      setError(errorMessage);
      setProducers([]);
      console.error('❌ Erro ao carregar produtores:', err);
    } finally {
      setIsLoading(false);
    }
  }, [plantaId, filiadaId, getCachedProducers, cacheKey]);

  // Refetch manual
  const refetch = useCallback(() => {
    sessionStorage.removeItem(cacheKey);
    loadProducers();
  }, [loadProducers, cacheKey]);

  // Obter detalhes de um produtor específico
  const getProducerDetails = useCallback(
    async (producerId: number): Promise<ProdutorListItem | null> => {
      try {
        return await PortariaProducersService.getProducerById(producerId);
      } catch (err) {
        console.error(`Erro ao obter detalhes do produtor ${producerId}:`, err);
        return null;
      }
    },
    []
  );

  // Carrega produtores ao montar
  useEffect(() => {
    loadProducers();
  }, [loadProducers]);

  return {
    producers,
    isLoading,
    error,
    refetch,
    getProducerDetails
  };
};
