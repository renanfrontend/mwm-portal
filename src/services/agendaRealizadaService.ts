import type { AgendaRealizadaSemanalResponse } from '../types/agendaRealizada';

/**
 * ============================================================================
 * SERVICE: Agenda Realizada
 * ============================================================================
 * Responsabilidade: Comunicação com API de agenda realizada
 * 
 * Métodos:
 * - getAgendaRealizadaSemanal(): Buscar dados de uma semana
 * 
 * @author Sistema de Agenda
 * @date 2026-04-09
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export class AgendaRealizadaService {
  /**
   * ============================================================================
   * MÉTODO: Obter Agenda Realizada Semanal
   * ============================================================================
   * Responsabilidade: Buscar dados de agenda realizada da API para uma semana
   * 
   * Recebe:
   *   - dataInicio: Data inicial (formato: yyyy-MM-dd)
   *   - dataFim: Data final (formato: yyyy-MM-dd)
   * 
   * Retorna:
   *   - Promise<AgendaRealizadaSemanalResponse[]>: Lista de linhas do grid
   * 
   * Lança exceção:
   *   - Se houver erro na requisição
   *   - Se as datas forem inválidas
   */
  static async getAgendaRealizadaSemanal(
    dataInicio: string,
    dataFim: string
  ): Promise<AgendaRealizadaSemanalResponse[]> {
    try {
      const url = `${API_BASE_URL}/portaria/agenda-realizada/semanal?dataInicio=${dataInicio}&dataFim=${dataFim}`;
      
      console.log(`📅 [AGENDA-REALIZADA] Buscando dados: ${dataInicio} a ${dataFim}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: AgendaRealizadaSemanalResponse[] = await response.json();
      
      console.log(`✅ [AGENDA-REALIZADA] Dados carregados:`, data);
      
      return data;
    } catch (error) {
      console.error(`❌ [AGENDA-REALIZADA] Erro ao buscar:`, error);
      throw error;
    }
  }
}

export default AgendaRealizadaService;
