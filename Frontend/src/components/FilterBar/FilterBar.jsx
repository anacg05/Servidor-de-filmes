import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { XCircle, Search } from 'lucide-react'; 

function FilterBar({ searchParams, setSearchParams, genres, handleClearFilters, onClose }) {
  
  /*
    1. Bloco de Estado Local:
    Isto corrige o bug de "não conseguir digitar" E o bug do "género".
  */
  const [localFilters, setLocalFilters] = useState({
    genre: searchParams.get('genre') || '',
    year: searchParams.get('ano') || ''
  });

  /*
    2. Sincronização:
    Se a URL mudar (ex: por uma busca no Header),
    o estado local é atualizado para refletir isso.
  */
  useEffect(() => {
    setLocalFilters({
      genre: searchParams.get('genre') || '',
      year: searchParams.get('ano') || ''
    });
  }, [searchParams]);

  /*
    3. handleLocalChange:
    Atualiza APENAS o estado local (tanto para 'genre' como 'year').
  */
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  /*
    4. handleFilterSubmit:
    Chamado pelo botão "Filtrar".
  */
  const handleFilterSubmit = () => {
    const newParams = new URLSearchParams(searchParams);
    
    // Define o Gênero (ou remove se estiver vazio)
    if (localFilters.genre) {
      newParams.set('genre', localFilters.genre);
    } else {
      newParams.delete('genre');
    }
    
    // Define o Ano (ou remove se estiver vazio)
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
          value={localFilters.genre} // Lê do estado local
          onChange={handleLocalChange} // Atualiza o estado local
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
          value={localFilters.year} // Lê do estado local
          onChange={handleLocalChange} // Atualiza o estado local
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