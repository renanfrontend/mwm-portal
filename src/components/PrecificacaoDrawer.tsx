import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';

interface PrecificacaoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const globalMenuProps = { style: { zIndex: 10000 } };

export const PrecificacaoDrawer: React.FC<PrecificacaoDrawerProps> = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState<{
    preco: string; produto: string; mesAnp: string; mesFatura: string; data: Dayjs | null;
  }>({
    preco: '', produto: '', mesAnp: '', mesFatura: '', data: null
  });

  useEffect(() => {
    if (open) {
      setForm({ preco: '', produto: '', mesAnp: '', mesFatura: '', data: null });
    }
  }, [open]);

  // Máscara de moeda para o campo de preço ($ 0,00)
  const handlePrecoMask = (value: string) => {
    let v = value.replace(/\D/g, ''); 
    if (!v) return '';
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    return `$ ${v}`;
  };

  const handleSaveClick = () => {
    const payload = {
      ...form,
      data: form.data ? form.data.format('DD/MM/YYYY') : ''
    };
    onSave(payload);
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16, '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' } },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0, 0, 0, 0.60)', '&.Mui-focused': { color: PRIMARY_BLUE } }
  };

  const calendarSlotProps: any = {
    popper: { sx: { zIndex: 10000 } }, actionBar: { actions: [] }, 
    desktopPaper: { sx: { borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', bgcolor: 'white', boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' } },
    day: { sx: { fontFamily: SCHIBSTED, fontSize: '14px', width: '36px', height: '36px', borderRadius: '100px', color: 'rgba(0,0,0,0.87)', '&.Mui-selected': { bgcolor: `${PRIMARY_BLUE} !important`, color: 'white', fontWeight: 400 }, '&.Mui-disabled': { color: 'rgba(0,0,0,0.4)' }, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } } },
    calendarHeader: { sx: { '& .MuiPickersCalendarHeader-label': { fontFamily: SCHIBSTED, fontWeight: 500, color: 'black' }, '& .MuiDayCalendar-weekDayLabel': { fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', fontSize: '14px', width: '36px', height: '36px' } } },
    textField: { InputLabelProps: { shrink: true } }
  };

  const mesesOptions = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 9999 }} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', height: '100%', border: 'none', bgcolor: 'white' } }}>
        
        {/* HEADER */}
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>
              CADASTRAR PREÇO
            </Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED, color: 'black' }}>
              Adicione o preço para que o produto fique disponível.
            </Typography>
          </Box>
        </Box>

        {/* CORPO DO FORMULÁRIO */}
        <Box sx={{ flex: 1, px: '20px', pt: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
          
          <TextField 
            fullWidth label="Preço" placeholder="$ 0,00" 
            value={form.preco} 
            onChange={e => setForm({...form, preco: handlePrecoMask(e.target.value)})} 
            sx={fieldStyle} 
          />

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth sx={fieldStyle}>
              <InputLabel>Produto</InputLabel>
              <Select label="Produto" value={form.produto} onChange={e => setForm({...form, produto: e.target.value as string})} MenuProps={globalMenuProps}>
                <MenuItem value="Biometano">Biometano</MenuItem>
                <MenuItem value="CO²">CO²</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={fieldStyle}>
              <InputLabel>Mês ANP</InputLabel>
              <Select label="Mês ANP" value={form.mesAnp} onChange={e => setForm({...form, mesAnp: e.target.value as string})} MenuProps={globalMenuProps}>
                {mesesOptions.map(mes => <MenuItem key={mes} value={mes}>{mes}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth sx={fieldStyle}>
              <InputLabel>Mês fatura</InputLabel>
              <Select label="Mês fatura" value={form.mesFatura} onChange={e => setForm({...form, mesFatura: e.target.value as string})} MenuProps={globalMenuProps}>
                {mesesOptions.map(mes => <MenuItem key={mes} value={mes}>{mes}</MenuItem>)}
              </Select>
            </FormControl>

            <DesktopDatePicker 
              label="Data" 
              value={form.data} 
              onChange={(val) => setForm({...form, data: val})} 
              format="DD/MM/YYYY" 
              sx={{ width: '100%', ...fieldStyle }} 
              slotProps={calendarSlotProps} 
            />
          </Stack>

        </Box>

        {/* FOOTER DO DRAWER */}
        <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', borderColor: 'rgba(0,0,0,0.23)', fontWeight: 600 }}>
            CANCELAR
          </Button>
          <Button variant="contained" onClick={handleSaveClick} fullWidth sx={{ height: 48, bgcolor: PRIMARY_BLUE, fontFamily: SCHIBSTED, fontWeight: 600 }}>
            SALVAR
          </Button>
        </Box>

      </Drawer>
    </LocalizationProvider>
  );
};

export default PrecificacaoDrawer;