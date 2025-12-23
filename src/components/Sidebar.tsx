// src/components/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { MdDashboard, MdBusiness, MdEvStation, MdAssignment, MdAttachMoney, MdSettings, MdExitToApp, MdScience } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';

// --- IMPORTAÇÃO DO LOGO (CORREÇÃO ERRO 404 AZURE) ---
import logoMwm from '../../logo.png'; 

export default function Sidebar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="menu p-4" style={{ height: '100%', overflowY: 'auto', backgroundColor: theme === 'dark' ? '#1f2937' : '#fff' }}>
      <div className="mb-5 px-2">
        {/* Usando a variável importada ao invés do caminho fixo */}
        <img src={logoMwm} alt="MWM Logo" style={{ maxWidth: '140px' }} />
      </div>
      
      <p className="menu-label">Geral</p>
      <ul className="menu-list">
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdDashboard /></span>Dashboard</NavLink></li>
        <li><NavLink to="/logistica" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdBusiness /></span>Logística</NavLink></li>
        <li><NavLink to="/portaria" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdAssignment /></span>Portaria</NavLink></li>
        <li><NavLink to="/qualidade" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdScience /></span>Qualidade</NavLink></li>
      </ul>
      
      <p className="menu-label">Operacional</p>
      <ul className="menu-list">
        <li><NavLink to="/abastecimentos" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdEvStation /></span>Abastecimentos</NavLink></li>
      </ul>
      <p className="menu-label">Financeiro</p>
      <ul className="menu-list">
        <li><NavLink to="/faturamentos" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdAttachMoney /></span>Faturamentos</NavLink></li>
      </ul>
      <p className="menu-label">Configurações</p>
      <ul className="menu-list">
        <li><NavLink to="/conta" className={({ isActive }) => isActive ? 'is-active' : ''}><span className="icon"><MdSettings /></span>Conta</NavLink></li>
        <li><a onClick={logout}><span className="icon"><MdExitToApp /></span>Sair</a></li>
      </ul>
      <div className="mt-auto pt-4 px-2">
        <button className="button is-small is-fullwidth is-rounded" onClick={toggleTheme}>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</button>
      </div>
    </aside>
  );
}