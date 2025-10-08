import React from 'react';
import { Link } from 'react-router-dom';
import {
  MdDashboard,
  MdOutlineCloudUpload,
  MdOutlineVerified,
  MdLocalGasStation,
  MdPeople,
  MdAccountCircle,
  MdExitToApp,
} from 'react-icons/md';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
      <aside className="menu">
        <ul className="menu-list">
          <li>
            <Link to="/" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdDashboard />
              </span>
              <span>PAINEL</span>
            </Link>
          </li>
          <li>
            <Link to="/coleta" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdOutlineCloudUpload />
              </span>
              <span>COLETA</span>
            </Link>
          </li>
          <li>
            <Link to="/qualidade" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdOutlineVerified />
              </span>
              <span>QUALIDADE</span>
            </Link>
          </li>
          <li>
            <Link to="/abastecimentos" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdLocalGasStation />
              </span>
              <span>ABASTECIMENTO</span>
            </Link>
          </li>
          <li>
            <Link to="/cooperados" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdPeople />
              </span>
              <span>COOPERADOS</span>
            </Link>
          </li>
          <li className="sidebar-divider"></li>
          <li>
            <Link to="/conta" className="sidebar-item" onClick={onClose}>
              <span className="icon is-medium">
                <MdAccountCircle />
              </span>
              <span>CONTA</span>
            </Link>
          </li>
          <li>
            <a className="sidebar-item" onClick={onLogout}>
              <span className="icon is-medium">
                <MdExitToApp />
              </span>
              <span>SAIR</span>
            </a>
          </li>
        </ul>
      </aside>
      <div className="sidebar-footer">
        <small className="has-text-grey">Versão 1.0</small>
      </div>
    </div>
  );
};

export default Sidebar;