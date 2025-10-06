import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Header from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from "./screens/auth/LoginScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import NewPasswordScreen from "./screens/auth/NewPasswordScreen";

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AuthRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? <Navigate to="/" /> : children;
  };

  return (
    <>
      {isAuthenticated && <Header />}
      {isAuthenticated && (
        <nav className="tabs is-fullwidth">
          <div className="container">
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/faturamentos">Faturamentos</Link></li>
              <li><Link to="/abastecimentos">Abastecimentos</Link></li>
              <li><Link to="/abastecimento-report">Relatório de Abastecimento</Link></li>
              <li><a onClick={logout}>Sair</a></li>
            </ul>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordScreen /></AuthRoute>} />
        <Route path="/new-password" element={<AuthRoute><NewPasswordScreen /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/faturamentos" element={<ProtectedRoute><Faturamentos /></ProtectedRoute>} />
        <Route path="/abastecimentos" element={<ProtectedRoute><Abastecimentos /></ProtectedRoute>} />
        <Route path="/abastecimento-report" element={<ProtectedRoute><AbastecimentoReport /></ProtectedRoute>} />
      </Routes>
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