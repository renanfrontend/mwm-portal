import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Importações do Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

// Importação do Canvas de Assinatura
import SignatureCanvas from 'react-signature-canvas';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const INTER = '"Inter", sans-serif';
const PRIMARY_BLUE = '#0072C3';

interface AbastecimentoDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any, mode: string) => void;
  mode?: 'create' | 'edit' | 'view' | 'concluir';
  initialData?: any;
}

const globalMenuProps = { style: { zIndex: 10000 } };

export const AbastecimentoDrawer: React.FC<AbastecimentoDrawerProps> = ({ 
  open, onClose, onSave, mode = 'create', initialData = null 
}) => {
  
  const [form, setForm] = useState<any>({
    cliente: '', veiculo: '', carga: '', placa: '', volume: '', inicio: '', odometro: '', frentista: '', dataInicial: null, horaInicial: null,
    pressaoFinal: '', volumeAbastecido: '', final: '', dataFinal: null, horaFinal: null
  });

  const [isSigningStep, setIsSigningStep] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  
  const sigCanvas = useRef<any>(null);

  useEffect(() => {
    if (open) {
      setIsSigningStep(false);
      setIsSigned(false); 
      if (sigCanvas.current) {
        sigCanvas.current.clear();
      }
      
      if (mode !== 'create' && initialData) {
        setForm({
          ...form,
          ...initialData,
          volume: initialData.volume ? (initialData.volume.includes('m³') ? initialData.volume : `${initialData.volume}m³`) : '',
          inicio: initialData.inicio ? (initialData.inicio.includes('m³') ? initialData.inicio : `${initialData.inicio}m³`) : '',
          dataInicial: initialData.dataInicial ? dayjs(initialData.dataInicial, 'DD/MM/YYYY') : null,
          horaInicial: initialData.horaInicial ? dayjs(`2000-01-01T${initialData.horaInicial}`) : null,
          
          pressaoFinal: initialData.pressaoFinal || (mode === 'view' ? '10.000' : ''),
          volumeAbastecido: initialData.volumeAbastecido || (mode === 'view' ? '50m³' : ''),
          final: initialData.final && initialData.final !== '---' ? initialData.final : (mode === 'view' ? '39m³' : ''),
          dataFinal: initialData.dataFinal ? dayjs(initialData.dataFinal, 'DD/MM/YYYY') : (mode === 'view' ? dayjs('13/03/2026', 'DD/MM/YYYY') : null),
          horaFinal: initialData.horaFinal ? dayjs(`2000-01-01T${initialData.horaFinal}`) : (mode === 'view' ? dayjs('2000-01-01T13:00:00') : null)
        });
      } else {
        setForm({ cliente: '', veiculo: '', carga: '', placa: '', volume: '', inicio: '', odometro: '', frentista: '', dataInicial: null, horaInicial: null, pressaoFinal: '', volumeAbastecido: '', final: '', dataFinal: null, horaFinal: null });
      }
    }
  }, [open, mode, initialData]);

  const handleSaveClick = () => {
    if (mode === 'concluir' && !isSigningStep) {
      setIsSigningStep(true);
      return;
    }

    const payload = {
      ...form,
      dataInicial: form.dataInicial ? form.dataInicial.format('DD/MM/YYYY') : '',
      horaInicial: form.horaInicial ? form.horaInicial.format('HH:mm') : '',
      dataFinal: form.dataFinal ? form.dataFinal.format('DD/MM/YYYY') : '',
      horaFinal: form.horaFinal ? form.horaFinal.format('HH:mm') : '',
    };
    onSave(payload, mode);
  };

  // ✅ Máscara rigorosa para garantir SOMENTE a metragem colada (ex: 50m³)
  const handleMaskM3 = (value: string) => {
    const onlyNums = value.replace(/\D/g, ''); 
    return onlyNums ? `${onlyNums}m³` : ''; 
  };

  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSigned(false);
    }
  };

  const fieldStyle = (disabled?: boolean) => ({
    '& .MuiOutlinedInput-root': { 
      fontFamily: SCHIBSTED, 
      fontSize: 16, 
      '& fieldset': { borderColor: disabled ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.23)' } 
    },
    '& .MuiInputLabel-root': { 
      fontFamily: SCHIBSTED, 
      fontSize: 16, 
      color: disabled ? 'rgba(0, 0, 0, 0.40)' : 'rgba(0, 0, 0, 0.60)', 
      '&.Mui-focused': { color: PRIMARY_BLUE } 
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: 'rgba(0, 0, 0, 0.40)',
    }
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

  const isReadOnly = mode === 'view';

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
              {isSigningStep ? 'ASSINATURA' : mode === 'concluir' ? 'CONCLUIR CADASTRO' : mode === 'view' ? 'VISUALIZAR' : mode === 'create' ? 'CADASTRO' : 'EDIÇÃO'}
            </Typography>
            <Typography sx={{ fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED, color: 'black' }}>
              {isSigningStep ? 'Assine abaixo para validar as informações' : 'Preencha os dados do abastecimento'}
            </Typography>
          </Box>
        </Box>

        {/* CORPO DO FORMULÁRIO */}
        <Box sx={{ flex: 1, px: '20px', pt: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
          
          {mode === 'create' || mode === 'edit' || mode === 'view' ? (
            <>
              <TextField fullWidth label="Cliente" placeholder="Ex: Agrocampo" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth sx={fieldStyle(isReadOnly)} disabled={isReadOnly}>
                  <InputLabel>Tipo de veículo</InputLabel>
                  <Select label="Tipo de veículo" value={form.veiculo} onChange={e => setForm({...form, veiculo: e.target.value as string})} MenuProps={globalMenuProps}>
                    <MenuItem value="Caminhão VUC">Caminhão VUC</MenuItem><MenuItem value="Caminhão Toco">Caminhão Toco</MenuItem><MenuItem value="Caminhão Truck">Caminhão Truck</MenuItem>
                    <MenuItem value="Caminhão Carreta">Caminhão Carreta</MenuItem><MenuItem value="Caminhão Bitrem">Caminhão Bitrem</MenuItem><MenuItem value="Caminhão Rodotrem">Caminhão Rodotrem</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={fieldStyle(isReadOnly)} disabled={isReadOnly}>
                  <InputLabel>Tipo de carga</InputLabel>
                  <Select label="Tipo de carga" value={form.carga} onChange={e => setForm({...form, carga: e.target.value as string})} MenuProps={globalMenuProps}>
                    <MenuItem value="Dejeto">Dejeto</MenuItem><MenuItem value="Ração">Ração</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="Placa" placeholder="AAA-0000" value={form.placa} onChange={e => setForm({...form, placa: e.target.value})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
                <TextField fullWidth label="Volume (m³)" placeholder="0m³" value={form.volume} onChange={e => setForm({...form, volume: handleMaskM3(e.target.value)})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
              </Stack>
              
              {/* ✅ MÁSCARA APLICADA AQUI TAMBÉM */}
              <TextField fullWidth label="Abastecimento inicial" placeholder="0m³" value={form.inicio} onChange={e => setForm({...form, inicio: handleMaskM3(e.target.value)})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
              
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="Odômetro" placeholder="0" type="number" value={form.odometro} onChange={e => setForm({...form, odometro: e.target.value})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
                <TextField fullWidth label="Frentista" placeholder="Nome do frentista" value={form.frentista} onChange={e => setForm({...form, frentista: e.target.value})} disabled={isReadOnly} sx={fieldStyle(isReadOnly)} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker label="Data inicial" value={form.dataInicial} onChange={(val) => setForm({...form, dataInicial: val})} disabled={isReadOnly} format="DD/MM/YYYY" sx={{ width: '100%', ...fieldStyle(isReadOnly) }} slotProps={calendarSlotProps} />
                <DesktopTimePicker label="Horário inicial" value={form.horaInicial} onChange={(val) => setForm({...form, horaInicial: val})} disabled={isReadOnly} ampm={false} format="HH:mm" sx={{ width: '100%', ...fieldStyle(isReadOnly) }} slotProps={timePickerSlotProps} />
              </Stack>
              
              {isReadOnly && (
                <>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField fullWidth label="Pressão final" placeholder="0" value={form.pressaoFinal} disabled sx={fieldStyle(true)} />
                    <TextField fullWidth label="Volume abastecido" placeholder="0m³" value={form.volumeAbastecido} disabled sx={fieldStyle(true)} />
                  </Stack>
                  <TextField fullWidth label="Abastecimento final" placeholder="0m³" value={form.final} disabled sx={fieldStyle(true)} />
                  <Stack direction="row" spacing={2}>
                    <DesktopDatePicker label="Data final" value={form.dataFinal} disabled format="DD/MM/YYYY" sx={{ width: '100%', ...fieldStyle(true) }} />
                    <DesktopTimePicker label="Horário final" value={form.horaFinal} disabled ampm={false} format="HH:mm" sx={{ width: '100%', ...fieldStyle(true) }} />
                  </Stack>

                  <Box sx={{ width: '100%', height: 256, bgcolor: '#FAFAFA', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', mt: 2 }}>
                    <Typography sx={{ position: 'absolute', top: -10, left: 10, bgcolor: '#FAFAFA', px: 0.5, fontSize: 12, color: 'rgba(0,0,0,0.4)', fontFamily: SCHIBSTED, zIndex: 10 }}>
                      Assinatura do Responsavel
                    </Typography>
                    {initialData?.status === 'Concluído' ? (
                       <Box component="img" src="https://placehold.co/553x118?text=Assinatura+Realizada" sx={{ width: 553, height: 118, opacity: 0.5 }} />
                    ) : null}
                  </Box>
                </>
              )}
            </>
          ) : mode === 'concluir' && !isSigningStep ? (
            <>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth label="Pressão final" placeholder="0" value={form.pressaoFinal} onChange={e => setForm({...form, pressaoFinal: e.target.value})} sx={fieldStyle()} />
                <TextField fullWidth label="Volume abastecido" placeholder="0m³" value={form.volumeAbastecido} onChange={e => setForm({...form, volumeAbastecido: handleMaskM3(e.target.value)})} sx={fieldStyle()} />
              </Stack>
              {/* ✅ MÁSCARA APLICADA AQUI TAMBÉM */}
              <TextField fullWidth label="Abastecimento final" placeholder="0m³" value={form.final} onChange={e => setForm({...form, final: handleMaskM3(e.target.value)})} sx={fieldStyle()} />
              
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker label="Data final" value={form.dataFinal} onChange={(val) => setForm({...form, dataFinal: val})} format="DD/MM/YYYY" sx={{ width: '100%', ...fieldStyle() }} slotProps={calendarSlotProps} />
                <DesktopTimePicker label="Horário final" value={form.horaFinal} onChange={(val) => setForm({...form, horaFinal: val})} ampm={false} format="HH:mm" sx={{ width: '100%', ...fieldStyle() }} slotProps={timePickerSlotProps} />
              </Stack>
            </>
          ) : (
            <>
              <Box sx={{ width: '100%', height: 256, bgcolor: '#FAFAFA', border: '1px solid rgba(0,0,0,0.25)', borderRadius: '4px', position: 'relative' }}>
                <Typography sx={{ position: 'absolute', top: -10, left: 10, bgcolor: 'white', px: 0.5, fontSize: 12, color: 'rgba(0,0,0,0.6)', fontFamily: SCHIBSTED, zIndex: 10 }}>
                  Assinatura do Responsavel
                </Typography>
                
                {!isSigned && (
                  <Typography sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(0,0,0,0.3)', pointerEvents: 'none', fontFamily: SCHIBSTED }}>
                    Assine aqui com o mouse ou dedo
                  </Typography>
                )}

                <Box sx={{ width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                  <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ style: { width: '100%', height: '100%', cursor: 'crosshair' } }} onEnd={() => setIsSigned(true)} />
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* FOOTER DO DRAWER */}
        <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            onClick={isSigningStep && isSigned ? handleClearSignature : isSigningStep ? () => setIsSigningStep(false) : onClose} 
            fullWidth 
            sx={{ height: 48, fontFamily: SCHIBSTED, color: (isSigningStep && isSigned) ? PRIMARY_BLUE : 'rgba(0,0,0,0.6)', borderColor: (isSigningStep && isSigned) ? PRIMARY_BLUE : 'rgba(0,0,0,0.23)', fontWeight: 600 }}
          >
            {isReadOnly ? 'FECHAR' : (isSigningStep && isSigned) ? 'LIMPAR' : 'CANCELAR'}
          </Button>
          {!isReadOnly && (
             <Button 
               variant="contained" 
               onClick={handleSaveClick} 
               fullWidth 
               disabled={isSigningStep && !isSigned} 
               sx={{ height: 48, bgcolor: PRIMARY_BLUE, fontFamily: SCHIBSTED, fontWeight: 600 }}
             >
               {isSigningStep ? 'FINALIZAR' : 'SALVAR'}
             </Button>
          )}
        </Box>

      </Drawer>
    </LocalizationProvider>
  );
};

export default AbastecimentoDrawer;