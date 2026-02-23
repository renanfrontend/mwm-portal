import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, Typography, Tabs, Tab, TextField, IconButton, 
  Button, Link, Stack, Chip, Paper, Collapse, TablePagination, Checkbox, Drawer
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  CloseIcon, CheckCircleOutlined, HomeIcon, MoreHorizIcon, 
  AddIcon, VisibilityIcon, EditIcon, Delete, FileDownload, FilterAlt 
} from '../constants/muiIcons';

import ProdutorDrawer from '../components/ProdutorDrawer';
import { useCooperadoMutation } from '../hooks/useCooperadoMutation';
import { ProdutorService } from '../services/produtorService';
import type { ProdutorFormInput, ProdutorListItem } from '../types/cooperado';
import { TransportadoraList } from '../components/TransportadoraList';
import { AgendaList } from '../components/AgendaList';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const Logistica: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [producers, setProducers] = useState<ProdutorListItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedProducer, setSelectedProducer] = useState<ProdutorListItem | null>(null);
  const [selectedProducerFullData, setSelectedProducerFullData] = useState<ProdutorFormInput | null>(null);
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '' });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 🛡️ FIX: Removidos isLoading e error (estavam acusando TS6133)
  const { createCooperado, updateCooperado, deleteCooperado } = useCooperadoMutation();

  const loadProducers = useCallback(async () => {
    try {
      const response = await ProdutorService.list(1, 1, 1, 9999);
      setProducers(response.items || []);
      setTotalItems(response.total || 0);
    } catch (err) { console.error('Erro ao carregar lista:', err); }
  }, []);

  useEffect(() => { loadProducers(); }, [loadProducers]);

  const handleShowToast = (title: string, message: string) => {
    setToastConfig({ open: true, title, message });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 6000);
  };

  const visibleProducers = useMemo(() => {
    return producers
      .filter(p => (p.nomeProdutor || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [producers, searchTerm, page, rowsPerPage]);

  const isAllSelected = visibleProducers.length > 0 && visibleProducers.every(p => selectedIds.includes(p.id));
  const isSomeSelected = visibleProducers.some(p => selectedIds.includes(p.id)) && !isAllSelected;

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleHeaderCheckboxClick = () => {
    if (isAllSelected) {
      const visibleIds = visibleProducers.map(p => p.id);
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      const visibleIds = visibleProducers.map(p => p.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) { await deleteCooperado(id); }
      await loadProducers(); 
      setSelectedIds([]); 
      setIsDeleteDialogOpen(false);
      handleShowToast('Registro excluído com sucesso', 'O registro foi removido do sistema.');
    } catch (err) { console.error("Erro na exclusão:", err); }
  };

  const handleSave = async (formData: ProdutorFormInput) => {
    try {
      let result;
      if (drawerMode === 'edit' && selectedProducer?.id) {
        result = await updateCooperado(selectedProducer.id, formData);
      } else {
        result = await createCooperado(formData);
      }
      if (result) {
        await loadProducers(); 
        setIsDrawerOpen(false);
        handleShowToast('Registro atualizado com sucesso', 'As alterações foram salvas.');
      }
    } catch (err) { console.error('Falha no salvamento:', err); }
  };

  const openDrawer = async (mode: 'create' | 'view' | 'edit', producer?: ProdutorListItem) => {
    setDrawerMode(mode); setSelectedProducer(producer || null); setSelectedProducerFullData(null);
    if ((mode === 'view' || mode === 'edit') && producer?.id) {
       try {
         const response = await ProdutorService.getById(producer.id);
         const d = response as any; 
         console.log('DEBUG - Produtor Detalhes:', d);
         setSelectedProducerFullData({
            cpfCnpj: d.bioProdutor?.cpfCnpj || d.cpfCnpj || d.cpf_cnpj || d.cnpj || d.cpf || '', 
            nome: d.bioProdutor?.nome || d.nomeCooperado || d.nome || '',
            numEstabelecimento: d.numeroEstabelecimento || d.numEstabelecimento || d.numero_estabelecimento || d.num_estabelecimento || '', 
            nPropriedade: d.numeroPropriedade || d.numPropriedade || d.numero_propriedade || d.num_propriedade || '',
            matricula: String(d.matricula || ''), 
            filiada: String(d.bioProdutor?.filiadaId || d.filiadaId || d.filiada_id || ''),
            faseDejeto: d.fase || '', 
            cabecas: String(d.cabecas || d.cabecasAlojadas || d.cabecas_alojadas || ''),
            certificado: (d.certificado === 'Ativo' || d.certificado === 'Sim') ? 'Sim' : 'Não', 
            doamDejetos: d.doamDejetos || 'Não',
            qtdLagoas: String(d.qtdLagoas || '1'), 
            volLagoas: d.volLagoas || '', 
            restricoes: d.restricoes || '',
            responsavel: d.responsavel || '', 
            tecnico: d.tecnico || '', 
            municipio: d.municipio || '',
            lat: String(d.latitude || ''), 
            long: String(d.longitude || ''),
            distancia: d.distancia || '', 
            localizacao: d.localizacao || ''
         });
       } catch (err) { console.error('Erro ao buscar detalhes:', err); }
    }
    setIsDrawerOpen(true);
  };

  const currentTab = location.pathname.includes('transportadora') ? 1 : location.pathname.includes('agenda') ? 2 : 0;
  const tabLabel = currentTab === 0 ? 'Produtor' : currentTab === 1 ? 'Transportadora' : 'Agenda';
  const tableGrid = "48px 2.2fr 1.5fr 1.1fr 1.1fr 1.3fr 0.9fr 1.1fr 1.5fr 100px";

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: '24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      {/* BREADCRUMBS RESTAURADOS */}
      <Box sx={{ alignSelf: 'stretch', mb: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '16px', fontFamily: SCHIBSTED }}>Logística / {tabLabel}</Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', fontFamily: SCHIBSTED }}>Logística</Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ bgcolor: '#F1F9EE', borderRadius: '4px', p: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: 2, border: '1px solid rgba(112, 191, 84, 0.2)', mb: 3 }}>
            <CheckCircleOutlined sx={{ color: '#70BF54', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#2F5023', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
                <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED, opacity: 0.8 }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(prev => ({ ...prev, open: false }))} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ pt: 4, px: 2 }}><Tabs value={currentTab}><Tab label="PRODUTOR" component={NavLink} to="/logistica" /><Tab label="TRANSPORTADORA" component={NavLink} to="/transportadoras" /><Tab label="AGENDA" component={NavLink} to="/agenda" /></Tabs></Box>

        {currentTab === 0 && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField sx={{ width: 500 }} label="Buscar" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton disabled={selectedIds.length === 0} sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'inherit' }} onClick={() => setIsDeleteDialogOpen(true)}><Delete /></IconButton>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FileDownload /></IconButton>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAlt /></IconButton>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDrawer('create')} sx={{ bgcolor: '#0072C3', height: 40, px: 3, fontFamily: SCHIBSTED, fontWeight: 600 }}>ADICIONAR</Button>
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: '16px' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 56, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.04)', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                <Checkbox size="small" checked={isAllSelected} indeterminate={isSomeSelected} onChange={handleHeaderCheckboxClick} />
                {['Nome do produtor', 'N° do estabelecimento', 'Filiada', 'Modalidade', 'Quantidade de cabeças', 'Distância', 'Certificado', 'Participa do projeto', 'Ações'].map(c => (
                  <Typography key={c} sx={{ fontSize: 11, fontWeight: 600, fontFamily: SCHIBSTED }}>{c}</Typography>
                ))}
              </Box>

              <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {visibleProducers.map(p => (
                  <Box key={p.id} onClick={() => handleToggleSelect(p.id)} sx={{ display: 'grid', gridTemplateColumns: tableGrid, minHeight: 52, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', bgcolor: selectedIds.includes(p.id) ? 'rgba(0, 114, 195, 0.12)' : 'inherit' }}>
                    <Checkbox size="small" checked={selectedIds.includes(p.id)} />
                    <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nomeProdutor}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.numEstabelecimento}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.filiada}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.modalidade}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.cabecasAlojadas || 0}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.distancia || '-'}</Typography>
                    <Box><Chip label={p.certificado} size="small" sx={{ height: 22, fontSize: 10, fontWeight: 600, borderRadius: '4px', bgcolor: (p.certificado === 'Sim' || p.certificado === 'Ativo') ? '#F1F9EE' : '#FFEDEE', color: (p.certificado === 'Sim' || p.certificado === 'Ativo') ? '#70BF54' : '#E4464E' }} /></Box>
                    <Box><Chip label={p.participaProjeto || 'Sim'} size="small" sx={{ height: 22, fontSize: 10, fontWeight: 600, borderRadius: '4px', bgcolor: '#F1F9EE', color: '#70BF54' }} /></Box>
                    <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', p)}><VisibilityIcon sx={{ fontSize: 20 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', p)}><EditIcon sx={{ fontSize: 20 }} /></IconButton>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
            <TablePagination component="div" count={totalItems} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} />
          </Box>
        )}
        {currentTab === 1 && <TransportadoraList onShowSuccess={handleShowToast} />}
        {currentTab === 2 && <AgendaList onShowSuccess={handleShowToast} />}
      </Paper>
      
      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 6000 }}>
        <Box sx={{ width: 620, p: '32px 20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}><Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography><IconButton onClick={() => setIsDeleteDialogOpen(false)}><CloseIcon /></IconButton></Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, fontFamily: SCHIBSTED, textAlign: 'justify', mb: 'auto' }}>Deseja excluir esses registros? Ao confirmar todas as informações associadas serão removidas permanentemente.</Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 3 }}><Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.5)', fontFamily: SCHIBSTED }}>NÃO</Button><Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>SIM</Button></Stack>
        </Box>
      </Drawer>
      <ProdutorDrawer key={isDrawerOpen ? 'open' : 'closed'} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSave={handleSave} mode={drawerMode} initialData={selectedProducerFullData} />
    </Box>
  );
};

export default Logistica;