import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
import AbastecimentoReport from './screens/AbastecimentoReport';
import Header from './components/Header'; // Importe o Header para ter a navegação

function App() {
  return (
    <Router>
      <Header />
      <nav className="tabs is-fullwidth">
        <div className="container">
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/faturamentos">Faturamentos</Link></li>
            <li><Link to="/abastecimentos">Abastecimentos</Link></li>
            <li><Link to="/abastecimento-report">Relatório de Abastecimento</Link></li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/faturamentos" element={<Faturamentos />} />
        <Route path="/abastecimentos" element={<Abastecimentos />} />
        <Route path="/abastecimento-report" element={<AbastecimentoReport />} />
      </Routes>
    </Router>
  );
}

export default App;