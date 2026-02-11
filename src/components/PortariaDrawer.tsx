import React, { useState, useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, 
  Button, MenuItem, FormControl, InputLabel, Select, Divider 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const SELECTED_BLUE = 'rgba(0, 114, 195, 0.04)';

const getInitialState = () => ({
  data: new Date(),
  horario: new Date(),
  atividade: '',
  transportadora: '',
  transportadoraManual: '',
  placa: '',
  placaManual: '',
  tipoVeiculo: '',
  motorista: '',
  cpfPassaporte: '',
});

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (open) setFormData(getInitialState());
  }, [open]);

  const handleClose = () => {
    setFormData(getInitialState());
    onClose();
  };

  const menuProps = {
    disablePortal: true,
    PaperProps: {
      sx: {
        zIndex: 10000,
        '& .MuiMenuItem-root': {
          fontFamily: SCHIBSTED,
          '&.Mui-selected': { bgcolor: SELECTED_BLUE, fontWeight: 500 }
        }
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer 
        anchor="right" open={open} onClose={handleClose} 
        sx={{ zIndex: 1400 }}
        PaperProps={{ sx: { width: 620, bgcolor: 'white', display: 'flex', flexDirection: 'column' } }}
      >
        <Box sx={{ minHeight: 148, px: '20px', pt: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>Cadastro</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 1, fontFamily: SCHIBSTED }}>Preencha corretamente os campos abaixo.</Typography>
          </Box>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ px: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '120px' }}>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Box sx={{ width: 280 }}>
              <DatePicker 
                label="Data" value={formData.data} maxDate={new Date()}
                onChange={(v) => setFormData({...formData, data: v})}
                // 🛡️ FIX: Popper agora abre na frente do Drawer
                slotProps={{ 
                  popper: { sx: { zIndex: 10000 } },
                  textField: { fullWidth: true, sx: { '& .MuiInputLabel-root': { fontFamily: SCHIBSTED } } } 
                }}
              />
            </Box>
            <Box sx={{ width: 280 }}>
              <TimePicker 
                label="Horário" ampm={false} value={formData.horario}
                onChange={(v) => setFormData({...formData, horario: v})}
                // 🛡️ FIX: Popper agora abre na frente do Drawer
                slotProps={{ 
                  popper: { sx: { zIndex: 10000 } },
                  textField: { fullWidth: true, sx: { '& .MuiInputLabel-root': { fontFamily: SCHIBSTED } } } 
                }}
              />
            </Box>
          </Box>

          <Box sx={{ width: 580 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: SCHIBSTED }}>Atividades a realizar</InputLabel>
              <Select value={formData.atividade} label="Atividades a realizar" onChange={(e) => setFormData({...formData, atividade: e.target.value})} MenuProps={menuProps}>
                <MenuItem value="Abastecimento">Abastecimento</MenuItem>
                <MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {formData.atividade && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Divider /><Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Informações</Typography>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <FormControl sx={{ width: 280 }}><InputLabel>Transportadora</InputLabel>
                  <Select value={formData.transportadora} label="Transportadora" onChange={(e) => setFormData({...formData, transportadora: e.target.value, placa: e.target.value === 'Outros' ? 'Outros' : formData.placa})} MenuProps={menuProps}>
                    <MenuItem value="Jadlog">Jadlog</MenuItem><MenuItem value="Outros">Outros</MenuItem>
                  </Select>
                </FormControl>
                <TextField sx={{ width: 280 }} label="Outros" disabled={formData.transportadora !== 'Outros'} value={formData.transportadoraManual} onChange={(e) => setFormData({...formData, transportadoraManual: e.target.value})} />
              </Box>

              <Box sx={{ display: 'flex', gap: '20px' }}>
                <FormControl sx={{ width: 280 }}><InputLabel>Placa</InputLabel>
                  <Select value={formData.placa} label="Placa" onChange={(e) => setFormData({...formData, placa: e.target.value})} MenuProps={menuProps}>
                    <MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem>
                  </Select>
                </FormControl>
                <TextField sx={{ width: 280 }} label="Outros" disabled={formData.placa !== 'Outros'} value={formData.placaManual} onChange={(e) => setFormData({...formData, placaManual: e.target.value})} />
              </Box>

              <Box sx={{ display: 'flex', gap: '20px' }}>
                <FormControl sx={{ width: 280 }}><InputLabel>Tipo</InputLabel><Select value={formData.tipoVeiculo} MenuProps={menuProps}><MenuItem value="Van">Van</MenuItem></Select></FormControl>
                <TextField sx={{ width: 280 }} label="Motorista" value={formData.motorista} onChange={(e) => setFormData({...formData, motorista: e.target.value})} />
              </Box>
              <TextField sx={{ width: 580 }} label="CPF/Passaporte" value={formData.cpfPassaporte} onChange={(e) => setFormData({...formData, cpfPassaporte: e.target.value})} />
            </Box>
          )}
        </Box>

        <Box sx={{ minHeight: 104, width: '100%', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', px: '20px', gap: '20px' }}>
          <Button variant="outlined" onClick={handleClose} sx={{ width: 280, height: 48, fontWeight: 500 }}>Cancelar</Button>
          <Button variant="contained" onClick={() => { onSave(formData); handleClose(); }} disabled={!formData.atividade || !formData.motorista} sx={{ width: 280, height: 48, bgcolor: '#0072C3', fontWeight: 500 }}>Salvar</Button>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;