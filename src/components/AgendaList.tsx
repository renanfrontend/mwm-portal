import React, { useCallback, useEffect, useState } from 'react';
import { 
  Box, 
  Snackbar, 
  Typography, 
  IconButton,
} from '@mui/material';
import AgendaTable from './AgendaTable'; 
import CopyPlanningDrawer from './CopyPlanningDrawer'; 
import { addDays, addWeeks, format, getDay, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { AgendaService } from '../services/agendaService';
import { TransportadoraService } from '../services/transportadoraService';
import type { AgendaPlanejadaSemanaResponse } from '../types/agenda';

// ✅ Importação centralizada de ícones do seu projeto
import { 
  CheckCircleOutlined, 
  CloseIcon 
} from '../constants/muiIcons';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

type DayKey = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

interface RowData {
  id: number;
  idEstabelecimento: number;
  produtor: string;
  distancia: number;
  transportadora: string;
  transp: string;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
  dom: number;
}

const DAY_KEYS: DayKey[] = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const DAY_INDEX: Record<DayKey, number> = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6 };

interface AgendaListProps {
  onShowSuccess?: (title: string, message: string, severity?: 'success' | 'error') => void;
}

export const AgendaList: React.FC<AgendaListProps> = ({ onShowSuccess }) => {
  const [realizadoDate, setRealizadoDate] = useState(new Date());
  const [planejadoDate, setPlanejadoDate] = useState(new Date());
  const [isCopyDrawerOpen, setIsCopyDrawerOpen] = useState(false);
  const [selectedIdsToCopy, setSelectedIdsToCopy] = useState<number[]>([]);
  const [planejadoRows, setPlanejadoRows] = useState<RowData[]>([]);
  const [transportadoras, setTransportadoras] = useState<string[]>([]);
  const [planejadoLoading, setPlanejadoLoading] = useState(false);

  // ✅ Estado do Snackbar Local para Células
  const [snackbar, setSnackbar] = useState({ open: false, title: '', message: '' });

  const bioplantaId = 1;
  const filiadaId = 1;

  const handleCloseSnackbar = (_?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getWeekRange = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = addDays(start, 6);
    return { start, end };
  };

  const mapResponseToRows = (response: AgendaPlanejadaSemanaResponse): RowData[] => {
    return (response.linhas || []).map((linha) => {
      const dias: Record<DayKey, number> = { seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0, dom: 0 };
      (linha.dias || []).forEach((dia) => {
        const dayIndex = getDay(parseISO(dia.dataAgendada));
        const dayKey = DAY_KEYS[dayIndex];
        if (dayKey) dias[dayKey] = dia.qtdViagens || 0;
      });
      return {
        id: linha.idEstabelecimento,
        idEstabelecimento: linha.idEstabelecimento,
        produtor: linha.produtor,
        distancia: linha.distanciaKm ?? 0,
        transportadora: linha.transportadora || '',
        transp: linha.transportadora || '',
        ...dias
      };
    });
  };

  const fetchPlanejadoWeek = useCallback(async (start: Date, end: Date) => {
    setPlanejadoLoading(true);
    try {
      const response = await AgendaService.listPlanejadoSemana(
        bioplantaId, filiadaId,
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );
      setPlanejadoRows(mapResponseToRows(response));
    } catch (err) {
      setPlanejadoRows([]);
    } finally {
      setPlanejadoLoading(false);
    }
  }, [bioplantaId, filiadaId]);

  const handlePlanejadoDateChange = useCallback((newDate: Date) => {
    const { start, end } = getWeekRange(newDate);
    setPlanejadoDate(newDate);
    fetchPlanejadoWeek(start, end);
  }, [fetchPlanejadoWeek]);

  useEffect(() => {
    handlePlanejadoDateChange(planejadoDate);
  }, [handlePlanejadoDateChange]);

  useEffect(() => {
    const fetchTransportadoras = async () => {
      try {
        const response = await TransportadoraService.list(1, 100);
        const names = response.items.map(t => t.nomeFantasia || t.razaoSocial).sort();
        setTransportadoras(names);
      } catch (error) { console.error(error); }
    };
    fetchTransportadoras();
  }, []);

  const handleApplyCopy = async (refDate: Date, appDate: Date) => {
    try {
      const refRange = getWeekRange(refDate);
      const appRange = getWeekRange(appDate);

      await AgendaService.copiarSemana({
        idBioplanta: bioplantaId,
        idFiliada: filiadaId,
        dataInicioOrigem: format(refRange.start, 'yyyy-MM-dd'),
        dataInicioDestino: format(appRange.start, 'yyyy-MM-dd'),
        idsEstabelecimentos: selectedIdsToCopy
      });

      const currentViewStart = startOfWeek(planejadoDate, { weekStartsOn: 0 });
      if (isSameDay(appRange.start, currentViewStart) || isSameDay(appRange.start, addWeeks(currentViewStart, 1))) {
        fetchPlanejadoWeek(getWeekRange(planejadoDate).start, getWeekRange(planejadoDate).end);
      }

      if (onShowSuccess) onShowSuccess("Registro atualizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
    } catch (err) {
      if (onShowSuccess) onShowSuccess("Falha na operação", "Erro ao copiar dados.", "error");
    }
  };

  const handleDeleteSelected = async (ids: Array<string | number>) => {
    const { start, end } = getWeekRange(planejadoDate);
    const parsedIds = (ids || []).map(id => typeof id === 'number' ? id : parseInt(id, 10)).filter(id => !isNaN(id));

    try {
      await AgendaService.limparSemana({
        idBioplanta: bioplantaId,
        idFiliada: filiadaId,
        dataInicio: format(start, 'yyyy-MM-dd'),
        dataFim: format(end, 'yyyy-MM-dd'),
        idsEstabelecimentos: parsedIds
      });

      await fetchPlanejadoWeek(start, end);
      if (onShowSuccess) onShowSuccess("Registro excluído com sucesso", "O registro foi removido e não está mais disponível no sistema.");
    } catch (err) {
      if (onShowSuccess) onShowSuccess("Erro ao excluir", "Falha ao limpar dados da agenda.", "error");
    }
  };

  const handleUpdateWeekData = async (newData: RowData[]) => {
    const previousRows = new Map(planejadoRows.map((row) => [row.id, row]));
    const changes: { row: RowData; dayKey: DayKey; value: number }[] = [];

    newData.forEach((row) => {
      const previous = previousRows.get(row.id);
      if (row.transp && row.transp !== row.transportadora) row.transportadora = row.transp;
      const transportadoraMudou = previous && previous.transportadora !== row.transportadora;

      DAY_KEYS.forEach((dayKey) => {
        const prevVal = previous ? previous[dayKey] : 0;
        const nextVal = row[dayKey] || 0;
        if (prevVal !== nextVal || transportadoraMudou) {
          changes.push({ row, dayKey, value: nextVal });
        }
      });
    });

    setPlanejadoRows(newData);
    if (changes.length === 0) return;

    const { start } = getWeekRange(planejadoDate);

    try {
      await Promise.all(
        changes.map((change) =>
          AgendaService.savePlanejadoDia({
            idBioplanta: bioplantaId,
            idFiliada: filiadaId,
            idEstabelecimento: change.row.idEstabelecimento,
            produtor: change.row.produtor,
            distanciaKm: change.row.distancia,
            transportadora: change.row.transportadora || null,
            dataAgendada: format(addDays(start, DAY_INDEX[change.dayKey]), 'yyyy-MM-dd'),
            qtdViagens: change.value
          })
        )
      );
      
      // ✅ Ativa o Snackbar flutuante (não reseta scroll)
      setSnackbar({
        open: true,
        title: "Registro atualizado com sucesso",
        message: "As alterações foram salvas e já estão disponíveis no sistema."
      });

    } catch (err) {
      console.error('Erro ao salvar célula');
    }
  };

  const plannedData = planejadoLoading ? [] : planejadoRows;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: '8px 16px', position: 'relative', overflowX: 'hidden' }}>
      <AgendaTable 
        title="Realizado" 
        referenceDate={realizadoDate} 
        onDateChange={setRealizadoDate} 
        data={[]} 
        disableNext={false}
      />

      <AgendaTable
        title="Planejado"
        referenceDate={planejadoDate}
        onDateChange={handlePlanejadoDateChange}
        data={plannedData}
        transportadoras={transportadoras}
        onDataChange={handleUpdateWeekData}
        onDeleteSelected={handleDeleteSelected}
        onCopyClick={(ids: string[]) => {
          const validIds = (ids || []).map(id => parseInt(id, 10)).filter(n => !isNaN(n));
          setSelectedIdsToCopy(validIds);
          setIsCopyDrawerOpen(true);
        }}
        showCopy={true}
        disableNext={false}
      />
      <CopyPlanningDrawer open={isCopyDrawerOpen} onClose={() => setIsCopyDrawerOpen(false)} onApply={handleApplyCopy} />

      {/* ✅ Snackbar com Estilo de Referência (Cores #F1F9EE e #2F5023) */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box sx={{ 
          display: 'flex', 
          bgcolor: '#F1F9EE', 
          borderRadius: '4px', 
          border: '1px solid rgba(112, 191, 84, 0.2)', // Bordas suaves de sucesso
          p: '6px 16px',
          alignItems: 'center',
          minWidth: 350,
          boxShadow: '0px 3px 10px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', mr: 2 }}>
             <CheckCircleOutlined sx={{ color: '#70BF54', fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#2F5023', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500, lineHeight: '24px' }}>
              {snackbar.title}
            </Typography>
            <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED, fontWeight: 400, lineHeight: '20px' }}>
              {snackbar.message}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleCloseSnackbar} sx={{ ml: 1, color: '#2F5023' }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default AgendaList;