import React, { useState, useMemo } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, FileUpload as FileUploadIcon, FilterAlt as FilterAltIcon, Close as CloseIcon } from '@mui/icons-material';
import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import EmptyImage from '../assets/empty-states-sheets.png';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const isOlderThan24h = (dateStr: string, timeStr: string) => {
  const [d, m, y] = dateStr.split('/').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const recordDate = new Date(y, m - 1, d, hh, mm);
  return (new Date().getTime() - recordDate.getTime()) > (24 * 60 * 60 * 1000);
};

export const PortariaList: React.FC<any> = ({ onSuccess, onTabChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerConfig, setDrawerConfig] = useState<{open: boolean, mode: 'add'|'edit'|'view', data: any}>({open: false, mode: 'add', data: null});
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  
  const [data, setData] = useState<any[]>([
    { id: '1', data: '18/02/2026', hora: '08:00', atividade: 'Abastecimento', nome: 'Renan Augusto', placa: 'ABC-1234', status: 'Em andamento', responsavel: 'Gilson Alves', cpfPassaporte: '111.111.111-11' },
    { id: '2', data: '18/02/2026', hora: '09:00', atividade: 'Visita', nome: 'Mariana Silva', placa: 'GHI-9012', status: 'Em andamento', responsavel: 'Gilson Alves', cpfPassaporte: '444.444.444-44' },
    { id: '3', data: '10/01/2026', hora: '14:20', atividade: 'Expedição', nome: 'Carlos Antigo', placa: 'DEF-5678', status: 'Em andamento', responsavel: 'Sistema', cpfPassaporte: '222.222.222-22' }
  ]);

  const filteredData = useMemo(() => {
    return data.map(item => {
      const isExpired = item.atividade !== 'Entrega de dejetos' && isOlderThan24h(item.data, item.hora);
      const isDejetosFinished = item.atividade === 'Entrega de dejetos' && item.dataSaida && item.horarioSaida && item.pesoInicial && item.pesoFinal;
      if (isExpired || isDejetosFinished) return { ...item, status: 'Concluído' };
      return item;
    }).filter(item => (tabValue === 0 ? item.status !== 'Concluído' : item.status === 'Concluído'));
  }, [data, tabValue]);

  const handleSave = (entry: any) => {
    const formattedData = entry.data instanceof Date ? entry.data.toLocaleDateString('pt-BR') : entry.data;
    const formattedHora = entry.horario instanceof Date ? entry.horario.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : entry.hora;

    if (drawerConfig.mode === 'edit') {
       setData(prev => prev.map(i => i.id === entry.id ? { ...entry, data: formattedData, hora: formattedHora } : i));
       onSuccess("Registro atualizado", "As alterações foram salvas com sucesso.");
    } else {
       const newRow = { 
         ...entry, id: Math.random().toString(), status: 'Em andamento', 
         responsavel: 'Gilson Alves', nome: entry.motorista, data: formattedData, hora: formattedHora 
       };
       setData(prev => [newRow, ...prev]);
       onSuccess("Registro realizado", "O cadastro foi salvo com sucesso.");
    }
    setDrawerConfig({open: false, mode: 'add', data: null});
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ pt: 4, px: 2 }}><Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); onTabChange(v); }} sx={{ '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500 } }}><Tab label="Registro" /><Tab label="Histórico" /></Tabs></Box>
      
      <Box sx={{ p: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField sx={{ width: 500 }} label="Buscar" size="small" />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            
            {/* 🛡️ AJUSTE ÚNICO: Botão excluir renderizado apenas na aba Registro (tabValue === 0) */}
            {tabValue === 0 && (
              <IconButton 
                disabled={selectedIds.length === 0} 
                onClick={() => setIsDeleteDrawerOpen(true)} 
                sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            
            <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }}><FileUploadIcon /></IconButton>
            <IconButton sx={{ color: 'rgba(0, 0, 0, 0.54)' }}><FilterAltIcon /></IconButton>
            
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerConfig({open: true, mode: 'add', data: null})} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>ADICIONAR</Button>
          </Box>
        </Box>
        
        {filteredData.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><img src={EmptyImage} alt="Vazio" style={{ width: 150 }} /><Typography sx={{ mt: 2, fontFamily: SCHIBSTED }}>{tabValue === 0 ? "Área sem registros" : "Histórico vazio"}</Typography></Box>
        ) : (
          <PortariaTable data={filteredData} selectedIds={selectedIds} onSelectionChange={setSelectedIds} isHistory={tabValue === 1} 
            onEdit={(row: any) => setDrawerConfig({open: true, mode: 'edit', data: row})}
            onView={(row: any) => setDrawerConfig({open: true, mode: 'view', data: row})}
          />
        )}
      </Box>

      <PortariaDrawer open={drawerConfig.open} mode={drawerConfig.mode} initialData={drawerConfig.data} onClose={() => setDrawerConfig({open: false, mode: 'add', data: null})} onSave={handleSave} />
      
      {/* Drawer de Exclusão também blindado por tabValue por segurança extra */}
      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} sx={{ zIndex: 5000 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '48px 32px 24px 20px', display: 'flex', justifyContent: 'space-between' }}><Box><Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography><Typography sx={{ fontSize: 20, mt: 3, fontFamily: SCHIBSTED }}>Deseja excluir esse registro?</Typography></Box><IconButton onClick={() => setIsDeleteDrawerOpen(false)}><CloseIcon /></IconButton></Box>
        <Box sx={{ mt: 'auto', p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}><Button variant="outlined" fullWidth onClick={() => setIsDeleteDrawerOpen(false)} sx={{ height: 48 }}>NÃO</Button><Button variant="contained" fullWidth onClick={() => { setData(prev => prev.filter(i => !selectedIds.includes(i.id))); setSelectedIds([]); setIsDeleteDrawerOpen(false); onSuccess("Registro excluído com sucesso", "O registro foi removido e não está mais disponível no sistema."); }} sx={{ height: 48, bgcolor: '#0072C3' }}>SIM</Button></Box>
      </Drawer>
    </Box>
  );
};