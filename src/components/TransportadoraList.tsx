import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Stack, CircularProgress, TextField, Button, Checkbox, Drawer, TablePagination } from '@mui/material';
import { Visibility, Edit, Add, Delete, CloseIcon } from '../constants/muiIcons';
import { TransportadoraService } from '../services/transportadoraService';
import TransportadoraDrawer from './TransportadoraDrawer';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

export const TransportadoraList: React.FC<{ onShowSuccess?: (t: string, m: string) => void }> = ({ onShowSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TransportadoraService.list(1, 9999);
      setData(response.items || []);
    } catch { setData([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDrawer = (mode: 'create' | 'view' | 'edit', item: any = null) => {
    setDrawerMode(mode);
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.allSettled(selectedIds.map(id => TransportadoraService.delete(id)));
      await load(); setSelectedIds([]); setIsDeleteDialogOpen(false);
      if (onShowSuccess) onShowSuccess('Registro atualizado', 'As alterações foram salvas.');
    } catch { setIsDeleteDialogOpen(false); }
  };

  const visibleItems = useMemo(() => {
    return data
      .filter(i => (i.nomeFantasia || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, searchTerm, page, rowsPerPage]);

  const grid = "40px 2.2fr 1.4fr 2.8fr 90px 85px";

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <TextField placeholder="Buscar" size="small" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton disabled={selectedIds.length === 0} onClick={() => setIsDeleteDialogOpen(true)} sx={{ padding: '8px', borderRadius: '100%', color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }}><Delete sx={{ width: 24, height: 24 }} /></IconButton>
            <Button variant="contained" startIcon={<Add sx={{ width: 20, height: 20 }} />} onClick={() => openDrawer('create')} sx={{ px: '16px', py: '6px', background: '#0072C3', borderRadius: '4px', color: 'white', fontSize: '14px', fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase', boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.20), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)' }}>Adicionar</Button>
          </Box>
      </Box>

      <Box sx={{ flex: 1, px: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: grid, height: 36, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Checkbox size="small" checked={visibleItems.length > 0 && selectedIds.length === data.length} onChange={() => setSelectedIds(selectedIds.length > 0 ? [] : data.map(i => i.id))} />
            {['Nome fantasia', 'CNPJ', 'Endereço', 'Veículos', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 11, fontWeight: 600 }}>{c}</Typography>)}
          </Box>
          <Box>
            {loading ? <CircularProgress sx={{ m: 4 }} /> : visibleItems.map(item => (
              <Box key={item.id} onClick={() => setSelectedIds(p => p.includes(item.id) ? p.filter(i => i !== item.id) : [...p, item.id])} sx={{ display: 'grid', gridTemplateColumns: grid, height: 30, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)', cursor: 'pointer', bgcolor: selectedIds.includes(item.id) ? 'rgba(0, 114, 195, 0.08)' : 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selectedIds.includes(item.id) && <Checkbox size="small" checked={true} />}</Box>
                <Typography noWrap sx={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nomeFantasia}</Typography>
                <Typography sx={{ fontSize: 11 }}>{item.cnpj}</Typography>
                <Typography noWrap sx={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.endereco}</Typography>
                <Box sx={{ p: '4px', bgcolor: '#00518A', borderRadius: '100px', display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                  <Box sx={{ minHeight: '20px', px: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}><Typography sx={{ color: 'white', fontSize: '13px', fontFamily: SCHIBSTED, fontWeight: 400, lineHeight: '18px', letterSpacing: 0.16 }}>{item.veiculos?.length || 0}</Typography></Box>
                </Box>
                <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                  <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', item)}><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', item)}><Edit fontSize="small" /></IconButton>
                </Stack>
              </Box>
            ))}
          </Box>
          <TablePagination component="div" count={data.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" sx={{ borderTop: 'none' }} />
        </Box>
      </Box>

      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 1400 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '40px 12px 40px 32px', position: 'relative' }}>
          <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ position: 'absolute', right: 4, top: 8 }}><CloseIcon sx={{ fontSize: 24 }} /></IconButton>
          <Typography sx={{ color: 'black', fontSize: 32, fontFamily: SCHIBSTED, fontWeight: 700, lineHeight: '39.52px' }}>EXCLUIR TRANSPORTADORA</Typography>
          <Typography sx={{ mt: 3, maxWidth: 580, textAlign: 'justify', color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: 500, lineHeight: '32px' }}>Ao excluir esse registro da transportadora todas as informações associadas à ela serão removidas. Deseja excluir esse registro do transportadora?</Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3', border: '1px solid rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <TransportadoraDrawer open={isDrawerOpen} mode={drawerMode} initialData={selectedItem} onClose={() => setIsDrawerOpen(false)} onSave={() => { load(); setIsDrawerOpen(false); }} />
    </Box>
  );
};