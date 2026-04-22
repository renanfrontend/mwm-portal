import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button, Stack, Drawer } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

const AgendaDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<any>({ dataHora: '', motorista: '', placa: '', transportadora: '' });

  useEffect(() => { 
    if (isOpen) setForm(initialData || { dataHora: '', motorista: '', placa: '', transportadora: '' }); 
  }, [isOpen, initialData]);

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { backgroundColor: isReadOnly ? 'rgba(245, 245, 245, 0.5)' : 'inherit', ...COMMON_FONT },
    '& .MuiInputLabel-root': { ...COMMON_FONT, '&.Mui-focused': { color: '#0072C3' } },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0072C3' }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: 620, border: 'none', display: 'flex', flexDirection: 'column' } }}>
      <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT, lineHeight: 1.1 }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ...COMMON_FONT }}>Agendamento de logística</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: '20px', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, ...COMMON_FONT }}>Dados do Agendamento</Typography>
          <TextField fullWidth label="Data e Hora" type="datetime-local" value={form.dataHora} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Motorista" value={form.motorista} onChange={(e)=>setForm({...form, motorista:e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Placa" value={form.placa} onChange={(e)=>setForm({...form, placa:e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <TextField fullWidth label="Transportadora" value={form.transportadora} onChange={(e)=>setForm({...form, transportadora:e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>
      </Box>

      <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, borderTop: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}>
        <Button fullWidth variant="outlined" onClick={onClose} sx={{ height: 48, ...COMMON_FONT }}>CANCELAR</Button>
        <Button fullWidth variant="contained" onClick={() => onSave(form)} sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT, fontWeight: 600 }}>SALVAR</Button>
      </Box>
    </Drawer>
  );
};

export default AgendaDrawer;