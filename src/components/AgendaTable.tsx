import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, TextField, InputAdornment, Checkbox, Drawer, Button, MenuItem, Select } from '@mui/material';
import { Close as CloseIcon, Delete, ContentCopy, CalendarMonth, ChevronLeft, ChevronRight, FileUpload, FilterAlt } from "@mui/icons-material";
import { format, startOfWeek, subWeeks, addWeeks, addDays, getWeek, startOfDay, isAfter } from 'date-fns';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

export const AgendaTable: React.FC<any> = ({ title, referenceDate, onDateChange, data, onDataChange, showCopy, onDeleteSuccess, onCopyClick, onDeleteSelected, disableNext, transportadoras = [] }) => {
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const [localData, setLocalData] = useState(data);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Loga os dados recebidos para debug
  React.useEffect(() => {
    // Só loga se houver dados
    if (data && data.length > 0) {
      // Mostra o JSON no console do navegador
      // eslint-disable-next-line no-console
      console.log('[AgendaTable] Dados recebidos para o grid:', JSON.stringify(data, null, 2));
    }
  }, [data]);

  useEffect(() => { setLocalData(data); }, [data]);

  const isPlanejado = title === 'Planejado';
  const hasSelection = selectedIds.length > 0;
  const gridLayout = `50px minmax(110px, 0.8fr) minmax(130px, 1.2fr) minmax(110px, 0.8fr) minmax(150px, 1.3fr) minmax(100px, 0.7fr) repeat(7, 1fr)`;
  
  // Data de início da semana visualizada no grid
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 });

  // Regra de Negócio: Bloqueio de Edição
  // Semana atual e passadas = Bloqueadas (ReadOnly)
  // Semanas futuras = Liberadas
  const isWeekLocked = () => {
    const today = startOfDay(new Date());
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    
    // Se a semana do grid começa NA MESMA DATA ou ANTES da semana atual, está bloqueada.
    // Só libera se for estritamente DEPOIS da semana atual.
    return !isAfter(start, startOfCurrentWeek);
  };

  const locked = isWeekLocked();

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

  const handleRowClick = (rowId: string) => {
    // Se não for planejado ou estiver bloqueado, apenas seleciona, não edita
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
          <IconButton 
            size="small" 
            onClick={() => onDateChange(subWeeks(referenceDate, 1))}
            sx={{ color: 'inherit' }}
          >
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
          <TextField label="Período semanal" value={`${format(start, 'dd/MM/yyyy')} a ${format(addDays(start, 6), 'dd/MM/yyyy')}`} size="small" variant="outlined" inputProps={{ readOnly: true }} sx={{ width: 260, ml: 1, '& .MuiOutlinedInput-root': { height: 34 } }} InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ fontSize: 18 }} /></InputAdornment> }} />
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {showCopy && isPlanejado && (
              <IconButton 
                onClick={() => onCopyClick(selectedIds)} 
                sx={{ color: '#0072C3' }}
                title={'Copiar planejamento'}
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
            {isPlanejado ? (
              <>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUpload sx={{ fontSize: 20 }} /></IconButton>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAlt sx={{ fontSize: 20 }} /></IconButton>
              </>
            ) : (
              <>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }} title="Apenas visualização - Dados realizados"><FileUpload sx={{ fontSize: 20 }} /></IconButton>
                <IconButton disabled sx={{ color: 'rgba(0,0,0,0.26)' }} title="Apenas visualização - Dados realizados"><FilterAlt sx={{ fontSize: 20 }} /></IconButton>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, bgcolor: 'rgba(0, 0, 0, 0.04)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isPlanejado && (
            <Checkbox 
              size="small" 
              checked={localData.length > 0 && selectedIds.length === localData.length} 
              onChange={(e) => setSelectedIds(e.target.checked ? localData.map((row: any) => row.id) : [])} 
              sx={{ color: hasSelection ? '#0072C3' : 'rgba(0,0,0,0.26)' }}
            />
          )}
        </Box>
        {['N° estabelecimento', 'Produtor', 'Distância (KM)', 'Transportadora', 'Total de KM'].map((col, i) => (
          <Typography key={i} sx={{ p: '10px 8px', fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>{col}</Typography>
        ))}
        {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia, i) => {
          return (
            <Box key={i} sx={{ p: '6px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, ...COMMON_FONT }}>
                {dia.substring(0, 3)}
              </Typography>
              <Typography sx={{ fontSize: 10, color: 'rgba(0,0,0,0.60)', ...COMMON_FONT }}>
                {format(addDays(start, i), 'dd/MM')}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {localData.map((row: any) => {
        const isSelected = isPlanejado && selectedIds.includes(row.id);
        const isEditing = isPlanejado && editingRowId === row.id;
        
        // Garante que os valores sejam numéricos para o cálculo
        const dist = Number(row.distancia ?? row.distanciaKm ?? row.km ?? 0);
        const viagens = (Number(row.seg)||0) + (Number(row.ter)||0) + (Number(row.qua)||0) + (Number(row.qui)||0) + (Number(row.sex)||0) + (Number(row.sab)||0) + (Number(row.dom)||0);
        const totalKm = Math.round(dist * viagens); // Arredonda para inteiro
        
        return (
          <Box 
            key={row.id} 
            onClick={() => handleRowClick(row.id)} 
            onDoubleClick={() => isPlanejado && !locked && setEditingRowId(row.id)} 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: gridLayout, 
              borderBottom: '1px solid rgba(0,0,0,0.08)', 
              bgcolor: isSelected ? 'rgba(0, 114, 195, 0.08)' : 'white', 
              alignItems: 'center', 
              cursor: isPlanejado ? 'pointer' : 'default',
              opacity: (!isPlanejado || locked) ? 0.8 : 1
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {isSelected && <Checkbox size="small" checked={true} sx={{ color: '#00518A' }} />}
            </Box>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.id}</Typography>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.produtor}</Typography>
            <Typography sx={{ p: '8px 8px', fontSize: 12, ...COMMON_FONT }}>{row.distancia} Km</Typography>
            <Box sx={{ p: '4px 8px' }}>
               {isEditing && !locked && isPlanejado ? (
                <Select 
                  size="small" 
                  value={row.transp} 
                  fullWidth 
                  onClick={(e) => e.stopPropagation()} 
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const newData = localData.map((r: any) => r.id === row.id ? { ...r, transp: newValue } : r);
                    setLocalData(newData);
                    onDataChange?.(newData); 
                  }} 
                  sx={{ height: 32, fontSize: 11 }}
                >
                  {transportadoras.map((t: string) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
               ) : <Typography sx={{ fontSize: 12, ...COMMON_FONT, color: (!isPlanejado || locked) ? 'rgba(0,0,0,0.5)' : 'inherit' }}>{row.transp}</Typography>}
            </Box>
            <Typography sx={{ p: '8px 8px', fontSize: 12, fontWeight: 600, ...COMMON_FONT }}>{totalKm} Km</Typography>
            {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map((day) => {
              return (
                <Box key={day} sx={{ p: '4px 4px', textAlign: 'center' }}>
                  {isEditing && !locked && isPlanejado ? (
                    <TextField
                      type="number"
                      size="small"
                      value={row[day]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        setLocalData((prev: any) => {
                          const updated = prev.map((r: any) => {
                            if (r.id === row.id) {
                              const newRow = { ...r, [day]: Math.max(0, parseInt(e.target.value) || 0) };
                              return newRow;
                            }
                            return r;
                          });
                          // Atualiza imediatamente o total de KM
                          onDataChange?.(updated);
                          return updated;
                        });
                      }}
                      onBlur={() => onDataChange?.(localData)}
                      onKeyDown={(e) => { if (e.key === 'Enter') onDataChange?.(localData); }}
                      sx={{ '& .MuiOutlinedInput-root': { height: 30, fontSize: 11 } }}
                    />
                  ) : (
                    <Typography 
                      sx={{ 
                        fontSize: 12, 
                        ...COMMON_FONT, 
                        color: (!isPlanejado || locked) ? 'rgba(0,0,0,0.5)' : 'inherit',
                        cursor: 'default'
                      }}
                      title={!isPlanejado ? 'Apenas visualização - Dados realizados' : (locked ? 'Semana atual ou passada - Somente leitura' : '')}
                    >
                      {row[day]}
                    </Typography>
                  )}
                </Box>
              );
            })}
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
            <Button variant="contained" onClick={async () => {
              if (onDeleteSelected) {
                try {
                  await onDeleteSelected(selectedIds);
                } catch (error) {
                  console.error('Erro ao limpar registros:', error);
                  return;
                }
              } else {
                const resetData = localData.map((r: any) => selectedIds.includes(r.id) ? { ...r, seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0, transp: '' } : r);
                onDataChange(resetData);
              }
              setIsDrawerOpen(false);
              setSelectedIds([]);
              onDeleteSuccess?.();
              setEditingRowId(null);
            }} sx={{ width: 280, height: 48, fontWeight: 600, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AgendaTable;