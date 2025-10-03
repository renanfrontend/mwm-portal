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
  abastecimentos?: AbastecimentoItem[];
}

// Tipo para o sumário de abastecimento
export interface AbastecimentoSummaryItem {
  veiculo: string;
  placa: string;
  volumeTotal: number;
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

export interface AbastecimentoReportItem {
  status: string;
  cliente: string;
  veiculo: string;
  placa: string;
  produto: string;
  data: string;
  horaInicio: string;
  horaTermino: string;
  volume: number;
  odometro: number;
  usuario: string;
}

// Tipo para o volume de abastecimento por dia
export interface AbastecimentoVolumePorDiaItem {
  data: string;
  volumeTotal: number;
}

/**
 * Dados Mockados
 */
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

const abastecimentoMockData: AbastecimentoItem[] = [
  { veiculo: 'Veículo 1', m3: 2500 },
  { veiculo: 'Veículo 2', m3: 1500 },
  { veiculo: 'Veículo 3', m3: 800 },
  { veiculo: 'Veículo 4', m3: 4200 },
  { veiculo: 'Veículo 5', m3: 1000 }
];

const abastecimentoReportMockData: AbastecimentoReportItem[] = [
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Ração)',
    placa: 'BCK-0138',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:09:21',
    horaTermino: '17:09:21',
    volume: 134.56,
    odometro: 391396,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C55',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:08:56',
    horaTermino: '17:08:56',
    volume: 157.66,
    odometro: 370306,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Ração)',
    placa: 'BCK-0138',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:05:53',
    horaTermino: '17:05:53',
    volume: 166.03,
    odometro: 381134,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C55',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:05:32',
    horaTermino: '17:05:33',
    volume: 206.63,
    odometro: 384328,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Ração)',
    placa: 'BCK-0138',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:04:57',
    horaTermino: '17:04:58',
    volume: 136.78,
    odometro: 390768,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C55',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:04:10',
    horaTermino: '17:04:10',
    volume: 94.72,
    odometro: 370055,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Ração)',
    placa: 'BCK-0138',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:03:29',
    horaTermino: '17:03:30',
    volume: 171.27,
    odometro: 534723,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Ração)',
    placa: 'BCK-0138',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:03:01',
    horaTermino: '17:03:01',
    volume: 107.41,
    odometro: 399801,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C54',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:02:32',
    horaTermino: '17:02:33',
    volume: 30.46,
    odometro: 394095,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C54',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:02:04',
    horaTermino: '17:02:05',
    volume: 94.72,
    odometro: 389858,
    usuario: 'vanessa',
  },
  {
    status: 'Concluído',
    cliente: 'Primato Cooperativa Agroindustrial',
    veiculo: 'Caminhão (Dejeto)',
    placa: 'BBW-9C55',
    produto: 'Biometano',
    data: '2025-09-25',
    horaInicio: '17:01:34',
    horaTermino: '17:01:34',
    volume: 94.72,
    odometro: 399959,
    usuario: 'vanessa',
  },
];

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
  abastecimentos: [],
};


