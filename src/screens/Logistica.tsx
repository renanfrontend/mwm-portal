import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, Typography, Tabs, Tab, TextField, IconButton, 
  Button, Link, Stack, Chip, Paper, Collapse, TablePagination, Checkbox, Drawer
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  CloseIcon, CheckCircleOutlined, HomeIcon, MoreHorizIcon, 
  AddIcon, VisibilityIcon, EditIcon, Delete, ErrorIcon
} from '../constants/muiIcons';

import ProdutorDrawer from '../components/ProdutorDrawer';
import { useCooperadoMutation } from '../hooks/useCooperadoMutation';
import { ProdutorService } from '../services/produtorService';
import type { ProdutorFormInput, ProdutorListItem } from '../types/cooperado';
import { TransportadoraList } from '../components/TransportadoraList';
import AgendaList from '../components/AgendaList';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const Logistica: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [producers, setProducers] = useState<ProdutorListItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedProducer, setSelectedProducer] = useState<ProdutorListItem | null>(null);
  const [selectedProducerFullData, setSelectedProducerFullData] = useState<ProdutorFormInput | null>(null);
  
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '', severity: 'success' as 'success' | 'error' });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { createCooperado, updateCooperado, deleteCooperado } = useCooperadoMutation();

  const tableGrid = "40px 1.8fr 1.1fr 0.9fr 0.9fr 0.9fr 0.7fr 0.9fr 1fr 85px";

  const loadProducers = useCallback(async () => {
    try {
      const response = await ProdutorService.list(1, 1, 1, 9999);
      const items = response.items || [];
      setProducers(items);
      setTotalItems(response.total || items.length || 0);
    } catch (err) { console.error('Erro ao carregar produtores:', err); }
  }, []);

  useEffect(() => { loadProducers(); }, [loadProducers]);

  const handleShowToast = (title: string, message: string, severity: 'success' | 'error' = 'success') => {
    setToastConfig({ open: true, title, message, severity });
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

  const getRowKey = (p: ProdutorListItem) => p.estabelecimentoId ? `est-${p.estabelecimentoId}` : `${p.id}`;

  const handleToggleSelect = (rowKey: string) => {
    setSelectedRowKeys(prev => prev.includes(rowKey) ? prev.filter(i => i !== rowKey) : [...prev, rowKey]);
  };

  const handleHeaderCheckboxClick = () => {
    const visibleKeys = visibleProducers.map(getRowKey);
    const isAllVisibleSelected = visibleKeys.every(k => selectedRowKeys.includes(k));
    if (isAllVisibleSelected) {
      setSelectedRowKeys(prev => prev.filter(key => !visibleKeys.includes(key)));
    } else {
      setSelectedRowKeys(prev => Array.from(new Set([...prev, ...visibleKeys])));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = producers
        .filter(p => selectedRowKeys.includes(getRowKey(p)))
        .map(p => p.estabelecimentoId)
        .filter((id): id is number => typeof id === 'number');

      if (idsToDelete.length === 0) return;
      for (const id of idsToDelete) { await deleteCooperado(id); }
      
      await loadProducers();
      setSelectedRowKeys([]);
      setIsDeleteDialogOpen(false);
      // ✅ MENSAGEM PADRONIZADA PARA EXCLUSÃO
      handleShowToast('Registro excluído com sucesso', 'O registro foi removido e não está mais disponível no sistema.', 'success');
    } catch (err) {
      setIsDeleteDialogOpen(false);
      handleShowToast('Erro ao excluir', 'Não foi possível concluir a remoção.', 'error');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const id = selectedProducer?.estabelecimentoId ?? selectedProducer?.id;
      const sanitizedPayload = {
        ...formData,
        distancia: String(formData.distancia || formData.distanciaKm || '')
      };

      if (drawerMode === 'edit' && id) {
        await updateCooperado(id, sanitizedPayload);
      } else {
        await createCooperado(sanitizedPayload);
      }
      
      setIsDrawerOpen(false);
      await new Promise(r => setTimeout(r, 500));
      await loadProducers(); 
      // ✅ MENSAGEM PADRONIZADA PARA SALVAR/EDITAR
      handleShowToast('Registro atualizado com sucesso', 'As alterações foram salvas e já estão disponíveis no sistema.', 'success');
    } catch (err: any) {
      handleShowToast('Falha na operação', 'Erro ao processar a solicitação.', 'error');
    }
  };

  const openDrawer = async (mode: 'create' | 'view' | 'edit', producer?: ProdutorListItem) => {
    setDrawerMode(mode); setSelectedProducer(producer || null); setSelectedProducerFullData(null);
    const id = producer?.estabelecimentoId ?? producer?.id;

    if ((mode === 'view' || mode === 'edit') && id) {
        try {
          const response = await ProdutorService.getById(id);
          const d: any = (response as any).data || response;
          const nomeCru = d.bioProdutor?.nome || d.nomeCooperado || d.nome || '';
          const nomeLimpo = nomeCru.split(' - ')[0];

          setSelectedProducerFullData({
            ...d,
            nome: nomeLimpo,
            cpfCnpj: d.bioProdutor?.cpfCnpj || d.cpfCnpj || '',
            numEstabelecimento: d.numeroEstabelecimento || d.numEstabelecimento || '',
            nPropriedade: d.numPropriedade || d.numeroPropriedade || '',
            matricula: String(d.matricula || ''),
            cabecas: String(d.cabecas || d.cabecasAlojadas || ''),
            lat: d.latitude !== undefined ? String(d.latitude) : '',
            long: d.longitude !== undefined ? String(d.longitude) : '',
            distancia: String(d.distanciaKm || d.distancia || ''),
            certificado: (d.certificado === 'Sim' || d.certificado === true) ? 'Sim' : 'Não',
            doamDejetos: (d.doamDejetos === 'Sim' || d.doamDejetos === true) ? 'Sim' : 'Não',
          } as any);
        } catch (err) { console.error('Erro ao mapear detalhes:', err); }
    }
    setIsDrawerOpen(true);
  };

  const currentTabIndex = location.pathname.includes('transportadora') ? 1 
                        : location.pathname.includes('agenda') ? 2 
                        : 0;

  const isSuccess = toastConfig.severity === 'success';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      p: '8px 24px 12px 24px',
      bgcolor: '#F5F5F5',
      boxSizing: 'border-box',
      minWidth: 0,
      ...(currentTabIndex === 2 ? { height: 'auto', overflow: 'visible' } : { height: '100vh', overflow: 'hidden' })
    }}>
      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: 14, fontFamily: SCHIBSTED }}>
             Logística / {currentTabIndex === 0 ? 'Produtor' : currentTabIndex === 1 ? 'Transportadora' : 'Agenda'}
          </Typography>
        </Box>
        <Typography sx={{ color: 'black', fontSize: 48, fontFamily: SCHIBSTED, fontWeight: '400', lineHeight: '56.02px' }}>Logística</Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ width: '100%', mb: 0 }}>
          <Box sx={{ px: 2, py: '6px', background: isSuccess ? '#F1F9EE' : '#FFF4F4', borderRadius: '4px 4px 0 0', display: 'flex', border: '1px solid rgba(0,0,0,0.12)', borderBottom: 'none', alignItems: 'center' }}>
            <Box sx={{ pr: 1.5, display: 'flex' }}>
              {isSuccess ? <CheckCircleOutlined sx={{ fontSize: 22, color: '#70BF54' }} /> : <ErrorIcon sx={{ fontSize: 22, color: '#D32F2F' }} />}
            </Box>
            <Box sx={{ flex: 1, py: 1 }}>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 14, fontFamily: SCHIBSTED }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(p => ({ ...p, open: false }))} size="small"><CloseIcon sx={{ fontSize: 20, color: isSuccess ? '#2F5023' : '#5F2120' }} /></IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{
        flex: 1,
        border: '1px solid rgba(0,0,0,0.12)',
        borderTop: toastConfig.open ? 'none' : '1px solid rgba(0,0,0,0.12)',
        borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px',
        bgcolor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        ...(currentTabIndex === 2 ? { overflow: 'visible', height: 'auto' } : { overflow: 'hidden' })
      }}>
        <Box sx={{ pt: 1.5, px: 2, flexShrink: 0 }}>
          <Tabs 
            value={currentTabIndex} 
            sx={{ 
              minHeight: 36,
              '& .MuiTab-root': { 
                minHeight: 36, 
                fontSize: 14, // ✅ FONTE DAS ABAS
                fontWeight: 500, 
                fontFamily: SCHIBSTED, 
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              } 
            }}
          >
            <Tab label="PRODUTOR" component={NavLink} to="/logistica" />
            <Tab label="TRANSPORTADORA" component={NavLink} to="/transportadoras" />
            <Tab label="AGENDA" component={NavLink} to="/agenda" />
          </Tabs>
        </Box>

        {currentTabIndex === 0 && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <TextField placeholder="Buscar" size="small" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton disabled={selectedRowKeys.length === 0} sx={{ color: selectedRowKeys.length > 0 ? '#0072C3' : 'rgba(0, 0, 0, 0.26)' }} onClick={() => setIsDeleteDialogOpen(true)}><Delete /></IconButton>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDrawer('create')} sx={{ background: '#0072C3', borderRadius: '4px', fontSize: 14, fontFamily: SCHIBSTED, fontWeight: 500, textTransform: 'uppercase' }}>Adicionar</Button>
              </Box>
            </Box>

            <Box sx={{ flex: 1, px: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 56, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.04)', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                  <Checkbox size="small" checked={visibleProducers.length > 0 && visibleProducers.every(p => selectedRowKeys.includes(getRowKey(p)))} onChange={handleHeaderCheckboxClick} />
                  {['Nome do produtor', 'N° estabelecimento', 'Filiada', 'Modalidade', 'Qtd cabeças', 'Distância', 'Certificado', 'Projeto', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 11, fontWeight: 600, fontFamily: SCHIBSTED }}>{c}</Typography>)}
                </Box>
                <Box>
                  {visibleProducers.map(p => {
                    const key = getRowKey(p);
                    const sel = selectedRowKeys.includes(key);
                    return (
                      <Box key={key} onClick={() => handleToggleSelect(key)} sx={{ display: 'grid', gridTemplateColumns: tableGrid, minHeight: 52, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)', cursor: 'pointer', bgcolor: sel ? 'rgba(0, 114, 195, 0.08)' : 'inherit' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{sel && <Checkbox size="small" checked={true} />}</Box>
                        {/* ✅ FONTE DA TABELA AJUSTADA */}
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }} noWrap>{p.nomeProdutor}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>{p.numEstabelecimento}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>{p.filiada}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>{p.modalidade}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>{p.cabecasAlojadas || 0}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>{p.distancia || '0 Km'}</Typography>
                        <Box><Chip label={p.certificado} size="small" sx={{ height: 22, fontSize: 10, bgcolor: p.certificado === 'Sim' ? '#F1F9EE' : '#FFEDEE', color: p.certificado === 'Sim' ? '#70BF54' : '#E4464E' }} /></Box>
                        <Box>
                          <Chip
                            label={p.doamDejetos}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 10,
                              bgcolor: p.doamDejetos === 'Sim' ? '#F1F9EE' : '#FFEDEE',
                              color: p.doamDejetos === 'Sim' ? '#70BF54' : '#E4464E'
                            }}
                          />
                        </Box>
                        <Stack direction="row" spacing={0.5} onClick={e => e.stopPropagation()}>
                          <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', p)}><VisibilityIcon sx={{ fontSize: 20 }} /></IconButton>
                          <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', p)}><EditIcon sx={{ fontSize: 20 }} /></IconButton>
                        </Stack>
                      </Box>
                    );
                  })}
                </Box>
                <TablePagination component="div" count={totalItems} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página" sx={{ borderTop: 'none' }} />
              </Box>
            </Box>
          </Box>
        )}
        {currentTabIndex === 1 && <TransportadoraList onShowSuccess={handleShowToast} />}
        {currentTabIndex === 2 && (
          <Box sx={{ minHeight: '100vh', overflow: 'visible', width: '100%' }}>
            <AgendaList produtoresList={producers} />
          </Box>
        )}
      </Paper>

      <Drawer anchor="right" open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} sx={{ zIndex: 1400 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '40px 12px 40px 32px', position: 'relative' }}>
          <IconButton onClick={() => setIsDeleteDialogOpen(false)} sx={{ position: 'absolute', right: 4, top: 8 }}><CloseIcon /></IconButton>
          <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR PRODUTOR</Typography>
          <Typography sx={{ mt: 3, fontSize: 20, fontFamily: SCHIBSTED }}>Deseja excluir esse registro? Todas as informações associadas serão removidas.</Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDialogOpen(false)} sx={{ height: 48, color: '#0072C3' }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDeleteSelected} sx={{ height: 48, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <ProdutorDrawer key={selectedProducerFullData ? selectedProducer?.id : 'new'} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSave={handleSave} mode={drawerMode} initialData={selectedProducerFullData} />
    </Box>
  );
};

export default Logistica;