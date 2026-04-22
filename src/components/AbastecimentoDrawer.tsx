import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Close as CloseIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

import SignatureCanvas from 'react-signature-canvas';
import { TransportadoraService } from '../services/transportadoraService';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';
const VEICULOS_PADRAO = ['Caminhão Toco', 'Caminhão Truck', 'Caminhão VUC', 'Caminhão Carreta', 'Caminhão Bitrem', 'Caminhão Rodotrem'];
const globalMenuProps = { style: { zIndex: 10000 } };

// ============================================================================
// FUNÇÕES AUXILIARES & ESTILOS COMUNS
// ============================================================================
const parseDateBR = (str: string | null) => {
  if (!str) return null;
  if (typeof str === 'string' && str.includes('/')) {
    const [d, m, y] = str.split('/');
    return dayjs(`${y}-${m}-${d}`);
  }
  return dayjs(str);
};

const fieldStyle = (disabled?: boolean) => ({
  '& .MuiOutlinedInput-root': { 
    fontFamily: SCHIBSTED, fontSize: 16, 
    '& fieldset': { borderColor: disabled ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.23)' } 
  },
  '& .MuiInputLabel-root': { 
    fontFamily: SCHIBSTED, fontSize: 16, 
    color: disabled ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.60)', 
    '&.Mui-focused': { color: PRIMARY_BLUE } 
  },
  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(0, 0, 0, 0.40)' }
});