/**
 * Funções da API Mockada
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

export const fetchAbastecimentoData = (): Promise<AbastecimentoItem[]> => {
  console.log('Fetching abastecimento mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(abastecimentoMockData);
    }, 500); // Atraso menor para simular um endpoint mais rápido
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

export const fetchAbastecimentoVolumePorDiaData = (startDate?: string | null, endDate?: string | null): Promise<AbastecimentoVolumePorDiaItem[]> => {
  console.log('Fetching abastecimento volume por dia mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      const dataToProcess = (!startDate || !endDate)
        ? abastecimentoReportMockData
        : abastecimentoReportMockData.filter(item => {
          const itemDate = new Date(item.data);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });

      const volumePorDia = dataToProcess.reduce((acc, item) => {
        const data = item.data;
        if (!acc[data]) {
          acc[data] = {
            data: data,
            volumeTotal: 0,
          };
        }
        acc[data].volumeTotal += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoVolumePorDiaItem>);

      const sortedData = Object.values(volumePorDia).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

      resolve(sortedData);
    }, 900);
  });
};

export const fetchAbastecimentoAggregatedVolumeData = (
  period: 'day' | 'week' | 'month'
): Promise<AbastecimentoVolumeItem[]> => {
  console.log(`Fetching abastecimento aggregated volume mock data for period: ${period}...`);
  return new Promise(resolve => {
    setTimeout(() => {
      const aggregatedData = abastecimentoReportMockData.reduce((acc, item) => {
        const date = new Date(item.data);
        let key: string;

        switch (period) {
          case 'day':
            key = item.data; // YYYY-MM-DD
            break;
          case 'month':
            // Formato 'YYYY-MM' para agrupar por mês
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          case 'week':
            // Pega o primeiro dia da semana (domingo)
            const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
            key = firstDay.toISOString().split('T')[0];
            break;
        }

        if (!acc[key]) {
          acc[key] = { name: key, volume: 0 };
        }
        acc[key].volume += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoVolumeItem>);

      resolve(Object.values(aggregatedData).sort((a, b) => a.name.localeCompare(b.name)));
    }, 700);
  });
};

export const fetchAbastecimentoVolumeData = (): Promise<AbastecimentoVolumeItem[]> => {
  console.log('Fetching abastecimento volume mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      const monthlyTotals = monthNames.map(name => ({ name, volume: 0 }));

      abastecimentoReportMockData.forEach(item => {
        const date = new Date(item.data);
        const monthIndex = date.getMonth();
        if (monthlyTotals[monthIndex]) {
          monthlyTotals[monthIndex].volume += item.volume;
        }
      });

      // Garante que todos os meses tenham pelo menos o valor 0 e formata o volume
      const result = monthlyTotals.map(item => ({
        ...item,
        volume: parseFloat(item.volume.toFixed(2))
      }));

      resolve(result);
    }, 700);
  });
};

export const addAbastecimentoReportItem = (
  item: Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>
): Promise<AbastecimentoReportItem> => {
  console.log('Adding new abastecimento report item...', item);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: AbastecimentoReportItem = {
        ...item,
        status: 'Concluído',
        cliente: 'Primato Cooperativa Agroindustrial',
        horaTermino: item.horaInicio, // Simulação simples
      };
      // Adiciona no início da lista para ser visível imediatamente
      abastecimentoReportMockData.unshift(newItem);
      console.log('New item added:', newItem);
      resolve(newItem);
    }, 500);
  });
};

export const fetchAbastecimentoReportData = (startDate?: string | null, endDate?: string | null): Promise<AbastecimentoReportItem[]> => {
  console.log('Fetching abastecimento report mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      if (!startDate || !endDate) {
        resolve([...abastecimentoReportMockData]);
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filteredData = abastecimentoReportMockData.filter(item => {
        const itemDate = new Date(item.data);
        return itemDate >= start && itemDate <= end;
      });
      resolve(filteredData);
    }, 1000);
  });
};

export const fetchAbastecimentoSummaryData = (startDate?: string | null, endDate?: string | null): Promise<AbastecimentoSummaryItem[]> => {
  console.log('Fetching abastecimento summary mock data...');
  return new Promise(resolve => {
    setTimeout(() => {
      const dataToProcess = (!startDate || !endDate)
        ? abastecimentoReportMockData
        : abastecimentoReportMockData.filter(item => {
          const itemDate = new Date(item.data);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });

      const summary = dataToProcess.reduce((acc, item) => {
        const key = `${item.veiculo}-${item.placa}`;
        if (!acc[key]) {
          acc[key] = {
            veiculo: item.veiculo,
            placa: item.placa,
            volumeTotal: 0,
          };
        }
        acc[key].volumeTotal += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoSummaryItem>);

      resolve(Object.values(summary));
    }, 800);
  });
};