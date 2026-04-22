import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

/**
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 * @description Selectors otimizados para Redux (memoizados com reselect)
 * 
 * Selectors são funções que extraem dados do Redux store.
 * Usar createSelector memoiza o resultado para evitar re-renders desnecessários.
 */

// ============================================================================
// SELETORES BASE (acessam o slice inteiro)
// ============================================================================

/**
 * Acessa o slice portariaRegistro inteiro
 */
const selectPortariaRegistroState = (state: RootState) => state.portariaRegistro;

const getSearchableText = (registro: RootState['portariaRegistro']['registros'][number]): string => {
  switch (registro.tipo_registro) {
    case 'ENTREGA_DEJETOS':
      return [
        registro.entrega_dejetos?.motorista_nome,
        registro.entrega_dejetos?.produtor_nome,
      ].filter(Boolean).join(' ');

    case 'ABASTECIMENTO':
      return registro.abastecimento?.motorista_nome || '';

    case 'ENTREGA_INSUMO':
      return [
        registro.entrega_insumo?.empresa,
        registro.entrega_insumo?.motorista_nome,
      ].filter(Boolean).join(' ');

    case 'EXPEDICAO':
      return registro.expedicao?.motorista_nome || '';

    case 'VISITA':
      return registro.visita?.visitante_nome || '';

    default:
      return '';
  }
};

// ============================================================================
// SELETORES SIMPLES (extraem propriedades diretas)
// ============================================================================

/**
 * Seleciona a lista de registros
 */
export const selectRegistros = createSelector(
  [selectPortariaRegistroState],
  (state) => state.registros
);

/**
 * Seleciona estado de carregamento
 */
export const selectLoading = createSelector(
  [selectPortariaRegistroState],
  (state) => state.loading
);

/**
 * Seleciona mensagem de erro
 */
export const selectError = createSelector(
  [selectPortariaRegistroState],
  (state) => state.error
);

/**
 * Seleciona paginação
 */
export const selectPagination = createSelector(
  [selectPortariaRegistroState],
  (state) => state.pagination
);

/**
 * Seleciona filtros aplicados
 */
export const selectFilters = createSelector(
  [selectPortariaRegistroState],
  (state) => state.filters
);

/**
 * Seleciona IDs selecionados
 */
export const selectSelectedIds = createSelector(
  [selectPortariaRegistroState],
  (state) => state.selectedIds
);

/**
 * Seleciona registro em detalhe/edição
 */
export const selectSelectedRegistro = createSelector(
  [selectPortariaRegistroState],
  (state) => state.selectedRegistro
);

/**
 * Seleciona estado do drawer
 */
export const selectDrawer = createSelector(
  [selectPortariaRegistroState],
  (state) => state.drawer
);

// ============================================================================
// SELETORES COMPOSTOS (combinam múltiplos seletores)
// ============================================================================

/**
 * Seleciona registros da página atual com paginação
 * Útil para: exibir dados paginados
 */
export const selectPaginatedRegistros = createSelector(
  [selectRegistros, selectPagination],
  (registros, pagination) => ({
    registros,
    pagination,
  })
);

/**
 * Seleciona registros + carregamento + erro
 * Útil para: componentes que precisam de tudo junto
 */
export const selectRegistrosWithMeta = createSelector(
  [selectRegistros, selectLoading, selectError, selectPagination],
  (registros, loading, error, pagination) => ({
    registros,
    loading,
    error,
    pagination,
  })
);

/**
 * Seleciona registros filtrados
 * Útil para: aplicar filtros sem fazer novo request
 */
