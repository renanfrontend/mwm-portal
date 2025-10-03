import React from 'react';
import { MdDarkMode, MdLightMode, MdNotifications, MdMenu, MdFilterList } from 'react-icons/md';
import useTheme from '../hooks/useTheme';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav className="navbar has-background-white" role="navigation" aria-label="main navigation" style={{ borderBottom: '1px solid #dbdbdb' }}>
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">
            <img src="/logo.png" alt="MWM Logo" width="112" height="28" />
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-start">
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
                <button className="button is-light"><span className="icon"><MdMenu /></span></button>
                <button className="button is-light"><span className="icon"><MdFilterList /></span><span>Filtrar</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;