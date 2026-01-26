import React, { useState } from 'react';
import { Box, IconButton, Stack, Typography, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PlaceIcon from '@mui/icons-material/Place';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
  const { logout } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      height: 64, bgcolor: '#0072C3', color: 'white', display: 'flex', 
      alignItems: 'center', pr: 3, justifyContent: 'space-between', zIndex: 1300 
    }}>
      <Stack direction="row" alignItems="center" sx={{ height: '100%' }}>
        <Box sx={{ 
          width: isSidebarOpen ? '260px' : '64px', 
          display: 'flex', 
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          pl: isSidebarOpen ? 2.5 : 0, 
          transition: 'all 0.3s ease' 
        }}>
          <IconButton onClick={onMenuClick} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Stack>

      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <PlaceIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, fontFamily: 'Schibsted Grotesk' }}>Toledo-PR</Typography>
        </Stack>
        <IconButton onClick={toggleTheme} sx={{ color: 'white' }}><Brightness4Icon /></IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'white' }}><AccountCircleIcon sx={{ fontSize: 32 }} /></IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: '12px', minWidth: '150px' } }}>
          <MenuItem component={Link} to="/conta" onClick={() => setAnchorEl(null)}>
            <ListItemIcon><ManageAccounts fontSize="small" /></ListItemIcon>
            <Typography>Perfil</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <Typography>Sair</Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
};

export default Header;