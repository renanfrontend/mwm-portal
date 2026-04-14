import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getWeek, addMonths, subMonths, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

export interface CalendarTableProps {
  title?: string;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  tempWeekStart: Date | null;
  onWeekSelect: (weekStart: Date) => void;
  onConfirm: (weekStart: Date) => void;
  onCancel?: () => void;
}

export const CalendarTable: React.FC<CalendarTableProps> = ({ 
  title, 
  currentMonth, 
  onMonthChange, 
  tempWeekStart, 
  onWeekSelect, 
  onConfirm,
  onCancel
}) => {
  const getCalendarGrid = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start, end });
    const rows = [];
    for (let i = 0; i < allDays.length; i += 7) rows.push(allDays.slice(i, i + 7));
    return rows;
  };
  const grid = getCalendarGrid(currentMonth);

  // Determinar se um dia está dentro da semana temporária selecionada
  const isDayInTempRange = (day: Date): boolean => {
    if (!tempWeekStart) return false;
    const weekEnd = endOfWeek(tempWeekStart, { weekStartsOn: 0 });
    return isWithinInterval(day, { start: tempWeekStart, end: weekEnd });
  };



  return (
    <Box sx={{ width: 360, p: 2 }}>
      {title && <Typography sx={{ fontSize: 20, fontWeight: 700, ...COMMON_FONT, textAlign: 'center', mb: 2 }}>{title}</Typography>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
        <Typography sx={{ fontWeight: 500, fontSize: 16, ...COMMON_FONT, textTransform: 'capitalize' }}>{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</Typography>
        <Box>
          <IconButton size="small" onClick={() => onMonthChange(subMonths(currentMonth, 1))}><ChevronLeft fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => onMonthChange(addMonths(currentMonth, 1))}><ChevronRight fontSize="small" /></IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px', mb: 3 }}>
        {grid.map((weekDays, idx) => {
          const weekStart = startOfWeek(weekDays[0], { weekStartsOn: 0 });
          const isWeekSelected = tempWeekStart && isSameDay(tempWeekStart, weekStart);
          return (
            <React.Fragment key={idx}>
              <Box 
                onClick={() => onWeekSelect(weekStart)} 
                sx={{ 
                  height: 36, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '100px', 
                  cursor: 'pointer', 
                  bgcolor: isWeekSelected ? '#66AE4C' : 'transparent', 
                  color: isWeekSelected ? 'white' : 'rgba(0,0,0,0.38)',
                  fontWeight: isWeekSelected ? 700 : 400
                }}
              >
                <Typography sx={{ fontSize: 13, ...COMMON_FONT, pointerEvents: 'none' }}>{getWeek(weekDays[0])}</Typography>
              </Box>
               {weekDays.map((day, dIdx) => (
                 <Box 
                   key={dIdx}
                   onClick={() => onWeekSelect(startOfWeek(day, { weekStartsOn: 0 }))}
                   sx={{ 
                     height: 36, 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     borderRadius: '100px',
                     cursor: 'pointer',
                     bgcolor: isDayInTempRange(day) ? '#0072C3' : 'transparent', 
                     color: isDayInTempRange(day) ? 'white' : (isSameMonth(day, currentMonth) ? 'black' : 'rgba(0,0,0,0.1)'),
                     fontWeight: isDayInTempRange(day) ? 700 : 400
                   }}
                 >
                  <Typography sx={{ fontSize: 13, ...COMMON_FONT, pointerEvents: 'none' }}>{format(day, 'd')}</Typography>
                </Box>
              ))}
            </React.Fragment>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography 
          onClick={onCancel}
          sx={{ fontSize: '11px', color: '#0072C3', cursor: 'pointer', '&:hover': { color: '#005a99' } }}
        >
          Cancelar
        </Typography>
        <Typography 
          onClick={() => tempWeekStart && onConfirm(tempWeekStart)}
          sx={{ fontSize: '11px', color: '#0072C3', cursor: 'pointer', fontWeight: 500, '&:hover': { color: '#005a99' } }}
        >
          OK
        </Typography>
      </Box>
    </Box>
  );
};