const calendarSlotProps: any = {
  popper: { sx: { zIndex: 10000 } }, actionBar: { actions: [] }, 
  desktopPaper: { sx: { borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', bgcolor: 'white', boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' } },
  day: { sx: { fontFamily: SCHIBSTED, fontSize: '14px', width: '36px', height: '36px', borderRadius: '100px', color: 'rgba(0,0,0,0.87)', '&.Mui-selected': { bgcolor: `${PRIMARY_BLUE} !important`, color: 'white', fontWeight: 400 }, '&.Mui-disabled': { color: 'rgba(0,0,0,0.4)' }, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } } },
  calendarHeader: { sx: { '& .MuiPickersCalendarHeader-label': { fontFamily: SCHIBSTED, fontWeight: 500, color: 'black' }, '& .MuiDayCalendar-weekDayLabel': { fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', fontSize: '14px', width: '36px', height: '36px' } } },
  textField: { InputLabelProps: { shrink: true } }
};

const timePickerSlotProps: any = {
  popper: { sx: { zIndex: 10000 } }, actionBar: { actions: [] },
  desktopPaper: { sx: { borderRadius: '8px', border: '1px solid rgba(0,0,0,0.12)', bgcolor: 'white', boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)', '& .MuiMenuItem-root': { fontFamily: SCHIBSTED, fontSize: '14px', minHeight: '40px', justifyContent: 'center', '&.Mui-selected': { bgcolor: `${PRIMARY_BLUE} !important`, color: 'white' } } } },
  textField: { InputLabelProps: { shrink: true } }
};

// ============================================================================
// 1. SUBCOMPONENTE: STEP CADASTRO/EDIÇÃO E VISUALIZAÇÃO
// ============================================================================
const StepCadastro = ({ form, setForm, isFieldDisabled, transportadoras, veiculosDisponiveis, mode, isAutomation, handleMaskM3 }: any) => {
  
  if (mode === 'edit' || mode === 'view') {
    return (
      <>
        <FormControl fullWidth sx={fieldStyle(true)} disabled={true}>
          <InputLabel>Cliente</InputLabel>
          <Select label="Cliente" value={form.cliente || ''} onChange={e => setForm({...form, cliente: e.target.value, placa: '', veiculo: ''})} MenuProps={globalMenuProps}>
            <MenuItem value={form.cliente}>{form.cliente}</MenuItem>
          </Select>
        </FormControl>
        
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle(true)} disabled={true}>
            <InputLabel>Placa</InputLabel>
            <Select label="Placa" value={form.placa || ''} MenuProps={globalMenuProps}>
              <MenuItem value={form.placa}>{form.placa}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={fieldStyle(true)} disabled={true}>
            <InputLabel>Tipo de veículo</InputLabel>
            <Select label="Tipo de veículo" value={form.veiculo || ''} MenuProps={globalMenuProps}>
              <MenuItem value={form.veiculo}>{form.veiculo}</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Tipo de carga" placeholder="Biometano" value={form.carga || 'Biometano'} sx={fieldStyle(true)} disabled={true} />
          <TextField 
            fullWidth 
            label="Odômetro" 
            placeholder="0" 
            type="number" 
            inputProps={{ maxLength: 7 }} 
            value={form.odometro} 
            onChange={e => setForm({...form, odometro: e.target.value.replace(/\D/g, '').substring(0, 7)})} 
            disabled={isFieldDisabled('odometro')} 
            sx={fieldStyle(isFieldDisabled('odometro'))} 
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth 
            label="Pressão inicial" 
            placeholder="0" 
            type="number" 
            inputProps={{ maxLength: 4 }} 
            value={form.pressaoInicial} 
            onChange={e => setForm({...form, pressaoInicial: e.target.value.replace(/\D/g, '').substring(0, 4)})} 
            disabled={isFieldDisabled('pressaoInicial')} 
            sx={fieldStyle(isFieldDisabled('pressaoInicial'))} 
          />
          <TextField 
            fullWidth 
            label="Pressão final" 
            placeholder="0" 
            type="number" 
            inputProps={{ maxLength: 4 }} 
            value={form.pressaoFinal} 
            onChange={e => setForm({...form, pressaoFinal: e.target.value.replace(/\D/g, '').substring(0, 4)})} 
            disabled={isFieldDisabled('pressaoFinal')} 
            sx={fieldStyle(isFieldDisabled('pressaoFinal'))} 
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth 
            label="Volume abastecido" 
            placeholder="0m³" 
            value={form.volumeAbastecido} 
            sx={fieldStyle(true)} 
            disabled={true}
          />
          <FormControl fullWidth sx={fieldStyle(true)} disabled={true}>
            <InputLabel>Frentista</InputLabel>
            <Select label="Frentista" value={form.frentista} MenuProps={globalMenuProps}>
              <MenuItem value={form.frentista}>{form.frentista}</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <DesktopDatePicker label="Data" value={form.dataInicial} disabled format="DD/MM/YYYY" sx={{ width: '100%', ...fieldStyle(true) }} slotProps={calendarSlotProps} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <DesktopTimePicker label="Horário inicial" value={form.horaInicial} disabled ampm={false} format="HH:mm:ss" sx={{ width: '100%', ...fieldStyle(true) }} slotProps={timePickerSlotProps} />
          <DesktopTimePicker label="Horário final" value={form.horaFinal} disabled ampm={false} format="HH:mm:ss" sx={{ width: '100%', ...fieldStyle(true) }} slotProps={timePickerSlotProps} />
        </Stack>
      </>
    );
  }

  return (
    <>
      <FormControl fullWidth sx={fieldStyle(false)} disabled={false}>
        <InputLabel>Cliente</InputLabel>
        <Select label="Cliente" value={form.cliente || ''} onChange={e => setForm({...form, cliente: e.target.value, placa: '', veiculo: ''})} MenuProps={globalMenuProps}>
          {transportadoras.map((t: any) => (<MenuItem key={t.id || t.nomeFantasia} value={t.nomeFantasia || t.razaoSocial}>{t.nomeFantasia || t.razaoSocial}</MenuItem>))}
          {form.cliente && !transportadoras.some((t:any) => (t.nomeFantasia || t.razaoSocial) === form.cliente) && (<MenuItem value={form.cliente} sx={{ display: 'none' }}>{form.cliente}</MenuItem>)}
        </Select>
      </FormControl>
      
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth sx={fieldStyle(!form.cliente)} disabled={!form.cliente}>
          <InputLabel>Placa</InputLabel>
          <Select label="Placa" value={form.placa || ''} onChange={e => { const vInfo = veiculosDisponiveis.find((v:any) => v.placa === e.target.value); setForm({...form, placa: e.target.value, veiculo: vInfo?.tipoVeiculo || vInfo?.tipo || form.veiculo }); }} MenuProps={globalMenuProps}>
            {veiculosDisponiveis.map((v: any) => (<MenuItem key={v.id || v.placa} value={v.placa}>{v.placa}</MenuItem>))}
            {form.placa && !veiculosDisponiveis.some((v:any) => v.placa === form.placa) && (<MenuItem value={form.placa} sx={{ display: 'none' }}>{form.placa}</MenuItem>)}
          </Select>
        </FormControl>

        <TextField fullWidth label="Pressão inicial" placeholder="0" type="number" inputProps={{ maxLength: 4 }} value={form.pressaoInicial} onChange={e => setForm({...form, pressaoInicial: e.target.value.replace(/\D/g, '').substring(0, 4)})} disabled={false} sx={fieldStyle(false)} />
      </Stack>
      
      <FormControl fullWidth sx={fieldStyle(false)} disabled={false}>
        <InputLabel>Tipo de veículo</InputLabel>
        <Select label="Tipo de veículo" value={form.veiculo || ''} onChange={e => setForm({...form, veiculo: e.target.value})} MenuProps={globalMenuProps}>
          {VEICULOS_PADRAO.map(tipo => (<MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>))}
          {form.veiculo && !VEICULOS_PADRAO.includes(form.veiculo) && (<MenuItem value={form.veiculo} sx={{ display: 'none' }}>{form.veiculo}</MenuItem>)}
        </Select>
      </FormControl>
      
      <Stack direction="row" spacing={2}>
        <TextField fullWidth label="Odômetro" placeholder="0" type="number" inputProps={{ maxLength: 7 }} value={form.odometro} onChange={e => setForm({...form, odometro: e.target.value.replace(/\D/g, '').substring(0, 7)})} disabled={false} sx={fieldStyle(false)} />
        <FormControl fullWidth sx={fieldStyle(false)} disabled={false}>
          <InputLabel>Frentista</InputLabel>
          <Select label="Frentista" value={form.frentista} onChange={e => setForm({...form, frentista: e.target.value})} MenuProps={globalMenuProps}>
            <MenuItem value="João Carlos">João Carlos</MenuItem><MenuItem value="Mário Silva">Mário Silva</MenuItem><MenuItem value="Roberto Dias">Roberto Dias</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      
      <Stack direction="row" spacing={2}>
        <DesktopDatePicker label="Data" disableFuture value={form.dataInicial} onChange={(val) => setForm({...form, dataInicial: val})} disabled={false} format="DD/MM/YYYY" sx={{ width: '100%', ...fieldStyle(false) }} slotProps={calendarSlotProps} />
        <DesktopTimePicker label="Horário inicial" disableFuture value={form.horaInicial} onChange={(val) => setForm({...form, horaInicial: val})} disabled={false} ampm={false} format="HH:mm:ss" sx={{ width: '100%', ...fieldStyle(false) }} slotProps={timePickerSlotProps} />
      </Stack>
    </>
  );
};

// ============================================================================
// 2. SUBCOMPONENTE: STEP CONCLUSÃO
// ============================================================================
const StepConclusao = ({ form, setForm, isFieldDisabled, isAutomation, handleMaskM3 }: any) => {
  if (isAutomation) {
    return (
      <>
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Pressão inicial" placeholder="0" type="number" inputProps={{ maxLength: 4 }} value={form.pressaoInicial} onChange={e => setForm({...form, pressaoInicial: e.target.value.replace(/\D/g, '').substring(0, 4)})} sx={fieldStyle(isFieldDisabled('pressaoInicial'))} disabled={isFieldDisabled('pressaoInicial')} />
          <TextField fullWidth label="Pressão final" placeholder="0" type="number" inputProps={{ maxLength: 4 }} value={form.pressaoFinal} onChange={e => setForm({...form, pressaoFinal: e.target.value.replace(/\D/g, '').substring(0, 4)})} sx={fieldStyle(isFieldDisabled('pressaoFinal'))} disabled={isFieldDisabled('pressaoFinal')} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Volume abastecido" placeholder="0m³" value={form.volumeAbastecido} onChange={e => setForm({...form, volumeAbastecido: handleMaskM3(e.target.value)})} sx={fieldStyle(isFieldDisabled('volumeAbastecido'))} disabled={isFieldDisabled('volumeAbastecido')} />
          <TextField fullWidth label="Odômetro" placeholder="0" type="number" inputProps={{ maxLength: 7 }} value={form.odometro} onChange={e => setForm({...form, odometro: e.target.value.replace(/\D/g, '').substring(0, 7)})} sx={fieldStyle(isFieldDisabled('odometro'))} disabled={isFieldDisabled('odometro')} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <DesktopTimePicker label="Horário inicial" disableFuture value={form.horaInicial} onChange={(val) => setForm({...form, horaInicial: val})} ampm={false} format="HH:mm:ss" sx={{ width: '50%', ...fieldStyle(isFieldDisabled('horaInicial')) }} slotProps={timePickerSlotProps} disabled={isFieldDisabled('horaInicial')} />
        </Stack>
      </>
    );
  }
  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField fullWidth label="Pressão final" placeholder="0" type="number" inputProps={{ maxLength: 4 }} value={form.pressaoFinal} onChange={e => setForm({...form, pressaoFinal: e.target.value.replace(/\D/g, '').substring(0, 4)})} sx={fieldStyle(isFieldDisabled('pressaoFinal'))} disabled={isFieldDisabled('pressaoFinal')} />
        <TextField fullWidth label="Volume abastecido" placeholder="0m³" value={form.volumeAbastecido} onChange={e => setForm({...form, volumeAbastecido: handleMaskM3(e.target.value)})} sx={fieldStyle(isFieldDisabled('volumeAbastecido'))} disabled={isFieldDisabled('volumeAbastecido')} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <DesktopTimePicker label="Horário final" disableFuture value={form.horaFinal} onChange={(val) => setForm({...form, horaFinal: val})} ampm={false} format="HH:mm:ss" sx={{ width: '100%', ...fieldStyle(isFieldDisabled('horaFinal')) }} slotProps={timePickerSlotProps} disabled={isFieldDisabled('horaFinal')} />
      </Stack>
    </>
  );
};

// ============================================================================
// 3. SUBCOMPONENTE: STEP ASSINATURA
// ============================================================================
const StepAssinatura = ({ isReadOnly, isSigned, setIsSigned, sigCanvas, form, mt = 0 }: any) => (
  <Box sx={{ width: '100%', height: 256, bgcolor: '#FAFAFA', border: '1px solid rgba(0,0,0,0.25)', borderRadius: '4px', position: 'relative', mt }}>
    <Typography sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontSize: 12, color: 'rgba(0,0,0,0.6)', fontFamily: SCHIBSTED, zIndex: 10 }}>
      Assinatura do motorista
    </Typography>
    {!isSigned && !isReadOnly && (
      <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(0,0,0,0.3)', pointerEvents: 'none', fontFamily: SCHIBSTED }}>
        Assine aqui com o mouse ou dedo
      </Typography>
    )}
    <Box sx={{ width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
      {isReadOnly ? (
        <Box component="img" src={form.assinaturaBase64 || "https://placehold.co/553x118?text=Assinatura+Realizada"} sx={{ width: '100%', height: '100%', objectFit: 'contain', opacity: form.assinaturaBase64 ? 1 : 0.5 }} />
      ) : (
        <SignatureCanvas ref={sigCanvas} penColor="black" backgroundColor="rgba(255,255,255,1)" canvasProps={{ style: { width: '100%', height: '100%', cursor: 'crosshair' } }} onEnd={() => setIsSigned(true)} />
      )}
    </Box>
  </Box>
);

// ============================================================================
// SMART COMPONENT: ORQUESTRADOR PRINCIPAL
// ============================================================================
interface AbastecimentoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any, mode: string) => void;
  mode?: 'create' | 'edit' | 'view' | 'concluir' | 'assinar';
  initialData?: any;
}

