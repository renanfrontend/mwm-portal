import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, TextField, Button, MenuItem, FormControl, InputLabel, Select, Divider } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const maskCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").substring(0, 14);
const maskPlaca = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 7).replace(/^([A-Z]{3})([0-9])/, "$1-$2");
const applyLGPDMask = (cpf: string) => (cpf && cpf.length >= 14) ? `***.${cpf.split(/[.-]/)[1]}.***-**` : cpf;

interface PortariaFormData {
  id?: string;
  data: Date | null;
  horario: Date | null;
  atividade: string;
  transportadora: string;
  transportadoraManual: string;
  placa: string;
  placaManual: string;
  cooperado: string;
  tipoVeiculo: string;
  motorista: string;
  cpfPassaporte: string;
  pesoInicial: string;
  pesoFinal: string;
  dataSaida: Date | null;
  horarioSaida: Date | null;
  empresa: string;
  notaFiscal: string;
  motivo: string;
  motivoManual: string;
  nome?: string;
}

const getInitialState = (): PortariaFormData => ({
  data: new Date(), horario: new Date(), atividade: '', transportadora: '', transportadoraManual: '',
  placa: '', placaManual: '', cooperado: '', tipoVeiculo: '', motorista: '', cpfPassaporte: '',
  pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null, empresa: '', notaFiscal: '',
  motivo: '', motivoManual: ''
});

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [formData, setFormData] = useState<PortariaFormData>(getInitialState());

  useEffect(() => { 
    if (open) {
      if (initialData) {
        const [d, m, y] = initialData.data?.split('/').map(Number) || [];
        const [hh, mm] = initialData.hora?.split(':').map(Number) || [];
        setFormData({
          ...initialData,
          motorista: initialData.nome,
          data: d ? new Date(y, m - 1, d) : new Date(),
          horario: hh !== undefined ? new Date(2026, 1, 1, hh, mm) : new Date()
        });
      } else { setFormData(getInitialState()); }
    }
  }, [open, initialData]);

  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const isLocked = isView || isEdit; // Bloqueia apenas os 3 primeiros campos
  
  const menuProps = { disablePortal: true, PaperProps: { sx: { zIndex: 10000, '& .MuiMenuItem-root': { fontFamily: SCHIBSTED } } } };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none' } }}>
        <Box sx={{ minHeight: 148, px: '20px', pt: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box><Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, color: 'black', mt: 1, fontFamily: SCHIBSTED }}>{isView ? 'Informações do registro selecionado.' : 'Preencha corretamente os campos abaixo para efetuar o cadastro.'}</Typography></Box>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '120px', '& .MuiInputLabel-root': { overflow: 'visible' } }}>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Box sx={{ width: 280 }}><DatePicker label="Data" value={formData.data} disabled={isLocked} disableFuture onChange={(v: Date | null)=>setFormData({...formData, data:v})} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }}/></Box>
            <Box sx={{ width: 280 }}><TimePicker label="Horário" ampm={false} disabled={isLocked} value={formData.horario} onChange={(v: Date | null)=>setFormData({...formData, horario:v})} slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }}/></Box>
          </Box>

          <Box sx={{ width: 580 }}>
            <FormControl fullWidth disabled={isLocked}><InputLabel>Atividades a realizar</InputLabel>
              <Select value={formData.atividade} label="Atividades a realizar" onChange={(e)=>setFormData({...formData, atividade:e.target.value as string})} MenuProps={menuProps}>
                <MenuItem value="Abastecimento">Abastecimento</MenuItem><MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem>
                <MenuItem value="Entrega de Insumo">Entrega de Insumo</MenuItem><MenuItem value="Expedição">Expedição</MenuItem><MenuItem value="Visita">Visita</MenuItem>
              </Select></FormControl>
          </Box>

          {formData.atividade && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <Divider /><Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>INFORMAÇÕES</Typography>

              {formData.atividade === 'Entrega de dejetos' && (
                <>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Transportadora</InputLabel><Select label="Transportadora" value={formData.transportadora} onChange={(e)=>setFormData({...formData, transportadora:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Jadlog">Jadlog</MenuItem></Select></FormControl>
                    <TextField sx={{ width: 280 }} label="Outros" disabled={isView || formData.transportadora !== 'Outros'} value={formData.transportadoraManual} onChange={(e)=>setFormData({...formData, transportadoraManual:e.target.value})} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Placa</InputLabel><Select label="Placa" value={formData.placa} onChange={(e)=>setFormData({...formData, placa:e.target.value as string})} MenuProps={menuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem></Select></FormControl>
                    <TextField sx={{ width: 280 }} label="Outros" disabled={isView || formData.placa !== 'Outros'} value={formData.placaManual} onChange={(e)=>setFormData({...formData, placaManual:maskPlaca(e.target.value)})} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Cooperado</InputLabel><Select label="Cooperado" value={formData.cooperado} onChange={(e)=>setFormData({...formData, cooperado:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Coop 01">Coop 01</MenuItem></Select></FormControl>
                    <FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo de veículo" value={formData.tipoVeiculo} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <TextField sx={{ width: 280 }} label="Motorista" disabled={isView} value={formData.motorista} onChange={(e)=>setFormData({...formData, motorista:e.target.value})} />
                    <TextField sx={{ width: 280 }} label="CPF/Passaporte" disabled={isView} value={(isView || isEdit) ? applyLGPDMask(formData.cpfPassaporte) : formData.cpfPassaporte} onChange={(e)=>setFormData({...formData, cpfPassaporte:maskCPF(e.target.value)})} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <TextField sx={{ width: 280 }} label="Peso inicial" disabled={isView} value={formData.pesoInicial} onChange={(e)=>setFormData({...formData, pesoInicial:e.target.value})} />
                    <TextField sx={{ width: 280 }} label="Peso final" disabled={isView} value={formData.pesoFinal} onChange={(e)=>setFormData({...formData, pesoFinal:e.target.value})} />
                  </Box>
                  {/* 🛡️ FIX Z-INDEX: Data e Hora de saída agora com Popper fixo */}
                  <Box sx={{ display: 'flex', gap: '20px', pt: 2 }}>
                    <Box sx={{ width: 280 }}>
                      <DatePicker label="Data de saída" value={formData.dataSaida} disabled={isView} 
                        onChange={(v: Date | null)=>setFormData({...formData, dataSaida:v})}
                        slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }}/>
                    </Box>
                    <Box sx={{ width: 280 }}>
                      <TimePicker label="Horário de saída" ampm={false} disabled={isView} 
                        onChange={(v: Date | null)=>setFormData({...formData, horarioSaida:v})}
                        slotProps={{ popper: { sx: { zIndex: 10000 } }, textField: { fullWidth: true } }}/>
                    </Box>
                  </Box>
                </>
              )}

              {/* OUTRAS CATEGORIAS (PRESERVADAS) */}
              {formData.atividade === 'Abastecimento' && (
                <>
                  <Box sx={{ display: 'flex', gap: '20px' }}><FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Transportadora</InputLabel><Select label="Transportadora" value={formData.transportadora} onChange={(e)=>setFormData({...formData, transportadora:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Jadlog">Jadlog</MenuItem></Select></FormControl>
                  <TextField sx={{ width: 280 }} label="Outros" disabled={isView || formData.transportadora !== 'Outros'} value={formData.transportadoraManual} onChange={(e)=>setFormData({...formData, transportadoraManual:e.target.value})} /></Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}><FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Placa</InputLabel><Select label="Placa" value={formData.placa} onChange={(e)=>setFormData({...formData, placa:e.target.value as string})} MenuProps={menuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem></Select></FormControl>
                  <TextField sx={{ width: 280 }} label="Outros" disabled={isView || formData.placa !== 'Outros'} value={formData.placaManual} onChange={(e)=>setFormData({...formData, placaManual:maskPlaca(e.target.value)})} /></Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}><FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo de veículo" value={formData.tipoVeiculo} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Van">Van</MenuItem></Select></FormControl>
                  <TextField sx={{ width: 280 }} label="Motorista" disabled={isView} value={formData.motorista} onChange={(e)=>setFormData({...formData, motorista:e.target.value})} /></Box>
                  <TextField sx={{ width: 580 }} label="CPF/Passaporte" disabled={isView} value={(isView || isEdit) ? applyLGPDMask(formData.cpfPassaporte) : formData.cpfPassaporte} onChange={(e)=>setFormData({...formData, cpfPassaporte:maskCPF(e.target.value)})} />
                </>
              )}

              {formData.atividade === 'Visita' && (
                <>
                  <Box sx={{ display: 'flex', gap: '20px' }}><TextField sx={{ width: 280 }} label="Nome do Visitante" disabled={isView} value={formData.motorista} onChange={(e)=>setFormData({...formData, motorista:e.target.value})} />
                  <TextField sx={{ width: 280 }} label="CPF/Passaporte" disabled={isView} value={(isView || isEdit) ? applyLGPDMask(formData.cpfPassaporte) : formData.cpfPassaporte} onChange={(e)=>setFormData({...formData, cpfPassaporte:maskCPF(e.target.value)})} /></Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}><FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Tipo de veículo</InputLabel><Select label="Tipo de veículo" value={formData.tipoVeiculo} onChange={(e)=>setFormData({...formData, tipoVeiculo:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Carro">Carro</MenuItem></Select></FormControl>
                  <TextField sx={{ width: 280 }} label="Placa" disabled={isView} value={formData.placaManual} onChange={(e)=>setFormData({...formData, placaManual:maskPlaca(e.target.value)})} /></Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}><FormControl sx={{ width: 280 }} disabled={isView}><InputLabel>Motivo</InputLabel><Select label="Motivo" value={formData.motivo} onChange={(e)=>setFormData({...formData, motivo:e.target.value as string})} MenuProps={menuProps}><MenuItem value="Reunião">Reunião</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                  <TextField sx={{ width: 280 }} label="Outros" disabled={isView || formData.motivo !== 'Outros'} value={formData.motivoManual} onChange={(e)=>setFormData({...formData, motivoManual:e.target.value})} /></Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {!isView && (
          <Box sx={{ minHeight: 104, width: '100%', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', px: '20px', gap: '20px' }}>
            <Button variant="outlined" onClick={onClose} sx={{ width: 280, height: 48, fontFamily: SCHIBSTED }}>CANCELAR</Button>
            <Button variant="contained" onClick={() => onSave(formData)} disabled={!formData.atividade || !formData.motorista} sx={{ width: 280, height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>SALVAR</Button>
          </Box>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;