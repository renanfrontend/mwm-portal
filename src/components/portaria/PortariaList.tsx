import React, { useState, useMemo, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, Button, IconButton, Drawer, Typography, GlobalStyles, TablePagination } from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  FileUpload as FileUploadIcon, 
  FilterAlt as FilterAltIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import PortariaTable from './PortariaTable';
import PortariaDrawer from './PortariaDrawer';
import { useAuth } from '../../context/AuthContext';
import { podeCadastrarPortaria, podeExcluirPortaria } from '../../domain/permissaoPortaria';
import { portariaRegistroService, portariaMapperService, portariaSubmissionService, portariaDeletionService } from '../../features/portaria';
import type { PortariaDrawerFormState, PortariaRegistro, PortariaRegistroApiData } from '../../features/portaria/types';
import EmptyImage from '../../assets/empty-states-sheets.png'; 

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

export const PortariaList: React.FC<any> = ({ onSuccess, onTabChange }) => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerConfig, setDrawerConfig] = useState<{open: boolean, mode: 'add'|'edit'|'view', data: PortariaRegistroApiData | PortariaRegistro | null}>({open: false, mode: 'add', data: null});
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [fullApiData, setFullApiData] = useState<Array<PortariaRegistroApiData | PortariaRegistro>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await portariaRegistroService.listRegistros({ page: 0, pageSize: 9999 });
      console.log('📋 [MAPPER] Resposta raw:', response.data);
      
      // Armazenar dados completos da API para usar quando EDIT/VIEW
      setFullApiData(response.data);
      
      const rows = response.data.map((api: any) => {
        console.log('🔍 [API RAW] Registro completo:', JSON.stringify(api, null, 2));
        const row = portariaMapperService.mapApiToTableRow(api);
        console.log('🔄 [MAPPER] Row mapeada:', row);
        return {
          id: row.id,
          data: row.data,
          hora: row.hora,
          atividade: row.atividade,
          nome: row.nome,
          placa: row.placa,
          status: row.status,
          responsavel: row.responsavel,
        };
      });
      console.log('✅ [GRID] Dados finais:', rows);
      setData(rows);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar registros');
      setData([]);
      setFullApiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data.filter(item => (tabValue === 0 ? item.status !== 'Concluído' : item.status === 'Concluído'));
    
    // Aplica filtro de busca se houver
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          (item.data && item.data.toLowerCase().includes(search)) ||
          (item.hora && item.hora.toLowerCase().includes(search)) ||
          (item.atividade && item.atividade.toLowerCase().includes(search)) ||
          (item.nome && item.nome.toLowerCase().includes(search)) ||
          (item.placa && item.placa.toLowerCase().includes(search)) ||
          (item.status && item.status.toLowerCase().includes(search))
        );
      });
    }
    
    return filtered;
  }, [data, tabValue, searchTerm]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  /**
   * Helper: Recupera dados completos da API para um registro específico
   * Necessário para popular corretamente o formulário no drawer
   */
  const getFullDataForRow = (rowId: string) => {
    return fullApiData.find((api) => String(api.id) === rowId);
  };

  const canDeleteSelectedRows = (ids: string[]) => {
    return ids.length > 0;
  };

  const resolveRegistroForDelete = async (rowId: string): Promise<PortariaRegistro> => {
    try {
      return await portariaRegistroService.getRegistroById(rowId);
    } catch (error) {
      const cached = getFullDataForRow(rowId);
      if (cached) {
        return portariaMapperService.mapApiToRegistro(cached as PortariaRegistroApiData);
      }

      throw error;
    }
  };

  /**
   * ============================================================================
   * HANDLER: SALVAR REGISTRO
   * ============================================================================
   * Responsabilidade: Processar salvamento de registros (novo ou existente)
   * e sincronizar com a API para garantir dados consistentes
   * 
   * Dois cenários:
   * SITUAÇÃO 1: Modo EDIT - Atualizar registro existente
   * SITUAÇÃO 2: Modo ADD - Criar novo registro
   */
  const handleSave = (entry: PortariaDrawerFormState) => {
    if (drawerConfig.mode === 'edit') {
      /**
       * SITUAÇÃO 1: EDIÇÃO DE REGISTRO EXISTENTE
       * ============================================================================
       * Responsabilidade: Enviar alterações para API e sincronizar grid
       * 
       * Fluxo:
       * 1. Preparar payload com dados do formulário
       * 2. Enviar para API via updateRegistro()
       * 3. Recarregar TODOS os dados da API (não confia em dados locais)
       * 4. Fechar drawer e mostrar mensagem de sucesso
       * 
       * Por que recarregar da API?
       * - A API pode ter regras de negócio que modificam os dados
       * - Ex: normalizar placa, recalcular densidade, etc
       * - Garantir que o grid mostra exatamente o que está no banco
       */
      console.log('📝 [SITUAÇÃO-1-EDIT] Atualizando registro:', entry.id);

      portariaSubmissionService.update(entry)
        .then(() => {
          console.log('✅ [SUCESSO-EDIT] Recarregando dados da API');
          // Sincronizar com API - garante que o grid mostra dados corretos
          loadData();
          onSuccess("Registro atualizado com sucesso", "As alterações foram salvas e já estão disponíveis no sistema.");
          setDrawerConfig({open: false, mode: 'add', data: null});
        })
        .catch((error) => {
          console.error('❌ [ERRO-EDIT] Falha ao atualizar:', error);
          onSuccess("Erro ao atualizar", "Falha ao salvar as alterações.");
        });
    } else {
      /**
       * SITUAÇÃO 2: CRIAÇÃO DE NOVO REGISTRO
       * ============================================================================
       * Responsabilidade: Enviar novo registro para API e sincronizar grid
       * 
       * Fluxo:
       * 1. Usar Factory pattern para obter estratégia correta (por tipo de atividade)
       * 2. Preparar payload com dados do formulário
       * 3. Enviar para API via estratégia.criar()
       * 4. Recarregar TODOS os dados da API (não confia em dados locais)
       * 5. Fechar drawer e mostrar mensagem de sucesso
       * 
       * Por que recarregar da API?
       * - Registro novo pode ter IDs gerados no banco (sequences)
       * - Transportadora "Outros" pode ter sido normalizada
       * - API pode ter aplicado regras de negócio (ex: campo densidade)
       * - Garante consistência total entre frontend e banco
       * 
       * Por que usar Factory pattern?
       * - Cada tipo de atividade tem comportamento diferente
       * - Entrega de Dejetos, Abastecimento, Visita, etc
       * - Mantém código desacoplado (SOLID - Open/Closed Principle)
       */
      console.log('✨ [SITUAÇÃO-2-ADD] Criando novo registro de tipo:', entry.atividade);
      
      try {
        portariaSubmissionService.create(entry)
          .then(() => {
            console.log('✅ [SUCESSO-ADD] Registro criado, recarregando dados da API');
            // Sincronizar com API - garante que o grid mostra dados corretos
            // Especialmente importante para transportadora "Outros" que pode ter sido processada
            loadData();
            onSuccess(`${entry.atividade} registrada`, "As informações foram salvas com sucesso.");
            setDrawerConfig({open: false, mode: 'add', data: null});
          })
          .catch((error) => {
            console.error(`❌ [ERRO-ADD] Falha ao criar ${entry.atividade}:`, error);
            onSuccess("Erro ao salvar", `Falha ao registrar ${entry.atividade}.`);
            setDrawerConfig({open: false, mode: 'add', data: null});
          });
      } catch (error) {
        // SITUAÇÃO 2-ERRO: Estratégia não encontrada para atividade
        console.error('❌ [ERRO-ESTRATÉGIA] Tipo de atividade não suportado:', error);
        onSuccess("Erro", error instanceof Error ? error.message : "Atividade não suportada");
        setDrawerConfig({open: false, mode: 'add', data: null});
      }
    }
  };

  const handleDelete = async () => {
    try {
      const registros = await Promise.all(selectedIds.map(resolveRegistroForDelete));

      // Só permite exclusão se todos os selecionados estão "Em andamento"
      const invalidStatusRegistro = registros.find(registro => registro.status !== 'Em andamento');
      if (invalidStatusRegistro) {
        throw new Error('Somente registros com status Em andamento podem ser excluídos.');
      }

      // Exclusão diferenciada por atividade
      for (const registro of registros) {
        if (
          (registro.tipo_registro === 'ENTREGA_DEJETOS' || registro.tipo_registro === 'ABASTECIMENTO' || registro.tipo_registro === 'ENTREGA_INSUMO') &&
          registro.status === 'Em andamento'
        ) {
          await portariaDeletionService.deleteRegistro(registro);
        } else {
          // Futuro: adicionar lógica para outros tipos
        }
      }

      await loadData();
      setSelectedIds([]);
      setIsDeleteDrawerOpen(false);

      const registroLabel = registros.length > 1 ? 'Registros excluídos com sucesso' : 'Registro excluído com sucesso';
      const registroMessage = registros.length > 1
        ? 'Os registros selecionados foram removidos e não estão mais disponíveis no sistema.'
        : 'O registro foi removido e não está mais disponível no sistema.';

      onSuccess(registroLabel, registroMessage);
    } catch (deleteError) {
      console.error('❌ [DELETE] Falha ao excluir registros:', deleteError);
      onSuccess(
        'Erro ao excluir',
        deleteError instanceof Error ? deleteError.message : 'Falha ao excluir os registros selecionados.',
        'error'
      );
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <GlobalStyles styles={{ 
        '.MuiAlert-root': { border: 'none !important', boxShadow: 'none !important' },
        '.MuiAlert-standardSuccess': { backgroundColor: '#F1F9EE !important' }
      }} />

      <Box sx={{ pt: 1.5, px: 2 }}>
        <Tabs value={tabValue} onChange={(_, v) => { setTabValue(v); onTabChange(v); setPage(0); setSelectedIds([]); }} sx={{ minHeight: 36, '& .MuiTab-root': { fontFamily: SCHIBSTED, fontWeight: 500, fontSize: 14, minHeight: 36, textTransform: 'uppercase' } }}>
          <Tab label="Registro" />
          <Tab label="Histórico" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: '8px 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <TextField 
           placeholder="Buscar" 
           size="small" 
           value={searchTerm}
           onChange={(e) => {
             setSearchTerm(e.target.value);
             setPage(0); // Reseta paginação ao buscar
           }}
           sx={{ width: 400, '& .MuiInputBase-root': { height: 32 } }} 
         />
         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
           {(() => { try { console.log('selectedIds:', selectedIds, fullApiData.map(r => ({id: r.id, status: r.status}))); } catch(e) {} return null; })()}
           {tabValue === 0 && podeExcluirPortaria(user) && (
             <IconButton
               disabled={!canDeleteSelectedRows(selectedIds)}
               onClick={() => setIsDeleteDrawerOpen(true)}
               sx={{ color: selectedIds.length > 0 ? '#0072C3' : 'rgba(0,0,0,0.26)' }}
             >
               <DeleteIcon />
             </IconButton>
           )}
           <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FileUploadIcon /></IconButton>
           <IconButton sx={{ color: 'rgba(0,0,0,0.26)' }}><FilterAltIcon /></IconButton>
           {tabValue === 0 && podeCadastrarPortaria(user) && (
             <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDrawerConfig({open: true, mode: 'add', data: null})} sx={{ bgcolor: '#0072C3', fontFamily: SCHIBSTED }}>ADICIONAR</Button>
           )}
         </Box>
      </Box>
      
       <Box sx={{ p: '0 16px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
         {loading && data.length === 0 ? (
           <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <Typography sx={{ color: '#34343F', fontSize: 16, fontFamily: SCHIBSTED }}>Carregando dados...</Typography>
           </Box>
         ) : error ? (
           <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <Typography sx={{ color: '#D32F2F', fontSize: 16, fontFamily: SCHIBSTED }}>Erro: {error}</Typography>
           </Box>
         ) : filteredData.length === 0 ? (
           <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <img src={EmptyImage} alt="Vazio" style={{ width: 150, marginBottom: '24px' }} />
             <Typography sx={{ color: '#34343F', fontSize: 18, fontFamily: SCHIBSTED, fontWeight: 500 }}>Área sem registros</Typography>
           </Box>
         ) : null}
         {!error && filteredData.length > 0 && (
           <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'white', borderRadius: '4px', overflow: 'hidden', flex: 1 }}>
             <Box sx={{ width: '100%', overflowX: 'auto', '& .MuiTableCell-root': { borderBottom: 'none' } }}>
               <PortariaTable 
                 data={paginatedData} 
                 selectedIds={selectedIds} 
                 onSelectionChange={(updater: string[] | ((prev: string[]) => string[])) => {
                   if (typeof updater === 'function') {
                     setSelectedIds(updater);
                   } else {
                     setSelectedIds(updater);
                   }
                 }} 
                 isHistory={tabValue === 1}
                 onEdit={(row: any) => {
                   console.log('✏️ [EDIT] Abrindo registro:', row.id);
                   portariaRegistroService.getRegistroById(row.id)
                     .then((response: any) => {
                       console.log('✅ [EDIT] Dados carregados via API:', response);
                       setDrawerConfig({open: true, mode: 'edit', data: response});
                     })
                     .catch((error: any) => {
                       console.warn('⚠️ [EDIT] Erro ao buscar via API, usando cache local:', error);
                       const fullData = getFullDataForRow(row.id);
                       if (fullData) {
                         console.log('✅ [EDIT] Usando dados do cache:', fullData);
                         setDrawerConfig({open: true, mode: 'edit', data: fullData});
                       } else {
                         console.error('❌ [EDIT] Nenhum dado disponível:', row.id);
                         setDrawerConfig({open: true, mode: 'edit', data: row});
                       }
                     });
                   }}
                   onView={(row: any) => {
                     console.log('👁️ [VIEW] Abrindo visualização:', row.id);
                     portariaRegistroService.getRegistroById(row.id)
                       .then((response: any) => {
                         console.log('✅ [VIEW] Dados carregados via API:', response);
                         setDrawerConfig({open: true, mode: 'view', data: response});
                       })
                       .catch((error: any) => {
                         console.warn('⚠️ [VIEW] Erro ao buscar via API, usando cache local:', error);
                         const fullData = getFullDataForRow(row.id);
                         if (fullData) {
                           console.log('✅ [VIEW] Usando dados do cache:', fullData);
                           setDrawerConfig({open: true, mode: 'view', data: fullData});
                         } else {
                           console.error('❌ [VIEW] Nenhum dado disponível:', row.id);
                           setDrawerConfig({open: true, mode: 'view', data: row});
                         }
                       });
                     }}
               />
             </Box>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, bgcolor: 'white' }}>
               <TablePagination 
                 component="div" 
                 count={filteredData.length} 
                 page={page} 
                 onPageChange={(_, n) => setPage(n)} 
                 rowsPerPage={rowsPerPage} 
                 onRowsPerPageChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }} 
                 rowsPerPageOptions={[5, 10, 25]} 
                 labelRowsPerPage="Linhas por página:" 
                 labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
                 sx={{ border: 'none', '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': { fontFamily: SCHIBSTED, fontSize: 12, color: 'black' } }} 
               />
             </Box>
           </Box>
         )}
       </Box>

      {/* MODAL DE EXCLUSÃO */}
      <Drawer anchor="right" open={isDeleteDrawerOpen} onClose={() => setIsDeleteDrawerOpen(false)} PaperProps={{ sx: { width: 620 } }}>
        <Box sx={{ p: '24px 32px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED }}>EXCLUIR REGISTRO</Typography>
              <Typography sx={{ fontSize: 20, mt: 3, fontFamily: SCHIBSTED, color: 'black', lineHeight: '28px' }}>
                Ao excluir esse registro todas as informações associadas à ela serão removidas. Deseja excluir esse registro?
              </Typography>
            </Box>
            <IconButton onClick={() => setIsDeleteDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button variant="outlined" fullWidth onClick={() => setIsDeleteDrawerOpen(false)} sx={{ height: 48, color: '#0072C3', borderColor: '#0072C3', fontWeight: 600 }}>NÃO</Button>
            <Button variant="contained" fullWidth onClick={handleDelete} sx={{ height: 48, bgcolor: '#0072C3', fontWeight: 600 }}>SIM</Button>
          </Box>
        </Box>
      </Drawer>

      <PortariaDrawer open={drawerConfig.open} mode={drawerConfig.mode} initialData={drawerConfig.data} onClose={() => setDrawerConfig({open: false, mode: 'add', data: null})} onSave={handleSave} />
    </Box>
  );
};
