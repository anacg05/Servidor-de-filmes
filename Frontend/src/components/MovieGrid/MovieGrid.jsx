import React from 'react';
import { Link } from 'react-router-dom';
import './MovieGrid.css';

/* Grid responsivo usado nas listagens de filmes */
function MovieGrid({ movies }) {

  /* Gera o ID do filme (fallback se não existir id_filme) */
  const getMovieId = (movie) => {
    return movie.id_filme || movie.titulo.toLowerCase().replace(/ /g, '-');
  };

  /* Estado vazio */
  if (movies.length === 0) {
    return (
      <div className="no-results-container">
        <h2>Nenhum filme encontrado</h2>
        <p>Tente ajustar os termos da sua busca ou filtros.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {movies.map((movie) => (
        <Link
          key={movie.id_filme || movie.titulo}
          to={`/filme/${getMovieId(movie)}`}
          state={{ movie: movie }}
          className="grid-card"
        >
          <div className="movie-poster">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.titulo} />
            ) : (
              <div
                className="poster-placeholder"
                style={{ background: movie.gradient || "#1f2937" }}
              ></div>
            )}
            <div className="poster-overlay"></div>
          </div>

          <h3 className="movie-title">{movie.titulo}</h3>

          <div className="movie-info">
            <span className="movie-year">{movie.ano}</span>

            <div className="movie-rating">
              <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="rating-value">{movie.rating}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MovieGrid;
