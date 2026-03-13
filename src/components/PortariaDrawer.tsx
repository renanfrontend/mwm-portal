import React, { useState, useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, TextField, Button, 
  MenuItem, FormControl, InputLabel, Select, Divider, Stack, FormHelperText 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { parse, isToday, isAfter, startOfMinute } from 'date-fns';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [form, setForm] = useState<any>({
    data: new Date(), horario: new Date(), atividade: '',
    transportadora: '', transportadoraManual: '', placa: '', placaManual: '',
    tipoVeiculo: '', motorista: '', cpf: '', pesoInicial: '', pesoFinal: '',
    dataSaida: null, horarioSaida: null, cooperado: '', empresa: '', notaFiscal: '',
    visitante: '', motivo: '', motivoManual: ''
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initialData) {
        const parseDate = (d: any) => (d && typeof d === 'string' ? parse(d, 'dd/MM/yyyy', new Date()) : (d || null));
        const parseTime = (t: any) => (t && typeof t === 'string' ? parse(t, 'HH:mm', new Date()) : (t || null));
        setForm({
          ...initialData,
          data: parseDate(initialData.data) || new Date(),
          horario: parseTime(initialData.hora || initialData.horario) || new Date(),
          dataSaida: parseDate(initialData.dataSaida),
          horarioSaida: parseTime(initialData.horarioSaida),
        });
      } else {
        setForm({ data: new Date(), horario: new Date(), atividade: '', transportadora: '', transportadoraManual: '', placa: '', placaManual: '', tipoVeiculo: '', motorista: '', cpf: '', pesoInicial: '', pesoFinal: '', dataSaida: null, horarioSaida: null, cooperado: '', empresa: '', notaFiscal: '', visitante: '', motivo: '', motivoManual: '' });
      }
    }
  }, [open, initialData]);

  // ✅ Máscaras e Validações Blindadas
  const applyPlateMask = (v: string) => {
    const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 7);
    if (raw.length > 3) return `${raw.substring(0, 3)}-${raw.substring(3)}`;
    return raw;
  };

  const applyWeightMask = (v: string) => {
    const d = v.replace(/\D/g, '').substring(0, 6);
    if (!d) return '';
    return (parseInt(d, 10) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  const handleTransportadoraChange = (val: string) => {
    if (val === 'Outros') {
      setForm({ ...form, transportadora: val, transportadoraManual: '', placa: 'Outros', placaManual: '' });
    } else {
      setForm({ ...form, transportadora: val, transportadoraManual: '', placa: '', placaManual: '' });
    }
  };

  const validate = () => {
    let newErrors: any = {};
    if (!form.atividade) newErrors.atividade = "Obrigatório";
    if (isToday(form.data) && isAfter(startOfMinute(form.horario), startOfMinute(new Date()))) newErrors.horario = "Futuro bloqueado";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const portalProps = {
    MenuProps: { slotProps: { root: { sx: { zIndex: 10000 } } }, PaperProps: { sx: { zIndex: 10000 } } },
    slotProps: { popper: { sx: { zIndex: 10000 } } }
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16, backgroundColor: 'white', px: '4px' },
    position: 'relative'
  };

  const btnStyle = { height: 48, width: 280, fontSize: 15, fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase', borderRadius: '4px' };
  const isReadOnly = mode === 'view';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }} sx={{ zIndex: 1400 }}>
        
        {/* HEADER FIGMA */}
        <Box sx={{ width: '100%', position: 'relative', pt: '24px', pb: '12px', px: '20px' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}><CloseIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} /></IconButton>
          <Box sx={{ pr: 8 }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>
                {mode === 'view' ? 'Visualização' : 'Cadastro'}
            </Typography>
            <Typography sx={{ fontSize: 16, color: 'black', fontFamily: SCHIBSTED, mt: 1 }}>Preencha corretamente os campos abaixo para efetuar o cadastro.</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Stack direction="row" spacing={2}>
            <DatePicker label="Data" value={form.data} disabled={isReadOnly} maxDate={new Date()} onChange={v => setForm({...form, data: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle }, ...portalProps.slotProps }} />
            <TimePicker label="Horário" value={form.horario} disabled={isReadOnly} ampm={false} onChange={v => setForm({...form, horario: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle, error: !!errors.horario }, ...portalProps.slotProps }} />
          </Stack>

          <FormControl fullWidth sx={fieldStyle} error={!!errors.atividade} disabled={isReadOnly || mode === 'edit'}>
              <InputLabel>Atividades a realizar</InputLabel>
              <Select value={form.atividade} label="Atividades a realizar" onChange={e => setForm({...form, atividade: e.target.value})} MenuProps={portalProps.MenuProps}>
                  <MenuItem value="Abastecimento">Abastecimento</MenuItem>
                  <MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem>
                  <MenuItem value="Entrega de insumo">Entrega de insumo</MenuItem>
                  <MenuItem value="Expedição">Expedição</MenuItem>
                  <MenuItem value="Visita">Visita</MenuItem>
              </Select>
          </FormControl>

          <Divider sx={{ mt: -1 }} />

          {form.atividade && (
            <>
              <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER, color: 'black' }}>Informações</Typography>

              {/* ✅ LÓGICA DE CAMPOS POR ATIVIDADE (ORDEM RÍGIDA DOS SNIPPETS) */}

              {/* 1. TRANSPORTADORA E PLACA (Lado a lado se não for Outros) */}
              {form.atividade !== 'Visita' && (
                <>
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
                        <InputLabel>Transportadora</InputLabel>
                        <Select value={form.transportadora} label="Transportadora" onChange={e => handleTransportadoraChange(e.target.value)} MenuProps={portalProps.MenuProps}>
                          <MenuItem value="Jadlog">Jadlog</MenuItem><MenuItem value="Outros">Outros</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      {/* ✅ "Outros" ao lado do Select Transportadora */}
                      {form.transportadora === 'Outros' ? (
                        <TextField fullWidth label="Outros" value={form.transportadoraManual} onChange={e => setForm({...form, transportadoraManual: e.target.value})} sx={fieldStyle} disabled={isReadOnly} />
                      ) : (
                        <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Placa</InputLabel><Select value={form.placa} label="Placa" onChange={e => setForm({...form, placa: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                      )}
                    </Box>
                  </Stack>

                  {/* ✅ "Outros" ao lado do Select Placa (apenas se Placa for Outros e Transportadora NÃO for Outros) */}
                  {(form.placa === 'Outros' || form.transportadora === 'Outros') && (
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        {form.transportadora === 'Outros' && (
                           <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Placa</InputLabel><Select value={form.placa} label="Placa" onChange={e => setForm({...form, placa: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {form.placa === 'Outros' && (
                          <TextField fullWidth label="Outros" value={form.placaManual} onChange={e => setForm({...form, placaManual: applyPlateMask(e.target.value)})} sx={fieldStyle} disabled={isReadOnly} />
                        )}
                      </Box>
                    </Stack>
                  )}
                </>
              )}

              {/* 2. CAMPOS ESPECÍFICOS (ORDEM DO CÓDIGO REF) */}
              
              {/* ABASTECIMENTO, INSUMO, EXPEDIÇÃO E DEJETOS (Pares de Tipo Veículo / Motorista / Empresa) */}
              {form.atividade !== 'Visita' && (
                <>
                  {form.atividade === 'Entrega de dejetos' && (
                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label="Cooperado" value={form.cooperado} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, cooperado: e.target.value})} />
                      <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Tipo de veículo</InputLabel><Select value={form.tipoVeiculo} label="Tipo de veículo" onChange={e => setForm({...form, tipoVeiculo: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                    </Stack>
                  )}

                  {(form.atividade === 'Abastecimento' || form.atividade === 'Entrega de insumo' || form.atividade === 'Expedição') && (
                    <Stack direction="row" spacing={2}>
                      <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Tipo de veículo</InputLabel><Select value={form.tipoVeiculo} label="Tipo de veículo" onChange={e => setForm({...form, tipoVeiculo: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="Caminhão">Caminhão</MenuItem></Select></FormControl>
                      <TextField fullWidth label="Motorista" value={form.motorista} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, motorista: e.target.value})} />
                    </Stack>
                  )}

                  {form.atividade === 'Entrega de dejetos' && (
                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label="Motorista" value={form.motorista} sx={fieldStyle} disabled={isReadOnly} />
                      <TextField fullWidth label="CPF/Passaporte" value={form.cpf} sx={fieldStyle} disabled={isReadOnly} />
                    </Stack>
                  )}

                  {/* CPF FULL WIDTH PARA ABASTECIMENTO / INSUMO / EXPEDIÇÃO (Conforme snippets ref) */}
                  {(form.atividade === 'Abastecimento' || form.atividade === 'Entrega de insumo' || form.atividade === 'Expedição') && (
                    <TextField fullWidth label="CPF/Passaporte" value={form.cpf} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, cpf: e.target.value})} />
                  )}

                  {(form.atividade === 'Expedição' || form.atividade === 'Entrega de insumo') && (
                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label={form.atividade === 'Expedição' ? "Empresa" : "Nota fiscal"} value={form.atividade === 'Expedição' ? form.empresa : form.notaFiscal} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, [form.atividade === 'Expedição' ? 'empresa' : 'notaFiscal']: e.target.value})} />
                      <Box sx={{ flex: 1 }}>{form.atividade === 'Expedição' && <TextField fullWidth label="Nota fiscal" value={form.notaFiscal} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, notaFiscal: e.target.value})} />}</Box>
                    </Stack>
                  )}
                </>
              )}

              {/* VISITA (CAMPOS ESPECÍFICOS) */}
              {form.atividade === 'Visita' && (
                <>
                  <Stack direction="row" spacing={2}>
                    <TextField fullWidth label="Nome do Visitante" value={form.visitante} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, visitante: e.target.value})} />
                    <TextField fullWidth label="CPF/Passaporte" value={form.cpf} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, cpf: e.target.value})} />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Tipo de veículo</InputLabel><Select value={form.tipoVeiculo} label="Tipo de veículo" onChange={e => setForm({...form, tipoVeiculo: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="Carro">Carro</MenuItem><MenuItem value="Moto">Moto</MenuItem></Select></FormControl>
                    <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Placa</InputLabel><Select value={form.placa} label="Placa" onChange={e => setForm({...form, placa: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="ABC-1234">ABC-1234</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}><InputLabel>Motivo</InputLabel><Select value={form.motivo} label="Motivo" onChange={e => setForm({...form, motivo: e.target.value})} MenuProps={portalProps.MenuProps}><MenuItem value="Reunião">Reunião</MenuItem><MenuItem value="Outros">Outros</MenuItem></Select></FormControl>
                    <TextField fullWidth label="Outros" value={form.motivoManual} sx={fieldStyle} disabled={isReadOnly || form.motivo !== 'Outros'} onChange={e => setForm({...form, motivoManual: e.target.value})} />
                  </Stack>
                </>
              )}

              {/* 3. PESOS E SAÍDA (PARES FIXOS) */}
              {form.atividade !== 'Visita' && (
                <Stack direction="row" spacing={2}>
                  <TextField fullWidth label="Peso inicial" value={form.pesoInicial} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, pesoInicial: applyWeightMask(e.target.value)})} />
                  <TextField fullWidth label="Peso final" value={form.pesoFinal} sx={fieldStyle} disabled={isReadOnly} onChange={e => setForm({...form, pesoFinal: applyWeightMask(e.target.value)})} />
                </Stack>
              )}

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}><DatePicker label="Data de saída" value={form.dataSaida} disabled={isReadOnly} minDate={form.data} onChange={v => setForm({...form, dataSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle }, ...portalProps.slotProps }} /></Box>
                <Box sx={{ flex: 1 }}><TimePicker label="Horário de saída" value={form.horarioSaida} disabled={isReadOnly} ampm={false} onChange={v => setForm({...form, horarioSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle }, ...portalProps.slotProps }} /></Box>
              </Stack>
            </>
          )}
        </Box>

        {/* ✅ FOOTER PADRONIZADO (Sem Borda, Peso 500) */}
        {!isReadOnly && (
          <Box sx={{ height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '20px', bgcolor: 'white' }}>
            <Stack direction="row" spacing="20px">
              <Button variant="outlined" onClick={onClose} sx={{ ...btnStyle, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.5)' }}>
                {mode === 'edit' ? 'Voltar' : 'Cancelar'}
              </Button>
              <Button variant="contained" onClick={() => { if(validate()) onSave(form); }} sx={{ ...btnStyle, bgcolor: '#0072C3' }}>
                Salvar
              </Button>
            </Stack>
          </Box>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;