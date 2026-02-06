import React, { useState, useMemo } from 'react';
import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, getWeek, addMonths, subMonths, isSameMonth, isSameDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const CopyPlanningDrawer: React.FC<any> = ({ open, onClose, onApply }) => {
  // 🛡️ NAVEGAÇÃO INDEPENDENTE: Dois estados de mês separados
  const [refMonth, setRefMonth] = useState(new Date());
  const [appMonth, setAppMonth] = useState(new Date());
  
  const [view, setView] = useState<'calendar' | 'confirm'>('calendar');
  const [refWeekStart, setRefWeekStart] = useState<Date | null>(null);
  const [appWeekStart, setAppWeekStart] = useState<Date | null>(null);

  const today = new Date();

  // Função para gerar o grid baseado no mês recebido
  const getCalendarGrid = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const allDays = eachDayOfInterval({ start, end });
    const rows = [];
    for (let i = 0; i < allDays.length; i += 7) rows.push(allDays.slice(i, i + 7));
    return rows;
  };

  const CalendarTable = ({ title, currentMonth, onMonthChange, selectedWeekStart, onSelect }: any) => {
    const grid = getCalendarGrid(currentMonth);
    return (
      <Box sx={{ width: 320 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, ...COMMON_FONT, textAlign: 'center', mb: 3 }}>{title}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 16, ...COMMON_FONT, textTransform: 'capitalize' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => onMonthChange(subMonths(currentMonth, 1))}><ChevronLeft fontSize="small" /></IconButton>
            <IconButton size="small" onClick={() => onMonthChange(addMonths(currentMonth, 1))}><ChevronRight fontSize="small" /></IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', mb: 1 }}>
          {['#', 'S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <Typography key={d} sx={{ textAlign: 'center', fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>{d}</Typography>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px' }}>
          {grid.map((weekDays, idx) => {
            const weekNum = getWeek(weekDays[0], { weekStartsOn: 1 });
            const weekStart = startOfWeek(weekDays[0], { weekStartsOn: 1 });
            const isWeekSelected = selectedWeekStart && isSameDay(selectedWeekStart, weekStart);

            return (
              <React.Fragment key={idx}>
                <Box onClick={() => onSelect(isWeekSelected ? null : weekStart)} sx={{ 
                  height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px', cursor: 'pointer', 
                  bgcolor: isWeekSelected ? '#66AE4C' : 'transparent', color: isWeekSelected ? 'white' : 'rgba(0,0,0,0.38)' 
                }}>
                  <Typography sx={{ fontSize: 13, ...COMMON_FONT }}>{weekNum}</Typography>
                </Box>
                {weekDays.map((day, dIdx) => {
                  const isDayInSelectedWeek = selectedWeekStart && isSameDay(startOfWeek(day, { weekStartsOn: 1 }), selectedWeekStart);
                  const isToday = isSameDay(day, today);
                  return (
                    <Box key={dIdx} sx={{ 
                      height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px',
                      bgcolor: isDayInSelectedWeek ? '#0072C3' : (isToday ? 'rgba(0,0,0,0.08)' : 'transparent'),
                      color: isDayInSelectedWeek ? 'white' : (isSameMonth(day, currentMonth) ? 'black' : 'rgba(0,0,0,0.2)'),
                      border: isToday ? '1px solid rgba(0,0,0,0.15)' : 'none'
                    }}>
                      <Typography sx={{ fontSize: 13, ...COMMON_FONT }}>{format(day, 'd')}</Typography>
                    </Box>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => { onClose(); setView('calendar'); }} sx={{ zIndex: 999999 }} PaperProps={{ sx: { width: view === 'calendar' ? 772 : 620 } }}>
      {view === 'calendar' ? (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white', p: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT, textTransform: 'uppercase' }}>COPIAR PLANEJAMENTO</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 500, ...COMMON_FONT, mt: 3, textAlign: 'justify', lineHeight: '32px' }}>
                Selecione a semana que deseja copiar no calendário de referência e, em seguida, escolha no calendário de aplicação a semana em que as informações serão coladas.
              </Typography>
            </Box>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <CalendarTable title="Referência" currentMonth={refMonth} onMonthChange={setRefMonth} selectedWeekStart={refWeekStart} onSelect={setRefWeekStart} />
            <CalendarTable title="Aplicação" currentMonth={appMonth} onMonthChange={setAppMonth} selectedWeekStart={appWeekStart} onSelect={setAppWeekStart} />
          </Box>
          <Button fullWidth variant="contained" disabled={!refWeekStart || !appWeekStart} onClick={() => setView('confirm')} sx={{ height: 48, bgcolor: '#0072C3', fontWeight: 600 }}>APLICAR</Button>
        </Box>
      ) : (
        <Box sx={{ p: '32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography sx={{ fontSize: 32, fontWeight: 700, ...COMMON_FONT }}>COPIAR PLANEJAMENTO</Typography>
            <IconButton onClick={() => setView('calendar')}><CloseIcon /></IconButton>
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 500, ...COMMON_FONT, textAlign: 'justify', lineHeight: '32px', mb: 5 }}>
            Ao confirmar a cópia do planejamento, essa ação será irreversível. Deseja continuar?
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setView('calendar')} sx={{ width: 280, height: 48, fontWeight: 600, color: '#0072C3', borderColor: 'rgba(0,114,195,0.5)' }}>NÃO</Button>
            <Button variant="contained" onClick={() => { 
                if(refWeekStart && appWeekStart) onApply(refWeekStart, appWeekStart); 
                onClose(); 
                setView('calendar'); 
            }} sx={{ width: 280, height: 48, fontWeight: 600, bgcolor: '#0072C3' }}>SIM</Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default CopyPlanningDrawer;