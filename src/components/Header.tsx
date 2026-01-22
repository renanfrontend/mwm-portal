import React, { useState } from 'react';
import { Box, IconButton, Stack, Typography, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// Ícones Oficiais MUI
import MenuIcon from '@mui/icons-material/Menu';
import PlaceIcon from '@mui/icons-material/Place';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { logout } = useAuth();
  const { toggleTheme } = useTheme(); 
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  return (
    <Box sx={{
      height: 64, 
      bgcolor: '#0072C3', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      px: 3,
      justifyContent: 'space-between',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.20)',
      width: '100%',
      zIndex: 1300
    }}>
      <Stack direction="row" alignItems="center">
        <IconButton onClick={onMenuClick} sx={{ color: 'white' }}>
          <MenuIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <PlaceIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, fontFamily: 'Schibsted Grotesk' }}>
            Toledo-PR
          </Typography>
        </Stack>
        
        {/* Ícone mantido visualmente, mas com função neutra agora */}
        <IconButton onClick={toggleTheme} sx={{ color: 'white', p: 0, opacity: 0.8 }}>
          <Brightness4Icon sx={{ fontSize: 22 }} />
        </IconButton>
        
        <IconButton onClick={handleOpen} sx={{ color: 'white', p: 0 }}>
          <AccountCircleIcon sx={{ fontSize: 32 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          disableScrollLock
          PaperProps={{
            elevation: 3,
            sx: {
              mt: '12px',
              minWidth: '150px',
              borderRadius: '4px',
              padding: '4px 0',
              '& .MuiList-root': { padding: 0 },
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} to="/conta" onClick={handleClose} sx={{ py: '12px', px: '16px', gap: '12px' }}>
            <ListItemIcon sx={{ minWidth: 'auto !important', color: 'rgba(0,0,0,0.54)' }}>
              <ManageAccounts sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Schibsted Grotesk', fontWeight: 400 }}>
              Perfil
            </Typography>
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ py: '12px', px: '16px', gap: '12px' }}>
            <ListItemIcon sx={{ minWidth: 'auto !important', color: 'rgba(0,0,0,0.54)' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Schibsted Grotesk', fontWeight: 400 }}>
              Sair
            </Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;