import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css';

const categories = {
  todas: 'Todas',
  financeiro: 'Financeiro',
  utilidades: 'Utilidades',
  saude: 'Saúde',
};

const calculators = {
  financeiro: [
    { id: 'juros', name: 'Calculadora de Juros', rota: '/calculadora-juros', emoji: '💰' },
    { id: 'emprestimo', name: 'Calculadora de Empréstimo', rota: '/calculadora-emprestimo', emoji: '🏦' },
    { id: 'investimento', name: 'Calculadora de Investimento', rota: '/calculadora-investimento', emoji: '📈' },
    { id: 'desconto', name: 'Calculadora de Desconto', rota: '/calculadora-desconto', emoji: '💸' },
  ],
  utilidades: [
    { id: 'conversao', name: 'Conversor de Moedas', rota: '/calculadora-conversao', emoji: '💱' },
  ],
  saude: [
    { id: 'gravidez', name: 'Calculadora de Gravidez', rota: '/calculadora-gravidez', emoji: '👶' },
  ],
};

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof categories>('todas');
  const navigate = useNavigate();

  const handleSelectCategory = (category: keyof typeof categories) => {
    setActiveCategory(category);
  };

  const calculatorsToDisplay = activeCategory === 'todas'
    ? Object.values(calculators).flat()
    : calculators[activeCategory] || [];

  return (
    <div className="home-container container">
      <div className="home-hero">
        <h1 className="home-title">Calculadoras Inteligentes</h1>
        <p className="home-subtitle">Escolha uma categoria e foque no que importa. Resultados claros, sem complicação.</p>
      </div>

      <nav className="calculadoras-grid categories" aria-label="Categorias de calculadoras">
        {Object.keys(categories).map((category) => (
          <div
            key={category}
            className={`calculadora-card ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleSelectCategory(category as keyof typeof categories)}
          >
            <h3 className="calculadora-titulo">{categories[category as keyof typeof categories]}</h3>
          </div>
        ))}
      </nav>

      <main className="calculadoras-grid cards-grid" aria-label="Lista de calculadoras">
        {calculatorsToDisplay.map((calc) => (
          <div key={calc.id} className="calculadora-card" onClick={() => navigate(calc.rota)}>
            <span className="calculadora-emoji">{calc.emoji}</span>
            <h3 className="calculadora-titulo">{calc.name}</h3>
          </div>
        ))}
      </main>

      <div className="home-footer">
        <p>Mais calculadoras em breve!</p>
      </div>
    </div>
  );
};

export default Home;