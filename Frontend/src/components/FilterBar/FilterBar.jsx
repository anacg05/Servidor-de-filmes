import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { XCircle, Search } from 'lucide-react'; 

function FilterBar({ searchParams, setSearchParams, genres, handleClearFilters, onClose }) {
  
  // Estado local do filtro
  const [localFilters, setLocalFilters] = useState({
    genre: searchParams.get('genero') || '',
    year: searchParams.get('ano') || ''
  });

  // Sincroniza estado local quando a URL muda
  useEffect(() => {
    setLocalFilters({
      genre: searchParams.get('genero') || '',
      year: searchParams.get('ano') || ''
    });
  }, [searchParams]);

  // Atualiza apenas o estado local
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza os parâmetros da URL e fecha o dropdown
  const handleFilterSubmit = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Define o Gênero (ou remove se vazio)
    if (localFilters.genre) {
      newParams.set('genero', localFilters.genre); 
    } else {
      newParams.delete('genero'); 
    }
    
    // Define o Ano (ou remove se vazio)
    if (localFilters.year) {
      newParams.set('ano', localFilters.year);
    } else {
      newParams.delete('ano');
    }
    
    setSearchParams(newParams); // Atualiza a URL (dispara a pesquisa)
    onClose(); // Fecha o dropdown
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
