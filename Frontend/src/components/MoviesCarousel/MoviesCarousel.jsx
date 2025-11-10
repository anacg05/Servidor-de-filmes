import React, { useRef } from "react";
import { Link } from "react-router-dom"; 
import "./MoviesCarousel.css";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

function MoviesCarousel({ title, movies, seeAllLink }) {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const getMovieId = (movie) => {
    return movie.id_filme || movie.titulo.toLowerCase().replace(/ /g, '-');
  };

  return (
    <section className="featured-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <Play className="section-icon" />
          <h2 className="section-title">{title}</h2>
        </div>
      </div>

      {/* ===== CARROSSEL ===== */}
      <div className="carousel-container">
        <button className="arrow-btn left" onClick={scrollLeft}>
          <ChevronLeft size={40} />
        </button>

        <div className="movies-grid" ref={carouselRef}>
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              
              <Link
                key={index}
                to={`/filme/${getMovieId(movie)}`} 
                state={{ movie: movie }} 
                className="movie-card" 
              >
                <div className="movie-poster">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.titulo} />
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

                <h3 className="movie-title">{movie.titulo}</h3>

                <div className="movie-info">
                  <span className="movie-year">{movie.ano}</span>
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
          <ChevronRight size={40} />
        </button>
      </div>
    </section>
  );
}

export default MoviesCarousel;