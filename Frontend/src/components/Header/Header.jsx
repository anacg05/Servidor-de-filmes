import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import './Header.css';

import Icon from '../../assets/icon_64.png';
import { Home, User, LogOut } from 'lucide-react';

import { useAuth } from '../../auth/AuthContext';
import FilterBar from '../FilterBar/FilterBar';

function Header({ 
  onFilterToggle, 
  isFilterActive = false, 
  isFilterPage = false,
  filterProps = {} 
}) { 
  
  /* Estado da busca principal */
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* Controle do dropdown de perfil */
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  /* Referências para cliques externos */
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterDropdownRef = useRef(null);

  /* Fecha dropdowns ao clicar fora */
  useEffect(() => {
    function handleClickOutside(event) {

      if (profileButtonRef.current?.contains(event.target)) return;
      if (filterButtonRef.current?.contains(event.target)) return;

      if (isProfileDropdownOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      
      if (isFilterPage && isFilterActive && 
          filterDropdownRef.current && 
          !filterDropdownRef.current.contains(event.target)) {
        onFilterToggle(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);

  }, [isProfileDropdownOpen, isFilterPage, isFilterActive, onFilterToggle]);


  /* Logout */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Submissão da barra de busca */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    /* Atualiza URL se estiver na página de filtros */
    if (isFilterPage && filterProps.setSearchParams) {
      const newParams = new URLSearchParams(filterProps.searchParams);
      newParams.set('busca', term);
      filterProps.setSearchParams(newParams);
    } else {
      navigate(`/listarfilmes?busca=${term}`);
    }

    setSearchTerm('');
  };

  const homePath = '/home';

  return (
    <header className="header">

      {/* NAV SUPERIOR */}
      <div className="header-container">
        <div className="header-content">

          {/* Logo */}
          <div className="logo">
            <img src={Icon} alt="Ícone" />
            <span className="logo-text">GrizFlix</span>
          </div>

          {/* Barra de busca principal */}
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

          {/* Navegação principal */}
          <nav className="nav">
            <NavLink to={homePath} className="nav-link" end>
              <Home />
              Início
            </NavLink>

            {/* Perfil */}
            <div className="profile-dropdown-wrapper">
              <button 
                ref={profileButtonRef}
                className="nav-button nav-link"
                onClick={() => setIsProfileDropdownOpen(prev => !prev)}
              >
                <User />
                Perfil
              </button>

              {isProfileDropdownOpen && (
                <div ref={dropdownRef} className="profile-dropdown-menu">
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={18} /> Sair
                  </button>
                </div>
              )}
            </div>
          </nav>

        </div>
      </div>

      {/* SUB-NAV */}
      <div className="sub-nav-container">
        <nav className="sub-nav">

          {/* Opções diferentes para admin e usuário */}
          {user?.type === 'admin' ? (
            <NavLink to="/admin/solicitacoes" className="sub-nav-link">
              Ver Solicitações
            </NavLink>
          ) : (
            <NavLink to="/adicionarfilme" className="sub-nav-link">
              Cadastrar Filme
            </NavLink>
          )}

          <NavLink to="/listarfilmes" className="sub-nav-link" end>
            Todos os Filmes
          </NavLink>

          {/* Dropdown de filtros */}
          <div className="filter-dropdown-wrapper">
            <NavLink 
              ref={filterButtonRef}
              to="/listarfilmes"
              state={{ openFilter: true }}
              className={`sub-nav-link ${isFilterActive ? 'active' : ''}`}
              onClick={(e) => {
                if (onFilterToggle) {
                  e.preventDefault();
                  onFilterToggle(!isFilterActive);
                }
              }}
            >
              Busca por Filtro
            </NavLink>

            {isFilterPage && isFilterActive && (
              <div ref={filterDropdownRef} className="filter-dropdown-menu">
                <FilterBar {...filterProps} />
              </div>
            )}
          </div>

        </nav>
      </div>

    </header>
  );
}

export default Header;
