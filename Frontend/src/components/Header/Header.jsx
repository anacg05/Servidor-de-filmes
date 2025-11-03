import React from 'react';
import { Link } from "react-router-dom";
import './Header.css';
import Icon from '../../assets/icon_64.png'

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

          <nav className="nav">
            <Link to="/" className="nav-link active">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon-home">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 
                6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              Início
            </Link>

            <Link to="/listarfilmes" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon-play">
                <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 
              0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/><path d="M7 21h10" />
                <rect width="20" height="14" x="2" y="3" rx="2" />
              </svg>
              Filmes
            </Link>

            <Link to="/adicionarfilme" className="nav-link active">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon-add">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
              Adicionar
            </Link>


            <Link to="/login">
              <button className="login-buttonn">
                <svg xmlns="http://www.w3.org/2000/svg" 
                width="28" height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="user-icon">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M20 21a8 8 0 0 0-16 0"/>
                  </svg>
                <span>Login</span>
              </button>
            </Link>


            <Link to="/cadastro">
              <button className="register-button">
                <svg xmlns="http://www.w3.org/2000/svg" 
                width="28" height="28" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="register-icon">
                  <path d="M2 21a8 8 0 0 1 13.292-6"/>
                  <circle cx="10" cy="8" r="5"/>
                  <path d="M19 16v6"/><path d="M22 19h-6"/>
                  </svg>
                <span>Cadastro</span>
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
