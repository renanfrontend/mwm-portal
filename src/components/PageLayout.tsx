// src/components/PageLayout.tsx (Exemplo)

import React, { useState } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-wrapper">
      
      {/* 1. Header Fixo: A classe 'is-fixed-top' do Bulma já garante isso. */}
      <Header onMenuClick={toggleSidebar} />
      
      {/* 2. Sidebar (Gerenciado pelo estado) */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* 3. Wrapper do Conteúdo Principal com Ajuste de Padding */}
      {/* A classe 'main-content-wrapper' deve ser adicionada e definida no seu CSS */}
      <main className="main-content-wrapper">
        <div className="container is-fluid">
          {children}
        </div>
      </main>

    </div>
  );
};

export default PageLayout;