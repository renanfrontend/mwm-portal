import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getWeek, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

import { ptBR } from 'date-fns/locale';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

const CalendarTable = ({ title, currentMonth, onMonthChange, selectedWeekStart, onSelect }: any) => {
  const getCalendarGrid = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start, end });
    const rows = [];
    for (let i = 0; i < allDays.length; i += 7) rows.push(allDays.slice(i, i + 7));
    return rows;
  };
  const grid = getCalendarGrid(currentMonth);
  // const today = startOfDay(new Date());


  return (
    <Box sx={{ width: 320 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 700, ...COMMON_FONT, textAlign: 'center', mb: 3 }}>{title}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, ...COMMON_FONT, textTransform: 'capitalize' }}>{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</Typography>
        <Box><IconButton size="small" onClick={() => onMonthChange(subMonths(currentMonth, 1))}><ChevronLeft fontSize="small" /></IconButton><IconButton size="small" onClick={() => onMonthChange(addMonths(currentMonth, 1))}><ChevronRight fontSize="small" /></IconButton></Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px' }}>
        {grid.map((weekDays, idx) => {
          const weekStart = startOfWeek(weekDays[0], { weekStartsOn: 0 });
          return (
            <React.Fragment key={idx}>
              <Box onClick={() => onSelect(weekStart)} sx={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px', cursor: 'pointer', bgcolor: selectedWeekStart && isSameDay(selectedWeekStart, weekStart) ? '#66AE4C' : 'transparent', color: selectedWeekStart && isSameDay(selectedWeekStart, weekStart) ? 'white' : 'rgba(0,0,0,0.38)' }}><Typography sx={{ fontSize: 13, ...COMMON_FONT }}>{getWeek(weekDays[0])}</Typography></Box>
              {weekDays.map((day, dIdx) => (
                <Box key={dIdx} sx={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px', bgcolor: selectedWeekStart && isSameDay(startOfWeek(day), selectedWeekStart) ? '#0072C3' : 'transparent', color: isSameMonth(day, currentMonth) ? 'black' : 'rgba(0,0,0,0.1)' }}><Typography sx={{ fontSize: 13, ...COMMON_FONT }}>{format(day, 'd')}</Typography></Box>
              ))}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

const CopyPlanningDrawer: React.FC<any> = ({ open, onClose, onApply }) => {
  const [view, setView] = useState<'calendar' | 'confirm'>('calendar');
  const [refWeekStart, setRefWeekStart] = useState<Date | null>(null);
  const [appWeekStart, setAppWeekStart] = useState<Date | null>(null);
  const [refMonth, setRefMonth] = useState(new Date());
  const [appMonth, setAppMonth] = useState(new Date());

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 999999 }} PaperProps={{ sx: { width: view === 'calendar' ? 772 : 620 } }}>
      
      {/* 🛡️ HEADER GLOBAL: Ícone acima do título isolado */}
      <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
          <IconButton onClick={onClose} sx={{ p: 0 }}><CloseIcon /></IconButton>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT, lineHeight: 1.1, textTransform: 'uppercase' }}>COPIAR PLANEJAMENTO</Typography>
          <Typography sx={{ fontSize: 16, mt: 0.5, ...COMMON_FONT }}>Sincronização de agenda semanal</Typography>
        </Box>
      </Box>

      {view === 'calendar' ? (
        <Box sx={{ px: '32px', pb: '32px' }}>
          <Typography sx={{ fontSize: 18, mt: 1, ...COMMON_FONT, textAlign: 'justify', lineHeight: '28px' }}>Selecione as semanas de referência e aplicação abaixo.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <CalendarTable title="Referência" currentMonth={refMonth} onMonthChange={setRefMonth} selectedWeekStart={refWeekStart} onSelect={setRefWeekStart} />
            <CalendarTable title="Aplicação" currentMonth={appMonth} onMonthChange={setAppMonth} selectedWeekStart={appWeekStart} onSelect={setAppWeekStart} />
          </Box>
          <Button fullWidth variant="contained" disabled={!refWeekStart || !appWeekStart} onClick={() => setView('confirm')} sx={{ height: 48, bgcolor: '#0072C3', mt: 4, fontWeight: 600, ...COMMON_FONT }}>APLICAR</Button>
        </Box>
      ) : (
        <Box sx={{ px: '32px', pb: '32px' }}>
          <Typography sx={{ fontSize: 18, mt: 2, mb: 4, ...COMMON_FONT }}>Deseja confirmar a cópia do planejamento?</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}><Button variant="outlined" fullWidth onClick={() => setView('calendar')} sx={{ height: 48, ...COMMON_FONT }}>NÃO</Button><Button variant="contained" fullWidth onClick={() => { onApply(refWeekStart, appWeekStart); onClose(); }} sx={{ height: 48, bgcolor: '#0072C3', ...COMMON_FONT }}>SIM</Button></Box>
        </Box>
      )}
    </Drawer>
  );
};

export default CopyPlanningDrawer;