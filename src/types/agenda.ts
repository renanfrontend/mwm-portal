export interface AgendaPlanejadaDia {
  dataAgendada: string;
  qtdViagens: number;
}

export interface AgendaPlanejadaLinha {
  idEstabelecimento: number;
  produtor: string;
  distanciaKm: number;
  transportadora: string | null;
  dias: AgendaPlanejadaDia[];
}

export interface AgendaPlanejadaSemanaResponse {
  dataInicio: string;
  dataFim: string;
  linhas: AgendaPlanejadaLinha[];
}

export interface AgendaPlanejadaDiaPayload {
  idBioplanta: number;
  idFiliada: number;
  idEstabelecimento: number;
  produtor: string;
  distanciaKm: number;
  transportadora: string | null;
  dataAgendada: string;
  qtdViagens: number;
}
