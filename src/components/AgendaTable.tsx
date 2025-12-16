// src/components/AgendaTable.tsx

import React, { useState } from 'react';
import { MdEdit, MdCheckCircle, MdFactCheck } from 'react-icons/md';
import type { AgendaData } from '../services/api';
import useTheme from '../hooks/useTheme';
import { toast } from 'react-toastify';

interface Props {
  data: AgendaData[];
  isDeleteMode: boolean;
  selectedItems: (string | number)[];
  onSelectItem: (id: number | string) => void; // Ajustado para aceitar string ou number
  onConfirmDelete?: () => void; // <--- ADICIONADO PARA CORRIGIR O ERRO
  onUpdateItem?: (id: number, field: string, value: number) => void;
  readOnly?: boolean;
  showActions?: boolean;
}

const quantityOptions = [0, 1, 2, 3, 4, 5, 10];

export const AgendaTable: React.FC<Props> = ({ 
  data, 
  isDeleteMode, 
  selectedItems, 
  onSelectItem,
  onUpdateItem,
  readOnly = false,
  showActions = true
}) => {
  const { theme } = useTheme();
  
  const [editingCell, setEditingCell] = useState<{ id: number, field: string } | null>(null);
  const todayIndex = new Date().getDay(); 

  const dayColumns = [
    { key: 'seg', label: 'Seg', dayIdx: 1 },
    { key: 'ter', label: 'Ter', dayIdx: 2 },
    { key: 'qua', label: 'Qua', dayIdx: 3 },
    { key: 'qui', label: 'Qui', dayIdx: 4 },
    { key: 'sex', label: 'Sex', dayIdx: 5 },
    { key: 'sab', label: 'Sáb', dayIdx: 6 },
    { key: 'dom', label: 'Dom', dayIdx: 0 },
  ];

  const handleDoubleClick = (item: AgendaData, colKey: string, dayIdx: number) => {
      if (readOnly) return;
      if (todayIndex > dayIdx && todayIndex !== 0 && dayIdx !== 0) { 
           toast.warning("Não é possível alterar data retroativa.");
           return;
      }
      setEditingCell({ id: item.id, field: colKey });
  };

  const handleBlur = () => { setEditingCell(null); };

  const handleChange = (id: number, field: string, value: string) => {
      if (onUpdateItem) onUpdateItem(id, field, Number(value));
      setEditingCell(null);
  };

  const totals = dayColumns.reduce((acc, col) => {
      acc[col.key] = data.reduce((sum, item) => sum + (Number(item[col.key as keyof typeof item]) || 0), 0);
      return acc;
  }, {} as Record<string, number>);
  const totalQtd = data.reduce((sum, item) => sum + (item.qtd || 0), 0);
  const totalKm = data.reduce((sum, item) => sum + (item.km || 0), 0);

  return (
    <div className="table-container">
      <table className={`table is-hoverable is-fullwidth is-size-7 ${theme === 'dark' ? 'is-dark' : ''}`} style={{ tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '0' }}>
        <thead>
          <tr className="has-background-white-ter has-text-grey">
            {isDeleteMode && <th style={{ width: '40px' }}></th>}
            <th className="has-text-weight-normal" style={{ width: '20%' }}>Cooperado</th>
            {dayColumns.map(col => (
                <th key={col.key} className="has-text-centered has-text-weight-normal" style={{ width: '5%' }}>{col.label}</th>
            ))}
            <th className="has-text-centered has-text-weight-normal" style={{ width: '6%' }}>Qtd.</th>
            <th className="has-text-centered has-text-weight-normal" style={{ width: '6%' }}>KM</th>
            <th className="has-text-centered has-text-weight-normal" style={{ width: '15%' }}>Transportadora</th>
            <th className="has-text-centered has-text-weight-normal" style={{ width: '13%' }}>Status</th>
            {showActions && <th className="has-text-centered has-text-weight-normal" style={{ width: '6%' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            let rowStyle: React.CSSProperties = { verticalAlign: 'middle' };
            let textClass = "";

            if (readOnly) {
                if (item.qtd < 5) {
                    rowStyle = { ...rowStyle, backgroundColor: '#FEF2F2', color: '#991B1B' }; 
                    textClass = "has-text-weight-bold";
                } else {
                    rowStyle = { ...rowStyle, backgroundColor: '#FFFBEB', color: '#92400E' }; 
                    textClass = "has-text-weight-medium";
                }
            } else {
                textClass = "has-text-weight-medium";
                rowStyle = { ...rowStyle, color: '#2b2b2b' };
            }

            return (
            <tr key={item.id} style={rowStyle} className={textClass}>
              {isDeleteMode && (
                <td className="is-vcentered">
                  <label className="checkbox"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => onSelectItem(item.id)} style={{ transform: 'scale(1.2)' }} /></label>
                </td>
              )}
              
              <td className="is-vcentered" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'inherit' }} title={item.cooperado}>
                  {item.cooperado}
              </td>

              {dayColumns.map((col) => {
                  const isEditing = editingCell?.id === item.id && editingCell?.field === col.key;
                  const value = item[col.key as keyof typeof item] || 0;
                  
                  return (
                    <td 
                        key={col.key} 
                        className={`has-text-centered p-1 is-vcentered`}
                        onDoubleClick={() => handleDoubleClick(item, col.key, col.dayIdx)}
                        style={{ cursor: !readOnly ? 'pointer' : 'default', color: 'inherit' }}
                    >
                        {isEditing ? (
                            <div className="select is-small is-fullwidth" style={{ height: '26px', minHeight: '26px' }}>
                                <select value={value} onChange={(e) => handleChange(item.id, col.key, e.target.value)} onBlur={handleBlur} autoFocus style={{ padding: '0', fontSize: '0.75rem', textAlign: 'center', border: '1px solid #3273dc' }}>
                                    {quantityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        ) : (<span>{value}</span>)}
                    </td>
                  );
              })}

              <td className="has-text-centered is-vcentered has-text-weight-bold" style={{ color: 'inherit' }}>{item.qtd}</td>
              <td className="has-text-centered is-vcentered" style={{ color: 'inherit' }}>{item.km}</td>
              <td className="has-text-centered is-vcentered" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'inherit' }}>{item.transportadora}</td>
              
              <td className="has-text-centered is-vcentered px-2">
                  <div 
                    style={{ 
                        backgroundColor: item.status === 'Realizado' ? '#F0FDF4' : '#EFF6FF', 
                        color: item.status === 'Realizado' ? '#166534' : '#1E40AF',
                        border: `1px solid ${item.status === 'Realizado' ? '#BBF7D0' : '#BFDBFE'}`, 
                        borderRadius: '4px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        width: '100%',
                        whiteSpace: 'nowrap'
                    }}
                  >
                      <span style={{ display: 'flex', marginRight: '6px' }}>
                          {item.status === 'Realizado' ? <MdCheckCircle size={16} /> : <MdFactCheck size={16} />}
                      </span>
                      {item.status}
                  </div>
              </td>

              {showActions && (
                  <td className="has-text-centered is-vcentered">
                      <button className="button is-small is-white" title="Editar"><span className="icon"><MdEdit /></span></button>
                  </td>
              )}
            </tr>
          );
          })}
          
          <tr className="has-background-white-ter has-text-weight-bold" style={{ borderTop: '2px solid #dbdbdb' }}>
              {isDeleteMode && <td></td>}
              <td>Total Geral</td>
              {dayColumns.map(col => (
                  <td key={col.key} className="has-text-centered">{totals[col.key]}</td>
              ))}
              <td className="has-text-centered">{totalQtd}</td>
              <td className="has-text-centered">{totalKm}</td>
              <td colSpan={showActions ? 3 : 2}></td> 
          </tr>
        </tbody>
      </table>
    </div>
  );
};