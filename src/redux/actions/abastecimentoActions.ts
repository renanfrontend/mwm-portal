import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAbastecimentoReportData,
  fetchAbastecimentoSummaryData,
  fetchAbastecimentoVolumePorDiaData,
  addAbastecimentoReportItem,
  type AbastecimentoReportItem
} from '../../services/api'; // Supondo que o caminho da API esteja correto

interface LoadDataParams {
  startDate?: string;
  endDate?: string;
}

export const loadAbastecimentoData = createAsyncThunk(
  'abastecimento/loadData',
  async ({ startDate, endDate }: LoadDataParams, { rejectWithValue }) => {
    try {
      const [reportData, summaryData, volumePorDiaData] = await Promise.all([
        fetchAbastecimentoReportData(startDate, endDate),
        fetchAbastecimentoSummaryData(startDate, endDate),
        fetchAbastecimentoVolumePorDiaData(startDate, endDate),
      ]);
      return { reportData, summaryData, volumePorDiaData };
    } catch (err: any) {
      return rejectWithValue('Falha ao carregar dados de abastecimento.');
    }
  }
);

export const addAbastecimento = createAsyncThunk(
  'abastecimento/add',
  async (formData: Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>, { rejectWithValue }) => {
    try {
      return await addAbastecimentoReportItem(formData);
    } catch (err: any) {
      return rejectWithValue('Falha ao adicionar registro de abastecimento.');
    }
  }
);