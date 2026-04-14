/**
 * ============================================================================
 * TYPES: Agenda Realizada
 * ============================================================================
 * Define interfaces para dados de agenda realizada vindo da API
 * 
 * @author Sistema de Agenda
 * @date 2026-04-09
 */

/**
 * Resposta do endpoint GET /api/portaria/agenda-realizada/semanal
 * Uma linha por produtor com contagens diárias
 */
export interface AgendaRealizadaSemanalResponse {
  numeroEstabelecimento: string; // numero_estabelecimento da bio_estabelecimento
  nomeProduto: string;           // nome da bio_produtor
  distanciaKm: number;           // distancia_km da bio_produtor
  transportadoraNome: string;    // nome_fantasia da bio_transportadora
  domingo: number;               // Contagem domingo
  segunda: number;               // Contagem segunda
  terca: number;                 // Contagem terça
  quarta: number;                // Contagem quarta
  quinta: number;                // Contagem quinta
  sexta: number;                 // Contagem sexta
  sabado: number;                // Contagem sábado
  totalEntregas: number;         // Soma de todas as entregas na semana
  totalKm: number;               // distanciaKm * totalEntregas
}
