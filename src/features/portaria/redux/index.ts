/**
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 * @description Exports centralizados do Redux para Portaria Registro
 */

// ============================================================================
// SLICE E REDUCER
// ============================================================================

export { default as portariaRegistroReducer } from './portariaRegistroSlice';

// ============================================================================
// ASYNC THUNKS (Ações assíncronas)
// ============================================================================

export {
  fetchRegistrosList,
  createRegistro,
  updateRegistro,
  deleteRegistro,
  deleteMultipleRegistros,
} from './portariaRegistroSlice';

// ============================================================================
// ACTIONS (Ações síncronas)
// ============================================================================

export {
  setPage,
  setPageSize,
  setFilters,
  clearFilters,
  toggleSelectRegistro,
  selectAllRegistros,
  clearSelection,
  openDrawer,
  closeDrawer,
  clearError,
  resetState,
} from './portariaRegistroSlice';

// ============================================================================
// SELECTORS (Seletores memoizados)
// ============================================================================

export {
  // Seletores simples
  selectRegistros,
  selectLoading,
  selectError,
  selectPagination,
  selectFilters,
  selectSelectedIds,
  selectSelectedRegistro,
  selectDrawer,
  
  // Seletores compostos
  selectPaginatedRegistros,
  selectRegistrosWithMeta,
  selectFilteredRegistros,
  selectSelectedRegistros,
  selectSelectedCount,
  selectTotal,
  selectPaginationInfo,
  selectHasRegistros,
  selectAllSelected,
  selectNoneSelected,
  selectSomeSelected,
  selectRegistroById,
  selectRegistrosByTipo,
  selectRegistrosByStatus,
  selectCountByStatus,
  selectCountByTipo,
  selectCurrentPage,
  selectPageSize,
  selectDrawerOpen,
  selectDrawerMode,
  selectListView,
  selectDetailView,
} from './selectors';
