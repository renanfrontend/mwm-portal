// src/services/api.ts

/**
 * Tipos de Dados
 */

// Tipo para os cards de métricas no topo do dashboard
export interface Metric {
  color: string;
  id: number;
  icon: string;
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}

// Tipo para cada item na lista de estoque
export interface StockItem {
  id: number;
  label: string;
  value: number;
  capacity: number;
  unit: string;
  color: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger';
}

// Tipo para os dados do gráfico de Análise de Cooperados
export interface CooperativeAnalysisItem {
  name: string;
  value: number;
  color: string;
}

// Tipo para os dados do gráfico de Abastecimento por Veículo
export interface AbastecimentoItem {
  veiculo: string;
  m3: number;
}

// Estrutura completa dos dados do dashboard
export interface DashboardData {
  metrics: Metric[];
  stock: StockItem[];
  cooperativeAnalysis: CooperativeAnalysisItem[];
  abastecimentos: AbastecimentoItem[];
}

// Tipos e dados mockados para Faturamentos
export interface FaturamentoItem {
  name: string;
  faturamento: number;
  label: string;
}

// Tipos e dados mockados para Abastecimentos
export interface AbastecimentoVolumeItem {
  name: string;
  volume: number;
}

/**
 * Dados Mockados
 */

const mockData: DashboardData = {
  metrics: [
    {
      id: 1, icon: 'density_medium', label: 'Densidade dos dejetos', value: 1014, trend: 'up', color: 'is-primary'
    },
    { id: 2, icon: 'water_drop', label: 'Volume recebido', value: '34.6M', trend: 'up', unit: 'M³', color: 'is-link' },
    { id: 3, icon: 'timer', label: 'TMO diário', value: '16:00:00', trend: 'up', color: 'is-info' },
    { id: 4, icon: 'power_settings_new', label: 'Status operacional', value: 'Operando', trend: 'up', color: 'is-success' },
  ],
  stock: [
    { id: 1, label: 'Fertilizantes', value: 74480, capacity: 78400, unit: 't', color: 'is-link' },
    { id: 2, label: 'Bio Metano', value: 65000, capacity: 100000, unit: 'M³', color: 'is-success' },
    { id: 3, label: 'CO₂', value: 38000, capacity: 100000, unit: 'M³', color: 'is-warning' },
  ],
  cooperativeAnalysis: [
    { name: 'Ademir E.', value: 2.5, color: '#334bff' },
    { name: 'Ademir M.', value: 2.5, color: '#334bff' },
    { name: 'Ademir R.', value: 3.5, color: '#334bff' },
    { name: 'André S.', value: -1.5, color: '#ef4444' },
    { name: 'Arsênio W.', value: 3.5, color: '#334bff' },
    { name: 'Carlos P.', value: 2.5, color: '#334bff' },
    { name: 'Clarindo M.', value: -0.5, color: '#ef4444' },
    { name: 'Delcio R.', value: 2.5, color: '#334bff' },
    { name: 'Divino', value: 1.5, color: '#334bff' },
    { name: 'Ederson D.', value: 3.5, color: '#334bff' },
    { name: 'Egon P.', value: 1.5, color: '#334bff' },
    { name: 'Fazenda E.', value: 0.5, color: '#334bff' },
    { name: 'Francisco', value: -1.5, color: '#ef4444' },
    { name: 'Gelson R.', value: 3.5, color: '#334bff' },
    { name: 'Gilberto', value: 1.5, color: '#334bff' },
    { name: 'Gilmar P.', value: -0.5, color: '#ef4444' },
    { name: 'Guido D.', value: 1.5, color: '#334bff' },
    { name: 'Jacir M.', value: 5.5, color: '#334bff' },
    { name: 'Jose F.', value: 1.5, color: '#334bff' },
    { name: 'Ladir N.', value: 3.5, color: '#334bff' },
    { name: 'Ladir R.', value: 3.5, color: '#334bff' },
    { name: 'Laurindo M.', value: 3.5, color: '#334bff' },
    { name: 'Marcelo', value: 3.5, color: '#334bff' },
    { name: 'Marcos C.', value: 3.5, color: '#334bff' },
    { name: 'Marcos S.', value: 7.5, color: '#334bff' },
    { name: 'Marina K.', value: 2.5, color: '#334bff' },
    { name: 'Marines C.', value: 3.5, color: '#334bff' },
    { name: 'Marlise K.', value: 2.5, color: '#334bff' },
    { name: 'Nelson B.', value: 4.5, color: '#334bff' },
    { name: 'Oswaldo G.', value: 4.5, color: '#334bff' },
    { name: 'Renato I.', value: 1.5, color: '#334bff' },
    { name: 'Sueli L.', value: -11.5, color: '#ef4444' },
    { name: 'Valdecir', value: 0.5, color: '#334bff' },
    { name: 'Valdir K.', value: 4.5, color: '#334bff' },
    { name: 'Vilmar M.', value: 5.5, color: '#334bff' },
    { name: 'Vilson S.', value: 2.5, color: '#334bff' },
    { name: 'Zaura32', value: 1.5, color: '#334bff' },
  ],
  abastecimentos: [
    { veiculo: 'Veículo A', m3: 4500 },
    { veiculo: 'Veículo B', m3: 3200 },
    { veiculo: 'Veículo C', m3: 2800 },
    { veiculo: 'Veículo D', m3: 1800 },
    { veiculo: 'Outros', m3: 1200 },
  ],
};

