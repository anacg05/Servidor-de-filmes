import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { ArrowLeft, Star, Calendar, Film, User } from 'lucide-react';
import './MovieDetail.css';

function MovieDetail() {
  // 1. Recebe os dados do filme via 'state' da navegação
  const location = useLocation();
  const { movie } = location.state || {};

  // 2. Fallback caso a página seja acessada sem um filme
  if (!movie) {
    return (
      <>
        <Header />
        <div className="movie-detail-container">
          <Link to="/" className="detail-back-button">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          <p className="detail-error">Filme não encontrado.</p>
        </div>
        <Footer />
      </>
    );
  }

  // 3. Renderiza os detalhes do filme
  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div className="movie-detail-content">
          <Link to="/listarfilmes" className="detail-back-button">
            <ArrowLeft size={20} />
            <span>Voltar para Lista</span>
          </Link>

          <div className="detail-layout">
            <div className="detail-poster-section">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="detail-poster-img" />
              ) : (
                <div className="detail-no-poster">?</div>
              )}
            </div>

            <div className="detail-info-section">
              <h1 className="detail-title">{movie.title}</h1>

              <div className="detail-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  {movie.year}
                </span>
                <span className="meta-item">
                  <Film size={16} />
                  {movie.genre || 'Não informado'}
                </span>
                <span className="meta-item">
                  <User size={16} />
                  {movie.director || 'Não informado'}
                </span>
              </div>

              {movie.rating && (
                <div className="detail-rating">
                  <Star size={20} className="star-icon" />
                  <span>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}</span> / 10
                </div>
              )}

              <h2 className="detail-synopsis-title">Sinopse</h2>
              <p className="detail-synopsis-text">
                {movie.synopsis || 'Sinopse não disponível.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MovieDetail;