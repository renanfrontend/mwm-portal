import React, { useState } from 'react';
import { Box, Collapse, Typography, IconButton, Portal } from '@mui/material';
import { CheckCircleOutlined, Close as CloseIcon } from '@mui/icons-material';
import AgendaTable from './AgendaTable'; 
import CopyPlanningDrawer from './CopyPlanningDrawer'; 
import { addWeeks, startOfWeek, format } from 'date-fns';

const COMMON_FONT = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

interface RowData {
  id: string; produtor: string; distancia: number; transp: string;
  seg: number; ter: number; qua: number; qui: number; sex: number; sab: number; dom: number;
}

export const AgendaList: React.FC = () => {
  const [realizadoDate, setRealizadoDate] = useState(new Date());
  const [planejadoDate, setPlanejadoDate] = useState(addWeeks(new Date(), 1));
  const [showSuccess, setShowSuccess] = useState(false);
  const [successConfig, setSuccessConfig] = useState({ title: '', message: '' });
  const [isCopyDrawerOpen, setIsCopyDrawerOpen] = useState(false);

  const [weeklyData, setWeeklyData] = useState<Record<string, RowData[]>>({
    [format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')]: [
      { id: '000000000000', produtor: 'Giovanna Albuquerque', distancia: 58, transp: 'Expresso São Miguel', seg: 2, ter: 1, qua: 0, qui: 3, sex: 0, sab: 0, dom: 0 },
      { id: '000000000001', produtor: 'Marcos Oliveira', distancia: 42, transp: 'LogBras', seg: 0, ter: 2, qua: 2, qui: 0, sex: 1, sab: 0, dom: 0 },
    ]
  });

  const getDataForWeek = (date: Date) => {
    const key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    return weeklyData[key] || [
      { id: '000000000000', produtor: 'Giovanna Albuquerque', distancia: 58, transp: '', seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 },
      { id: '000000000001', produtor: 'Marcos Oliveira', distancia: 42, transp: '', seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 },
    ];
  };

  const handleUpdateWeekData = (date: Date, newData: RowData[]) => {
    const key = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    setWeeklyData(prev => ({ ...prev, [key]: [...newData] }));
  };

  const handleSuccess = (title: string, message: string) => {
    setSuccessConfig({ title, message });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 8000);
  };

  const handleApplyCopy = (refDate: Date, appDate: Date) => {
    const refKey = format(startOfWeek(refDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const appKey = format(startOfWeek(appDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const sourceData = weeklyData[refKey] || getDataForWeek(refDate);
    setWeeklyData(prev => ({ ...prev, [appKey]: sourceData.map(row => ({ ...row })) }));
    handleSuccess("Planejamento realizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: '8px 16px', position: 'relative', overflowX: 'hidden' }}>
      <Portal>
        <Box sx={{ position: 'fixed', top: '140px', left: '296px', right: '24px', zIndex: 999999, pointerEvents: showSuccess ? 'auto' : 'none' }}>
          <Collapse in={showSuccess}>
            <Box sx={{ p: '12px 16px', borderRadius: '4px', bgcolor: '#F1F9EE', display: 'flex', alignItems: 'flex-start', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
              <Box sx={{ pt: '4px', pr: '12px' }}><CheckCircleOutlined sx={{ color: '#70BF54', fontSize: 24 }} /></Box>
              <Box sx={{ flex: 1, pt: '4px', pb: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography sx={{ color: '#2F5023', fontSize: 16, fontWeight: 500, ...COMMON_FONT }}>{successConfig.title}</Typography>
                <Typography sx={{ color: '#2F5023', fontSize: 14, ...COMMON_FONT, opacity: 0.9 }}>{successConfig.message}</Typography>
              </Box>
              <IconButton onClick={() => setShowSuccess(false)} size="small" sx={{ color: '#2F5023' }}><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
            </Box>
          </Collapse>
        </Box>
      </Portal>

      <AgendaTable title="Realizado" referenceDate={realizadoDate} onDateChange={setRealizadoDate} data={getDataForWeek(realizadoDate)} />
      <AgendaTable title="Planejado" referenceDate={planejadoDate} onDateChange={setPlanejadoDate} data={getDataForWeek(planejadoDate)} onDataChange={(newData: any) => handleUpdateWeekData(planejadoDate, newData)} onDeleteSuccess={() => handleSuccess("Os dados do registro foram limpos com sucesso.", "As alterações foram salvas e já estão disponíveis no sistema.")} onCopyClick={() => setIsCopyDrawerOpen(true)} showCopy={true} />
      <CopyPlanningDrawer open={isCopyDrawerOpen} onClose={() => setIsCopyDrawerOpen(false)} onApply={handleApplyCopy} />
    </Box>
  );
};

export default AgendaList;