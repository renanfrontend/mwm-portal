import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment, Checkbox, Drawer, Button, MenuItem, Select } from '@mui/material';
import { Close as CloseIcon, Delete, ContentCopy, CalendarMonth, ChevronLeft, ChevronRight, FileUpload, FilterAlt } from "@mui/icons-material";
import { format, startOfWeek, subWeeks, addWeeks, addDays, getWeek } from 'date-fns';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };
const TRANSPORTERS = ['Expresso São Miguel', 'LogBras', 'TransRápido', 'Alfa Logística'];

export const AgendaTable: React.FC<any> = ({ title, referenceDate, onDateChange, data, onDataChange, showCopy, onDeleteSuccess, onCopyClick }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [localData, setLocalData] = useState(data);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalData(data); }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMuiMenu = target.closest('.MuiPopover-root') || target.closest('.MuiMenu-root');
      if (tableRef.current && !tableRef.current.contains(target) && !isMuiMenu) {
        if (editingRowId) onDataChange?.(localData);
        setEditingRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingRowId, localData, onDataChange]);

  const isPlanejado = title === 'Planejado';
  const hasSelection = selectedIds.length > 0;
  const gridLayout = `50px minmax(110px, 0.8fr) minmax(130px, 1.2fr) minmax(110px, 0.8fr) minmax(150px, 1.3fr) minmax(100px, 0.7fr) repeat(7, 1fr)`;
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 });

  const handleRowClick = (rowId: string) => {
    if (!isPlanejado) return;
    if (editingRowId && editingRowId !== rowId) {
      onDataChange?.(localData);
      setEditingRowId(null);
    }
    setSelectedIds(prev => prev.includes(rowId) ? prev.filter(i => i !== rowId) : [...prev, rowId]);
  };

  return (
    <Box ref={tableRef} sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 4, px: 2 }}>
      <Box sx={{ bgcolor: 'white', mb: 1 }}>
        <Typography sx={{ fontSize: 22, color: 'black', fontWeight: 500, ...COMMON_FONT, mb: 1 }}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.54)' }}>
          <IconButton size="small" onClick={() => onDateChange(subWeeks(referenceDate, 1))}><ChevronLeft fontSize="small" /></IconButton>
          <Typography sx={{ fontSize: 17, fontWeight: 500, ...COMMON_FONT }}>Semana {getWeek(referenceDate, { weekStartsOn: 1 })}</Typography>
          <IconButton size="small" onClick={() => onDateChange(addWeeks(referenceDate, 1))}><ChevronRight fontSize="small" /></IconButton>
          <TextField label="Período semanal" value={`${format(start, 'dd/MM/yyyy')} a ${format(addDays(start, 6), 'dd/MM/yyyy')}`} size="small" variant="outlined" readOnly sx={{ width: 260, ml: 1, '& .MuiOutlinedInput-root': { height: 34 } }} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ fontSize: 18 }} /></InputAdornment> }} />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {showCopy && <IconButton onClick={() => hasSelection && onCopyClick()} sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }}><ContentCopy sx={{ fontSize: 20 }} /></IconButton>}
            {isPlanejado && <IconButton onClick={() => hasSelection && setIsDrawerOpen(true)} sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }}><Delete sx={{ fontSize: 20 }} /></IconButton>}
            <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUpload sx={{ fontSize: 20 }} /></IconButton>
            <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAlt sx={{ fontSize: 20 }} /></IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, bgcolor: 'rgba(0, 0, 0, 0.04)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isPlanejado && <Checkbox size="small" checked={localData.length > 0 && selectedIds.length === localData.length} onChange={(e) => setSelectedIds(e.target.checked ? localData.map((row: any) => row.id) : [])} sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }} />}
        </Box>
        {['N° estabelecimento', 'Produtor', 'Distância (KM)', 'Transportadora', 'Total de KM'].map((col, i) => (
          <Typography key={i} sx={{ p: '10px 8px', fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>{col}</Typography>
        ))}
        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia, i) => (
          <Box key={i} sx={{ p: '6px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>{dia.substring(0, 3)}</Typography>
            <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.60)', ...COMMON_FONT }}>{format(addDays(start, i), 'dd/MM')}</Typography>
          </Box>
        ))}
      </Box>

      {localData.map((row: any) => {
        const isSelected = isPlanejado && selectedIds.includes(row.id);
        const isEditing = isPlanejado && editingRowId === row.id;
        const totalKm = row.distancia * ((row.seg||0) + (row.ter||0) + (row.qua||0) + (row.qui||0) + (row.sex||0) + (row.sab||0) + (row.dom||0));
        return (
          <Box key={row.id} onClick={() => handleRowClick(row.id)} onDoubleClick={() => isPlanejado && setEditingRowId(row.id)} sx={{ display: 'grid', gridTemplateColumns: gridLayout, borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: isSelected ? 'rgba(0, 114, 195, 0.08)' : 'white', alignItems: 'center', cursor: isPlanejado ? 'pointer' : 'default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>{isSelected && <Checkbox size="small" checked={true} sx={{ color: '#00518A' }} />}</Box>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.id}</Typography>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.produtor}</Typography>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.distancia} Km</Typography>
            <Box sx={{ p: '4px 8px' }}>
               {isEditing ? (
                <Select size="small" value={row.transp} fullWidth onClick={(e) => e.stopPropagation()} onChange={(e) => setLocalData((prev: any) => prev.map((r: any) => r.id === row.id ? { ...r, transp: e.target.value } : r))} sx={{ height: 32, fontSize: 11 }}>
                  {TRANSPORTERS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
               ) : <Typography sx={{ fontSize: 12, ...COMMON_FONT }}>{row.transp}</Typography>}
            </Box>
            <Typography sx={{ p: '8px 8px', fontSize: 12, fontWeight: 600, ...COMMON_FONT }}>{totalKm} Km</Typography>
            {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map((day) => (
              <Box key={day} sx={{ p: '4px 4px', textAlign: 'center' }}>
                {isEditing ? (
                  <TextField type="number" size="small" value={row[day]} onClick={(e) => e.stopPropagation()} onChange={(e) => setLocalData((prev: any) => prev.map((r: any) => r.id === row.id ? { ...r, [day]: Math.max(0, parseInt(e.target.value) || 0) } : r))} sx={{ '& .MuiOutlinedInput-root': { height: 30, fontSize: 11 } }} />
                ) : <Typography sx={{ fontSize: 12, ...COMMON_FONT }}>{row[day]}</Typography>}
              </Box>
            ))}
          </Box>
        );
      })}

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} sx={{ zIndex: 999999 }} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT }}>LIMPAR O REGISTRO</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, ...COMMON_FONT, textAlign: 'justify', lineHeight: '32px', mb: 5 }}>Ao limpar esse registro do planejado da semana todas as informações associadas à ela serão limpas nos dados. Deseja limpar esse registro?</Typography>
          <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setIsDrawerOpen(false)} sx={{ width: 280, height: 48, fontWeight: 600, color: '#0072C3', borderColor: 'rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" onClick={() => { 
              const resetData = localData.map((r: any) => selectedIds.includes(r.id) ? { ...r, seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0, transp: '' } : r);
              onDataChange(resetData);
              setIsDrawerOpen(false); setSelectedIds([]); onDeleteSuccess(); setEditingRowId(null); 
            }} sx={{ width: 280, height: 48, fontWeight: 600, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AgendaTable;