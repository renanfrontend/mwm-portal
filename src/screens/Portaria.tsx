import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, TextField, IconButton, Button, 
  Stack, Paper, Checkbox, TablePagination, Drawer, Collapse, Link
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  CloseIcon, CheckCircleOutlined, HomeIcon, MoreHorizIcon, 
  AddIcon, VisibilityIcon, EditIcon, Delete
} from '../constants/muiIcons';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const tableGrid = "48px 1.5fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr 100px";

const Portaria: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '' });

  const [registros, setRegistros] = useState([
    { id: 1, motorista: 'João Silva', placa: 'ABC-1234', transportadora: 'TransLog', tipo: 'Entrada', data: '24/02/2026', hora: '08:30' },
    { id: 2, motorista: 'Maria Oliveira', placa: 'XYZ-9876', transportadora: 'Expresso Rápido', tipo: 'Saída', data: '24/02/2026', hora: '10:15' },
  ]);

  const visibleData = useMemo(() => {
    return registros
      .filter(r => r.motorista.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [registros, searchTerm, page, rowsPerPage]);

  const isAllSelected = visibleData.length > 0 && visibleData.every(r => selectedIds.includes(r.id));
  const isSomeSelected = visibleData.some(r => selectedIds.includes(r.id)) && !isAllSelected;

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleHeaderCheckboxClick = () => {
    const visibleIds = visibleData.map(r => r.id);
    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleDeleteSelected = () => {
    setRegistros(prev => prev.filter(r => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setIsDeleteDialogOpen(false);
    setToastConfig({ open: true, title: 'Registro excluído', message: 'O registro de portaria foi removido com sucesso.' });
    setTimeout(() => setToastConfig(p => ({ ...p, open: false })), 5000);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: '24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      <Box sx={{ alignSelf: 'stretch', mb: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '16px', fontFamily: SCHIBSTED }}>Portaria</Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', fontFamily: SCHIBSTED }}>Portaria</Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ bgcolor: '#F1F9EE', borderRadius: '4px', p: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: 2, border: '1px solid rgba(112, 191, 84, 0.2)', mb: 3 }}>
            <CheckCircleOutlined sx={{ color: '#70BF54', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#2F5023', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
                <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED, opacity: 0.8 }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(p => ({ ...p, open: false }))} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ p: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField sx={{ width: 500 }} label="Buscar registro" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton 
              disabled={selectedIds.length === 0} 
              sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'inherit' }} 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Delete />
            </IconButton>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#0072C3', height: 40, px: 3, fontFamily: SCHIBSTED, fontWeight: 600 }}>ADICIONAR</Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: '16px' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 56, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.04)', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
            <Checkbox size="small" checked={isAllSelected} indeterminate={isSomeSelected} onChange={handleHeaderCheckboxClick} />
            {['Motorista', 'Placa', 'Transportadora', 'Tipo', 'Data', 'Hora', 'Ações'].map(c => (
              <Typography key={c} sx={{ fontSize: 11, fontWeight: 600, fontFamily: SCHIBSTED }}>{c}</Typography>
            ))}
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {visibleData.map(r => (
              <Box 
                key={r.id} 
                onClick={() => handleToggleSelect(r.id)} 
                sx={{ 
                  display: 'grid', gridTemplateColumns: tableGrid, minHeight: 52, alignItems: 'center', px: 2, 
                  borderBottom: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', 
                  bgcolor: selectedIds.includes(r.id) ? 'rgba(0, 114, 195, 0.12)' : 'inherit' 
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedIds.includes(r.id) && <Checkbox size="small" checked={true} />}
                </Box>
                <Typography sx={{ fontSize: 13 }}>{r.motorista}</Typography>
                <Typography sx={{ fontSize: 13 }}>{r.placa}</Typography>
                <Typography sx={{ fontSize: 13 }}>{r.transportadora}</Typography>
                <Typography sx={{ fontSize: 13 }}>{r.tipo}</Typography>
                <Typography sx={{ fontSize: 13 }}>{r.data}</Typography>
                <Typography sx={{ fontSize: 13 }}>{r.hora}</Typography>
                <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                  <IconButton size="small" sx={{ color: '#0072C3' }}><VisibilityIcon sx={{ fontSize: 20 }} /></IconButton>
                  <IconButton size="small" sx={{ color: '#0072C3' }}><EditIcon sx={{ fontSize: 20 }} /></IconButton>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>

        <TablePagination component="div" count={registros.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" />
      </Paper>

      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 6000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}>
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box><Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>EXCLUIR REGISTRO</Typography></Box>
        </Box>
        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '40px' }}>
          <Typography sx={{ textAlign: 'justify', color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: '500', lineHeight: 1.6, letterSpacing: 0.15 }}>
            Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?
          </Typography>
        </Box>
        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button variant="outlined" onClick={() => setIsDeleteDialogOpen(false)} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.50)', fontWeight: '500' }}>NÃO</Button>
          <Button variant="contained" onClick={handleDeleteSelected} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: '500', boxShadow: 'none' }}>SIM</Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Portaria;