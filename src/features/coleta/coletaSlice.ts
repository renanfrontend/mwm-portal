import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchColetaData, updateColetaItem, createColetaItem, type ColetaItem } from '../../services/api';

interface ColetaState {
  coletaData: ColetaItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ColetaState = {
  coletaData: [],
  loading: false,
  error: null,
};

export const loadColetaData = createAsyncThunk(
  'coleta/loadColetaData',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchColetaData();
    } catch (err) {
      return rejectWithValue("Ocorreu um erro ao buscar os dados de coleta.");
    }
  }
);

export const saveColetaItem = createAsyncThunk(
  'coleta/saveColetaItem',
  async (item: ColetaItem, { dispatch }) => {
    if (item.id) {
      await updateColetaItem(item);
    } else {
      await createColetaItem(item);
    }
    dispatch(loadColetaData());
  }
);

export const checkInColetaItem = createAsyncThunk(
  'coleta/checkInColetaItem',
  async (item: ColetaItem, { dispatch }) => {
    const updatedItem = { ...item, status: 'Entregue' as const };
    await updateColetaItem(updatedItem);
    dispatch(loadColetaData());
  }
);

const coletaSlice = createSlice({
  name: 'coleta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadColetaData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadColetaData.fulfilled, (state, action) => {
        state.loading = false;
        state.coletaData = action.payload;
      })
      .addCase(loadColetaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default coletaSlice.reducer;