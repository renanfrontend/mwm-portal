import React, { useState, useEffect, useMemo } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { MdAdd } from 'react-icons/md';
import { fetchNewAgendaData } from '../services/api';
import type { AgendaData } from '../services/api';
import { AgendaTable } from './AgendaTable';
import AgendaDrawer from './AgendaDrawer';

const COMMON_FONT_STYLE = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

export const AgendaList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<AgendaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AgendaData | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchNewAgendaData().then(res => { 
        setData(res || []); 
        setLoading(false); 
    }).catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
      setSelectedItem(null);
      setIsReadOnly(false);
      setIsDrawerOpen(true);
  };

  const filtered = useMemo(() => (data || []).filter(item => item.cooperado?.toLowerCase().includes(searchTerm.toLowerCase())), [data, searchTerm]);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: '16px', display: 'flex', gap: 2 }}>
          <TextField 
              fullWidth 
              label="Buscar" 
              placeholder="Digite para pesquisar" 
              size="small" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
          />
          <Button 
              variant="contained" 
              startIcon={<MdAdd />} 
              onClick={handleAdd} 
              sx={{ bgcolor: '#0072C3', height: 40, px: 3, ...COMMON_FONT_STYLE }}
          >
              ADICIONAR
          </Button>
      </Box>

      <Box sx={{ flex: 1, overflowX: 'auto', px: '16px' }}>
          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
              </Box>
          ) : (
              <AgendaTable 
                  data={filtered} 
                  isDeleteMode={false} 
                  selectedItems={[]} 
                  onSelectItem={() => {}} 
              />
          )}
      </Box>

      <AgendaDrawer 
          isOpen={isDrawerOpen} 
          isReadOnly={isReadOnly} 
          onClose={() => setIsDrawerOpen(false)} 
          onSave={() => setIsDrawerOpen(false)} 
          initialData={selectedItem} 
      />
    </Box>
  );
};
