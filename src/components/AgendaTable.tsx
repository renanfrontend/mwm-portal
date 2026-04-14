import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calcularTotaisAgenda } from '../utils/calcularTotaisAgenda';
import { Box, Typography, IconButton, TextField, InputAdornment, Checkbox, Drawer, Button, MenuItem, Select, Divider } from '@mui/material';
import { Close as CloseIcon, Delete, ContentCopy, CalendarMonth, ChevronLeft, ChevronRight, FileUpload, FilterAlt } from "@mui/icons-material";
import FilterPanel from './filter-panel/FilterPanel';
import ExportPanel from './export-panel/ExportPanel';
import { getUniqueTransportadoras } from '../utils/transportadoraUtils';
import type { AgendaRow } from '../types/AgendaRow';
import { format, startOfWeek, subWeeks, addWeeks, addDays, getWeek, startOfDay, isAfter } from 'date-fns';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

import type { ProdutorListItem } from '../types/cooperado';

interface EstabelecimentoOption {
  id: number;
  numEstabelecimento: string;
}

interface AgendaTableProps {
  title: string;
  referenceDate: Date;
  onDateChange: (date: Date) => void;
  data: AgendaRow[];
  onDataChange: (data: AgendaRow[]) => void;
  showCopy: boolean;
  onDeleteSuccess?: () => void;
  onCopyClick?: (ids: Array<string | number>) => void;
  onDeleteSelected?: (ids: Array<string | number>) => void;
  disableNext?: boolean;
  transportadoras?: string[];
  produtores: string[];
  estabelecimentos?: EstabelecimentoOption[];
  produtoresList?: ProdutorListItem[];
  distancias?: string[];
  totaisKm?: string[];
}

