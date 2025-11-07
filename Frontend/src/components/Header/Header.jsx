import React from 'react';
import { Link } from "react-router-dom";
import './Header.css';
import Icon from '../../assets/icon_64.png';

// IMPORTAÇÃO DOS ÍCONES
import { Home, Play, Plus, Filter, User } from 'lucide-react';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo">
            <img src={Icon} alt='Icone' />
            <span className="logo-text">GrizFlix</span>
          </div>

          <div className="search-wrapper">
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Buscar filmes..."
                className="search-input"
              />
            </div>
          </div>

          {/* ===== SEÇÃO NAV ATUALIZADA ===== */}
          <nav className="nav">
            <Link to="/" className="nav-link">
              <Home />
              Início
            </Link>

            <Link to="/listarfilmes" className="nav-link">
              <Play />
              Filmes
            </Link>

            <Link to="/adicionarfilme" className="nav-link">
              <Plus />
              Adicionar
            </Link>

            <Link to="/listarfilmes" className="nav-link">
              <Filter />
              Filtro
            </Link>

            <Link to="/login" className="nav-link">
              <User />
              Perfil
            </Link>
          </nav>
          
        </div>
      </div>
    </header>
  );
}

export default Header;