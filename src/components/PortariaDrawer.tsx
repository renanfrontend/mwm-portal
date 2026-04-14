
import React, { useState, useEffect } from 'react';
import { 
  Box, Drawer, IconButton, Typography, Stack, Divider, 
  FormControl, InputLabel, Select, MenuItem, TextField, 
  Button, FormHelperText 
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Close as CloseIcon } from '@mui/icons-material';
import { EntregaDejetosForm, AbastecimentoForm, EntregaInsumoForm, ExpedicaoForm, VisitaForm } from '../features/portaria/components';
import { PortariaProducersService } from '../features/portaria/services/portariaProducersService';
import { parse as parseDateFns, isToday, isAfter, isSameDay, startOfMinute, parseISO } from 'date-fns';

const parse = parseDateFns;

const parseDate = (dateStr: string | Date | null | undefined): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  if (typeof dateStr === 'string') {
    const parsed = parseISO(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const parseTime = (t: string | Date | null | undefined): Date | null => {
  if (!t) return null;
  if (typeof t === 'string') return parse(t, 'HH:mm', new Date());
  return t instanceof Date ? t : null;
};

const extractEntregaDejetosData = (initialData: any): any => {
  const entregaDejetos = initialData?.entrega_dejetos;
  return {
    produtorId: entregaDejetos?.produtor_id ? String(entregaDejetos.produtor_id) : '',
    motorista: entregaDejetos?.motorista_nome || '',
    cpf: entregaDejetos?.cpf_motorista || '',
    transportadoraManual: entregaDejetos?.transportadora_manual || '',
    placaManual: entregaDejetos?.placa_manual || '',
    placa: entregaDejetos?.placa || '',
    veiculoId: entregaDejetos?.veiculo_id ? String(entregaDejetos.veiculo_id) : '',
    tipoVeiculo: entregaDejetos?.tipo_veiculo || '',
    pesoInicial: entregaDejetos?.peso_inicial || '',
    pesoFinal: entregaDejetos?.peso_final || '',
    densidade: entregaDejetos?.densidade || '',
    transportadoraId: entregaDejetos?.transportadora_id ? String(entregaDejetos.transportadora_id) : '',
  };
};

const extractEntregaInsumoData = (initialData: any): any => {
  const entregaInsumo = initialData?.entrega_insumo as any;
  return {
    produtorId: entregaInsumo?.produtor_id ? String(entregaInsumo.produtor_id) : '',
    motorista: entregaInsumo?.motorista_nome || '',
    cpf: entregaInsumo?.cpf_motorista || '',
    transportadoraManual: entregaInsumo?.transportadora_manual || '',
    placaManual: entregaInsumo?.placa_manual || '',
    placa: entregaInsumo?.placa || '',
    veiculoId: entregaInsumo?.veiculo_id ? String(entregaInsumo.veiculo_id) : '',
    tipoVeiculo: entregaInsumo?.tipo_veiculo || '',
    pesoInicial: entregaInsumo?.peso_inicial || '',
    pesoFinal: entregaInsumo?.peso_final || '',
    densidade: '',
    transportadoraId: entregaInsumo?.transportadora_id ? String(entregaInsumo.transportadora_id) : '',
    empresa: entregaInsumo?.empresa || '',
    notaFiscal: entregaInsumo?.nota_fiscal || '',
  };
};

const extractAbastecimentoData = (initialData: any): any => {
  const abastecimento = initialData?.abastecimento;
  return {
    produtorId: abastecimento?.produtor_id ? String(abastecimento.produtor_id) : '',
    motorista: abastecimento?.motorista_nome || '',
    cpf: abastecimento?.cpf_motorista || '',
    transportadoraManual: abastecimento?.transportadora_manual || '',
    placaManual: abastecimento?.placa_manual || '',
    placa: abastecimento?.placa || '',
    veiculoId: abastecimento?.veiculo_id ? String(abastecimento.veiculo_id) : '',
    tipoVeiculo: abastecimento?.tipo_veiculo || '',
    pesoInicial: abastecimento?.peso_inicial || '',
    pesoFinal: abastecimento?.peso_final || '',
    densidade: '',
    transportadoraId: abastecimento?.transportadora_id ? String(abastecimento.transportadora_id) : '',
  };
};

const isTransportadoraManual = (transportadoraManual: string): boolean => {
  return !!transportadoraManual && transportadoraManual.trim().length > 0;
};

const mapTipoRegistroToAtividade = (tipoRegistro: string, atividade: string): string => {
  if (tipoRegistro === 'ENTREGA_DEJETOS') return 'Entrega de dejetos';
  if (tipoRegistro === 'ABASTECIMENTO') return 'Abastecimento';
  if (tipoRegistro === 'ENTREGA_INSUMO') return 'Entrega de insumo';
  if (tipoRegistro === 'EXPEDICAO') return 'Expedição';
  if (tipoRegistro === 'VISITA') return 'Visita';
  return atividade || '';
};

const PortariaDrawer: React.FC<any> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const [cooperadoOptions, setCooperadoOptions] = useState<{ id: number | string; label: string }[]>([]);

  useEffect(() => {
    if (open && (form.atividade === 'Entrega de dejetos' || form.atividade === 'Abastecimento')) {
      PortariaProducersService.getProducersForSelect()
        .then(setCooperadoOptions)
        .catch(e => console.error('Erro ao carregar cooperados:', e));
    }
  }, [open, form.atividade]);

  useEffect(() => {
    if (open) {
      setErrors({});
      
      if (initialData) {
        const atividade = mapTipoRegistroToAtividade(initialData.tipo_registro, initialData.atividade);
        let dadosExtraidos: any;
        if (atividade === 'Abastecimento') {
          dadosExtraidos = extractAbastecimentoData(initialData);
        } else if (atividade === 'Entrega de insumo') {
          dadosExtraidos = extractEntregaInsumoData(initialData);
        } else {
          dadosExtraidos = extractEntregaDejetosData(initialData);
        }
        
        const isOutros = isTransportadoraManual(dadosExtraidos.transportadoraManual);

        setForm({ 
          id: initialData.id,
          data: parseDate(initialData.data_entrada || initialData.data) || new Date(), 
          horario: parseTime(initialData.hora_entrada || initialData.horario || initialData.hora) || new Date(), 
          dataSaida: parseDate(initialData.data_saida || initialData.dataSaida), 
          horarioSaida: parseTime(initialData.hora_saida || initialData.horarioSaida),
          atividade: atividade,
          cooperado: dadosExtraidos.produtorId,
          transportadora: isOutros ? 'outros' : (dadosExtraidos.transportadoraId || ''),
          transportadoraManual: dadosExtraidos.transportadoraManual,
          veiculoId: dadosExtraidos.veiculoId,
          placa: isOutros ? 'Outros' : (dadosExtraidos.placa || ''),
          placaManual: dadosExtraidos.placaManual,
          motivo: initialData.motivoManual ? 'outros' : (initialData.motivo || ''),
          motorista: dadosExtraidos.motorista,
          cpf: dadosExtraidos.cpf,
          tipoVeiculo: dadosExtraidos.tipoVeiculo,
          pesoInicial: dadosExtraidos.pesoInicial,
          pesoFinal: dadosExtraidos.pesoFinal,
          status: initialData.status || 'Em andamento',
          densidade: dadosExtraidos.densidade,
          empresa: dadosExtraidos.empresa || initialData.empresa || '',
          notaFiscal: dadosExtraidos.notaFiscal || initialData.notaFiscal || '',
          visitante: initialData.visitante || '',
          motivoManual: initialData.motivoManual || ''
        });
      } else {
        setForm({ 
          data: new Date(), 
          horario: new Date(), 
          atividade: '', 
          transportadora: '', 
          transportadoraManual: '', 
          veiculoId: '',
          placa: '', 
          placaManual: '', 
          tipoVeiculo: '', 
          motorista: '', 
          cpf: '', 
          pesoInicial: '', 
          pesoFinal: '', 
          dataSaida: null, 
          horarioSaida: null, 
          cooperado: '', 
          empresa: '', 
          notaFiscal: '', 
          visitante: '', 
          motivo: '', 
          motivoManual: '', 
          densidade: '', 
          status: 'Em andamento' 
        });
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
    if (!form.cooperado && (form.atividade === 'Entrega de dejetos' || form.atividade === 'Abastecimento' || form.atividade === 'Entrega de insumo')) newErrors.cooperado = "Campo obrigatório";
    if (!form.motorista && form.atividade !== 'Visita') newErrors.motorista = "Campo obrigatório";
    if (!form.visitante && form.atividade === 'Visita') newErrors.visitante = "Campo obrigatório";
    if (form.data && form.horario && isToday(form.data) && isAfter(startOfMinute(form.horario), startOfMinute(new Date()))) newErrors.horario = "Hora Futura deve ser bloqueada";

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }} sx={{ zIndex: 1400 }}>
        <Box sx={{ width: '100%', position: 'relative', pt: '24px', pb: '12px', px: '20px' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
            <CloseIcon sx={{ color: 'rgba(0,0,0,0.54)' }} />
          </IconButton>
          <Box sx={{ pr: 8 }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>
              {mode === 'view' ? 'VISUALIZAÇÃO' : (mode === 'edit' ? 'EDIÇÃO' : 'CADASTRO')}
            </Typography>
            <Typography sx={{ fontSize: 16, color: 'black', fontFamily: SCHIBSTED, mt: 1 }}>
              Preencha corretamente os campos abaixo.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: '20px 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Stack direction="row" spacing={2}>
            <DatePicker label="Data" value={form.data || null} disabled={mode === 'view'} maxDate={new Date()} onChange={v => setForm({...form, data: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} />
            <TimePicker label="Horário Entrada" value={form.horario || null} disabled={mode === 'view'} ampm={false} maxTime={form.data && isToday(form.data) ? new Date() : undefined} onChange={v => setForm({...form, horario: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle('horario'), error: !!errors.horario, helperText: errors.horario }, ...layerProps.slotProps }} />
          </Stack>

          <FormControl fullWidth sx={fieldStyle('atividade')} error={!!errors.atividade} disabled={mode === 'view' || mode === 'edit'}>
            <InputLabel>Atividades a realizar</InputLabel>
            <Select value={form.atividade} label="Atividades a realizar" onChange={e => setForm({...form, atividade: e.target.value})} MenuProps={layerProps.MenuProps}>
              <MenuItem value="Abastecimento">Abastecimento</MenuItem>
              <MenuItem value="Entrega de dejetos">Entrega de dejetos</MenuItem>
              <MenuItem value="Entrega de insumo">Entrega de insumo</MenuItem>
              <MenuItem value="Expedição">Expedição</MenuItem>
              <MenuItem value="Visita">Visita</MenuItem>
            </Select>
            {errors.atividade && <FormHelperText>{errors.atividade}</FormHelperText>}
          </FormControl>
          <Divider sx={{ mt: -1 }} />

          {form.atividade && (
            <>
              <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER, color: 'black' }}>Informações</Typography>
              
              {form.atividade === 'Entrega de dejetos' && (
                <EntregaDejetosForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  mode={mode}
                  layerProps={layerProps}
                  fieldStyle={fieldStyle}
                  open={open}
                  data={form.data}
                  cooperadoOptions={cooperadoOptions}
                />
              )}

              {form.atividade === 'Abastecimento' && (
                <AbastecimentoForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  mode={mode}
                  layerProps={layerProps}
                  fieldStyle={fieldStyle}
                  open={open}
                  cooperadoOptions={cooperadoOptions}
                />
              )}

              {form.atividade === 'Entrega de insumo' && (
                <EntregaInsumoForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  mode={mode}
                  layerProps={layerProps}
                  fieldStyle={fieldStyle}
                  open={open}
                />
)}

              {form.atividade === 'Expedição' && (
                <ExpedicaoForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  mode={mode}
                  layerProps={layerProps}
                  fieldStyle={fieldStyle}
                  open={open}
                />
)}

              {form.atividade === 'Visita' && (
                <VisitaForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  mode={mode}
                  layerProps={layerProps}
                  fieldStyle={fieldStyle}
                  open={open}
                />
              )}

              {form.atividade !== 'Visita' && form.atividade !== 'Entrega de dejetos' && form.atividade !== 'Abastecimento' && form.atividade !== 'Entrega de insumo' && form.atividade !== 'Expedição' && (
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

              {form.atividade !== 'Entrega de dejetos' && form.atividade !== 'Abastecimento' && form.atividade !== 'Entrega de insumo' && form.atividade !== 'Expedição' && (
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <DatePicker label="Data de saída" value={form.dataSaida || null} disabled={mode === 'view'} minDate={form.data || undefined} onChange={v => setForm({...form, dataSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TimePicker label="Horário de saída" value={form.horarioSaida || null} disabled={mode === 'view'} ampm={false} minTime={(form.data && form.dataSaida && isSameDay(form.data, form.dataSaida)) ? (form.horario || undefined) : undefined} onChange={v => setForm({...form, horarioSaida: v})} slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }} />
                  </Box>
                </Stack>
              )}
            </>
          )}
        </Box>

        {mode !== 'view' && (
          <Box sx={{ height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', px: '20px', bgcolor: 'white' }}>
            <Stack direction="row" spacing="20px">
              <Button variant="outlined" onClick={onClose} sx={{ ...btnStyle, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.5)' }}>
                {mode === 'edit' ? 'Voltar' : 'Cancelar'}
              </Button>
              <Button variant="contained" onClick={handleInternalSave} sx={{ ...btnStyle, bgcolor: '#0072C3' }}>
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
