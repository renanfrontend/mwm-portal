import React from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material'; // 🛡️ FIX: Removido TablePagination (não utilizado)
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const PortariaTable: React.FC<any> = ({ data, selectedIds, onSelectionChange, isHistory, onEdit, onView }) => {
  const gridLayout = isHistory 
    ? `50px 100px 80px 180px 150px 180px 120px 190px 80px` 
    : `50px 110px 80px 160px 1fr 110px 190px 100px`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, bgcolor: 'rgba(0, 0, 0, 0.04)', height: 56, alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><Checkbox size="small" checked={data.length > 0 && selectedIds.length === data.length} onChange={() => onSelectionChange(selectedIds.length === data.length ? [] : data.map((d: any) => d.id))}/></Box>
        {['Data', 'Hora'].map((h) => (<Typography key={h} sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>{h}</Typography>))}
        {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>Responsável</Typography>}
        {['Atividade', 'Nome', 'Placa', 'Status', 'Ações'].map((h) => (<Typography key={h} sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED }}>{h}</Typography>))}
      </Box>

      {data.map((row: any) => {
        const isSelected = selectedIds.includes(row.id);
        const isFinished = row.status === 'Concluído';
        return (
          <Box key={row.id} sx={{ display: 'grid', gridTemplateColumns: gridLayout, alignItems: 'center', minHeight: 52, borderBottom: '1px solid rgba(0,0,0,0.12)', bgcolor: isSelected ? 'rgba(0, 114, 195, 0.12)' : 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><Checkbox size="small" checked={isSelected} onChange={() => onSelectionChange((p:any) => p.includes(row.id) ? p.filter((i:any)=>i!==row.id) : [...p, row.id])} /></Box>
            <Typography sx={{ px: 2, fontSize: 14 }}>{row.data}</Typography>
            <Typography sx={{ px: 2, fontSize: 14 }}>{row.hora}</Typography>
            {isHistory && <Typography sx={{ px: 2, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.responsavel}</Typography>}
            <Typography sx={{ px: 2, fontSize: 14 }}>{row.atividade}</Typography>
            <Typography sx={{ px: 2, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.nome}</Typography>
            <Typography sx={{ px: 2, fontSize: 14 }}>{row.placa}</Typography>
            <Box sx={{ px: 2 }}><Box sx={{ bgcolor: isFinished ? '#50883C' : '#FF832B', borderRadius: '4px', height: 24, width: 178, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}><Typography sx={{ color: 'white', fontSize: 14 }}>{row.status}</Typography></Box></Box>
            <Box sx={{ display: 'flex', gap: 0.5, px: 2 }}>
              <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onView(row)}><VisibilityIcon fontSize="small" /></IconButton>
              {!isHistory && <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onEdit(row)}><EditIcon fontSize="small" /></IconButton>}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default PortariaTable;