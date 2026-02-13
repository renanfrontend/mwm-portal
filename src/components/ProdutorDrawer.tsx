import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, Autocomplete 
} from '@mui/material';
import { CloseIcon } from '../constants/muiIcons';
import type { ProdutorFormInput } from '../types/cooperado';
import { fetchFiliadas, type FiliadaOption } from '../services/api';

const initialState: ProdutorFormInput = {
  cpfCnpj: '', nome: '', numEstabelecimento: '', nPropriedade: '', matricula: '', 
  filiada: '', faseDejeto: 'GRSC', cabecas: '', certificado: 'Não', doamDejetos: 'Não',
  qtdLagoas: '1', volLagoas: '', restricoes: 'Nenhuma', responsavel: '', tecnico: '', 
  municipio: 'Toledo-PR', lat: '', long: '', distancia: '', localizacao: ''
};

type DrawerMode = 'create' | 'view' | 'edit';

const ProdutorDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProdutorFormInput) => void;
  mode?: DrawerMode;
  initialData?: ProdutorFormInput | null;
}> = ({ isOpen, onClose, onSave, mode = 'create', initialData = null }) => {
  const [form, setForm] = useState<ProdutorFormInput>(initialState);
  const [filiadas, setFiliadas] = useState<FiliadaOption[]>([]);

  // Carregar filiadas ao montar
  useEffect(() => {
    const loadFiliadas = async () => {
      try {
        console.log('🚀 Carregando filiadas...');
        const data = await fetchFiliadas();
        console.log('✅ Filiadas carregadas:', data);
        setFiliadas(data);
      } catch (err) {
        console.error('❌ Erro ao carregar filiadas:', err);
      }
    };
    loadFiliadas();
  }, []);

  // Blinda o estado: inicializa ao abrir
  useEffect(() => {
    if (!isOpen) return;
    if (mode !== 'create' && initialData) {
      setForm(initialData);
      return;
    }
    setForm(initialState);
  }, [isOpen, mode, initialData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const commonFont = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };
  const isReadOnly = mode === 'view';
  const title = mode === 'edit' ? 'EDITAR' : 'CADASTRO';
  const subtitle = mode === 'edit' ? 'Edite os dados do produtor' : 'Preencha os dados do produtor';

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 1200 }} 
      PaperProps={{ sx: { width: 620, border: 'none', display: 'flex', flexDirection: 'column' } }}
    >
      {/* HEADER */}
      <Box sx={{ p: '24px 32px 24px 20px', bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: 'black', fontSize: 32, fontWeight: 700, ...commonFont }}>{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
        <Typography sx={{ color: 'black', fontSize: 16, mt: 0.5, ...commonFont }}>{subtitle}</Typography>
      </Box>

      {/* ÁREA DE CAMPOS SCROLLABLE */}
      <Box sx={{ flex: 1, p: '24px 20px', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="CPF/CNPJ" value={form.cpfCnpj} onChange={(e) => handleChange('cpfCnpj', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
            <TextField fullWidth label="Nome do produtor" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, ...commonFont }}>Informações</Typography>
          <Stack direction="row" spacing={2}>
            <Autocomplete 
              freeSolo 
              fullWidth 
              options={['3.192', '102646']} 
              value={form.numEstabelecimento || ''} 
              onInputChange={(_, v) => handleChange('numEstabelecimento', v || '')} 
              disabled={isReadOnly}
              renderInput={(params) => <TextField {...params} label="N° de estabelecimento" InputLabelProps={{ shrink: true }} />} 
            />
            <TextField fullWidth label="N° da propriedade" value={form.nPropriedade} onChange={(e) => handleChange('nPropriedade', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Matrícula" value={form.matricula} onChange={(e) => handleChange('matricula', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
            <TextField 
              fullWidth 
              select 
              label="Filiada" 
              value={form.filiada} 
              onChange={(e) => handleChange('filiada', e.target.value)} 
              InputLabelProps={{ shrink: true }} 
              disabled={isReadOnly}
            >
              <MenuItem value="">Selecione</MenuItem>
              {filiadas.map((filiada) => (
                <MenuItem key={filiada.id} value={filiada.id}>
                  {filiada.nome}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField fullWidth select label="Fase do dejeto" value={form.faseDejeto} onChange={(e) => handleChange('faseDejeto', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly}>
              <MenuItem value="GRSC">GRSC</MenuItem>
              <MenuItem value="Crechário">Crechário</MenuItem>
              <MenuItem value="UPD">UPD</MenuItem>
            </TextField>
            <TextField fullWidth label="Cabeças alojadas" type="number" value={form.cabecas} onChange={(e) => handleChange('cabecas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField fullWidth select label="Certificado" value={form.certificado} onChange={(e) => handleChange('certificado', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly}>
              <MenuItem value="Sim">Sim</MenuItem>
              <MenuItem value="Não">Não</MenuItem>
            </TextField>
            <TextField fullWidth select label="Doam dejetos" value={form.doamDejetos} onChange={(e) => handleChange('doamDejetos', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly}>
              <MenuItem value="Sim">Sim</MenuItem>
              <MenuItem value="Não">Não</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField fullWidth select label="Quantidades de lagoas" value={form.qtdLagoas} onChange={(e) => handleChange('qtdLagoas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly}>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
            </TextField>
            <TextField fullWidth label="Volume das lagoas" value={form.volLagoas} onChange={(e) => handleChange('volLagoas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 4, ...commonFont }}>Contato</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Nome do responsável" value={form.responsavel} onChange={(e) => handleChange('responsavel', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
            <TextField fullWidth label="Nome do técnico" value={form.tecnico} onChange={(e) => handleChange('tecnico', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 4, ...commonFont }}>Localização</Typography>
          <TextField fullWidth label="Município" value={form.municipio} onChange={(e) => handleChange('municipio', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Latitude" value={form.lat} onChange={(e) => handleChange('lat', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
            <TextField fullWidth label="Longitude" value={form.long} onChange={(e) => handleChange('long', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isReadOnly} />
          </Stack>
        </Stack>
      </Box>

      {/* FOOTER */}
      <Box sx={{ 
          p: '24px 20px', 
          bgcolor: 'white', 
          borderTop: '1px solid rgba(0,0,0,0.12)', 
          display: 'flex', 
          gap: 2
      }}>
        <Button fullWidth variant="outlined" onClick={onClose} sx={{ height: 48, borderRadius: '4px', ...commonFont }}>
          {isReadOnly ? 'FECHAR' : 'CANCELAR'}
        </Button>
        {!isReadOnly && (
          <Button fullWidth variant="contained" sx={{ height: 48, borderRadius: '4px', bgcolor: '#0072C3', ...commonFont }} onClick={() => onSave(form)}>
            SALVAR
          </Button>
        )}
      </Box>
    </Drawer>
  );
};

export default ProdutorDrawer;