export const AbastecimentoDrawer: React.FC<AbastecimentoDrawerProps> = ({ open, onClose, onSave, mode = 'create', initialData = null }) => {
  const [form, setForm] = useState<any>({
    cliente: '', placa: '', pressaoInicial: '', odometro: '', frentista: '', dataInicial: null, horaInicial: null,
    pressaoFinal: '', volumeAbastecido: '', final: '', dataFinal: null, horaFinal: null, veiculo: '', assinaturaBase64: '', carga: ''
  });

  const [isSigningStep, setIsSigningStep] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [transportadoras, setTransportadoras] = useState<any[]>([]);
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState<any[]>([]);
  const sigCanvas = useRef<any>(null);

  const isAutomation = initialData?.exec === 'Automação';
  const isReadOnly = mode === 'view';

  const isFieldDisabled = (fieldName: string) => {
    if (isReadOnly) return true;
    if (mode === 'edit') {
      if (!['pressaoInicial', 'pressaoFinal', 'odometro'].includes(fieldName)) return true;
    }
    if (mode === 'concluir') {
      if (['cliente', 'placa', 'veiculo', 'frentista', 'dataInicial', 'final', 'dataFinal'].includes(fieldName)) return true;
      if (isAutomation && ['volumeAbastecido'].includes(fieldName)) return true;
    }
    return false;
  };

  useEffect(() => {
    if (open) {
      setIsSigningStep(mode === 'assinar');
      setIsSigned(false); 
      if (sigCanvas.current) sigCanvas.current.clear();
      
      if (mode !== 'create' && initialData) {
        setForm({
          ...form, ...initialData,
          dataInicial: parseDateBR(initialData.dataInicial) || dayjs(),
          horaInicial: initialData.horaInicial ? dayjs(`2000-01-01T${initialData.horaInicial}`) : dayjs(),
          pressaoFinal: initialData.pressaoFinal || '',
          volumeAbastecido: initialData.volumeAbastecido || (isAutomation ? '50m³' : ''),
          dataFinal: parseDateBR(initialData.dataFinal) || (mode === 'view' ? parseDateBR('13/03/2026') : null),
          horaFinal: initialData.horaFinal ? dayjs(`2000-01-01T${initialData.horaFinal}`) : (mode === 'view' ? dayjs('2000-01-01T13:00:00') : null),
        });
      } else {
        setForm({ cliente: '', placa: '', veiculo: '', pressaoInicial: '', odometro: '', frentista: '', dataInicial: dayjs(), horaInicial: dayjs(), pressaoFinal: '', volumeAbastecido: '', final: '', dataFinal: null, horaFinal: null, assinaturaBase64: '', carga: '' });
      }

      const fetchTransportadoras = async () => {
        try {
          const res: any = await TransportadoraService.list(1, 100);
          let list = Array.isArray(res) ? res : (res?.content || res?.items || res?.data || []);
          if(list.length === 0) throw new Error("Vazio");
          setTransportadoras(list);
        } catch (error) { 
          setTransportadoras([
            { id: 1, nomeFantasia: 'Agrocampo' },
            { id: 2, nomeFantasia: 'Primato' },
            { id: 3, nomeFantasia: 'Bioplanta' }
          ]);
        }
      };
      fetchTransportadoras();
    }
  }, [open, mode, initialData]);

  useEffect(() => {
    const fetchVeiculos = async () => {
      if (!form.cliente) { setVeiculosDisponiveis([]); return; }
      
      const transportadora = transportadoras.find(t => (t.nomeFantasia || t.razaoSocial) === form.cliente);
      const mockPlacas = [
        { id: 1, placa: 'XBH-3M89', tipoVeiculo: 'Caminhão Truck' },
        { id: 2, placa: 'HGD-5R72', tipoVeiculo: 'Caminhão Rodotrem' },
        { id: 3, placa: 'LSN-8M13', tipoVeiculo: 'Caminhão Bitrem' },
        { id: 4, placa: 'ABC-1234', tipoVeiculo: 'Caminhão Toco' }
      ];

      if (transportadora?.id) {
        try {
          const details: any = await TransportadoraService.getById(transportadora.id);
          let frota = Array.isArray(details) ? details : (details?.veiculos || details?.frota || details?.data?.veiculos || []);
          if(frota.length === 0) frota = mockPlacas;
          setVeiculosDisponiveis(frota);
        } catch (error) { setVeiculosDisponiveis(mockPlacas); }
      } else {
        setVeiculosDisponiveis(mockPlacas);
      }
    };
    fetchVeiculos();
  }, [form.cliente, transportadoras]);

  const handleSaveClick = () => {
    if (mode === 'concluir' && !isAutomation && form.dataInicial && form.dataFinal && form.horaInicial && form.horaFinal) {
      try {
        const dIni = typeof form.dataInicial === 'string' ? parseDateBR(form.dataInicial) : form.dataInicial;
        const dFim = typeof form.dataFinal === 'string' ? parseDateBR(form.dataFinal) : form.dataFinal;
        const hIni = typeof form.horaInicial === 'string' ? dayjs(`2000-01-01T${form.horaInicial}`) : form.horaInicial;
        const hFim = typeof form.horaFinal === 'string' ? dayjs(`2000-01-01T${form.horaFinal}`) : form.horaFinal;
        
        if (dIni && dFim && hIni && hFim && dFim.isSame(dIni, 'day') && hFim.isBefore(hIni)) {
          alert("Regra de Negócio: O horário final não pode ser inferior ao horário inicial.");
          return;
        }
      } catch (e) {}
    }

    if (mode === 'concluir' && !isSigningStep) { setIsSigningStep(true); return; }

    let assinatura = form.assinaturaBase64 || '';
    if (isSigningStep && isSigned && sigCanvas.current) {
      try { assinatura = sigCanvas.current.getCanvas().toDataURL('image/png'); } catch (e) {}
    }

    const formatSafe = (val: any, fmt: string) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      return typeof val.format === 'function' ? val.format(fmt) : String(val);
    };

    onSave({
      ...form,
      dataInicial: formatSafe(form.dataInicial, 'DD/MM/YYYY'),
      horaInicial: formatSafe(form.horaInicial, 'HH:mm:ss'),
      dataFinal: formatSafe(form.dataFinal, 'DD/MM/YYYY'),
      horaFinal: formatSafe(form.horaFinal, 'HH:mm:ss'),
      assinaturaBase64: assinatura
    }, mode);
  };

  const handleMaskM3 = (val: string) => {
    const onlyNums = val.replace(/\D/g, '').substring(0, 4); 
    return onlyNums ? `${onlyNums}m³` : ''; 
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 9999 }} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', height: '100%', border: 'none', bgcolor: 'white' } }}>
        
        {/* HEADER */}
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1, textTransform: 'uppercase' }}>
              {isSigningStep ? 'Assinatura' : mode === 'concluir' ? 'Concluir Cadastro' : mode === 'view' ? 'Visualizar' : mode === 'edit' ? 'Editar' : 'Cadastro'}
            </Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED, color: 'black' }}>
              {isSigningStep ? 'Assine abaixo para validar as informações' : mode === 'edit' ? 'Atualize as informações do abastecimento conforme necessário.' : mode === 'view' ? 'Visualização completa do registro' : 'Preencha os dados do abastecimento'}
            </Typography>
          </Box>
        </Box>

        {/* BODY ORQUESTRADO */}
        <Box sx={{ flex: 1, px: '20px', pt: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
          
          {(mode === 'create' || mode === 'edit' || mode === 'view') && (
            <StepCadastro 
               form={form} 
               setForm={setForm} 
               isFieldDisabled={isFieldDisabled} 
               transportadoras={transportadoras} 
               veiculosDisponiveis={veiculosDisponiveis} 
               mode={mode} 
               isAutomation={isAutomation}
               handleMaskM3={handleMaskM3}
            />
          )}

          {mode === 'concluir' && !isSigningStep && (
            <StepConclusao 
               form={form} 
               setForm={setForm} 
               isFieldDisabled={isFieldDisabled} 
               isAutomation={isAutomation} 
               handleMaskM3={handleMaskM3} 
            />
          )}

          {(isReadOnly || isSigningStep || mode === 'edit') && (
            <StepAssinatura 
               isReadOnly={true} 
               isSigned={isSigned} 
               setIsSigned={setIsSigned} 
               sigCanvas={sigCanvas} 
               form={form} 
               mt={0} 
            />
          )}

        </Box>

        {/* ✅ FOOTER ESCONDIDO NO MODO VISUALIZAR */}
        {!isReadOnly && (
          <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
            <Button variant="outlined" onClick={isSigningStep ? (isSigned ? () => { sigCanvas.current?.clear(); setIsSigned(false); } : () => setIsSigningStep(false)) : onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: (isSigningStep && isSigned) ? PRIMARY_BLUE : 'rgba(0,0,0,0.25)', borderColor: (isSigningStep && isSigned) ? `${PRIMARY_BLUE}80` : 'rgba(0,0,0,0.1)', fontWeight: 500, textTransform: 'uppercase' }}>
              {(isSigningStep && isSigned) ? 'LIMPAR' : 'CANCELAR'}
            </Button>
            <Button variant="contained" onClick={handleSaveClick} fullWidth disabled={isSigningStep && !isSigned && mode !== 'edit'} sx={{ height: 48, bgcolor: (isSigningStep && !isSigned && mode !== 'edit') ? 'rgba(0,0,0,0.12)' : PRIMARY_BLUE, color: (isSigningStep && !isSigned && mode !== 'edit') ? 'rgba(0,0,0,0.26)' : 'white', fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase', boxShadow: (isSigningStep && isSigned) ? '0px 3px 1px -2px rgba(0,0,0,0.20), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' : 'none' }}>
              {isSigningStep ? 'FINALIZAR' : 'SALVAR'}
            </Button>
          </Box>
        )}

      </Drawer>
    </LocalizationProvider>
  );
};

export default AbastecimentoDrawer;