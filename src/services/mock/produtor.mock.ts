import type { CooperadoAPIInput, CooperadoResponse, ProdutorListResponse, ProdutorListItem } from '../../types/cooperado';

// Simulação de banco de dados em memória
let mockProdutores: any[] = [
  {
    id: 1,
    matricula: '101',
    transportadoraId: 1,
    tipoVeiculoId: 1,
    nomeCooperado: 'João Silva',
    cpfCnpj: '123.456.789-00',
    placa: 'ABC-1234',
    certificado: 'Ativo',
    doamDejetos: 'Sim',
    fase: 'Fase 1',
    cabecas: 100,
    tecnico: 'Carlos Souza',
    telefone: '45999999999',
    numPropriedade: 'PROP-001',
    numEstabelecimento: 'EST-001',
    municipio: 'Toledo',
    latitude: -24.7136,
    longitude: -53.7428,
    qtdLagoas: 2,
    volLagoas: '1000m³',
    restricoes: 'Nenhuma',
    responsavel: 'João Silva',
    localizacao: 'Rural',
    distancia: '10km',
    filiadaId: 1,
    // Campos adicionais para compatibilidade
    bioProdutor: {
        nome: 'João Silva',
        cpfCnpj: '123.456.789-00',
        codigoProdutor: 'PROD-001'
    },
    nome: 'João Silva',
    status: 'Ativo'
  }
];

let nextId = 2;

export const mockListProdutores = (
  _plantaId: number,
  filiadaId: number,
  page: number = 1,
  pageSize: number = 9999
): Promise<ProdutorListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filtrar por filiadaId se necessário
      const filtered = mockProdutores.filter(p => p.filiadaId === filiadaId);
      
      // Mapear para ProdutorListItem
      const items: ProdutorListItem[] = filtered.map(p => ({
        id: p.id,
        nomeProdutor: p.nomeCooperado,
        numEstabelecimento: p.numEstabelecimento,
        filiada: 'Toledo-PR',
        modalidade: p.fase,
        cabecasAlojadas: p.cabecas,
        distancia: p.distancia,
        certificado: p.certificado,
        participaProjeto: 'Sim',
        qtdLagoas: p.qtdLagoas,
        volLagoas: p.volLagoas,
        restricoesOperacionais: p.restricoes
      }));

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = items.slice(start, end);

      resolve({
        items: paginatedData,
        total: filtered.length,
        page,
        pageSize
      });
    }, 300); // Simula delay de rede
  });
};

export const mockCreateProdutor = (payload: CooperadoAPIInput): Promise<CooperadoResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProdutor: any = {
        id: nextId++,
        ...payload,
        bioProdutor: {
            nome: payload.nomeCooperado,
            cpfCnpj: payload.cpfCnpj,
            codigoProdutor: `PROD-${nextId}`
        },
        nome: payload.nomeCooperado,
        status: 'Ativo'
      };
      
      mockProdutores.push(newProdutor);
      
      console.log('✅ Mock: Produtor criado com sucesso', newProdutor);
      resolve(newProdutor as CooperadoResponse);
    }, 500); // Simula delay de rede
  });
};

// Função auxiliar para resetar os dados mockados (útil para testes)
export const resetMockProdutores = () => {
  mockProdutores = [];
  nextId = 1;
};
