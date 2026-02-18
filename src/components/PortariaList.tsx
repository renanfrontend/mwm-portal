import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography, GlobalStyles, TablePagination } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, FileUpload as FileUploadIcon, FilterAlt as FilterAltIcon, Close as CloseIcon } from '@mui/icons-material';
import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import EmptyImage from '../assets/empty-states-sheets.png'; // 🛡️ ASSET RESTAURADO

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

export const PortariaList: React.FC<any> = ({ onSuccess, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0); 
  const rowsPerPage = 5; 
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerConfig, setDrawerConfig] = useState<{open: boolean, mode: 'add'|'edit'|'view', data: any}>({open: false, mode: 'add', data: null});
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  
  // 🛡️ DADOS INICIAIS (Limpos para testar o Empty State)
  const [data, setData] = useState<any[]>([
    { id: '1', data: '18/02/2026', hora: '08:00', atividade: 'Abastecimento', nome: 'Renan Augusto', placa: 'ABC-1234', status: 'Em andamento', responsavel: 'Gilson Alves' },
    { id: '2', data: '18/02/2026', hora: '09:00', atividade: 'Visita', nome: 'Mariana Silva', placa: 'GHI-9012', status: 'Em andamento', responsavel: 'Gilson Alves' }
  ]);

  const filteredData = useMemo(() => {
    return data.filter(item => (tabValue === 0 ? item.status !== 'Concluído' : item.status === 'Concluído'));
  }, [data, tabValue]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page]);

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

  const iconStyle = { color: 'rgba(0, 0, 0, 0.26)' };

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
                <IconButton sx={iconStyle}><FileUploadIcon /></IconButton>
                <IconButton sx={iconStyle}><FilterAltIcon /></IconButton>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerConfig({open: true, mode: 'add', data: null})} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED, whiteSpace: 'nowrap' }}>ADICIONAR</Button>
              </>
            )}
            {tabValue === 1 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={iconStyle}><FileUploadIcon /></IconButton>
                <IconButton sx={iconStyle}><FilterAltIcon /></IconButton>
              </Box>
            )}
          </Box>
        </Box>
        
        {filteredData.length === 0 ? (
          /* 🛡️ EMPTY STATE REFINADO: Imagem de asset + textos */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <img src={EmptyImage} alt="Vazio" style={{ width: 150, marginBottom: '24px' }} />
            <Typography sx={{ color: '#34343F', fontSize: 18, fontFamily: SCHIBSTED, fontWeight: 500, mb: 1 }}>
              Área sem registros
            </Typography>
            <Typography sx={{ maxWidth: 300, textAlign: 'center', color: 'black', fontSize: 14, fontFamily: SCHIBSTED, fontWeight: 400 }}>
              Utilize o botão “Adicionar” para adicionar as primeiras informações.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <PortariaTable data={paginatedData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} isHistory={tabValue === 1} onEdit={(row: any) => setDrawerConfig({open: true, mode: 'edit', data: row})} onView={(row: any) => setDrawerConfig({open: true, mode: 'view', data: row})} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, borderTop: '1px solid rgba(0,0,0,0.12)', bgcolor: 'white' }}>
              <TablePagination component="div" count={filteredData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, newPage) => setPage(newPage)} rowsPerPageOptions={[]} labelDisplayedRows={({ count }) => `5 linhas por página de ${count}`} sx={{ border: 'none', '& .MuiTablePagination-displayedRows': { fontFamily: SCHIBSTED, fontSize: { xs: 10, sm: 12 }, color: 'black' } }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* 🛡️ MODAL DE EXCLUSÃO BLINDADO */}
      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} sx={{ zIndex: 6000 }} PaperProps={{ sx: { width: { xs: '100%', sm: 620 }, bgcolor: 'white' } }}>
        <Box sx={{ minHeight: { xs: 120, sm: 148 }, px: '20px', pt: { xs: '32px', sm: '48px' }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box><Typography sx={{ fontSize: { xs: 24, sm: 32 }, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography>
          <Typography sx={{ fontSize: { xs: 16, sm: 20 }, mt: 3, fontFamily: SCHIBSTED, color: 'black', lineHeight: '28px', fontWeight: 400 }}>Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?</Typography></Box>
          <IconButton onClick={() => setIsDeleteDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ mt: 'auto', p: '20px', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Button variant="outlined" fullWidth onClick={() => setIsDeleteDrawerOpen(false)} sx={{ height: 48, fontFamily: SCHIBSTED }}>NÃO</Button>
          <Button variant="contained" fullWidth onClick={() => { setData(prev => prev.filter(i => !selectedIds.includes(i.id))); setSelectedIds([]); setIsDeleteDrawerOpen(false); onSuccess("Registro excluído com sucesso", "O registro foi removido e não está mais disponível no sistema."); }} sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>SIM</Button>
        </Box>
      </Drawer>

      <PortariaDrawer open={drawerConfig.open} mode={drawerConfig.mode} initialData={drawerConfig.data} onClose={() => setDrawerConfig({open: false, mode: 'add', data: null})} onSave={handleSave} />
    </Box>
  );
};