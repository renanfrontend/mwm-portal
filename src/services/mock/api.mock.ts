// EXPORT all types for the app
export type {
  AbastecimentoItem,
  AbastecimentoReportItem,
  AbastecimentoSummaryItem,
  AbastecimentoVolumeItem,
  AbastecimentoVolumePorDiaItem,
  AgendaData,
  ColetaItem,
  CooperativeAnalysisItem,
  CooperadoItem,
  DashboardData,
  FaturamentoItem,
  Metric,
  PortariaItem,
  QualidadeDejetosItem,
  StockItem,
  CalendarEvent,
  AgendaItem,
  TransportadoraItem,
  ContactInfo,
  VeiculoInfo
} from "../../types/models";

// Import types locally
import {
  type AbastecimentoItem,
  type AbastecimentoReportItem,
  type AbastecimentoSummaryItem,
  type AbastecimentoVolumeItem,
  type AbastecimentoVolumePorDiaItem,
  type AgendaData,
  type ColetaItem,
  type CooperadoItem,
  type DashboardData,
  type FaturamentoItem,
  type PortariaItem,
  type QualidadeDejetosItem,
  type TransportadoraItem,
} from "../../types/models";

export interface CategoriaOption {
  id: number;
  label: string;
  value: string;
}

// --- DADOS ORIGINAIS DO SEU DASHBOARD (MANTIDOS INTACTOS) ---

let abastecimentoReportMockData: AbastecimentoReportItem[] = [
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Ração)", placa: "BCK-0138", produto: "Biometano", data: "2025-09-25", horaInicio: "17:09:21", horaTermino: "17:09:21", volume: 134.56, odometro: 391396, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Dejeto)", placa: "BBW-9C55", produto: "Biometano", data: "2025-09-25", horaInicio: "17:08:56", horaTermino: "17:08:56", volume: 157.66, odometro: 370306, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Ração)", placa: "BCK-0138", produto: "Biometano", data: "2025-09-25", horaInicio: "17:05:53", horaTermino: "17:05:53", volume: 166.03, odometro: 381134, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Dejeto)", placa: "BBW-9C55", produto: "Biometano", data: "2025-09-25", horaInicio: "17:05:32", horaTermino: "17:05:33", volume: 206.63, odometro: 384328, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Ração)", placa: "BCK-0138", produto: "Biometano", data: "2025-09-25", horaInicio: "17:04:57", horaTermino: "17:04:58", volume: 136.78, odometro: 390768, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Dejeto)", placa: "BBW-9C55", produto: "Biometano", data: "2025-09-25", horaInicio: "17:04:10", horaTermino: "17:04:10", volume: 94.72, odometro: 370055, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Ração)", placa: "BCK-0138", produto: "Biometano", data: "2025-09-25", horaInicio: "17:03:29", horaTermino: "17:03:30", volume: 171.27, odometro: 534723, usuario: "vanessa" },
  { status: "Concluído", cliente: "Primato Cooperativa Agroindustrial", veiculo: "Caminhão (Ração)", placa: "BCK-0138", produto: "Biometano", data: "2025-09-25", horaInicio: "17:03:01", horaTermino: "17:03:01", volume: 107.41, odometro: 399801, usuario: "vanessa" },
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
  { id: "1001", data: "2025-01-01", horaInicio: "08:00", tipoAbastecimento: "Bomba", tipoVeiculo: "Caminhão", produto: "Biometano", placa: "ABC-1234", transportadora: "Translog", odometro: "1000", pressaoInicial: "200", status: "Concluído", usuario: "sistema", veiculo: "Caminhão 01", m3: 50 },
  { id: "1002", data: "2025-01-02", horaInicio: "09:00", tipoAbastecimento: "Bomba", tipoVeiculo: "Caminhão", produto: "Biometano", placa: "DEF-5678", transportadora: "Rapidão", odometro: "2000", pressaoInicial: "200", status: "Concluído", usuario: "sistema", veiculo: "Caminhão 02", m3: 60 },
];

const mockData: DashboardData = {
  metrics: [
    { id: 1, icon: "density_medium", label: "Densidade dos dejetos", value: 1014, trend: "up" },
    { id: 2, icon: "water_drop", label: "Volume recebido", value: "34.6M", trend: "up", unit: "M³" },
    { id: 3, icon: "timer", label: "TMO diário", value: "16:00:00", trend: "up" },
    { id: 4, icon: "power_settings_new", label: "Status operacional", value: "Operando", trend: "up" },
  ],
  stock: [
    { id: 1, label: "Fertilizantes", value: 74480, capacity: 78400, unit: "t", color: "is-link" },
    { id: 2, label: "Bio Metano", value: 65000, capacity: 100000, unit: "M³", color: "is-success" },
    { id: 3, label: "CO₂", value: 38000, capacity: 100000, unit: "M³", color: "is-warning" },
  ],
  cooperativeAnalysis: [
    { name: "Ademir E.", value: 2.5, color: "#334bff" },
    { name: "Renato K.", value: 1.5, color: "#334bff" },
    { name: "Carlos P.", value: 3.5, color: "#334bff" },
    { name: "Clarindo M.", value: -0.5, color: "#ef4444" },
    { name: "Delcio R.", value: 2.5, color: "#334bff" },
    { name: "Ederson D.", value: 3.5, color: "#334bff" },
    { name: "Egon P.", value: 1.5, color: "#334bff" },
    { name: "Gilberto H.", value: 1.5, color: "#334bff" },
    { name: "Guido D.", value: 1.5, color: "#334bff" },
    { name: "Jacir M.", value: 5.5, color: "#334bff" },
    { name: "Jose F.", value: 1.5, color: "#334bff" },
    { name: "Ladir R.", value: 3.5, color: "#334bff" },
    { name: "Laurindo M.", value: 3.5, color: "#334bff" },
    { name: "Marina K.", value: 2.5, color: "#334bff" },
    { name: "Marines C.", value: 3.5, color: "#334bff" },
    { name: "Marlise K.", value: 2.5, color: "#334bff" },
    { name: "Nelson B.", value: 4.5, color: "#334bff" },
    { name: "Osvaldo G.", value: 4.5, color: "#334bff" },
    { name: "Valdir K.", value: 1.5, color: "#334bff" },
    { name: "Vilson S.", value: 2.0, color: "#334bff" }
  ],
  abastecimentos: [],
};

