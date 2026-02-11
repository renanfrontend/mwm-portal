import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Stack, CircularProgress, TextField, Button } from '@mui/material';
import { Visibility, Edit, Add, FilterAlt, FileDownload, Delete } from '../constants/muiIcons';
import { TransportadoraService } from '../services/transportadoraService';
import type { TransportadoraListItem } from '../types/transportadora';
import TransportadoraDrawer from './TransportadoraDrawer';

const COMMON_FONT_STYLE = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

export const TransportadoraList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransportadoraListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerState, setDrawerState] = useState<{ open: boolean; item: any; readOnly: boolean }>({ open: false, item: null, readOnly: false });

  const loadTransportadoras = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🚀 Carregando transportadoras da API...');
      const response = await TransportadoraService.list(1, 9999); // Carrega todas
      console.log('✅ Transportadoras carregadas:', response);
      setData(response.items || []);
    } catch (err) {
      console.error('❌ Erro ao carregar transportadoras:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransportadoras();
  }, [loadTransportadoras]);

  const handleAdd = () => setDrawerState({ open: true, item: null, readOnly: false });

  const filtered = useMemo(() => (data || []).filter(item => item.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase())), [data, searchTerm]);
  const grid = "1.5fr 1.2fr 2fr 150px 100px";

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 🛡️ TOOLBAR PADRONIZADA (Transportadoras) */}
      <Box sx={{ p: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
              <TextField 
                  fullWidth 
                  label="Buscar" 
                  placeholder="Nome, email, etc..." 
                  size="small" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  sx={{ '& .MuiOutlinedInput-root': { ...COMMON_FONT_STYLE }, '& .MuiInputLabel-root': { ...COMMON_FONT_STYLE } }}
              />
          </Box>
          
            <Stack direction="row" spacing={1} alignItems="center">
            <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
              <Delete />
            </IconButton>
            <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
              <FileDownload />
            </IconButton>
            <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
              <FilterAlt />
            </IconButton>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={handleAdd} 
              sx={{ bgcolor: '#0072C3', height: 40, px: 3, ...COMMON_FONT_STYLE }}
            >
              ADICIONAR
            </Button>
            </Stack>
      </Box>

      <Box sx={{ flex: 1, overflowX: 'auto', px: '16px' }}>
        <Box sx={{ width: '100%', minWidth: '1000px' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: grid, height: '56px', alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', px: '16px' }}>
            {['Nome fantasia', 'CNPJ', 'Endereço', 'Veículos', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 12, fontWeight: 600, ...COMMON_FONT_STYLE }}>{c}</Typography>)}
          </Box>
          {loading ? <CircularProgress sx={{ m: 4 }} /> : filtered.map(item => (
            <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: grid, minHeight: '52px', alignItems: 'center', px: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography sx={{ fontSize: 14, ...COMMON_FONT_STYLE }}>{item.nomeFantasia}</Typography>
              <Typography sx={{ fontSize: 14, ...COMMON_FONT_STYLE }}>{item.cnpj}</Typography>
              <Typography sx={{ fontSize: 14, ...COMMON_FONT_STYLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.endereco}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Box sx={{ height: 32, minWidth: 32, px: 1, bgcolor: '#00518A', borderRadius: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography sx={{ color: 'white', fontSize: 13, ...COMMON_FONT_STYLE }}>{item.quantidadeVeiculos ?? item.veiculos?.length ?? 0}</Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => setDrawerState({ open: true, item, readOnly: true })}><Visibility fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => setDrawerState({ open: true, item, readOnly: false })}><Edit fontSize="small" /></IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>
      <TransportadoraDrawer 
        key={drawerState.open ? (drawerState.item?.id || 'new') : 'closed'} 
        isOpen={drawerState.open} 
        isReadOnly={drawerState.readOnly} 
        onClose={() => setDrawerState({ open: false, item: null, readOnly: false })} 
        onSave={() => {
          setDrawerState({ open: false, item: null, readOnly: false });
          loadTransportadoras(); // Recarrega após salvar
        }} 
        initialData={drawerState.item} 
      />
    </Box>
  );
};