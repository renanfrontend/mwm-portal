import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, Tooltip, ListItemButton } from '@mui/material';
import { NavLink } from 'react-router-dom';

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
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFF' }}>
      <Box sx={{ p: isOpen ? '24px' : '12px', display: 'flex', justifyContent: 'center', minHeight: '80px' }}>
        <img src={logoMwm} alt="Logo" style={{ width: isOpen ? '140px' : '40px', transition: 'width 0.3s ease' }} />
      </Box>

      <List disablePadding>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: isOpen ? 'initial' : 'center',
                px: 2.5,
                color: '#666',
                textDecoration: 'none',
                '&.active': {
                  bgcolor: 'rgba(0, 114, 195, 0.08)',
                  color: '#0072C3',
                  borderLeft: '4px solid #0072C3',
                  '& .MuiListItemIcon-root': { color: '#0072C3' },
                },
              }}
            >
              <Tooltip title={!isOpen ? item.text : ""} placement="right">
                <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 3 : 'auto', justifyContent: 'center', color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {isOpen && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '16px', fontFamily: 'Schibsted Grotesk' }} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;