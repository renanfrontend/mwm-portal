import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AgendaTable from './AgendaTable'; 
import CopyPlanningDrawer from './CopyPlanningDrawer'; 
import { addDays, addWeeks, format, getDay, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import { AgendaService } from '../services/agendaService';
import { TransportadoraService } from '../services/transportadoraService';
import type { AgendaPlanejadaSemanaResponse } from '../types/agenda';

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
  onShowSuccess?: (title: string, message: string) => void;
}

export const AgendaList: React.FC<AgendaListProps> = ({ onShowSuccess }) => {
  const [realizadoDate, setRealizadoDate] = useState(new Date());
  const [planejadoDate, setPlanejadoDate] = useState(new Date());
  const [isCopyDrawerOpen, setIsCopyDrawerOpen] = useState(false);
  const [selectedIdsToCopy, setSelectedIdsToCopy] = useState<number[]>([]);

  const [planejadoRows, setPlanejadoRows] = useState<RowData[]>([]);
  const [transportadoras, setTransportadoras] = useState<string[]>([]);

  const [planejadoLoading, setPlanejadoLoading] = useState(false);

  const bioplantaId = 1;
  const filiadaId = 1;

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
        bioplantaId,
        filiadaId,
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );
      setPlanejadoRows(mapResponseToRows(response));
    } catch (err) {
      console.error('Erro ao carregar agenda planejada:', err);
      toast.error('Falha ao carregar a agenda planejada.');
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
      } catch (error) {
        console.error('Erro ao carregar transportadoras', error);
        toast.error('Erro ao carregar lista de transportadoras');
      }
    };
    fetchTransportadoras();
  }, []);

  const handleSuccess = (title: string, message: string) => {
    if (onShowSuccess) {
      onShowSuccess(title, message);
    }
  };

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

      if (isSameDay(appRange.start, startOfWeek(planejadoDate, { weekStartsOn: 0 }))) {
        fetchPlanejadoWeek(appRange.start, appRange.end);
      }
      
      const nextWeekFromView = addWeeks(startOfWeek(planejadoDate, { weekStartsOn: 0 }), 1);
      if (isSameDay(appRange.start, nextWeekFromView)) {
        const { start, end } = getWeekRange(planejadoDate);
        fetchPlanejadoWeek(start, end);
      }

      handleSuccess("Planejamento realizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
    } catch (err) {
      console.error('Erro ao copiar planejamento:', err);
      toast.error('Falha ao copiar o planejamento.');
    }
  };

  const handleDeleteSelected = async (ids: Array<string | number>) => {
    const { start, end } = getWeekRange(planejadoDate);
    const parsedIds = (ids || [])
      .map((id) => typeof id === 'number' ? id : parseInt(id, 10))
      .filter((id) => !Number.isNaN(id));

    try {
      await AgendaService.limparSemana({
        idBioplanta: bioplantaId,
        idFiliada: filiadaId,
        dataInicio: format(start, 'yyyy-MM-dd'),
        dataFim: format(end, 'yyyy-MM-dd'),
        idsEstabelecimentos: parsedIds
      });

      await fetchPlanejadoWeek(start, end);
      handleSuccess("Os dados do registro foram limpos com sucesso.", "As alterações foram salvas e já estão disponíveis no sistema.");
    } catch (err) {
      console.error('Erro ao limpar agenda:', err);
      toast.error('Falha ao limpar a agenda.');
      throw err;
    }
  };

  const handleUpdateWeekData = async (newData: RowData[]) => {
    const previousRows = new Map(planejadoRows.map((row) => [row.id, row]));
    const changes: { row: RowData; dayKey: DayKey; value: number }[] = [];

    newData.forEach((row) => {
      const previous = previousRows.get(row.id);
      if (row.transp && row.transp !== row.transportadora) {
          row.transportadora = row.transp;
      }
      const transportadoraMudou = previous && previous.transportadora !== row.transportadora;

      DAY_KEYS.forEach((dayKey) => {
        const previousValue = previous ? previous[dayKey] : 0;
        const nextValue = row[dayKey] || 0;
        if (previousValue !== nextValue || (transportadoraMudou)) {
          changes.push({ row, dayKey, value: nextValue });
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
      handleSuccess("Registro atualizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
    } catch (err) {
      console.error('Erro ao salvar agenda:', err);
      toast.error('Falha ao salvar a agenda.');
    }
  };

  const plannedData = planejadoLoading ? [] : planejadoRows;

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: '8px 16px', position: 'relative', overflowX: 'hidden' }}>
      <AgendaTable title="Realizado" referenceDate={realizadoDate} onDateChange={setRealizadoDate} data={[]} />
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
    </Box>
  );
};

export default AgendaList;