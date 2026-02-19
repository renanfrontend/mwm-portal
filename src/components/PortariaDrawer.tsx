import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, TextField, Button, MenuItem, FormControl, InputLabel, Select, Divider } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
// 🛡️ IMPORTAÇÕES PARA VALIDAÇÃO DE DATA E HORA
import { isToday, addMinutes } from 'date-fns';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const maskCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").substring(0, 14);
const maskPlaca = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 7).replace(/^([A-Z]{3})([0-9])/, "$1-$2");
const applyLGPDMask = (cpf: string) => (cpf && cpf.length >= 14) ? `***.${cpf.split(/[.-]/)[1]}.***-**` : cpf;

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [formData, setFormData] = useState<any>({
    data: new Date(), horario: new Date(), atividade: '', transportadora: '', transportadoraManual: '', placa: '', placaManual: '', cooperado: '', tipoVeiculo: '', motorista: '', cpfPassaporte: '', pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null, empresa: '', notaFiscal: '', motivo: '', motivoManual: ''
  });

  useEffect(() => { 
    if (open && initialData) {
      const [d, m, y] = initialData.data?.split('/').map(Number) || [];
      const [hh, mm] = initialData.hora?.split(':').map(Number) || [];
      setFormData({ ...initialData, motorista: initialData.nome, data: d ? new Date(y, m - 1, d) : new Date(), horario: hh !== undefined ? new Date(2026, 1, 1, hh, mm) : new Date() });
    } else if (open) { setFormData({ data: new Date(), horario: new Date(), atividade: '', motorista: '', cpfPassaporte: '', transportadora: '', placa: '' }); }
  }, [open, initialData]);

  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isLocked = isView || isEdit;
  // 🛡️ IDENTIFICA SE ESTÁ NO MODO DE CADASTRO
  const isAdd = mode === 'add';

  const handleTransportadoraChange = (val: string) => {
    if (isView) return;
    setFormData((p: any) => ({ ...p, transportadora: val, placa: val === 'Outros' ? 'Outros' : p.placa }));
  };

  const menuProps = { disablePortal: true, PaperProps: { sx: { zIndex: 10000, '& .MuiMenuItem-root': { fontFamily: SCHIBSTED } } } };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: { xs: '100%', sm: 620 }, bgcolor: 'white', border: 'none' } }}>
        <Box sx={{ minHeight: { xs: 100, sm: 148 }, px: '20px', pt: { xs: '24px', sm: '48px' }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box><Typography sx={{ fontSize: { xs: 24, sm: 32 }, fontWeight: 700, fontFamily: SCHIBSTED }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 14, color: 'black', mt: 1, fontFamily: SCHIBSTED }}>{isView ? 'Informações do registro selecionado.' : 'Preencha corretamente os campos abaixo.'}</Typography></Box>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '120px' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
            {/* 🛡️ DATA: BLOQUEIO DE DATAS FUTURAS NO CADASTRO */}
            <Box sx={{ flex: 1 }}><DatePicker label="Data" format="dd/MM/yyyy" value={formData.data} disabled={isLocked} disableFuture={isAdd} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true, placeholder: 'DD/MM/AAAA' } }} onChange={(v)=>setFormData({...formData, data:v})}/></Box>
            
            {/* 🛡️ HORA: BLOQUEIO DE HORA +10 MINUTOS CASO SEJA HOJE */}
            <Box sx={{ flex: 1 }}><TimePicker label="Horário" ampm={false} disabled={isLocked} value={formData.horario} maxTime={isAdd && formData.data && isToday(formData.data) ? addMinutes(new Date(), 10) : undefined} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }} onChange={(v)=>setFormData({...formData, horario:v})}/></Box>
          </Box>
          
          <Box sx={{ width: '100%' }}><FormControl fullWidth disabled={isLocked}><InputLabel>Atividades a realizar</InputLabel>
            <Select value={formData.atividade} label="Atividades a realizar" MenuProps={{ disablePortal: true }} onChange={(e)=>setFormData({...formData, atividade:e.target.value as string})}>
              <MenuItem value="Abastecimento">Abastecimento</MenuItem><MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem><MenuItem value="Entrega de Insumo">Entrega de Insumo</MenuItem><MenuItem value="Expedição">Expedição</MenuItem><MenuItem value="Visita">Visita</MenuItem>
            </Select></FormControl></Box>

          {formData.atividade && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <Divider />
              <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: INTER }}>Informações</Typography>

              {formData.atividade !== 'Visita' && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Transportadora</InputLabel><Select label="Transportadora" value={formData.transportadora} onChange={(e)=>handleTransportadoraChange(e.target.value as string)} MenuProps={menuProps}><MenuItem value="Jadlog">Jadlog</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                    <TextField sx={{ flex: 1 }} label="Outros" disabled={isView || formData.transportadora !== 'Outros'} value={formData.transportadoraManual} onChange={(e)=>setFormData({...formData, transportadoraManual:e.target.value})} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Placa</InputLabel><Select label="Placa" value={formData.placa} onChange={(e)=>setFormData({...formData, placa:e.target.value as string})} MenuProps={menuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                    <TextField sx={{ flex: 1 }} label="Outros" disabled={isView || formData.placa !== 'Outros'} value={formData.placaManual} onChange={(e)=>setFormData({...formData, placaManual:maskPlaca(e.target.value)})} />
                  </Box>
                </>
              )}

              {formData.atividade === 'Entrega de dejetos' && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Cooperado</InputLabel><Select label="Cooperado" value={formData.cooperado} MenuProps={menuProps} onChange={(e)=>setFormData({...formData, cooperado:e.target.value as string})}><MenuItem value="Coop 01">Coop 01</MenuItem></Select></FormControl>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo" value={formData.tipoVeiculo} MenuProps={menuProps} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <TextField sx={{ flex: 1 }} label="Peso Inicial" disabled={isView} value={formData.pesoInicial} onChange={(e)=>setFormData({...formData, pesoInicial:e.target.value})} />
                    <TextField sx={{ flex: 1 }} label="Peso Final" disabled={isView} value={formData.pesoFinal} onChange={(e)=>setFormData({...formData, pesoFinal:e.target.value})} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px', pt: 2 }}>
                    {/* 🛡️ DATA SAÍDA: RESTRIÇÃO APLICADA */}
                    <Box sx={{ flex: 1 }}><DatePicker label="Data de saída" format="dd/MM/yyyy" value={formData.dataSaida} disabled={isView} disableFuture={isAdd} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true, placeholder: 'DD/MM/AAAA' } }} onChange={(v)=>setFormData({...formData, dataSaida:v})}/></Box>
                    
                    {/* 🛡️ HORA SAÍDA: RESTRIÇÃO APLICADA */}
                    <Box sx={{ flex: 1 }}><TimePicker label="Horário de saída" ampm={false} value={formData.horarioSaida} disabled={isView} maxTime={isAdd && formData.dataSaida && isToday(formData.dataSaida) ? addMinutes(new Date(), 10) : undefined} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }} onChange={(v)=>setFormData({...formData, horarioSaida:v})}/></Box>
                  </Box>
                </>
              )}

              {formData.atividade === 'Entrega de Insumo' && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                  <TextField sx={{ flex: 1 }} label="Empresa" disabled={isView} value={formData.empresa} onChange={(e)=>setFormData({...formData, empresa:e.target.value})} />
                  <TextField sx={{ flex: 1 }} label="Nota Fiscal" disabled={isView} value={formData.notaFiscal} onChange={(e)=>setFormData({...formData, notaFiscal:e.target.value})} />
                </Box>
              )}

              {formData.atividade === 'Expedição' && (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                  <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo" value={formData.tipoVeiculo} MenuProps={menuProps} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})}><MenuItem value="Caminhão">Caminhão</MenuItem><MenuItem value="Van">Van</MenuItem></Select></FormControl>
                  <TextField sx={{ flex: 1 }} label="Nota Fiscal" disabled={isView} value={formData.notaFiscal} onChange={(e)=>setFormData({...formData, notaFiscal:e.target.value})} />
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                <TextField sx={{ flex: 1 }} label={formData.atividade === 'Visita' ? "Nome do Visitante" : "Motorista"} disabled={isView} value={formData.motorista} onChange={(e)=>setFormData({...formData, motorista:e.target.value})} />
                <TextField sx={{ flex: 1 }} label="CPF/Passaporte" disabled={isView} value={(isView || isEdit) ? applyLGPDMask(formData.cpfPassaporte) : formData.cpfPassaporte} onChange={(e)=>setFormData({...formData, cpfPassaporte:maskCPF(e.target.value)})} />
              </Box>

              {formData.atividade === 'Visita' && (
                <>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo" value={formData.tipoVeiculo} MenuProps={menuProps} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})}><MenuItem value="Carro">Carro</MenuItem><MenuItem value="Moto">Moto</MenuItem></Select></FormControl>
                    <TextField sx={{ flex: 1 }} label="Placa" disabled={isView} value={formData.placaManual} onChange={(e)=>setFormData({...formData, placaManual:maskPlaca(e.target.value)})} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px' }}>
                    <FormControl sx={{ flex: 1 }} disabled={isView}><InputLabel>Motivo</InputLabel><Select label="Motivo" value={formData.motivo} MenuProps={menuProps} onChange={(e)=>setFormData({...formData, motivo:e.target.value as string})}><MenuItem value="Reunião">Reunião</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                    <TextField sx={{ flex: 1 }} label="Outros" disabled={isView || formData.motivo !== 'Outros'} value={formData.motivoManual} onChange={(e)=>setFormData({...formData, motivoManual:e.target.value})} />
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {!isView && (
          <Box sx={{ minHeight: 104, width: '100%', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', px: '20px', py: { xs: 2, sm: 0 }, gap: '20px' }}>
            <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED }}>CANCELAR</Button>
            <Button variant="contained" onClick={() => onSave(formData)} disabled={!formData.atividade} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>SALVAR</Button>
          </Box>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;