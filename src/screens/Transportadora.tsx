import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MdArrowBack, MdDelete, MdPersonAdd } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Typography, IconButton, Button, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CooperadoListItem } from '../components/CooperadoListItem';
import { type CooperadoItem, fetchCooperadosData } from '../services/api';

import { TransportadoraList } from '../components/TransportadoraList';

// Importação do novo Drawer
import TransportadoraDrawer from '../components/TransportadoraDrawer'; 

import CooperadoContactModal from '../components/CooperadoContactModal';
import CooperadoEditModal from '../components/CooperadoEditModal';
import CooperadoCreateModal from '../components/CooperadoCreateModal';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';
const COMMON_FONT = { fontFamily: SCHIBSTED, letterSpacing: '0.15px' };

const Transportadora: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cadastro');
  const navigate = useNavigate();
  // const [agendaData, setAgendaData] = useState<any[]>([]);

  const [cooperadosData, setCooperadosData] = useState<CooperadoItem[]>([]);
  const [, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCooperado, setSelectedCooperado] = useState<CooperadoItem | null>(null);
  const [isContactModalActive, setIsContactModalActive] = useState(false);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isCreateModalActive, setIsCreateModalActive] = useState(false);

  // --- ESTADO PARA O DRAWER DE TRANSPORTADORA ---
  const [isTransDrawerOpen, setIsTransDrawerOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'agenda') { /* setAgendaData(await fetchNewAgendaData() || []); */ }
      else if (activeTab === 'cadastro') setCooperadosData(await fetchCooperadosData() || []);

    } catch { toast.error("Falha ao carregar dados."); } finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { loadData(); setSearchTerm(''); setSelectedItems([]); setIsDeleteMode(false); }, [activeTab, loadData]);

  const filteredCooperadosData = useMemo(() => (cooperadosData || []).filter(item => (item.motorista?.toLowerCase().includes(searchTerm.toLowerCase()))), [searchTerm, cooperadosData]);
  const handleSelectItem = (id: string | number) => setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleConfirmDelete = () => {
    if (activeTab === 'agenda') { /* setAgendaData(prev => prev.filter(item => !selectedItems.includes(item.id))); */ }

    else if (activeTab === 'cadastro') setCooperadosData(prev => prev.filter(item => !selectedItems.includes(item.id)));
    toast.success("Excluído!"); setSelectedItems([]); setIsModalOpen(false); setIsDeleteMode(false);
  };

  return (
    <div className="screen-container p-2">
      <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
        <div className="level is-mobile"><div className="level-left"><div className="buttons">
          <button className="button is-white mr-2" onClick={() => navigate(-1)}><MdArrowBack size={24} /></button>
          <span className="title is-4 mb-0" style={{ fontFamily: SCHIBSTED }}>Transportadora</span>
        </div></div></div>
      </div>

      <div className="tabs is-toggle is-fullwidth mb-0">
        <ul>
          <li className={activeTab === 'cadastro' ? 'is-active' : ''}><a onClick={() => setActiveTab('cadastro')}><span>Cooperados</span></a></li>
          <li className={activeTab === 'transportadora' ? 'is-active' : ''}><a onClick={() => setActiveTab('transportadora')}><span>Transportadoras</span></a></li>
          <li className={activeTab === 'agenda' ? 'is-active' : ''}><a onClick={() => setActiveTab('agenda')}><span>Agenda</span></a></li>
        </ul>
      </div>

      <div className="screen-content">
        {activeTab === 'cadastro' && (
          <div className="container is-fluid px-0">
            <div className="box mb-4">
              <div className="field is-grouped">
                <div className="control is-expanded"><input className="input" type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="control"><button className={`button ${isDeleteMode ? 'is-danger' : ''}`} onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedItems([]); }}><MdDelete /></button></div>
                <div className="control"><button className="button is-link" onClick={() => setIsCreateModalActive(true)}><MdPersonAdd /><span> Adicionar</span></button></div>
              </div>
            </div>
            {filteredCooperadosData.map(item => (
              <CooperadoListItem 
                key={item.id} 
                item={item} 
                isDeleteMode={isDeleteMode} 
                isSelected={selectedItems.includes(item.id)} 
                onSelectItem={handleSelectItem} 
                onContactItem={() => {setSelectedCooperado(item); setIsContactModalActive(true);}} 
                onEditItem={() => {setSelectedCooperado(item); setIsEditModalActive(true);}}
                // Props fictícias para satisfazer a interface
                onLocationItem={() => {}}
                onViewItem={() => {}}
                onCalendarItem={() => {}}
              />

            ))}
          </div>
        )}

        {/* ABA TRANSPORTADORA - Passando a função de abrir */}
        {activeTab === 'transportadora' && (
          <TransportadoraList 
            onShowSuccess={(t, m) => toast.success(`${t}: ${m}`)} 
            // onOpenAdd={() => setIsTransDrawerOpen(true)}

          />
        )}
      </div>

      {/* DRAWER TRANSPORTADORA (INDIVIDUAL) */}
      <TransportadoraDrawer 
        key={isTransDrawerOpen ? 'open' : 'closed'}
        isOpen={isTransDrawerOpen} 
        onClose={() => setIsTransDrawerOpen(false)} 
        onSave={(_: any) => {

          toast.success("Transportadora salva com sucesso!");
          setIsTransDrawerOpen(false);
          // loadData(); // Se quiser atualizar a lista
        }}
      />

      {/* DRAWER EXCLUIR REGISTRO */}
      <Drawer anchor="right" open={isModalOpen} onClose={() => setIsModalOpen(false)} sx={{ zIndex: 6000 }} PaperProps={{ sx: { width: 620, bgcolor: 'white', border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } }}>
        <Box sx={{ p: '16px 20px 24px 20px', bgcolor: 'white', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1 }}>
            <IconButton onClick={() => setIsModalOpen(false)} sx={{ p: 0 }}><CloseIcon /></IconButton>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 700, fontFamily: SCHIBSTED, lineHeight: 1.1 }}>EXCLUIR REGISTRO</Typography>
            <Typography sx={{ fontSize: 16, color: 'black', mt: 0.5, ...COMMON_FONT }}>Gestão de dados do sistema</Typography>
          </Box>
        </Box>
        <Box sx={{ px: '20px', pt: 4, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', pb: '40px' }}>
          <Typography sx={{ textAlign: 'justify', color: 'black', fontSize: 20, fontFamily: SCHIBSTED, fontWeight: '500', lineHeight: 1.6, letterSpacing: 0.15 }}>
            Ao excluir esse registro todas as informações associadas à ela serão removidas. 
            <br /><strong>Deseja continuar com a exclusão?</strong>
          </Typography>
        </Box>
        <Box sx={{ p: '24px 20px', bgcolor: 'white', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button variant="outlined" onClick={() => setIsModalOpen(false)} fullWidth sx={{ height: 48, fontFamily: SCHIBSTED, color: '#0072C3', borderColor: 'rgba(0, 114, 195, 0.50)', fontWeight: '500' }}>NÃO</Button>
          <Button variant="contained" onClick={handleConfirmDelete} fullWidth sx={{ height: 48, bgcolor: '#0072C3', fontFamily: SCHIBSTED, fontWeight: '500', boxShadow: 'none' }}>SIM</Button>
        </Box>
      </Drawer>

      <CooperadoContactModal isActive={isContactModalActive} onClose={() => setIsContactModalActive(false)} data={selectedCooperado} />
      <CooperadoEditModal isActive={isEditModalActive} onClose={() => setIsEditModalActive(false)} data={selectedCooperado} onSave={loadData} />
      <CooperadoCreateModal isActive={isCreateModalActive} onClose={() => setIsCreateModalActive(false)} onSave={loadData} />
    </div>
  );
};

export default Transportadora;