import React, { useState } from 'react';
import { Box, Typography, Link, Collapse, IconButton, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  Close as CloseIcon, 
  CheckCircleOutlined, 
  Home as HomeIcon, 
  MoreHoriz as MoreHorizIcon 
} from '@mui/icons-material';
import { PortariaList } from '../components/PortariaList';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const Portaria: React.FC = () => {
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '' });
  const [activeTab, setActiveTab] = useState(0); 

  const handleTriggerSuccess = (title: string, message: string) => {
    setToastConfig({ open: true, title, message });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 8000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      
      {/* 🛡️ BREADCRUMBS */}
      <Box sx={{ alignSelf: 'stretch', mb: '12px', flexDirection: 'column', display: 'flex', gap: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}>
            <HomeIcon sx={{ fontSize: '18px' }} />
          </Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}>
            <MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} />
          </Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '16px', fontFamily: SCHIBSTED }}>
             Portaria / {activeTab === 0 ? 'Registro' : 'Histórico'}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', fontFamily: SCHIBSTED }}>
          Portaria
        </Typography>
      </Box>

      {/* 🛡️ SUCESSO PADRONIZADO */}
      <Collapse in={toastConfig.open}>
        <Box sx={{ 
          alignSelf: 'stretch', p: '6px 16px', background: '#F1F9EE', 
          borderRadius: '4px', display: 'flex', alignItems: 'flex-start', mb: 3, overflow: 'hidden',
          border: '1px solid rgba(112, 191, 84, 0.2)'
        }}>
          <Box sx={{ pt: '7px', pb: '7px', pr: '12px', display: 'flex' }}>
            <CheckCircleOutlined sx={{ color: '#70BF54', fontSize: '22px' }} />
          </Box>
          <Box sx={{ flex: '1 1 0', pt: '8px', pb: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography sx={{ color: '#2F5023', fontSize: 16, fontWeight: 500, lineHeight: '24px', fontFamily: SCHIBSTED }}>
              {toastConfig.title}
            </Typography>
            <Typography sx={{ color: '#2F5023', fontSize: 14, fontWeight: 400, lineHeight: '20.02px', fontFamily: SCHIBSTED }}>
              {toastConfig.message}
            </Typography>
          </Box>
          <Box sx={{ pt: '4px', pl: '16px', display: 'flex' }}>
            <IconButton onClick={() => setToastConfig(prev => ({ ...prev, open: false }))} size="small" sx={{ p: '5px', color: '#2F5023' }}>
              <CloseIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)' }}>
        <PortariaList onSuccess={handleTriggerSuccess} onTabChange={setActiveTab} />
      </Paper>
    </Box>
  );
};

export default Portaria;