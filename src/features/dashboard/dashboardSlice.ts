import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardData, fetchAbastecimentoSummaryData, type DashboardData, type AbastecimentoSummaryItem } from '../../services/api';

interface DashboardState {
  data: DashboardData | null;
  abastecimentoSummary: AbastecimentoSummaryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  abastecimentoSummary: [],
  loading: false,
  error: null,
};

export const loadDashboardData = createAsyncThunk(
  'dashboard/loadDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [fetchedDashboardData, fetchedAbastecimentoData] = await Promise.all([
        fetchDashboardData(),
        fetchAbastecimentoSummaryData()
      ]);
      return {
        data: fetchedDashboardData,
        abastecimentoSummary: fetchedAbastecimentoData,
      };
    } catch (err) {
      return rejectWithValue("Ocorreu um erro ao buscar os dados do dashboard.");
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.abastecimentoSummary = action.payload.abastecimentoSummary;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;