// src/types/transportadora.ts

export interface ContactInfo {
  nome: string;
  telefone: string;
  email: string;
}

export interface VeiculoInfo {
  id?: string; // Opcional no create, obrigatório no response
  tipo: string;
  capacidade: string;
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
  contatoComercial?: ContactInfo;
  contatoFinanceiro?: ContactInfo;
  contatoJuridico?: ContactInfo;
  
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
  telefoneComercial?: string;
  emailComercial?: string;
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
  contatoComercial?: ContactInfo;
  contatoFinanceiro?: ContactInfo;
  contatoJuridico?: ContactInfo;
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
  capacidade: string;
  placa: string;
  tipoAbastecimento: 'Diesel' | 'Biometano';
  tag?: string;
}

export interface VeiculoResponse extends AddVeiculoRequest {
  id: string;
  transportadoraId: string;
  criadoEm?: string;
}
