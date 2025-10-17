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

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'is-active' : ''}`} onClick={onClose}></div>
      <aside className={`menu sidebar-menu ${isOpen ? 'is-active' : ''}`}>
        <div className="menu-header">
          <img src={logo} alt="Logo MWM" className="sidebar-logo" />
          <button className="button is-light is-small is-pulled-right is-hidden-desktop" onClick={onClose}>
            <span className="icon"><MdClose /></span>
          </button>
        </div>
        <p className="menu-label">Menu</p>
        <ul className="menu-list">
          <li><NavLink to="/" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdDashboard /></span> Dashboard</NavLink></li>
          <li><NavLink to="/faturamentos" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdAttachMoney /></span> Faturamentos</NavLink></li>
          <li><NavLink to="/abastecimentos" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdLocalShipping /></span> Abastecimentos</NavLink></li>
          <li><NavLink to="/coleta" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdHandshake /></span> Coleta</NavLink></li>
          <li><NavLink to="/qualidade" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdBuild /></span> Qualidade</NavLink></li>
          <li><NavLink to="/cooperados" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdPeople /></span> Cooperados</NavLink></li>
          <li><NavLink to="/portaria" className={({isActive}) => "menu-item" + (isActive ? " is-active" : "")} onClick={onClose}><span className="icon"><MdMeetingRoom /></span> Portaria</NavLink></li>
        </ul>

        <div className="menu-footer">
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
          <div className="user-info">
            <p className="has-text-weight-bold">{user?.name || 'Usuário'}</p>
            <p className="is-size-7">{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;