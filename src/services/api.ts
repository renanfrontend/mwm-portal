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
  trend: "up" | "down" | "neutral";
  unit?: string;
}

// Tipo para cada item na lista de estoque
export interface StockItem {
  id: number;
  label: string;
  value: number;
  capacity: number;
  unit: string;
  color:
    | "is-primary"
    | "is-link"
    | "is-info"
    | "is-success"
    | "is-warning"
    | "is-danger";
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
  data: string;
  horaInicio: string;
  horaTermino: string;
  volume: number;
  odometro: number;
  usuario: string;
  produto: string;
}

// Tipo para o volume de abastecimento por dia
export interface AbastecimentoVolumePorDiaItem {
  data: string;
  volumeTotal: number;
}

// Interface para um item da lista de coleta
export interface ColetaItem {
  id: string; // Usar UUID para ID único
  cooperado: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  odometro: number;
  dataPrevisao: string;
  horaPrevisao: string;
  status: "Pendente" | "Entregue" | "Atrasado";
}

// Interface para um item de Cooperado
export interface CooperadoItem {
  id: string;
  matricula: number;
  filial: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  certificado: "Ativo" | "Inativo";
  doamDejetos: "Sim" | "Não";
  fase: string;
}

// Novo tipo para os eventos do calendário
export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

// Novo tipo para os dados da agenda customizada
export interface AgendaItem {
  id: number;
  cooperado: string;
  filial: "Primato" | "Agrocampo";
  coletas: { date: string; value: number | null; fullDate: string }[];
  somaColetas: number;
  km: number;
}

/**
 * Dados Mockados
 */
let abastecimentoReportMockData: AbastecimentoReportItem[] = [
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:09:21",
    horaTermino: "17:09:21",
    volume: 134.56,
    odometro: 391396,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:08:56",
    horaTermino: "17:08:56",
    volume: 157.66,
    odometro: 370306,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:05:53",
    horaTermino: "17:05:53",
    volume: 166.03,
    odometro: 381134,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:05:32",
    horaTermino: "17:05:33",
    volume: 206.63,
    odometro: 384328,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:04:57",
    horaTermino: "17:04:58",
    volume: 136.78,
    odometro: 390768,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C55",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:04:10",
    horaTermino: "17:04:10",
    volume: 94.72,
    odometro: 370055,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:03:29",
    horaTermino: "17:03:30",
    volume: 171.27,
    odometro: 534723,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Ração)",
    placa: "BCK-0138",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:03:01",
    horaTermino: "17:03:01",
    volume: 107.41,
    odometro: 399801,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C54",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:02:32",
    horaTermino: "17:02:33",
    volume: 30.46,
    odometro: 394095,
    usuario: "vanessa",
  },
  {
    status: "Concluído",
    cliente: "Primato Cooperativa Agroindustrial",
    veiculo: "Caminhão (Dejeto)",
    placa: "BBW-9C54",
    produto: "Biometano",
    data: "2025-09-25",
    horaInicio: "17:02:04",
    horaTermino: "17:02:05",
    volume: 94.72,
    odometro: 389858,
    usuario: "vanessa",
  },
];

const faturamentoMockData: FaturamentoItem[] = [
  { name: "Janeiro", faturamento: 2774.38, label: "3.50" },
  { name: "Fevereiro", faturamento: 2637.99, label: "3.72" },
  { name: "Março", faturamento: 5027.0, label: "3.70" },
  { name: "Abril", faturamento: 3847.0, label: "3.60" },
  { name: "Maio", faturamento: 5122.71, label: "3.50" },
  { name: "Junho", faturamento: 18231.53, label: "3.46" },
  { name: "Julho", faturamento: 26145.7, label: "3.46" },
  { name: "Agosto", faturamento: 30948.37, label: "3.47" },
  { name: "Setembro", faturamento: 0, label: "0.0" },
  { name: "Outubro", faturamento: 0, label: "0.0" },
  { name: "Novembro", faturamento: 0, label: "0.0" },
  { name: "Dezembro", faturamento: 0, label: "0.0" },
];

const abastecimentoMockData: AbastecimentoItem[] = [
  { veiculo: "Veículo 1", m3: 2500 },
  { veiculo: "Veículo 2", m3: 1500 },
  { veiculo: "Veículo 3", m3: 800 },
  { veiculo: "Veículo 4", m3: 4200 },
  { veiculo: "Veículo 5", m3: 1000 },
];