let mockColetaData: ColetaItem[] = [
  { id: "1", cooperado: "Primato", motorista: "Luiz Carlos", tipoVeiculo: "Caminhão de dejetos", placa: "ABC-1D23", odometro: 123456, dataPrevisao: "2025-01-01", horaPrevisao: "15:00", status: "Pendente" },
  { id: "2", cooperado: "Primato", motorista: "Marcos Paulo", tipoVeiculo: "Caminhão de ração", placa: "XYZ-4567", odometro: 234567, dataPrevisao: "2025-01-02", horaPrevisao: "10:00", status: "Entregue" },
  { id: "3", cooperado: "Primato", motorista: "Ana Cássia", tipoVeiculo: "Caminhão de dejetos", placa: "GHI-7890", odometro: 345678, dataPrevisao: "2025-01-03", horaPrevisao: "11:30", status: "Atrasado" },
];

// --- DADOS DOS COOPERADOS (IDs como NUMBER e DADOS REAIS) ---
export const mockCooperadosData: CooperadoItem[] = [
  { id: 1, matricula: 102646, motorista: "Renato Ivan Kunzler", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 1450, tipoVeiculo: "Caminhão", placa: "ABC-1234" },
  { id: 2, matricula: 511224, motorista: "Ademir Jose Engelsing", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "XYZ-5678" },
  { id: 3, matricula: 102284, motorista: "Ademir Marchioro", filial: "Toledo", fase: "GRSC", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2800, tipoVeiculo: "Caminhão", placa: "DEF-9012" },
  { id: 4, matricula: 102686, motorista: "Arsenio Vicente Weschenfelder", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2180, tipoVeiculo: "Caminhão", placa: "GHI-3456" },
  { id: 5, matricula: 103034, motorista: "Carlos Jaime Pauly", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 11000, tipoVeiculo: "Caminhão", placa: "JKL-7890" },
  { id: 6, matricula: 100173, motorista: "Clarindo Mazzarollo", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 1474, tipoVeiculo: "Caminhão", placa: "MNO-1234" },
  { id: 7, matricula: 200801, motorista: "Delcio Rossetto", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2650, tipoVeiculo: "Caminhão", placa: "PQR-5678" },
  { id: 8, matricula: 534359, motorista: "Ederson Donassolo", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 1250, tipoVeiculo: "Caminhão", placa: "STU-9012" },
  { id: 9, matricula: 107183, motorista: "Edmundo Afonso Klein", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 4200, tipoVeiculo: "Caminhão", placa: "VWX-3456" },
  { id: 10, matricula: 101324, motorista: "Egon Portz", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 620, tipoVeiculo: "Caminhão", placa: "YZA-7890" },
  { id: 11, matricula: 101835, motorista: "Gilberto Heinen", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 824, tipoVeiculo: "Caminhão", placa: "BCD-1234" },
  { id: 12, matricula: 100690, motorista: "Gilmar Pigosso", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 590, tipoVeiculo: "Caminhão", placa: "EFG-5678" },
  { id: 13, matricula: 272920, motorista: "Guido Dorigon", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2200, tipoVeiculo: "Caminhão", placa: "HIJ-9012" },
  { id: 14, matricula: 529504, motorista: "Helio Jose Schneider", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 3000, tipoVeiculo: "Caminhão", placa: "KLM-3456" },
  { id: 15, matricula: 102858, motorista: "Jacir Leopoldo Machado", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 4500, tipoVeiculo: "Caminhão", placa: "NOP-7890" },
  { id: 16, matricula: 103247, motorista: "Jose Ademilson Fontana", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 560, tipoVeiculo: "Caminhão", placa: "QRS-1234" },
  { id: 17, matricula: 101841, motorista: "Ladir Rossetto", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 1750, tipoVeiculo: "Caminhão", placa: "TUV-5678" },
  { id: 18, matricula: 273017, motorista: "Laurindo Mauerwerk", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2050, tipoVeiculo: "Caminhão", placa: "WXY-9012" },
  { id: 19, matricula: 100672, motorista: "Maria Josefa Angst", filial: "Toledo", fase: "Terminação Mercado", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 2500, tipoVeiculo: "Caminhão", placa: "ZAB-3456" },
  { id: 20, matricula: 285806, motorista: "Marina Maria Kliemann", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 1500, tipoVeiculo: "Caminhão", placa: "CDE-7890" },
  { id: 21, matricula: 546596, motorista: "Marines Biscoli Covatti", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 3000, tipoVeiculo: "Caminhão", placa: "FGH-1234" },
  { id: 22, matricula: 100262, motorista: "Marli Sipp", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 480, tipoVeiculo: "Caminhão", placa: "IJK-5678" },
  { id: 23, matricula: 100749, motorista: "Marlise De Lima Konzen", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2700, tipoVeiculo: "Caminhão", placa: "LMN-9012" },
  { id: 24, matricula: 106693, motorista: "Nelson Bordignon", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 1400, tipoVeiculo: "Caminhão", placa: "OPQ-3456" },
  { id: 25, matricula: 103640, motorista: "Obra Social N S Da Gloria Fazenda Da Esperanca", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 580, tipoVeiculo: "Caminhão", placa: "RST-7890" },
  { id: 26, matricula: 103368, motorista: "Osvaldo Luiz Gozzi", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Sim", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "UVW-1234" },
  { id: 27, matricula: 103088, motorista: "Valdir Jose Klein", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 1500, tipoVeiculo: "Caminhão", placa: "XYZ-5678" },
  { id: 28, matricula: 104036, motorista: "Vilson Salvalaggio", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Sim", cabecasAlojadas: 2500, tipoVeiculo: "Caminhão", placa: "ABC-9012" },
  { id: 29, matricula: 518621, motorista: "Adair Luiz Engelsing", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 620, tipoVeiculo: "Caminhão", placa: "DEF-3456" },
  { id: 30, matricula: 102190, motorista: "Adelaide Loebens Hinterholz", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2000, tipoVeiculo: "Caminhão", placa: "GHI-7890" },
  { id: 31, matricula: 103442, motorista: "Adelar Casagrande", filial: "Toledo", fase: "GRSC", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 5000, tipoVeiculo: "Caminhão", placa: "JKL-1234" },
  { id: 32, matricula: 601310, motorista: "Ademar Fritzen", filial: "Nova Esperança do Sul", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 2000, tipoVeiculo: "Caminhão", placa: "MNO-5678" },
  { id: 33, matricula: 102219, motorista: "Ademar Irineu Schneider", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 250, tipoVeiculo: "Caminhão", placa: "PQR-9012" },
  { id: 34, matricula: 100517, motorista: "Ademar Pedro Roos", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "STU-3456" },
  { id: 35, matricula: 611281, motorista: "Adiles Fiori", filial: "Tupassi", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1000, tipoVeiculo: "Caminhão", placa: "VWX-7890" },
  { id: 36, matricula: 103161, motorista: "Adriano Vian", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 10000, tipoVeiculo: "Caminhão", placa: "YZA-1234" },
  { id: 37, matricula: 105841, motorista: "Ailton Edson Jope", filial: "Tupassi", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "BCD-5678" },
  { id: 38, matricula: 101132, motorista: "Aldimar Gundt", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Vazio", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "EFG-9012" },
  { id: 39, matricula: 103167, motorista: "Alison Petermann", filial: "Nova Santa Rosa", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 840, tipoVeiculo: "Caminhão", placa: "HIJ-3456" },
  { id: 40, matricula: 546292, motorista: "Almir Paulus", filial: "Quatro Pontes", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 500, tipoVeiculo: "Caminhão", placa: "KLM-7890" },
  { id: 41, matricula: 107995, motorista: "Aloisio Lirio Finkler", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1000, tipoVeiculo: "Caminhão", placa: "NOP-1234" },
  { id: 42, matricula: 103123, motorista: "Anderson Leo Sabadin", filial: "Céu Azul", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1424, tipoVeiculo: "Caminhão", placa: "QRS-5678" },
  { id: 43, matricula: 525096, motorista: "Antidio Aleixo Lunelli", filial: "Vera Cruz do Oeste", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1800, tipoVeiculo: "Caminhão", placa: "TUV-9012" },
  { id: 44, matricula: 102808, motorista: "Argeu Pedro Goethert", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1440, tipoVeiculo: "Caminhão", placa: "WXY-3456" },
  { id: 45, matricula: 512706, motorista: "Arianni Regina De Oliveira Millnitz", filial: "Tupãssi", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 400, tipoVeiculo: "Caminhão", placa: "ZAB-7890" },
  { id: 46, matricula: 103271, motorista: "Arlei Jose Fachin", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1000, tipoVeiculo: "Caminhão", placa: "CDE-1234" },
  { id: 47, matricula: 100500, motorista: "Atilio Hilario Scain", filial: "São Pedro do Iguaçu", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 997, tipoVeiculo: "Caminhão", placa: "FGH-5678" },
  { id: 48, matricula: 100789, motorista: "Carlos Alberto Lawich", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 10000, tipoVeiculo: "Caminhão", placa: "IJK-9012" },
  { id: 49, matricula: 595856, motorista: "Claci Schumacher", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1350, tipoVeiculo: "Caminhão", placa: "LMN-3456" },
  { id: 50, matricula: 100612, motorista: "Clarindo Viapiana", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 550, tipoVeiculo: "Caminhão", placa: "OPQ-7890" },
  { id: 51, matricula: 107533, motorista: "Cledio Rafael Morgenstern", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1700, tipoVeiculo: "Caminhão", placa: "RST-1234" },
  { id: 52, matricula: 103523, motorista: "Cleonice Vendramini Deresz", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 650, tipoVeiculo: "Caminhão", placa: "UVW-5678" },
  { id: 53, matricula: 579194, motorista: "Cristiane Vorpagel", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "XYZ-9012" },
  { id: 54, matricula: 103847, motorista: "Cristiano Rodrigo Vian", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 8500, tipoVeiculo: "Caminhão", placa: "ABC-3456" },
  { id: 55, matricula: 601311, motorista: "Dalvo Koerich", filial: "Salto do Lontra", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1600, tipoVeiculo: "Caminhão", placa: "DEF-7890" },
  { id: 56, matricula: 504523, motorista: "Dayane Dos Santos Mendes Nascimento", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "GHI-1234" },
  { id: 57, matricula: 102751, motorista: "Delton Hoffmann", filial: "Nova Santa Rosa", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 6800, tipoVeiculo: "Caminhão", placa: "JKL-5678" },
  { id: 58, matricula: 102376, motorista: "Dirceu Luiz Rockenbach Finkler", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "MNO-9012" },
  { id: 59, matricula: 103612, motorista: "Dorival Paulo Da Silva", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 750, tipoVeiculo: "Caminhão", placa: "PQR-3456" },
  { id: 60, matricula: 275001, motorista: "Edemar Otavio Horn", filial: "Marechal Cândido Rondon", fase: "UPD", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1400, tipoVeiculo: "Caminhão", placa: "STU-7890" },
  { id: 61, matricula: 101482, motorista: "Edenilson Carlos Copini", filial: "São Pedro do Iguaçu", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1300, tipoVeiculo: "Caminhão", placa: "VWX-1234" },
  { id: 62, matricula: 509507, motorista: "Eleandro Da Silva", filial: "Quatro Pontes", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 450, tipoVeiculo: "Caminhão", placa: "YZA-5678" },
  { id: 63, matricula: 506738, motorista: "Eliane Margarete Kerber Kotowski", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1250, tipoVeiculo: "Caminhão", placa: "BCD-9012" },
  { id: 64, matricula: 101923, motorista: "Elton Alceu Endler", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1178, tipoVeiculo: "Caminhão", placa: "EFG-3456" },
  { id: 65, matricula: 103317, motorista: "Erno Schnorrenberger", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 600, tipoVeiculo: "Caminhão", placa: "HIJ-7890" },
  { id: 66, matricula: 504115, motorista: "Ernst Makus", filial: "Tupassi", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2930, tipoVeiculo: "Caminhão", placa: "KLM-1234" },
  { id: 67, matricula: 102828, motorista: "Euclides Luis Muller", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 750, tipoVeiculo: "Caminhão", placa: "NOP-5678" },
  { id: 68, matricula: 607559, motorista: "Evandro Moreira", filial: "Mercedes", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 230, tipoVeiculo: "Caminhão", placa: "QRS-9012" },
  { id: 69, matricula: 521160, motorista: "Everson Zotti", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1829, tipoVeiculo: "Caminhão", placa: "TUV-3456" },
  { id: 70, matricula: 509778, motorista: "Everton Rodrigo Brotto", filial: "Ouro Verde do Oeste", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 550, tipoVeiculo: "Caminhão", placa: "WXY-7890" },
  { id: 71, matricula: 109232, motorista: "Fabio Andre Theisen Gisch", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2050, tipoVeiculo: "Caminhão", placa: "ZAB-1234" },
  { id: 72, matricula: 566825, motorista: "Fernando Antonio Pappen", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2350, tipoVeiculo: "Caminhão", placa: "CDE-5678" },
  { id: 73, matricula: 286677, motorista: "Francisco Valdivio Dalpiaz", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3000, tipoVeiculo: "Caminhão", placa: "FGH-9012" },
  { id: 74, matricula: 267473, motorista: "Geraldo Zimmermann", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3250, tipoVeiculo: "Caminhão", placa: "IJK-3456" },
  { id: 75, matricula: 103448, motorista: "Germanio Lira", filial: "Toledo", fase: "Terminação Mercado", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 600, tipoVeiculo: "Caminhão", placa: "LMN-7890" },
  { id: 76, matricula: 275004, motorista: "Gidio Luis Rieth", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1800, tipoVeiculo: "Caminhão", placa: "OPQ-1234" },
  { id: 77, matricula: 107594, motorista: "Gilberto Inacio Binsfeld", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1600, tipoVeiculo: "Caminhão", placa: "RST-5678" },
  { id: 78, matricula: 521877, motorista: "Gilmar Ercio Klein", filial: "Quatro Pontes", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 4600, tipoVeiculo: "Caminhão", placa: "UVW-9012" },
  { id: 79, matricula: 590058, motorista: "Glaci Kaefer", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3200, tipoVeiculo: "Caminhão", placa: "XYZ-3456" },
  { id: 80, matricula: 514396, motorista: "Hari Stach", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1050, tipoVeiculo: "Caminhão", placa: "ABC-7890" },
  { id: 81, matricula: 101881, motorista: "Hirio Fulber", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 720, tipoVeiculo: "Caminhão", placa: "DEF-1234" },
  { id: 82, matricula: 100516, motorista: "Ignacio Nuernberg", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 6000, tipoVeiculo: "Caminhão", placa: "GHI-5678" },
  { id: 83, matricula: 100986, motorista: "Ireno Waldow", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1800, tipoVeiculo: "Caminhão", placa: "JKL-9012" },
  { id: 84, matricula: 102364, motorista: "Irineu Eichlt", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1900, tipoVeiculo: "Caminhão", placa: "MNO-3456" },
  { id: 85, matricula: 100786, motorista: "Ivo Bortoncello", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "PQR-7890" },
  { id: 86, matricula: 105551, motorista: "Ivo Horn", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 500, tipoVeiculo: "Caminhão", placa: "STU-1234" },
  { id: 87, matricula: 603928, motorista: "Jaqueline Jeane Francener", filial: "Quatro Pontes", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "VWX-5678" },
  { id: 88, matricula: 103608, motorista: "Jauri Jose Pletsch", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1000, tipoVeiculo: "Caminhão", placa: "YZA-9012" },
  { id: 89, matricula: 534370, motorista: "Jhonata Donasolo", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 550, tipoVeiculo: "Caminhão", placa: "BCD-3456" },
  { id: 90, matricula: 108768, motorista: "Joao Lira", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1050, tipoVeiculo: "Caminhão", placa: "EFG-7890" },
  { id: 91, matricula: 281173, motorista: "Joao Valdir Gregorio", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3200, tipoVeiculo: "Caminhão", placa: "HIJ-1234" },
  { id: 92, matricula: 108418, motorista: "Jose Aloisio Dahmer", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1500, tipoVeiculo: "Caminhão", placa: "KLM-5678" },
  { id: 93, matricula: 273120, motorista: "Juliana Cristine Pappen", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2950, tipoVeiculo: "Caminhão", placa: "NOP-9012" },
  { id: 94, matricula: 580470, motorista: "Jurandir Jair Cotica", filial: "Marechal Cândido Rondon", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 350, tipoVeiculo: "Caminhão", placa: "QRS-3456" },
  { id: 95, matricula: 551387, motorista: "Jussara Adriane Zimmermann", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3250, tipoVeiculo: "Caminhão", placa: "TUV-7890" },
  { id: 96, matricula: 527293, motorista: "Katiely Aline Anschau Deimling", filial: "Quatro Pontes", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1360, tipoVeiculo: "Caminhão", placa: "WXY-1234" },
  { id: 97, matricula: 538648, motorista: "Kelin Benincá", filial: "Marechal Cândido Rondon", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 450, tipoVeiculo: "Caminhão", placa: "ZAB-5678" },
  { id: 98, matricula: 100898, motorista: "Ladia Ines Kohler Kliemann", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1030, tipoVeiculo: "Caminhão", placa: "CDE-9012" },
  { id: 99, matricula: 270370, motorista: "Laodinei Roberto Mossmann", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 700, tipoVeiculo: "Caminhão", placa: "FGH-3456" },
  { id: 100, matricula: 309383, motorista: "Leonardo Lorenzatto", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 4300, tipoVeiculo: "Caminhão", placa: "IJK-7890" },
  { id: 101, matricula: 100887, motorista: "Lineu Busse", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1350, tipoVeiculo: "Caminhão", placa: "LMN-1234" },
  { id: 102, matricula: 100753, motorista: "Lucio Canisio Steffens", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1000, tipoVeiculo: "Caminhão", placa: "OPQ-5678" },
  { id: 103, matricula: 503541, motorista: "Luis Claudio Krebs", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 10000, tipoVeiculo: "Caminhão", placa: "RST-9012" },
  { id: 104, matricula: 506611, motorista: "Marcelo Dolla", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 250, tipoVeiculo: "Caminhão", placa: "UVW-3456" },
  { id: 105, matricula: 103189, motorista: "Marcelo Gozzi", filial: "Ouro Verde do Oeste", fase: "GRSC", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1900, tipoVeiculo: "Caminhão", placa: "XYZ-7890" },
  { id: 106, matricula: 103552, motorista: "Maria Terezinha Neis", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 620, tipoVeiculo: "Caminhão", placa: "ABC-1234" },
  { id: 107, matricula: 106750, motorista: "Mario Schons", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1600, tipoVeiculo: "Caminhão", placa: "DEF-5678" },
  { id: 108, matricula: 105819, motorista: "Mauri Bender", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1120, tipoVeiculo: "Caminhão", placa: "GHI-9012" },
  { id: 109, matricula: 106999, motorista: "Mauri Roque Sartoretto", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1500, tipoVeiculo: "Caminhão", placa: "JKL-3456" },
  { id: 110, matricula: 605089, motorista: "Maurício Lauri Mauerwerk", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1190, tipoVeiculo: "Caminhão", placa: "MNO-7890" },
  { id: 111, matricula: 511031, motorista: "Mayara Roberta Jacomini", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2200, tipoVeiculo: "Caminhão", placa: "PQR-1234" },
  { id: 112, matricula: 535220, motorista: "Narciso Pedro Flach", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1050, tipoVeiculo: "Caminhão", placa: "STU-5678" },
  { id: 113, matricula: 101614, motorista: "Nelsi Gund Liesenfeld", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 900, tipoVeiculo: "Caminhão", placa: "VWX-9012" },
  { id: 114, matricula: 100294, motorista: "Normelio Roque Hanauer", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1150, tipoVeiculo: "Caminhão", placa: "YZA-3456" },
  { id: 115, matricula: 264740, motorista: "Olvario Gengnagel", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1100, tipoVeiculo: "Caminhão", placa: "BCD-7890" },
  { id: 116, matricula: 514589, motorista: "Oraci Antonio Pereira", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "EFG-1234" },
  { id: 117, matricula: 100246, motorista: "Orildo Slongo", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1900, tipoVeiculo: "Caminhão", placa: "HIJ-5678" },
  { id: 118, matricula: 100012, motorista: "Paulino Luiz Coeli", filial: "São Pedro do Iguaçu", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1162, tipoVeiculo: "Caminhão", placa: "KLM-9012" },
  { id: 119, matricula: 108972, motorista: "Paulo Kappes", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1750, tipoVeiculo: "Caminhão", placa: "NOP-3456" },
  { id: 120, matricula: 100213, motorista: "Pedro Alvicio Dries", filial: "Cascavel", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1900, tipoVeiculo: "Caminhão", placa: "QRS-7890" },
  { id: 121, matricula: 8, motorista: "Primato Cooperativa Agroindustrial", filial: "Ouro Verde do Oeste", fase: "GRSC", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2767, tipoVeiculo: "Caminhão", placa: "TUV-1234" },
  { id: 122, matricula: 550159, motorista: "Rafael Slongo", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1100, tipoVeiculo: "Caminhão", placa: "WXY-5678" },
  { id: 123, matricula: 166938, motorista: "Renato Pasquali", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1416, tipoVeiculo: "Caminhão", placa: "ZAB-9012" },
  { id: 124, matricula: 267495, motorista: "Renato Smaniotto", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1500, tipoVeiculo: "Caminhão", placa: "CDE-3456" },
  { id: 125, matricula: 508846, motorista: "Rodrigo Da Silva", filial: "Tupassi", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 2600, tipoVeiculo: "Caminhão", placa: "FGH-7890" },
  { id: 126, matricula: 103036, motorista: "Rodrigo Jose Heck", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1020, tipoVeiculo: "Caminhão", placa: "IJK-1234" },
  { id: 127, matricula: 603148, motorista: "Rodrigo Manfredi", filial: "Espigão Alto do Iguaçu", fase: "UPD", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 670, tipoVeiculo: "Caminhão", placa: "LMN-5678" },
  { id: 128, matricula: 103758, motorista: "Romeu Jaco Finkler", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 620, tipoVeiculo: "Caminhão", placa: "OPQ-9012" },
  { id: 129, matricula: 103021, motorista: "Romeu Jose Bamberg", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 850, tipoVeiculo: "Caminhão", placa: "RST-3456" },
  { id: 130, matricula: 271138, motorista: "Roque Lorenzoni", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 3600, tipoVeiculo: "Caminhão", placa: "UVW-7890" },
  { id: 131, matricula: 166882, motorista: "Rubens Aparecido Braz", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 800, tipoVeiculo: "Caminhão", placa: "XYZ-1234" },
  { id: 132, matricula: 101795, motorista: "Rudi Werle Welter", filial: "Toledo", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 923, tipoVeiculo: "Caminhão", placa: "ABC-5678" },
  { id: 133, matricula: 591865, motorista: "Sandra Risse", filial: "Toledo", fase: "Crechário", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 7100, tipoVeiculo: "Caminhão", placa: "DEF-9012" },
  { id: 134, matricula: 504900, motorista: "Sidnei Darci Lenz", filial: "Nova Santa Rosa", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "GHI-3456" },
  { id: 135, matricula: 101467, motorista: "Silvino Foscarini", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 660, tipoVeiculo: "Caminhão", placa: "JKL-7890" },
  { id: 136, matricula: 554044, motorista: "Soeli Ludwig", filial: "Assis Chateaubriand", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 2500, tipoVeiculo: "Caminhão", placa: "MNO-1234" },
  { id: 137, matricula: 101939, motorista: "Terezinha Rosa Heinz", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 950, tipoVeiculo: "Caminhão", placa: "PQR-5678" },
  { id: 138, matricula: 103155, motorista: "Valdeci Luiz Schneider", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 750, tipoVeiculo: "Caminhão", placa: "STU-9012" },
  { id: 139, matricula: 103529, motorista: "Valdecir Jose Rauber", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2100, tipoVeiculo: "Caminhão", placa: "VWX-3456" },
  { id: 140, matricula: 603883, motorista: "Valdemar Wachholz Schielvelbein", filial: "Marechal Cândido Rondon", fase: "UPD", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 350, tipoVeiculo: "Caminhão", placa: "YZA-7890" },
  { id: 141, matricula: 103337, motorista: "Valdir Luis Seibert", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1100, tipoVeiculo: "Caminhão", placa: "BCD-1234" },
  { id: 142, matricula: 104435, motorista: "Valdir Narciso Thielke", filial: "Toledo", fase: "Terminação Mercado", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 560, tipoVeiculo: "Caminhão", placa: "EFG-5678" },
  { id: 143, matricula: 103361, motorista: "Valdir Rossetto", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 4000, tipoVeiculo: "Caminhão", placa: "HIJ-9012" },
  { id: 144, matricula: 266339, motorista: "Valmir Gerhardt", filial: "Tupassi", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 950, tipoVeiculo: "Caminhão", placa: "KLM-3456" },
  { id: 145, matricula: 103500, motorista: "Vanderlei Andre Strieder", filial: "Toledo", fase: "Terminação Mercado", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 750, tipoVeiculo: "Caminhão", placa: "NOP-7890" },
  { id: 146, matricula: 108399, motorista: "Vanderlei Tiago Weiss", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 2050, tipoVeiculo: "Caminhão", placa: "QRS-1234" },
  { id: 147, matricula: 102849, motorista: "Vitor Samoel Kievel", filial: "Marechal Cândido Rondon", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 350, tipoVeiculo: "Caminhão", placa: "TUV-5678" },
  { id: 148, matricula: 515382, motorista: "Viviane Reuter", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1350, tipoVeiculo: "Caminhão", placa: "WXY-9012" },
  { id: 149, matricula: 103190, motorista: "Walter Pohl", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Sim", doamDejetos: "Não", cabecasAlojadas: 1200, tipoVeiculo: "Caminhão", placa: "ZAB-3456" },
  { id: 150, matricula: 520632, motorista: "Wilson Rodrigo Donassolo", filial: "Toledo", fase: "Terminação Frimesa", certificado: "Não", doamDejetos: "Não", cabecasAlojadas: 1400, tipoVeiculo: "Caminhão", placa: "CDE-7890" }
];

// --- MOCK DE TRANSPORTADORAS ---
export const mockTransportadoras: TransportadoraItem[] = [
  {
    id: "1",
    nomeFantasia: "Primato",
    razaoSocial: "Primato Transportes Ltda",
    cnpj: "12.345.678/0001-00",
    telefone: "45999470460",
    email: "contato@primato.com",
    cidade: "Toledo",
    uf: "PR",
    estado: "Paraná",
    endereco: "Rua Exemplo 123",
    categoria: "Logística",
    status: "Ativo",
    tags: ["Logística"],
    placa: "PRI-0001",
    contatoPrincipal: { nome: "João Silva", telefone: "45999470460", email: "joao@primato.com" },
    contatoComercial: { nome: "Maria Santos", telefone: "45999470461", email: "maria@primato.com" },
    contatoFinanceiro: { nome: "Pedro Oliveira", telefone: "45999470462", email: "pedro@primato.com" },
    contatoJuridico: { nome: "Ana Costa", telefone: "45999470463", email: "ana@primato.com" },
    veiculos: []
  },
  {
    id: "2",
    nomeFantasia: "Agrocampo",
    razaoSocial: "Agrocampo Transportes Ltda",
    cnpj: "98.765.432/0001-00",
    telefone: "45999470470",
    email: "contato@agrocampo.com",
    cidade: "Cascavel",
    uf: "PR",
    estado: "Paraná",
    endereco: "Av. Central 456",
    categoria: "Agrícola",
    status: "Ativo",
    tags: ["Agrícola"],
    placa: "AGR-0002",
    contatoPrincipal: { nome: "Carlos Souza", telefone: "45999470471", email: "carlos@agrocampo.com" },
    contatoComercial: { nome: "Fernanda Lima", telefone: "45999470472", email: "fernanda@agrocampo.com" },
    contatoFinanceiro: { nome: "Roberto Alves", telefone: "45999470473", email: "roberto@agrocampo.com" },
    contatoJuridico: { nome: "Luciana Pereira", telefone: "45999470474", email: "luciana@agrocampo.com" },
    veiculos: []
  },
  {
    id: "3",
    nomeFantasia: "MWM",
    razaoSocial: "MWM Transportes Ltda",
    cnpj: "11.222.333/0001-00",
    telefone: "45999470480",
    email: "contato@mwm.com",
    cidade: "Marechal Cândido Rondon",
    uf: "PR",
    estado: "Paraná",
    endereco: "Rua Industrial 789",
    categoria: "Geral",
    status: "Ativo",
    tags: ["Geral"],
    placa: "MWM-0003",
    contatoPrincipal: { nome: "José Oliveira", telefone: "45999470481", email: "jose@mwm.com" },
    contatoComercial: { nome: "Patrícia Rocha", telefone: "45999470482", email: "patricia@mwm.com" },
    contatoFinanceiro: { nome: "Marcos Santos", telefone: "45999470483", email: "marcos@mwm.com" },
    contatoJuridico: { nome: "Cristina Lima", telefone: "45999470484", email: "cristina@mwm.com" },
    veiculos: []
  },
  {
    id: "4",
    nomeFantasia: "Tupy",
    razaoSocial: "Tupy Transportes Ltda",
    cnpj: "44.555.666/0001-00",
    telefone: "45999470490",
    email: "contato@tupy.com",
    cidade: "Palotina",
    uf: "PR",
    estado: "Paraná",
    endereco: "Estrada Rural 101",
    categoria: "Especializada",
    status: "Ativo",
    tags: ["Especializada"],
    placa: "TUP-0004",
    contatoPrincipal: { nome: "Antônio Ferreira", telefone: "45999470491", email: "antonio@tupy.com" },
    contatoComercial: { nome: "Beatriz Gomes", telefone: "45999470492", email: "beatriz@tupy.com" },
    contatoFinanceiro: { nome: "Eduardo Silva", telefone: "45999470493", email: "eduardo@tupy.com" },
    contatoJuridico: { nome: "Gabriela Torres", telefone: "45999470494", email: "gabriela@tupy.com" },
    veiculos: []
  },
];

// --- MOCK DE AGENDA (LOGÍSTICA) ---
export const mockAgenda: AgendaData[] = [
  { id: 1, cooperado: "Ademir Jose Engelsing", seg: 150, ter: 0, qua: 200, qui: 0, sex: 180, sab: 0, dom: 0, qtd: 530, km: 45, transportadora: "Translog", status: "Planejado" },
  { id: 2, cooperado: "Renato Ivan Kunzler", seg: 0, ter: 300, qua: 0, qui: 300, sex: 0, sab: 150, dom: 0, qtd: 750, km: 60, transportadora: "Rapidão", status: "Realizado" },
  { id: 3, cooperado: "Marines Biscoli Covatti", seg: 200, ter: 100, qua: 0, qui: 0, sex: 200, sab: 0, dom: 0, qtd: 500, km: 50, transportadora: "Translog", status: "Planejado" },
  { id: 4, cooperado: "Marlise De Lima Konzen", seg: 0, ter: 0, qua: 150, qui: 150, sex: 0, sab: 0, dom: 0, qtd: 300, km: 35, transportadora: "Expresso São Miguel", status: "Realizado" },
  { id: 5, cooperado: "Jussara Adriane Zimmermann", seg: 300, ter: 300, qua: 300, qui: 0, sex: 0, sab: 0, dom: 0, qtd: 900, km: 80, transportadora: "Ouro Negro", status: "Planejado" },
  { id: 6, cooperado: "Kelin Benincá", seg: 0, ter: 0, qua: 0, qui: 200, sex: 200, sab: 0, dom: 0, qtd: 400, km: 40, transportadora: "Rodonaves", status: "Realizado" },
  { id: 7, cooperado: "Leonardo Lorenzatto", seg: 100, ter: 100, qua: 100, qui: 100, sex: 100, sab: 0, dom: 0, qtd: 500, km: 55, transportadora: "Translog", status: "Planejado" },
  { id: 8, cooperado: "Luis Claudio Krebs", seg: 0, ter: 250, qua: 250, qui: 0, sex: 0, sab: 0, dom: 0, qtd: 500, km: 45, transportadora: "Rapidão", status: "Realizado" },
  { id: 9, cooperado: "Marcelo Gozzi", seg: 150, ter: 150, qua: 0, qui: 0, sex: 150, sab: 0, dom: 0, qtd: 450, km: 30, transportadora: "Expresso São Miguel", status: "Planejado" },
  { id: 10, cooperado: "Maria Terezinha Neis", seg: 0, ter: 0, qua: 0, qui: 300, sex: 300, sab: 0, dom: 0, qtd: 600, km: 70, transportadora: "Ouro Negro", status: "Realizado" }
];

const mockPortariaData: PortariaItem[] = [];

let mockQualidadeDejetosData: QualidadeDejetosItem[] = [
    { id: "DEJ-001", dataColeta: "2025-01-10", cooperado: "Ademir Jose Engelsing", placa: "XYZ-5678", ph: "7.2", densidade: "1014" },
    { id: "DEJ-002", dataColeta: "2025-01-11", cooperado: "Renato Ivan Kunzler", placa: "ABC-1234", ph: "7.0", densidade: "1010" }
];

// --- FUNÇÕES MOCK ---

export const mockFetchCooperadosData = (): Promise<CooperadoItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCooperadosData);
    }, 500);
  });
};

