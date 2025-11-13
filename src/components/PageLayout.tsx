// src/components/PageLayout.tsx (Corrigido)

import React from 'react';
// REMOVIDOS: Header, Outlet, Sidebar, useState (não são mais necessários aqui)

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  // REMOVIDOS: 'isSidebarOpen' e 'toggleSidebar'
  
  return (
    <div className="layout-wrapper">
      
      {/* REMOVIDOS: O <Header> e <Sidebar> foram removidos */}
      {/* App.tsx agora controla o Header e o Sidebar */}
      {/* Este componente é apenas o wrapper do conteúdo principal */}
      <main className="main-content-wrapper">
        <div className="container is-fluid">
          {children}
        </div>
      </main>

    </div>
  );
};

export default PageLayout;