const abastecimentoMockData: AbastecimentoItem[] = [
    { veiculo: 'Veículo 1', m3: 2500 },
    { veiculo: 'Veículo 2', m3: 1500 },
    { veiculo: 'Veículo 3', m3: 800 },
    { veiculo: 'Veículo 4', m3: 4200 },
    { veiculo: 'Veículo 5', m3: 1000 }
];

const faturamentoMockData: FaturamentoItem[] = [
  { name: 'Janeiro', faturamento: 2774.38, label: '3.50' },
  { name: 'Fevereiro', faturamento: 2637.99, label: '3.72' },
  { name: 'Março', faturamento: 5027.00, label: '3.70' },
  { name: 'Abril', faturamento: 3847.00, label: '3.60' },
  { name: 'Maio', faturamento: 5122.71, label: '3.50' },
  { name: 'Junho', faturamento: 18231.53, label: '3.46' },
  { name: 'Julho', faturamento: 26145.70, label: '3.46' },
  { name: 'Agosto', faturamento: 30948.37, label: '3.47' },
  { name: 'Setembro', faturamento: 0, label: '0.0' },
  { name: 'Outubro', faturamento: 0, label: '0.0' },
  { name: 'Novembro', faturamento: 0, label: '0.0' },
  { name: 'Dezembro', faturamento: 0, label: '0.0' },
];

const abastecimentoVolumeMockData: AbastecimentoVolumeItem[] = [
  { name: 'Janeiro', volume: 715.68 },
  { name: 'Fevereiro', volume: 902.32 },
  { name: 'Março', volume: 1575.00 },
  { name: 'Abril', volume: 1068.61 },
  { name: 'Maio', volume: 1466.49 },
  { name: 'Junho', volume: 5323.68 },
  { name: 'Julho', volume: 7556.56 },
  { name: 'Agosto', volume: 8919.04 },
  { name: 'Setembro', volume: 10797.01 },
  { name: 'Outubro', volume: 0 },
  { name: 'Novembro', volume: 0 },
  { name: 'Dezembro', volume: 0 },
];

/**
 * Funções da API Mockada
 */

export const fetchDashboardData = (): Promise<DashboardData> => {
  console.log('Fetching mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Mock data fetched!');
      resolve(mockData);
    }, 1000);
  });
};

export const fetchAbastecimentoData = (): Promise<AbastecimentoItem[]> => {
  console.log('Fetching abastecimento mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(abastecimentoMockData);
    }, 500);
  });
};

export const fetchFaturamentoData = (): Promise<FaturamentoItem[]> => {
  console.log('Fetching faturamento mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(faturamentoMockData);
    }, 800);
  });
};

export const fetchAbastecimentoVolumeData = (): Promise<AbastecimentoVolumeItem[]> => {
  console.log('Fetching abastecimento volume mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(abastecimentoVolumeMockData);
    }, 700);
  });
};