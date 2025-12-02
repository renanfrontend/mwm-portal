// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Coleta from './screens/Coleta';
import Qualidade from './screens/Qualidade';
import Transportadora from './screens/Transportadora';
import Conta from './screens/Conta';
import Portaria from './screens/Portaria';
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PageLayout from './components/PageLayout'; // Usamos o PageLayout simples
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MdMenu } from 'react-icons/md';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  // Sidebar inicia aberto em desktop, fechado em mobile pode ser ajustado via CSS media query se precisar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <PageLayout>{children}</PageLayout>;
  };

  const AuthRoute = ({ children }: { children: React.ReactElement }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordScreen /></AuthRoute>} />
        <Route path="/new-password" element={<AuthRoute><NewPasswordScreen /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    // LAYOUT PRINCIPAL FLEXBOX
    <div className="is-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f5f7fa' }}>
      
      {/* Sidebar Container com transição de largura */}
      <div style={{ 
        width: isSidebarOpen ? '260px' : '0px', 
        transition: 'width 0.3s ease', 
        overflow: 'hidden', 
        height: '100%', 
        flexShrink: 0, 
        borderRight: '1px solid #dbdbdb',
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#fff'
      }}>
        <Sidebar />
      </div>

      {/* Coluna da Direita: Header + Conteúdo da Página */}
      <div className="is-flex is-flex-direction-column is-flex-grow-1" style={{ height: '100%', minWidth: 0, position: 'relative' }}>
        
        {/* Header (Fixo no topo desta coluna) */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}>
           <button className="button is-light is-small" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="icon"><MdMenu /></span>
           </button>
        </Header>

        {/* Área Principal onde as telas são renderizadas (As telas gerenciam seu próprio scroll) */}
        <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transportadora" element={<ProtectedRoute><Transportadora /></ProtectedRoute>} />
            <Route path="/cooperados" element={<Navigate to="/transportadora" replace />} />
            <Route path="/abastecimentos" element={<ProtectedRoute><Abastecimentos /></ProtectedRoute>} />
            <Route path="/abastecimento-report" element={<ProtectedRoute><AbastecimentoReport /></ProtectedRoute>} />
            <Route path="/faturamentos" element={<ProtectedRoute><Faturamentos /></ProtectedRoute>} />
            <Route path="/coleta" element={<ProtectedRoute><Coleta /></ProtectedRoute>} />
            <Route path="/qualidade" element={<ProtectedRoute><Qualidade /></ProtectedRoute>} />
            <Route path="/portaria" element={<ProtectedRoute><Portaria /></ProtectedRoute>} />
            <Route path="/conta" element={<ProtectedRoute><Conta /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastContainer position="top-right" autoClose={5000} theme="colored"/>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;