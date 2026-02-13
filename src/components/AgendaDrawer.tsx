import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Button, Stack, Drawer } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const AgendaDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<any>({ dataHora: '', motorista: '', placa: '', transportadora: '' });

  useEffect(() => { 
    if (isOpen) setForm(initialData || { dataHora: '', motorista: '', placa: '', transportadora: '' }); 
  }, [isOpen, initialData]);

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { 
      backgroundColor: isReadOnly ? 'rgba(245, 245, 245, 0.5)' : 'inherit', 
      ...COMMON_FONT 
    },
    '& .MuiInputLabel-root': { ...COMMON_FONT }
  };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 5000 }} // 🛡️ FIX: Acima do Header
      PaperProps={{ sx: { width: 620, border: 'none' } }}
    >
      <Box sx={{ p: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ...COMMON_FONT }}>Agendamento de logística</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ flex: 1, p: '20px', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, ...COMMON_FONT }}>Dados do Agendamento</Typography>
          <TextField fullWidth label="Data e Hora" type="datetime-local" value={form.dataHora} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Motorista" variant="outlined" value={form.motorista} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Placa" variant="outlined" value={form.placa} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <TextField fullWidth label="Transportadora" variant="outlined" value={form.transportadora} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
        <Button fullWidth variant="outlined" onClick={onClose} sx={COMMON_FONT}>CANCELAR</Button>
        <Button fullWidth variant="contained" onClick={() => onSave(form)} sx={{ bgcolor: '#0072C3', ...COMMON_FONT }}>SALVAR</Button>
      </Box>
    </Drawer>
  );
};

export default AgendaDrawer;