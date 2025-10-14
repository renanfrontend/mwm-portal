import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import abastecimentoReducer from '../features/abastecimento/abastecimentoSlice';
import coletaReducer from '../features/coleta/coletaSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    abastecimento: abastecimentoReducer,
    coleta: coletaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;