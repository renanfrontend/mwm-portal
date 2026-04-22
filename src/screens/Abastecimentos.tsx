import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Link, Button, Paper, IconButton, TextField, InputAdornment,
  Drawer, Collapse, Tabs, Tab, GlobalStyles, TablePagination, Checkbox, Badge
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import { 
  Home as HomeIcon, Add as AddIcon, Search as SearchIcon, Visibility as ViewIcon,
  Edit as EditIcon, Delete as DeleteIcon, MoreHoriz as MoreHorizIcon, Close as CloseIcon, 
  CheckCircleOutlined, ErrorOutline, FileUpload as FileUploadIcon, FilterAlt as FilterAltIcon, 
  PictureAsPdf as PictureAsPdfIcon, AssignmentLate as AssignmentLateIcon,
  FormatListBulleted as ListIcon, BarChart as BarChartIcon, Receipt as ReceiptIcon
} from '@mui/icons-material';

import { BarChart } from '@mui/x-charts/BarChart';
import dayjs, { Dayjs } from 'dayjs';

import { AbastecimentoDrawer } from '../components/AbastecimentoDrawer';
import { PrecificacaoDrawer } from '../components/PrecificacaoDrawer';
import { AbastecimentoFilter } from '../components/AbastecimentoFilter'; 
import { PrecificacaoFilter } from '../components/PrecificacaoFilter'; 
import { FaturamentoFilter } from '../components/FaturamentoFilter'; 

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../assets/logo.png'; 
import emptyStateImg from '../assets/empty-states-sheets.png';

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';
const STATUS_ANDAMENTO = '#fb923c'; 
const STATUS_CONCLUIDO = '#4d7c0f'; 

interface FilterState {
  cliente: string;
  placa: string;
  carga: string;
  pressaoInicial: Dayjs | null;
}

// ==========================================
// GERAÇÃO DE PDF: RELATÓRIO DE ABASTECIMENTO
// ==========================================
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

  try { doc.addImage(logoImg, 'PNG', pageWidth / 2 - 25, 15, 50, 15); } catch (e) {}

  let currentY = 40;
  doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('BIOPLANTA TOLEDO', pageWidth / 2, currentY, { align: 'center' });
  currentY += 6; doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text('BIOPLANTA DO BRASIL LTDA.', pageWidth / 2, currentY, { align: 'center' });
  currentY += 5; doc.text('SITIO LINHA ALVES, S/N OURO VERDE DO OESTE/PR - CEP 85933-000', pageWidth / 2, currentY, { align: 'center' }); 
  currentY += 5; doc.text('Fone: 55 11 3882-3291', pageWidth / 2, currentY, { align: 'center' }); 

  currentY += 15; doc.setFontSize(10);
  doc.setFont('helvetica', 'bold'); doc.text('Cliente:', 14, currentY); doc.setFont('helvetica', 'normal'); doc.text(row.cliente || 'Primato Cooperativa Agroindustrial', 35, currentY);
  currentY += 8; doc.setFont('helvetica', 'bold'); doc.text('Recibo N°:', 14, currentY); doc.setFont('helvetica', 'normal'); doc.text(String(row.id || '101'), 35, currentY); 
  currentY += 8; doc.setFont('helvetica', 'bold'); doc.text('Usuário:', 14, currentY); doc.setFont('helvetica', 'normal'); doc.text('Renan', 35, currentY);
  doc.setFont('helvetica', 'bold'); doc.text('Data:', 140, currentY); doc.setFont('helvetica', 'normal'); const dataStr = row.dataFinal ? row.dataFinal : new Date().toLocaleDateString('pt-BR'); doc.text(dataStr, 150, currentY); 

  currentY += 10;
  autoTable(doc, {
    startY: currentY,
    head: [['Veículo', 'Tipo', 'Placa/TAG', 'Produto', 'Início', 'Término', 'Quantidade\n(m³)']],
    body: [['Caminhão', row.veiculo || '-', row.placa || '-', row.carga || 'Biometano', row.inicio || '-', row.final || '-', row.volumeAbastecido ? row.volumeAbastecido.replace('m³', '').trim() : (row.volume ? row.volume.replace('m³', '').trim() : '-')]],
    theme: 'plain', 
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0], font: 'helvetica', fontSize: 10, valign: 'middle', halign: 'center' },
    headStyles: { fontStyle: 'bold', fillColor: false, textColor: [0, 0, 0] },
    columnStyles: { 0: { halign: 'left' }, 1: { halign: 'left' }, 2: { halign: 'left' }, 3: { halign: 'left' } }
  });

  const finalY = (doc as any).lastAutoTable.finalY || currentY + 30;
  const sigY = finalY + 40;
  
  if (row.assinaturaBase64) { try { doc.addImage(row.assinaturaBase64, 'PNG', pageWidth / 2 - 25, sigY - 15, 50, 20); } catch (e) {} }

  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2); doc.line(pageWidth / 2 - 40, sigY, pageWidth / 2 + 40, sigY); 
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.text('Assinatura do Responsável', pageWidth / 2, sigY + 6, { align: 'center' }); doc.text('relacionamento.clientes@primato.com.br', pageWidth / 2, sigY + 12, { align: 'center' }); 

  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(200, 200, 200); doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15); 
  doc.setFontSize(8); doc.setTextColor(100); const fullNow = new Date().toLocaleString('pt-BR'); doc.text(`Portal Clientes | Rel: 001-V01 | Gerado em: ${fullNow}`, pageWidth / 2, pageHeight - 10, { align: 'center' }); 

  const pdfBlobUrl = doc.output('bloburl');
  window.open(pdfBlobUrl, '_blank');
};

