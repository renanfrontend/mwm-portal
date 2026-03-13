import React, { useState } from 'react';
import { Box, Typography, Link, Collapse, IconButton, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Close as CloseIcon, CheckCircleOutlined, Home as HomeIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
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
      
      <Box sx={{ mb: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}><HomeIcon sx={{ fontSize: '18px' }} /></Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex' }}><MoreHorizIcon sx={{ fontSize: '16px' }} /></Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: '16px', fontFamily: SCHIBSTED }}>Portaria / {activeTab === 0 ? 'Registro' : 'Histórico'}</Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', fontFamily: SCHIBSTED }}>Portaria</Typography>
      </Box>

      {/* ✅ ALERT COLADO NO PAPER */}
      <Collapse in={toastConfig.open}>
        <Box sx={{ alignSelf: 'stretch', p: '12px 16px', background: '#F1F9EE', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', mb: 0, border: '1px solid rgba(112, 191, 84, 0.2)', borderBottom: 'none' }}>
          <Box sx={{ pt: '4px', pr: '12px' }}><CheckCircleOutlined sx={{ color: '#70BF54', fontSize: '22px' }} /></Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#2F5023', fontSize: 16, fontWeight: 500, fontFamily: SCHIBSTED }}>{toastConfig.title}</Typography>
            <Typography sx={{ color: '#2F5023', fontSize: 14, fontFamily: SCHIBSTED }}>{toastConfig.message}</Typography>
          </Box>
          <IconButton onClick={() => setToastConfig(prev => ({ ...prev, open: false }))} size="small" sx={{ color: '#2F5023' }}><CloseIcon sx={{ fontSize: '20px' }} /></IconButton>
        </Box>
      </Collapse>

      <Paper elevation={0} sx={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PortariaList onSuccess={handleTriggerSuccess} onTabChange={setActiveTab} />
      </Paper>
    </Box>
  );
};

export default Portaria;