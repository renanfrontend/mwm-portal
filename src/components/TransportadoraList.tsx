import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Stack, CircularProgress, TextField, Button, Checkbox, Drawer, TablePagination } from '@mui/material';
import { Visibility, Edit, Add, FilterAlt, FileDownload, Delete, CloseIcon } from '../constants/muiIcons';
import { TransportadoraService } from '../services/transportadoraService';
import type { TransportadoraListItem } from '../types/transportadora';
import TransportadoraDrawer from './TransportadoraDrawer';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT_STYLE = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

export const TransportadoraList: React.FC<{ onShowSuccess?: (t: string, m: string) => void }> = ({ onShowSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransportadoraListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<{ open: boolean; item: any; readOnly: boolean }>({ open: false, item: null, readOnly: false });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadTransportadoras = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TransportadoraService.list(1, 9999);
      setData(response.items || []);
    } catch (err) { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadTransportadoras(); }, [loadTransportadoras]);

  const visibleItems = useMemo(() => {
    return (data || [])
      .filter(item => item.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, searchTerm, page, rowsPerPage]);

  const isAllSelected = visibleItems.length > 0 && visibleItems.every(item => selectedIds.includes(item.id));
  const isSomeSelected = visibleItems.some(item => selectedIds.includes(item.id)) && !isAllSelected;

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleHeaderCheckboxClick = () => {
    if (isAllSelected) {
      const visibleIds = visibleItems.map(i => i.id);
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      const visibleIds = visibleItems.map(i => i.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) { await TransportadoraService.delete(id); }
      await loadTransportadoras(); 
      setSelectedIds([]); 
      setIsDeleteDialogOpen(false);
      if (onShowSuccess) onShowSuccess('Registro excluído com sucesso', 'O registro foi removido.');
    } catch (err) { console.error(err); }
  };

  const handleOpenDrawer = async (item: TransportadoraListItem, readOnly: boolean) => {
    try {
      const fullData = await TransportadoraService.getById(item.id);
      setDrawerState({ open: true, item: fullData, readOnly });
    } catch (error) { setDrawerState({ open: true, item, readOnly }); }
  };

  const grid = "48px 2.5fr 1.5fr 3fr 120px 100px";

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField sx={{ width: 500 }} label="Buscar" size="small" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton disabled={selectedIds.length === 0} sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'inherit' }} onClick={() => setIsDeleteDialogOpen(true)}><Delete /></IconButton>
            <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FileDownload /></IconButton>
            <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAlt /></IconButton>
            <Button variant="contained" startIcon={<Add />} onClick={() => setDrawerState({ open: true, item: null, readOnly: false })} sx={{ bgcolor: '#0072C3', height: 40, px: 3, fontFamily: SCHIBSTED, fontWeight: 600 }}>ADICIONAR</Button>
          </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: '16px' }}>
        {/* HEADER FIXO */}
        <Box sx={{ display: 'grid', gridTemplateColumns: grid, height: 56, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Checkbox size="small" checked={isAllSelected} indeterminate={isSomeSelected} onChange={handleHeaderCheckboxClick} />
          {['Nome fantasia', 'CNPJ', 'Endereço', 'Veículos', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 12, fontWeight: 600, ...COMMON_FONT_STYLE }}>{c}</Typography>)}
        </Box>

        {/* BODY SCROLLABLE */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {loading ? <CircularProgress sx={{ m: 4 }} /> : visibleItems.map(item => (
            <Box key={item.id} onClick={() => handleToggleSelect(item.id)} sx={{ display: 'grid', gridTemplateColumns: grid, minHeight: 52, alignItems: 'center', px: '16px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', cursor: 'pointer', bgcolor: selectedIds.includes(item.id) ? 'rgba(0, 114, 195, 0.12)' : 'inherit' }}>
              <Checkbox size="small" checked={selectedIds.includes(item.id)} />
              <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.nomeFantasia}</Typography>
              <Typography sx={{ fontSize: 13 }}>{item.cnpj}</Typography>
              <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.endereco}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ height: 28, minWidth: 28, px: 1, bgcolor: '#00518A', borderRadius: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {/* 🛡️ FIX: Badge agora reflete a lista OU o contador do banco */}
                  <Typography sx={{ color: 'white', fontSize: 12, ...COMMON_FONT_STYLE }}>
                    {item.veiculos?.length ?? item.quantidadeVeiculos ?? 0}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => handleOpenDrawer(item, true)}><Visibility fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => handleOpenDrawer(item, false)}><Edit fontSize="small" /></IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      <TablePagination component="div" count={data.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} />
      
      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 6000 }}>
        <Box sx={{ width: 620, p: '32px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}><Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography><IconButton onClick={() => setIsDeleteDialogOpen(false)}><CloseIcon /></IconButton></Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, fontFamily: SCHIBSTED, textAlign: 'justify', mb: 'auto' }}>Deseja excluir esses registros da transportadora? Ao confirmar, todas as informações associadas serão removidas.</Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 3 }}><Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.5)', fontFamily: SCHIBSTED }}>NÃO</Button><Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>SIM</Button></Stack>
        </Box>
      </Drawer>

      <TransportadoraDrawer key={drawerState.open ? (drawerState.item?.id || 'new') : 'closed'} isOpen={drawerState.open} isReadOnly={drawerState.readOnly} onClose={() => setDrawerState({ open: false, item: null, readOnly: false })} onSave={() => { setDrawerState({ open: false, item: null, readOnly: false }); loadTransportadoras(); if (onShowSuccess) onShowSuccess('Registro atualizado', 'As alterações foram salvas.'); }} initialData={drawerState.item} />
    </Box>
  );
};