import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, Typography, Tabs, Tab, TextField, IconButton, 
  Button, Link, Stack, Chip, Paper, Collapse, Checkbox, Drawer
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  CloseIcon, CheckCircleOutlined, HomeIcon, MoreHorizIcon, 
  AddIcon, VisibilityIcon, EditIcon, Delete
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
  
  const [page] = useState(0);
  const [rowsPerPage] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { createCooperado, updateCooperado, deleteCooperado } = useCooperadoMutation();

  const loadProducers = useCallback(async () => {
    try {
      const response = await ProdutorService.list(1, 1, 1, 9999);
      setProducers(response.items || []);
    } catch (err) { console.error('Erro ao carregar lista:', err); }
  }, []);

  useEffect(() => { loadProducers(); }, [loadProducers]);

  const handleShowToast = (title: string, message: string) => {
    setToastConfig({ open: true, title, message });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 6000);
  };

  const visibleProducers = useMemo(() => {
    return producers
      .filter(p => {
        const s = searchTerm.toLowerCase();
        return (
          (p.nomeProdutor || '').toLowerCase().includes(s) ||
          (p.numEstabelecimento || '').toLowerCase().includes(s) ||
          (p.filiada || '').toLowerCase().includes(s)
        );
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [producers, searchTerm, page, rowsPerPage]);

  const getRowKey = (producer: ProdutorListItem): string => {
    if (producer.estabelecimentoId !== undefined && producer.estabelecimentoId !== null) {
      return `est-${producer.estabelecimentoId}`;
    }
    return `${producer.id}-${producer.numEstabelecimento || ''}`;
  };


  const isAllSelected = visibleProducers.length > 0 && visibleProducers.every(p => selectedRowKeys.includes(getRowKey(p)));
  const isSomeSelected = visibleProducers.some(p => selectedRowKeys.includes(getRowKey(p))) && !isAllSelected;

  const handleToggleSelect = (rowKey: string) => {
    setSelectedRowKeys(prev => prev.includes(rowKey) ? prev.filter(i => i !== rowKey) : [...prev, rowKey]);
  };

  const handleHeaderCheckboxClick = () => {
    if (isAllSelected) {
      const visibleKeys = visibleProducers.map(getRowKey);
      setSelectedRowKeys(prev => prev.filter(key => !visibleKeys.includes(key)));
    } else {
      const visibleKeys = visibleProducers.map(getRowKey);
      setSelectedRowKeys(prev => Array.from(new Set([...prev, ...visibleKeys])));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const selectedProducers = producers.filter(p => selectedRowKeys.includes(getRowKey(p)));
      const estabelecimentoIds = selectedProducers
        .map((producer) => producer.estabelecimentoId)
        .filter((id): id is number => typeof id === 'number');

      if (estabelecimentoIds.length === 0) {
        console.error('Nenhum estabelecimentoId válido encontrado para exclusão.');
        return;
      }

      if (estabelecimentoIds.length === 1) {
        await deleteCooperado(estabelecimentoIds[0]);
      } else {
        await ProdutorService.deleteBatch(estabelecimentoIds);
      }

      await loadProducers(); 
      setSelectedRowKeys([]); 
      setIsDeleteDialogOpen(false);
      handleShowToast('Registro excluído com sucesso', 'As informações foram removidas.');
    } catch (err) { console.error("Erro na exclusão:", err); setIsDeleteDialogOpen(false); }
  };

  const handleSave = async (formData: ProdutorFormInput) => {
    try {
      let result;
      const selectedIdentifier = selectedProducer?.estabelecimentoId ?? selectedProducer?.id;
      if (drawerMode === 'edit' && selectedIdentifier) {
        result = await updateCooperado(selectedIdentifier, formData);
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
    const selectedIdentifier = producer?.estabelecimentoId ?? producer?.id;
    if ((mode === 'view' || mode === 'edit') && selectedIdentifier) {
        try {
          const response = await ProdutorService.getById(selectedIdentifier);
          const d = response as any;
          // Padroniza certificado e doamDejetos para 'Sim'/'Não' (string)
          const certificado = (d.certificado === true || d.certificado === 'Sim') ? 'Sim' : 'Não';
          const doamDejetosRaw = d.doamDejetos || d.bioProdutor?.doamDejetos || d.doam_dejetos;
          const doamDejetos = (doamDejetosRaw === true || doamDejetosRaw === 'Sim') ? 'Sim' : 'Não';
          setSelectedProducerFullData({
            cpfCnpj: d.bioProdutor?.cpfCnpj || d.cpfCnpj || d.cpf_cnpj || d.cnpj || d.cpf || '',
            nome: d.bioProdutor?.nome || d.nomeCooperado || d.nome || '',
            numEstabelecimento: d.numeroEstabelecimento || d.numEstabelecimento || d.numero_estabelecimento || d.num_estabelecimento || '',
            nPropriedade: d.numeroPropriedade || d.numPropriedade || d.numero_propriedade || d.num_propriedade || '',
            matricula: String(d.matricula || ''),
            filiada: String(d.bioProdutor?.filiadaId || d.filiadaId || d.filiada_id || ''),
            faseDejeto: d.fase || '',
            cabecas: String(d.cabecas || d.cabecasAlojadas || d.cabecas_alojadas || ''),
            certificado,
            doamDejetos,
            qtdLagoas: String(d.qtdLagoas || '1'),
            volLagoas: d.volLagoas || '',
            restricoes: d.restricoes || '',
            responsavel: d.responsavel || (d.bioEstabelecimento ? d.bioEstabelecimento.responsavel : ''),
            tecnico: d.tecnico || (d.bioProducao && d.bioProducao.length > 0 ? d.bioProducao[0].tecnicoResponsavel : ''),
            municipio: d.municipio || '',
            // Força 6 casas decimais para garantir precisão visual de GPS (ex: 12 -> "12.000000")
            lat: d.latitude !== null && d.latitude !== undefined ? Number(d.latitude).toFixed(6) : '',
            long: d.longitude !== null && d.longitude !== undefined ? Number(d.longitude).toFixed(6) : '',
            distancia: d.distancia || '',

            localizacao: d.localizacao || ''
          });
        } catch (err) { console.error('Erro ao buscar detalhes:', err); }
    }
    setIsDrawerOpen(true);
  };

  const currentTab = location.pathname.includes('transportadora') ? 1 : location.pathname.includes('agenda') ? 2 : 0;
  const tableGrid = "40px 1.8fr 1.1fr 0.9fr 0.9fr 0.9fr 0.7fr 0.9fr 1fr 85px";

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '8px 24px 12px 24px', bgcolor: '#F5F5F5', overflow: 'hidden', boxSizing: 'border-box', minWidth: 0 }}>
      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '14px', fontFamily: SCHIBSTED }}>Logística / {currentTab === 0 ? 'Produtor' : currentTab === 1 ? 'Transportadora' : 'Agenda'}</Typography>
        </Box>
        <Typography sx={{ color: 'black', fontSize: 48, fontFamily: SCHIBSTED, fontWeight: '400', lineHeight: '56.02px' }}>Logística</Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ mb: 1, width: '100%', flexShrink: 0 }}>
          <Box sx={{ padding: '6px 16px', background: '#F1F9EE', borderRadius: '4px', display: 'flex', border: '1px solid rgba(112, 191, 84, 0.2)', alignItems: 'center' }}>
            <Box sx={{ paddingRight: 12, display: 'flex' }}><div style={{ width: 22, height: 22, background: '#70BF54', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircleOutlined sx={{ fontSize: 16, color: '#F1F9EE' }} /></div></Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#2F5023', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
              <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(prev => ({ ...prev, open: false }))} size="small"><CloseIcon sx={{ fontSize: 20, color: '#2F5023' }} /></IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Box sx={{ pt: 1.5, px: 2, flexShrink: 0 }}>
          <Tabs value={currentTab} sx={{ minHeight: 36 }}>
            <Tab label="PRODUTOR" component={NavLink} to="/logistica" sx={{ minHeight: 36, fontSize: 13 }} />
            <Tab label="TRANSPORTADORA" component={NavLink} to="/transportadoras" sx={{ minHeight: 36, fontSize: 13 }} />
            <Tab label="AGENDA" component={NavLink} to="/agenda" sx={{ minHeight: 36, fontSize: 13 }} />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <TextField placeholder="Buscar" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton 
                  disabled={selectedRowKeys.length === 0} 
                  sx={{ padding: '8px', borderRadius: '100%', color: selectedRowKeys.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }} 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Delete sx={{ width: 24, height: 24 }} />
                </IconButton>
                <Button variant="contained" startIcon={<AddIcon sx={{ width: 20, height: 20 }} />} onClick={() => openDrawer('create')} sx={{ px: '16px', py: '6px', background: '#0072C3', borderRadius: '4px', color: 'white', fontSize: '14px', fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase' }}>Adicionar</Button>
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
                  (() => {
                    const rowKey = getRowKey(p);
                    const isSelected = selectedRowKeys.includes(rowKey);
                    return (
                  <Box 
                    key={rowKey} 
                    onClick={() => handleToggleSelect(rowKey)} 
                    sx={{ 
                      display: 'grid', gridTemplateColumns: tableGrid, minHeight: 52, alignItems: 'center', px: 2, 
                      borderBottom: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', 
                      bgcolor: isSelected ? 'rgba(0, 114, 195, 0.12)' : 'inherit' 
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Checkbox size="small" checked={true} />}
                    </Box>
                    <Typography sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nomeProdutor}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.numEstabelecimento}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.filiada}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.modalidade}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.cabecasAlojadas || 0}</Typography>
                    <Typography sx={{ fontSize: 13 }}>{p.distancia && p.distancia !== '-' ? p.distancia : '0 Km'}</Typography>
                    <Box><Chip label={p.certificado} size="small" sx={{ height: 22, fontSize: 10, fontWeight: 600, borderRadius: '4px', bgcolor: p.certificado === 'Sim' ? '#F1F9EE' : '#FFEDEE', color: p.certificado === 'Sim' ? '#70BF54' : '#E4464E' }} /></Box>
                    <Box><Chip label={p.doamDejetos || ''} size="small" sx={{ height: 22, fontSize: 10, fontWeight: 600, borderRadius: '4px', bgcolor: p.doamDejetos === 'Sim' ? '#F1F9EE' : '#FFEDEE', color: p.doamDejetos === 'Sim' ? '#70BF54' : '#E4464E' }} /></Box>
                    <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', p)}><VisibilityIcon sx={{ fontSize: 20 }} /></IconButton>
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', p)}><EditIcon sx={{ fontSize: 20 }} /></IconButton>
                    </Stack>
                  </Box>
                    );
                  })()
                ))}
              </Box>
            </Box>
          </Box>
        )}
        {currentTab === 1 && <TransportadoraList onShowSuccess={handleShowToast} />}
        {currentTab === 2 && <AgendaList />}
      </Paper>
      
      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 1400 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '40px 12px 40px 32px', position: 'relative' }}>
          <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ position: 'absolute', right: 4, top: 8, color: 'rgba(0,0,0,0.54)' }}><CloseIcon sx={{ fontSize: 24 }} /></IconButton>
          <Typography sx={{ color: 'black', fontSize: 32, fontFamily: SCHIBSTED, fontWeight: 700, lineHeight: '39.52px', letterSpacing: 0.25 }}>EXCLUIR PRODUTOR</Typography>
          <Typography sx={{ mt: 3, maxWidth: 580, textAlign: 'justify', color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: 500, lineHeight: '32px', letterSpacing: 0.15 }}>Ao excluir esse registro do produtor todas as informações associadas à ela serão removidas. Deseja excluir esse registro do produtor?</Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3', border: '1px solid rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <ProdutorDrawer key={isDrawerOpen ? '1' : '0'} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSave={handleSave} mode={drawerMode} initialData={selectedProducerFullData} />
    </Box>
  );
};

export default Logistica;