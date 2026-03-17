import React, { useState } from 'react';
import { Box, Typography, Link, Collapse, IconButton, Paper } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { 
  Close as CloseIcon, 
  CheckCircleOutlined, 
  ErrorOutline,
  Home as HomeIcon, 
  MoreHoriz as MoreHorizIcon 
} from '@mui/icons-material';
import { PortariaList } from '../components/PortariaList';

const SCHIBSTED = 'Schibsted Grotesk, sans-serif';

const Portaria: React.FC = () => {
  const [toastConfig, setToastConfig] = useState({ open: false, title: '', message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0); 

  const handleTriggerToast = (title: string, message: string, severity: 'success' | 'error' = 'success') => {
    setToastConfig({ open: true, title, message, severity });
    setTimeout(() => setToastConfig(prev => ({ ...prev, open: false })), 6000);
  };

  const isSuccess = toastConfig.severity === 'success';

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      p: '8px 24px 12px 24px', // 🛡️ Proporção exata da Logistica.tsx
      bgcolor: '#F5F5F5', 
      overflow: 'hidden' 
    }}>
      
      {/* 🛡️ HEADER & BREADCRUMBS (Sincronizado com Logistica.tsx) */}
      <Box sx={{ mb: '2px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 0.2 }}>
          <Link component={NavLink} to="/" sx={{ display: 'flex', color: 'rgba(0, 0, 0, 0.54)' }}>
            <HomeIcon sx={{ fontSize: '18px' }} />
          </Link>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Box sx={{ bgcolor: '#F3F4F5', px: '6px', py: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center' }}>
            <MoreHorizIcon sx={{ fontSize: '16px', color: 'rgba(0,0,0,0.54)' }} />
          </Box>
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>/</Typography>
          <Typography sx={{ color: 'black', fontSize: 14, fontFamily: SCHIBSTED }}>
            Portaria / {activeTab === 0 ? 'Registro' : 'Histórico'}
          </Typography>
        </Box>
        <Typography sx={{ 
          color: 'black', 
          fontSize: 48, 
          fontFamily: SCHIBSTED, 
          fontWeight: '400', 
          lineHeight: '56.02px' 
        }}>
          Portaria
        </Typography>
      </Box>

      {/* 🛡️ ALERT PADRONIZADO (SEM GAP) */}
      <Collapse in={toastConfig.open}>
        <Box sx={{ width: '100%', mb: 0 }}>
          <Box sx={{ 
            px: 2, py: '6px', 
            background: isSuccess ? '#F1F9EE' : '#FFF4F4', 
            borderRadius: '4px 4px 0 0', 
            display: 'flex', 
            border: '1px solid rgba(0,0,0,0.12)', 
            borderBottom: 'none', 
            alignItems: 'center' 
          }}>
            <Box sx={{ pr: 1.5, display: 'flex' }}>
              {isSuccess ? 
                <CheckCircleOutlined sx={{ fontSize: 22, color: '#70BF54' }} /> : 
                <ErrorOutline sx={{ fontSize: 22, color: '#D32F2F' }} />
              }
            </Box>
            <Box sx={{ flex: 1, py: 1 }}>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 16, fontFamily: SCHIBSTED, fontWeight: 500 }}>
                {toastConfig.title}
              </Typography>
              <Typography sx={{ color: isSuccess ? '#2F5023' : '#5F2120', fontSize: 14, fontFamily: SCHIBSTED }}>
                {toastConfig.message}
              </Typography>
            </Box>
            <IconButton onClick={() => setToastConfig(p => ({ ...p, open: false }))} size="small">
              <CloseIcon sx={{ fontSize: 20, color: isSuccess ? '#2F5023' : '#5F2120' }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>

      <Paper 
        elevation={0} 
        sx={{ 
          flex: 1, 
          border: '1px solid rgba(0,0,0,0.12)', 
          borderTop: toastConfig.open ? 'none' : '1px solid rgba(0,0,0,0.12)',
          borderRadius: toastConfig.open ? '0 0 4px 4px' : '4px', 
          bgcolor: '#FFFFFF', 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden' 
        }}
      >
        <PortariaList onSuccess={handleTriggerToast} onTabChange={setActiveTab} />
      </Paper>
    </Box>
  );
};

export default Portaria;