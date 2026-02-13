// src/types/transportadora.ts

export interface ContactInfo {
  nome: string;
  telefone: string;
  email: string;
}

export interface VeiculoInfo {
  id?: number; // Backend vai gerar automaticamente
  tipo: string;
  capacidade: number;
  placa: string;
  tipoAbastecimento: 'Diesel' | 'Biometano';
  tag?: string; // Obrigatório quando tipoAbastecimento === 'Biometano'
}

export interface TransportadoraFormInput {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  categoria?: string;
  
  endereco: string;
  cidade: string;
  uf: string;
  telefoneComercial: string;
  emailComercial: string;
  
  contatoPrincipal?: ContactInfo;
  
  veiculos?: VeiculoInfo[];
}

export interface TransportadoraResponse extends TransportadoraFormInput {
  id: string;
  status: 'Ativo' | 'Inativo';
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface TransportadoraListItem {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  cidade: string;
  uf: string;
  endereco?: string;
  status: 'Ativo' | 'Inativo';
  quantidadeVeiculos?: number;
  veiculos?: VeiculoInfo[];
  tags?: string[];
  estado?: string;
  placa?: string;
  categoria?: string;
  contatoPrincipal?: ContactInfo;
}

export interface TransportadoraListResponse {
  items: TransportadoraListItem[];
  total: number;
  page: number;
  pageSize: number;
}

// Tipos para API de veículos (sub-recurso)
export interface AddVeiculoRequest {
  tipo: string;
  capacidade: number;
  placa: string;
  tipoAbastecimento: 'Diesel' | 'Biometano';
  tag?: string;
}

export interface VeiculoResponse extends AddVeiculoRequest {
  id: string;
  transportadoraId: string;
  criadoEm?: string;
}
