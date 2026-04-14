import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Breadcrumbs, Link, Button,
  Stack, Paper, IconButton, TextField, InputAdornment,
  Drawer, Collapse, Tabs, Tab, GlobalStyles, TablePagination
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import { 
  Home as HomeIcon, Add as AddIcon, Search as SearchIcon, Visibility as ViewIcon,
  Edit as EditIcon, Delete as DeleteIcon, KeyboardArrowDown as ArrowDownIcon,
  MoreHoriz as MoreHorizIcon, Close as CloseIcon, CheckCircleOutlined, ErrorOutline,
  FileUpload as FileUploadIcon, FilterAlt as FilterAltIcon,
  PictureAsPdf as PictureAsPdfIcon, 
  AssignmentLate as AssignmentLateIcon, 
  Draw as DrawIcon 
} from '@mui/icons-material';

import { BarChart } from '@mui/x-charts/BarChart';

import { AbastecimentoDrawer } from '../components/AbastecimentoDrawer';
import { PrecificacaoDrawer } from '../components/PrecificacaoDrawer';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../assets/logo.png'; 

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';
const STATUS_ANDAMENTO = '#fb923c'; 
const STATUS_CONCLUIDO = '#4d7c0f'; 

const generatePDF = (row: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  doc.setDrawColor(0, 114, 195);
  doc.setLineWidth(2);
  doc.line(0, 0, pageWidth, 0);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const nowStr = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  doc.text(nowStr, 14, 10); 
  doc.text(`Recibo #${row.id || '101'}`, pageWidth - 14, 10, { align: 'right' });

  try {
    doc.addImage(logoImg, 'PNG', pageWidth / 2 - 25, 15, 50, 15);
  } catch (e) {
    console.warn("Logo não encontrada.", e);
  }

  let currentY = 40;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BIOPLANTA TOLEDO', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('BIOPLANTA DO BRASIL LTDA.', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.text('SITIO LINHA ALVES, S/N OURO VERDE DO OESTE/PR - CEP 85933-000', pageWidth / 2, currentY, { align: 'center' }); 
  currentY += 5;
  doc.text('Fone: 55 11 3882-3291', pageWidth / 2, currentY, { align: 'center' }); 

  currentY += 15;
  doc.setFontSize(10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 14, currentY); 
  doc.setFont('helvetica', 'normal');
  doc.text(row.cliente || 'Primato Cooperativa Agroindustrial', 35, currentY);
  
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Recibo N°:', 14, currentY); 
  doc.setFont('helvetica', 'normal');
  doc.text(String(row.id || '101'), 35, currentY); 
  
  currentY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Usuário:', 14, currentY); 
  doc.setFont('helvetica', 'normal');
  doc.text('Renan', 35, currentY);

  doc.setFont('helvetica', 'bold');
  doc.text('Data:', 140, currentY); 
  doc.setFont('helvetica', 'normal');
  const dataStr = row.dataFinal ? row.dataFinal : new Date().toLocaleDateString('pt-BR');
  doc.text(dataStr, 150, currentY); 

  currentY += 10;
  autoTable(doc, {
    startY: currentY,
    head: [['Veículo', 'Tipo', 'Placa/TAG', 'Produto', 'Início', 'Término', 'Quantidade\n(m³)']],
    body: [
      [
        'Caminhão', 
        row.veiculo || '-', 
        row.placa || '-', 
        row.carga || 'Biometano', 
        row.inicio || '-', 
        row.final || '-', 
        row.volumeAbastecido ? row.volumeAbastecido.replace('m³', '').trim() : (row.volume ? row.volume.replace('m³', '').trim() : '-')
      ]
    ],
    theme: 'plain', 
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0], font: 'helvetica', fontSize: 10, valign: 'middle', halign: 'center' },
    headStyles: { fontStyle: 'bold', fillColor: false, textColor: [0, 0, 0] },
    columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' }, 2: { halign: 'left' }, 3: { halign: 'left' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY + 30;
  const sigY = finalY + 40;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2 - 40, sigY, pageWidth / 2 + 40, sigY); 
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Responsável', pageWidth / 2, sigY + 6, { align: 'center' }); 
  doc.text('relacionamento.clientes@primato.com.br', pageWidth / 2, sigY + 12, { align: 'center' }); 

  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15); 
  
  doc.setFontSize(8);
  doc.setTextColor(100);
  const fullNow = new Date().toLocaleString('pt-BR');
  doc.text(`Portal Clientes | Rel: 001-V01 | Gerado em: ${fullNow}`, pageWidth / 2, pageHeight - 10, { align: 'center' }); 

  const pdfBlobUrl = doc.output('bloburl');
  window.open(pdfBlobUrl, '_blank');
};

