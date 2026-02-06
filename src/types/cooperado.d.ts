export interface CooperadoAPIInput {
  matricula: number;
  transportadoraId: number;
  tipoVeiculoId: number;
  nomeCooperado: string;
  cpfCnpj: string;
  placa: string;
  certificado: string;
  doamDejetos: string;
  fase: string;
  cabecas: number;
  tecnico: string;
  telefone: string;
  numPropriedade: string;
  numEstabelecimento: string;
  municipio: string;
  latitude: number;
  longitude: number;
  qtdLagoas?: number;
  volLagoas?: string;
  restricoes?: string;
  responsavel?: string;
  localizacao?: string;
  distancia?: string;
  filiadaId?: number; }

export interface CooperadoResponse {
  id: number;
  bioProdutor: {
    id: number;
    codigoProdutor: string;
    nome: string;
    cpfCnpj: string;
    telefonePrincipal: string;
  };
  codigoEstabelecimento?: string;
  numeroEstabelecimento?: string;
  numeroPropriedade?: string;
  matricula: string;
  nome: string;
  municipio: string;
  status: string;
  latitude: number | string;
  longitude: number | string;
  distancia?: string;
  qtdLagoas?: number;
  volLagoas?: string;
  fase?: string;
  cabecas?: number;
  certificado?: string;
  doamDejetos?: string;
  tecnico?: string;
  responsavel?: string;
  restricoes?: string;
  localizacao?: string;
  // ... outros campos de resposta se necessário
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
  restricoes: string;
  responsavel: string;
  tecnico: string;
  municipio: string;
  lat: string;
  long: string;
  distancia: string;
  localizacao: string;
}

export interface ProdutorListItem {
  id: number;
  nomeProdutor: string;
  numEstabelecimento: string;
  filiada: string;
  modalidade: string;
  cabecasAlojadas: number;
  distancia: string | null;
  certificado: string;
  participaProjeto: string;
  qtdLagoas: number | null;
  volLagoas: string | null;
  restricoesOperacionais: string | null;
}

export interface ProdutorListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: ProdutorListItem[];
}
