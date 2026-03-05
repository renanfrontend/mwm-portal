export interface CooperadoAPIInput {
  filiadaId: number;
  matricula: number;
  nomeCooperado: string;
  responsavel: string;
  cpfCnpj: string;
  certificado: string;
  doamDejetos: string;
  qtdLagoas: number;
  volLagoas: string;
  fase: string;
  cabecas: number;
  tecnico: string;
  numPropriedade: string;
  numEstabelecimento: string;
  municipio: string;
  localizacao: string;
  latitude: number;
  longitude: number;
  distanciaKm: number;
  restricoes: string;
}

export interface ProdutorFormInput {
  cpfCnpj: string;
  nome: string;
  numEstabelecimento: string;
  nPropriedade: string;
  matricula: string;
  filiada: string;
  faseDejeto: string;
  cabecas: string;
  certificado: string;
  doamDejetos: string;
  qtdLagoas: string;
  volLagoas: string;
  responsavel: string;
  tecnico: string;
  municipio: string;
  localizacao: string;
  lat: string;
  long: string;
  distancia: string;
  restricoes: string;
}

export interface ProdutorListItem {
  id: number;
  nomeProdutor: string;
  numEstabelecimento: string;
  filiada: string;
  modalidade: string;
  cabecasAlojadas: number;
  distancia: string;
  certificado: string;
  doamDejetos?: string;
  volLagoas?: string;
  restricoesOperacionais?: string;
}

export interface ProdutorListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: ProdutorListItem[];
}

export interface CooperadoResponse extends CooperadoAPIInput {
  id: number;
}