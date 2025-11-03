import React from 'react';
  
function FeaturedMovies() {
  const movies = [
    { title: 'Oppenheimer', year: 2023, rating: 8.5, gradient: 'linear-gradient(to bottom right, #ea580c, #dc2626)' },
    { title: 'Barbie', year: 2023, rating: 7.8, gradient: 'linear-gradient(to bottom right, #ec4899, #db2777)' },
    { title: 'Dune: Part Two', year: 2024, rating: 9.0, gradient: 'linear-gradient(to bottom right, #a16207, #c2410c)' },
    { title: 'The Batman', year: 2022, rating: 8.2, gradient: 'linear-gradient(to bottom right, #1f2937, #000000)' },
    { title: 'Poor Things', year: 2023, rating: 8.1, gradient: 'linear-gradient(to bottom right, #9333ea, #2563eb)' },
    { title: 'Killers of the Flower Moon', year: 2023, rating: 7.9, gradient: 'linear-gradient(to bottom right, #065f46, #1e3a8a)' },
  ];

  return (
    <section className="featured-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <h2 className="section-title">Filmes em Destaque</h2>
        </div>
        <a href="#" className="see-all">
          Ver Todos
        </a>
      </div>

      <div className="movies-grid">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            <div className="movie-poster" style={{ background: movie.gradient }}>
              <div className="poster-overlay"></div>
            </div>
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-info">
              <span className="movie-year">{movie.year}</span>
              <div className="movie-rating">
                <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span className="rating-value">{movie.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedMovies;
