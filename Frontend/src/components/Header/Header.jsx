import React, { useState } from 'react'; 
import { Link, NavLink, useNavigate } from "react-router-dom";
import './Header.css';
import Icon from '../../assets/icon_64.png'
import { Home, User } from 'lucide-react';

function Header({ onFilterToggle, isFilterActive = false }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
      navigate(`/listarfilmes?busca=${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <img src={Icon} alt='Icone' />
            <span className="logo-text">GrizFlix</span>
          </div>

          <form className="search-wrapper" onSubmit={handleSearchSubmit}>
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, ator ou diretor..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
            </div>
          </form>

          <nav className="nav">
            <NavLink to="/" className="nav-link" end>
              <Home />
              Início
            </NavLink>
            <NavLink to="/login" className="nav-link">
              <User />
              Perfil
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="sub-nav-container">
        <nav className="sub-nav">
          <NavLink to="/adicionarfilme" className="sub-nav-link">
            Cadastrar Filme
          </NavLink>
          <NavLink to="/listarfilmes" className="sub-nav-link" end>
            Todos os Filmes
          </NavLink>
          
          <NavLink 
            to="/listarfilmes" 
            state={{ openFilter: true }}
            className={({ isActive }) => 
              `sub-nav-link ${isFilterActive ? 'active' : ''}`
            }
            
            onClick={(e) => {
              if (onFilterToggle) {
                e.preventDefault(); 
                onFilterToggle();
              }
            }}
          >
            Busca por Filtro
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;