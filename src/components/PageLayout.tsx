// src/components/PageLayout.tsx

import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    // Wrapper simples que garante 100% de altura para a tela interna
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
};

export default PageLayout;