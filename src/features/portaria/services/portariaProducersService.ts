import { ProdutorService } from '../../../services/produtorService';
import type { ProdutorListItem } from '../../../types/cooperado';

/**
 * Serviço desacoplado para carregar produtores no contexto de Portaria.
 * 
 * PRINCÍPIOS SOLID:
 * - Single Responsibility: Responsável apenas por operações de produtores em Portaria
 * - Open/Closed: Extensível para novos tipos de busca sem modificar código existente
 * - Dependency Inversion: Depende de abstração (ProdutorService) não de implementação
 * 
 * O serviço NÃO depende de estado, props ou contexto do componente.
 * É puramente funcional e reutilizável em qualquer contexto.
 */

interface ProducerSelectOption {
  id: number;
  label: string;
  value: string;
  nomeProdutor: string;
  numEstabelecimento: string;
  matricula?: string;
}

export const PortariaProducersService = {
  /**
   * Carrega todos os produtores para o select de cooperado.
   * Utiliza os mesmos parâmetros que são usados em Logística.
   * 
   * @param plantaId - ID da planta (padrão: 1)
   * @param filiadaId - ID da filiada (padrão: 1)
   * @returns Array de opções formatadas para o select
   * 
   * @example
   * const opcoes = await PortariaProducersService.getProducersForSelect(1, 1);
   * // [{
   * //   id: 1,
   * //   label: "João Silva - EST-001",
   * //   value: "1",
   * //   nomeProdutor: "João Silva",
   * //   numEstabelecimento: "EST-001"
   * // }]
   */
  getProducersForSelect: async (
    plantaId: number = 1,
    filiadaId: number = 1
  ): Promise<ProducerSelectOption[]> => {
    try {
      const response = await ProdutorService.list(plantaId, filiadaId, 1, 9999);
      
      if (!response.items || response.items.length === 0) {
        console.warn('Nenhum produtor encontrado para Portaria');
        return [];
      }

      // Mapeia os produtores para o formato esperado pelo select
      // Label: "Nome do Produtor - Matrícula" para diferenciar produtores com mesmo nome
      return response.items.map((produtor: ProdutorListItem) => ({
        id: produtor.id,
        label: produtor.matricula 
          ? `${produtor.nomeProdutor} - ${produtor.matricula}`
          : `${produtor.nomeProdutor} - ${produtor.numEstabelecimento}`,
        value: String(produtor.id),
        nomeProdutor: produtor.nomeProdutor,
        numEstabelecimento: produtor.numEstabelecimento,
        matricula: produtor.matricula
      }));
    } catch (error) {
      console.error('Erro ao carregar produtores para Portaria:', error);
      throw new Error('Falha ao carregar lista de produtores');
    }
  },

  /**
   * Obtém um produtor específico pelo ID.
   * Útil para pré-preencher dados em edição.
   * 
   * @param producerId - ID do produtor
   * @returns Dados completos do produtor
   */
  getProducerById: async (producerId: number): Promise<ProdutorListItem | null> => {
    try {
      const response = await ProdutorService.getById(producerId);
      
      // Normaliza a resposta para garantir a estrutura correta
      return {
        id: response.id || producerId,
        nomeProdutor: response.bioProdutor?.nome || response.nome || '',
        numEstabelecimento: response.numeroEstabelecimento || '',
        filiada: response.bioProdutor?.filiadaNome || '',
        modalidade: response.fase || '',
        cabecasAlojadas: response.cabecas || 0,
        distancia: response.distancia || null,
        certificado: response.certificado || 'Não',
        doamDejetos: response.doamDejetos || 'Não',
        qtdLagoas: response.qtdLagoas || null,
        volLagoas: response.volLagoas || null,
        restricoesOperacionais: response.restricoes || null
      } as ProdutorListItem;
    } catch (error) {
      console.error(`Erro ao carregar produtor ID ${producerId}:`, error);
      return null;
    }
  },

  /**
   * Busca produtores por CPF/CNPJ.
   * Útil para validação ou busca rápida.
   * 
   * @param cpfCnpj - CPF ou CNPJ do produtor
   * @returns Dados do produtor se encontrado, null caso contrário
   */
  searchByCpfCnpj: async (cpfCnpj: string): Promise<ProdutorListItem | null> => {
    try {
      const response = await ProdutorService.findByCpfCnpj(cpfCnpj);
      
      if (!response) {
        return null;
      }

      return {
        id: response.id,
        nomeProdutor: response.bioProdutor?.nome || response.nome || '',
        numEstabelecimento: response.numeroEstabelecimento || '',
        filiada: response.bioProdutor?.filiadaNome || '',
        modalidade: response.fase || '',
        cabecasAlojadas: response.cabecas || 0,
        distancia: response.distancia || null,
        certificado: response.certificado || 'Não',
        doamDejetos: response.doamDejetos || 'Não',
        qtdLagoas: response.qtdLagoas || null,
        volLagoas: response.volLagoas || null,
        restricoesOperacionais: response.restricoes || null
      } as ProdutorListItem;
    } catch (error) {
      console.error(`Erro ao buscar produtor por CPF/CNPJ ${cpfCnpj}:`, error);
      return null;
    }
  },

  /**
   * Busca produtores por número de estabelecimento.
   * Útil para validação ou busca rápida.
   * 
   * @param numEstabelecimento - Número do estabelecimento
   * @returns Dados do produtor se encontrado, null caso contrário
   */
  searchByNumEstabelecimento: async (numEstabelecimento: string): Promise<ProdutorListItem | null> => {
    try {
      const response = await ProdutorService.findByNumEstabelecimento(numEstabelecimento);
      
      if (!response) {
        return null;
      }

      return {
        id: response.id,
        nomeProdutor: response.bioProdutor?.nome || response.nome || '',
        numEstabelecimento: response.numeroEstabelecimento || '',
        filiada: response.bioProdutor?.filiadaNome || '',
        modalidade: response.fase || '',
        cabecasAlojadas: response.cabecas || 0,
        distancia: response.distancia || null,
        certificado: response.certificado || 'Não',
        doamDejetos: response.doamDejetos || 'Não',
        qtdLagoas: response.qtdLagoas || null,
        volLagoas: response.volLagoas || null,
        restricoesOperacionais: response.restricoes || null
      } as ProdutorListItem;
    } catch (error) {
      console.error(`Erro ao buscar produtor por número de estabelecimento ${numEstabelecimento}:`, error);
      return null;
    }
  }
};
