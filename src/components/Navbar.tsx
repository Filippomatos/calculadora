import React from 'react';
import './Navbar.css';

const categories = [
  { id: 'all', name: 'Todas' },
  { id: 'financeiro', name: 'Financeiro' },
  { id: 'utilidades', name: 'Utilidades' },
  { id: 'saude', name: 'Saúde' },
];

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectCategory, activeCategory }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`nav-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
