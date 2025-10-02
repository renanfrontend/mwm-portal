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

// Tipo para os dados do gráfico de Análise de Cooperados
export interface CooperativeAnalysisItem {
  name: string;
  value: number;
  color: string;
}

// Estrutura completa dos dados do dashboard
export interface DashboardData {
  metrics: Metric[];
  stock: StockItem[];
  cooperativeAnalysis: CooperativeAnalysisItem[];
}

/**
 * Dados Mockados
 */

const mockData: DashboardData = {
  metrics: [
    { id: 1, icon: 'density_medium', label: 'Densidade dos dejetos', value: 1014, trend: 'up' },
    { id: 2, icon: 'water_drop', label: 'Volume recebido', value: '34.6M', trend: 'up', unit: 'M³' },
    { id: 3, icon: 'timer', label: 'TMO diário', value: '16:00:00', trend: 'up' },
    { id: 4, icon: 'power_settings_new', label: 'Status operacional', value: 'Operando', trend: 'up' },
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