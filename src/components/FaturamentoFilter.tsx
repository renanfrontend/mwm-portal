import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Popover, FormControl, InputLabel, Select, MenuItem, Stack 
} from '@mui/material';
import { 
  Check as CheckIcon, 
  DeleteOutline as DeleteIcon 
} from '@mui/icons-material';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';

interface FaturamentoFilterProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onApply: (ano: string) => void;
  onClear: () => void;
  currentAno: string;
  anos: string[];
}

export const FaturamentoFilter: React.FC<FaturamentoFilterProps> = ({
  anchorEl, onClose, onApply, onClear, currentAno, anos
}) => {
  const [filterAno, setFilterAno] = useState<string>('');

  const open = Boolean(anchorEl);
  const id = open ? 'faturamento-filter-popover' : undefined;

  useEffect(() => {
    if (open) setFilterAno(currentAno);
  }, [open, currentAno]);

  const hasActiveFilter = Boolean(filterAno);
  const hasAppliedFilter = Boolean(currentAno);

  const handleApply = () => { onApply(filterAno); onClose(); };
  const handleClear = () => { setFilterAno(''); onClear(); onClose(); };
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 14 },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 14, '&.Mui-focused': { color: PRIMARY_BLUE } }
  };

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
      <Box sx={{ pl: 2, pr: 3, pt: 2.5, pb: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ width: 320, ...fieldStyle }}>
            <InputLabel>Ano</InputLabel>
            <Select 
              value={filterAno} 
              onChange={(e) => setFilterAno(e.target.value as string)} 
              label="Ano" 
            >
              <MenuItem value="">Todos os anos</MenuItem>
              {anos.map(a => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ p: 1, borderTop: '1px solid rgba(224, 224, 224, 1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Button
          variant="text"
          startIcon={<CheckIcon sx={{ fontSize: '18px !important' }} />}
          onClick={handleApply}
          disabled={!hasActiveFilter}
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
          disabled={!hasAppliedFilter && !hasActiveFilter}
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
    </Popover>
  );
};