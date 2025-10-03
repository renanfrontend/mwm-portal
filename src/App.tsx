import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import Faturamentos from './screens/Faturamentos';
import Abastecimentos from './screens/Abastecimentos';
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
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/faturamentos" element={<Faturamentos />} />
        <Route path="/abastecimentos" element={<Abastecimentos />} />
      </Routes>
    </Router>
  );
}

export default App;