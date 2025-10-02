// src/services/api.ts

/**
 * Tipos de Dados
 */

// Tipo para os cards de métricas no topo do dashboard
export interface Metric {
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

// Tipo para os dados do gráfico (formato do Google Charts)
export type ChartData = (string | number | { role: string })[][];

// Estrutura completa dos dados do dashboard
export interface DashboardData {
  metrics: Metric[];
  stock: StockItem[];
  cooperativeAnalysis: ChartData;
}

/**
 * Dados Mockados
 */

const mockData: DashboardData = {
  metrics: [
    { id: 1, icon: 'water_do', label: 'Densidade dos dejetos', value: 1014, trend: 'up' },
    { id: 2, icon: 'water', label: 'Volume recebido', value: '34.6M', trend: 'up', unit: 'M³' },
    { id: 3, icon: 'timer', label: 'TMO diário', value: '16:00:00', trend: 'up' },
    { id: 4, icon: 'mode_off_on', label: 'Status operacional', value: 'Operando', trend: 'up' },
  ],
  stock: [
    { id: 1, label: 'Fertilizantes', value: 74480, capacity: 78400, unit: 't', color: 'is-link' },
    { id: 2, label: 'Bio Metano', value: 65000, capacity: 100000, unit: 'M³', color: 'is-success' },
    { id: 3, label: 'CO₂', value: 38000, capacity: 100000, unit: 'M³', color: 'is-warning' },
  ],
  cooperativeAnalysis: [
    ['Cooperado', 'Densidade', { role: 'style' }],
    ['Ademir E.', 2.5, '#334bff'],
    ['Ademir M.', 2.5, '#334bff'],
    ['Ademir R.', 3.5, '#334bff'],
    ['André S.', -1.5, '#ef4444'],
    ['Arsênio W.', 3.5, '#334bff'],
    ['Carlos P.', 2.5, '#334bff'],
    ['Clarindo M.', -0.5, '#ef4444'],
    ['Delcio R.', 2.5, '#334bff'],
    ['Divino', 1.5, '#334bff'],
    ['Ederson D.', 3.5, '#334bff'],
    ['Egon P.', 1.5, '#334bff'],
    ['Fazenda E.', 0.5, '#334bff'],
    ['Francisco', -1.5, '#ef4444'],
    ['Gelson R.', 3.5, '#334bff'],
    ['Gilberto', 1.5, '#334bff'],
    ['Gilmar P.', -0.5, '#ef4444'],
    ['Guido D.', 1.5, '#334bff'],
    ['Jacir M.', 5.5, '#334bff'],
    ['Jose F.', 1.5, '#334bff'],
    ['Ladir N.', 3.5, '#334bff'],
    ['Ladir R.', 3.5, '#334bff'],
    ['Laurindo M.', 3.5, '#334bff'],
    ['Marcelo', 3.5, '#334bff'],
    ['Marcos C.', 3.5, '#334bff'],
    ['Marcos S.', 7.5, '#334bff'],
    ['Marina K.', 2.5, '#334bff'],
    ['Marines C.', 3.5, '#334bff'],
    ['Marlise K.', 2.5, '#334bff'],
    ['Nelson B.', 4.5, '#334bff'],
    ['Oswaldo G.', 4.5, '#334bff'],
    ['Renato I.', 1.5, '#334bff'],
    ['Sueli L.', -11.5, '#ef4444'],
    ['Valdecir', 0.5, '#334bff'],
    ['Valdir K.', 4.5, '#334bff'],
    ['Vilmar M.', 5.5, '#334bff'],
    ['Vilson S.', 2.5, '#334bff'],
    ['Zaura32', 1.5, '#334bff'],
  ],
};

/**
 * Função da API Mockada
 * Simula uma chamada de rede com um atraso de 1 segundo.
 */
export const fetchDashboardData = (): Promise<DashboardData> => {
  console.log('Fetching mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Mock data fetched!');
      resolve(mockData);
    }, 1000); // Atraso de 1 segundo
  });
};