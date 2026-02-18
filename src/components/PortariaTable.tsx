import React from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const PortariaTable: React.FC<any> = ({ data, selectedIds, onSelectionChange, isHistory, onEdit, onView }) => {
  // 🛡️ GRID LAYOUT: Proporcional ao Figma (Elimina espaços vazios)
  // Checkbox | Data | Hora | [Responsável] | Atividade | Nome | Placa | Status | Ações
  const gridLayout = isHistory 
    ? `48px 110px 80px 1.2fr 1fr 1.5fr 100px 150px 80px` // 🛡️ 'fr' faz as colunas crescerem
    : `48px 110px 80px 1fr 1.5fr 110px 180px 100px`;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: gridLayout, 
        bgcolor: 'rgba(0, 0, 0, 0.04)', 
        height: 56, 
        alignItems: 'center', 
        borderBottom: '1px solid rgba(0,0,0,0.12)' 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><Checkbox size="small" checked={data.length > 0 && selectedIds.length === data.length} onChange={() => onSelectionChange(selectedIds.length === data.length ? [] : data.map((d: any) => d.id))}/></Box>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Data</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Hora</Typography>
        {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Responsável</Typography>}
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Atividade</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Nome</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Placa</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Status</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Ações</Typography>
      </Box>

      {/* ROWS */}
      {data.map((row: any) => (
        <Box key={row.id} sx={{ 
          display: 'grid', 
          gridTemplateColumns: gridLayout, 
          alignItems: 'center', 
          minHeight: 52, 
          borderBottom: '1px solid rgba(0,0,0,0.12)', 
          bgcolor: selectedIds.includes(row.id) ? 'rgba(0, 114, 195, 0.12)' : 'white' 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><Checkbox size="small" checked={selectedIds.includes(row.id)} onChange={() => onSelectionChange((p:any) => p.includes(row.id) ? p.filter((i:any)=>i!==row.id) : [...p, row.id])} /></Box>
          <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.data}</Typography>
          <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.hora}</Typography>
          {isHistory && <Typography sx={{ px: 2, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: SCHIBSTED }}>{row.responsavel}</Typography>}
          <Typography sx={{ px: 2, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: SCHIBSTED }}>{row.atividade}</Typography>
          <Typography sx={{ px: 2, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: SCHIBSTED }}>{row.nome}</Typography>
          <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.placa}</Typography>
          <Box sx={{ px: 2 }}>
            <Box sx={{ 
              bgcolor: row.status === 'Concluído' ? '#50883C' : '#FF832B', 
              borderRadius: '4px', height: 24, width: '100%', 
              display: 'flex', justifyContent: 'center', alignItems: 'center' 
            }}>
              <Typography sx={{ color: 'white', fontSize: 12, fontFamily: SCHIBSTED }}>{row.status}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, px: 2 }}>
            <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onView(row)}><VisibilityIcon fontSize="small" /></IconButton>
            {!isHistory && <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onEdit(row)}><EditIcon fontSize="small" /></IconButton>}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PortariaTable;