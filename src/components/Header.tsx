// src/components/Header.tsx

import React, { useState } from 'react';
import { MdNotifications, MdAccountCircle, MdLogout } from 'react-icons/md'; 
import { useAuth } from '../context/AuthContext'; 

interface HeaderProps {
  onMenuClick: () => void;
  children?: React.ReactNode;
}

const NotificationButton: React.FC = () => {
    const [notificationCount] = useState(3);
    return (
        <div style={{ position: 'relative' }}>
            <button className="button is-light is-small is-rounded is-flex is-align-items-center" onClick={() => {}} aria-label="Notificações">
                <span className="icon"><MdNotifications size={20} /></span>
            </button>
            {notificationCount > 0 && (
                <span className="tag is-danger is-rounded is-small" style={{ position: 'absolute', top: '-5px', right: '-5px', height: '1rem', minWidth: '1rem', padding: '0 0.25rem', fontSize: '0.65rem' }}>
                    {notificationCount}
                </span>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    // CORRIGIDO: position: relative (NÃO usar is-fixed-top)
    <nav 
      className="navbar" 
      role="navigation" 
      aria-label="main navigation"
      style={{ 
        borderBottom: '1px solid #dbdbdb', 
        flexShrink: 0, 
        position: 'relative', 
        zIndex: 10 
      }}
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          {children}
        </div>
      </div>

      <div className="navbar-menu" style={{ display: 'flex', flexGrow: 1, boxShadow: 'none', padding: 0 }}>
        <div className="navbar-start"></div>
        <div className="navbar-end">
            <div className="navbar-item is-flex is-align-items-center">
                <div className="mr-3"><NotificationButton /></div>
                <div className="dropdown is-right is-hoverable">
                    <div className="dropdown-trigger">
                        <button className="button is-light is-small is-rounded" aria-haspopup="true" aria-controls="dropdown-menu-user">
                            <span className="icon"><MdAccountCircle size={24} /></span>
                            <span className="ml-2 is-hidden-mobile">{user?.username || 'Usuário'}</span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu-user" role="menu">
                        <div className="dropdown-content">
                            <div className="dropdown-item">
                                <p className="has-text-weight-bold">{user?.username}</p>
                                <p className="is-size-7 has-text-grey">{user?.email}</p>
                            </div>
                            <hr className="dropdown-divider" />
                            <a href="/conta" className="dropdown-item">Minha Conta</a>
                            <hr className="dropdown-divider" />
                            <a onClick={logout} className="dropdown-item has-text-danger"><span className="icon mr-1"><MdLogout /></span>Sair</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;