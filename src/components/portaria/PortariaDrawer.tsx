
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
// Corrija o caminho para o local correto dos formulários de atividade, se necessário
import { portariaActivityPayloadService, portariaValidationService } from '../../features/portaria';
import { portariaDrawerHydrationService } from '../../features/portaria/services/activities/hydration/portariaDrawerHydrationService';
import { PortariaProducersService } from '../../features/portaria/services/portariaProducersService';
import type { PortariaDrawerFormState, PortariaDrawerProps } from '../../features/portaria/types';
import { EntregaDejetosForm } from '../../features/portaria/components/activities/entrega-dejetos/EntregaDejetosForm';
import { AbastecimentoForm } from '../../features/portaria/components/activities/abastecimento/AbastecimentoForm';
import { EntregaInsumoForm } from '../../features/portaria/components/activities/entrega-insumo/EntregaInsumoForm';
import { ExpedicaoForm } from '../../features/portaria/components/activities/expedicao/ExpedicaoForm';
import { VisitaForm } from '../../features/portaria/components/activities/visita/VisitaForm';
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

const payloadFieldToFormField: Record<string, string> = {
  tipoRegistro: 'atividade',
  data_entrada: 'data',
  hora_entrada: 'horario',
  data_saida: 'dataSaida',
  hora_saida: 'horarioSaida',
  motorista_nome: 'motorista',
  cpf_motorista: 'cpf',
  produtor_id: 'cooperado',
  tipo_veiculo: 'tipoVeiculo',
  visitante_nome: 'visitante',
  documento_visitante: 'cpf',
  motivo_visita_id: 'motivo',
  motivo_manual: 'motivoManual',
  empresa: 'empresa',
  nota_fiscal: 'notaFiscal',
};

const PortariaDrawer: React.FC<PortariaDrawerProps> = ({ open, onClose, onSave, mode = 'add', initialData }) => {
  const [form, setForm] = useState<PortariaDrawerFormState>(portariaDrawerHydrationService.buildEmptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [cooperadoOptions, setCooperadoOptions] = useState<{ id: number | string; label: string }[]>([]);

  useEffect(() => {
    if (open && form.atividade === 'Entrega de dejetos') {
      PortariaProducersService.getProducersForSelect()
        .then(setCooperadoOptions)
        .catch(e => console.error('Erro ao carregar cooperados:', e));
    }
  }, [open, form.atividade]);

  useEffect(() => {
    if (open) {
      setErrors({});
      
      if (initialData) {
        setForm(portariaDrawerHydrationService.buildInitialForm(initialData, parseDate, parseTime));
      } else {
        setForm(portariaDrawerHydrationService.buildEmptyForm());
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
    const newErrors: Record<string, string> = {};

    if (form.data && form.horario && isToday(form.data) && isAfter(startOfMinute(form.horario), startOfMinute(new Date()))) {
      newErrors.horario = 'Hora Futura deve ser bloqueada';
    }

    if (form.cpf) {
      const clean = form.cpf.replace(/\D/g, '');
      if (clean.length === 11) {
        if (!isValidCPF(clean)) newErrors.cpf = "CPF ou CNPJ inválido. Verifique os números e tente novamente. (MS-03)";
      } else if (form.cpf.length > 0 && !/^[A-Z]{2}\d{6}$/.test(form.cpf.toUpperCase())) {
        newErrors.cpf = "Número invalido (MS-02)";
      }
    } else {
      newErrors.cpf = 'Campo obrigatório';
    }

    try {
      const payload = portariaActivityPayloadService.buildPayload(form);
      const validationResult = portariaValidationService.validateRegistro(payload);

      validationResult.errors.forEach(({ field, message }) => {
        const formField = payloadFieldToFormField[field] || field;
        if (!newErrors[formField]) {
          newErrors[formField] = message;
        }
      });
    } catch (error) {
      if (!newErrors.atividade) {
        newErrors.atividade = error instanceof Error ? error.message : 'Atividade inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleInternalSave = async () => {
    if (!validate()) return;
    const finalForm = { ...form };
    // Garante valor padrão para origem_entrada se não informado
    if (!finalForm.origem_entrada) {
      finalForm.origem_entrada = 'ESPONTANEA';
    }
    if (finalForm.dataSaida && finalForm.horarioSaida) finalForm.status = 'Concluído';

    onSave(finalForm);
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
          <>
            {errors.submit && (
              <Box sx={{ color: '#d32f2f', fontSize: 16, fontWeight: 500, mb: 1, textAlign: 'center' }}>{errors.submit}</Box>
            )}
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
          </>
        )}
      </Drawer>
    </LocalizationProvider>
  );
};

export default PortariaDrawer;
