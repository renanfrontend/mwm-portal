// src/App.tsx

import React, { useState } from 'react'; // Importa o React completo
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Seus imports de telas
import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Coleta from './screens/Coleta';
import Qualidade from './screens/Qualidade';
import Cooperados from './screens/Cooperados';
import Conta from './screens/Conta';
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';

// Seus imports de componentes e contextos
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PageLayout from './components/PageLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MdMenu } from 'react-icons/md';

// Componente interno que gerencia o layout principal (sua estrutura original)
const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Rota protegida que renderiza o layout da página (sua estrutura original)
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    // O PageLayout que eu tinha removido e causado problemas, agora de volta
    return <PageLayout>{children}</PageLayout>; 
  };

  // Rota de autenticação (sua estrutura original)
  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
  };

  return (
    <>
      {isAuthenticated && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={logout} />
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <button className="button is-light" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <span className="icon"><MdMenu /></span>
            </button>
          </Header>
        </>
      )}
      <div className={`app-container ${isAuthenticated && isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordScreen /></AuthRoute>} />
          <Route path="/new-password" element={<AuthRoute><NewPasswordScreen /></AuthRoute>} />
          
          {/* Rotas Protegidas */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/faturamentos" element={<ProtectedRoute><Faturamentos /></ProtectedRoute>} />
          <Route path="/abastecimentos" element={<ProtectedRoute><Abastecimentos /></ProtectedRoute>} />
          <Route path="/abastecimento-report" element={<ProtectedRoute><AbastecimentoReport /></ProtectedRoute>} />
          <Route path="/coleta" element={<ProtectedRoute><Coleta /></ProtectedRoute>} />
          <Route path="/qualidade" element={<ProtectedRoute><Qualidade /></ProtectedRoute>} />
          <Route path="/cooperados" element={<ProtectedRoute><Cooperados /></ProtectedRoute>} />
          <Route path="/conta" element={<ProtectedRoute><Conta /></ProtectedRoute>} />
          
          {/* Rota de fallback para redirecionar para a home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

// Componente principal App que envolve tudo com os providers (sua estrutura original)
function App() {
  return (
    // Router sem o `basename` que estava causando problema
    <Router>
      <AuthProvider>
        <ThemeProvider>
          {/* O container de notificações fica aqui, dentro de todos os providers */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;