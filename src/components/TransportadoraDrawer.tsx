import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, CircularProgress 
} from '@mui/material';
// 🛡️ Importações diretas para evitar erros de exportação
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useTransportadoraMutation } from '../hooks/useTransportadoraMutation';
import { UF_OPTIONS } from '../constants/transportadoraOptions';
import { 
  fetchCategorias,
  fetchVeiculoTipos, 
  fetchVeiculoCombustiveis, 
  type CategoriaOption, 
  type VeiculoTipoOption, 
  type VeiculoCombustivelOption 
} from '../services/api';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const INTER = 'Inter, sans-serif';

const TransportadoraDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  const { createTransportadora, updateTransportadora, isLoading } = useTransportadoraMutation();
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VeiculoTipoOption[]>([]);
  const [fuelTypes, setFuelTypes] = useState<VeiculoCombustivelOption[]>([]);
  
  const [form, setForm] = useState<any>({ 
    cnpj: '', nomeFantasia: '', razaoSocial: '', categoria: '', 
    enderecoCompleto: '', cidade: '', uf: '', nomeContato: '', 
    telefone: '', email: '', veiculos: [] 
  });
  
  const [showVehicleFields, setShowVehicleFields] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({ tipo: '', placa: '', tipoAbastecimento: '', capacidade: '' });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [cats, tipos, fuels] = await Promise.all([fetchCategorias(), fetchVeiculoTipos(), fetchVeiculoCombustiveis()]);
        setCategorias(cats); setVehicleTypes(tipos); setFuelTypes(fuels);
      } catch (err) { console.error('Erro ao carregar metadados:', err); }
    };
    if (isOpen) loadMetadata();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          cnpj: initialData.cnpj || '', nomeFantasia: initialData.nomeFantasia || '', razaoSocial: initialData.razaoSocial || '',
          categoria: initialData.categoria || '', enderecoCompleto: initialData.endereco || '', cidade: initialData.cidade || '',
          uf: initialData.uf || '', nomeContato: initialData.contatoPrincipal?.nome || '', telefone: initialData.telefoneComercial || '',
          email: initialData.emailComercial || '', veiculos: initialData.veiculos || []
        });
      } else { 
        setForm({ cnpj: '', nomeFantasia: '', razaoSocial: '', categoria: '', enderecoCompleto: '', cidade: '', uf: '', nomeContato: '', telefone: '', email: '', veiculos: [] }); 
      }
      setShowVehicleFields(false);
    }
  }, [isOpen, initialData]);

  const handleAddVehicle = () => {
    if (!showVehicleFields) { setShowVehicleFields(true); return; }
    if (!currentVehicle.tipo || !currentVehicle.placa) return;
    setForm((prev: any) => ({ ...prev, veiculos: [...(prev.veiculos || []), { ...currentVehicle, id: Math.random() }] }));
    setCurrentVehicle({ tipo: '', placa: '', tipoAbastecimento: '', capacidade: '' });
    setShowVehicleFields(false);
  };

  const handleSave = async () => {
    let veiculosList = [...(form.veiculos || [])];
    if (showVehicleFields && currentVehicle.tipo && currentVehicle.placa) {
      veiculosList.push({ ...currentVehicle, id: Math.random() });
    }
    const cleanPhone = (phone: string) => phone ? phone.replace(/\D/g, '') : '';
    
    const payload: any = {
      nomeFantasia: form.nomeFantasia.trim(), 
      razaoSocial: form.razaoSocial.trim(), 
      // 🛡️ Envia CNPJ como está no input (formatado), conforme exemplo do Swagger
      cnpj: form.cnpj.trim(), 
      categoria: form.categoria.trim(),
      endereco: form.enderecoCompleto.trim(), 
      cidade: form.cidade.trim(), 
      uf: form.uf.trim(), 
      
      telefoneComercial: cleanPhone(form.telefone),
      emailComercial: form.email.trim(), 
      
      // Campos da raiz (para satisfazer validação se houver)
      telefone: cleanPhone(form.telefone),
      email: form.email.trim(),
      
      contatoPrincipal: { 
        nome: form.nomeContato, 
        telefone: cleanPhone(form.telefone), 
        email: form.email 
      },
      
      veiculos: veiculosList.map(v => ({ 
        tipo: v.tipo, 
        placa: v.placa, 
        // Garante que capacidade seja string e não vazia
        capacidade: String(v.capacidade || '0'), 
        tipoAbastecimento: v.tipoAbastecimento 
      }))
    };

    if (initialData?.id) {
      const result = await updateTransportadora(initialData.id, payload);
      if (result) onSave();
    } else {
      // 🛡️ CRIAÇÃO DIRETA: O backend aceita lista de veículos
      const result = await createTransportadora(payload);
      if (result) onSave();
    }
  };

  // 🛡️ ESTILO PORTARIA: Floating labels sem shrink fixo
  const fieldStyle = { 
    '& .MuiOutlinedInput-root': { fontFamily: SCHIBSTED, fontSize: 16 }, 
    '& .MuiInputLabel-root': { fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0, 0, 0, 0.60)' } 
  };
  
  // 🛡️ FIX DE Z-INDEX PARA MENUS
  const selectMenuProps = { MenuProps: { disablePortal: true } };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose} 
      sx={{ zIndex: 5000 }} 
      PaperProps={{ sx: { width: 620, border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}
    >
      {/* HEADER FIXO */}
      <Box sx={{ p: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', flexShrink: 0 }}>
        <Box>
          <Typography sx={{ color: 'black', fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>CADASTRO</Typography>
          <Typography sx={{ color: 'black', fontSize: 16, mt: 0.5, fontFamily: SCHIBSTED }}>Preencha os dados da transportadora</Typography>
        </Box>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {/* BODY SCROLLABLE */}
      <Box sx={{ flex: 1, p: '20px', overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Typography sx={{ color: 'black', fontFamily: INTER, fontWeight: 600, fontSize: 24 }}>Identificação</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="CNPJ" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Nome Fantasia" value={form.nomeFantasia} onChange={e => setForm({...form, nomeFantasia: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Razão Social" value={form.razaoSocial} onChange={e => setForm({...form, razaoSocial: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth select label="Categoria" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} disabled={isReadOnly} sx={fieldStyle} SelectProps={selectMenuProps}>
              {categorias.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Stack>

          <Typography sx={{ color: 'black', mt: 1, fontFamily: INTER, fontWeight: 600, fontSize: 24 }}>Contato</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Nome" value={form.nomeContato} onChange={e => setForm({...form, nomeContato: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <TextField fullWidth label="E-mail" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />

          <Typography sx={{ color: 'black', mt: 1, fontFamily: INTER, fontWeight: 600, fontSize: 24 }}>Endereço</Typography>
          <TextField fullWidth label="Endereço completo" value={form.enderecoCompleto} onChange={e => setForm({...form, enderecoCompleto: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Cidade" value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth select label="UF" value={form.uf} onChange={e => setForm({...form, uf: e.target.value})} disabled={isReadOnly} sx={fieldStyle} SelectProps={selectMenuProps}>
              {UF_OPTIONS.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Stack>

          <Typography sx={{ color: 'black', mt: 1, fontFamily: INTER, fontWeight: 600, fontSize: 24 }}>Veículos</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!form.veiculos?.length ? (
              <Typography sx={{ color: 'rgba(0,0,0,0.4)', fontSize: 14, fontStyle: 'italic', fontFamily: SCHIBSTED }}>Não há veículos cadastrados.</Typography>
            ) : form.veiculos.map((v: any, index: number) => (
              <Box key={v.id || index} sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2, bgcolor: 'white' }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                   <Box><Typography variant="caption" sx={{ fontFamily: SCHIBSTED }}>TIPO</Typography><Typography variant="body1" fontWeight={700} sx={{ fontFamily: SCHIBSTED }}>{v.tipo}</Typography></Box>
                   <Box textAlign="right"><Typography variant="caption" sx={{ fontFamily: SCHIBSTED }}>PLACA</Typography><Typography variant="body1" fontWeight={700} sx={{ fontFamily: SCHIBSTED }}>{v.placa}</Typography></Box>
                </Stack>
                <Typography variant="caption" sx={{ fontFamily: SCHIBSTED }}>COMBUSTÍVEL</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ fontFamily: SCHIBSTED }}>{v.tipoAbastecimento}</Typography>
              </Box>
            ))}
          </Box>
          
          {showVehicleFields && !isReadOnly && (
            <Stack spacing={2} sx={{ p: 2, border: '1px dashed rgba(0,0,0,0.12)', borderRadius: 2 }}>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth select label="Tipo" value={currentVehicle.tipo} onChange={e => setCurrentVehicle({...currentVehicle, tipo: e.target.value})} sx={fieldStyle} SelectProps={selectMenuProps}>
                  {vehicleTypes.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </TextField>
                <TextField fullWidth label="Placa" value={currentVehicle.placa} onChange={e => setCurrentVehicle({...currentVehicle, placa: e.target.value.toUpperCase()})} sx={fieldStyle} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField fullWidth select label="Abastecimento" value={currentVehicle.tipoAbastecimento} onChange={e => setCurrentVehicle({...currentVehicle, tipoAbastecimento: e.target.value})} sx={fieldStyle} SelectProps={selectMenuProps}>
                  {fuelTypes.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </TextField>
                <TextField fullWidth label="Capacidade(L)" type="number" value={currentVehicle.capacidade} onChange={e => setCurrentVehicle({...currentVehicle, capacidade: e.target.value})} sx={fieldStyle} />
              </Stack>
            </Stack>
          )}
          {!isReadOnly && <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={handleAddVehicle} sx={{ height: 48, color: '#0072C3', fontWeight: 600, fontFamily: SCHIBSTED, borderColor: 'rgba(0, 114, 195, 0.5)' }}>{showVehicleFields ? 'CONFIRMAR VEÍCULO' : 'ADICIONAR VEÍCULO'}</Button>}
        </Stack>
      </Box>

      {/* FOOTER FIXO */}
      {!isReadOnly && (
        <Box sx={{ p: '24px 20px', bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button fullWidth variant="outlined" onClick={onClose} sx={{ height: 48, fontFamily: SCHIBSTED, color: 'rgba(0, 0, 0, 0.60)', borderColor: 'rgba(0, 0, 0, 0.23)' }}>CANCELAR</Button>
          <Button fullWidth variant="contained" onClick={handleSave} disabled={isLoading} sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 600 }}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'SALVAR'}
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default TransportadoraDrawer;