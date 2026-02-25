import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography, GlobalStyles, TablePagination } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import EmptyImage from '../assets/empty-states-sheets.png';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

export const PortariaList: React.FC<any> = ({ onSuccess, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0); 
  const rowsPerPage = 5; 
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerConfig, setDrawerConfig] = useState<{open: boolean, mode: 'add'|'edit'|'view', data: any}>({open: false, mode: 'add', data: null});
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  
  const [data, setData] = useState<any[]>([
    { id: '1', data: '18/02/2026', hora: '08:00', atividade: 'Abastecimento', nome: 'Renan Augusto', placa: 'ABC-1234', status: 'Em andamento', responsavel: 'Gilson Alves' },
    { id: '3', data: '18/02/2026', hora: '09:15', atividade: 'Entrega de dejetos', nome: 'José da Silva', placa: 'ABC-5678', status: 'Concluído', responsavel: 'Renan' },
    { id: '2', data: '18/02/2026', hora: '09:00', atividade: 'Visita', nome: 'Mariana Silva', placa: 'GHI-9012', status: 'Em andamento', responsavel: 'Gilson Alves' }
  ]);

  const filteredData = useMemo(() => data.filter(item => (tabValue === 0 ? item.status !== 'Concluído' : item.status === 'Concluído')), [data, tabValue]);
  const paginatedData = useMemo(() => filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filteredData, page]);

  const handleSave = (entry: any) => {
    const formattedData = entry.data instanceof Date ? entry.data.toLocaleDateString('pt-BR') : entry.data;
    const formattedHora = entry.horario instanceof Date ? entry.horario.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : entry.hora;
    if (drawerConfig.mode === 'edit') {
       setData(prev => prev.map(i => i.id === entry.id ? { ...entry, data: formattedData, hora: formattedHora } : i));
       onSuccess("Registro atualizado", "As alterações foram salvas com sucesso.");
    } else {
       const newRow = { ...entry, id: Math.random().toString(), status: 'Em andamento', responsavel: 'Gilson Alves', nome: entry.motorista, data: formattedData, hora: formattedHora };
       setData(prev => [newRow, ...prev]);
       onSuccess("Registro realizado", "O cadastro foi salvo com sucesso.");
    }
    setDrawerConfig({open: false, mode: 'add', data: null});
  };

  const handleConfirmDelete = () => {
    setData(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    setIsDeleteDrawerOpen(false);
    onSuccess("Registro excluído", "O registro foi removido com sucesso.");
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <GlobalStyles styles={{ 
        '.MuiAlert-root, .MuiAlert-root *': { border: 'none !important', boxShadow: 'none !important' },
        '.MuiAlert-standardSuccess': { backgroundColor: '#F1F9EE !important' },
        '.MuiAlert-message': { color: '#2F5023 !important', fontFamily: SCHIBSTED }
      }} />

      <Box sx={{ pt: 4, px: { xs: 1, sm: 2 } }}><Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); onTabChange(v); setPage(0); }} sx={{ '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500 } }}><Tab label="Registro" /><Tab label="Histórico" /></Tabs></Box>
      
      <Box sx={{ p: { xs: '8px', sm: '16px' }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
          <TextField sx={{ width: { xs: '100%', md: 500 } }} label="Buscar" size="small" />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
            {tabValue === 0 && (
              <>
                <IconButton disabled={selectedIds.length === 0} onClick={() => setIsDeleteDrawerOpen(true)} sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }}><DeleteIcon /></IconButton>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerConfig({open: true, mode: 'add', data: null})} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>ADICIONAR</Button>
              </>
            )}
          </Box>
        </Box>
        
        {filteredData.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <img src={EmptyImage} alt="Vazio" style={{ width: 150, marginBottom: '24px' }} />
            <Typography sx={{ color: '#34343F', fontSize: 18, fontFamily: SCHIBSTED, fontWeight: 500, mb: 1 }}>Área sem registros</Typography>
            <Typography sx={{ maxWidth: 300, textAlign: 'center', color: 'black', fontSize: 14, fontFamily: SCHIBSTED }}>Utilize o botão “Adicionar” para adicionar as primeiras informações.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <PortariaTable data={paginatedData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} isHistory={tabValue === 1} onEdit={(row: any) => setDrawerConfig({open: true, mode: 'edit', data: row})} onView={(row: any) => setDrawerConfig({open: true, mode: 'view', data: row})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
              <TablePagination component="div" count={filteredData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPageOptions={[]} labelDisplayedRows={({ count }) => `5 linhas por página de ${count}`} />
            </Box>
          </Box>
        )}
      </Box>

      {/* 🛡️ MODAL DE EXCLUSÃO: ESTRUTURA BLINDADA FIGMA */}
      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} sx={{ zIndex: 6000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}>
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          {/* 🛡️ BLOCO 1: ÍCONE NO TOPO ABSOLUTO DIREITO */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={() => setIsDeleteDrawerOpen(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          {/* 🛡️ BLOCO 2: TÍTULOS ABAIXO */}
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>EXCLUIR REGISTRO</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 0.5, ...COMMON_FONT }}>Gestão de registros de portaria</Typography>
          </Box>
        </Box>

        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '40px' }}>
          <Typography sx={{ textAlign: 'justify', color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: '500', lineHeight: 1.6, letterSpacing: 0.15 }}>
            Ao excluir esse registro todas as informações associadas à ela serão removidas. 
            <br /><strong>Deseja excluir esse registro?</strong>
          </Typography>
        </Box>

        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button variant="outlined" onClick={() => setIsDeleteDrawerOpen(false)} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.50)', fontWeight: '500' }}>NÃO</Button>
          <Button variant="contained" onClick={handleConfirmDelete} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: '500', boxShadow: 'none' }}>SIM</Button>
        </Box>
      </Drawer>

      <PortariaDrawer open={drawerConfig.open} mode={drawerConfig.mode} initialData={drawerConfig.data} onClose={() => setDrawerConfig({open: false, mode: 'add', data: null})} onSave={handleSave} />
    </Box>
  );
};