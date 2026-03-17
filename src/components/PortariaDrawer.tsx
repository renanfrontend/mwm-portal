import React, { useState, useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, Button, 
  MenuItem, FormControl, InputLabel, Select, Divider, Stack, Autocomplete, FormHelperText 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { parse, isToday, isSameDay, isAfter, startOfMinute } from 'date-fns';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';
const DENSIDADE_OPTIONS = Array.from({ length: 51 }, (_, i) => (1000 + i).toString());

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [form, setForm] = useState<any>({
    data: new Date(), horario: new Date(), atividade: '', transportadora: '', transportadoraManual: '', placa: '', placaManual: '',
    tipoVeiculo: '', motorista: '', cpf: '', pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null,
    cooperado: '', empresa: '', notaFiscal: '', visitante: '', motivo: '', motivoManual: '', densidade: '', status: 'Em andamento'
  });

  const [errors, setErrors] = useState<any>({});
  const [isCpfFocused, setIsCpfFocused] = useState(false);

  useEffect(() => {
    if (open) {
      setIsCpfFocused(false);
      setErrors({});
      if (initialData) {
        const parseDate = (d: any) => (d && typeof d === 'string' ? parse(d, 'dd/MM/yyyy', new Date()) : (d || null));
        const parseTime = (t: any) => (t && typeof t === 'string' ? parse(t, 'HH:mm', new Date()) : (t || null));
        setForm({ 
          ...initialData, 
          data: parseDate(initialData.data) || new Date(), 
          horario: parseTime(initialData.horario || initialData.hora) || new Date(), 
          dataSaida: parseDate(initialData.dataSaida), 
          horarioSaida: parseTime(initialData.horarioSaida),
          transportadora: initialData.transportadoraManual ? 'Outros' : (initialData.transportadora || ''),
          placa: initialData.placaManual ? 'Outros' : (initialData.placa || ''),
          motivo: initialData.motivoManual ? 'Outros' : (initialData.motivo || ''),
          status: initialData.status || 'Em andamento',
          densidade: initialData.densidade || ''
        });
      } else {
        setForm({ data: new Date(), horario: new Date(), atividade: '', transportadora: '', transportadoraManual: '', placa: '', placaManual: '', tipoVeiculo: '', motorista: '', cpf: '', pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null, cooperado: '', empresa: '', notaFiscal: '', visitante: '', motivo: '', motivoManual: '', densidade: '', status: 'Em andamento' });
      }
    }
  }, [open, initialData]);

  const layerProps = { slotProps: { popper: { sx: { zIndex: 16000 } } }, MenuProps: { sx: { zIndex: 16000 } } };
  const btnStyle = { height: 48, width: 280, fontSize: 15, fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase', borderRadius: '4px' };
  
  const fieldStyle = (fieldName?: string) => ({ 
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 }, 
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16, backgroundColor: 'white', px: '4px' },
    '& fieldset': { borderColor: fieldName && errors[fieldName] ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)' }
  });

  const isValidCPF = (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;
    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11; if (rest >= 10) rest = 0;
    if (rest !== parseInt(cleanCpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11; if (rest >= 10) rest = 0;
    return rest === parseInt(cleanCpf.substring(10, 11));
  };

  const validate = () => {
    let newErrors: any = {};
    if (!form.atividade) newErrors.atividade = "Campo obrigatório";
    if (!form.motorista && form.atividade !== 'Visita') newErrors.motorista = "Campo obrigatório";
    if (!form.visitante && form.atividade === 'Visita') newErrors.visitante = "Campo obrigatório";
    if (isToday(form.data) && isAfter(startOfMinute(form.horario), startOfMinute(new Date()))) newErrors.horario = "Hora Futura deve ser bloqueada";

    if (form.cpf) {
      const clean = form.cpf.replace(/\D/g, '');
      if (clean.length === 11) {
        if (!isValidCPF(clean)) newErrors.cpf = "CPF ou CNPJ inválido. Verifique os números e tente novamente. (MS-03)";
      } else if (form.cpf.length > 0 && !/^[A-Z]{2}\d{6}$/.test(form.cpf.toUpperCase())) {
        newErrors.cpf = "Número invalido (MS-02)";
      }
    } else { newErrors.cpf = "Campo obrigatório"; }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInternalSave = () => {
    if (validate()) {
      const finalForm = { ...form };
      if (finalForm.dataSaida && finalForm.horarioSaida) finalForm.status = 'Concluído';
      onSave(finalForm);
    }
  };

  const handleCpfChange = (value: string) => {
    const raw = value.toUpperCase().substring(0, 14);
    const onlyNums = raw.replace(/\D/g, "");
    if (onlyNums.length > 0 && /^\d+$/.test(raw.replace(/[.-]/g, ""))) {
      const masked = onlyNums.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").substring(0, 14);
      setForm({ ...form, cpf: masked });
    } else { setForm({ ...form, cpf: raw.substring(0, 8) }); }
  };

  const getCpfDisplayValue = (val: string) => {
    if (!val || mode === 'add' || isCpfFocused) return val;
    const nums = val.replace(/\D/g, '');
    return nums.length === 11 ? `***.${nums.substring(3, 6)}.***-**` : (val.length > 3 ? `***${val.slice(-3)}` : val);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }} sx={{ zIndex: 1400 }}>
        
        <Box sx={{ width: '100%', position: 'relative', pt: '24px', pb: '12px', px: '20px' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}><CloseIcon sx={{ color: 'rgba(0,0,0,0.54)' }} /></IconButton>
          <Box sx={{ pr: 8 }}>
            {/* ✅ TÍTULOS UPPERCASE */}
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>
               {mode === 'view' ? 'VISUALIZAÇÃO' : (mode === 'edit' ? 'EDIÇÃO' : 'CADASTRO')}
            </Typography>
            <Typography sx={{ fontSize: 16, color: 'black', fontFamily: SCHIBSTED, mt: 1 }}>Preencha corretamente os campos abaixo.</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Stack direction="row" spacing={2}>
            <DatePicker label="Data" value={form.data} disabled={mode === 'view'} maxDate={new Date()} onChange={v => setForm({...form, data: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} />
            <TimePicker label="Horário" value={form.horario} disabled={mode === 'view'} ampm={false} maxTime={isToday(form.data) ? new Date() : undefined} onChange={v => setForm({...form, horario: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle('horario'), error: !!errors.horario, helperText: errors.horario }, ...layerProps.slotProps }} />
          </Stack>

          <FormControl fullWidth sx={fieldStyle('atividade')} error={!!errors.atividade} disabled={mode === 'view' || mode === 'edit'}>
            <InputLabel>Atividades a realizar</InputLabel>
            <Select value={form.atividade} label="Atividades a realizar" onChange={e => setForm({...form, atividade: e.target.value})} MenuProps={layerProps.MenuProps}>
              <MenuItem value="Abastecimento">Abastecimento</MenuItem><MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem><MenuItem value="Entrega de insumo">Entrega de insumo</MenuItem><MenuItem value="Expedição">Expedição</MenuItem><MenuItem value="Visita">Visita</MenuItem>
            </Select>
            {errors.atividade && <FormHelperText>{errors.atividade}</FormHelperText>}
          </FormControl>
          <Divider sx={{ mt: -1 }} />

          {form.atividade && (
            <>
              <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER, color: 'black' }}>Informações</Typography>
              {form.atividade !== 'Visita' && (
                <>
                  {/* ✅ GRID 50/50 TRANSPORTADORA / PLACA */}
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Transportadora</InputLabel><Select value={form.transportadora} label="Transportadora" onChange={e => {
                        const v = e.target.value;
                        if (v === 'Outros') setForm({...form, transportadora: v, transportadoraManual: '', placa: 'Outros', placaManual: ''});
                        else setForm({...form, transportadora: v, transportadoraManual: '', placa: '', placaManual: ''});
                      }} MenuProps={layerProps.MenuProps}><MenuItem value="Jadlog">Jadlog</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {form.transportadora === 'Outros' ? (
                        <TextField fullWidth label="Outros" value={form.transportadoraManual} onChange={e => setForm({...form, transportadoraManual: e.target.value})} sx={fieldStyle()} disabled={mode === 'view'} />
                      ) : (
                        <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Placa</InputLabel><Select value={form.placa} label="Placa" onChange={e => setForm({...form, placa: e.target.value})} MenuProps={layerProps.MenuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                      )}
                    </Box>
                  </Stack>
                  {(form.transportadora === 'Outros' || form.placa === 'Outros') && (
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ flex: 1 }}>{form.transportadora === 'Outros' && <FormControl fullWidth sx={fieldStyle()} disabled={true}><InputLabel>Placa</InputLabel><Select value="Outros" label="Placa"><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>}</Box>
                      <Box sx={{ flex: 1 }}><TextField fullWidth label="Outros" value={form.placaManual} onChange={e => {
                        const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 7);
                        setForm({...form, placaManual: raw.length > 3 ? `${raw.substring(0, 3)}-${raw.substring(3)}` : raw});
                      }} sx={fieldStyle()} disabled={mode === 'view'} /></Box>
                    </Stack>
                  )}
                </>
              )}

              {form.atividade === 'Entrega de dejetos' && <TextField fullWidth label="Cooperado" value={form.cooperado} sx={fieldStyle()} disabled={mode === 'view'} onChange={e => setForm({...form, cooperado: e.target.value})} />}
              {form.atividade !== 'Visita' && (
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Tipo de veículo</InputLabel><Select value={form.tipoVeiculo} label="Tipo de veículo" onChange={e => setForm({...form, tipoVeiculo: e.target.value})} MenuProps={layerProps.MenuProps}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                  <TextField fullWidth label="Motorista" value={form.motorista} sx={fieldStyle('motorista')} disabled={mode === 'view'} error={!!errors.motorista} helperText={errors.motorista} inputProps={{ maxLength: 100 }} onChange={e => setForm({...form, motorista: e.target.value})} />
                </Stack>
              )}
              {form.atividade === 'Visita' && <TextField fullWidth label="Nome do Visitante" value={form.visitante} sx={fieldStyle('visitante')} disabled={mode === 'view'} error={!!errors.visitante} helperText={errors.visitante} inputProps={{ maxLength: 100 }} onChange={e => setForm({...form, visitante: e.target.value})} />}

              <TextField fullWidth label="CPF/Passaporte" value={getCpfDisplayValue(form.cpf)} sx={fieldStyle('cpf')} disabled={mode === 'view'} error={!!errors.cpf} helperText={errors.cpf} onFocus={() => mode === 'edit' && setIsCpfFocused(true)} onBlur={() => setIsCpfFocused(false)} onChange={(e) => handleCpfChange(e.target.value)} />

              {form.atividade === 'Entrega de insumo' && <TextField fullWidth label="Empresa" value={form.empresa} sx={fieldStyle()} disabled={mode === 'view'} inputProps={{ maxLength: 150 }} onChange={e => setForm({...form, empresa: e.target.value})} />}
              {(form.atividade === 'Entrega de insumo' || form.atividade === 'Expedição') && <TextField fullWidth label="Nota fiscal" value={form.notaFiscal} sx={fieldStyle()} disabled={mode === 'view'} inputProps={{ maxLength: 9 }} onChange={e => setForm({...form, notaFiscal: e.target.value})} />}

              {form.atividade === 'Visita' && (
                <>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Tipo de veículo</InputLabel><Select value={form.tipoVeiculo} label="Tipo de veículo" onChange={e => setForm({...form, tipoVeiculo: e.target.value})} MenuProps={layerProps.MenuProps}><MenuItem value="Carro">Carro</MenuItem><MenuItem value="Moto">Moto</MenuItem></Select></FormControl>
                    <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Placa</InputLabel><Select value={form.placa} label="Placa" onChange={e => setForm({...form, placa: e.target.value})} MenuProps={layerProps.MenuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}><FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}><InputLabel>Motivo</InputLabel><Select value={form.motivo} label="Motivo" onChange={e => setForm({...form, motivo: e.target.value})} MenuProps={layerProps.MenuProps}><MenuItem value="Reunião">Reunião</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl></Box>
                    <Box sx={{ flex: 1 }}><TextField fullWidth label="Outros" value={form.motivoManual} sx={fieldStyle()} disabled={mode === 'view' || form.motivo !== 'Outros'} inputProps={{ maxLength: 40 }} onChange={e => setForm({...form, motivoManual: e.target.value})} /></Box>
                  </Stack>
                </>
              )}

              {form.atividade !== 'Visita' && (
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Peso inicial" value={form.pesoInicial} sx={fieldStyle()} disabled={mode === 'view'} onChange={e => {
                    const d = e.target.value.replace(/\D/g, '').substring(0, 6);
                    setForm({...form, pesoInicial: d ? (parseInt(d, 10) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : ''});
                  }} />
                  <TextField fullWidth label="Peso final" value={form.pesoFinal} sx={fieldStyle()} disabled={mode === 'view'} onChange={e => {
                    const d = e.target.value.replace(/\D/g, '').substring(0, 6);
                    setForm({...form, pesoFinal: d ? (parseInt(d, 10) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : ''});
                  }} />
                </Stack>
              )}

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}><DatePicker label="Data de saída" value={form.dataSaida} disabled={mode === 'view'} minDate={form.data} onChange={v => setForm({...form, dataSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} /></Box>
                <Box sx={{ flex: 1 }}><TimePicker label="Horário de saída" value={form.horarioSaida} disabled={mode === 'view'} ampm={false} minTime={(form.data && form.dataSaida && isSameDay(form.data, form.dataSaida)) ? form.horario : undefined} onChange={v => setForm({...form, horarioSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} /></Box>
              </Stack>

              {form.atividade === 'Entrega de dejetos' && form.status === 'Concluído' && (
                <Autocomplete freeSolo options={DENSIDADE_OPTIONS} value={form.densidade} onInputChange={(_, nv) => setForm({ ...form, densidade: nv })} renderInput={(params) => <TextField {...params} label="Densidade" sx={fieldStyle()} />} slotProps={{ popper: { sx: { zIndex: 16000 } } }} disabled={mode === 'view'} />
              )}
            </>
          )}
        </Box>

        {mode !== 'view' && (
          <Box sx={{ height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '20px', bgcolor: 'white' }}>
            <Stack direction="row" spacing="20px">
              <Button variant="outlined" onClick={onClose} sx={{ ...btnStyle, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.5)' }}>{mode === 'edit' ? 'Voltar' : 'Cancelar'}</Button>
              <Button variant="contained" onClick={handleInternalSave} sx={{ ...btnStyle, bgcolor: '#0072C3' }}>Salvar</Button>
            </Stack>
          </Box>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;