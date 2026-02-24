import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, TextField, Button, MenuItem, FormControl, InputLabel, Select, Divider, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const maskCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").substring(0, 14);

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [formData, setFormData] = useState<any>({
    data: new Date(), horario: new Date(), atividade: '', transportadora: '', placa: '', cooperado: '', tipoVeiculo: '', motorista: '', cpfPassaporte: '', pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null, empresa: '', notaFiscal: '', motivo: ''
  });

  useEffect(() => { 
    if (open) {
      if (initialData) {
        setFormData({ ...initialData, data: new Date(), horario: new Date() });
      } else {
        setFormData({ data: new Date(), horario: new Date(), atividade: '', transportadora: '', placa: '', cooperado: '', tipoVeiculo: '', motorista: '', cpfPassaporte: '' });
      }
    }
  }, [open, initialData]);

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 },
    '& .MuiInputLabel-root': { 
      fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0, 0, 0, 0.60)',
      '&.Mui-focused': { color: '#0072C3' } 
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0072C3' }
  };

  const isView = mode === 'view';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}>
        
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>CADASTRO</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 0.5, fontFamily: SCHIBSTED }}>
              {isView ? 'Informações do registro selecionado.' : 'Preencha corretamente os campos abaixo para efetuar o cadastro.'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '40px' }}>
          <Stack direction="row" spacing={2.5}>
            <Box sx={{ flex: 1 }}><DatePicker label="Data" format="dd/MM/yyyy" value={formData.data} slotProps={{ textField: { fullWidth: true, sx: fieldStyle } }} onChange={(v)=>setFormData({...formData, data:v})}/></Box>
            <Box sx={{ flex: 1 }}><TimePicker label="Horário" ampm={false} value={formData.horario} slotProps={{ textField: { fullWidth: true, sx: fieldStyle } }} onChange={(v)=>setFormData({...formData, horario:v})}/></Box>
          </Stack>
          
          <FormControl fullWidth disabled={isView} sx={fieldStyle}>
            <InputLabel>Atividades a realizar</InputLabel>
            <Select label="Atividades a realizar" value={formData.atividade} MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, atividade:e.target.value})}>
              <MenuItem value="Abastecimento">Abastecimento</MenuItem>
              <MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem>
              <MenuItem value="Entrega de Insumo">Entrega de Insumo</MenuItem>
              <MenuItem value="Expedição">Expedição</MenuItem>
              <MenuItem value="Visita">Visita</MenuItem>
            </Select>
          </FormControl>

          {formData.atividade && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <Divider />
              <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Informações</Typography>

              {/* SEQUÊNCIA: ENTREGA DE DEJETOS */}
              {formData.atividade === 'Entrega de dejetos' && (
                <>
                  <Stack direction="row" spacing={2.5}>
                    <FormControl sx={{ flex: 1, ...fieldStyle }} disabled={isView}><InputLabel>Transportadora</InputLabel><Select label="Transportadora" value={formData.transportadora} MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, transportadora:e.target.value})}><MenuItem value="Jadlog">Jadlog</MenuItem></Select></FormControl>
                    <FormControl sx={{ flex: 1, ...fieldStyle }} disabled={isView}><InputLabel>Placa</InputLabel><Select label="Placa" value={formData.placa} MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, placa:e.target.value})}><MenuItem value="ABC-1234">ABC-1234</MenuItem></Select></FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2.5}>
                    <FormControl sx={{ flex: 1, ...fieldStyle }} disabled={isView}><InputLabel>Cooperado</InputLabel><Select label="Cooperado" value={formData.cooperado} MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, cooperado:e.target.value})}><MenuItem value="Coop 01">Coop 01</MenuItem></Select></FormControl>
                    <FormControl sx={{ flex: 1, ...fieldStyle }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo de veículo" value={formData.tipoVeiculo} MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value})}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2.5}>
                    <TextField sx={{ flex: 1, ...fieldStyle }} label="Motorista" value={formData.motorista} onChange={(e)=>setFormData({...formData, motorista:e.target.value})} />
                    <TextField sx={{ flex: 1, ...fieldStyle }} label="CPF/Passaporte" value={formData.cpfPassaporte} onChange={(e)=>setFormData({...formData, cpfPassaporte:maskCPF(e.target.value)})} />
                  </Stack>
                </>
              )}
            </Box>
          )}
        </Box>

        {!isView && (
          <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
            <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)' }}>CANCELAR</Button>
            <Button variant="contained" onClick={() => onSave(formData)} disabled={!formData.atividade} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 600 }}>SALVAR</Button>
          </Box>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;