import React from 'react';

const Header = () => {
  return (
    <nav className="navbar has-background-white" role="navigation" aria-label="main navigation" style={{borderBottom: '1px solid #dbdbdb'}}>
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item" href="#">
            <h1 className="title is-4">MWM</h1>
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
              <div className="buttons">
                <button className="button is-light"><span className="icon"><span className="material-symbols-outlined">notifications</span></span></button>
                <button className="button is-light"><span className="icon"><span className="material-symbols-outlined">menu</span></span></button>
                <button className="button has-background-grey-lighter"><span className="icon"><span className="material-symbols-outlined">filter_list</span></span><span>Filtrar</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;