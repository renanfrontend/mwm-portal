import React, { useState } from 'react';
import { Box, Typography, Link, Collapse, IconButton, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  Close as CloseIcon, CheckCircle, Home as HomeIcon, 
  MoreHoriz as MoreHorizIcon 
} from '@mui/icons-material';
import { PortariaList } from '../components/PortariaList';

const commonFont = { fontFamily: 'Schibsted Grotesk', letterSpacing: '0.15px' };

const Portaria: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ title: '', message: '' });

  const handleTriggerSuccess = (title: string, message: string) => {
    setToastConfig({ title, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 8000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: '24px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
      
      {/* 🛡️ HEADER E BREADCRUMB NO PADRÃO LOGÍSTICA */}
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
          <Typography sx={{ color: 'black', fontSize: '16px', ...commonFont }}>Logística / Portaria</Typography>
        </Box>
        <Typography sx={{ fontSize: '48px', fontWeight: 400, color: 'black', ...commonFont }}>
          Portaria
        </Typography>
      </Box>

      {/* 🛡️ MENSAGEM DE SUCESSO INLINE (FORA DO CONTAINER) */}
      <Collapse in={showToast}>
        <Box sx={{ 
          bgcolor: '#F1F9EE', borderRadius: '4px', p: '12px 16px', mb: 3,
          display: 'flex', alignItems: 'flex-start', gap: 2, border: '1px solid rgba(112, 191, 84, 0.2)' 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#2F5023', fontSize: 16, fontWeight: 500, ...commonFont }}>{toastConfig.title}</Typography>
            <Typography sx={{ color: '#2F5023', fontSize: 14, ...commonFont, opacity: 0.8 }}>{toastConfig.message}</Typography>
          </Box>
          <IconButton onClick={() => setShowToast(false)} size="small" sx={{ color: '#2F5023' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Collapse>

      {/* 🛡️ CONTAINER BRANCO (Paper elevation 1) */}
      <Paper elevation={0} sx={{ 
        flex: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '4px', 
        bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.20), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)'
      }}>
        <PortariaList onSuccess={handleTriggerSuccess} />
      </Paper>
    </Box>
  );
};

export default Portaria;