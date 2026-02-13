import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Drawer, MenuItem, CircularProgress, Alert 
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, DirectionsCar, LocalGasStation, Delete as DeleteIcon, ConfirmationNumber } from '@mui/icons-material';
import { useTransportadoraMutation } from '../hooks/useTransportadoraMutation';
import type { TransportadoraFormInput } from '../types/transportadora';
import { UF_OPTIONS } from '../constants/transportadoraOptions';
import { fetchCategorias, fetchVeiculoTipos, fetchVeiculoCombustiveis, type CategoriaOption, type VeiculoTipoOption, type VeiculoCombustivelOption } from '../services/api';

const COMMON_FONT_STYLE = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const TransportadoraDrawer: React.FC<any> = ({ isOpen, isReadOnly = false, onClose, onSave, initialData }) => {
  const { createTransportadora, updateTransportadora, isLoading, error } = useTransportadoraMutation();
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VeiculoTipoOption[]>([]);
  const [fuelTypes, setFuelTypes] = useState<VeiculoCombustivelOption[]>([]);

  // Carregar categorias ao montar
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        console.log('🚀 Iniciando carregamento de categorias...');
        const data = await fetchCategorias();
        console.log('✅ Categorias carregadas:', data);
        setCategorias(data);
      } catch (err) {
        console.error('❌ Erro ao carregar categorias:', err);
      }
    };
    loadCategorias();
  }, []);

  // Carregar tipos de veículo e combustível ao montar (igual as categorias)
  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        console.log('🚀 Iniciando carregamento de tipos de veículo e combustível...');
        
        const [tipos, combustiveis] = await Promise.all([
          fetchVeiculoTipos(),
          fetchVeiculoCombustiveis()
        ]);
        
        console.log('✅ Tipos de veículo carregados:', tipos);
        console.log('✅ Tipos de combustível carregados:', combustiveis);
        
        setVehicleTypes(tipos);
        setFuelTypes(combustiveis);
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados de veículo:', err);
      }
    };
    loadVehicleData();
  }, []);
  
  // 🛡️ ESTADO COMPLETO: Inicializado com strings vazias para garantir que todos os campos apareçam e a label não flutue sozinha
  const [form, setForm] = useState<any>({ 
    cnpj: '', nomeFantasia: '', razaoSocial: '', categoria: '', 
    enderecoCompleto: '', cidade: '', uf: '', 
    nomeContato: '', telefone: '', email: '', veiculos: [] 
  });
  
  const [showVehicleFields, setShowVehicleFields] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({ 
    tipo: '', 
    placa: '', 
    tipoAbastecimento: '', 
    capacidade: '' 
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          cnpj: initialData.cnpj || '',
          nomeFantasia: initialData.nomeFantasia || '',
          razaoSocial: initialData.razaoSocial || '',
          categoria: initialData.categoria || '',
          enderecoCompleto: initialData.endereco || initialData.logradouro || '',
          cidade: initialData.cidade || '',
          uf: initialData.uf || '',
          nomeContato: initialData.contatoPrincipal?.nome || initialData.contatoComercial?.nome || '',
          telefone: initialData.contatoComercial?.telefone || initialData.contatoPrincipal?.telefone || initialData.telefoneComercial || '',
          email: initialData.contatoComercial?.email || initialData.contatoPrincipal?.email || initialData.emailComercial || '',
          veiculos: initialData.veiculos || []
        });
      } else {
        setForm({
          cnpj: '',
          nomeFantasia: '',
          razaoSocial: '',
          categoria: '',
          enderecoCompleto: '',
          cidade: '',
          uf: '',
          nomeContato: '',
          telefone: '',
          email: '',
          veiculos: []
        });
      }
      setShowVehicleFields(false);
      setCurrentVehicle({ 
        tipo: '', 
        placa: '', 
        tipoAbastecimento: '', 
        capacidade: '' 
      });
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
    if (!showVehicleFields) { 
      setShowVehicleFields(true); 
      return; 
    }
    if (!currentVehicle.tipo || !currentVehicle.placa) return;
    setForm((prev: any) => ({ ...prev, veiculos: [...(prev.veiculos || []), { ...currentVehicle, id: Math.random() }] }));
    setCurrentVehicle({ 
      tipo: '', 
      placa: '', 
      tipoAbastecimento: '', 
      capacidade: '' 
    });
  };

  const handleRemoveVehicle = (index: number) => {
    setForm((prev: any) => {
        const newVeiculos = [...(prev.veiculos || [])];
        newVeiculos.splice(index, 1);
        return { ...prev, veiculos: newVeiculos };
    });
  };

  const handleSave = async () => {
    // 🛡️ VALIDAÇÃO: Verifica campos obrigatórios antes de enviar (apenas da transportadora)
    const errors: string[] = [];
    
    if (!form.nomeFantasia?.trim()) errors.push('Nome Fantasia é obrigatório');
    if (!form.razaoSocial?.trim()) errors.push('Razão Social é obrigatória');
    if (!form.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!form.categoria?.trim()) errors.push('Categoria é obrigatória');
    if (!form.enderecoCompleto?.trim()) errors.push('Endereço é obrigatório');
    if (!form.cidade?.trim()) errors.push('Cidade é obrigatória');
    if (!form.uf?.trim()) errors.push('UF é obrigatória');
    if (!form.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!form.email?.trim()) errors.push('E-mail é obrigatório');

    // Validação de contatos - preenche todos os contatos com os mesmos dados do formulário
    const contatoData = (form.nomeContato || form.telefone || form.email)
      ? {
          nome: form.nomeContato || '',
          telefone: form.telefone || '',
          email: form.email || ''
        }
      : {
          nome: '',
          telefone: '',
          email: ''
        };

    const contatoPrincipal = contatoData;

    // 🛡️ VEÍCULOS SÃO OPCIONAIS: Só processa se houver dados preenchidos
    let veiculos: any[] = [];
    let veiculosList = [...(form.veiculos || [])];
    
    // Inclui o veículo que está nos campos de input se o usuário esqueceu de clicar em "Adicionar"
    if (showVehicleFields && currentVehicle.tipo && currentVehicle.placa && currentVehicle.tipoAbastecimento && currentVehicle.capacidade) {
        veiculosList.push({ ...currentVehicle, id: Math.random() });
    }

    // Processa apenas veículos completamente preenchidos
    veiculos = veiculosList
      .filter((v: any) => v.tipo && v.placa && v.tipoAbastecimento && v.capacidade)
      .map((v: any) => {
        const veiculoData: any = {
          // Não envia ID - backend vai gerar automaticamente
          tipo: v.tipo, // já vem como value: "truck", "carreta", etc.
          placa: v.placa,
          capacidade: Number(v.capacidade),
          tipoAbastecimento: v.tipoAbastecimento // já vem como value: "diesel", "biomethane"
        };
        
        // Só envia tag se for Biometano e tiver valor
        if (v.tipoAbastecimento === 'Biometano' && v.tag) {
          veiculoData.tag = v.tag;
        }
        
        return veiculoData;
      });

    // 🛡️ VALIDAÇÃO DE VEÍCULOS (apenas se houver veículos)
    if (veiculos.length > 0) {
      veiculos.forEach((v, index) => {
        if (!v.tipo?.trim()) errors.push(`Tipo do veículo ${index + 1} é obrigatório`);
        if (!v.placa?.trim()) errors.push(`Placa do veículo ${index + 1} é obrigatória`);
        if (!v.capacidade || v.capacidade <= 0) errors.push(`Capacidade do veículo ${index + 1} é obrigatória`);
        if (!v.tipoAbastecimento?.trim()) errors.push(`Tipo de abastecimento do veículo ${index + 1} é obrigatório`);
        if (v.tipoAbastecimento === 'Biometano' && !v.tag?.trim()) errors.push(`TAG do veículo ${index + 1} é obrigatória para Biometano`);
      });
    }

    if (errors.length > 0) {
      console.error('❌ Erros de validação:', errors);
      alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
      return;
    }

    // Mapeia form para formato da API - campos corretos do backend
    const payload: TransportadoraFormInput = {
      nomeFantasia: form.nomeFantasia.trim(),
      razaoSocial: form.razaoSocial.trim(),
      cnpj: form.cnpj.trim(),
      categoria: form.categoria.trim(),
      endereco: form.enderecoCompleto.trim(),
      cidade: form.cidade.trim(),
      uf: form.uf.trim(),
      telefoneComercial: form.telefone.trim(),
      emailComercial: form.email.trim(),
      contatoPrincipal,
      veiculos: veiculos.length > 0 ? veiculos : undefined
    };

    console.log('🚀 Payload enviado para API:', JSON.stringify(payload, null, 2));
    console.log('🚀 Veículos no payload:', payload.veiculos);

    let result;
    if (initialData?.id) {
      // UPDATE
      result = await updateTransportadora(initialData.id, payload);
    } else {
      // CREATE
      result = await createTransportadora(payload);
    }

    if (result) {
      onSave(); // Fecha drawer e recarrega lista
    }
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
        {/* Exibe erro se houver */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <Typography sx={{ fontSize: 24, fontWeight: 600, ...COMMON_FONT_STYLE }}>Identificação</Typography>
          <Stack direction="row" spacing={2}>
            {/* 🛡️ COMPORTAMENTO NATIVO: Sem shrink para a label ficar dentro */}
            <TextField fullWidth label="CNPJ" variant="outlined" value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Nome Fantasia" variant="outlined" value={form.nomeFantasia} onChange={e => setForm({...form, nomeFantasia: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Razão Social" variant="outlined" value={form.razaoSocial || ''} onChange={e => setForm({...form, razaoSocial: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField
              fullWidth
              select
              label="Categoria"
              variant="outlined"
              value={form.categoria || ''}
              onChange={e => setForm({...form, categoria: e.target.value})}
              disabled={isReadOnly}
              SelectProps={{ MenuProps: { sx: { zIndex: 5005 } } }}
              sx={fieldStyle}
            >
              <MenuItem value="">-- Selecione --</MenuItem>
              {categorias && categorias.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Endereço</Typography>
          <TextField fullWidth label="Endereço completo" variant="outlined" value={form.enderecoCompleto} onChange={e => setForm({...form, enderecoCompleto: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Cidade" variant="outlined" value={form.cidade || ''} onChange={e => setForm({...form, cidade: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField
              fullWidth
              select
              label="UF"
              variant="outlined"
              value={form.uf || ''}
              onChange={e => setForm({...form, uf: e.target.value})}
              disabled={isReadOnly}
              SelectProps={{ MenuProps: { sx: { zIndex: 5005 } } }}
              sx={fieldStyle}
            >
              <MenuItem value="">-- Selecione --</MenuItem>
              {UF_OPTIONS && UF_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
          </Stack>

          <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Contato</Typography>
          <Stack direction="row" spacing={2}>
            <TextField fullWidth label="Nome" variant="outlined" value={form.nomeContato || ''} onChange={e => setForm({...form, nomeContato: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
            <TextField fullWidth label="Telefone" variant="outlined" value={form.telefone || ''} onChange={e => setForm({...form, telefone: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />
          </Stack>
          <TextField fullWidth label="E-mail" variant="outlined" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} disabled={isReadOnly} sx={fieldStyle} />

          {(!isReadOnly || (form.veiculos && form.veiculos.length > 0)) && (
            <>
              <Typography sx={{ fontSize: 24, fontWeight: 600, mt: 2, ...COMMON_FONT_STYLE }}>Veículo</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {(form.veiculos || []).map((v: any, index: number) => (
                  <Box key={v.id || index} sx={{ 
                    p: 2, 
                    border: '1px solid #E0E0E0', 
                    borderRadius: 2,
                    bgcolor: 'white',
                    position: 'relative'
                  }}>
                     {/* Delete Button */}
                     {!isReadOnly && (
                       <IconButton 
                         onClick={() => handleRemoveVehicle(index)}
                         size="small"
                         sx={{ position: 'absolute', top: 8, right: 8, color: 'text.secondary' }}
                       >
                         <DeleteIcon fontSize="small" />
                       </IconButton>
                     )}

                     {/* Row 1: Type and Capacity */}
                     <Stack direction="row" justifyContent="space-between" mb={2} pr={isReadOnly ? 0 : 4}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={COMMON_FONT_STYLE}>TIPO DE VEÍCULO</Typography>
                          <Typography variant="body1" fontWeight={600} sx={COMMON_FONT_STYLE}>{v.tipo}</Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="caption" color="text.secondary" sx={COMMON_FONT_STYLE}>CAPACIDADE</Typography>
                          <Typography variant="body1" fontWeight={600} sx={COMMON_FONT_STYLE}>{v.capacidade}</Typography>
                        </Box>
                     </Stack>

                     {/* Divider */}
                     <Box sx={{ height: '1px', bgcolor: '#F5F5F5', mb: 2 }} />

                     {/* Row 2: Plate, Fuel, Tag */}
                     <Stack direction="row" spacing={3} alignItems="center">
                        <Box>
                           <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                             <DirectionsCar sx={{ fontSize: 16, color: 'text.secondary' }} />
                             <Typography variant="caption" color="text.secondary" sx={COMMON_FONT_STYLE}>PLACA</Typography>
                           </Stack>
                           <Typography variant="body2" fontWeight={600} sx={COMMON_FONT_STYLE}>{v.placa}</Typography>
                        </Box>

                        <Box>
                           <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                             <LocalGasStation sx={{ fontSize: 16, color: 'text.secondary' }} />
                             <Typography variant="caption" color="text.secondary" sx={COMMON_FONT_STYLE}>COMBUSTÍVEL</Typography>
                           </Stack>
                           <Typography variant="body2" fontWeight={600} sx={COMMON_FONT_STYLE}>{v.tipoAbastecimento || 'Diesel'}</Typography>
                        </Box>

                        {v.tipoAbastecimento === 'Biometano' && (
                          <Box>
                             <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                               <ConfirmationNumber sx={{ fontSize: 16, color: 'text.secondary' }} />
                               <Typography variant="caption" color="text.secondary" sx={COMMON_FONT_STYLE}>TAG</Typography>
                             </Stack>
                             <Typography variant="body2" fontWeight={600} sx={COMMON_FONT_STYLE}>{v.tag || '-'}</Typography>
                          </Box>
                        )}
                     </Stack>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* CAMPOS DE VEÍCULO (SELECTS) */}
          {showVehicleFields && !isReadOnly && (
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      select
                      label="Tipo de veículo"
                      variant="outlined"
                      value={currentVehicle.tipo}
                      onChange={e => setCurrentVehicle({...currentVehicle, tipo: e.target.value})}
                      disabled={isReadOnly}
                      SelectProps={{ MenuProps: { sx: { zIndex: 5005 } } }}
                      sx={fieldStyle}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      {vehicleTypes && vehicleTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                    <TextField fullWidth label="Placa" variant="outlined" value={currentVehicle.placa} onChange={e => setCurrentVehicle({...currentVehicle, placa: e.target.value.toUpperCase()})} sx={fieldStyle} />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      select
                      label="Tipo de abastecimento"
                      variant="outlined"
                      value={currentVehicle.tipoAbastecimento}
                      onChange={e => setCurrentVehicle({...currentVehicle, tipoAbastecimento: e.target.value})}
                      disabled={isReadOnly}
                      SelectProps={{ MenuProps: { sx: { zIndex: 5005 } } }}
                      sx={fieldStyle}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      {fuelTypes && fuelTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </TextField>
                    <TextField 
                      fullWidth 
                      label="Capacidade máxima(L)" 
                      variant="outlined" 
                      type="number" 
                      value={currentVehicle.capacidade} 
                      onChange={e => setCurrentVehicle({...currentVehicle, capacidade: e.target.value.replace(/\D/g, '')})} 
                      sx={fieldStyle} 
                    />
                </Stack>
            </Stack>
          )}

          {!isReadOnly && <Button fullWidth variant="outlined" startIcon={<AddIcon />} onClick={handleAddVehicle} sx={{ height: '40px', color: '#0072C3', fontWeight: 600, ...COMMON_FONT_STYLE }}>{showVehicleFields ? 'CONFIRMAR INCLUSÃO DE VEÍCULO' : 'ADICIONAR VEÍCULO'}</Button>}
        </Stack>
      </Box>

      {/* 🛡️ FOOTER BLINDADO: Removido apenas os botões se isReadOnly for true */}
      {!isReadOnly && (
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={onClose} 
            disabled={isLoading}
            sx={{ height: 48, color: 'rgba(0,0,0,0.6)', ...COMMON_FONT_STYLE }}
          >
            CANCELAR
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleSave} 
            disabled={isLoading}
            sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT_STYLE }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'SALVAR'}
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default TransportadoraDrawer;