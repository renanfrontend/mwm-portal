export interface AgendaRow {
  id: string | number;
  idEstabelecimento?: number;
  numEstabelecimento?: string;
  produtor: string;
  distancia: string | number;
  distanciaKm?: string | number;
  km?: string | number;
  transp: string;
  seg?: number;
  ter?: number;
  qua?: number;
  qui?: number;
  sex?: number;
  sab?: number;
  dom?: number;
  // Adicione outros campos conforme necessário
  [key: string]: string | number | undefined;
}