export const AgendaTable: React.FC<AgendaTableProps> = ({ title, referenceDate, onDateChange, data, onDataChange, showCopy, onDeleteSuccess, onCopyClick, onDeleteSelected, disableNext, transportadoras = [], produtores = [], estabelecimentos = [], produtoresList = [], distancias = [], totaisKm = [] }) => {

  // Mapeamento idEstabelecimento -> numEstabelecimento
  const idToNumEstabelecimento = React.useMemo(() => {
    const map: Record<string | number, string> = {};
    (produtoresList || []).forEach((p) => {
      if (p.estabelecimentoId != null && p.numEstabelecimento) {
        map[p.estabelecimentoId] = p.numEstabelecimento;
      }
    });
    return map;
  }, [produtoresList]);
  const [openExport, setOpenExport] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [localData, setLocalData] = useState<AgendaRow[]>(data);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Filtro
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    estabelecimento: '',
    produtor: '',
    distancia: '',
    transportadora: '',
    totalKm: ''
  });

  // Corrige tipos opcionais do FilterPanel
  const handleFilterChange = (newFilters: {
    estabelecimento?: string;
    produtor?: string;
    distancia?: string;
    transportadora?: string;
    totalKm?: string;
  }) => {
    setFilters(prev => ({
      estabelecimento: newFilters.estabelecimento ?? prev.estabelecimento,
      produtor: newFilters.produtor ?? prev.produtor,
      distancia: newFilters.distancia ?? prev.distancia,
      transportadora: newFilters.transportadora ?? prev.transportadora,
      totalKm: newFilters.totalKm ?? prev.totalKm,
    }));
  };

  // Loga os dados recebidos para debug
  React.useEffect(() => {
    if (data && data.length > 0) {
      console.log('[AgendaTable] Dados recebidos para o grid:', JSON.stringify(data, null, 2));
    }
  }, [data]);

  useEffect(() => { setLocalData(data); }, [data]);

  const isPlanejado = title === 'Planejado';
  const hasSelection = selectedIds.length > 0;
  const gridLayout = `50px minmax(110px, 0.8fr) minmax(130px, 1.2fr) minmax(110px, 0.8fr) minmax(150px, 1.3fr) minmax(100px, 0.7fr) repeat(7, 1fr)`;
  
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 });

  const isWeekLocked = () => {
    const today = startOfDay(new Date());
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    return !isAfter(start, startOfCurrentWeek);
  };

  const locked = isWeekLocked();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMuiMenu = target.closest('.MuiPopover-root') || target.closest('.MuiMenu-root') || target.closest('.MuiDrawer-root');
      if (tableRef.current && !tableRef.current.contains(target) && !isMuiMenu) {
        if (editingRowId) onDataChange?.(localData);
        setEditingRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingRowId, localData, onDataChange]);

  // FUNÇÃO PARA APLICAR FILTROS NO GRID
  const applyFilters = (f: typeof filters) => {
    const filtrado = data.filter((row: AgendaRow) => {
      // Filtro por número de estabelecimento exibido
      if (f.estabelecimento) {
        const numEstab = idToNumEstabelecimento[row.id] || '';
        if (!numEstab.toLowerCase().includes(f.estabelecimento.toLowerCase())) return false;
      }
      if (f.produtor && !row.produtor?.toLowerCase().includes(f.produtor.toLowerCase()))
        return false;
      if (f.distancia && String(row.distancia) !== String(f.distancia))
        return false;
      if (f.transportadora && row.transp !== f.transportadora)
        return false;
      // Adiciona filtro para total de km
      if (f.totalKm && String(row.km) !== String(f.totalKm)) 
        return false;
      return true;
    });
    setLocalData(filtrado);
  };

  const handleRowClick = (rowId: string) => {
    if (!isPlanejado) return;
    if (editingRowId && editingRowId !== rowId) {
      onDataChange?.(localData);
      setEditingRowId(null);
    }
    setSelectedIds(prev => prev.includes(rowId) ? prev.filter(i => i !== rowId) : [...prev, rowId]);
  };

  // Memoiza o cálculo dos totais para performance e atualização automática
  const totais = useMemo(() => calcularTotaisAgenda(localData), [localData]);

  return (
    <Box ref={tableRef} sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 4, px: 2 }}>
      {/* Sticky Título Planejado */}
      <Box sx={{ bgcolor: 'white', mb: 0, position: 'sticky', top: 0, zIndex: 12, px: 0, pt: 0, pb: 0 }}>
        <Typography sx={{ fontSize: 22, color: 'black', fontWeight: 500, ...COMMON_FONT, mb: 1 }}>{title}</Typography>
        {/* Sticky Semana/Período */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, position: 'sticky', top: 40, zIndex: 11, bgcolor: 'white' }}>
          <IconButton size="small" onClick={() => onDateChange(subWeeks(referenceDate, 1))} sx={{ color: 'inherit' }}>
            <ChevronLeft fontSize="small" />
          </IconButton>
          <Typography sx={{ fontSize: 17, fontWeight: 500, ...COMMON_FONT, color: 'inherit' }}>
            Semana {getWeek(referenceDate, { weekStartsOn: 0 })}
          </Typography>
          <IconButton 
            size="small" 
            disabled={disableNext} 
            onClick={() => onDateChange(addWeeks(referenceDate, 1))} 
            sx={{ color: disableNext ? 'rgba(0,0,0,0.26)' : 'inherit' }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
          <TextField label="Período semanal" value={`${format(start, 'dd/MM/yyyy')} a ${format(addDays(start, 6), 'dd/MM/yyyy')}`} size="small" variant="outlined" inputProps={{ readOnly: true }} sx={{ width: 260, ml: 1, '& .MuiOutlinedInput-root': { height: 34 } }} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ fontSize: 17 }} /></InputAdornment> }} />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {/* AJUSTE AQUI: Copiar agora respeita a seleção igual à lixeira */}
            {showCopy && isPlanejado && (
              <IconButton 
                onClick={() => { if (onCopyClick) onCopyClick(selectedIds); }}
                disabled={!hasSelection}
                sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }}
                title={!hasSelection ? 'Selecione um registro para copiar' : 'Copiar planejamento'}
              >
                <ContentCopy sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {isPlanejado && (
              <IconButton 
                onClick={() => hasSelection && !locked && setIsDrawerOpen(true)} 
                disabled={!hasSelection || locked}
                sx={{ color: (hasSelection && !locked) ? '#0072C3' : 'rgba(0,0,0,0.26)' }}
                title={locked ? 'Não é possível limpar registros de semanas passadas ou atuais' : (!hasSelection ? 'Selecione um registro para limpar' : 'Limpar registros selecionados')}
              >
                <Delete sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {isPlanejado && (
              <>
                <IconButton onClick={() => setOpenExport(true)}>
                  <FileUpload sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton onClick={() => setShowFilter(prev => !prev)}>
                  <FilterAlt sx={{ fontSize: 20 }} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
        {/* Painel de Filtro */}
        <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      {showFilter && (
        <FilterPanel
          open={showFilter}
          filters={filters}
          transportadoras={transportadoras}
          produtores={produtores}
          estabelecimentos={estabelecimentos}
          distancias={distancias}
          totaisKm={totaisKm}
          onChange={handleFilterChange}
          onApply={() => {
            applyFilters(filters);
            setShowFilter(false);
          }}
          onClear={() => {
            const empty = {
              estabelecimento: '',
              produtor: '',
              distancia: '',
              transportadora: '',
              totalKm: ''
            };
            setFilters(empty);
            setLocalData(data);
            setShowFilter(false);
          }}
        />
      )}
    </Box>

        {/* Divider separador acima do grid */}
        <Divider sx={{ width: '100%', marginTop: '8px', marginBottom: '8px', borderColor: '#bdbdbd' }} />

        {/* Sticky Cabeçalho da Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, height: 56, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: 2, position: 'sticky', top: 96, zIndex: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isPlanejado && (
              <Checkbox 
                size="small" 
                checked={localData.length > 0 && selectedIds.length === localData.length} 
                onChange={(e) => setSelectedIds(e.target.checked ? localData.map((row: AgendaRow) => row.id) : [])} 
                sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }}
              />
            )}
          </Box>
          {['N° estabelecimento', 'Produtor', 'Distância (KM)', 'Transportadora', 'Total de KM'].map((col, i) => (
            <Typography key={i} sx={{ p: '10px 8px', fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>{col}</Typography>
          ))}
          {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia, i) => (
            <Box key={i} sx={{ p: '6px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>{dia.substring(0, 3)}</Typography>
              <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.60)', ...COMMON_FONT }}>{format(addDays(start, i), 'dd/MM')}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Container com scroll apenas nas linhas da grid */}
      <Box sx={{ maxHeight: 420, overflowY: 'auto', width: '100%' }}>
        {localData.map((row: AgendaRow) => {
          const isSelected = isPlanejado && selectedIds.includes(row.id);
          const isEditing = isPlanejado && editingRowId === row.id;
          const dist = Number(row.distancia ?? row.distanciaKm ?? row.km ?? 0);
          const viagens = (Number(row.seg)||0) + (Number(row.ter)||0) + (Number(row.qua)||0) + (Number(row.qui)||0) + (Number(row.sex)||0) + (Number(row.sab)||0) + (Number(row.dom)||0);
          const totalKm = Math.round(dist * viagens);
          return (
            <Box 
              key={row.id} 
              onClick={() => handleRowClick(String(row.id))}
              onDoubleClick={() => isPlanejado && !locked && setEditingRowId(String(row.id))}
              sx={{ 
                display: 'grid', gridTemplateColumns: gridLayout, borderBottom: '1px solid rgba(0,0,0,0.08)', 
                bgcolor: isSelected ? 'rgba(0, 114, 195, 0.08)' : 'white', alignItems: 'center', 
                cursor: isPlanejado ? 'pointer' : 'default', opacity: (!isPlanejado || locked) ? 0.8 : 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {isSelected && <Checkbox size="small" checked={true} sx={{ color: '#00518A' }} />}
              </Box>
              <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>
                {row.numEstabelecimento || idToNumEstabelecimento[row.id] || row.id}
              </Typography>
              <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.produtor}</Typography>
              <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.distancia} Km</Typography>
              <Box sx={{ p: '4px 8px' }}>
                {isEditing && !locked && isPlanejado ? (
                  <Select size="small" value={row.transp} fullWidth onClick={(e) => e.stopPropagation()} onChange={(e) => {
                      const newValue = e.target.value;
                      const newData = localData.map((r: AgendaRow) => r.id === row.id ? { ...r, transp: newValue } : r);
                      setLocalData(newData);
                      onDataChange?.(newData); 
                    }} sx={{ height: 32, fontSize: 11 }}>
                    {transportadoras.map((t: string) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                ) : <Typography sx={{ fontSize: 12, ...COMMON_FONT, color: (!isPlanejado || locked) ? 'rgba(0,0,0,0.5)' : 'inherit' }}>{row.transp}</Typography>}
              </Box>
              <Typography sx={{ p: '8px 8px', fontSize: 12, fontWeight: 600, ...COMMON_FONT }}>{totalKm} Km</Typography>
              {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((day) => (
                  <Box key={day} sx={{ p: '4px 4px', textAlign: 'center' }}>
                    {isEditing && !locked && isPlanejado ? (
                      <TextField type="number" size="small" value={row[day]} onClick={(e) => e.stopPropagation()} onChange={(e) => {
                          setLocalData((prev: AgendaRow[]) => {
                            const updated = prev.map((r: AgendaRow) => r.id === row.id ? { ...r, [day]: Math.max(0, parseInt(e.target.value) || 0) } : r);
                            onDataChange?.(updated);
                            return updated;
                          });
                        }} onBlur={() => onDataChange?.(localData)} onKeyDown={(e) => { if (e.key === 'Enter') onDataChange?.(localData); }} sx={{ '& .MuiOutlinedInput-root': { height: 30, fontSize: 11 } }} />
                    ) : (
                      <Typography sx={{ fontSize: 12, ...COMMON_FONT, color: (!isPlanejado || locked) ? 'rgba(0,0,0,0.5)' : 'inherit', cursor: 'default' }}>{row[day]}</Typography>
                    )}
                  </Box>
              ))}
            </Box>
          );
        })}
        {/* Linha de totalização */}
        {localData.length > 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, borderTop: '2px solid #bdbdbd', bgcolor: 'rgba(0,0,0,0.03)', alignItems: 'center', fontWeight: 700 }}>
            <Box />
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT, fontWeight: 700 }}>Totais</Typography>
            <Box />
            <Box />
            <Box />
            {/* Total de KM */}
            <Typography sx={{ p: '8px 8px', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.totalKm} Km</Typography>
            {/* Dias da semana */}
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.dom}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.seg}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.ter}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.qua}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.qui}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.sex}</Typography>
            <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, ...COMMON_FONT }}>{totais.sab}</Typography>
          </Box>
        )}
      </Box>
        {/* ...existing code... */}
      {/* Export Drawer */}
      {openExport && (
        <ExportPanel
          open={openExport}
          onClose={() => setOpenExport(false)}
          transportadoras={getUniqueTransportadoras(
            data.map(row => ({
              id: typeof row.id === 'number' ? row.id : 0,
              cooperado: row.produtor || '',
              seg: row.seg ?? 0,
              ter: row.ter ?? 0,
              qua: row.qua ?? 0,
              qui: row.qui ?? 0,
              sex: row.sex ?? 0,
              sab: row.sab ?? 0,
              dom: row.dom ?? 0,
              qtd: 0,
              km: Number(row.km ?? 0),
              transportadora: row.transp || '',
              status: 'Planejado'
            }))
          )}
          dadosPlanejados={data.map(row => ({
            id: typeof row.id === 'number' ? row.id : 0,
            cooperado: row.produtor || '',
            seg: row.seg ?? 0,
            ter: row.ter ?? 0,
            qua: row.qua ?? 0,
            qui: row.qui ?? 0,
            sex: row.sex ?? 0,
            sab: row.sab ?? 0,
            dom: row.dom ?? 0,
            qtd: 0,
            km: Number(row.km ?? 0),
            transportadora: row.transp || '',
            status: 'Planejado'
          })
          )}
        />
      )}
      {/* Drawer permanece igual */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} sx={{ zIndex: 999999 }} PaperProps={{ sx: { width: 620, display: 'flex', flexDirection: 'column' } }}>
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT, lineHeight: 1.1 }}>LIMPAR O REGISTRO</Typography>
          </Box>
        </Box>
        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 500, ...COMMON_FONT, textAlign: 'justify', lineHeight: '32px', mb: 5 }}>Ao limpar este registro do planejamento da semana, todas as informações associadas a ele serão removidas. Deseja continuar?</Typography>
        </Box>
        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, flexShrink: 0 }}>
            <Button variant="outlined" onClick={() => setIsDrawerOpen(false)} fullWidth sx={{ height: 48, fontWeight: 600, color: '#0072C3', borderColor: 'rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" onClick={async () => {
              if (onDeleteSelected) {
                try { await onDeleteSelected(selectedIds); } catch (error) { return; }
              } else {
                const resetData = localData.map((r: AgendaRow) => selectedIds.includes(r.id) ? { ...r, seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0, transp: '' } : r);
                onDataChange(resetData);
              }
              setIsDrawerOpen(false); setSelectedIds([]); onDeleteSuccess?.(); setEditingRowId(null);
            }} fullWidth sx={{ height: 48, fontWeight: 600, bgcolor: '#0072C3' }}>SIM</Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AgendaTable;