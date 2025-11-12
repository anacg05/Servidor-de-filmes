import React from 'react';
import './FilterBar.css';
import { XCircle, X } from 'lucide-react';

function FilterBar({ searchParams, setSearchParams, genres, handleClearFilters, onClose }) {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const currentGenre = searchParams.get('genre') || '';
  const currentYear = searchParams.get('ano') || '';

  return (
    /* O container do filtro agora é o próprio conteúdo do dropdown */
    <div className="filter-bar-content-dropdown"> {/* Renomeado para evitar conflito com CSS antigo */}
      
      <div className="filter-group">
        <label htmlFor="genre">Gênero</label>
        <select
          id="genre"
          name="genre"
          value={currentGenre}
          onChange={handleInputChange}
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
          value={currentYear}
          onChange={handleInputChange}
          className="year-input" 
        />
      </div>

      <div className="filter-bar-actions">
        <button className="filter-btn btn-clear" onClick={handleClearFilters}>
          <XCircle size={18} />
          Limpar
        </button>
        <button className="filter-btn btn-close" onClick={onClose}>
          <X size={18} />
          Fechar
        </button>
      </div>
      
    </div>
  );
}

export default FilterBar;