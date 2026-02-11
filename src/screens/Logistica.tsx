import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Tabs, Tab, TextField, IconButton, 
  Button, Link, Stack, Chip, Paper, Collapse, CircularProgress, TablePagination
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { CloseIcon, CheckCircle, HomeIcon, MoreHorizIcon, AddIcon, VisibilityIcon, EditIcon, ErrorIcon, FilterAlt, FileDownloadIcon, Delete } from '../constants/muiIcons';

import ProdutorDrawer from '../components/ProdutorDrawer';
import { useCooperadoMutation } from '../hooks/useCooperadoMutation';
import type { ProdutorFormInput, ProdutorListItem, CooperadoResponse } from '../types/cooperado';
import { ProdutorService } from '../services/produtorService';
import { TransportadoraList } from '../components/TransportadoraList';
import { AgendaList } from '../components/AgendaList';

const Logistica: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [producers, setProducers] = useState<ProdutorListItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedProducer, setSelectedProducer] = useState<ProdutorListItem | null>(null);
  const [selectedProducerFullData, setSelectedProducerFullData] = useState<ProdutorFormInput | null>(null); // Novo estado para dados completos
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Hook de Mutação (SOLID: Lógica de escrita separada)
  const { createCooperado, updateCooperado, isLoading, error } = useCooperadoMutation();

  const loadProducers = useCallback(async () => {
    console.log('🔄 Iniciando carregamento de produtores...');
    try {
      const response = await ProdutorService.list(1, 1, 1, 9999);
      console.log('✅ Produtores carregados:', response);
      setProducers(response.items || []);
      setTotalItems(response.total || 0);
    } catch (err) {
      console.error('Erro ao carregar produtores:', err);
    }
  }, []);

  useEffect(() => { loadProducers(); }, [loadProducers]);

  useEffect(() => {
    if (producers.length > 0 && page * rowsPerPage >= producers.length) {
      setPage(0);
    }
  }, [producers.length, page, rowsPerPage]);

  const currentTab = location.pathname.includes('transportadora') ? 1 : location.pathname.includes('agenda') ? 2 : 0;
  const tabLabel = currentTab === 0 ? 'Produtor' : currentTab === 1 ? 'Transportadora' : 'Agenda';

  const toFormInput = (producer: ProdutorListItem): ProdutorFormInput => ({
    cpfCnpj: '', // TODO: Idealmente, buscar detalhes via API se não estiver no grid
    nome: producer.nomeProdutor || '',
    numEstabelecimento: producer.numEstabelecimento || '',
    nPropriedade: '',
    matricula: String(producer.id || ''),
    filiada: producer.filiada || 'Toledo-PR',
    faseDejeto: producer.modalidade || '',
    cabecas: String(producer.cabecasAlojadas || ''),
    certificado: producer.certificado || 'Não',
    doamDejetos: 'Sim',
    qtdLagoas: String(producer.qtdLagoas || '1'),
    volLagoas: producer.volLagoas || '',
    restricoes: producer.restricoesOperacionais || 'Nenhuma',
    responsavel: '',
    tecnico: '',
    municipio: '',
    lat: '',
    long: '',
    distancia: producer.distancia || '',
    localizacao: ''
  });

  const apiResponseToForm = (data: CooperadoResponse): ProdutorFormInput => ({
    cpfCnpj: data.bioProdutor?.cpfCnpj || '',
    nome: data.bioProdutor?.nome || data.nome || '',
    numEstabelecimento: data.numeroEstabelecimento || '',
    nPropriedade: data.numeroPropriedade || '',
    matricula: String(data.matricula || ''),
    filiada: 'Toledo-PR', // TODO: Mapear ID para Nome se necessário
    faseDejeto: data.fase || 'GRSC',
    cabecas: String(data.cabecas || ''),
    certificado: data.certificado || 'Não',
    doamDejetos: data.doamDejetos || 'Sim',
    qtdLagoas: String(data.qtdLagoas || '1'),
    volLagoas: data.volLagoas || '',
    restricoes: data.restricoes || 'Nenhuma',
    responsavel: data.responsavel || '',
    tecnico: data.tecnico || '',
    municipio: data.municipio || '',
    lat: String(data.latitude || ''),
    long: String(data.longitude || ''),
    distancia: data.distancia || '',
    localizacao: data.localizacao || ''
  });

  const openDrawer = async (mode: 'create' | 'view' | 'edit', producer?: ProdutorListItem) => {
    setDrawerMode(mode);
    setSelectedProducer(producer || null);
    setSelectedProducerFullData(null); // Reseta dados completos anteriores

    if ((mode === 'view' || mode === 'edit') && producer?.id) {
       console.log(`👁️ Buscando detalhes do produtor ID: ${producer.id}...`);
       try {
         const details = await ProdutorService.getById(producer.id);
         console.log('✅ Detalhes carregados:', details);
         const formData = apiResponseToForm(details);
         setSelectedProducerFullData(formData);
       } catch (err) {
         console.error('Erro ao buscar detalhes:', err);
         // Fallback: usa os dados parciais do grid se a API falhar
         setSelectedProducerFullData(toFormInput(producer));
       }
    }
    
    setIsDrawerOpen(true);
  };

  // --- LÓGICA: SALVAR NA API ---
  const handleSave = async (formData: ProdutorFormInput) => {
    try {
      if (drawerMode === 'edit' && selectedProducer?.id) {
        // MODO EDIÇÃO (PUT)
        await updateCooperado(selectedProducer.id, formData);
      } else {
        // MODO CRIAÇÃO (POST)
        await createCooperado(formData);
      }

      // Recarrega a lista após criar/editar
      await loadProducers();

      // Sucesso
      setIsDrawerOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
    } catch (err) {
      const unknownErr = err as unknown;
      const error = unknownErr instanceof Error ? unknownErr : new Error('Erro desconhecido');
      const errorWithResponse = error as unknown as Record<string, unknown>;
      console.error("❌ Falha ao salvar/editar cooperado:", {
        erro: error,
        mensagem: error.message,
        resposta: (errorWithResponse.response as Record<string, unknown>)?.data || 'N/A',
        status: (errorWithResponse.response as Record<string, unknown>)?.status || 'N/A'
      });
    }
  };

  const tableGrid = "240px 180px 120px 130px 180px 100px 110px 160px 170px 150px 200px 100px";
  const commonFont = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: '24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      <Box sx={{ alignSelf: 'stretch', mb: '12px', flexDirection: 'column', display: 'flex', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '16px', ...commonFont }}>Logística / {tabLabel}</Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', ...commonFont }}>Logística</Typography>
      </Box>

      {/* TOAST SUCESSO */}
      <Collapse in={showToast}>
        <Box sx={{ bgcolor: '#F1F9EE', borderRadius: '4px', p: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: 2, border: '1px solid rgba(112, 191, 84, 0.2)', mb: 3 }}>
            <CheckCircle sx={{ color: '#70BF54', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#2F5023', fontSize: 16, ...commonFont, fontWeight: 500 }}>Registro atualizado com sucesso</Typography>
                <Typography sx={{ color: '#2F5023', fontSize: 14, ...commonFont, opacity: 0.8 }}>As alterações foram salvas e já estão disponíveis no sistema.</Typography>
            </Box>
            <IconButton onClick={() => setShowToast(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </Collapse>

      {/* TOAST ERRO (Exibido se o hook retornar erro) */}
      <Collapse in={!!error}>
        <Box sx={{ bgcolor: '#FDEDED', borderRadius: '4px', p: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: 2, border: '1px solid #FFA1A1', mb: 3 }}>
            <ErrorIcon sx={{ color: '#D32F2F', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#5F2120', fontSize: 16, ...commonFont, fontWeight: 500 }}>Erro ao salvar</Typography>
                <Typography sx={{ color: '#5F2120', fontSize: 14, ...commonFont, opacity: 0.8 }}>{error}</Typography>
            </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ pt: 4, px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
          <Tabs value={currentTab} sx={{ '& .MuiTab-root': { fontSize: '14px', fontWeight: 500, ...commonFont } }}>
            <Tab label="PRODUTOR" component={NavLink} to="/logistica" />
            <Tab label="TRANSPORTADORA" component={NavLink} to="/transportadoras" />
            <Tab label="AGENDA" component={NavLink} to="/agenda" />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <>
            {/* 🛡️ NOVO LAYOUT DA TOOLBAR PADRONIZADO (Produtor) */}
            <Box sx={{ p: '16px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <TextField 
                        fullWidth 
                        label="Buscar" 
                        placeholder="Nome, email, etc..." 
                        size="small" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        sx={{ '& .MuiOutlinedInput-root': { ...commonFont }, '& .MuiInputLabel-root': { ...commonFont } }}
                    />
                </Box>
                
                <Stack direction="row" spacing={1} alignItems="center">
                   <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
                     <Delete />
                   </IconButton>
                   <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
                     <FileDownloadIcon />
                   </IconButton>
                   <IconButton disabled sx={{ color: 'rgba(0, 0, 0, 0.26)', padding: '8px' }}>
                     <FilterAlt />
                   </IconButton>
                   <Button 
                       variant="contained" 
                       startIcon={<AddIcon />} 
                       onClick={() => openDrawer('create')} 
                       sx={{ bgcolor: '#0072C3', height: 40, px: 3, ...commonFont }}
                   >
                       ADICIONAR
                   </Button>
                </Stack>
            </Box>

            {isLoading && <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}

            <Box sx={{ flex: 1, overflowX: 'auto', p: '0 16px' }}>
              <Box sx={{ width: 'max-content' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: tableGrid, height: 56, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: 2 }}>
                  {['Nome do produtor', 'N° do estabelecimento', 'Filiada', 'Modalidade', 'Quantidade de cabeças', 'Distancia', 'Certificado', 'Participa do projeto', 'Quantidades de lagoas', 'Volume das lagoas', 'Restrições operacionais', 'Ações'].map(c => <Typography key={c} sx={{ fontSize: 12, fontWeight: 600, ...commonFont }}>{c}</Typography>)}
                </Box>
                {producers
                  .filter(p => (p.nomeProdutor || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(p => (
                  <Box key={p.id} sx={{ display: 'grid', gridTemplateColumns: tableGrid, minHeight: 52, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <Typography sx={{ fontSize: 14 }}>{p.nomeProdutor}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.numEstabelecimento}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.filiada}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.modalidade}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.cabecasAlojadas || 0}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.distancia || '-'}</Typography>
                    <Box><Chip label={p.certificado} size="small" sx={{ bgcolor: p.certificado === 'Sim' || p.certificado === 'Ativo' ? '#F1F9EE' : '#FFEDEE', color: p.certificado === 'Sim' || p.certificado === 'Ativo' ? '#70BF54' : '#E4464E', borderRadius: '4px' }} /></Box>
                    <Box><Chip label={p.participaProjeto} size="small" sx={{ bgcolor: '#F1F9EE', color: '#70BF54', borderRadius: '4px' }} /></Box>
                    <Typography sx={{ fontSize: 14 }}>{p.qtdLagoas || '-'}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.volLagoas || '-'}</Typography>
                    <Typography sx={{ fontSize: 14 }}>{p.restricoesOperacionais || 'Nenhuma'}</Typography>
                    <Stack direction="row">
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', p)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', p)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
            <TablePagination
              component="div"
              count={totalItems}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                const value = Number.parseInt(event.target.value, 10);
                setRowsPerPage(value);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Linhas por página"
            />
          </>
        )}

          {currentTab === 1 && (
              <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                  <TransportadoraList />
              </Box>
          )}

          {/* ABA 2: AGENDA */}
          {currentTab === 2 && (
              <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                  <AgendaList />
              </Box>
          )}

      </Paper>
      <ProdutorDrawer
        key={isDrawerOpen ? 'open' : 'closed'}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        mode={drawerMode}
        initialData={selectedProducerFullData || (selectedProducer ? toFormInput(selectedProducer) : null)}
      />
    </Box>
  );
};

export default Logistica;