import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Stack, CircularProgress, TextField, Button, Checkbox, Drawer, TablePagination } from '@mui/material';
import { Visibility, Edit, Add, Delete, CloseIcon } from '../constants/muiIcons';

import { TransportadoraService } from '../services/transportadoraService';
import type { TransportadoraListItem } from '../types/transportadora';
import TransportadoraDrawer from './TransportadoraDrawer';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

// Adicione onOpenAdd opcional na interface se quiser usar
export const TransportadoraList: React.FC<{ onShowSuccess?: (t: string, m: string) => void, onOpenAdd?: () => void }> = ({ onShowSuccess, onOpenAdd }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransportadoraListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<{ open: boolean; item: any; readOnly: boolean }>({ open: false, item: null, readOnly: false });
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);


  const loadTransportadoras = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TransportadoraService.list(1, 9999);
      setData(response.items || []);
    } catch { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTransportadoras(); }, [loadTransportadoras]);

  const visibleItems = useMemo(() => {
    return (data || []).filter(i => {
      const s = searchTerm.toLowerCase();
      return (
        i.nomeFantasia?.toLowerCase().includes(s) ||
        i.cnpj?.toLowerCase().includes(s) ||
        i.endereco?.toLowerCase().includes(s)
      );
    }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, searchTerm, page, rowsPerPage]);
  const isAllSelected = visibleItems.length > 0 && visibleItems.every(i => selectedIds.includes(i.id));

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) { await TransportadoraService.delete(id); }
      await loadTransportadoras(); setSelectedIds([]); setIsDeleteDialogOpen(false);
      if (onShowSuccess) onShowSuccess('Registro excluído', 'O registro foi removido.');
    } catch (err) { console.error(err); }
  };

  const grid = "48px 2.5fr 1.5fr 3fr 120px 100px";

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField sx={{ width: 500 }} label="Buscar" size="small" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton disabled={selectedIds.length === 0} onClick={() => setIsDeleteDialogOpen(true)} sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0,0,0,0.26)' }}><Delete /></IconButton>
            <Button variant="contained" startIcon={<Add />} onClick={() => { if (onOpenAdd) onOpenAdd(); else setDrawerState({ open: true, item: null, readOnly: false }); }} sx={{ bgcolor: '#0072C3', height: 40, px: 3, fontFamily: SCHIBSTED, fontWeight: 600 }}>ADICIONAR</Button>

          </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: '16px' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: grid, height: 56, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Checkbox size="small" checked={isAllSelected} onChange={() => {
             const visibleIds = visibleItems.map(i => i.id);
             setSelectedIds(isAllSelected ? selectedIds.filter(id => !visibleIds.includes(id)) : Array.from(new Set([...selectedIds, ...visibleIds])));
          }} />
          {['Nome fantasia', 'CNPJ', 'Endereço', 'Veículos', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 12, fontWeight: 600, ...COMMON_FONT }}>{c}</Typography>)}
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {loading ? <CircularProgress sx={{ m: 4 }} /> : visibleItems.map(item => (
            <Box key={item.id} sx={{ display: 'grid', gridTemplateColumns: grid, minHeight: 52, alignItems: 'center', px: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Checkbox size="small" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(p => p.includes(item.id) ? p.filter(i => i !== item.id) : [...p, item.id])} />
              <Typography sx={{ fontSize: 13 }}>{item.nomeFantasia}</Typography>
              <Typography sx={{ fontSize: 13 }}>{item.cnpj}</Typography>
              <Typography sx={{ fontSize: 13 }}>{item.endereco}</Typography>
              <Box sx={{ height: 28, minWidth: 28, bgcolor: '#00518A', borderRadius: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content', px: 1 }}><Typography sx={{ color: 'white', fontSize: 12 }}>{item.veiculos?.length ?? item.quantidadeVeiculos ?? 0}</Typography></Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => TransportadoraService.getById(item.id).then(f => setDrawerState({ open: true, item: f, readOnly: true }))}><Visibility fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => TransportadoraService.getById(item.id).then(f => setDrawerState({ open: true, item: f, readOnly: false }))}><Edit fontSize="small" /></IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <TablePagination component="div" count={data.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} rowsPerPageOptions={[]} />
      
      {/* 🛡️ MODAL DE EXCLUSÃO PADRONIZADO */}
      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 6000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}>
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT, lineHeight: 1.1 }}>EXCLUIR REGISTRO</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 0.5, ...COMMON_FONT }}>Gestão de transportadoras</Typography>
          </Box>
        </Box>

        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '40px' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, ...COMMON_FONT, color: 'black' }}>Deseja excluir esses registros da transportadora? Ao confirmar, todas as informações associadas serão removidas.</Typography>
        </Box>

        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button variant="outlined" onClick={() => setIsDeleteDialogOpen(false)} fullWidth sx={{ height: 48, ...COMMON_FONT, color: 'rgba(0,0,0,0.6)' }}>NÃO</Button>
          <Button variant="contained" onClick={handleDeleteSelected} fullWidth sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT, fontWeight: 600 }}>SIM</Button>
        </Box>
      </Drawer>

      <TransportadoraDrawer 
        key={drawerState.open ? (drawerState.item?.id || 'create') : 'closed'}
        isOpen={drawerState.open} 
        isReadOnly={drawerState.readOnly} 
        onClose={() => setDrawerState({ ...drawerState, open: false })} 
        onSave={() => { setDrawerState({ ...drawerState, open: false }); loadTransportadoras(); if (onShowSuccess) onShowSuccess('Sucesso', 'Transportadora salva com sucesso!'); }} 
        initialData={drawerState.item} 
      />
    </Box>
  );
};