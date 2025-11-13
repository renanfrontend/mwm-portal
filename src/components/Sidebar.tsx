// src/components/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';
import {
  MdDashboard,
  MdLocalShipping,
  MdPeople,
  MdAttachMoney,
  MdExitToApp,
  MdLightMode,
  MdDarkMode,
  MdClose,
  MdBuild,
  MdHandshake,
  MdMeetingRoom
} from 'react-icons/md';
import logo from '../../logo.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Mapeamento das cores direto do theme.css
  const colors = {
    light: {
      bg: '#ffffff',             // --sidebar-bg
      text: '#363636',            // --sidebar-text
      subtitle: '#7a7a7a',        // --subtitle-color
      hover: 'rgba(0, 0, 0, 0.05)', // --sidebar-hover
      divider: 'rgba(0, 0, 0, 0.1)' // --sidebar-divider
    },
    dark: {
      bg: '#1a202c',              // --sidebar-bg
      text: '#fff',               // --sidebar-text
      subtitle: '#a0aec0',         // --subtitle-color
      hover: 'rgba(255, 255, 255, 0.1)', // --sidebar-hover
      divider: 'rgba(255, 255, 255, 0.3)' // --sidebar-divider
    }
  };

  const currentColors = colors[theme]; 

  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: currentColors.text, 
    backgroundColor: isActive ? currentColors.hover : 'transparent',
  });

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} onClick={onClose}></div>
      <aside 
        className={`menu sidebar-menu ${isOpen ? 'is-active' : ''}`}
        // 1. BG no container principal
        style={{ 
          backgroundColor: currentColors.bg,
          display: 'flex', // Garantir o layout flex
          flexDirection: 'column' // Garantir o layout flex
        }}
      >
        {/* 2. CORREÇÃO: BG no header */}
        <div className="menu-header" style={{ backgroundColor: currentColors.bg }}>
          <img src={logo} alt="Logo MWM" className="sidebar-logo" />
          <button className="button is-light is-small is-pulled-right is-hidden-desktop" onClick={onClose}>
            <span className="icon"><MdClose /></span>
          </button>
        </div>
        
        {/* 3. CORREÇÃO: BG e Cor no label "Menu" */}
        <p 
          className="menu-label" 
          style={{ 
            color: currentColors.subtitle, 
            backgroundColor: currentColors.bg // Aplicando BG aqui também
          }}
        >
          Menu
        </p>

        {/* 4. CORREÇÃO: BG na lista do menu (<ul>) */}
        <ul className="menu-list" style={{ backgroundColor: currentColors.bg }}>
          <li><NavLink to="/" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdDashboard /></span> Dashboard</NavLink></li>
          <li><NavLink to="/faturamentos" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdAttachMoney /></span> Faturamentos</NavLink></li>
          <li><NavLink to="/abastecimentos" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdLocalShipping /></span> Abastecimentos</NavLink></li>
          <li><NavLink to="/coleta" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdHandshake /></span> Coleta</NavLink></li>
          <li><NavLink to="/qualidade" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdBuild /></span> Qualidade</NavLink></li>
          <li><NavLink to="/cooperados" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdPeople /></span> Cooperados</NavLink></li>
          <li><NavLink to="/portaria" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} style={getNavLinkStyle} onClick={onClose}><span className="icon"><MdMeetingRoom /></span> Portaria</NavLink></li>
        </ul>

        {/* 5. CORREÇÃO: BG, Borda e Margin no footer */}
        <div 
          className="menu-footer" 
          style={{ 
            backgroundColor: currentColors.bg, 
            borderTop: `1px solid ${currentColors.divider}`, // Borda correta
            marginTop: 'auto' // Para empurrar para baixo
          }}
        >
          <div className="field">
            <p className="control">
              <button className="button is-fullwidth" onClick={toggleTheme}>
                <span className="icon">{theme === 'light' ? <MdDarkMode /> : <MdLightMode />}</span>
                <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
              </button>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-fullwidth" onClick={onLogout}>
                <span className="icon"><MdExitToApp /></span>
                <span>Sair</span>
              </button>
            </p>
          </div>
          
          <div className="user-info" style={{ color: currentColors.text }}>
            {/* CORREÇÃO: Alterado de user?.name para user?.username */}
            <p className="has-text-weight-bold">{user?.username || 'Usuário'}</p>
            <p className="is-size-7" style={{ color: currentColors.subtitle }}>{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;