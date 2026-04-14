import type { AgendaRealizadaSemanalResponse } from '../types/agendaRealizada';

/**
 * ============================================================================
 * UTILIDADE: Mapear Agenda Realizada para RowData
 * ============================================================================
 * Responsabilidade: Converter resposta da API para formato que AgendaTable espera
 * 
 * Converte:
 * - AgendaRealizadaSemanalResponse[] (resposta da API)
 * - Para: RowData[] (formato esperado pelo AgendaTable)
 * 
 * @author Sistema de Agenda
 * @date 2026-04-09
 */

interface RowData {
  id: number;
  idEstabelecimento: number;
  numEstabelecimento: string;  // numero_estabelecimento vindo da API
  produtor: string;
  distancia: number;
  km: number;
  transportadora: string;
  transp: string;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
  dom: number;
}

/**
 * ============================================================================
 * FUNÇÃO: Mapear Resposta da API para RowData
 * ============================================================================
 * Responsabilidade: Converter dados do endpoint para formato da grid
 * 
 * Recebe:
 *   - dados: Array de AgendaRealizadaSemanalResponse vindo da API
 * 
 * Retorna:
 *   - Array de RowData com estrutura esperada pelo AgendaTable
 * 
 * Mapeamento:
 * - numeroEstabelecimento → idEstabelecimento (convertido para número)
 * - nomeProduto → produtor
 * - distanciaKm → distancia
 * - totalKm → km
 * - transportadoraNome → transportadora (e transp)
 * - domingo/segunda/etc → dom/seg/ter/qua/qui/sex/sab
 */
export function mapearAgendaRealizadaParaRowData(
  dados: AgendaRealizadaSemanalResponse[]
): RowData[] {
  return dados.map((item, index) => ({
    // ID único para a grid (usa index como fallback)
    id: index,
    
    // Estabelecimento (usa numeroEstabelecimento convertido para número e string)
    idEstabelecimento: parseInt(item.numeroEstabelecimento, 10) || index,
    numEstabelecimento: item.numeroEstabelecimento, // numero_estabelecimento para exibir na coluna
    
    // Dados do produtor
    produtor: item.nomeProduto,
    distancia: item.distanciaKm,
    km: item.totalKm,
    
    // Dados da transportadora
    transportadora: item.transportadoraNome,
    transp: item.transportadoraNome, // Campo duplicado que AgendaTable espera
    
    // Contagens por dia da semana (mapeadas para o formato esperado)
    dom: item.domingo,
    seg: item.segunda,
    ter: item.terca,
    qua: item.quarta,
    qui: item.quinta,
    sex: item.sexta,
    sab: item.sabado,
  }));
}