const mockData: DashboardData = {
  metrics: [
    {
      id: 1,
      icon: "density_medium",
      label: "Densidade dos dejetos",
      value: 1014,
      trend: "up",
    },
    {
      id: 2,
      icon: "water_drop",
      label: "Volume recebido",
      value: "34.6M",
      trend: "up",
      unit: "M³",
    },
    {
      id: 3,
      icon: "timer",
      label: "TMO diário",
      value: "16:00:00",
      trend: "up",
    },
    {
      id: 4,
      icon: "power_settings_new",
      label: "Status operacional",
      value: "Operando",
      trend: "up",
    },
  ],
  stock: [
    {
      id: 1,
      label: "Fertilizantes",
      value: 74480,
      capacity: 78400,
      unit: "t",
      color: "is-link",
    },
    {
      id: 2,
      label: "Bio Metano",
      value: 65000,
      capacity: 100000,
      unit: "M³",
      color: "is-success",
    },
    {
      id: 3,
      label: "CO₂",
      value: 38000,
      capacity: 100000,
      unit: "M³",
      color: "is-warning",
    },
  ],
  cooperativeAnalysis: [
    { name: "Ademir E.", value: 2.5, color: "#334bff" },
    { name: "Ademir M.", value: 2.5, color: "#334bff" },
    { name: "Ademir R.", value: 3.5, color: "#334bff" },
    { name: "André S.", value: -1.5, color: "#ef4444" },
    { name: "Arsênio W.", value: 3.5, color: "#334bff" },
    { name: "Carlos P.", value: 2.5, color: "#334bff" },
    { name: "Clarindo M.", value: -0.5, color: "#ef4444" },
    { name: "Delcio R.", value: 2.5, color: "#334bff" },
    { name: "Divino", value: 1.5, color: "#334bff" },
    { name: "Ederson D.", value: 3.5, color: "#334bff" },
    { name: "Egon P.", value: 1.5, color: "#334bff" },
    { name: "Fazenda E.", value: 0.5, color: "#334bff" },
    { name: "Francisco", value: -1.5, color: "#ef4444" },
    { name: "Gelson R.", value: 3.5, color: "#334bff" },
    { name: "Gilberto", value: 1.5, color: "#334bff" },
    { name: "Gilmar P.", value: -0.5, color: "#ef4444" },
    { name: "Guido D.", value: 1.5, color: "#334bff" },
    { name: "Jacir M.", value: 5.5, color: "#334bff" },
    { name: "Jose F.", value: 1.5, color: "#334bff" },
    { name: "Ladir N.", value: 3.5, color: "#334bff" },
    { name: "Ladir R.", value: 3.5, color: "#334bff" },
    { name: "Laurindo M.", value: 3.5, color: "#334bff" },
    { name: "Marcelo", value: 3.5, color: "#334bff" },
    { name: "Marcos C.", value: 3.5, color: "#334bff" },
    { name: "Marcos S.", value: 7.5, color: "#334bff" },
    { name: "Marina K.", value: 2.5, color: "#334bff" },
    { name: "Marines C.", value: 3.5, color: "#334bff" },
    { name: "Marlise K.", value: 2.5, color: "#334bff" },
    { name: "Nelson B.", value: 4.5, color: "#334bff" },
    { name: "Oswaldo G.", value: 4.5, color: "#334bff" },
    { name: "Renato I.", value: 1.5, color: "#334bff" },
  ],
  abastecimentos: [],
};

let mockColetaData: ColetaItem[] = [
  {
    id: "1",
    cooperado: "Primato",
    motorista: "Luiz Carlos",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    odometro: 123456,
    dataPrevisao: "2025-01-01",
    horaPrevisao: "15:00",
    status: "Pendente",
  },
  {
    id: "2",
    cooperado: "Primato",
    motorista: "Marcos Paulo",
    tipoVeiculo: "Caminhão de ração",
    placa: "XYZ-4567",
    odometro: 234567,
    dataPrevisao: "2025-01-02",
    horaPrevisao: "10:00",
    status: "Entregue",
  },
  {
    id: "3",
    cooperado: "Primato",
    motorista: "Ana Cássia",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "GHI-7890",
    odometro: 345678,
    dataPrevisao: "2025-01-03",
    horaPrevisao: "11:30",
    status: "Atrasado",
  },
];

let mockCooperadosData: CooperadoItem[] = [
  {
    id: "1",
    matricula: 102646,
    filial: "Primato",
    motorista: "Renato Ivan",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Inativo",
    doamDejetos: "Não",
    fase: "Fase Term. Firmesa",
  },
  {
    id: "2",
    matricula: 102284,
    filial: "Primato",
    motorista: "Ademir Machioro",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "GRSC",
  },
  {
    id: "3",
    matricula: 103034,
    filial: "Primato",
    motorista: "Carlos Jaime Pauly",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "Fase Crecjário",
  },
  {
    id: "4",
    matricula: 100173,
    filial: "Primato",
    motorista: "Clarindo Mazzarollo",
    tipoVeiculo: "Caminhão de dejetos",
    placa: "ABC-1D23",
    certificado: "Ativo",
    doamDejetos: "Sim",
    fase: "UPD",
  },
];

