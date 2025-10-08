import React from 'react';
import { MdDarkMode, MdLightMode, MdNotifications } from 'react-icons/md';
import useTheme from '../hooks/useTheme';

interface HeaderProps {
  children?: React.ReactNode;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          {children}
          <a className="navbar-item" href="#">
            <img src="/logo.png" alt="MWM Logo" width="112" height="28" />
          </a>
        </div>
        <div className="navbar-menu is-active"> {/* is-active para sempre mostrar em desktop */}
          <div className="navbar-start">
            <div className="navbar-item is-hidden-touch"> {/* Esconde em telas menores */}
              <div className={`button is-outlined ${theme === 'dark' ? 'is-primary' : ''}`}>Toledo - PR</div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-light" onClick={toggleTheme}>
                  <span className="icon">{theme === 'light' ? <MdDarkMode /> : <MdLightMode />}</span>
                </button>
                <button className="button is-light">
                  <span className="icon"><MdNotifications /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;