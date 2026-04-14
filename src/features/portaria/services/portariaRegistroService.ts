/**
 * PORTARIA REGISTRO - Service (CRUD + API)
 * Responsável por chamadas HTTP e operações CRUD
 * @author Antonio Marcos de Souza Santos
 * @date 25/03/2026
 */

import axios, { AxiosError } from 'axios';
import type {
  PortariaRegistro,
  PortariaRegistroResponse,
  PortariaRegistroSingleResponse,
  PortariaRegistroFormData,
  PortariaRegistroFilters,
} from '../types';
import { PortariaRegistroError as CustomError, ERROR_CODES } from '../types';
import { mockFetchPortariaData } from '../../../services/mock/api.mock';

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const ENDPOINT = '/portaria/registros';

// ============================================================================
// SERVIÇO
// ============================================================================

export const portariaRegistroService = {
  /**
   * Listar registros com paginação e filtros
   * GET /api/portaria?status=...&page=...&pageSize=...
   * Se VITE_USE_MOCK_API=true, retorna dados mockados
   */
  async listRegistros(
    filters?: PortariaRegistroFilters
  ): Promise<PortariaRegistroResponse> {
    try {
      // Se usar mock, retorna dados mockados
      if (USE_MOCK) {
        const mockData = await mockFetchPortariaData();
        return {
          data: mockData as any,
          pagination: {
            total: mockData.length,
            page: 0,
            pageSize: mockData.length,
            totalPages: 1,
          },
        };
      }

      const params = new URLSearchParams();
      
      // Debug: log dos dados que chegam
      console.log('🔍 [DEBUG] Filtros enviados:', filters);

      if (filters?.status) params.append('status', filters.status);
      if (filters?.tipoRegistro) params.append('tipoRegistro', filters.tipoRegistro);
      if (filters?.dataInicio) {
        const dataInicio =
          filters.dataInicio instanceof Date
            ? filters.dataInicio.toISOString().split('T')[0]
            : filters.dataInicio;
        params.append('dataInicio', dataInicio);
      }
      if (filters?.dataFim) {
        const dataFim =
          filters.dataFim instanceof Date
            ? filters.dataFim.toISOString().split('T')[0]
            : filters.dataFim;
        params.append('dataFim', dataFim);
      }
      if (filters?.search) params.append('search', filters.search);
      const page = filters?.page ?? 0;
      const pageSize = filters?.pageSize ?? 5;

      params.append('page', String(page));
      params.append('pageSize', String(pageSize));
      if (filters?.sort) params.append('sort', filters.sort);

      const url = `${API_BASE_URL}${ENDPOINT}?${params.toString()}`;
      console.log('🔗 [DEBUG] URL chamada:', url);
      
      const response = await axios.get<PortariaRegistroResponse>(url);
      
      console.log('📦 [DEBUG] Resposta da API:', response.data);
      console.log('📊 [DEBUG] Dados recebidos:', response.data.data);

      return response.data;
    } catch (error) {
      throw this._handleError(error, 'Erro ao buscar registros');
    }
  },

  /**
    * Obter registro por ID
    * GET /api/portaria/registros/{id}
    */
  async getRegistroById(id: string): Promise<PortariaRegistro> {
    try {
      const response = await axios.get<PortariaRegistro>(
        `${API_BASE_URL}${ENDPOINT}/${id}`
      );
      console.log('📡 [SERVICE] Registro por ID carregado:', response.data);
      // O backend retorna o objeto diretamente, não envolvido em {data: ...}
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new CustomError('Registro não encontrado', ERROR_CODES.NOT_FOUND, 404);
      }
      console.error('❌ [SERVICE] Erro ao buscar registro por ID:', error);
      throw this._handleError(error, 'Erro ao buscar registro');
    }
  },

  /**
   * Criar novo registro
   * POST /api/portaria
   */
  async createRegistro(data: PortariaRegistroFormData): Promise<PortariaRegistro> {
    try {
      const response = await axios.post<PortariaRegistroSingleResponse>(
        `${API_BASE_URL}${ENDPOINT}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this._handleError(error, 'Erro ao criar registro');
    }
  },

  /**
   * Atualizar registro
   * PUT /api/portaria/{id}
   */
  async updateRegistro(id: string, data: PortariaRegistroFormData): Promise<PortariaRegistro> {
    try {
      const response = await axios.put<PortariaRegistroSingleResponse>(
        `${API_BASE_URL}${ENDPOINT}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw this._handleError(error, 'Erro ao atualizar registro');
    }
  },

  /**
   * Deletar registro
   * DELETE /api/portaria/{id}
   */
  async deleteRegistro(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}${ENDPOINT}/${id}`);
    } catch (error) {
      throw this._handleError(error, 'Erro ao deletar registro');
    }
  },

  /**
   * Deletar múltiplos registros
   * DELETE /api/portaria (com body: { ids: [...] })
   */
  async deleteMultipleRegistros(ids: string[]): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}${ENDPOINT}`, {
        data: { ids },
      });
    } catch (error) {
      throw this._handleError(error, 'Erro ao deletar registros');
    }
  },

  /**
   * Tratador de erros centralizado
   */
  _handleError(error: any, defaultMessage: string): CustomError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      // Erro de validação (400)
      if (axiosError.response?.status === 400) {
        const data = axiosError.response.data;
        return new CustomError(
          data?.message || defaultMessage,
          ERROR_CODES.INVALID_FORMAT,
          400,
          data?.details
        );
      }

      // Não encontrado (404)
      if (axiosError.response?.status === 404) {
        return new CustomError('Registro não encontrado', ERROR_CODES.NOT_FOUND, 404);
      }

      // Conflito (409)
      if (axiosError.response?.status === 409) {
        return new CustomError(
          axiosError.response.data?.message || 'Conflito ao processar',
          ERROR_CODES.CONFLICT,
          409
        );
      }

      // Não autorizado (401)
      if (axiosError.response?.status === 401) {
        return new CustomError('Sem autenticação', ERROR_CODES.UNAUTHORIZED, 401);
      }

      // Proibido (403)
      if (axiosError.response?.status === 403) {
        return new CustomError('Acesso negado', ERROR_CODES.FORBIDDEN, 403);
      }

      // Erro do servidor (500)
      if (axiosError.response?.status === 500) {
        return new CustomError('Erro no servidor', ERROR_CODES.SERVER_ERROR, 500);
      }

      // Erro de conexão
      if (!axiosError.response) {
        return new CustomError('Erro de conexão com servidor', ERROR_CODES.NETWORK_ERROR);
      }

      // Outro erro
      return new CustomError(axiosError.message || defaultMessage, ERROR_CODES.UNKNOWN_ERROR);
    }

    // Erro genérico
    return new CustomError(defaultMessage, ERROR_CODES.UNKNOWN_ERROR);
  },
};
