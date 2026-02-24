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

const initialState: ProdutorFormInput = {
  cpfCnpj: '', nome: '', numEstabelecimento: '', nPropriedade: '', matricula: '', 
  filiada: '', faseDejeto: 'GRSC', cabecas: '', certificado: 'Não', doamDejetos: 'Não',
  qtdLagoas: '1', volLagoas: '', restricoes: 'Nenhuma', responsavel: '', tecnico: '', 
  municipio: 'Toledo-PR', lat: '', long: '', distancia: '', localizacao: ''
};

const BIOPLANTA_COORDS = { lat: -24.6865, lng: -53.9105 };

const ProdutorDrawer: React.FC<any> = ({ isOpen, onClose, onSave, mode = 'create', initialData = null }) => {
  const [form, setForm] = useState<ProdutorFormInput>(initialState);
  const [filiadas, setFiliadas] = useState<FiliadaOption[]>([]);

  useEffect(() => {
    const loadFiliadas = async () => {
      try { const data = await fetchFiliadas(); setFiliadas(data); } catch (err) { console.error(err); }
    };
    if (isOpen) loadFiliadas();
  }, [isOpen]);

  useEffect(() => {
    // Carrega dados iniciais sem sobrescrever com cálculo se o usuário não mudou nada ainda
    if (isOpen) {
        setForm(mode !== 'create' && initialData ? initialData : initialState);
    }
  }, [isOpen, mode, initialData]);

  // 🛡️ CÁLCULO AUTOMÁTICO INTELIGENTE
  // Só recalcula se Latitude ou Longitude mudarem E se não for a primeira carga de edição
  useEffect(() => {
    if (!isOpen || mode === 'view') return; // Não calcula se fechado ou apenas visualizando

    const lat = parseFloat(form.lat?.replace(',', '.'));
    const lon = parseFloat(form.long?.replace(',', '.'));
    
    // Coordenadas da Planta (Exemplo: Toledo-PR)
    const PLANT_COORDS = BIOPLANTA_COORDS; 

    // Verifica se as coordenadas atuais são diferentes das iniciais (evita sobrescrever valor do banco ao abrir)
    const initialLat = initialData?.lat ? parseFloat(initialData.lat.replace(',', '.')) : NaN;
    const initialLon = initialData?.long ? parseFloat(initialData.long.replace(',', '.')) : NaN;

    const coordsChanged = (lat !== initialLat) || (lon !== initialLon);

    if (!isNaN(lat) && !isNaN(lon) && coordsChanged) {
      const R = 6371; // Raio da Terra em km
      const dLat = (lat - PLANT_COORDS.lat) * Math.PI / 180;
      const dLon = (lon - PLANT_COORDS.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) ** 2 + Math.cos(PLANT_COORDS.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon/2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = Math.round(R * c);
      
      setForm(prev => ({ ...prev, distancia: `${d} KM` }));
    }
  }, [form.lat, form.long, isOpen, mode, initialData]);
  

  const handleChange = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const fieldStyle = {
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 },
    '& .MuiInputLabel-root': { 
      fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0, 0, 0, 0.60)',
      '&.Mui-focused': { color: '#0072C3' } 
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0072C3' }
  };

  const menuProps = { disablePortal: true, PaperProps: { sx: { zIndex: 10000 } } };
  const isReadOnly = mode === 'view';

  const handleOpenMap = () => {
    if (form.lat && form.long) {
      const lat = form.lat.replace(',', '.');
      const lon = form.long.replace(',', '.');
      window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column', height: '100%' } }}>
      
      <Box sx={{ p: '48px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>CADASTRO</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 1, fontFamily: SCHIBSTED }}>Preencha os dados do cooperado</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', pb: '40px' }}>
        
        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="CPF/CNPJ" value={form.cpfCnpj} onChange={e => handleChange('cpfCnpj', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
          <TextField fullWidth label="Nome do produtor" value={form.nome} onChange={e => handleChange('nome', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Informações</Typography>

        <Stack direction="row" spacing={2}>
          <Autocomplete 
            freeSolo fullWidth disablePortal options={['3.192', '102646']} 
            value={form.numEstabelecimento} onInputChange={(_, v) => handleChange('numEstabelecimento', v)}
            disabled={isReadOnly}
            renderInput={(params) => <TextField {...params} label="N° de estabelecimento" sx={fieldStyle} />} 
          />
          <TextField fullWidth label="N° da propriedade" value={form.nPropriedade} onChange={e => handleChange('nPropriedade', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Matricula" value={form.matricula} onChange={e => handleChange('matricula', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
          <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
            <InputLabel>Filiada</InputLabel>
            <Select label="Filiada" value={form.filiada} onChange={e => handleChange('filiada', e.target.value as string)} MenuProps={menuProps}>
              {filiadas.map(f => <MenuItem key={f.id} value={String(f.id)}>{f.nome}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
            <InputLabel>Fase do dejeto</InputLabel>
            <Select label="Fase do dejeto" value={form.faseDejeto} onChange={e => handleChange('faseDejeto', e.target.value as string)} MenuProps={menuProps}>
              <MenuItem value="GRSC">GRSC</MenuItem><MenuItem value="Crechário">Crechário</MenuItem><MenuItem value="UPD">UPD</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Cabeças alojadas" type="number" value={form.cabecas} onChange={e => handleChange('cabecas', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
            <InputLabel>Certificado</InputLabel>
            <Select label="Certificado" value={form.certificado} onChange={e => handleChange('certificado', e.target.value as string)} MenuProps={menuProps}>
              <MenuItem value="Sim">Sim</MenuItem><MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
            <InputLabel>Doam dejetos</InputLabel>
            <Select label="Doam dejetos" value={form.doamDejetos} onChange={e => handleChange('doamDejetos', e.target.value as string)} MenuProps={menuProps}>
              <MenuItem value="Sim">Sim</MenuItem><MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
            <InputLabel>Quantidades de lagoas</InputLabel>
            <Select label="Quantidades de lagoas" value={form.qtdLagoas} onChange={e => handleChange('qtdLagoas', e.target.value as string)} MenuProps={menuProps}>
              {['1','2','3','4','5'].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Volume das lagoas" value={form.volLagoas} onChange={e => handleChange('volLagoas', e.target.value)} disabled={isReadOnly} sx={fieldStyle} />
        </Stack>

        <FormControl fullWidth sx={fieldStyle} disabled={isReadOnly}>
          <InputLabel>Restrições operacionais</InputLabel>
          <Select label="Restrições operacionais" value={form.restricoes} onChange={e => handleChange('restricoes', e.target.value as string)} MenuProps={menuProps}>
            <MenuItem value="Nenhuma">Nenhuma</MenuItem><MenuItem value="Acesso">Dificuldade de acesso</MenuItem>
          </Select>
        </FormControl>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Contato</Typography>

        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Nome do responsável" value={form.responsavel} onChange={e => handleChange('responsavel', e.target.value)} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: !!form.responsavel || isReadOnly }} />
          <TextField fullWidth label="Nome do técnico" value={form.tecnico} onChange={e => handleChange('tecnico', e.target.value)} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: !!form.tecnico || isReadOnly }} />
        </Stack>

        <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: INTER }}>Localização</Typography>

        <TextField fullWidth label="Município" value={form.municipio} onChange={e => handleChange('municipio', e.target.value)} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: !!form.municipio || isReadOnly }} />

        <Stack direction="row" spacing={2}>
          <TextField fullWidth label="Latitude" value={form.lat} onChange={e => handleChange('lat', e.target.value)} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: !!form.lat || isReadOnly }} />
          <TextField fullWidth label="Longitude" value={form.long} onChange={e => handleChange('long', e.target.value)} disabled={isReadOnly} sx={fieldStyle} InputLabelProps={{ shrink: !!form.long || isReadOnly }} />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth 
            label="Distância (Calculada)" 
            value={form.distancia} 
            onChange={e => handleChange('distancia', e.target.value)}
            sx={fieldStyle} 
            disabled={isReadOnly}
            helperText="Calculado automaticamente via coordenadas, mas pode ser ajustado."
          />
          <TextField 
            fullWidth label="Localização" value="Ver no mapa" sx={{ ...fieldStyle, cursor: 'pointer', '& input': { cursor: 'pointer' } }}
            onClick={handleOpenMap}
            InputProps={{ 
              readOnly: true, 
              startAdornment: (
                <InputAdornment position="start">
                  <MapIcon sx={{ color: 'rgba(0, 0, 0, 0.38)' }} />
                </InputAdornment>
              )
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
        <Button variant="outlined" onClick={onClose} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)', borderColor: 'rgba(0,0,0,0.23)' }}>CANCELAR</Button>
        {!isReadOnly && <Button variant="contained" onClick={() => onSave(form)} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 600 }}>SALVAR</Button>}
      </Box>
    </Drawer>
  );
};

export default ProdutorDrawer;