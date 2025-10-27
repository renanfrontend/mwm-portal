import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAbastecimentoReportData,
  fetchAbastecimentoSummaryData,
  fetchAbastecimentoVolumePorDiaData,
} from '../../services/api';
import { addAbastecimentoReportItem } from '../../services/api'; // Function from api.ts
import {
  type AbastecimentoReportItem,
  type AbastecimentoSummaryItem,
  type AbastecimentoVolumePorDiaItem
} from '../../types/models'; // Types from models.ts

const getDefaultEndDate = () => new Date().toISOString().split('T')[0];
const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

interface AbastecimentoState {
  reportData: AbastecimentoReportItem[];
  summaryData: AbastecimentoSummaryItem[];
  volumePorDiaData: AbastecimentoVolumePorDiaItem[];
  startDate: string;
  endDate: string;
  isModalOpen: boolean;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: AbastecimentoState = {
  reportData: [],
  summaryData: [],
  volumePorDiaData: [],
  startDate: getDefaultStartDate(),
  endDate: getDefaultEndDate(),
  isModalOpen: false,
  currentPage: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
};

export const loadAbastecimentoData = createAsyncThunk(
  'abastecimento/loadAbastecimentoData',
  async ({ startDate, endDate }: { startDate: string, endDate: string }, { rejectWithValue }) => {
    try {
      const [fetchedReportData, fetchedSummaryData, fetchedVolumePorDiaData] = await Promise.all([
        fetchAbastecimentoReportData(startDate, endDate),
        fetchAbastecimentoSummaryData(startDate, endDate),
        fetchAbastecimentoVolumePorDiaData(startDate, endDate),
      ]);
      return {
        reportData: fetchedReportData,
        summaryData: fetchedSummaryData,
        volumePorDiaData: fetchedVolumePorDiaData,
      };
    } catch (err) {
      return rejectWithValue("Ocorreu um erro ao buscar os dados do relatório de abastecimento.");
    }
  }
);

export const addAbastecimento = createAsyncThunk(
  'abastecimento/addAbastecimento',
  async (formData: Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>, { dispatch, getState }) => {
    const newItem = await addAbastecimentoReportItem(formData); // A API real deve retornar o item criado
    // Recarrega todos os dados da tela com base nos filtros de data atuais
    const { abastecimento } = getState() as { abastecimento: AbastecimentoState };
    dispatch(loadAbastecimentoData({ startDate: abastecimento.startDate, endDate: abastecimento.endDate }));
    return newItem;
  }
);

const abastecimentoSlice = createSlice({
  name: 'abastecimento',
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAbastecimentoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAbastecimentoData.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload.reportData;
        state.summaryData = action.payload.summaryData;
        state.volumePorDiaData = action.payload.volumePorDiaData;
      })
      .addCase(loadAbastecimentoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAbastecimento.pending, (state) => {
        // Opcional: pode-se definir um estado de loading específico para adição
        // state.loading = true; 
      })
      .addCase(addAbastecimento.fulfilled, (state, action: PayloadAction<AbastecimentoReportItem>) => {
        // Adiciona o novo item no início da lista para feedback visual imediato
        state.reportData.unshift(action.payload);
        // O loading principal será controlado pelo loadAbastecimentoData que é chamado em seguida
      })
      .addCase(addAbastecimento.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string ?? "Falha ao adicionar registro.";
      });
  },
});

export const {
  setStartDate,
  setEndDate,
  setIsModalOpen,
  setCurrentPage,
  setItemsPerPage,
} = abastecimentoSlice.actions;
export default abastecimentoSlice.reducer;