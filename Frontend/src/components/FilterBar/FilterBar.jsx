import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { XCircle, Search } from 'lucide-react'; 

/* Barra de filtros usada na página de listagem */
function FilterBar({ searchParams, setSearchParams, genres, handleClearFilters, onClose }) {

  /* Estado local para edição dos filtros antes de aplicar */
  const [localFilters, setLocalFilters] = useState({
    genre: searchParams.get('genre') || '',
    year: searchParams.get('ano') || ''
  });

  /* Sincroniza o estado local caso a URL seja alterada externamente */
  useEffect(() => {
    setLocalFilters({
      genre: searchParams.get('genre') || '',
      year: searchParams.get('ano') || ''
    });
  }, [searchParams]);

  /* Atualiza apenas o estado local */
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  /* Aplica os filtros na URL */
  const handleFilterSubmit = () => {
    const newParams = new URLSearchParams(searchParams);

    if (localFilters.genre) newParams.set('genre', localFilters.genre);
    else newParams.delete('genre');

    if (localFilters.year) newParams.set('ano', localFilters.year);
    else newParams.delete('ano');

    setSearchParams(newParams);
    onClose(); 
  };

  return (
    <div className="filter-bar-content-dropdown">
      
      <div className="filter-group">
        <label htmlFor="genre">Gênero</label>
        <select
          id="genre"
          name="genre"
          value={localFilters.genre}
          onChange={handleLocalChange}
        >
          <option value="">Todos os Gêneros</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="year">Ano</label>
        <input
          type="number"
          id="year"
          name="year"
          placeholder="Ex: 2023"
          min="1888"
          max="2099"
          value={localFilters.year}
          onChange={handleLocalChange}
          className="year-input"
        />
      </div>

      <div className="filter-bar-actions">
        <button className="filter-btn btn-clear" onClick={handleClearFilters}>
          <XCircle size={18} />
          Limpar
        </button>
        <button className="filter-btn btn-filter" onClick={handleFilterSubmit}>
          <Search size={18} />
          Filtrar
        </button>
      </div>
      
    </div>
  );
}

export default FilterBar;
