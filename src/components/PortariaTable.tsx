import React from 'react';
import { Box, Typography, Checkbox, IconButton, TablePagination } from '@mui/material';
import { Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const PortariaTable: React.FC<any> = ({ data, selectedIds, onSelectionChange }) => {
  // Grid calibrado para não quebrar com status e ações
  const gridLayout = `50px 110px 80px 160px 1fr 110px 170px 100px`;

  const handleToggleRow = (id: string) => {
    onSelectionChange((prev: string[]) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
      {/* HEADER - Checkbox Geral mantido */}
      <Box sx={{ display: 'grid', gridTemplateColumns: gridLayout, bgcolor: 'rgba(0, 0, 0, 0.04)', height: 56, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Checkbox 
            size="small" 
            checked={data.length > 0 && selectedIds.length === data.length} 
            onChange={() => onSelectionChange(selectedIds.length === data.length ? [] : data.map((d: any) => d.id))}
          />
        </Box>
        {['Data', 'Hora', 'Atividade', 'Nome', 'Placa', 'Status', 'Ações'].map((h) => (
          <Typography key={h} sx={{ px: 1, fontSize: 14, fontWeight: 500, fontFamily: SCHIBSTED, color: 'black' }}>{h}</Typography>
        ))}
      </Box>

      {/* BODY - Checkbox condicional */}
      {data.map((row: any) => {
        const isSelected = selectedIds.includes(row.id);
        return (
          <Box 
            key={row.id} 
            onClick={() => handleToggleRow(row.id)} 
            sx={{ 
              display: 'grid', gridTemplateColumns: gridLayout, alignItems: 'center', minHeight: 52, 
              borderBottom: '1px solid rgba(0,0,0,0.12)', bgcolor: isSelected ? 'rgba(0, 114, 195, 0.12)' : 'white', 
              cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
              {/* 🛡️ REGRA: Aparece apenas se clicado/selecionado */}
              {isSelected ? (
                <Checkbox size="small" checked={isSelected} onChange={() => handleToggleRow(row.id)} />
              ) : (
                <Box sx={{ width: 42 }} /> 
              )}
            </Box>
            <Typography sx={{ px: 1, fontSize: 14, fontFamily: SCHIBSTED }}>{row.data}</Typography>
            <Typography sx={{ px: 1, fontSize: 14, fontFamily: SCHIBSTED }}>{row.hora}</Typography>
            <Typography sx={{ px: 1, fontSize: 16, fontFamily: SCHIBSTED }}>{row.atividade}</Typography>
            <Typography sx={{ px: 1, fontSize: 16, fontFamily: SCHIBSTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.nome}</Typography>
            <Typography sx={{ px: 1, fontSize: 16, fontFamily: SCHIBSTED }}>{row.placa}</Typography>
            
            <Box sx={{ px: 1 }}>
              <Box sx={{ bgcolor: '#FFF3EA', borderRadius: '4px', height: 24, width: 151, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ color: '#FF832B', fontSize: 14, fontFamily: SCHIBSTED }}>{row.status}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, px: 1 }}>
              <IconButton size="small" sx={{ color: '#0072C3' }}><VisibilityIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={{ color: '#0072C3' }}><EditIcon fontSize="small" /></IconButton>
            </Box>
          </Box>
        );
      })}

      <Box sx={{ p: 0.5, borderTop: '1px solid rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'flex-end' }}>
        <TablePagination component="div" count={data.length} page={0} onPageChange={() => {}} rowsPerPage={5} rowsPerPageOptions={[5]} labelRowsPerPage="Rows per page:" sx={{ '& .MuiTablePagination-typography': { fontFamily: SCHIBSTED, fontSize: 12 } }} />
      </Box>
    </Box>
  );
};

export default PortariaTable;