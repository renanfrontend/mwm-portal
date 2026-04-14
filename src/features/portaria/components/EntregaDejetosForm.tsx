import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Stack, FormControl, InputLabel, Select, MenuItem,
  TextField, Autocomplete, FormHelperText
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { isSameDay } from 'date-fns';
import { entregaDejetosService } from '../services/entregaDejetosService';

const DENSIDADE_OPTIONS = ['1.0', '1.2', '1.4', '1.6', '1.8'];

interface Props {
  form: any;
  setForm: (form: any) => void;
  errors: any;
  mode: 'add' | 'edit' | 'view';
  layerProps: any;
  fieldStyle: (fieldName?: string) => any;
  open: boolean;
  data: any;
  cooperadoOptions: { id: string | number; label: string }[];
}

export const EntregaDejetosForm: React.FC<Props> = ({
  form, setForm, errors, mode, layerProps, fieldStyle, open, cooperadoOptions
}) => {
  const [transportadoraOptions, setTransportadoraOptions] = useState<{ id: string; nomeFantasia: string }[]>([
    { id: 'outros', nomeFantasia: 'Outros' }
  ]);
  const [placaOptions, setPlacaOptions] = useState<{ id: string; placa: string }[]>([]);

  const localCooperadoOptions = useMemo(() => {
    const currentId = form.cooperado;
    const hasCurrentValue = currentId && cooperadoOptions.find(c => String(c.id) === String(currentId));
    if (currentId && !hasCurrentValue) {
      return [{ id: currentId, label: `Cooperado #${currentId}` }, ...cooperadoOptions];
    }
    return cooperadoOptions;
  }, [cooperadoOptions, form.cooperado]);

  useEffect(() => {
    if (open) {
      const transportadoraId = form.transportadora;
      entregaDejetosService.getTransportadoras()
        .then(data => {
          const apiOptions = data || [];
          setTransportadoraOptions(prev => {
            const hasOutros = apiOptions.find(t => t.id === 'outros') || prev.find(t => t.id === 'outros');
            const hasCurrentValue = transportadoraId && transportadoraId !== 'outros' && (
              apiOptions.find(t => String(t.id) === String(transportadoraId)) ||
              prev.find(t => String(t.id) === String(transportadoraId))
            );
            let finalOptions = hasOutros ? apiOptions : [{ id: 'outros', nomeFantasia: 'Outros' }, ...apiOptions];
            if (transportadoraId && transportadoraId !== 'outros' && !hasCurrentValue) {
              finalOptions = [{ id: transportadoraId, nomeFantasia: `Transportadora #${transportadoraId}` }, ...finalOptions];
            }
            return finalOptions;
          });
        })
        .catch(e => console.error('Erro transportadoras:', e));
    }
  }, [open]);

  useEffect(() => {
    if (form.transportadora && form.transportadora !== 'outros') {
      entregaDejetosService.getPlacasByTransportadora(form.transportadora)
        .then(setPlacaOptions)
        .catch(e => console.error('Erro placas:', e));
    } else {
      setPlacaOptions([]);
    }
  }, [form.transportadora]);

  useEffect(() => {
    if (form.data) {
      setForm((prev: any) => ({ ...prev, dataSaida: form.data }));
    }
  }, [form.data]);

  const handleTransportadoraChange = (value: string) => {
    if (value === 'outros') {
      setForm({ ...form, transportadora: 'outros', transportadoraManual: '', placa: 'Outros', placaManual: '' });
    } else {
      setForm({ ...form, transportadora: value, transportadoraManual: '', placa: '', placaManual: '' });
    }
  };

  const handleVeiculoChange = (veiculoId: string) => {
    const veiculo = placaOptions.find(p => String(p.id) === veiculoId);
    setForm({ ...form, veiculoId: veiculoId, placa: veiculo ? veiculo.placa.trim() : '' });
  };

  const localPlacaOptions = useMemo(() => {
    const currentPlaca = form.placa;
    if (currentPlaca && placaOptions.length > 0 && !placaOptions.find(p => p.placa === currentPlaca)) {
      return [...placaOptions, { id: form.veiculoId || 'manual', placa: currentPlaca }];
    }
    return placaOptions;
  }, [placaOptions, form.placa, form.veiculoId]);

  return (
    <>
      {form.transportadora === 'outros' ? (
        <>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
                <InputLabel>Transportadora</InputLabel>
                <Select
                  value="outros"
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
              <TextField
                fullWidth
                label="Transportadora Manual"
                value={form.transportadoraManual || ''}
                onChange={e => setForm({ ...form, transportadoraManual: e.target.value })}
                sx={fieldStyle()}
                disabled={mode === 'view'}
              />
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
                <InputLabel>Placa</InputLabel>
                <Select value="outros" label="Placa" MenuProps={layerProps.MenuProps}>
                  <MenuItem value="outros">Outros</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Placa"
                value={form.placaManual || ''}
                onChange={e => setForm({ ...form, placaManual: e.target.value.toUpperCase(), placa: e.target.value.toUpperCase() })}
                sx={fieldStyle()}
                disabled={mode === 'view'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Box>
          </Stack>
        </>
      ) : (
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
            <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'}>
              <InputLabel>Placa</InputLabel>
              <Select
                value={form.veiculoId || ''}
                label="Placa"
                onChange={e => handleVeiculoChange(e.target.value)}
                MenuProps={layerProps.MenuProps}
              >
                {localPlacaOptions.map(p => (
                  <MenuItem key={p.id} value={String(p.id)}>{p.placa}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      )}

      <FormControl fullWidth sx={fieldStyle()} disabled={mode === 'view'} error={!!errors.cooperado}>
        <InputLabel>Cooperado</InputLabel>
        <Select
          value={String(form.cooperado || '')}
          label="Cooperado"
          onChange={e => setForm({ ...form, cooperado: e.target.value })}
          MenuProps={layerProps.MenuProps}
        >
          {localCooperadoOptions.map(c => (
            <MenuItem key={c.id} value={String(c.id)}>{c.label}</MenuItem>
          ))}
        </Select>
        {errors.cooperado && <FormHelperText>{errors.cooperado}</FormHelperText>}
      </FormControl>

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
            disabled={true}
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

      {form.status === 'Concluído' && (
        <Autocomplete
          freeSolo
          options={DENSIDADE_OPTIONS}
          value={form.densidade || ''}
          onInputChange={(_, nv) => setForm({ ...form, densidade: nv })}
          renderInput={(params) => <TextField {...params} label="Densidade" sx={fieldStyle()} />}
          slotProps={{ popper: { sx: { zIndex: 16000 } } }}
          disabled={mode === 'view'}
        />
      )}
    </>
  );
};