export const fetchCooperadosData = (): Promise<CooperadoItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCooperadosData);
    }, 500);
  });
};

/**
 * Novos Dados Mocados para a Agenda
 */
const newMockAgendaData: AgendaData[] = [
  {
    id: 1,
    cooperado: "Ademir Engelsing",
    transportadora: "Primato",
    seg: 0,
    ter: 2,
    qua: 0,
    qui: 0,
    sex: 0,
    qtd: 2,
    km: 300,
    status: "Realizado",
  },
  {
    id: 2,
    cooperado: "Ademir Marchioro",
    transportadora: "Primato",
    seg: 4,
    ter: 2,
    qua: 0,
    qui: 4,
    sex: 0,
    qtd: 10,
    km: 300,
    status: "Realizado",
  },
  {
    id: 3,
    cooperado: "Arseno Weschendeider",
    transportadora: "Primato",
    seg: 10,
    ter: 4,
    qua: 4,
    qui: 6,
    sex: 0,
    qtd: 34,
    km: 300,
    status: "Realizado",
  },
  {
    id: 4,
    cooperado: "Carlos Jaime Pauly",
    transportadora: "Primato",
    seg: 10,
    ter: 9,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 49,
    km: 300,
    status: "Realizado",
  },
  {
    id: 5,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
  {
    id: 6,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
  {
    id: 7,
    cooperado: "Delcio Rossetto",
    transportadora: "Agrocampo",
    seg: 10,
    ter: 10,
    qua: 10,
    qui: 10,
    sex: 10,
    qtd: 50,
    km: 300,
    status: "Planejado",
  },
];

export const fetchColetaData = (): Promise<ColetaItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Retorna uma cópia para evitar mutação direta do array mockado
      resolve([...mockColetaData]);
    }, 500);
  });
};

export const updateColetaItem = (item: ColetaItem): Promise<ColetaItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockColetaData.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        mockColetaData[index] = item;
        resolve(item);
      } else {
        reject(new Error("Item de coleta não encontrado."));
      }
    }, 500);
  });
};

export const createColetaItem = (
  item: Omit<ColetaItem, "id">
): Promise<ColetaItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: ColetaItem = {
        ...item,
        id: new Date().getTime().toString(), // Gera um ID único
      };
      // Adiciona o novo item no início da lista
      mockColetaData.unshift(newItem);
      resolve(newItem);
    }, 500);
  });
};

export const fetchAbastecimentoReportData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoReportItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = abastecimentoReportMockData;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = data.filter((item) => {
          const itemDate = new Date(item.data);
          return itemDate >= start && itemDate <= end;
        });
      }
      resolve(data);
    }, 500);
  });
};

export const fetchAbastecimentoVolumePorDiaData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoVolumePorDiaItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = abastecimentoReportMockData;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = data.filter((item) => {
          const itemDate = new Date(item.data);
          return itemDate >= start && itemDate <= end;
        });
      }

      const volumePorDia = data.reduce((acc, item) => {
        if (!acc[item.data]) {
          acc[item.data] = { data: item.data, volumeTotal: 0 };
        }
        acc[item.data].volumeTotal += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoVolumePorDiaItem>);

      resolve(
        Object.values(volumePorDia).sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        )
      );
    }, 500);
  });
};

export const addAbastecimentoReportItem = (
  item: Omit<AbastecimentoReportItem, "status" | "cliente" | "horaTermino">
): Promise<AbastecimentoReportItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: AbastecimentoReportItem = {
        ...item,
        status: "Concluído",
        cliente: "Primato Cooperativa Agroindustrial",
        horaTermino: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
      };
      abastecimentoReportMockData.unshift(newItem);
      resolve(newItem);
    }, 500);
  });
};

type Period = "day" | "week" | "month";

export const fetchAbastecimentoAggregatedVolumeData = (
  period: Period
): Promise<AbastecimentoVolumeItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const aggregatedData = abastecimentoReportMockData.reduce((acc, item) => {
        const date = new Date(item.data);
        let key: string;

        switch (period) {
          case "day":
            key = item.data;
            break;
          case "month":
            key = date.toLocaleString("pt-BR", { month: "long" });
            key = key.charAt(0).toUpperCase() + key.slice(1);
            break;
          case "week": {
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear =
              (date.getTime() - startOfYear.getTime()) / 86400000;
            const weekNumber = Math.ceil(
              (pastDaysOfYear + startOfYear.getDay() + 1) / 7
            );
            key = `Semana ${weekNumber}`;
            break;
          }
          default:
            key = item.data;
            break;
        }

        if (!acc[key]) {
          acc[key] = {
            name: key,
            volume: 0,
          };
        }
        acc[key].volume += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoVolumeItem>);

      const sortedData = Object.values(aggregatedData).sort((a, b) => {
        if (period === "day")
          return new Date(a.name).getTime() - new Date(b.name).getTime();
        return 0;
      });

      resolve(sortedData);
    }, 500);
  });
};

