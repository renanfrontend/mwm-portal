import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="section">
      <div className="container is-fluid">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;