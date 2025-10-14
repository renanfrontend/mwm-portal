import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AbastecimentoReportItem, AbastecimentoSummaryItem, AbastecimentoVolumePorDiaItem } from '../../services/api';

interface AbastecimentoState {
  reportData: AbastecimentoReportItem[];
  summaryData: AbastecimentoSummaryItem[];
  volumePorDiaData: AbastecimentoVolumePorDiaItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AbastecimentoState = {
  reportData: [],
  summaryData: [],
  volumePorDiaData: [],
  loading: false,
  error: null,
};

const abastecimentoSlice = createSlice({
  name: 'abastecimento',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setDataSuccess: (state, action: PayloadAction<{ reportData: AbastecimentoReportItem[], summaryData: AbastecimentoSummaryItem[], volumePorDiaData: AbastecimentoVolumePorDiaItem[] }>) => {
      state.reportData = action.payload.reportData;
      state.summaryData = action.payload.summaryData;
      state.volumePorDiaData = action.payload.volumePorDiaData;
      state.loading = false;
    },
    addAbastecimentoSuccess: (state, action: PayloadAction<AbastecimentoReportItem>) => {
      state.reportData.unshift(action.payload); // Adiciona no início da lista
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setDataSuccess, addAbastecimentoSuccess, setError } = abastecimentoSlice.actions;

export default abastecimentoSlice.reducer;