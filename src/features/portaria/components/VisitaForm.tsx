import React, { useState, useEffect } from 'react';
import {
  Box, Stack, FormControl, InputLabel, Select, MenuItem,
  TextField
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { isSameDay } from 'date-fns';

interface Props {
  form: any;
  setForm: (form: any) => void;
  errors: any;
  mode: 'add' | 'edit' | 'view';
  layerProps: any;
  fieldStyle: (fieldName?: string) => any;
  open: boolean;
}

export const VisitaForm: React.FC<Props> = ({
  form, setForm, errors, mode, layerProps, fieldStyle
}) => {
  const [placaOptions, setPlacaOptions] = useState<{ id: string; placa: string }[]>([]);

  useEffect(() => {
    if (form.tipoVeiculo) {
      const mockPlacas: { [key: string]: { id: string; placa: string }[] } = {
        'Carro': [
          { id: '1', placa: 'ABC-1D23' },
          { id: '2', placa: 'DEF-4G56' },
        ],
        'Moto': [
          { id: '3', placa: 'HIJ-7K89' },
          { id: '4', placa: 'LMN-0P12' },
        ],
      };
      setPlacaOptions(mockPlacas[form.tipoVeiculo] || []);
    } else {
      setPlacaOptions([]);
    }
  }, [form.tipoVeiculo]);

  return (
    <>
      <TextField
        fullWidth
        label="Nome do Visitante"
        value={form.visitante || ''}
        sx={fieldStyle('visitante')}
        disabled={mode === 'view'}
        error={!!errors.visitante}
        helperText={errors.visitante}
        inputProps={{ maxLength: 100 }}
        onChange={e => setForm({ ...form, visitante: e.target.value })}
      />

      <TextField
        fullWidth
        label="CPF/Passaporte"
        value={form.cpf || ''}
        sx={fieldStyle('cpf')}
        disabled={mode === 'view'}
        error={!!errors.cpf}
        helperText={errors.cpf}
        onChange={e => setForm({ ...form, cpf: e.target.value })}
      />

      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
            <InputLabel>Tipo de veículo</InputLabel>
            <Select
              value={form.tipoVeiculo || ''}
              label="Tipo de veículo"
              onChange={e => setForm({ ...form, tipoVeiculo: e.target.value, veiculoId: '', placa: '' })}
              MenuProps={layerProps.MenuProps}
            >
              <MenuItem value="Carro">Carro</MenuItem>
              <MenuItem value="Moto">Moto</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
            <InputLabel>Placa</InputLabel>
            <Select
              value={form.veiculoId || ''}
              label="Placa"
              onChange={e => {
                const veiculoId = e.target.value;
                const veiculo = placaOptions.find(p => String(p.id) === veiculoId);
                setForm({ ...form, veiculoId, placa: veiculo ? veiculo.placa : '' });
              }}
              MenuProps={layerProps.MenuProps}
            >
              {placaOptions.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.placa}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
            <InputLabel>Motivo</InputLabel>
            <Select
              value={form.motivo || ''}
              label="Motivo"
              onChange={e => setForm({ ...form, motivo: e.target.value, motivoManual: '' })}
              MenuProps={layerProps.MenuProps}
            >
              <MenuItem value="Reunião">Reunião</MenuItem>
              <MenuItem value="Entrevista">Entrevista</MenuItem>
              <MenuItem value="Treinamento">Treinamento</MenuItem>
              <MenuItem value="Auditoria">Auditoria</MenuItem>
              <MenuItem value="Visita técnica">Visita técnica</MenuItem>
              <MenuItem value="Outros">Outros</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          {form.motivo === 'Outros' ? (
            <TextField
              fullWidth
              label="Digite o Motivo"
              value={form.motivoManual || ''}
              onChange={e => setForm({ ...form, motivoManual: e.target.value })}
              sx={fieldStyle()}
              disabled={mode === 'view'}
            />
          ) : (
            <TextField
              fullWidth
              label="Motivo"
              value={form.motivo || ''}
              sx={fieldStyle()}
              disabled
            />
          )}
        </Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <DatePicker
            label="Data de saída"
            value={form.dataSaida || null}
            disabled={mode === 'view'}
            minDate={form.data || undefined}
            onChange={v => setForm({ ...form, dataSaida: v })}
            slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TimePicker
            label="Horário de saída"
            value={form.horarioSaida || null}
            disabled={mode === 'view'}
            ampm={false}
            minTime={(form.data && form.dataSaida && isSameDay(form.data, form.dataSaida)) ? (form.horario || undefined) : undefined}
            onChange={v => setForm({ ...form, horarioSaida: v })}
            slotProps={{ textField: { fullWidth: true, sx: fieldStyle() }, ...layerProps.slotProps }}
          />
        </Box>
      </Stack>
    </>
  );
};
