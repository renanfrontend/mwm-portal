import React, { useState, useEffect } from 'react';
import {
  Box, Stack, FormControl, InputLabel, Select, MenuItem,
  TextField
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { isSameDay } from 'date-fns';
import { expedicaoService } from '../../../services/activities/expedicao';

interface Props {
  form: any;
  setForm: (form: any) => void;
  errors: any;
  mode: 'add' | 'edit' | 'view';
  layerProps: any;
  fieldStyle: (fieldName?: string) => any;
  open: boolean;
}

export const ExpedicaoForm: React.FC<Props> = ({
  form, setForm, errors, mode, layerProps, fieldStyle, open
}) => {
  const [transportadoraOptions, setTransportadoraOptions] = useState<{ id: string; nomeFantasia: string }[]>([]);
  const [placaOptions, setPlacaOptions] = useState<{ id: string; placa: string }[]>([]);

  useEffect(() => {
    if (open) {
      expedicaoService.getTransportadoras()
        .then(setTransportadoraOptions)
        .catch(e => console.error('Erro transportadoras:', e));
    }
  }, [open]);

  useEffect(() => {
    if (form.transportadora && form.transportadora !== 'outros') {
      expedicaoService.getPlacasByTransportadora(form.transportadora)
        .then(setPlacaOptions)
        .catch(e => console.error('Erro placas:', e));
    } else {
      setPlacaOptions([]);
    }
  }, [form.transportadora]);

  const handleTransportadoraChange = (value: string) => {
    if (value === 'outros') {
      setForm({ ...form, transportadora: 'outros', transportadoraManual: '', placa: 'outros', placaManual: '' });
    } else {
      setForm({ ...form, transportadora: value, transportadoraManual: '', placa: '', placaManual: '' });
    }
  };

  const handleVeiculoChange = (value: string) => {
    if (value === 'outros') {
      setForm({ ...form, veiculoId: 'outros', placa: 'outros', placaManual: '' });
    } else {
      const veiculo = placaOptions.find(p => String(p.id) === value);
      setForm({ ...form, veiculoId: value, placa: veiculo ? veiculo.placa.trim() : '', placaManual: '' });
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
            <InputLabel>Transportadora</InputLabel>
            <Select
              value={String(form.transportadora || '')}
              label="Transportadora"
              onChange={e => handleTransportadoraChange(e.target.value)}
              MenuProps={layerProps.MenuProps}
            >
              {transportadoraOptions.map(t => (
                <MenuItem key={t.id} value={String(t.id)}>{t.nomeFantasia}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          {form.transportadora === 'outros' ? (
            <TextField
              fullWidth
              label="Nome da Transportadora"
              value={form.transportadoraManual || ''}
              onChange={e => setForm({ ...form, transportadoraManual: e.target.value })}
              sx={fieldStyle()}
              disabled={mode === 'view'}
            />
          ) : (
            <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
              <InputLabel>Placa</InputLabel>
              <Select
                value={String(form.veiculoId || '')}
                label="Placa"
                onChange={e => handleVeiculoChange(e.target.value)}
                MenuProps={layerProps.MenuProps}
              >
                {placaOptions.length > 0 ? (
                  placaOptions.map(p => (
                    <MenuItem key={p.id} value={String(p.id)}>{p.placa}</MenuItem>
                  ))
                ) : form.placa ? (
                  <MenuItem key={form.placa} value={form.veiculoId}>{form.placa}</MenuItem>
                ) : null}
              </Select>
            </FormControl>
          )}
        </Box>
      </Stack>

      {form.transportadora === 'outros' && (
        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Placa"
              value="OUTROS"
              sx={fieldStyle()}
              disabled
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Digite a Placa"
              value={form.placaManual || ''}
              onChange={e => setForm({ ...form, placaManual: e.target.value.toUpperCase() })}
              sx={fieldStyle()}
              disabled={mode === 'view'}
              inputProps={{ maxLength: 7 }}
            />
          </Box>
        </Stack>
      )}

      <Stack direction="row" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
            <InputLabel>Tipo de veículo</InputLabel>
            <Select
              value={form.tipoVeiculo || ''}
              label="Tipo de veículo"
              onChange={e => setForm({ ...form, tipoVeiculo: e.target.value })}
              MenuProps={layerProps.MenuProps}
            >
              <MenuItem value="Caminhão">Caminhão</MenuItem>
              <MenuItem value="Carreta">Carreta</MenuItem>
              <MenuItem value="Toco">Toco</MenuItem>
              <MenuItem value="Van">Van</MenuItem>
              <MenuItem value="Carro">Carro</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Motorista"
            value={form.motorista || ''}
            sx={fieldStyle('motorista')}
            disabled={mode === 'view'}
            error={!!errors.motorista}
            helperText={errors.motorista}
            onChange={e => setForm({ ...form, motorista: e.target.value })}
          />
        </Box>
      </Stack>

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

      <TextField
        fullWidth
        label="Nota fiscal"
        value={form.notaFiscal || ''}
        sx={fieldStyle()}
        disabled={mode === 'view'}
        inputProps={{ maxLength: 9 }}
        onChange={e => setForm({ ...form, notaFiscal: e.target.value })}
      />

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Peso inicial"
          value={form.pesoInicial || ''}
          sx={fieldStyle()}
          disabled={mode === 'view'}
          onChange={e => {
            const d = e.target.value.replace(/\D/g, '').substring(0, 6);
            setForm({ ...form, pesoInicial: d ? (parseInt(d, 10) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '' });
          }}
        />
        <TextField
          fullWidth
          label="Peso final"
          value={form.pesoFinal || ''}
          sx={fieldStyle()}
          disabled={mode === 'view'}
          onChange={e => {
            const d = e.target.value.replace(/\D/g, '').substring(0, 6);
            setForm({ ...form, pesoFinal: d ? (parseInt(d, 10) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '' });
          }}
        />
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