export const Abastecimentos: React.FC = () => {
  const [tabValue, setTabValue] = useState(0); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create'|'edit'|'concluir'|'assinar'|'view'>('create');
  
  const [openPrecificacaoDrawer, setOpenPrecificacaoDrawer] = useState(false);

  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '', severity: 'success' as 'success' | 'error' });
  const isSuccess = toastConfig.severity === 'success';

  const handleTriggerToast = (title: string, message: string, severity: 'success' | 'error' = 'success') => {
    setToastConfig({ open: true, title, message, severity });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 6000);
  };
  
  const [data, setData] = useState([
    { id: 1, cliente: 'Agrocampo', veiculo: 'Caminhão Truck', carga: 'Ração', placa: 'XBH-3M89', inicio: '13/03/2026 10:08:59', final: '    ', volume: '263m³', status: 'Andamento', exec: 'Manual', pendingSignature: false },
    { id: 2, cliente: 'Primato', veiculo: 'Caminhão VUC', carga: 'Ração', placa: 'RDP-4N27', inicio: '08:00', final: '08:45', volume: '450', status: 'Concluído', exec: 'Automação', pendingSignature: false },
    { id: 3, cliente: 'Primato', veiculo: 'Caminhão Toco', carga: 'Dejeto', placa: 'VLK-1S59', inicio: '13/03/2026 13:46:59', final: '    ', volume: '126m³', status: 'Andamento', exec: 'Manual', pendingSignature: false },
    { id: 4, cliente: 'Primato', veiculo: 'Caminhão Carreta', carga: 'Ração', placa: 'MTA-6P30', inicio: '13/03/2026 14:38:59', final: '    ', volume: '462m³', status: 'Andamento', exec: 'Manual', pendingSignature: false },
    { id: 5, cliente: 'Primato', veiculo: 'Caminhão Bitrem', carga: 'Ração', placa: 'FZX-9C84', inicio: '13/03/2026 15:08:59', final: '    ', volume: '73m³', status: 'Andamento', exec: 'Manual', pendingSignature: false },
  ]);

  const [precificacaoData, setPrecificacaoData] = useState([
    { id: 1, preco: '$2,83', produto: 'CO²', mesAnp: 'Março', mesFatura: 'Abril', usuario: 'Roberto', data: '20/03/2026' },
    { id: 2, preco: '$8,39', produto: 'Biometano', mesAnp: 'Maio', mesFatura: 'Junho', usuario: 'Antonio', data: '23/03/2026' } // Atualizado mock para não usar Diesel
  ]);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => (
        item.cliente.toLowerCase().includes(search) || item.placa.toLowerCase().includes(search) || item.status.toLowerCase().includes(search)
      ));
    }
    return filtered;
  }, [data, tabValue, searchTerm]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleDelete = () => {
    setData(prev => prev.filter(r => r.id !== selectedRow.id));
    setOpenDelete(false);
    handleTriggerToast('Registro excluído com sucesso', 'O registro foi removido e não está mais disponível no sistema.', 'success');
  };

  const handleSaveDrawer = (payload: any, mode: string) => {
    setOpenDrawer(false);
    if (mode === 'concluir') {
      setData(prev => prev.map(r => r.id === selectedRow?.id ? { ...r, pendingSignature: true, final: payload.dataFinal ? `${payload.dataFinal} ${payload.horaFinal}` : '---' } : r));
      handleTriggerToast('Dados salvos', 'Agora é necessário assinar o registro para finalizá-lo.', 'success');
    } else if (mode === 'assinar') {
      setData(prev => prev.map(r => r.id === selectedRow?.id ? { ...r, status: 'Concluído', pendingSignature: false } : r));
      handleTriggerToast('Registro concluído com sucesso', 'Tudo certo! Data final, pressão e volume abastecido registrados.', 'success');
    } else if (mode === 'edit') {
      handleTriggerToast('Registro atualizado com sucesso', 'As alterações foram salvas e já estão disponíveis no sistema.', 'success');
    } else {
      handleTriggerToast('Registro criado com sucesso', 'Pronto! Seu registro já está disponível.', 'success');
    }
  };

  const handleSavePrecificacao = (payload: any) => {
    setOpenPrecificacaoDrawer(false);
    setPrecificacaoData(prev => [
      { 
        id: Math.random(), 
        preco: payload.preco, 
        produto: payload.produto, 
        mesAnp: payload.mesAnp, 
        mesFatura: payload.mesFatura, 
        usuario: 'Renan', 
        data: payload.data || new Date().toLocaleDateString('pt-BR') 
      },
      ...prev
    ]);
    // ✅ TEXTO DO TOAST EXATAMENTE COMO NO REFERENCIAL
    handleTriggerToast('Preço cadastrado com sucesso', 'O valor foi salvo e já está disponível no sistema.', 'success');
  };

  const C_FLEX = { c1: 1.2, c2: 1.2, c3: 1.0, c4: 0.8, c5: 1.6, c6: 1.6, c7: 0.9, c8: 1.0, c9: 1.2 };
  const cellStyle = (flexVal: number) => ({ px: 1.5, flex: flexVal, minWidth: 0, display: 'flex', alignItems: 'center' });
  const textStyle = { fontSize: 13, fontFamily: SCHIBSTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' };
  const headerStyle = { ...textStyle, fontWeight: 600, color: 'rgba(0,0,0,0.87)' };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '8px 24px 12px 24px', bgcolor: '#F5F5F5', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      <GlobalStyles styles={{ '.MuiAlert-root': { border: 'none !important', boxShadow: 'none !important' }, '.MuiAlert-standardSuccess': { backgroundColor: '#F1F9EE !important' } }} />

      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}><MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: 14, fontFamily: SCHIBSTED }}>Abastecimento</Typography>
        </Box>
        <Typography sx={{ color: 'black', fontSize: 48, fontFamily: SCHIBSTED, fontWeight: '400', lineHeight: '56.02px' }}>Abastecimento</Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ width: '100%', mb: 0 }}>
          <Box sx={{ px: 2, py: '6px', background: isSuccess ? '#F1F9EE' : '#FFF4F4', borderRadius: '4px 4px 0 0', display: 'flex', border: '1px solid rgba(0,0,0,0.12)', borderBottom: 'none', alignItems: 'center' }}>
            <Box sx={{ pr: 1.5, display: 'flex' }}>{isSuccess ? <CheckCircleOutlined sx={{ fontSize: 22, color: '#70BF54' }} /> : <ErrorOutline sx={{ fontSize: 22, color: '#D32F2F' }} />}</Box>
            <Box sx={{ flex: 1, py: 1 }}>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 14, fontFamily: SCHIBSTED }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(p => ({ ...p, open: false }))} size="small"><CloseIcon sx={{ fontSize: 20, color: isSuccess ? '#2F5023' : '#5F2120' }} /></IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderTop: toastConfig.open ? 'none' : '1px solid rgba(0,0,0,0.12)', borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <Box sx={{ pt: 1.5, px: 2 }}>
          <Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); setPage(0); }} sx={{ minHeight: 36, '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, minHeight: 36, textTransform: 'uppercase' } }}>
            <Tab label="relatório" />
            <Tab label="precificação" />
            <Tab label="faturamento" />
            <Tab label="base de cálculo" />
          </Tabs>
        </Box>

        <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField placeholder="Buscar" size="small" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }} sx={{ width: 400, '& .MuiInputBase-root': { height: 32, fontFamily: SCHIBSTED } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.25)', fontSize: 20 }} /></InputAdornment> }} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {tabValue === 0 && (
              <>
                <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUploadIcon /></IconButton>
                <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAltIcon /></IconButton>
              </>
            )}
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => { 
                if(tabValue === 0) {
                  setDrawerMode('create'); 
                  setOpenDrawer(true); 
                } else if (tabValue === 1) {
                  setOpenPrecificacaoDrawer(true);
                }
              }} 
              sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED, height: 32, px: 2 }}
            >
              ADICIONAR
            </Button>
          </Box>
        </Box>

        {/* ABA 0: RELATÓRIO */}
        {tabValue === 0 && (
          <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)' }}>
              
              <Box sx={{ display: 'flex', width: '100%', height: 56, flexShrink: 0, bgcolor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                <Box sx={cellStyle(C_FLEX.c1)}><Typography sx={headerStyle}>Cliente</Typography></Box><Box sx={cellStyle(C_FLEX.c2)}><Typography sx={headerStyle}>Tipo de veículo</Typography></Box><Box sx={cellStyle(C_FLEX.c3)}><Typography sx={headerStyle}>Tipo de carga</Typography></Box><Box sx={cellStyle(C_FLEX.c4)}><Typography sx={headerStyle}>Placa</Typography></Box><Box sx={cellStyle(C_FLEX.c5)}><Typography sx={headerStyle}>Abastecimento inicial</Typography></Box><Box sx={cellStyle(C_FLEX.c6)}><Typography sx={headerStyle}>Abastecimento final</Typography></Box><Box sx={cellStyle(C_FLEX.c7)}><Typography sx={headerStyle}>Volume (m³)</Typography></Box><Box sx={cellStyle(C_FLEX.c8)}><Typography sx={headerStyle}>Status</Typography></Box><Box sx={cellStyle(C_FLEX.c9)}><Typography sx={headerStyle}>Tipo de execução</Typography></Box>
                <Box sx={{ px: 1.5, width: 144, flexShrink: 0, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Ações</Typography></Box>
              </Box>

              <Box sx={{ overflowY: 'auto', width: '100%', minHeight: 0 }}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => (
                    <Box key={row.id} sx={{ display: 'flex', width: '100%', height: 56, borderBottom: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <Box sx={cellStyle(C_FLEX.c1)}><Typography sx={textStyle} title={row.cliente}>{row.cliente}</Typography></Box><Box sx={cellStyle(C_FLEX.c2)}><Typography sx={textStyle} title={row.veiculo}>{row.veiculo}</Typography></Box><Box sx={cellStyle(C_FLEX.c3)}><Typography sx={textStyle} title={row.carga}>{row.carga}</Typography></Box><Box sx={cellStyle(C_FLEX.c4)}><Typography sx={textStyle} title={row.placa}>{row.placa}</Typography></Box><Box sx={cellStyle(C_FLEX.c5)}><Typography sx={textStyle} title={row.inicio}>{row.inicio}</Typography></Box><Box sx={cellStyle(C_FLEX.c6)}><Typography sx={textStyle} title={row.final}>{row.final || '---'}</Typography></Box><Box sx={cellStyle(C_FLEX.c7)}><Typography sx={textStyle} title={row.volume}>{row.volume}</Typography></Box>
                      <Box sx={cellStyle(C_FLEX.c8)}>
                        <Box sx={{ width: 'fit-content', height: 24, borderRadius: '4px', px: 1, display: 'flex', alignItems: 'center', bgcolor: row.status === 'Andamento' ? STATUS_ANDAMENTO : STATUS_CONCLUIDO }}>
                          <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 600, fontFamily: SCHIBSTED }}>{row.status}</Typography>
                        </Box>
                      </Box>
                      <Box sx={cellStyle(C_FLEX.c9)}><Typography sx={textStyle} title={row.exec}>{row.exec}</Typography></Box>
                      
                      <Box sx={{ px: 1.5, width: 144, flexShrink: 0, display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('view'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton>
                        {row.status === 'Andamento' && !row.pendingSignature && (
                          <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('concluir'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><AssignmentLateIcon sx={{ fontSize: 18 }} /></IconButton>
                        )}
                        {row.status === 'Andamento' && row.pendingSignature && (
                          <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('assinar'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><DrawIcon sx={{ fontSize: 18 }} /></IconButton>
                        )}
                        {row.status === 'Concluído' && (
                          <IconButton size="small" onClick={() => generatePDF(row)} sx={{ color: PRIMARY_BLUE }}><PictureAsPdfIcon sx={{ fontSize: 18 }} /></IconButton>
                        )}
                        <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('edit'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                        <IconButton size="small" onClick={() => { setSelectedRow(row); setOpenDelete(true); }} sx={{ color: PRIMARY_BLUE }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#424242', fontFamily: SCHIBSTED }}>Área sem registros</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexShrink: 0, justifyContent: 'flex-end', alignItems: 'center', p: 1, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                <TablePagination component="div" count={filteredData.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página:" labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`} sx={{ border: 'none', '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': { fontFamily: SCHIBSTED, fontSize: 12, color: 'black' } }} />
              </Box>
            </Box>
          </Box>
        )}

        {/* ABA 1: PRECIFICAÇÃO */}
        {tabValue === 1 && (
          <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'row', gap: 4, overflow: 'hidden' }}>
            
            <Box sx={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: SCHIBSTED, color: 'black' }}>
                  Evolução dos preços
                </Typography>
                <IconButton size="small" sx={{ color: 'rgba(0,0,0,0.54)' }}>
                  <FilterAltIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Box sx={{ flex: 1, width: '100%', minHeight: 300 }}>
                <BarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: ['Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026', 'Mai/2026', 'Jun/2026', 'Jul/2026'],
                    tickLabelStyle: { fontFamily: SCHIBSTED, fontSize: 12, fill: 'rgba(0,0,0,0.87)' }
                  }]}
                  series={[
                    { data: [15, 20, 25, 22, 18, 24, 28], label: 'CO²', color: '#fcd34d' },
                    { data: [25, 28, 30, 26, 24, 29, 32], label: 'Biometano', color: '#a855f7' }
                  ]}
                  valueFormatter={(value) => `$${value}`}
                  slotProps={{ 
                    legend: { 
                      labelStyle: { fontFamily: SCHIBSTED, fontSize: 14 },
                      direction: 'row',
                      position: { vertical: 'top', horizontal: 'right' }
                    } 
                  }}
                  margin={{ top: 70, bottom: 30, left: 40, right: 10 }}
                />
              </Box>
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', width: '100%', height: 56, flexShrink: 0, bgcolor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                  <Box sx={{ px: 2, flex: 1, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Preço</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Produto</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Mês ANP</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Mês fatura</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Usuário</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Data</Typography></Box>
                </Box>
                
                {precificacaoData.map((row) => (
                  <Box key={row.id} sx={{ display: 'flex', width: '100%', height: 56, borderBottom: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                    <Box sx={{ px: 2, flex: 1, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.preco}</Typography></Box>
                    <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.produto}</Typography></Box>
                    <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesAnp}</Typography></Box>
                    <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesFatura}</Typography></Box>
                    <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.usuario}</Typography></Box>
                    <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.data}</Typography></Box>
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        )}

      </Paper>

      {/* MODAIS GLOBAIS */}
      <AbastecimentoDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} onSave={handleSaveDrawer} mode={drawerMode} initialData={selectedRow} />
      
      <PrecificacaoDrawer open={openPrecificacaoDrawer} onClose={() => setOpenPrecificacaoDrawer(false)} onSave={handleSavePrecificacao} />

      <Drawer anchor="right" open={openDelete} onClose={() => setOpenDelete(false)} sx={{ zIndex: 9999 }} PaperProps={{ sx: { width: 620, border: 'none', bgcolor: 'white' } }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
              <IconButton onClick={() => setOpenDelete(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: '40px', color: 'black' }}>EXCLUIR REGISTRO</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 500, fontFamily: SCHIBSTED, lineHeight: '32px', color: 'black', textAlign: 'justify' }}>
                Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, height: 96, alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => setOpenDelete(false)} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: PRIMARY_BLUE, borderColor: 'rgba(0,114,195,0.5)', fontWeight: 500, fontSize: 16 }}>NÃO</Button>
          <Button variant="contained" onClick={handleDelete} fullWidth sx={{ height: 48, bgcolor: PRIMARY_BLUE, fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 16 }}>SIM</Button>
        </Box>
      </Drawer>
      
    </Box>
  );
};

export default Abastecimentos;