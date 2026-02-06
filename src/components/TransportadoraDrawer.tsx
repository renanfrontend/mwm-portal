import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, Chip 
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';

const COMMON_FONT_STYLE = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const TransportadoraDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  // 🛡️ ESTADO COMPLETO: Inicializado com strings vazias para garantir que todos os campos apareçam e a label não flutue sozinha
  const [form, setForm] = useState<any>({ 
    cnpj: '', nomeFantasia: '', razaoSocial: '', categoria: '', 
    enderecoCompleto: '', cidade: '', uf: '', 
    nomeContato: '', telefone: '', email: '', veiculos: [] 
  });
  
  const [showVehicleFields, setShowVehicleFields] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({ tipo: '', placa: '', abastecimento: '', capacidade: '' });

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? 
        { ...initialData, enderecoCompleto: initialData.logradouro || '' } : 
        { cnpj: '', nomeFantasia: '', razaoSocial: '', categoria: '', enderecoCompleto: '', cidade: '', uf: '', nomeContato: '', telefone: '', email: '', veiculos: [] }
      );
      setShowVehicleFields(false);
    }
  }, [isOpen, initialData]);

  // Estilo de Blur para modo visualização e Fonte do Design System
  const fieldStyle = {
    '& .MuiOutlinedInput-root': { 
      backgroundColor: isReadOnly ? 'rgba(245, 245, 245, 0.5)' : 'inherit', 
      filter: isReadOnly ? 'blur(0.5px)' : 'none', 
      pointerEvents: isReadOnly ? 'none' : 'auto', 
      ...COMMON_FONT_STYLE 
    },
    '& .MuiInputLabel-root': { ...COMMON_FONT_STYLE }
  };

  const handleAddVehicle = () => {
    if (!showVehicleFields) { setShowVehicleFields(true); return; }
    if (!currentVehicle.tipo || !currentVehicle.placa) return;
    setForm((prev: any) => ({ ...prev, veiculos: [...(prev.veiculos || []), { ...currentVehicle, id: Math.random() }] }));
    setCurrentVehicle({ tipo: '', placa: '', abastecimento: '', capacidade: '' });
  };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 5000 }} // 🛡️ FIX: Acima do Header azul
      PaperProps={{ sx: { width: 620, border: 'none', overflow: 'hidden' } }}
    >
      {/* HEADER FIXO */}
      <Box sx={{ p: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ color: 'black', fontSize: 32, fontWeight: 700, ...COMMON_FONT_STYLE }}>CADASTRO</Typography>
          <Typography sx={{ color: 'black', fontSize: 16, mt: 0.5, ...COMMON_FONT_STYLE }}>Preencha os dados da transportadora</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {/* BODY SCROLLABLE: Renderiza sempre, independente de ser visualização ou edição */}
      <Box sx={{ flex: 1, p: '20px', overflowY: 'auto', pb: '100px' }}>
        <Stack spacing={3}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, ...COMMON_FONT_STYLE }}>Identificação</Typography>
          <Stack direction="row" spacing={2}>
            {/* 🛡️ COMPORTAMENTO NATIVO: Sem shrink para a label ficar dentro */}
            <TextField fullWidth label="CNPJ" variant="outlined" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Nome Fantasia" variant="outlined" value={form.nomeFantasia} onChange={e => setForm({...form, nomeFantasia: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Razão Social" variant="outlined" value={form.razaoSocial || ''} onChange={e => setForm({...form, razaoSocial: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Categoria" variant="outlined" value={form.categoria || ''} onChange={e => setForm({...form, categoria: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Endereço</Typography>
          <TextField fullWidth label="Endereço completo" variant="outlined" value={form.enderecoCompleto} onChange={e => setForm({...form, enderecoCompleto: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Cidade" variant="outlined" value={form.cidade || ''} onChange={e => setForm({...form, cidade: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="UF" variant="outlined" value={form.uf || ''} onChange={e => setForm({...form, uf: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Contato</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Nome" variant="outlined" value={form.nomeContato || ''} onChange={e => setForm({...form, nomeContato: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Telefone" variant="outlined" value={form.telefone || ''} onChange={e => setForm({...form, telefone: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <TextField fullWidth label="E-mail" variant="outlined" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Veículo</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(form.veiculos || []).map((v: any) => (
              <Chip key={v.id} label={`${v.tipo} | ${v.placa}`} onDelete={isReadOnly ? undefined : () => {}} sx={{ borderRadius: '4px', bgcolor: '#F5F5F5', ...COMMON_FONT_STYLE }} />
            ))}
          </Box>

          {/* CAMPOS DE VEÍCULO (SELECTS) */}
          {showVehicleFields && !isReadOnly && (
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField fullWidth select label="Tipo de veículo" variant="outlined" value={currentVehicle.tipo} onChange={e => setCurrentVehicle({...currentVehicle, tipo: e.target.value})} sx={fieldStyle}>
                        <MenuItem value="Caminhão Truck">Caminhão Truck</MenuItem>
                        <MenuItem value="Carreta">Carreta</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Placa" variant="outlined" value={currentVehicle.placa} onChange={e => setCurrentVehicle({...currentVehicle, placa: e.target.value.toUpperCase()})} sx={fieldStyle} />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField fullWidth select label="Tipo de abastecimento" variant="outlined" value={currentVehicle.abastecimento} onChange={e => setCurrentVehicle({...currentVehicle, abastecimento: e.target.value})} sx={fieldStyle}>
                        <MenuItem value="Diesel">Diesel</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Capacidade máxima(L)" variant="outlined" type="number" value={currentVehicle.capacidade} onChange={e => setCurrentVehicle({...currentVehicle, capacidade: e.target.value})} sx={fieldStyle} />
                </Stack>
            </Stack>
          )}

          {!isReadOnly && <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={handleAddVehicle} sx={{ height: '40px', color: '#0072C3', fontWeight: 600, ...COMMON_FONT_STYLE }}>ADICIONAR VEÍCULO</Button>}
        </Stack>
      </Box>

      {/* 🛡️ FOOTER BLINDADO: Removido apenas os botões se isReadOnly for true */}
      {!isReadOnly && (
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
          <Button fullWidth variant="outlined" onClick={onClose} sx={{ height: 48, color: 'rgba(0,0,0,0.6)', ...COMMON_FONT_STYLE }}>CANCELAR</Button>
          <Button fullWidth variant="contained" onClick={() => onSave(form)} sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT_STYLE }}>SALVAR</Button>
        </Box>
      )}
    </Drawer>
  );
};

export default TransportadoraDrawer;