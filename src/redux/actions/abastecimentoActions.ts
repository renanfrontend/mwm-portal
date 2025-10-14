import {
  fetchAbastecimentoReportData,
  fetchAbastecimentoSummaryData,
  fetchAbastecimentoVolumePorDiaData,
  addAbastecimentoReportItem,
  type AbastecimentoReportItem
} from '../../services/api';
import { setLoading, setDataSuccess, addAbastecimentoSuccess, setError } from '../reducers/abastecimentoReducer';
import type { AppDispatch } from '../store';

interface LoadDataParams {
  startDate?: string;
  endDate?: string;
}

export const loadAbastecimentoData = ({ startDate, endDate }: LoadDataParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading());
    const [reportData, summaryData, volumePorDiaData] = await Promise.all([
      fetchAbastecimentoReportData(startDate, endDate),
      fetchAbastecimentoSummaryData(startDate, endDate),
      fetchAbastecimentoVolumePorDiaData(startDate, endDate),
    ]);
    dispatch(setDataSuccess({ reportData, summaryData, volumePorDiaData }));
  } catch (err: any) {
    dispatch(setError('Falha ao carregar dados de abastecimento.'));
  }
};

export const addAbastecimento = (
  formData: Omit<AbastecimentoReportItem, 'status' | 'cliente' | 'horaTermino'>
) => async (dispatch: AppDispatch) => {
  try {
    // Não é necessário `setLoading` aqui para não piscar a tela inteira
    const newItem = await addAbastecimentoReportItem(formData);
    dispatch(addAbastecimentoSuccess(newItem));
    // Opcional: Recarregar todos os dados para atualizar os sumários
    // dispatch(loadAbastecimentoData({})); // Descomente se os gráficos precisam ser atualizados imediatamente
  } catch (err: any) {
    dispatch(setError('Falha ao adicionar registro de abastecimento.'));
  }
};