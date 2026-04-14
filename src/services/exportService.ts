import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

export type ExportFormat = 'csv' | 'pdf';

export interface ExportRequest {
  dataInicial: string; // formato yyyy-MM-dd
  dataFinal: string;
  transportadora?: string;
  formato: ExportFormat;
}

export async function exportRelatorio(request: ExportRequest): Promise<Blob> {
  const response = await api.post(
    '/relatorios/exportar',
    request,
    { responseType: 'blob' }
  );
  return response.data;
}
