import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import './Header.css';
import Icon from '../../assets/icon_64.png'
import { Home, User, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import FilterBar from '../FilterBar/FilterBar';

function Header({ 
  onFilterToggle, 
  isFilterActive = false, 
  isFilterPage = false,
  filterProps = {}
}) { 
  
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  /* Novo Ref para o botão do filtro (para fechar ao clicar fora) */
  const filterButtonRef = useRef(null);
  /* Novo Ref para o dropdown do filtro (para fechar ao clicar fora) */
  const filterDropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      const isClickOnProfileDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const isClickOnProfileButton = profileButtonRef.current && profileButtonRef.current.contains(event.target);
      const isClickOnFilterDropdown = filterDropdownRef.current && filterDropdownRef.current.contains(event.target);
      const isClickOnFilterButton = filterButtonRef.current && filterButtonRef.current.contains(event.target);


      // Fecha dropdown de perfil
      if (!isClickOnProfileDropdown && !isClickOnProfileButton) {
        setIsProfileDropdownOpen(false);
      }
      // Fecha dropdown de filtro (se não for um clique no próprio filtro ou no botão)
      if (isFilterPage && !isClickOnFilterDropdown && !isClickOnFilterButton) {
        onFilterToggle(false); // Assume que onFilterToggle pode receber um estado ou alternar
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, profileButtonRef, filterDropdownRef, filterButtonRef, isFilterPage, onFilterToggle]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
      navigate(`/listarfilmes?busca=${searchTerm.trim()}`);
      setSearchTerm('');
    }
  };

  const homePath = user?.type === 'admin' ? '/admin' : '/home';


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
            <NavLink to={homePath} className="nav-link" end>
              <Home />
              Início
            </NavLink>
            
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
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/notifications" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    <Bell size={18} /> Notification
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    <Settings size={18} /> Settings
                  </Link>
                   <Link to="/help" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    <HelpCircle size={18} /> Help
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <div className="sub-nav-container">
        <nav className="sub-nav">
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
          
          {/* MUDANÇA AQUI: Wrap o NavLink em um div para posicionamento */}
          <div className="filter-dropdown-wrapper">
            <NavLink 
              ref={filterButtonRef} /* Atribuir ref ao botão de filtro */
              to="/listarfilmes" 
              state={{ openFilter: true }}
              className={({ isActive }) => 
                `sub-nav-link ${isFilterActive ? 'active' : ''}`
              }
              onClick={(e) => {
                if (onFilterToggle) {
                  e.preventDefault(); 
                  onFilterToggle(!isFilterActive); // Alterna o estado (agora no Header)
                }
              }}
            >
              Busca por Filtro
            </NavLink>

            {/* Renderiza o FilterBar AQUI se for a página de filtro e o filtro estiver ativo */}
            {isFilterPage && isFilterActive && (
              <div ref={filterDropdownRef} className="filter-dropdown-menu">
                <FilterBar {...filterProps} />
              </div>
            )}
          </div> {/* Fim de .filter-dropdown-wrapper */}
        </nav>
      </div>
    </header>
  );
}

export default Header;