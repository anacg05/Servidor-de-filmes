import React from 'react';
import { Link } from 'react-router-dom';
import './MovieGrid.css';
import '../MoviesCarousel/MoviesCarousel.css'; // Reutiliza o CSS do movie-card

function MovieGrid({ movies }) {
  // Função para criar um ID amigável (copiada do seu MoviesCarousel)
  const getMovieId = (movie) => {
    return movie.id || movie.title.toLowerCase().replace(/ /g, '-');
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
          key={movie.id || movie.title}
          to={`/filme/${getMovieId(movie)}`}
          state={{ movie: movie }}
          className="movie-card" // Reutiliza o card do carrossel
        >
          <div className="movie-poster">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} />
            ) : (
              <div
                className="poster-placeholder"
                style={{ background: movie.gradient || "#1f2937" }}
              ></div>
            )}
            <div className="poster-overlay"></div>
          </div>

          <h3 className="movie-title">{movie.title}</h3>

          <div className="movie-info">
            <span className="movie-year">{movie.year}</span>
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