export const fetchFaturamentoData = (): Promise<FaturamentoItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(faturamentoMockData);
    }, 500);
  });
};

export const fetchAbastecimentoVolumeData = (): Promise<
  AbastecimentoVolumeItem[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const volumePorMes = abastecimentoReportMockData.reduce((acc, item) => {
        const month = new Date(item.data).toLocaleString("pt-BR", {
          month: "long",
        });
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

        if (!acc[capitalizedMonth]) {
          acc[capitalizedMonth] = {
            name: capitalizedMonth,
            volume: 0,
          };
        }
        acc[capitalizedMonth].volume += item.volume;
        return acc;
      }, {} as Record<string, AbastecimentoVolumeItem>);

      const finalData = faturamentoMockData.map((fatura) => {
        return volumePorMes[fatura.name] || { name: fatura.name, volume: 0 };
      });

      resolve(finalData);
    }, 500);
  });
};

export const fetchDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dashboardDataWithAbastecimentos = { ...mockData };
      if (
        !dashboardDataWithAbastecimentos.abastecimentos ||
        dashboardDataWithAbastecimentos.abastecimentos.length === 0
      ) {
        dashboardDataWithAbastecimentos.abastecimentos = abastecimentoMockData;
      }
      resolve(dashboardDataWithAbastecimentos);
    }, 500);
  });
};

export const fetchAbastecimentoSummaryData = (
  startDate?: string,
  endDate?: string
): Promise<AbastecimentoSummaryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = abastecimentoReportMockData;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = data.filter((item) => {
          const itemDate = new Date(item.data);
          return itemDate >= start && itemDate <= end;
        });
      }
      const summary = data.reduce((acc, item) => {
        const key = `${item.veiculo}-${item.placa}`;
        if (!acc[key]) {
          acc[key] = {
            veiculo: item.veiculo,
            placa: item.placa,
            volumeTotal: 0,
          };
        }
        if (item.produto) {
          acc[key].volumeTotal += item.volume;
        }
        return acc;
      }, {} as Record<string, AbastecimentoSummaryItem>);

      resolve(Object.values(summary));
    }, 500);
  });
};

export interface PortariaItem {
  id: string;
  categoria: 'Entregas' | 'Abastecimentos' | 'Coletas' | 'Visitas';
  data: string;
  horario: string;
  empresa: string;
  motorista: string;
  tipoVeiculo: string;
  placa: string;
  atividade: string;
  status: 'Concluído' | 'Pendente';
}

/**
 * Nova Interface para a Agenda Refatorada
 * Esta interface corresponde à estrutura de dados que a nova tabela espera.
 */
export interface AgendaData {
  id: number;
  cooperado: string;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  qtd: number;
  km: number;
  transportadora: "Primato" | "Agrocampo";
  status: "Realizado" | "Planejado";
}




/**
 * Novos Dados Mocados para a Portaria
 */
const mockPortariaData: PortariaItem[] = [
  { id: 'ENT-001', categoria: 'Entregas', data: '01/01/2026', horario: '10:00H', empresa: 'Primato', motorista: 'Ademir Engelsing', tipoVeiculo: 'Caminhão de dejetos', placa: 'ABC-1D23', atividade: 'Entrega de dejetos', status: 'Concluído' },
  { id: 'ENT-002', categoria: 'Entregas', data: '01/01/2026', horario: '13:00H', empresa: 'Mosaic', motorista: 'Renato Ivan', tipoVeiculo: 'Caminhão de entrega', placa: 'ABC-1D23', atividade: 'Entrega de materiais', status: 'Pendente' },
  { id: 'ABS-001', categoria: 'Abastecimentos', data: '02/01/2026', horario: '09:30H', empresa: 'Transportadora XYZ', motorista: 'Carlos Silva', tipoVeiculo: 'Caminhão Tanque', placa: 'DEF-4567', atividade: 'Abastecimento de Diesel', status: 'Concluído' },
];

/**
 * Nova Função Fetch para a Portaria
 */
export const fetchPortariaData = (): Promise<PortariaItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPortariaData);
    }, 500);
  });
};

/**
 * Nova Função Fetch (que estava faltando)
 */
export const fetchNewAgendaData = (): Promise<AgendaData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newMockAgendaData);
    }, 500); // Simula um delay de rede
  });
};
