import React from 'react';
import { Box, Typography, Checkbox, IconButton, Stack } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const PortariaTable: React.FC<any> = ({ data, selectedIds, onSelectionChange, isHistory, onEdit, onView }) => {
  const gridLayout = isHistory 
    ? `48px 110px 80px 1.2fr 1fr 1.5fr 100px 150px 80px`
    : `48px 110px 80px 1fr 1.5fr 110px 180px 100px`;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, bgcolor: 'rgba(0, 0, 0, 0.04)', height: 56, alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Checkbox size="small" checked={data.length > 0 && selectedIds.length === data.length} onChange={() => onSelectionChange(selectedIds.length === data.length ? [] : data.map((d: any) => d.id))}/>
        </Box>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Data</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Hora</Typography>
        {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Responsável</Typography>}
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Atividade</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Nome</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Placa</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Status</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 700, fontFamily: SCHIBSTED }}>Ações</Typography>
      </Box>

      {/* BODY */}
      {data.map((row: any) => {
        const isSel = selectedIds.includes(row.id);
        return (
          <Box key={row.id} onClick={() => onSelectionChange((p: any) => p.includes(row.id) ? p.filter((i: any) => i !== row.id) : [...p, row.id])}
            sx={{ display: 'grid', gridTemplateColumns: gridLayout, alignItems: 'center', minHeight: 64, borderBottom: '1px solid rgba(0,0,0,0.12)', bgcolor: isSel ? 'rgba(0, 114, 195, 0.12)' : 'white', cursor: 'pointer' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {isSel ? <Checkbox size="small" checked={true} /> : <Box sx={{ width: 42 }} />}
            </Box>

            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.data}</Typography>
            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.hora}</Typography>
            {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.responsavel}</Typography>}
            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.atividade}</Typography>
            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.nome}</Typography>
            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED }}>{row.placa}</Typography>
            
            <Box sx={{ px: 2 }}>
              <Box sx={{ bgcolor: row.status === 'Concluído' ? '#50883C' : '#FF832B', borderRadius: '4px', height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 600, fontFamily: SCHIBSTED }}>{row.status}</Typography>
              </Box>
            </Box>

            {/* ✅ ÍCONES PADRONIZADOS */}
            <Stack direction="row" spacing={0.5} sx={{ px: 2 }} onClick={e => e.stopPropagation()}>
              <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onView(row)}>
                <VisibilityIcon sx={{ fontSize: 20 }} />
              </IconButton>
              {!isHistory && (
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onEdit(row)}>
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

export default PortariaTable;