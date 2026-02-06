import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, CssBaseline } from '@mui/material';

// Telas
import Dashboard from './screens/Dashboard';
import Logistica from './screens/Logistica';
import Portaria from './screens/Portaria';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Coleta from './screens/Coleta';
import Qualidade from './screens/Qualidade';
import Conta from './screens/Conta';
import LoginScreen from './screens/auth/LoginScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import NewPasswordScreen from './screens/auth/NewPasswordScreen';

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
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/new-password" element={<NewPasswordScreen />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
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
            <Route path="/coleta" element={<Coleta />} />
            <Route path="/qualidade" element={<Qualidade />} />
            <Route path="/conta" element={<Conta />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
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