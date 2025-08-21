import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CalculadoraJuros from './components/CalculadoraJuros';
import CalculadoraEmprestimo from './components/CalculadoraEmprestimo';
import CalculadoraInvestimento from './components/CalculadoraInvestimento';
import CalculadoraConversao from './components/CalculadoraConversao';
import CalculadoraDesconto from './components/CalculadoraDesconto';
import CalculadoraGravidez from './components/CalculadoraGravidez';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header className="site-header">
          <div className="header-inner">
            <Link to="/" className="brand">
              <span className="logo">∑</span>
              <span className="brand-name">Calculadoras</span>
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculadora-juros" element={<CalculadoraJuros />} />
                            <Route path="/calculadora-emprestimo" element={<CalculadoraEmprestimo />} />
                  <Route path="/calculadora-investimento" element={<CalculadoraInvestimento />} />
                  <Route path="/calculadora-conversao" element={<CalculadoraConversao />} />
                  <Route path="/calculadora-desconto" element={<CalculadoraDesconto />} />
                  <Route path="/calculadora-gravidez" element={<CalculadoraGravidez />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;