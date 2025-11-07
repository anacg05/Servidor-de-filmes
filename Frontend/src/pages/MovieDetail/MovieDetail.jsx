import React, { useState, useEffect } from 'react';
// MUDANÇA: Importar 'useParams' em vez de 'useLocation'
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { ArrowLeft, Star, Calendar, Film, User } from 'lucide-react';
import './MovieDetail.css';
// MUDANÇA: Importar a função da API
import { getFilmeById } from '../../services/api';

function MovieDetail() {
  // MUDANÇA: Usar 'useParams' para pegar o 'id' da URL
  // A rota em App.jsx é "/filme/:id"
  const { id } = useParams();
  
  // MUDANÇA: Estados para controlar o filme, carregamento e erro
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MUDANÇA: useEffect para buscar o filme na API quando o 'id' mudar
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFilmeById(id);
        // Assumindo que a API retorna o filme detalhado
        // ex: { id_filme: 1, titulo: 'Oppenheimer', ano: 2023, ... }
        // Se a API retornar nomes de colunas diferentes (ex: 'titulo' vs 'title'),
        // você precisará ajustar aqui ou no componente.
        // Vou assumir que o backend retorna os nomes que o frontend espera:
        // { id, title, year, rating, genre, director, synopsis, poster, actors }
        setMovie(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do filme:", err);
        setError("Filme não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); // Dependência: 'id' da URL

  // 1. Estado de Carregamento
  if (loading) {
    return (
      <>
        <Header />
        <div className="movie-detail-container">
          <p className="detail-error">Carregando...</p>
        </div>
        <Footer />
      </>
    );
  }

  // 2. Estado de Erro
  if (error || !movie) {
    return (
      <>
        <Header />
        <div className="movie-detail-container">
          <Link to="/listarfilmes" className="detail-back-button">
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </Link>
          <p className="detail-error">{error || 'Filme não encontrado.'}</p>
        </div>
        <Footer />
      </>
    );
  }

  // 3. Sucesso: Renderiza os detalhes do filme
  // (Assumindo que o backend retorna 'title', 'year', 'genre', 'director', 'rating', 'synopsis', 'poster')
  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div className="movie-detail-content">
          <Link to="/listarfilmes" className="detail-back-button">
            <ArrowLeft size={20} />
            <span>Voltar para Filmes</span>
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
                  {/* O backend deve fazer o JOIN com a tabela Genero */}
                  {movie.genre || 'Não informado'} 
                </span>
                <span className="meta-item">
                  <User size={16} />
                  {/* O backend deve fazer o JOIN com a tabela Diretor */}
                  {movie.director || 'Não informado'}
                </span>
              </div>

              {movie.rating && (
                <div className="detail-rating">
                  <Star size={20} className="star-icon" />
                  {/* O backend pode não ter 'rating', seu schema não mostra.
                      Se for um campo da tabela 'Filme', adicione-o.
                      Vou assumir que existe. */}
                  <span>{typeof movie.rating === 'number' ? movie.rating.toFixed(1) : movie.rating}</span> / 10
                </div>
              )}

              <h2 className="detail-synopsis-title">Sinopse</h2>
              <p className="detail-synopsis-text">
                {/* O backend deve ter 'synopsis' na tabela 'Filme'
                    Seu schema não mostra, você precisa adicionar.
                    CREATE TABLE Filme (... synopsis TEXT ...) */}
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