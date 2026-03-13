import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, CssBaseline } from '@mui/material';

// Telas
import React from 'react';
const Dashboard = React.lazy(() => import('./screens/Dashboard'));
const Logistica = React.lazy(() => import('./screens/Logistica'));
const Portaria = React.lazy(() => import('./screens/Portaria'));
const Faturamentos = React.lazy(() => import('./screens/Faturamentos'));
const Abastecimentos = React.lazy(() => import('./screens/Abastecimentos'));
const AbastecimentoReport = React.lazy(() => import('./screens/AbastecimentoReport'));
const Coleta = React.lazy(() => import('./screens/Coleta'));
const Qualidade = React.lazy(() => import('./screens/Qualidade'));
const Conta = React.lazy(() => import('./screens/Conta'));
const LoginScreen = React.lazy(() => import('./screens/auth/LoginScreen'));
const ForgotPasswordScreen = React.lazy(() => import('./screens/auth/ForgotPasswordScreen'));
const NewPasswordScreen = React.lazy(() => import('./screens/auth/NewPasswordScreen'));
const Monitoramento = React.lazy(() => import('./screens/Monitoramento'));

// Componentes e Contextos
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Mantendo sua importação original

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  // Sidebar inicia sempre colapsado (false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <React.Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/new-password" element={<NewPasswordScreen />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </React.Suspense>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box component="aside" sx={{ 
          width: isSidebarOpen ? '260px' : '64px', 
          transition: 'width 0.3s ease', 
          flexShrink: 0,
          borderRight: '1px solid #E8E9EE',
          bgcolor: '#FFF'
        }}>
          <Sidebar isOpen={isSidebarOpen} />
        </Box>

        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 2, lg: 2, xl: 3 }, 
          bgcolor: '#f5f7fa',
          overflowY: 'auto', 
          minWidth: 0,
          height: '100%'
        }}>
          <React.Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* ROTAS DE LOGÍSTICA: Agora mapeadas para não redirecionar para a Home */}
              <Route path="/logistica" element={<Logistica />} />
              <Route path="/transportadoras" element={<Logistica />} />
              <Route path="/agenda" element={<Logistica />} />
              <Route path="/portaria" element={<Portaria />} />
              <Route path="/abastecimentos" element={<Abastecimentos />} />
              <Route path="/abastecimento-report" element={<AbastecimentoReport />} />
              <Route path="/faturamentos" element={<Faturamentos />} />
              <Route path="/monitoramento" element={<Monitoramento />} />
              <Route path="/coleta" element={<Coleta />} />
              <Route path="/qualidade" element={<Qualidade />} />
              <Route path="/conta" element={<Conta />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </React.Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default function App() {
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