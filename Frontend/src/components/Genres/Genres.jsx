import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Genres.css';
import { Film } from 'lucide-react';
import { getGeneros } from '../../services/api';

/* Componente que exibe e direciona navegação por gêneros */
function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Busca lista de gêneros ao carregar o componente */
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const response = await getGeneros();
        setGenres(response.data);
      } catch (err) {
        console.error("Erro ao buscar gêneros:", err);
        setError("Não foi possível carregar os gêneros.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  /* Estado de carregamento */
  if (loading) {
    return (
      <section className="genres-section">
        <h2 className="genres-title">
          <Film />
          Explorar por Gênero
        </h2>
        <div className="genres-container">
          <p>Carregando gêneros...</p>
        </div>
      </section>
    );
  }

  /* Estado de erro */
  if (error) {
    return (
      <section className="genres-section">
        <h2 className="genres-title">
          <Film />
          Explorar por Gênero
        </h2>

        <div className="genres-container">
          <p className="error-text">{error}</p>
        </div>
      </section>
    );
  }

  /* Conteúdo principal */
  return (
    <section className="genres-section">
      <h2 className="genres-title">
        <Film />
        Explorar por Gênero
      </h2>

      <div className="genres-container">
        {genres.map(genre => (
          <Link
            key={genre.id_genero || genre.genero}
            to={`/listarfilmes?genero=${genre.genero}`}
            className="genre-button"
          >
            {genre.genero}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Genres;
