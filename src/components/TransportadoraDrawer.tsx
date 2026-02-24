import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, FormControl, InputLabel, Select, InputAdornment
} from '@mui/material';
import { CloseIcon } from '../constants/muiIcons';
import MapIcon from '@mui/icons-material/Map';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

// --- MÁSCARA CNPJ/CPF RÍGIDA ---
const applyMask = (value: string) => {
  const nums = value.replace(/\D/g, ""); 
  if (nums.length <= 11) {
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4").substring(0, 14);
  }
  return nums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5").substring(0, 18);
};

const globalMenuProps = { style: { zIndex: 10000 } };

const TransportadoraDrawer: React.FC<any> = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [form, setForm] = useState({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    status: 'Ativo',
    municipio: 'Toledo-PR',
    lat: '',
    long: '',
    distancia: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm(prev => ({ ...prev, ...initialData }));
      } else {
        setForm({
          nome: '', cpfCnpj: '', email: '', telefone: '', 
          status: 'Ativo', municipio: 'Toledo-PR', lat: '', long: '', distancia: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleCpfChange = (v: string) => {
    const onlyNums = v.replace(/\D/g, "");
    if (onlyNums === form.cpfCnpj.replace(/\D/g, "") && v.length > form.cpfCnpj.length) return;
    setForm({ ...form, cpfCnpj: applyMask(onlyNums) });
  };

  const fieldStyle = () => ({
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 },
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16 }
  });

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 9999 }} 
      PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', border: 'none' } }}
    >
      {/* HEADER */}
      <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>CADASTRO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED }}>Dados da Transportadora</Typography>
        </Box>
      </Box>

      {/* CONTEÚDO COM TODOS OS CAMPOS RESTAURADOS */}
      <Box sx={{ flex: 1, px: '20px', pt: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
        
        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Informações Gerais</Typography>
        
        <TextField fullWidth label="Nome da Transportadora" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} sx={fieldStyle()} />
        <TextField fullWidth label="CPF/CNPJ" value={form.cpfCnpj} onChange={e => handleCpfChange(e.target.value)} sx={fieldStyle()} />
        
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})} sx={fieldStyle()} />
          <TextField fullWidth label="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value.replace(/\D/g, "")})} sx={fieldStyle()} />
        </Stack>

        <FormControl fullWidth sx={fieldStyle()}>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value as string})} MenuProps={globalMenuProps}>
            <MenuItem value="Ativo">Ativo</MenuItem>
            <MenuItem value="Inativo">Inativo</MenuItem>
          </Select>
        </FormControl>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Localização</Typography>
        
        <TextField fullWidth label="Município" value={form.municipio} onChange={e => setForm({...form, municipio: e.target.value})} sx={fieldStyle()} />
        
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Latitude" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} sx={fieldStyle()} />
          <TextField fullWidth label="Longitude" value={form.long} onChange={e => setForm({...form, long: e.target.value})} sx={fieldStyle()} />
        </Stack>

        <Stack direction="row" spacing={2}>
          {/* CAMPO DISTÂNCIA EDITÁVEL (SÓ NÚMEROS) */}
          <TextField 
            fullWidth label="Distância" 
            value={form.distancia} 
            onChange={e => setForm({...form, distancia: e.target.value.replace(/\D/g, "")})}
            sx={fieldStyle()} 
          />
          {/* BOTÃO VER NO MAPA DESABILITADO */}
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

        {/* ÍCONES DE UPLOAD/DELETE COMENTADOS */}
        {/* <Typography sx={{ fontSize: 18, fontWeight: 600, fontFamily: INTER, mt: 1 }}>Anexos</Typography>
        <Stack direction="row" spacing={2}>
           <Button variant="outlined" startIcon={<MapIcon />} sx={{ color: '#0072C3', borderColor: '#0072C3' }}>UPLOAD DOCS</Button>
           <IconButton sx={{ color: '#FB4D56', border: '1px solid #FB4D56', borderRadius: '4px' }}><CloseIcon /></IconButton>
        </Stack> 
        */}
      </Box>

      {/* FOOTER */}
      <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', borderColor: 'rgba(0,0,0,0.23)' }}>
          VOLTAR
        </Button>
        <Button variant="contained" onClick={() => onSave(form)} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 600 }}>
          SALVAR
        </Button>
      </Box>
    </Drawer>
  );
};

export default TransportadoraDrawer;