export const mockFetchTransportadorasData = (): Promise<TransportadoraItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransportadoras);
    }, 500);
  });
};

export const mockFetchColetaData = (): Promise<ColetaItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockColetaData]);
    }, 500);
  });
};

export const mockUpdateColetaItem = (item: ColetaItem): Promise<ColetaItem> => {
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

export const mockCreateColetaItem = (item: Omit<ColetaItem, "id">): Promise<ColetaItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: ColetaItem = {
        ...item,
        id: new Date().getTime().toString(),
      };
      mockColetaData.unshift(newItem);
      resolve(newItem);
    }, 500);
  });
};

export const mockFetchAbastecimentoReportData = (startDate?: string, endDate?: string): Promise<AbastecimentoReportItem[]> => {
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

export const mockFetchAbastecimentoVolumePorDiaData = (startDate?: string, endDate?: string): Promise<AbastecimentoVolumePorDiaItem[]> => {
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

export const mockAddAbastecimentoReportItem = (item: Omit<AbastecimentoReportItem, "status" | "cliente" | "horaTermino">): Promise<AbastecimentoReportItem> => {
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

export const mockFetchAbastecimentoAggregatedVolumeData = (period: Period): Promise<AbastecimentoVolumeItem[]> => {
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

export const mockFetchFaturamentoData = (): Promise<FaturamentoItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(faturamentoMockData);
        }, 500);
      });
};

