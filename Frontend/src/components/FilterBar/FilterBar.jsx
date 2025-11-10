import React from 'react';
import './FilterBar.css';
import { XCircle, X } from 'lucide-react';

// ⭐ 1. Recebe 'searchParams' e 'setSearchParams' em vez de 'filters' e 'setFilters'
function FilterBar({ searchParams, setSearchParams, genres, handleClearFilters, onClose }) {
  
  // ⭐ 2. Lógica para atualizar a URL quando um filtro muda
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Cria uma cópia dos parâmetros atuais da URL
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      // Define o novo valor (ex: ano=2023)
      newParams.set(name, value);
    } else {
      // Remove o parâmetro se o valor for vazio (ex: "Todos os Gêneros")
      newParams.delete(name);
    }
    
    // Atualiza a URL
    setSearchParams(newParams);
  };

  // ⭐ 3. Os inputs agora leem seus valores direto da URL
  const currentGenre = searchParams.get('genre') || '';
  const currentYear = searchParams.get('ano') || '';

  return (
    <div className="filter-bar-container">
      
      <div className="filter-bar-grid">
        {/* --- Filtro de Gênero --- */}
        <div className="filter-group">
          <label htmlFor="genre">Gênero</label>
          <select
            id="genre"
            name="genre"
            value={currentGenre} // Lendo da URL
            onChange={handleInputChange} // Atualizando a URL
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
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Ex: 2023"
            min="1888"
            max="2099"
            value={currentYear} // Lendo da URL
            onChange={handleInputChange} // Atualizando a URL
            className="year-input" 
          />
        </div>
      </div>

      <div className="filter-bar-actions">
        {/* handleClearFilters agora limpa a URL */}
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