// ==========================================
// GERAÇÃO DE PDF: RECIBO DE FATURA (MWM)
// ==========================================
const handleGenerateFaturaPDF = (row: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  try { doc.addImage(logoImg, 'PNG', 14, 10, 35, 12); } catch (e) { console.error("Erro ao carregar o logo:", e); }
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('MWM - TUPY DO BRASIL LTDA.', 52, 14);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('SÍTIO LINHA ALVES, S/N - OURO VERDE DO OESTE/PR - Brasil', 52, 18);
  doc.text('CEP 85933-000 Fone 55 11 3882-3291', 52, 22);

  doc.setFontSize(8);
  doc.text('Portal Clientes', pageWidth - 14, 14, { align: 'right' });
  doc.text('Rel: 001-V01', pageWidth - 14, 18, { align: 'right' });
  const nowStr = new Date().toLocaleString('pt-BR');
  doc.text(nowStr, pageWidth - 14, 22, { align: 'right' });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(14, 28, pageWidth - 14, 28);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Recibo de Fatura', pageWidth / 2, 33, { align: 'center' });
  
  doc.line(14, 36, pageWidth - 14, 36);

  let currentY = 42;
  doc.rect(14, currentY, pageWidth - 28, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold'); doc.text('Cliente:', 18, currentY + 8);
  doc.setFont('helvetica', 'normal'); doc.text('Primato Cooperativa Agroindustrial', 45, currentY + 8);
  
  doc.setFont('helvetica', 'bold'); doc.text('Endereço:', 18, currentY + 18);
  doc.setFont('helvetica', 'normal'); doc.text('Rua Exemplo, 123, Bairro Industrial', 45, currentY + 18);
  
  doc.setFont('helvetica', 'bold'); doc.text('Cidade:', 18, currentY + 28);
  doc.setFont('helvetica', 'normal'); doc.text('Toledo - PR', 45, currentY + 28);

  doc.setFont('helvetica', 'bold'); doc.text('E-mail:', 18, currentY + 38);
  doc.setFont('helvetica', 'normal'); doc.text('contato@primato.com.br', 45, currentY + 38);

  currentY += 48;

  autoTable(doc, {
    startY: currentY,
    head: [['Mês Fatura', 'Volume Utilizado (m³)', 'Mês Ref. ANP', 'Valor Ref. ANPV', 'Valor Primato', 'Fator Utilização (%)', 'Valor do Serviço']],
    body: [[ row.mesFatura, row.vu, row.mesAnp, row.vdanp, row.vp, row.fu, row.sa ]],
    theme: 'plain',
    styles: { lineColor: [0, 0, 0], lineWidth: 0.1, fontSize: 8, halign: 'center', cellPadding: 2, textColor: [0,0,0], font: 'helvetica' },
    headStyles: { fontStyle: 'bold', fillColor: [245, 245, 245] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Memória de Cálculo:', 14, currentY - 2);
  doc.rect(14, currentY, pageWidth - 28, 55);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let calcY = currentY + 8;
  doc.text(`Volume Contratado Mensal (VCM) = 15.000 m³`, 18, calcY); calcY += 8;
  doc.text(`Valor Diesel ANP (VDANP) =`, 18, calcY); doc.text(row.vdanp, 70, calcY); calcY += 4;
  doc.text(`Valor Primato (VP) =`, 18, calcY); doc.text(row.vp, 70, calcY); calcY += 8;
  doc.text(`Parcela Fixa (PF) = R$ 10.000,00`, 18, calcY); calcY += 8;
  doc.text(`Volume Utilização (VU):`, 18, calcY); doc.text(row.vu, 70, calcY); calcY += 4;
  doc.text(`Fator Utilização (FU) = VU / VCM =`, 18, calcY); doc.text(row.fu, 70, calcY); calcY += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(`Serviço Abastecimento (SA) =`, 18, calcY); doc.text(row.sa, 70, calcY);

  window.open(doc.output('bloburl'), '_blank');
};


// ==========================================
// COMPONENTE PRINCIPAL DA TELA
// ==========================================
export const Abastecimentos: React.FC = () => {
  const [tabValue, setTabValue] = useState(0); 
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create'|'edit'|'concluir'|'assinar'|'view'>('create');
  const [openPrecificacaoDrawer, setOpenPrecificacaoDrawer] = useState(false);

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    cliente: '', placa: '', carga: '', pressaoInicial: null
  });

  const [filterPrecificacaoAnchorEl, setFilterPrecificacaoAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activePrecificacaoDate, setActivePrecificacaoDate] = useState<string>('');

  const [faturamentoView, setFaturamentoView] = useState<'chart' | 'table'>('chart');
  const [filterFaturamentoAnchorEl, setFilterFaturamentoAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeFaturamentoYear, setActiveFaturamentoYear] = useState<string>('2026');

  const [selected, setSelected] = useState<number[]>([]);
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '', severity: 'success' as 'success' | 'error' });
  const isSuccess = toastConfig.severity === 'success';

  const handleTriggerToast = (title: string, message: string, severity: 'success' | 'error' = 'success') => {
    setToastConfig({ open: true, title, message, severity });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 6000);
  };
  
  const [data, setData] = useState([
    { id: 1, cliente: 'Agrocampo', veiculo: 'Caminhão Truck', placa: 'XBH-3M89', data: '09/02/2026', inicio: '10:08:59', final: '---', volume: '---', status: 'Andamento', exec: 'Manual', pendingSignature: false, dataInicial: '09/02/2026', horaInicial: '10:08:59', pressaoInicial: '1000', odometro: '12500', frentista: 'João Carlos', assinaturaBase64: '', carga: 'Biometano' },
    { id: 2, cliente: 'Primato', veiculo: 'Caminhão Rodotrem', placa: 'HGD-5R72', data: '09/02/2026', inicio: '15:10:00', final: '---', volume: '---', status: 'Andamento', exec: 'Automação', pendingSignature: false, dataInicial: '09/02/2026', horaInicial: '15:10:00', pressaoInicial: '1050', odometro: '45000', frentista: 'Mário Silva', pressaoFinal: '2100', volumeAbastecido: '172m³', assinaturaBase64: '', carga: 'Dejeto' },
    { id: 3, multi: true, cliente: 'Bioplanta', veiculo: 'Caminhão Bitrem', placa: 'LSN-8M13', data: '09/02/2026', inicio: '14:00:00', final: '16:07:59', volume: '298m³', status: 'Concluído', exec: 'Automação', pendingSignature: false, dataInicial: '09/02/2026', horaInicial: '14:00:00', pressaoInicial: '1100', odometro: '88500', frentista: 'Roberto Dias', pressaoFinal: '2200', volumeAbastecido: '298m³', dataFinal: '09/02/2026', horaFinal: '16:07:59', assinaturaBase64: '', carga: 'Biometano' }
  ]);

  const [precificacaoData, setPrecificacaoData] = useState([
    { id: 1, preco: 'R$ 2,83', produto: 'CO²', mesAnp: 'Março', mesFatura: 'Abril', usuario: 'Roberto', data: '20/03/2026' }
  ]);

  const [faturamentoData] = useState([
    { id: 1, ano: '2026', mesFatura: 'Janeiro/2026', vu: '37m³', mesAnp: 'Janeiro/2026', vdanp: '4355', vp: 'R$ 4,53', fu: '1,89%', sa: 'R$ 0,79' },
    { id: 2, ano: '2026', mesFatura: 'Fevereiro/2026', vu: '48m³', mesAnp: 'Fevereiro/2026', vdanp: '5452', vp: 'R$ 4,09', fu: '-11,9%', sa: 'R$ 0,45' },
    { id: 3, ano: '2026', mesFatura: 'Março/2026', vu: '21m³', mesAnp: 'Março/2026', vdanp: '5633', vp: 'R$ 3,98', fu: '-1,50%', sa: 'R$ 0,89' },
    { id: 4, ano: '2026', mesFatura: 'Abril/2026', vu: '82m³', mesAnp: 'Abril/2026', vdanp: '3565', vp: 'R$ 4,24', fu: '12,89%', sa: 'R$ 0,45' },
    { id: 5, ano: '2026', mesFatura: 'Junho/2026', vu: '109m³', mesAnp: 'Junho/2026', vdanp: '6364', vp: 'R$ 4,08', fu: '-3,95%', sa: 'R$ 0,54' }
  ]);

  const clientesDisponiveis = useMemo(() => Array.from(new Set(data.map(d => d.cliente))).sort(), [data]);
  const placasDisponiveis = useMemo(() => Array.from(new Set(data.map(d => d.placa))).sort(), [data]);
  const datasPrecificacaoDisponiveis = useMemo(() => Array.from(new Set(precificacaoData.map(d => d.data))).sort(), [precificacaoData]);
  const anosFaturamentoDisponiveis = useMemo(() => Array.from(new Set(faturamentoData.map(d => d.ano))).sort((a, b) => Number(b) - Number(a)), [faturamentoData]);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => (
        item.cliente.toLowerCase().includes(search) || 
        item.placa.toLowerCase().includes(search) || 
        item.status.toLowerCase().includes(search)
      ));
    }
    if (activeFilters.cliente) filtered = filtered.filter(item => item.cliente === activeFilters.cliente);
    if (activeFilters.placa) filtered = filtered.filter(item => item.placa === activeFilters.placa);
    if (activeFilters.carga) filtered = filtered.filter(item => (item.carga || 'Biometano') === activeFilters.carga);
    if (activeFilters.pressaoInicial) filtered = filtered.filter(item => {
        const itemDate = dayjs(item.data.split('/').reverse().join('-'));
        return itemDate.isSame(activeFilters.pressaoInicial, 'day');
      });
    return filtered;
  }, [data, tabValue, searchTerm, activeFilters]);

  const filteredPrecificacaoData = useMemo(() => {
    if (!activePrecificacaoDate) return precificacaoData;
    return precificacaoData.filter(item => item.data === activePrecificacaoDate);
  }, [precificacaoData, activePrecificacaoDate]);

  const filteredFaturamentoData = useMemo(() => {
    if (!activeFaturamentoYear) return faturamentoData;
    return faturamentoData.filter(item => item.ano === activeFaturamentoYear);
  }, [faturamentoData, activeFaturamentoYear]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedData.filter(n => n.exec !== 'Automação').map((n) => n.id);
      setSelected(newSelected); return;
    }
    setSelected([]);
  };

  const handleSelectOne = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) { newSelected = newSelected.concat(selected, id); } 
    else if (selectedIndex === 0) { newSelected = newSelected.concat(selected.slice(1)); } 
    else if (selectedIndex === selected.length - 1) { newSelected = newSelected.concat(selected.slice(0, -1)); } 
    else if (selectedIndex > 0) { newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1)); }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleDelete = () => {
    setData(prev => prev.filter(r => !selected.includes(r.id)));
    setSelected([]); setOpenDelete(false);
    handleTriggerToast(selected.length > 1 ? 'Registros excluídos com sucesso' : 'Registro excluído com sucesso', selected.length > 1 ? 'Os registros selecionados foram removidos do sistema.' : 'O registro foi removido e não está mais disponível no sistema.', 'success');
  };

  const handleSaveDrawer = (payload: any, mode: string) => {
    setOpenDrawer(false);
    if (mode === 'concluir') {
      setData(prev => prev.map(r => r.id === selectedRow?.id ? { ...r, ...payload, status: 'Concluído', final: payload.horaFinal ? payload.horaFinal : r.final, assinaturaBase64: payload.assinaturaBase64 } : r));
      handleTriggerToast('Registro concluído com sucesso', 'Tudo certo! Data final, pressão e volume abastecido registrados.', 'success');
    } else if (mode === 'edit') {
      setData(prev => prev.map(r => r.id === selectedRow?.id ? { ...r, ...payload } : r));
      handleTriggerToast('Registro atualizado com sucesso', 'As alterações foram salvas e já estão disponíveis no sistema.', 'success');
    } else {
      setData(prev => [{ id: Math.random(), ...payload, data: payload.dataInicial, inicio: payload.horaInicial, status: 'Andamento', exec: 'Manual', final: '---', volume: '---' }, ...prev]);
      handleTriggerToast('Registro criado com sucesso', 'Pronto! Seu registro já está disponível.', 'success');
    }
  };

  const handleSavePrecificacao = (payload: any) => {
    setOpenPrecificacaoDrawer(false);
    setPrecificacaoData(prev => [{ id: Math.random(), preco: payload.preco, produto: payload.produto, mesAnp: payload.mesAnp, mesFatura: payload.mesFatura, usuario: 'Renan', data: payload.data || new Date().toLocaleDateString('pt-BR') }, ...prev]);
    handleTriggerToast('Preço cadastrado com sucesso', 'O valor foi salvo e já está disponível no sistema.', 'success');
  };

  const isFilterActive = Boolean(activeFilters.cliente || activeFilters.placa || activeFilters.carga || activeFilters.pressaoInicial);
  const isFilterOpenOrActive = Boolean(filterAnchorEl) || isFilterActive;
  const isPrecificacaoFilterActive = Boolean(activePrecificacaoDate);
  const isFaturamentoFilterActive = Boolean(activeFaturamentoYear);

  const currentChartYear = activeFaturamentoYear || '2026';
  const chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(m => `${m}/${currentChartYear}`);

  const cellW = { chk: 48, cli: 110, veic: 120, pla: 90, dat: 86, ini: 110, fim: 110, vol: 90, st: 100, ex: 110, act: 110 };
  const cellStyle = (minW: number) => ({ px: 1, flex: 1, minWidth: minW, display: 'flex', alignItems: 'center', overflow: 'hidden' });
  const textStyle = { fontSize: 13, fontFamily: SCHIBSTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', color: 'rgba(0, 0, 0, 0.87)' };
  const headerStyle = { fontSize: 13, fontFamily: SCHIBSTED, fontWeight: 600, color: 'rgba(0, 0, 0, 0.87)', whiteSpace: 'normal', lineHeight: 1.2 };

  const tabLabels = ['Relatório', 'Precificação', 'Faturamento', 'Base de cálculo'];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '8px 24px 12px 24px', bgcolor: '#F5F5F5', overflow: 'hidden', boxSizing: 'border-box' }}>
      
      <GlobalStyles styles={{ '.MuiAlert-root': { border: 'none !important', boxShadow: 'none !important' }, '.MuiAlert-standardSuccess': { backgroundColor: '#F1F9EE !important' } }} />

      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)', textDecoration: 'none' }}>
            <HomeIcon sx={{ fontSize: '18px' }} />
          </Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}>
            <MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} />
          </Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography onClick={() => { setTabValue(0); setPage(0); setSelected([]); }} sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: 14, fontFamily: SCHIBSTED, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Abastecimento
          </Typography>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: 14, fontFamily: SCHIBSTED, fontWeight: 500 }}>
            {tabLabels[tabValue]}
          </Typography>
        </Box>
        <Typography sx={{ color: 'black', fontSize: 48, fontFamily: SCHIBSTED, fontWeight: '400', lineHeight: '56.02px' }}>
          Abastecimento
        </Typography>
      </Box>

      <Collapse in={toastConfig.open}>
        <Box sx={{ width: '100%', mb: 0 }}>
          <Box sx={{ px: 2, py: '6px', background: isSuccess ? '#F1F9EE' : '#FFF4F4', borderRadius: '4px 4px 0 0', display: 'flex', border: '1px solid rgba(0,0,0,0.12)', borderBottom: 'none', alignItems: 'center' }}>
            <Box sx={{ pr: 1.5, display: 'flex' }}>
              {isSuccess ? <CheckCircleOutlined sx={{ fontSize: 22, color: '#70BF54' }} /> : <ErrorOutline sx={{ fontSize: 22, color: '#D32F2F' }} />}
            </Box>
            <Box sx={{ flex: 1, py: 1 }}>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>{toastConfig.title}</Typography>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 14, fontFamily: SCHIBSTED }}>{toastConfig.message}</Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(p => ({ ...p, open: false }))} size="small">
              <CloseIcon sx={{ fontSize: 20, color: isSuccess ? '#2F5023' : '#5F2120' }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderTop: toastConfig.open ? 'none' : '1px solid rgba(0,0,0,0.12)', borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <Box sx={{ pt: 1.5, px: 2 }}>
          <Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); setPage(0); setSelected([]); }} sx={{ minHeight: 36, '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, minHeight: 36, textTransform: 'uppercase' } }}>
            <Tab label="relatório" />
            <Tab label="precificação" />
            <Tab label="faturamento" />
            <Tab label="base de cálculo" />
          </Tabs>
        </Box>

        {tabValue !== 2 && (
          <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <TextField 
              placeholder="Buscar" size="small" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }} 
              sx={{ width: '100%', maxWidth: '601px', '& .MuiInputBase-root': { height: 32, fontFamily: SCHIBSTED } }} 
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.25)', fontSize: 20 }} /></InputAdornment> }} 
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {tabValue === 0 && (
                <>
                  <IconButton disabled={selected.length === 0} onClick={() => setOpenDelete(true)} sx={{ color: selected.length > 0 ? PRIMARY_BLUE : 'rgba(0,0,0,0.26)' }}><DeleteIcon /></IconButton>
                  <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUploadIcon /></IconButton>
                  <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)} sx={{ color: 'rgba(0,0,0,0.54)', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                    <Badge badgeContent={isFilterActive ? 1 : 0} color="primary" variant="standard" sx={{ '& .MuiBadge-badge': { bgcolor: '#0072C3', color: 'white' } }}>
                      <FilterAltIcon />
                    </Badge>
                  </IconButton>
                </>
              )}
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => { if(tabValue === 0) { setDrawerMode('create'); setOpenDrawer(true); } else if (tabValue === 1) { setOpenPrecificacaoDrawer(true); } }} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED, height: 32, px: 2 }}>
                ADICIONAR
              </Button>
            </Box>
          </Box>
        )}

        {/* ABA 0: RELATÓRIO */}
        {tabValue === 0 && (
          <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)' }}>
              
              <Box sx={{ display: 'flex', width: '100%', minWidth: '100%', minHeight: 56, flexShrink: 0, bgcolor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                <Box sx={{ width: cellW.chk, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <Checkbox indeterminate={selected.length > 0 && selected.length < paginatedData.filter(n => n.exec !== 'Automação').length} checked={paginatedData.filter(n => n.exec !== 'Automação').length > 0 && selected.length === paginatedData.filter(n => n.exec !== 'Automação').length} onChange={handleSelectAll} sx={{ color: 'rgba(0,0,0,0.4)', '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: PRIMARY_BLUE } }} />
                </Box>
                <Box sx={cellStyle(cellW.cli)}><Typography sx={headerStyle}>Cliente</Typography></Box>
                <Box sx={cellStyle(cellW.veic)}><Typography sx={headerStyle}>Tipo de veículo</Typography></Box>
                <Box sx={cellStyle(cellW.pla)}><Typography sx={headerStyle}>Placa</Typography></Box>
                <Box sx={cellStyle(cellW.dat)}><Typography sx={headerStyle}>Data</Typography></Box>
                <Box sx={cellStyle(cellW.ini)}><Typography sx={headerStyle}>Horário inicial</Typography></Box>
                <Box sx={cellStyle(cellW.fim)}><Typography sx={headerStyle}>Horário final</Typography></Box>
                <Box sx={cellStyle(cellW.vol)}><Typography sx={headerStyle}>Volume (m³)</Typography></Box>
                <Box sx={cellStyle(cellW.st)}><Typography sx={headerStyle}>Status</Typography></Box>
                <Box sx={cellStyle(cellW.ex)}><Typography sx={headerStyle}>Tipo de execução</Typography></Box>
                <Box sx={{ px: 1, width: cellW.act, flexShrink: 0, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Ações</Typography></Box>
              </Box>

              <Box sx={{ width: '100%', minWidth: '100%', display: 'flex', flexDirection: 'column' }}>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const canDelete = row.exec !== 'Automação';
                    return (
                      <Box key={row.id} onClick={() => { if(canDelete) handleSelectOne(row.id) }} sx={{ display: 'flex', width: '100%', height: 56, borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: isItemSelected ? 'rgba(0, 114, 195, 0.08)' : 'transparent', cursor: canDelete ? 'pointer' : 'default', '&:hover': { bgcolor: isItemSelected ? 'rgba(0, 114, 195, 0.12)' : 'rgba(0,0,0,0.02)' } }}>
                        <Box sx={{ width: cellW.chk, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}><Checkbox checked={isItemSelected} disabled={!canDelete} sx={{ pointerEvents: 'none', color: 'rgba(0,0,0,0.4)', '&.Mui-checked': { color: PRIMARY_BLUE } }} /></Box>
                        <Box sx={cellStyle(cellW.cli)}><Typography sx={textStyle} title={row.cliente}>{row.cliente}</Typography></Box>
                        <Box sx={cellStyle(cellW.veic)}><Typography sx={textStyle} title={row.veiculo}>{row.veiculo}</Typography></Box>
                        <Box sx={cellStyle(cellW.pla)}><Typography sx={textStyle} title={row.placa}>{row.placa}</Typography></Box>
                        <Box sx={cellStyle(cellW.dat)}><Typography sx={textStyle} title={row.data}>{row.data}</Typography></Box>
                        <Box sx={cellStyle(cellW.ini)}><Typography sx={textStyle} title={row.inicio}>{row.inicio}</Typography></Box>
                        <Box sx={cellStyle(cellW.fim)}><Typography sx={textStyle} title={row.final}>{row.final}</Typography></Box>
                        <Box sx={cellStyle(cellW.vol)}><Typography sx={textStyle} title={row.volume}>{row.volume}</Typography></Box>
                        <Box sx={cellStyle(cellW.st)}>
                          <Box sx={{ width: 'fit-content', minWidth: 80, height: 24, borderRadius: '4px', px: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: row.status === 'Andamento' ? STATUS_ANDAMENTO : STATUS_CONCLUIDO }}>
                            <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED, lineHeight: '20px', letterSpacing: '-0.01em' }}>{row.status}</Typography>
                          </Box>
                        </Box>
                        <Box sx={cellStyle(cellW.ex)}><Typography sx={textStyle} title={row.exec}>{row.exec}</Typography></Box>
                        <Box sx={{ px: 1, width: cellW.act, flexShrink: 0, display: 'flex', gap: 0.5, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                          {row.status === 'Andamento' ? (
                              <>
                                <Box sx={{ borderRadius: '100px', mr: 0.5 }}><IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('view'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton></Box>
                                <Box sx={{ borderRadius: '100px', mr: 0.5 }}><IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('concluir'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><AssignmentLateIcon sx={{ fontSize: 18 }} /></IconButton></Box>
                                <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('edit'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                              </>
                          ) : (
                            <>
                                <Box sx={{ borderRadius: '100px', mr: 0.5 }}><IconButton size="small" onClick={() => generatePDF(row)} sx={{ color: PRIMARY_BLUE }}><PictureAsPdfIcon sx={{ fontSize: 18 }} /></IconButton></Box>
                                <Box sx={{ borderRadius: '100px', mr: 0.5 }}><IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('view'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton></Box>
                                <IconButton size="small" onClick={() => { setSelectedRow(row); setDrawerMode('edit'); setOpenDrawer(true); }} sx={{ color: PRIMARY_BLUE }}><EditIcon sx={{ fontSize: 18 }} /></IconButton>
                            </>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '400px', py: 6 }}>
                    <Box component="img" src={emptyStateImg} alt="Sem registros" sx={{ width: 160, height: 'auto', mb: 3 }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#404040', fontFamily: SCHIBSTED, mb: 1 }}>Área sem registros</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 400, color: 'rgba(0, 0, 0, 0.87)', fontFamily: SCHIBSTED, textAlign: 'center', lineHeight: '20px' }}>Utilize o botão “Adicionar” para adicionar as primeiras informações.</Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexShrink: 0, justifyContent: 'flex-end', alignItems: 'center', p: 1, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                <TablePagination 
                  component="div" count={filteredData.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} 
                  labelRowsPerPage="Linhas por página:" labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`} sx={{ border: 'none', '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': { fontFamily: SCHIBSTED, fontSize: 12, color: 'black' } }} 
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* ABA 1: PRECIFICAÇÃO */}
        {tabValue === 1 && (
          <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'row', gap: 4, overflow: 'hidden' }}>
            <Box sx={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', height: '100%', pt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: SCHIBSTED, color: 'black' }}>Evolução dos preços</Typography>
                
                <IconButton onClick={(e) => setFilterPrecificacaoAnchorEl(e.currentTarget)} sx={{ color: 'rgba(0,0,0,0.54)', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                  <Badge badgeContent={isPrecificacaoFilterActive ? 1 : 0} color="primary" variant="standard" sx={{ '& .MuiBadge-badge': { bgcolor: '#0072C3', color: 'white' } }}>
                    <FilterAltIcon fontSize="small" />
                  </Badge>
                </IconButton>

              </Box>
              <Box sx={{ flex: 1, width: '100%', minHeight: 300 }}>
                <BarChart xAxis={[{ scaleType: 'band', data: ['Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026', 'Mai/2026', 'Jun/2026', 'Jul/2026'], tickLabelStyle: { fontFamily: SCHIBSTED, fontSize: 12, fill: 'rgba(0,0,0,0.87)' } }]} series={[{ data: [15, 20, 25, 22, 18, 24, 28], label: 'CO²', color: '#fcd34d' }, { data: [25, 28, 30, 26, 24, 29, 32], label: 'Biometano', color: '#a855f7' }]} valueFormatter={(value) => `$${value}`} slotProps={{ legend: { labelStyle: { fontFamily: SCHIBSTED, fontSize: 14 }, direction: 'row', position: { vertical: 'top', horizontal: 'right' } } }} margin={{ top: 70, bottom: 30, left: 40, right: 10 }} />
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
                {filteredPrecificacaoData.length > 0 ? (
                  filteredPrecificacaoData.map((row) => (
                    <Box key={row.id} sx={{ display: 'flex', width: '100%', height: 56, borderBottom: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <Box sx={{ px: 2, flex: 1, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.preco}</Typography></Box>
                      <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.produto}</Typography></Box>
                      <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesAnp}</Typography></Box>
                      <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesFatura}</Typography></Box>
                      <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.usuario}</Typography></Box>
                      <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.data}</Typography></Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '300px', py: 6 }}>
                    <Box component="img" src={emptyStateImg} alt="Sem registros" sx={{ width: 160, height: 'auto', mb: 3 }} />
                    <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#404040', fontFamily: SCHIBSTED, mb: 1 }}>Área sem registros</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 400, color: 'rgba(0, 0, 0, 0.87)', fontFamily: SCHIBSTED, textAlign: 'center', lineHeight: '20px' }}>Utilize o botão “Adicionar” para adicionar as primeiras informações.</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* ABA 2: FATURAMENTO */}
        {tabValue === 2 && (
          <Box sx={{ p: '16px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography sx={{ fontSize: 24, fontWeight: 600, fontFamily: SCHIBSTED, color: 'black' }}>
                Faturamentos realizados {activeFaturamentoYear ? `(${activeFaturamentoYear})` : ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setFaturamentoView(v => v === 'chart' ? 'table' : 'chart')} sx={{ color: 'rgba(0,0,0,0.54)', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                  {faturamentoView === 'chart' ? <ListIcon /> : <BarChartIcon />}
                </IconButton>

                <IconButton onClick={(e) => setFilterFaturamentoAnchorEl(e.currentTarget)} sx={{ color: 'rgba(0,0,0,0.54)', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                  <Badge badgeContent={isFaturamentoFilterActive ? 1 : 0} color="primary" variant="standard" sx={{ '& .MuiBadge-badge': { bgcolor: '#0072C3', color: 'white' } }}>
                    <FilterAltIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Box>

            {faturamentoView === 'chart' ? (
              <Box sx={{ flex: 1, width: '100%', minHeight: 460, display: 'flex', justifyContent: 'center' }}>
                 <BarChart 
                   xAxis={[{ scaleType: 'band', data: chartLabels, tickLabelStyle: { fontFamily: SCHIBSTED, fontSize: 12, fill: 'rgba(0,0,0,0.87)' } }]} 
                   series={[
                     { data: [45000, 52300, 48000, 51000, 49000, 53000, 55000, 56000, 52000, 48000, 49000, 60000], label: 'Valor R$', color: '#fcd34d' }, 
                     { data: [15000, 18000, 16000, 19000, 17500, 20000, 22000, 21000, 19000, 18000, 17000, 25000], label: 'Valor R$', color: '#a855f7' }
                   ]} 
                   valueFormatter={(value) => `$${value?.toLocaleString('pt-BR')},00`} 
                   slotProps={{ legend: { labelStyle: { fontFamily: SCHIBSTED, fontSize: 14 }, direction: 'row', position: { vertical: 'top', horizontal: 'right' } } }} 
                   margin={{ top: 50, bottom: 30, left: 80, right: 10 }} 
                 />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)' }}>
                <Box sx={{ display: 'flex', width: '100%', minHeight: 56, flexShrink: 0, bgcolor: 'rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                  <Box sx={{ px: 2, flex: 1.2, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Mês Fatura</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Volume Utilizado (m³)</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.2, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Mês Ref. ANP</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Valor Ref. ANPV</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Valor Primato</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Fator Utilização (%)</Typography></Box>
                  <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Valor do Serviço</Typography></Box>
                  <Box sx={{ px: 2, width: 80, flexShrink: 0, display: 'flex', alignItems: 'center' }}><Typography sx={headerStyle}>Recibo</Typography></Box>
                </Box>
                
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  {filteredFaturamentoData.length > 0 ? (
                    filteredFaturamentoData.map((row) => (
                      <Box key={row.id} sx={{ display: 'flex', width: '100%', height: 56, borderBottom: '1px solid rgba(0,0,0,0.08)', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                        <Box sx={{ px: 2, flex: 1.2, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesFatura}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.vu}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.2, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.mesAnp}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.vdanp}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.vp}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.fu}</Typography></Box>
                        <Box sx={{ px: 2, flex: 1.5, display: 'flex', alignItems: 'center' }}><Typography sx={textStyle}>{row.sa}</Typography></Box>
                        <Box sx={{ px: 2, width: 80, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small" onClick={() => handleGenerateFaturaPDF(row)} sx={{ color: PRIMARY_BLUE }}>
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                      <Typography sx={{ fontSize: 16, fontFamily: SCHIBSTED, color: 'rgba(0,0,0,0.6)' }}>Nenhum faturamento encontrado para este ano.</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}

      </Paper>

      <AbastecimentoDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} onSave={handleSaveDrawer} mode={drawerMode} initialData={selectedRow} />
      <PrecificacaoDrawer open={openPrecificacaoDrawer} onClose={() => setOpenPrecificacaoDrawer(false)} onSave={handleSavePrecificacao} />

      <AbastecimentoFilter anchorEl={filterAnchorEl} onClose={() => setFilterAnchorEl(null)} currentFilters={activeFilters} clientes={clientesDisponiveis} placas={placasDisponiveis} onApply={(f) => { setActiveFilters(f); setPage(0); handleTriggerToast('Filtro aplicado', 'A listagem foi atualizada.', 'success'); }} onClear={() => { setActiveFilters({ cliente: '', placa: '', carga: '', pressaoInicial: null }); setPage(0); handleTriggerToast('Filtro removido', 'Exibindo todos os registros.', 'success'); }} />
      <PrecificacaoFilter anchorEl={filterPrecificacaoAnchorEl} onClose={() => setFilterPrecificacaoAnchorEl(null)} currentDate={activePrecificacaoDate} datas={datasPrecificacaoDisponiveis} onApply={(date) => { setActivePrecificacaoDate(date); handleTriggerToast('Filtro aplicado', 'A listagem de preços foi atualizada.', 'success'); }} onClear={() => { setActivePrecificacaoDate(''); handleTriggerToast('Filtro removido', 'Exibindo todos os preços.', 'success'); }} />
      <FaturamentoFilter anchorEl={filterFaturamentoAnchorEl} onClose={() => setFilterFaturamentoAnchorEl(null)} currentAno={activeFaturamentoYear} anos={anosFaturamentoDisponiveis} onApply={(ano) => { setActiveFaturamentoYear(ano); handleTriggerToast('Filtro aplicado', `Exibindo faturamentos de ${ano || 'todos os anos'}.`, 'success'); }} onClear={() => { setActiveFaturamentoYear(''); handleTriggerToast('Filtro removido', 'Exibindo todos os anos.', 'success'); }} />

      <Drawer anchor="right" open={openDelete} onClose={() => setOpenDelete(false)} sx={{ zIndex: 9999 }} PaperProps={{ sx: { width: 620, border: 'none', bgcolor: 'white' } }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
              <IconButton onClick={() => setOpenDelete(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: '40px', color: 'black', textTransform: 'uppercase' }}>EXCLUIR REGISTRO{selected.length > 1 ? 'S' : ''}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 500, fontFamily: SCHIBSTED, lineHeight: '32px', color: 'black', textAlign: 'justify' }}>Ao excluir {selected.length > 1 ? 'esses registros' : 'esse registro'} todas as informações associadas serão removidas. Deseja excluir {selected.length > 1 ? 'esses registros' : 'esse registro'}?</Typography>
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