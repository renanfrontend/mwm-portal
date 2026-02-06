import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const COMMON_FONT_STYLE = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const AgendaDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<any>({ dataHora: '', motorista: '', placa: '', transportadora: '', status: 'Pendente' });

  useEffect(() => { 
    if (isOpen) setForm(initialData || { dataHora: '', motorista: '', placa: '', transportadora: '', status: 'Pendente' }); 
  }, [isOpen, initialData]);

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { 
      backgroundColor: isReadOnly ? 'rgba(245, 245, 245, 0.5)' : 'inherit', 
      filter: isReadOnly ? 'blur(0.5px)' : 'none', 
      pointerEvents: isReadOnly ? 'none' : 'auto', 
      ...COMMON_FONT_STYLE 
    },
    '& .MuiInputLabel-root': { ...COMMON_FONT_STYLE }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} PaperProps={{ sx: { width: 620, border: 'none' } }}>
      <Box sx={{ p: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT_STYLE }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ...COMMON_FONT_STYLE }}>Agendamento de logística</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ flex: 1, p: '20px', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, ...COMMON_FONT_STYLE }}>Dados do Agendamento</Typography>
          
          {/* 🛡️ COMPORTAMENTO NATIVO: Sem shrink e sem placeholder */}
          <TextField fullWidth label="Data e Hora" type="datetime-local" value={form.dataHora} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
          
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Motorista" variant="outlined" value={form.motorista} onChange={e => setForm({...form, motorista: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Placa" variant="outlined" value={form.placa} onChange={e => setForm({...form, placa: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>

          <TextField fullWidth label="Transportadora" variant="outlined" value={form.transportadora} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
        <Button fullWidth variant="outlined" onClick={onClose} sx={{ height: 48, ...COMMON_FONT_STYLE }}>{isReadOnly ? 'VOLTAR' : 'CANCELAR'}</Button>
        {!isReadOnly && <Button fullWidth variant="contained" onClick={() => onSave(form)} sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT_STYLE }}>SALVAR</Button>}
      </Box>
    </Drawer>
  );
};

export default AgendaDrawer;