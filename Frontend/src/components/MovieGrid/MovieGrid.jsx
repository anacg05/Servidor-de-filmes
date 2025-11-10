import React from 'react';
import { Link } from 'react-router-dom';
import './MovieGrid.css';
// ⭐ MUDANÇA: Removemos a importação do CSS do carrossel
// import '../MoviesCarousel/MoviesCarousel.css'; 

function MovieGrid({ movies }) {
  // (Função getMovieId permanece a mesma)
  const getMovieId = (movie) => {
    return movie.id_filme || movie.titulo.toLowerCase().replace(/ /g, '-');
  };

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
          // ⭐ MUDANÇA: Classe renomeada de 'movie-card' para 'grid-card'
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
              <svg
                className="star-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
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