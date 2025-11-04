import React, { useRef } from "react";
import { Link } from "react-router-dom"; // 1. Importar Link
import "./MoviesCarousel.css";

function MoviesCarousel({ title, movies, seeAllLink }) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  // 2. Adicionar ID ao filme se não existir (para a URL)
  // O seu AddMovie.jsx cria um 'id' com Date.now(), o que é ótimo.
  // Se os filmes de ListarFilmes não tiverem, isso garante um fallback.
  const getMovieId = (movie) => {
    return movie.id || movie.title.toLowerCase().replace(/ /g, '-');
  };

  return (
    <section className="featured-section">
      {/* ... (cabeçalho da seção não muda) ... */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <svg
            className="section-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <h2 className="section-title">{title}</h2>
        </div>

        
      </div>

      {/* ===== CARROSSEL ===== */}
      <div className="carousel-container">
        <button className="arrow-btn left" onClick={scrollLeft}>
          ❮
        </button>

        <div className="movies-grid" ref={carouselRef}>
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              // 3. Envolver o card com o Link
              <Link
                key={index}
                to={`/filme/${getMovieId(movie)}`} // URL amigável
                state={{ movie: movie }} // Passa o objeto filme completo
                className="movie-card" // Mover a classe para o Link
              >
                <div className="movie-poster">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} />
                  ) : (
                    <div
                      className="poster-placeholder"
                      style={{
                        background: movie.gradient || "#1f2937",
                      }}
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
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="rating-value">{movie.rating}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-movies">Nenhum filme encontrado.</p>
          )}
        </div>

        <button className="arrow-btn right" onClick={scrollRight}>
          ❯
        </button>
      </div>
    </section>
  );
}

export default MoviesCarousel;