import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, Autocomplete, InputAdornment, FormControl, InputLabel, Select
} from '@mui/material';
import { CloseIcon } from '../constants/muiIcons';
import MapIcon from '@mui/icons-material/Map';
import type { ProdutorFormInput } from '../types/cooperado';
import { fetchFiliadas, type FiliadaOption } from '../services/api';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

// --- MÁSCARA RÍGIDA (SÓ NÚMEROS) ---
const applyMask = (value: string) => {
  const nums = value.replace(/\D/g, ""); 
  if (nums.length <= 11) {
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  }
  return nums
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

// Props para garantir que os menus abram NA FRENTE do Drawer
const globalMenuProps = {
  style: { zIndex: 10000 }, // Maior que os 9999 do Drawer
};

const ProdutorDrawer: React.FC<any> = ({ isOpen, onClose, onSave, mode = 'create', initialData = null }) => {
  const [form, setForm] = useState<ProdutorFormInput>({} as any);
  const [filiadas, setFiliadas] = useState<FiliadaOption[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [existingProdutores, setExistingProdutores] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFiliadas().then(setFiliadas).catch(console.error);
      setErrors({});
      const baseState = {
        cpfCnpj: '', nome: '', numEstabelecimento: '', nPropriedade: '', matricula: '', 
        filiada: '', faseDejeto: 'GRSC', cabecas: '', certificado: 'Não', doamDejetos: 'Não',
        qtdLagoas: '1', volLagoas: '', restricoes: 'Nenhuma', responsavel: '', tecnico: '', 
        municipio: 'Toledo-PR', lat: '', long: '', distancia: '', localizacao: ''
      };
      setForm(mode !== 'create' && initialData ? { ...baseState, ...initialData } : baseState);
    }
  }, [isOpen, mode, initialData]);

  const handleCpfChange = (rawInputValue: string) => {
    if (rawInputValue === '') {
      setForm(prev => ({ ...prev, cpfCnpj: '' }));
      setExistingProdutores([]);
      return;
    }
    const onlyNums = rawInputValue.replace(/\D/g, "");
    if (onlyNums === form.cpfCnpj?.replace(/\D/g, "") && rawInputValue.length > (form.cpfCnpj?.length || 0)) {
        return;
    }
    const masked = applyMask(onlyNums);
    setForm(prev => ({ ...prev, cpfCnpj: masked }));

    if (onlyNums.length > 0 && onlyNums.length !== 11 && onlyNums.length !== 14) {
      setErrors(prev => ({ ...prev, cpfCnpj: 'Documento incompleto' }));
    } else {
      setErrors(prev => ({ ...prev, cpfCnpj: '' }));
    }

    if (onlyNums === '12345678901') {
      setExistingProdutores([{ cpfCnpj: masked, nome: 'PRODUTOR CADASTRADO NO PORTAL' }]);
    } else {
      setExistingProdutores([]);
    }
  };

  const fieldStyle = (fieldName?: string) => ({
    '& .MuiOutlinedInput-root': { 
        fontFamily: SCHIBSTED, fontSize: 16,
        '& fieldset': { borderColor: fieldName && errors[fieldName] ? '#FB4D56' : 'rgba(0, 0, 0, 0.23)' }
    },
    '& .MuiInputLabel-root': { 
      fontFamily: SCHIBSTED, fontSize: 16, 
      color: fieldName && errors[fieldName] ? '#FB4D56' : 'rgba(0, 0, 0, 0.60)',
      '&.Mui-focused': { color: fieldName && errors[fieldName] ? '#FB4D56' : '#0072C3' } 
    },
    '& .MuiFormHelperText-root': { color: '#FB4D56', fontFamily: SCHIBSTED, marginLeft: '14px', mt: 0.5 }
  });

  const isReadOnly = mode === 'view';

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 9999 }} 
      PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', height: '100%', border: 'none' } }}
    >
      
      {/* HEADER */}
      <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED }}>Preencha os dados do produtor</Typography>
        </Box>
      </Box>

      {/* CONTEÚDO */}
      <Box sx={{ flex: 1, px: '20px', pt: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
        
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Autocomplete
            freeSolo fullWidth disableClearable
            options={existingProdutores}
            open={existingProdutores.length > 0}
            // CORREÇÃO Z-INDEX AUTOCOMPLETE
            slotProps={{ popper: { sx: { zIndex: 10000 } } }}
            getOptionLabel={(opt: any) => typeof opt === 'string' ? opt : opt.cpfCnpj}
            inputValue={form.cpfCnpj || ''}
            onInputChange={(_, val) => handleCpfChange(val)}
            onChange={(_, val: any) => {
              if (val && typeof val !== 'string') {
                setForm(prev => ({ ...prev, nome: val.nome, cpfCnpj: val.cpfCnpj }));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="CPF/CNPJ" error={!!errors.cpfCnpj} helperText={errors.cpfCnpj} sx={fieldStyle('cpfCnpj')} disabled={isReadOnly} />
            )}
          />
          <TextField 
            fullWidth label="Nome do produtor" 
            value={form.nome || ''} 
            onChange={e => setForm({...form, nome: e.target.value})} 
            disabled={isReadOnly} sx={fieldStyle()} 
          />
        </Stack>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Informações</Typography>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField 
            fullWidth label="N° de estabelecimento" 
            value={form.numEstabelecimento || ''} 
            onChange={e => setForm({...form, numEstabelecimento: e.target.value.replace(/\D/g, "")})}
            error={!!errors.numEstabelecimento}
            helperText={errors.numEstabelecimento}
            disabled={isReadOnly} sx={fieldStyle('numEstabelecimento')} 
          />
          <TextField fullWidth label="N° da propriedade" value={form.nPropriedade || ''} onChange={e => setForm({...form, nPropriedade: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Matricula" value={form.matricula || ''} onChange={e => setForm({...form, matricula: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
          <FormControl fullWidth sx={fieldStyle()} disabled={isReadOnly}>
            <InputLabel>Filiada</InputLabel>
            <Select 
              label="Filiada" 
              value={form.filiada || ''} 
              onChange={e => setForm({...form, filiada: e.target.value as string})}
              // CORREÇÃO Z-INDEX SELECT
              MenuProps={globalMenuProps}
            >
              {filiadas.map(f => <MenuItem key={f.id} value={String(f.id)}>{f.nome}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle()} disabled={isReadOnly}>
            <InputLabel>Fase do dejeto</InputLabel>
            <Select 
              label="Fase do dejeto" 
              value={form.faseDejeto || 'GRSC'} 
              onChange={e => setForm({...form, faseDejeto: e.target.value as string})}
              MenuProps={globalMenuProps}
            >
              <MenuItem value="GRSC">GRSC</MenuItem><MenuItem value="Crechário">Crechário</MenuItem><MenuItem value="UPD">UPD</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Cabeças alojadas" value={form.cabecas || ''} onChange={e => setForm({...form, cabecas: e.target.value.replace(/\D/g, "")})} disabled={isReadOnly} sx={fieldStyle()} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle()} disabled={isReadOnly}>
            <InputLabel>Certificado</InputLabel>
            <Select 
              label="Certificado" 
              value={form.certificado || 'Não'} 
              onChange={e => setForm({...form, certificado: e.target.value as string})}
              MenuProps={globalMenuProps}
            >
              <MenuItem value="Sim">Sim</MenuItem><MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={fieldStyle()} disabled={isReadOnly}>
            <InputLabel>Doam dejetos</InputLabel>
            <Select 
              label="Doam dejetos" 
              value={form.doamDejetos || 'Não'} 
              onChange={e => setForm({...form, doamDejetos: e.target.value as string})}
              MenuProps={globalMenuProps}
            >
              <MenuItem value="Sim">Sim</MenuItem><MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle()} disabled={isReadOnly}>
            <InputLabel>Quantidades de lagoas</InputLabel>
            <Select 
              label="Quantidades de lagoas" 
              value={form.qtdLagoas || '1'} 
              onChange={e => setForm({...form, qtdLagoas: e.target.value as string})}
              MenuProps={globalMenuProps}
            >
              {['1','2','3','4','5'].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Volume das lagoas" value={form.volLagoas || ''} onChange={e => setForm({...form, volLagoas: e.target.value.replace(/\D/g, "")})} disabled={isReadOnly} sx={fieldStyle()} />
        </Stack>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Contato</Typography>
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Nome do responsável" value={form.responsavel || ''} onChange={e => setForm({...form, responsavel: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
          <TextField fullWidth label="Nome do técnico" value={form.tecnico || ''} onChange={e => setForm({...form, tecnico: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
        </Stack>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Localização</Typography>
        <TextField fullWidth label="Município" value={form.municipio || 'Toledo-PR'} onChange={e => setForm({...form, municipio: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Latitude" value={form.lat || ''} onChange={e => setForm({...form, lat: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
          <TextField fullWidth label="Longitude" value={form.long || ''} onChange={e => setForm({...form, long: e.target.value})} disabled={isReadOnly} sx={fieldStyle()} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth label="Distância" 
            value={form.distancia || ''} 
            onChange={e => setForm({...form, distancia: e.target.value.replace(/\D/g, "")})}
            disabled={isReadOnly} 
            sx={fieldStyle()} 
          />
          <TextField 
            fullWidth label="Localização" value="Ver no mapa" 
            disabled={true}
            sx={{ ...fieldStyle(), '& .MuiInputBase-input': { cursor: 'not-allowed' } }}
            InputProps={{ 
              readOnly: true, 
              startAdornment: ( <InputAdornment position="start"><MapIcon sx={{ color: 'rgba(0, 0, 0, 0.38)' }} /></InputAdornment> ) 
            }}
          />
        </Stack>
      </Box>

      {/* FOOTER */}
      <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', borderColor: 'rgba(0,0,0,0.23)' }}>
          VOLTAR
        </Button>
        {!isReadOnly && (
          <Button variant="contained" onClick={() => onSave(form)} disabled={!!errors.cpfCnpj} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 600 }}>
            SALVAR
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default ProdutorDrawer;