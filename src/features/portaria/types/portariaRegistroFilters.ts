/**
 * PORTARIA REGISTRO - Types de Filtros
 * Define filtros e query parameters
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 */

import type { PortariaTipo, PortariaStatus } from './portariaRegistro';

export interface PortariaRegistroFilters {
  status?: PortariaStatus;
  tipoRegistro?: PortariaTipo;
  dataInicio?: Date | string;
  dataFim?: Date | string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string; // "data_entrada:desc"
}

export interface PortariaRegistroListRequest {
  status?: PortariaStatus;
  tipoRegistro?: PortariaTipo;
  dataInicio?: string; // "yyyy-MM-dd"
  dataFim?: string; // "yyyy-MM-dd"
  search?: string;
  page: number;
  pageSize: number;
  sort?: string;
}
