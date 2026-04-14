import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { 
  PortariaRegistroState, 
  PortariaRegistroFilters
} from '../types';
import type { PortariaRegistroFormData } from '../types';
import { portariaRegistroService } from '../services';
import { PORTARIA_PAGINATION_DEFAULTS, PORTARIA_ERROR_MESSAGES } from '../constants';

/**
 * @author Antonio Marcos de Souza Santos
 * @date 24/03/2026
 * @description Redux Toolkit slice para gerenciar estado global de Portaria Registro
 */

// ============================================================================
// ASYNC THUNKS - Chamadas HTTP para API
// ============================================================================

/**
 * Busca lista de registros com paginação e filtros
 * @endpoint GET /api/portaria/registros
 */
export const fetchRegistrosList = createAsyncThunk(
  'portariaRegistro/fetchList',
  async (
    filters: PortariaRegistroFilters = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await portariaRegistroService.listRegistros(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || PORTARIA_ERROR_MESSAGES.FETCH_FAILED);
    }
  }
);



/**
 * Cria novo registro
 * @endpoint POST /api/portaria/registros
 */
export const createRegistro = createAsyncThunk(
  'portariaRegistro/create',
  async (data: PortariaRegistroFormData, { rejectWithValue }) => {
    try {
      const response = await portariaRegistroService.createRegistro(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || PORTARIA_ERROR_MESSAGES.CREATE_FAILED);
    }
  }
);

/**
 * Atualiza registro existente
 * @endpoint PUT /api/portaria/registros/:id
 */
export const updateRegistro = createAsyncThunk(
  'portariaRegistro/update',
  async (
    { id, data }: { id: string; data: PortariaRegistroFormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await portariaRegistroService.updateRegistro(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || PORTARIA_ERROR_MESSAGES.UPDATE_FAILED);
    }
  }
);

/**
 * Deleta um registro
 * @endpoint DELETE /api/portaria/registros/:id
 */
export const deleteRegistro = createAsyncThunk(
  'portariaRegistro/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await portariaRegistroService.deleteRegistro(id);
      return id; // Retorna ID do registro deletado
    } catch (error: any) {
      return rejectWithValue(error.message || PORTARIA_ERROR_MESSAGES.DELETE_FAILED);
    }
  }
);

/**
 * Deleta múltiplos registros
 * @endpoint DELETE /api/portaria/registros (com array de IDs no body)
 */
export const deleteMultipleRegistros = createAsyncThunk(
  'portariaRegistro/deleteMultiple',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await portariaRegistroService.deleteMultipleRegistros(ids);
      return ids; // Retorna IDs dos registros deletados
    } catch (error: any) {
      return rejectWithValue(error.message || PORTARIA_ERROR_MESSAGES.DELETE_FAILED);
    }
  }
);

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: PortariaRegistroState = {
  registros: [],
  selectedRegistro: null,
  loading: false,
  error: null,
  pagination: {
    page: PORTARIA_PAGINATION_DEFAULTS.PAGE,
    pageSize: PORTARIA_PAGINATION_DEFAULTS.PAGE_SIZE,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  drawer: {
    open: false,
    mode: 'add',
  },
  selectedIds: [],
};

// ============================================================================
// SLICE
// ============================================================================

const portariaRegistroSlice = createSlice({
  name: 'portariaRegistro',
  initialState,
  reducers: {
    // ========================================================================
    // SÍNCRONO - Ações sem chamada HTTP
    // ========================================================================

    /**
     * Altera página atual
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    /**
     * Altera quantidade de itens por página
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 0; // Volta para primeira página
    },

    /**
     * Atualiza filtros aplicados
     */
    setFilters: (state, action: PayloadAction<PortariaRegistroFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 0; // Volta para primeira página
    },

    /**
     * Limpa todos os filtros
     */
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 0;
    },

    /**
     * Seleciona/deseleciona registros para ações em massa
     */
    toggleSelectRegistro: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index > -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },

    /**
     * Seleciona todos os registros da página
     */
    selectAllRegistros: (state) => {
      state.selectedIds = state.registros.map((r) => r.id);
    },

    /**
     * Deseleciona todos os registros
     */
    clearSelection: (state) => {
      state.selectedIds = [];
    },

    /**
     * Abre drawer com modo
     */
    openDrawer: (state, action: PayloadAction<{ mode: 'view' | 'edit' | 'add'; registroId?: string }>) => {
      state.drawer.open = true;
      state.drawer.mode = action.payload.mode;
      if (action.payload.registroId) {
        state.selectedRegistro = state.registros.find((r) => r.id === action.payload.registroId) || null;
      }
    },

    /**
     * Fecha drawer
     */
    closeDrawer: (state) => {
      state.drawer.open = false;
      state.selectedRegistro = null;
    },

    /**
     * Limpa erros
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reseta estado para inicial
     */
    resetState: () => {
      return initialState;
    },
  },

  // ========================================================================
  // EXTRAREDUCERS - Lidar com async thunks
  // ========================================================================

  extraReducers: (builder) => {
    // ========================================================================
    // FETCH LIST (Listar registros)
    // ========================================================================

    builder
      .addCase(fetchRegistrosList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrosList.fulfilled, (state, action) => {
        state.loading = false;
        state.registros = action.payload.data || [];
        state.pagination = {
          page: action.payload.pagination?.page || 0,
          pageSize: action.payload.pagination?.pageSize || PORTARIA_PAGINATION_DEFAULTS.PAGE_SIZE,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.totalPages || 0,
        };
      })
      .addCase(fetchRegistrosList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // CREATE (Criar novo registro)
    // ========================================================================

    builder
      .addCase(createRegistro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRegistro.fulfilled, (state, action) => {
        state.loading = false;
        // Adiciona novo registro no início da lista
        state.registros.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createRegistro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // UPDATE (Atualizar registro)
    // ========================================================================

    builder
      .addCase(updateRegistro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegistro.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.registros.findIndex((r) => r.id === action.payload.id);
        if (index > -1) {
          state.registros[index] = action.payload;
        }
        if (state.selectedRegistro?.id === action.payload.id) {
          state.selectedRegistro = action.payload;
        }
      })
      .addCase(updateRegistro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // DELETE (Deletar um registro)
    // ========================================================================

    builder
      .addCase(deleteRegistro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRegistro.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        state.registros = state.registros.filter((r) => r.id !== id);
        state.selectedIds = state.selectedIds.filter((sid) => sid !== id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteRegistro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ========================================================================
    // DELETE MULTIPLE (Deletar múltiplos registros)
    // ========================================================================

    builder
      .addCase(deleteMultipleRegistros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMultipleRegistros.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload;
        state.registros = state.registros.filter((r) => !ids.includes(r.id));
        state.selectedIds = [];
        state.pagination.total = Math.max(0, state.pagination.total - ids.length);
      })
      .addCase(deleteMultipleRegistros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================================================
// ACTIONS (Síncrono)
// ============================================================================

export const {
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
} = portariaRegistroSlice.actions;

// ============================================================================
// REDUCER (Padrão)
// ============================================================================

export default portariaRegistroSlice.reducer;
