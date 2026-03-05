import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Paper, Checkbox, TablePagination, Drawer, Collapse, Link, Tabs, Tab
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  CloseIcon, CheckCircleOutlined, HomeIcon, MoreHorizIcon, 
  AddIcon, VisibilityIcon, EditIcon, Delete
} from '../constants/muiIcons';

import PortariaDrawer from '../components/PortariaDrawer';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const tableGrid = "40px 1.4fr 0.8fr 1fr 0.7fr 0.8fr 0.6fr 1.2fr 90px";

const Portaria: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '' });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [registros, setRegistros] = useState([
    { id: 1, motorista: 'João Silva', placa: 'ABC-1234', transportadora: 'TransLog', tipo: 'Entrada', data: '24/02/2026', hora: '08:30', status: 'Em andamento' },
  ]);

  const handleShowToast = (title: string, message: string) => {
    setToastConfig({ open: true, title, message });
    setTimeout(() => setToastConfig(p => ({ ...p, open: false })), 6000);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDeleteSelected = () => {
    setRegistros(prev => prev.filter(r => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setIsDeleteDialogOpen(false);
    handleShowToast('Registro excluído com sucesso', 'O registro foi removido e não está mais disponível no sistema.');
  };

  const filteredData = useMemo(() => {
    return registros.filter(r => {
      const matchesSearch = (r.motorista || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = tabValue === 0 ? r.status === 'Em andamento' : r.status === 'Concluído';
      return matchesSearch && matchesTab;
    });
  }, [registros, searchTerm, tabValue]);

  const visibleData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '8px 24px 12px 24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '14px', fontFamily: SCHIBSTED }}>Portaria / {tabValue === 0 ? 'Registro' : 'Histórico'}</Typography>
        </Box>
        <Typography sx={{ color: 'black', fontSize: 48, fontFamily: SCHIBSTED, fontWeight: '400', lineHeight: '56.02px' }}>Portaria</Typography>
      </Box>

      {/* 🟢 ALERTA PADRONIZADO E COLADO */}
      <Collapse in={toastConfig.open}>
        <Box sx={{ width: '100%', mb: 0 }}>
          <Box sx={{ px: 2, py: '6px', background: '#F1F9EE', borderRadius: '4px 4px 0 0', display: 'flex', border: '1px solid rgba(112, 191, 84, 0.2)', borderBottom: 'none', alignItems: 'center' }}>
            <Box sx={{ pr: 1.5, display: 'flex' }}><CheckCircleOutlined sx={{ fontSize: 22, color: '#70BF54' }} /></Box>
            <Box sx={{ flex: 1, py: 1 }}>
              <Typography sx={{ color: '#2F5023', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500, lineHeight: '24px' }}>{toastConfig.title}</Typography>
              <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED, fontWeight: 400, lineHeight: '20px' }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(prev => ({ ...prev, open: false }))} size="small"><CloseIcon sx={{ fontSize: 20, color: '#2F5023' }} /></IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderTop: toastConfig.open ? 'none' : '1px solid rgba(0,0,0,0.12)', borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ pt: 1.5, px: 2, flexShrink: 0 }}><Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); setPage(0); }} sx={{ minHeight: 36 }}><Tab label="Registro" sx={{ minHeight: 36, fontSize: 13, fontFamily: SCHIBSTED }} /><Tab label="Histórico" sx={{ minHeight: 36, fontSize: 13, fontFamily: SCHIBSTED }} /></Tabs></Box>
        <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField placeholder="Buscar" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton disabled={selectedIds.length === 0} onClick={() => setIsDeleteDialogOpen(true)} sx={{ padding: '8px', color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }}><Delete sx={{ width: 24, height: 24 }} /></IconButton>
            <Button variant="contained" startIcon={<AddIcon sx={{ width: 20, height: 20 }} />} onClick={() => { setDrawerMode('add'); setSelectedItem(null); setIsDrawerOpen(true); }} sx={{ px: '16px', py: '6px', background: '#0072C3', borderRadius: '4px', color: 'white', fontSize: '14px', fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase' }}>Adicionar</Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, px: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 36, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.04)', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
              <Checkbox size="small" checked={visibleData.length > 0 && visibleData.every(r => selectedIds.includes(r.id))} onChange={() => setSelectedIds(visibleData.every(r => selectedIds.includes(r.id)) ? [] : [...selectedIds, ...visibleData.map(r => r.id)])} />
              {['Motorista', 'Placa', 'Transportadora', 'Tipo', 'Data', 'Hora', 'Status', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 11, fontWeight: 600, fontFamily: SCHIBSTED }}>{c}</Typography>)}
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
              {visibleData.map(r => (
                <Box key={r.id} onClick={() => handleToggleSelect(r.id)} sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 32, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', bgcolor: selectedIds.includes(r.id) ? 'rgba(0, 114, 195, 0.08)' : 'inherit' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selectedIds.includes(r.id) && <Checkbox size="small" checked={true} />}</Box>
                  <Typography noWrap sx={{ fontSize: 12 }}>{r.motorista}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{r.placa}</Typography>
                  <Typography noWrap sx={{ fontSize: 11 }}>{r.transportadora}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{r.tipo}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{r.data}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{r.hora}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ height: 24, px: 1, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: r.status === 'Em andamento' ? '#FF832B' : '#50883C', width: 110 }}><Typography sx={{ color: 'white', fontSize: 13, fontFamily: SCHIBSTED, fontWeight: 400 }}>{r.status}</Typography></Box></Box>
                  <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                    <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => { setSelectedItem(r); setDrawerMode('view'); setIsDrawerOpen(true); }}><VisibilityIcon sx={{ fontSize: 16 }} /></IconButton>
                    {tabValue === 0 && <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => { setSelectedItem(r); setDrawerMode('edit'); setIsDrawerOpen(true); }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>}
                  </Stack>
                </Box>
              ))}
            </Box>
            <TablePagination component="div" count={filteredData.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" sx={{ borderTop: 'none' }} />
          </Box>
        </Box>
      </Paper>

      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 1400 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '40px 12px 40px 32px', position: 'relative' }}>
          <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ position: 'absolute', right: 4, top: 8 }}><CloseIcon sx={{ fontSize: 24 }} /></IconButton>
          <Typography sx={{ color: 'black', fontSize: 32, fontFamily: SCHIBSTED, fontWeight: 700 }}>EXCLUIR REGISTRO</Typography>
          <Typography sx={{ mt: 3, color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: 500 }}>Deseja excluir esse registro? Todas as informações associadas à ela serão removidas.</Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3', borderColor: 'rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <PortariaDrawer open={isDrawerOpen} mode={drawerMode} initialData={selectedItem} onClose={() => setIsDrawerOpen(false)} onSave={() => setIsDrawerOpen(false)} />
    </Box>
  );
};

export default Portaria;