import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Popover, FormControl, InputLabel, Select, MenuItem, Stack, IconButton 
} from '@mui/material';
import { 
  Check as CheckIcon, 
  DeleteOutline as DeleteIcon, 
  ArrowForwardIos as ArrowForwardIcon 
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';

export interface FilterState {
  cliente: string;
  placa: string;
  carga: string;
  pressaoInicial: Dayjs | null;
}

interface AbastecimentoFilterProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
  currentFilters: FilterState;
  clientes: string[];
  placas: string[];
  cargas?: string[];
}

const defaultFilters: FilterState = {
  cliente: '',
  placa: '',
  carga: '',
  pressaoInicial: null
};

export const AbastecimentoFilter: React.FC<AbastecimentoFilterProps> = ({
  anchorEl, onClose, onApply, onClear, currentFilters, clientes, placas, cargas = ['Biometano', 'Dejeto']
}) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  
  // ✅ Estados independentes para saber se o campo foi clicado OU se o calendário foi aberto no ícone
  const [dateFocused, setDateFocused] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'abastecimento-filter-popover' : undefined;

  useEffect(() => {
    if (open) setFilters(currentFilters);
  }, [open, currentFilters]);

  const hasActiveFilters = Boolean(
    filters.cliente || filters.placa || filters.carga || filters.pressaoInicial
  );

  const hasAppliedFilters = Boolean(
    currentFilters.cliente || currentFilters.placa || currentFilters.carga || currentFilters.pressaoInicial
  );

  const handleApply = () => { onApply(filters); onClose(); };
  const handleClear = () => { setFilters(defaultFilters); onClear(); onClose(); };
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 14 },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 14, '&.Mui-focused': { color: PRIMARY_BLUE } }
  };

  // ✅ A regra de ouro: A label fica suspensa se houver data, se focar no input OU se clicar no ícone do calendário
  const isDateActive = Boolean(filters.pressaoInicial) || dateFocused || dateOpen;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClick={stopPropagation}
      PaperProps={{
        sx: { 
          width: 'auto', 
          maxWidth: 'none', 
          mt: 1, 
          borderRadius: '4px', 
          border: '1px solid rgba(0,0,0,0.12)', 
          boxShadow: '0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12), 0px 5px 5px -3px rgba(0,0,0,0.20)' 
        }
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        
        <Box sx={{ pl: 1, pr: 1.5, pt: 2.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          
          <Stack direction="row" spacing={2} alignItems="center">
            
            <FormControl size="small" sx={{ width: 240, ...fieldStyle }}>
              <InputLabel>Cliente</InputLabel>
              <Select value={filters.cliente} onChange={(e) => setFilters({ ...filters, cliente: e.target.value })} label="Cliente" MenuProps={{ disablePortal: true }}>
                <MenuItem value="">Todos</MenuItem>
                {clientes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 160, ...fieldStyle }}>
              <InputLabel>Placa</InputLabel>
              <Select value={filters.placa} onChange={(e) => setFilters({ ...filters, placa: e.target.value })} label="Placa" MenuProps={{ disablePortal: true }}>
                <MenuItem value="">Todas</MenuItem>
                {placas.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 160, ...fieldStyle }}>
              <InputLabel>Carga</InputLabel>
              <Select value={filters.carga} onChange={(e) => setFilters({ ...filters, carga: e.target.value })} label="Carga" MenuProps={{ disablePortal: true }}>
                <MenuItem value="">Todas</MenuItem>
                {cargas.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            {/* ✅ O CAMPO BLINDADO */}
            <DesktopDatePicker
              label="Pressão inicial"
              value={filters.pressaoInicial}
              onChange={(val) => setFilters({ ...filters, pressaoInicial: val })}
              format="DD/MM/YYYY"
              onOpen={() => setDateOpen(true)} // Avisa que clicou no ícone
              onClose={() => setDateOpen(false)} // Avisa que fechou o calendário
              sx={{ width: 320, ...fieldStyle }}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  onFocus: () => setDateFocused(true),
                  onBlur: () => setDateFocused(false),
                  InputLabelProps: { 
                    shrink: isDateActive // Força a label a ficar suspensa corretamente
                  },
                  sx: {
                    '& input::placeholder': {
                      color: isDateActive ? 'inherit' : 'transparent', // Esconde DD/MM/YYYY quando inativo
                      opacity: isDateActive ? 1 : 0
                    }
                  }
                },
                popper: { sx: { zIndex: 10000 } }
              }}
            />

            <Box sx={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton sx={{ color: 'rgba(0,0,0,0.54)', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

          </Stack>

        </Box>

        <Box sx={{ p: 1, borderTop: '1px solid rgba(224, 224, 224, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Button
            variant="text"
            startIcon={<CheckIcon sx={{ fontSize: '18px !important' }} />}
            onClick={handleApply}
            disabled={!hasActiveFilters}
            sx={{
              px: 1, py: 0.75, borderRadius: '4px', color: PRIMARY_BLUE,
              fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, textTransform: 'uppercase',
              '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.25)' }, 
              '&:hover': { bgcolor: 'rgba(0, 114, 195, 0.08)' }
            }}
          >
            Aplicar
          </Button>

          <Button
            variant="text"
            startIcon={<DeleteIcon sx={{ fontSize: '18px !important' }} />}
            onClick={handleClear}
            disabled={!hasAppliedFilters && !hasActiveFilters}
            sx={{
              px: 1, py: 0.75, borderRadius: '4px', color: PRIMARY_BLUE,
              fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, textTransform: 'uppercase',
              '&.Mui-disabled': { color: 'rgba(0, 0, 0, 0.25)' }, 
              '&:hover': { bgcolor: 'rgba(0, 114, 195, 0.08)' }
            }}
          >
            Remover
          </Button>
        </Box>

      </LocalizationProvider>
    </Popover>
  );
};