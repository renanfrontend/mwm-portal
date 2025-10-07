import React from 'react';
import { MdDarkMode, MdLightMode, MdNotifications } from 'react-icons/md';
import useTheme from '../hooks/useTheme';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">
            <img src="/logo.png" alt="MWM Logo" width="112" height="28" />
          </a>
          <div className="navbar-item is-hidden-desktop">
            {children}
          </div>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item is-hidden-touch">
              {children}
            </div>
            <div className="navbar-item">
              <div className="button is-outlined">Toledo - PR</div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <button className="button is-light mr-2" onClick={toggleTheme}>
                <span className="icon">
                  {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
                </span>
              </button>
              <div className="buttons are-small">
                <button className="button is-light"><span className="icon"><MdNotifications /></span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;