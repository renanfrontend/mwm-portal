// src/components/PageLayout.tsx

import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    // Garante que o layout interno da rota tenha espaço para crescer (100% height)
    // e não adiciona scroll aqui (o scroll será na .screen-content)
    <div className="layout-wrapper" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <div className="container is-fluid p-0" style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;