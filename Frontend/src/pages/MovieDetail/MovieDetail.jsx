import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

/*
  Bloco de Importação de Ícones:
  Importa todos os ícones necessários da biblioteca lucide-react.
*/
import { 
  ArrowLeft, Star, Calendar, Clock, Globe, 
  Building, MapPin, User, Video, Pen 
} from 'lucide-react';

import './MovieDetail.css';
import { getFilmeById } from '../../services/api';

/*
  Função Helper: splitToArray
  Converte uma string separada por vírgulas (ex: "Ator A, Ator B")
  num array limpo (ex: ["Ator A", "Ator B"]).
*/
const splitToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

/*
  Função Principal: MovieDetail
  Busca e exibe os dados completos de um filme específico 
  com base no ID da URL.
*/
function MovieDetail() {
  const { id } = useParams();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
    useEffect (Buscar Dados do Filme):
    É executado quando o 'id' da URL muda.
    Chama a API 'getFilmeById' e processa os dados.
  */
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFilmeById(id);
        const data = response.data;
        
        // Processa os dados recebidos da API
        setMovie({
          ...data,
          actors: splitToArray(data.actors),
          genres: splitToArray(data.genre),
          directors: splitToArray(data.director),
          producers: splitToArray(data.producer),
          countries: splitToArray(data.country),
        });
        
      } catch (err) {
        console.error("Erro ao buscar detalhes do filme:", err);
        setError("Filme não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); 

  /*
    Renderização de Feedback:
    Mostra mensagens de "Carregando..." ou "Erro".
  */
  if (loading) {
    return (
      <>
        <Header />
        <div className="movie-detail-container">
          <p className="detail-feedback">Carregando...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Header />
        <div className="movie-detail-container">
          {/* Mesmo no erro, mostramos um botão de voltar */}
          <div className="detail-actions-container">
            <Link to="/listarfilmes" className="detail-back-button">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>
          </div>
          <p className="detail-feedback">{error || 'Filme não encontrado.'}</p>
        </div>
        <Footer />
      </>
    );
  }

  /*
    Renderização de Sucesso:
    Mostra o layout completo da página de detalhes.
  */
  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div className="movie-detail-content">
          
          {/* Container dos botões de ação (Voltar e Editar) */}
          <div className="detail-actions-container">
            <Link to="/listarfilmes" className="detail-back-button">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>

            <Link to={`/editarfilme/${id}`} className="detail-edit-button">
              <Pen size={16} />
              <span>Editar</span>
            </Link>
          </div>

          {/* Layout principal (Poster + Informações) */}
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

              <div className="detail-meta-icons">
                <span className="meta-icon-item">
                  <Star size={16} className="icon-gold" />
                  {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                </span>
                <span className="meta-icon-item">
                  <Calendar size={16} />
                  {movie.year || 'N/A'}
                </span>
                <span className="meta-icon-item">
                  <Clock size={16} />
                  {movie.duration || 'N/A'}
                </span>
              </div>

              {/* Tags de Gênero */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="detail-tags">
                  {movie.genres.map(g => <span key={g} className="tag-pill">{g}</span>)}
                </div>
              )}

              {/* Seção: Sinopse */}
              <div className="detail-section">
                <h2>Sinopse</h2>
                <p className="detail-synopsis-text">
                  {movie.synopsis || 'Sinopse não disponível.'}
                </p>
              </div>

              {/* Seção: Elenco */}
              {movie.actors && movie.actors.length > 0 && (
                <div className="detail-section">
                  <h2>Elenco Principal</h2>
                  <div className="detail-list">
                    {movie.actors.map(actor => (
                      <span key={actor} className="list-item">
                        <User size={14} /> {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção: Equipe e Detalhes */}
              <div className="detail-section">
                <h2>Equipe e Detalhes</h2>
                <div className="detail-list">
                  {movie.directors && movie.directors.map(d => <span key={d} className="list-item"><Video size={14} /> <strong>Diretor:</strong> {d}</span>)}
                  {movie.producers && movie.producers.map(p => <span key={p} className="list-item"><Building size={14} /> <strong>Produtora:</strong> {p}</span>)}
                  {movie.countries && movie.countries.map(c => <span key={c} className="list-item"><MapPin size={14} /> <strong>País:</strong> {c}</span>)}
                  {movie.language && <span className="list-item"><Globe size={14} /> <strong>Idioma:</strong> {movie.language}</span>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MovieDetail;