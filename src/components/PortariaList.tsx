import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography, GlobalStyles, TablePagination } from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  FileUpload as FileUploadIcon, 
  FilterAlt as FilterAltIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import EmptyImage from '../assets/empty-states-sheets.png'; 

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

export const PortariaList: React.FC<any> = ({ onSuccess, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerConfig, setDrawerConfig] = useState<{open: boolean, mode: 'add'|'edit'|'view', data: any}>({open: false, mode: 'add', data: null});
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  
  const [data, setData] = useState<any[]>([
    { id: '1', data: '18/02/2026', hora: '08:00', atividade: 'Abastecimento', nome: 'Renan Augusto', placa: 'ABC-1234', status: 'Em andamento', responsavel: 'Gilson Alves' },
    { id: '3', data: '18/02/2026', hora: '09:15', atividade: 'Entrega de dejetos', nome: 'José da Silva', placa: 'ABC-5678', status: 'Concluído', responsavel: 'Gilson Silva Alves' },
    { id: '2', data: '18/02/2026', hora: '09:00', atividade: 'Visita', nome: 'Mariana Silva', placa: 'GHI-9012', status: 'Em andamento', responsavel: 'Gilson Alves' }
  ]);

  const filteredData = useMemo(() => {
    return data.filter(item => (tabValue === 0 ? item.status !== 'Concluído' : item.status === 'Concluído'));
  }, [data, tabValue]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleSave = (entry: any) => {
    const formattedData = entry.data instanceof Date ? entry.data.toLocaleDateString('pt-BR') : entry.data;
    const formattedHora = entry.horario instanceof Date ? entry.horario.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : entry.hora;
    
    if (drawerConfig.mode === 'edit') {
       setData(prev => prev.map(i => i.id === entry.id ? { ...entry, data: formattedData, hora: formattedHora } : i));
       
       // ✅ MENSAGEM: DENSIDADE NO HISTÓRICO
       if (tabValue === 1 && entry.atividade === 'Entrega de dejetos') {
          onSuccess("Densidade registrada", "As informações foram salvas com sucesso.");
       } else {
          // ✅ MENSAGEM: EDIÇÃO COMUM
          onSuccess("Registro atualizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
       }
    } else {
       const newRow = { ...entry, id: Math.random().toString(), status: 'Em andamento', data: formattedData, hora: formattedHora, responsavel: 'Gilson Alves', nome: entry.motorista || entry.visitante || entry.nome };
       setData(prev => [newRow, ...prev]);
       
       // ✅ MENSAGEM: NOVO CADASTRO
       onSuccess("Registro atualizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
    }
    setDrawerConfig({open: false, mode: 'add', data: null});
  };

  const handleDelete = () => {
    setData(prev => prev.filter(i => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    setIsDeleteDrawerOpen(false);
    // ✅ MENSAGEM: EXCLUSÃO
    onSuccess("Registro excluído com sucesso -", "O registro foi removido e não está mais disponível no sistema.");
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <GlobalStyles styles={{ 
        '.MuiAlert-root': { border: 'none !important', boxShadow: 'none !important' },
        '.MuiAlert-standardSuccess': { backgroundColor: '#F1F9EE !important' }
      }} />

      <Box sx={{ pt: 1.5, px: 2 }}>
        <Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); onTabChange(v); setPage(0); setSelectedIds([]); }} sx={{ minHeight: 36, '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, minHeight: 36, textTransform: 'uppercase' } }}>
          <Tab label="Registro" />
          <Tab label="Histórico" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField placeholder="Buscar" size="small" sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {tabValue === 0 && <IconButton disabled={selectedIds.length === 0} onClick={() => setIsDeleteDrawerOpen(true)} sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0,0,0,0.26)' }}><DeleteIcon /></IconButton>}
          <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUploadIcon /></IconButton>
          <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAltIcon /></IconButton>
          {tabValue === 0 && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerConfig({open: true, mode: 'add', data: null})} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>ADICIONAR</Button>}
        </Box>
      </Box>
      
      <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {filteredData.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img src={EmptyImage} alt="Vazio" style={{ width: 150, marginBottom: '24px' }} />
            <Typography sx={{ color: '#34343F', fontSize: 18, fontFamily: SCHIBSTED, fontWeight: 500 }}>Área sem registros</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden' }}>
            <Box sx={{ width: '100%', overflowX: 'auto', '& .MuiTableCell-root': { borderBottom: 'none' } }}>
              <PortariaTable 
                data={paginatedData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} isHistory={tabValue === 1} 
                onEdit={(row: any) => setDrawerConfig({open: true, mode: 'edit', data: row})} 
                onView={(row: any) => setDrawerConfig({open: true, mode: 'view', data: row})} 
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, bgcolor: 'white' }}>
              <TablePagination 
                component="div" 
                count={filteredData.length} 
                page={page} 
                onPageChange={(_, n) => setPage(n)} 
                rowsPerPage={rowsPerPage} 
                onRowsPerPageChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }} 
                rowsPerPageOptions={[5, 10, 25]} 
                labelRowsPerPage="Linhas por página:" 
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
                sx={{ border: 'none', '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': { fontFamily: SCHIBSTED, fontSize: 12, color: 'black' } }} 
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* MODAL DE EXCLUSÃO */}
      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '24px 32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography>
              <Typography sx={{ fontSize: 20, mt: 3, fontFamily: SCHIBSTED, color: 'black', lineHeight: '28px' }}>
                Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?
              </Typography>
            </Box>
            <IconButton onClick={() => setIsDeleteDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDrawerOpen(false)} sx={{ height: 48, color: '#0072C3', borderColor: '#0072C3', fontWeight: 600 }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDelete} sx={{ height: 48, bgcolor: '#0072C3', fontWeight: 600 }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <PortariaDrawer open={drawerConfig.open} mode={drawerConfig.mode} initialData={drawerConfig.data} onClose={() => setDrawerConfig({open: false, mode: 'add', data: null})} onSave={handleSave} />
    </Box>
  );
};