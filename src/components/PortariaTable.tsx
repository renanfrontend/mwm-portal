import React from 'react';
import { Box, Typography, Checkbox, IconButton, Stack, Tooltip } from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const PortariaTable: React.FC<any> = ({ data, selectedIds, onSelectionChange, isHistory, onEdit, onView }) => {
  // 🛡️ Grid Layout baseado na referência: 8 colunas para histórico, 8 para registro (incluindo checkbox)
  const gridLayout = isHistory 
    ? `1fr 1fr 1.5fr 1.2fr 1.5fr 1fr 1.2fr 100px` // Histórico (Sem checkbox)
    : `50px 1fr 1fr 1.2fr 1.5fr 1fr 1.2fr 100px`; // Registro (Com checkbox)

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: gridLayout, 
        bgcolor: 'rgba(0, 0, 0, 0.04)', 
        height: 56, 
        alignItems: 'center', 
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        px: isHistory ? 2 : 0 
      }}>
        {!isHistory && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Checkbox 
              size="small" 
              checked={data.length > 0 && selectedIds.length === data.length} 
              onChange={() => onSelectionChange(selectedIds.length === data.length ? [] : data.map((d: any) => d.id))}
            />
          </Box>
        )}
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Data</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Hora</Typography>
        {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Responsável</Typography>}
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Atividade</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Nome</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Placa</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Status</Typography>
        <Typography sx={{ px: 2, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>Ações</Typography>
      </Box>

      {/* BODY */}
      {data.map((row: any) => {
        const isSel = selectedIds.includes(row.id);
        return (
          <Box 
            key={row.id} 
            onClick={() => !isHistory && onSelectionChange((p: any) => p.includes(row.id) ? p.filter((i: any) => i !== row.id) : [...p, row.id])}
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: gridLayout, 
              alignItems: 'center', 
              minHeight: 64, 
              borderBottom: '1px solid rgba(0,0,0,0.12)', 
              bgcolor: isSel ? 'rgba(0, 114, 195, 0.08)' : 'white', 
              cursor: isHistory ? 'default' : 'pointer',
              px: isHistory ? 2 : 0,
              '&:hover': { bgcolor: isHistory ? 'white' : 'rgba(0,0,0,0.02)' }
            }}
          >
            {!isHistory && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {isSel ? <Checkbox size="small" checked={true} /> : <Box sx={{ width: 42 }} />}
              </Box>
            )}

            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED, color: 'black' }}>{row.data}</Typography>
            <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED, color: 'black' }}>{row.hora}</Typography>
            {isHistory && <Typography sx={{ px: 2, fontSize: 14, fontFamily: SCHIBSTED, color: 'black' }}>{row.responsavel}</Typography>}
            <Typography sx={{ px: 2, fontSize: 16, fontFamily: SCHIBSTED, color: 'black' }}>{row.atividade}</Typography>
            <Typography sx={{ px: 2, fontSize: 16, fontFamily: SCHIBSTED, color: 'black' }}>{row.motorista || row.visitante || row.nome}</Typography>
            <Typography sx={{ px: 2, fontSize: 16, fontFamily: SCHIBSTED, color: 'black' }}>{row.placa}</Typography>
            
            <Box sx={{ px: 2 }}>
              <Box sx={{ 
                bgcolor: row.status === 'Concluído' ? '#50883C' : '#FF832B', 
                borderRadius: '4px', height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center',
                px: 1
              }}>
                <Typography sx={{ color: 'white', fontSize: 14, fontWeight: 400, fontFamily: SCHIBSTED }}>
                  {row.status || 'Em andamento'}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={0.5} sx={{ px: 2 }} onClick={e => e.stopPropagation()}>
              <Tooltip title="Visualizar">
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onView(row)}>
                  <VisibilityIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => onEdit(row)}>
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

export default PortariaTable;