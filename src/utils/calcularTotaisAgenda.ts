// Função pura para calcular totais das colunas do grid AgendaTable
// Recebe um array de AgendaRow e retorna um objeto com os totais das colunas relevantes
import type { AgendaRow } from '../types/AgendaRow';

export interface TotaisAgenda {
  totalKm: number;
  dom: number;
  seg: number;
  ter: number;
  qua: number;
  qui: number;
  sex: number;
  sab: number;
}

export function calcularTotaisAgenda(rows: AgendaRow[]): TotaisAgenda {
  return rows.reduce(
    (acc, row) => {
      const dist = Number(row.distancia ?? row.distanciaKm ?? row.km ?? 0);
      const viagens =
        (Number(row.seg) || 0) +
        (Number(row.ter) || 0) +
        (Number(row.qua) || 0) +
        (Number(row.qui) || 0) +
        (Number(row.sex) || 0) +
        (Number(row.sab) || 0) +
        (Number(row.dom) || 0);
      acc.totalKm += Math.round(dist * viagens);
      acc.dom += Number(row.dom) || 0;
      acc.seg += Number(row.seg) || 0;
      acc.ter += Number(row.ter) || 0;
      acc.qua += Number(row.qua) || 0;
      acc.qui += Number(row.qui) || 0;
      acc.sex += Number(row.sex) || 0;
      acc.sab += Number(row.sab) || 0;
      return acc;
    },
    { totalKm: 0, dom: 0, seg: 0, ter: 0, qua: 0, qui: 0, sex: 0, sab: 0 }
  );
}
