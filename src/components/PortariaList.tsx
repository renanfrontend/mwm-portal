import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography, Stack } from '@mui/material';
import { 
  Delete as DeleteIcon, 
  FileUpload as FileUploadIcon, 
  FilterAlt as FilterAltIcon, 
  Add as AddIcon, 
  Close as CloseIcon, 
  CheckCircleOutlined 
} from '@mui/icons-material';
import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import EmptyImage from '../assets/empty-states-sheets.png';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

export const PortariaList: React.FC<any> = ({ onSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [data, setData] = useState<any[]>([
    { id: '1', data: '09/02/2026', hora: '12:15', atividade: 'Abastecimento', nome: 'Augusto Ribeiro Santos', placa: 'ABC-1234', status: 'Em andamento' }
  ]);

  const handleConfirmDelete = () => {
    setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsDeleteDrawerOpen(false);
    
    // 🛡️ SUCESSO: Apenas texto limpo, o componente pai já deve gerenciar o ícone base
    onSuccess("Registros removidos com sucesso", "As alterações já estão disponíveis no sistema.");
  };

  const handleSave = (entry: any) => {
    const newRow = {
      id: Math.random().toString(),
      data: entry.data?.toLocaleDateString('pt-BR') || '-',
      hora: entry.horario?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || '-',
      atividade: entry.atividade, nome: entry.motorista,
      placa: entry.transportadora === 'Outros' ? entry.placaManual : entry.placa,
      status: 'Em andamento'
    };
    setData(prev => [newRow, ...prev]);
    onSuccess("Registro realizado com sucesso", "O cadastro foi salvo e está em andamento.");
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* 🛡️ TABS: Divider removido conforme solicitado */}
      <Box sx={{ pt: 4, px: 2 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500, fontSize: '14px' } }}>
          <Tab label="Registro" />
          <Tab label="Histórico" />
        </Tabs>
      </Box>

      <Box sx={{ p: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField sx={{ width: 500 }} label="Buscar" placeholder="Digite para pesquisar" size="small" />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            
            {/* 🛡️ ORDEM: Lixeira, Upload, Filtro */}
            <IconButton 
              disabled={selectedIds.length === 0} 
              onClick={() => setIsDeleteDrawerOpen(true)}
              sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }}
            >
              <DeleteIcon />
            </IconButton>

            <IconButton disabled><FileUploadIcon /></IconButton>
            <IconButton disabled><FilterAltIcon /></IconButton>

            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDrawerOpen(true)} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: 500 }}>
              Adicionar
            </Button>
          </Box>
        </Box>

        {data.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <img src={EmptyImage} alt="Área sem registros" style={{ width: 150 }} />
            <Typography sx={{ fontFamily: SCHIBSTED, fontSize: 18, fontWeight: 500 }}>Área sem registros</Typography>
            <Typography sx={{ fontFamily: SCHIBSTED, fontSize: 14, color: 'rgba(0,0,0,0.6)', textAlign: 'center' }}>Utilize o botão "Adicionar" para adicionar as primeiras informações.</Typography>
          </Box>
        ) : (
          <PortariaTable data={data} selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        )}
      </Box>

      <PortariaDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSave={handleSave} />

      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} PaperProps={{ sx: { width: 620, border: 'none' } }}>
        <Box sx={{ width: 620, p: '48px 32px 24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ width: 550, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>EXCLUIR REGISTRO</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 500, fontFamily: SCHIBSTED, lineHeight: '32px', textAlign: 'justify' }}>Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?</Typography>
          </Box>
          <IconButton onClick={() => setIsDeleteDrawerOpen(false)} sx={{ mt: -1 }}><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ mt: 'auto', width: 620, height: 104, display: 'flex', alignItems: 'center', px: '20px', gap: '20px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Button variant="outlined" onClick={() => setIsDeleteDrawerOpen(false)} sx={{ width: 280, height: 48, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.50)', fontFamily: SCHIBSTED }}>NÃO</Button>
          <Button variant="contained" onClick={handleConfirmDelete} sx={{ width: 280, height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>Sim</Button>
        </Box>
      </Drawer>
    </Box>
  );
};