export const selectFilteredRegistros = createSelector(
  [selectRegistros, selectFilters],
  (registros, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return registros;
    }

    return registros.filter((registro) => {
      // Filtro por status
      if (filters.status && registro.status !== filters.status) {
        return false;
      }

      // Filtro por tipo
      if (filters.tipoRegistro && registro.tipo_registro !== filters.tipoRegistro) {
        return false;
      }

      // Filtro por período (data_entrada entre dataInicio e dataFim)
      if (filters.dataInicio || filters.dataFim) {
        const dataEntrada = new Date(registro.data_entrada);
        
        if (filters.dataInicio && dataEntrada < new Date(filters.dataInicio)) {
          return false;
        }

        if (filters.dataFim && dataEntrada > new Date(filters.dataFim)) {
          return false;
        }
      }

      // Filtro por busca (search)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nome = getSearchableText(registro);
        
        if (!nome.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }
);

/**
 * Seleciona registros selecionados (apenas os que estão em selectedIds)
 * Útil para: ações em massa (delete múltiplo, etc)
 */
export const selectSelectedRegistros = createSelector(
  [selectRegistros, selectSelectedIds],
  (registros, selectedIds) => registros.filter((reg) => selectedIds.includes(reg.id))
);

/**
 * Seleciona contagem de registros selecionados
 * Útil para: mostrar "X registros selecionados"
 */
export const selectSelectedCount = createSelector(
  [selectSelectedIds],
  (selectedIds) => selectedIds.length
);

/**
 * Seleciona total de registros
 * Útil para: estatísticas, relatórios
 */
export const selectTotal = createSelector(
  [selectPagination],
  (pagination) => pagination.total
);

/**
 * Seleciona informações de paginação
 * Útil para: componentes de paginação
 */
export const selectPaginationInfo = createSelector(
  [selectPagination],
  (pagination) => ({
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.page < pagination.totalPages - 1,
    hasPreviousPage: pagination.page > 0,
  })
);

/**
 * Seleciona estado booleano: tem registros?
 * Útil para: mostrar "vazio" quando não tem registros
 */
export const selectHasRegistros = createSelector(
  [selectRegistros],
  (registros) => registros.length > 0
);

/**
 * Seleciona estado booleano: todos os registros estão selecionados?
 * Útil para: checkbox "selecionar tudo"
 */
export const selectAllSelected = createSelector(
  [selectRegistros, selectSelectedIds],
  (registros, selectedIds) =>
    registros.length > 0 && registros.every((reg) => selectedIds.includes(reg.id))
);

/**
 * Seleciona estado booleano: nenhum registro selecionado?
 * Útil para: desabilitar botões de ação
 */
export const selectNoneSelected = createSelector(
  [selectSelectedIds],
  (selectedIds) => selectedIds.length === 0
);

/**
 * Seleciona estado booleano: alguns registros selecionados?
 * Útil para: mostrar estado "indeterminado" do checkbox
 */
export const selectSomeSelected = createSelector(
  [selectRegistros, selectSelectedIds],
  (registros, selectedIds) =>
    selectedIds.length > 0 && selectedIds.length < registros.length
);

/**
 * Seleciona registro específico por ID
 * Útil para: detalhes, edição
 */
export const selectRegistroById = (id: string) =>
  createSelector([selectRegistros], (registros) =>
    registros.find((reg) => reg.id === id)
  );

/**
 * Seleciona registros por tipo
 * Útil para: relatórios por tipo
 */
export const selectRegistrosByTipo = (tipo: string) =>
  createSelector([selectRegistros], (registros) =>
    registros.filter((reg) => reg.tipo_registro === tipo)
  );

/**
 * Seleciona registros por status
 * Útil para: dashboard, relatórios
 */
export const selectRegistrosByStatus = (status: string) =>
  createSelector([selectRegistros], (registros) =>
    registros.filter((reg) => reg.status === status)
  );

/**
 * Seleciona contagem de registros por status
 * Útil para: dashboard, estatísticas
 */
export const selectCountByStatus = createSelector(
  [selectRegistros],
  (registros) => ({
    emAndamento: registros.filter((reg) => reg.status === 'Em andamento').length,
    concluido: registros.filter((reg) => reg.status === 'Concluído').length,
  })
);

/**
 * Seleciona contagem de registros por tipo
 * Útil para: dashboard, estatísticas
 */
export const selectCountByTipo = createSelector(
  [selectRegistros],
  (registros) => {
    const count: Record<string, number> = {};
    registros.forEach((reg) => {
      count[reg.tipo_registro] = (count[reg.tipo_registro] || 0) + 1;
    });
    return count;
  }
);

/**
 * Seleciona página atual
 * Útil para: paginação
 */
export const selectCurrentPage = createSelector(
  [selectPagination],
  (pagination) => pagination.page
);

/**
 * Seleciona tamanho da página
 * Útil para: paginação
 */
export const selectPageSize = createSelector(
  [selectPagination],
  (pagination) => pagination.pageSize
);

/**
 * Seleciona se drawer está aberto
 * Útil para: mostrar/esconder drawer
 */
export const selectDrawerOpen = createSelector(
  [selectDrawer],
  (drawer) => drawer.open
);

/**
 * Seleciona modo do drawer (add, edit, view)
 * Útil para: alterar comportamento baseado no modo
 */
export const selectDrawerMode = createSelector(
  [selectDrawer],
  (drawer) => drawer.mode
);

/**
 * Seleciona tudo para um componente de lista (view completa)
 * Útil para: componente principal PortariaRegistroList
 */
export const selectListView = createSelector(
  [
    selectRegistros,
    selectLoading,
    selectError,
    selectPagination,
    selectFilters,
    selectSelectedIds,
  ],
  (registros, loading, error, pagination, filters, selectedIds) => ({
    registros,
    loading,
    error,
    pagination,
    filters,
    selectedIds,
  })
);

/**
 * Seleciona tudo para um componente de detalhe/edit (detail view)
 * Útil para: componente PortariaRegistroDrawer
 */
export const selectDetailView = createSelector(
  [selectSelectedRegistro, selectDrawer, selectLoading, selectError],
  (registro, drawer, loading, error) => ({
    registro,
    drawer,
    loading,
    error,
  })
);
