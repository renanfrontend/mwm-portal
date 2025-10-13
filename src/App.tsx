import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PageLayout from './components/PageLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';
import { MdMenu } from 'react-icons/md';

import Coleta from './screens/Coleta';
import Qualidade from './screens/Qualidade';
import Cooperados from './screens/Cooperados';
import Conta from './screens/Conta';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? <PageLayout>{children}</PageLayout> : <Navigate to="/login" />;
  };

  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={logout} />
      {isAuthenticated && (
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <button className="button is-light" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <span className="icon"><MdMenu /></span>
          </button>
        </Header>
      )}
      <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordScreen /></AuthRoute>} />
          <Route path="/new-password" element={<AuthRoute><NewPasswordScreen /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/faturamentos" element={<ProtectedRoute><Faturamentos /></ProtectedRoute>} />
          <Route path="/abastecimentos" element={<ProtectedRoute><Abastecimentos /></ProtectedRoute>} />
          <Route path="/abastecimento-report" element={<ProtectedRoute><AbastecimentoReport /></ProtectedRoute>} />
          <Route path="/coleta" element={<ProtectedRoute><Coleta /></ProtectedRoute>} />
          <Route path="/qualidade" element={<ProtectedRoute><Qualidade /></ProtectedRoute>} />
          <Route path="/cooperados" element={<ProtectedRoute><Cooperados /></ProtectedRoute>} />
          <Route path="/conta" element={<ProtectedRoute><Conta /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;