export const mockFetchAbastecimentoVolumeData = (): Promise<AbastecimentoVolumeItem[]> => {
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

export const mockFetchDashboardData = (): Promise<DashboardData> => {
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

export const mockFetchAbastecimentoSummaryData = (startDate?: string, endDate?: string): Promise<AbastecimentoSummaryItem[]> => {
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

export const mockFetchPortariaData = (): Promise<PortariaItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPortariaData);
        }, 500);
      });
};

export const mockFetchNewAgendaData = (): Promise<AgendaData[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockAgenda);
        }, 500);
      });
};

export const mockFetchQualidadeDejetosData = (): Promise<QualidadeDejetosItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mockQualidadeDejetosData), 500));
};

export const mockCreateAnaliseQualidade = (analise: Partial<QualidadeDejetosItem>): Promise<QualidadeDejetosItem> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newItem: QualidadeDejetosItem = {
                id: `DEJ-${Math.floor(Math.random() * 1000)}`,
                dataColeta: analise.dataColeta || new Date().toLocaleDateString('pt-BR'),
                cooperado: analise.cooperado || 'N/A',
                placa: 'N/A',
                ph: analise.ph || 'N/A',
                densidade: analise.densidade || 'N/A',
                ...analise
            };
            mockQualidadeDejetosData.unshift(newItem);
            resolve(newItem);
        }, 500);
    });
};

