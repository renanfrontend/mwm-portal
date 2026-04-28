import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Drawer, FormControl, InputLabel, Select, MenuItem, Stack, useTheme, useMediaQuery
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';

interface BaseCalculoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const globalMenuProps = { style: { zIndex: 10000 } };

export const BaseCalculoDrawer: React.FC<BaseCalculoDrawerProps> = ({ open, onClose, onSave, initialData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [form, setForm] = useState({
    cliente: '', produto: '', volume: '', percentual: '', descricao: ''
  });

  // ✅ Máscaras Embutidas (Sufixo grudado)
  const handleVolumeMask = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    return `${Number(clean).toLocaleString('pt-BR')}m³`;
  };

  const handlePercentualMask = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) return '';
    const num = Number(clean) / 100;
    return `${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  useEffect(() => {
    if (open && initialData) {
      setForm({
        cliente: initialData.cliente || '',
        produto: initialData.produto || '',
        volume: initialData.volume ? handleVolumeMask(initialData.volume) : '',
        percentual: initialData.percentual ? handlePercentualMask(initialData.percentual) : '',
        descricao: initialData.descricao || ''
      });
    } else if (open) {
      setForm({ cliente: '', produto: '', volume: '', percentual: '', descricao: '' });
    }
  }, [open, initialData]);

  const handleSaveClick = () => {
    onSave({ ...initialData, ...form });
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0, 0, 0, 0.60)' }
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose} 
      sx={{ zIndex: 9999 }} 
      PaperProps={{ sx: { width: isMobile ? '100%' : 620, border: 'none', bgcolor: 'white' } }}
    >
      {/* HEADER AJUSTADO */}
      <Box sx={{ p: '24px 20px', position: 'relative', flexShrink: 0 }}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 16, top: 16, color: 'rgba(0,0,0,0.54)' }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: '40px', color: 'black', mt: 1 }}>
          Editar
        </Typography>
        <Typography sx={{ fontSize: 16, fontFamily: SCHIBSTED, color: 'black', mt: 0.5 }}>
          Altere os dados necessários para corrigir ou atualizar o cálculo.
        </Typography>
      </Box>

      {/* CORPO */}
      <Box sx={{ flex: 1, px: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '120px' }}>
        <TextField 
          fullWidth label="Cliente" disabled value={form.cliente} 
          sx={{ ...fieldStyle, '& .Mui-disabled': { WebkitTextFillColor: 'rgba(0,0,0,0.6)' } }} 
        />

        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          <FormControl sx={{ flex: 1, ...fieldStyle }}>
            <InputLabel>Produto</InputLabel>
            <Select label="Produto" value={form.produto} onChange={e => setForm({...form, produto: e.target.value})} MenuProps={globalMenuProps}>
              <MenuItem value="Biometano">Biometano</MenuItem>
              <MenuItem value="CO²">CO²</MenuItem>
              <MenuItem value="Diesel">Diesel</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            sx={{ flex: 1, ...fieldStyle }}
            label="Volume contrato mensal" 
            value={form.volume} 
            onChange={e => setForm({...form, volume: handleVolumeMask(e.target.value)})} 
          />
        </Stack>

        <TextField 
          fullWidth label="Porcentual do cliente" 
          value={form.percentual} 
          onChange={e => setForm({...form, percentual: handlePercentualMask(e.target.value)})} 
          sx={fieldStyle} 
        />

        <TextField 
          fullWidth label="Descrição" multiline rows={4} value={form.descricao} 
          onChange={e => { if (e.target.value.length <= 3000) setForm({...form, descricao: e.target.value}) }} 
          sx={fieldStyle} helperText={`${form.descricao.length}/3.000`}
        />
      </Box>

      {/* FOOTER */}
      <Box sx={{ p: '20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, position: 'absolute', bottom: 0, width: '100%', boxSizing: 'border-box' }}>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: PRIMARY_BLUE, borderColor: 'rgba(0,114,195,0.5)', fontWeight: 600 }}>
          CANCELAR
        </Button>
        <Button variant="contained" onClick={handleSaveClick} fullWidth sx={{ height: 48, bgcolor: PRIMARY_BLUE, fontFamily: SCHIBSTED, fontWeight: 600 }}>
          SALVAR
        </Button>
      </Box>
    </Drawer>
  );
};