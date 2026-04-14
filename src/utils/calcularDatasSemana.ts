import { startOfWeek, endOfWeek, format } from 'date-fns';

/**
 * ============================================================================
 * UTILIDADE: Calcular Datas da Semana
 * ============================================================================
 * Responsabilidade: Calcular datas inicial e final de uma semana
 * 
 * Usa:
 * - Semana começa no domingo (padrão do sistema)
 * - Formato esperado pela API: yyyy-MM-dd
 * 
 * @author Sistema de Agenda
 * @date 2026-04-09
 */

/**
 * ============================================================================
 * FUNÇÃO: Calcular Datas da Semana
 * ============================================================================
 * Responsabilidade: Obter domingo e sábado de uma semana
 * 
 * Recebe:
 *   - date: Data qualquer dentro da semana desejada
 * 
 * Retorna:
 *   - Objeto com:
 *     - dataInicio: Domingo da semana (formato: yyyy-MM-dd)
 *     - dataFim: Sábado da semana (formato: yyyy-MM-dd)
 * 
 * Exemplo:
 *   Input: 2026-04-09 (quinta-feira)
 *   Output: {
 *     dataInicio: "2026-04-05" (domingo),
 *     dataFim: "2026-04-11" (sábado)
 *   }
 */
export function calcularDatasSemana(date: Date): {
  dataInicio: string;
  dataFim: string;
} {
  // Calcular domingo (início da semana)
  const inicio = startOfWeek(date, { weekStartsOn: 0 }); // 0 = domingo
  
  // Calcular sábado (fim da semana)
  const fim = endOfWeek(date, { weekStartsOn: 0 });
  
  // Formatar no padrão esperado pela API: yyyy-MM-dd
  const dataInicio = format(inicio, 'yyyy-MM-dd');
  const dataFim = format(fim, 'yyyy-MM-dd');
  
  console.log(`📅 [DATAS-SEMANA] ${dataInicio} a ${dataFim}`);
  
  return {
    dataInicio,
    dataFim,
  };
}