export interface CategoriaOption {
  id: number;
  label: string;
  value: string;
}

export const mockFetchCategorias = (): Promise<CategoriaOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, label: "Logística", value: "Logística" },
                { id: 2, label: "Agrícola", value: "Agrícola" },
                { id: 3, label: "Geral", value: "Geral" },
                { id: 4, label: "Especializada", value: "Especializada" }
            ]);
        }, 300);
    });
};

export interface VeiculoTipoOption {
  id: number;
  label: string;
  value: "truck" | "carreta" | "bitrem" | "vuc" | "utilitario" | "empilhadeira";
}

export interface VeiculoCombustivelOption {
  id: number;
  label: string;
  value: "diesel" | "biometano";
}

export const mockFetchVeiculoTipos = (): Promise<VeiculoTipoOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, label: "Truck", value: "truck" },
                { id: 2, label: "Carreta", value: "carreta" },
                { id: 3, label: "Bitrem", value: "bitrem" },
                { id: 4, label: "VUC", value: "vuc" },
                { id: 5, label: "Utilitário", value: "utilitario" },
                { id: 6, label: "Empilhadeira", value: "empilhadeira" }
            ]);
        }, 300);
    });
};

export const mockFetchVeiculoCombustiveis = (): Promise<VeiculoCombustivelOption[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, label: "Diesel", value: "diesel" },
                { id: 2, label: "Biometano", value: "biometano" }
            ]);
        }, 300);
    });
};