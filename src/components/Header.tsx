// CORRIGIDO: Removido 'useContext' (TS6133)
import React, { useState } from 'react';
// Importações necessárias para ícones
import { MdNotifications, MdMenu, MdAccountCircle } from 'react-icons/md'; 
// Use a importação REAL do seu contexto de autenticação:
import { useAuth } from '../context/AuthContext'; 

interface HeaderProps {
  onMenuClick: () => void;
  children?: React.ReactNode; // ADICIONADO: Necessário pelo App.tsx
}

const NotificationButton: React.FC = () => {
    // Contador de notificações
    const [notificationCount] = useState(3);
    
    return (
        <div style={{ position: 'relative' }}>
            {/* Botão de Notificações */}
            <button 
                className="button is-light is-small is-rounded is-flex is-align-items-center" 
                onClick={() => {/* Lógica para abrir notificações */}} 
                aria-label="Notificações"
            >
                <span className="icon">
                    <MdNotifications size={24} />
                </span>
            </button>
            {notificationCount > 0 && (
                <span className="tag is-danger is-rounded is-small" style={{ position: 'absolute', top: '-5px', right: '-5px', height: '1.25rem', minWidth: '1.25rem', padding: '0 0.25rem', fontSize: '0.7rem', lineHeight: '1.25rem', zIndex: 10 }}>
                    {notificationCount}
                </span>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  // Chamada REAL do hook de autenticação (sem mock)
  const { user, logout } = useAuth();

  return (
    <nav className="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
      <div className="container is-fluid">
        
        <div className="navbar-brand is-flex is-align-items-center" style={{ width: '100%', justifyContent: 'space-between' }}>
            
            {/* Lado Esquerdo: Logo MWM (Pill da unidade removida) */}
            <div className="is-flex is-align-items-center">
                
                <a className="navbar-item is-paddingless" href="#" style={{ padding: '0 0.75rem' }}>
                    <img 
                      src="/logo.png" 
                      alt="MWM Logo" 
                      width="112" 
                      height="28" 
                      style={{ maxHeight: '2.5rem' }} 
                    />
                </a>
            </div>

            {/* Lado Direito: Notificações + Menu Toggle */}
            <div className="is-flex is-align-items-center">
                
                <div className="navbar-item is-paddingless mr-3">
                    <NotificationButton />
                </div>

                <div className="navbar-item is-paddingless">
                    <button 
                        className="button is-light is-small is-flex is-align-items-center" 
                        onClick={onMenuClick}
                        aria-label="Alternar Menu"
                    >
                        <span className="icon"><MdMenu size={24} /></span>
                    </button>
                </div>
            </div>
        </div>
        
        {/* Navbar Menu: Lado Direito (Usuário/Logout) */}
        <div id="navbarBasicExample" className="navbar-menu is-hidden-touch">
            <div className="navbar-start">
            </div>
            
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons are-small is-align-items-center">
                        
                        {/* Dropdown de Usuário/Logout */}
                        <div className="dropdown is-right is-hoverable">
                            <div className="dropdown-trigger">
                                {/* Botão de Avatar */}
                                <button 
                                    className="button is-light is-small is-flex is-align-items-center" 
                                    aria-haspopup="true" 
                                    aria-controls="dropdown-menu-user"
                                >
                                    <span className="icon"><MdAccountCircle size={24} /></span>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu-user" role="menu">
                                <div className="dropdown-content">
                                    {/* Informações do Usuário no topo do dropdown */}
                                    <div className="dropdown-item has-text-weight-semibold">
                                        {/* CORRIGIDO: user.name para user.username (TS2339) */}
                                        {user?.username || 'Usuário'}
                                        <p className="is-size-7 has-text-grey">{user?.email}</p>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <a href="/conta" className="dropdown-item">Minha Conta</a>
                                    <hr className="dropdown-divider" />
                                    {/* Opção de Logout */}
                                    <a onClick={logout} className="dropdown-item">Sair</a>
                                </div>
                            </div>
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