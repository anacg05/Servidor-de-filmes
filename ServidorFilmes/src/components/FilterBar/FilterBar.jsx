import React from 'react';
import { Link } from 'react-router-dom';
import './FilterBar.css';
import { Search, ArrowLeft, XCircle } from 'lucide-react';

function FilterBar({ filters, setFilters, genres, years, handleClearFilters }) {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="filter-panel-container">
      {/* --- CABEÇALHO DO PAINEL DE FILTRO --- */}
      <div className="filter-panel-header">
        <h1 className="filter-panel-title">Encontre Seu Próximo Filme</h1>
        
        {/* --- BOTÕES DE AÇÃO --- */}
        <div className="filter-panel-actions">
          <Link to="/" className="filter-btn btn-back">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <button className="filter-btn btn-clear" onClick={handleClearFilters}>
            <XCircle size={18} />
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* --- GRID DE FILTROS --- */}
      <div className="filter-grid">
        {/* --- Filtro de Busca (Texto) --- */}
        <div className="filter-group search-filter">
          <label htmlFor="searchTerm">Buscar</label>
          <div className="search-input-wrapper">
            <Search size={18} className="search-filter-icon" />
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              placeholder="Buscar por título, ator ou diretor..."
              value={filters.searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* --- Filtro de Gênero --- */}
        <div className="filter-group">
          <label htmlFor="genre">Gênero</label>
          <select
            id="genre"
            name="genre"
            value={filters.genre}
            onChange={handleInputChange}
          >
            <option value="">Todos os Gêneros</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* --- Filtro de Ano --- */}
        <div className="filter-group">
          <label htmlFor="year">Ano</label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleInputChange}
          >
            <option value="">Todos os Anos</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;