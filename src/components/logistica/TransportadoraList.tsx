import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, Typography, IconButton, Stack, CircularProgress, 
  TextField, Button, Checkbox, TablePagination 
} from '@mui/material';
import { 
  VisibilityIcon, EditIcon, AddIcon 
} from '../../constants/muiIcons';
import { TransportadoraService } from '../../services/transportadoraService';
import TransportadoraDrawer from './TransportadoraDrawer';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

interface TransportadoraListProps {
  onShowSuccess: (title: string, message: string, severity?: 'success' | 'error') => void;
}

export const TransportadoraList: React.FC<TransportadoraListProps> = ({ onShowSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // ...existing code...
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TransportadoraService.list(1, 9999);
      
      // 🔍 DEBUG: Se no console aparecer 'veiculos: undefined' ou '[]', 
      // o problema é que a API de lista não está trazendo os dados do banco.
      console.log("🔍 Dados da Transportadora:", response.items);
      
      setData(response.items || []);
    } catch (err) { 
      console.error("Erro ao carregar lista:", err);
      setData([]); 
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDrawer = async (mode: 'create' | 'view' | 'edit', item: any = null) => {
    setDrawerMode(mode);
    if (mode === 'create') {
      setSelectedItem(null);
      setIsDrawerOpen(true);
    } else {
      setLoading(true);
      try {
        // Busca o item completo (com veículos) para garantir que o Drawer carregue tudo
        const fullItem = await TransportadoraService.getById(item.id);
        setSelectedItem(fullItem);
        setIsDrawerOpen(true);
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
        setSelectedItem(item);
        setIsDrawerOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  // ...existing code...

  const visibleItems = useMemo(() => {
    return data
      .filter(i => (i.nomeFantasia || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, searchTerm, page, rowsPerPage]);

  const grid = "40px 1.8fr 1.1fr 1.6fr 0.9fr 85px";

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField 
            placeholder="Buscar" 
            size="small" 
            value={searchTerm} 
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }} 
            sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} 
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Botão de deletar desabilitado/removido pois a função não está implementada */}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDrawer('create')} sx={{ background: '#0072C3', color: 'white', fontFamily: SCHIBSTED }}>
              Adicionar
            </Button>
          </Box>
      </Box>

      <Box sx={{ flex: 1, px: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%' }}>
          {/* Cabeçalho: Nomes mantidos como solicitado */}
          <Box sx={{ display: 'grid', gridTemplateColumns: grid, height: 56, alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.04)', px: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Checkbox 
              size="small" 
              checked={visibleItems.length > 0 && selectedIds.length === visibleItems.length} 
              onChange={() => setSelectedIds(selectedIds.length > 0 ? [] : visibleItems.map(i => i.id))} 
            />
            {['Nome fantasia', 'CNPJ', 'Endereço', 'Veículos', 'Ações'].map(c => (
              <Typography key={c} sx={{ fontSize: 11, fontWeight: 600, fontFamily: SCHIBSTED }}>{c}</Typography>
            ))}
          </Box>

          <Box>
            {loading && data.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={32} /></Box>
            ) : (
              visibleItems.map(item => (
                <Box key={item.id} sx={{ 
                  display: 'grid', gridTemplateColumns: grid, minHeight: 52, alignItems: 'center', px: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                  bgcolor: selectedIds.includes(item.id) ? 'rgba(0, 114, 195, 0.08)' : 'inherit'
                }}>
                  <Checkbox size="small" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds(p => p.includes(item.id) ? p.filter(i => i !== item.id) : [...p, item.id])} />
                  <Typography noWrap sx={{ fontSize: 14, fontFamily: SCHIBSTED }}>{item.nomeFantasia}</Typography>
                  <Typography sx={{ fontSize: 14, fontFamily: SCHIBSTED }}>{item.cnpj}</Typography>
                  <Typography noWrap sx={{ fontSize: 14, fontFamily: SCHIBSTED }}>{item.endereco}</Typography>
                  
                  {/* ✅ Coluna Veículos: Mapeamento blindado */}
                  <Box sx={{ p: '4px', bgcolor: '#00518A', borderRadius: '100px', display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                    <Box sx={{ minHeight: '24px', px: '8px', display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: 'white', fontSize: '13px', fontWeight: 600, fontFamily: SCHIBSTED }}>
                        {item.veiculos ? item.veiculos.length : (item.quantidadeVeiculos ?? 0)}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('view', item)}><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: '#0072C3' }} onClick={() => openDrawer('edit', item)}><EditIcon fontSize="small" /></IconButton>
                  </Stack>
                </Box>
              ))
            )}
          </Box>
          <TablePagination component="div" count={data.length} page={page} onPageChange={(_, n) => setPage(n)} rowsPerPage={rowsPerPage} onRowsPerPageChange={e => setRowsPerPage(Number(e.target.value))} rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Linhas por página:" />
        </Box>
      </Box>

      <TransportadoraDrawer 
        key={selectedItem?.id || 'new-drawer'} 
        isOpen={isDrawerOpen} 
        mode={drawerMode} 
        initialData={selectedItem} 
        onClose={closeDrawer} 
        onSave={() => { 
          load(); 
          closeDrawer(); 
          onShowSuccess('Registro atualizado com sucesso', 'As alterações foram salvas e já estão disponíveis no sistema.', 'success'); 
        }} 
      />
    </Box>
  );
};

export default TransportadoraList;