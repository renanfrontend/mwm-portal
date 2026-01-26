import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Tooltip, ListItemButton } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

import DashboardSharp from '@mui/icons-material/DashboardSharp';
import Business from '@mui/icons-material/Business';
import Assignment from '@mui/icons-material/Assignment';
import WorkspacePremium from '@mui/icons-material/WorkspacePremium';
import LocalGasStation from '@mui/icons-material/LocalGasStation';
import AttachMoney from '@mui/icons-material/AttachMoney';

import logoMwm from '../../logo.png'; 

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { text: 'Painel', icon: <DashboardSharp />, path: '/' },
  { text: 'Logística', icon: <Business />, path: '/logistica' },
  { text: 'Portaria', icon: <Assignment />, path: '/portaria' },
  { text: 'Qualidade', icon: <WorkspacePremium />, path: '/qualidade' },
  { text: 'Abastecimento', icon: <LocalGasStation />, path: '/abastecimentos' },
  { text: 'Faturamento', icon: <AttachMoney />, path: '/faturamentos' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFF' }}>
      <Box sx={{ 
        p: isOpen ? '24px' : '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80px' 
      }}>
        <img src={logoMwm} alt="Logo MWM" style={{ 
          width: isOpen ? '140px' : '36px', height: 'auto', maxHeight: '40px', objectFit: 'contain', transition: 'all 0.3s ease' 
        }} />
      </Box>

      <List disablePadding sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  minHeight: 48,
                  transition: 'all 0.2s ease',
                  width: isOpen ? 'calc(100% - 16px)' : 'auto',
                  borderRadius: isOpen ? '4px' : '0px',
                  padding: isOpen ? '8px 12px' : '4px',
                  justifyContent: isOpen ? 'initial' : 'center',
                  mx: 'auto',
                  color: '#666',
                  bgcolor: 'transparent',
                  textDecoration: 'none',
                  // Estilo quando ABERTO
                  '&.active': isOpen ? {
                    bgcolor: 'rgba(0, 114, 195, 0.08)',
                    color: '#0072C3',
                    '& .MuiListItemIcon-root': { color: '#0072C3' },
                  } : {},
                  '&:hover': { bgcolor: 'rgba(0, 114, 195, 0.04)' }
                }}
              >
                <Tooltip title={!isOpen ? item.text : ""} placement="right">
                  {/* CÍRCULO ESTILO GEMINI: 40x40px com background apenas no ícone */}
                  <Box sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    width: isOpen ? 'auto' : '40px',
                    height: isOpen ? 'auto' : '40px',
                    borderRadius: isOpen ? '0px' : '100px', // Redondo 100%
                    mr: isOpen ? 2 : 0,
                    bgcolor: (!isOpen && isActive) ? 'rgba(0, 114, 195, 0.08)' : 'transparent',
                    color: isActive ? '#0072C3' : 'inherit',
                    transition: 'all 0.2s ease'
                  }}>
                    <ListItemIcon sx={{ minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'inherit' }}>
                      {React.isValidElement(item.icon) 
                        ? React.cloneElement(item.icon as React.ReactElement<any>, { sx: { fontSize: '24px' } }) 
                        : item.icon}
                    </ListItemIcon>
                  </Box>
                </Tooltip>
                {isOpen && (
                  <ListItemText primary={item.text} primaryTypographyProps={{ 
                    fontSize: '15px', fontFamily: 'Schibsted Grotesk', fontWeight: 500, color: isActive ? '#0072C3' : 'inherit'
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;