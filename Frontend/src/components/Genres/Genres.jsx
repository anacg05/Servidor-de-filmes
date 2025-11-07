import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Genres.css';
// MUDANÇA: Importar a função da API
import { getGeneros } from '../../services/api';

function Genres() {
  // MUDANÇA: Estado para armazenar os gêneros da API
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MUDANÇA: useEffect para buscar os gêneros da API na montagem
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const response = await getGeneros();
        
        // ⭐ MUDANÇA AQUI: Removemos o .slice(0, 9)
        // Agora, todos os gêneros (20) serão exibidos.
        setGenres(response.data); 
        
      } catch (err) {
        console.error("Erro ao buscar gêneros:", err);
        setError("Não foi possível carregar os gêneros.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []); // Roda apenas uma vez

  if (loading) {
    return (
      <section className="genres-section">
        <h2 className="genres-title">Explorar por Gênero</h2>
        <div className="genres-container">
          <p>Carregando gêneros...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="genres-section">
        <h2 className="genres-title">Explorar por Gênero</h2>
        <div className="genres-container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="genres-section">
      <h2 className="genres-title">Explorar por Gênero</h2>
      <div className="genres-container">
        {/* Mapeia os gêneros vindos do estado */}
        {genres.map((genre) => (
          <Link
            key={genre.id_genero || genre.genero} // Usa a chave da API
            to="/listarfilmes"
            state={{ genre: genre.genero }} // Passa o nome do gênero
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