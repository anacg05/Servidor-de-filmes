import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

/*
  Bloco de Importação de Ícones:
  Importa todos os ícones necessários.
*/
import { 
  ArrowLeft, Star, Calendar, Clock, Globe, 
  Building, MapPin, User, Video, Pen, Trash2,
  Check, // Ícone de Aprovar
  X, // Ícone de Recusar
} from 'lucide-react';

import './MovieDetail.css';

/*
  Bloco de Importação de Funções:
  Importa as APIs e o hook de autenticação.
*/
import { getFilmeById, deleteFilme, aprovarFilme } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';

/*
  Função Helper: splitToArray
  Converte "A, B" em ["A", "B"].
*/
const splitToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

/*
  Função Principal: MovieDetail
*/
function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
    useEffect (Buscar Dados do Filme):
    Busca os dados completos do filme na API.
  */
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      setMovie(null); 
      
      try {
        const response = await getFilmeById(id);
        const data = response.data;
        
        if (data && data.id) { // Verifica se 'data' é válida
          setMovie({
            ...data,
            actors: splitToArray(data.actors),
            genres: splitToArray(data.genre),
            directors: splitToArray(data.director),
            producers: splitToArray(data.producer),
            countries: splitToArray(data.country),
          });
        } else {
          throw new Error("Filme não encontrado.");
        }
        
      } catch (err) {
        console.error("Erro ao buscar detalhes do filme:", err);
        setError(err.message || "Filme não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]); 

  /*
    Funções de Admin (Aprovar / Recusar)
  */
  const handleAprovar = async () => {
    try {
      await aprovarFilme(id);
      alert("Filme aprovado com sucesso!");
      navigate('/admin/solicitacoes'); // Volta para a lista de solicitações
    } catch (err) {
      alert("Erro ao aprovar o filme.");
    }
  };

  const handleRecusar = async () => {
    const temCerteza = window.confirm(
      `Tem certeza que quer RECUSAR (excluir) "${movie.title}"?`
    );
    if (temCerteza) {
      try {
        await deleteFilme(id);
        alert("Filme recusado e excluído com sucesso.");
        navigate('/admin/solicitacoes'); // Volta para a lista de solicitações
      } catch (err) {
        alert("Erro ao recusar o filme.");
      }
    }
  };

  /*
    Função de Admin (Excluir filme já APROVADO)
  */
  const handleDeleteAprovado = async () => {
    const temCerteza = window.confirm(
      `Tem certeza que quer EXCLUIR PERMANENTEMENTE "${movie.title}"?`
    );
    if (temCerteza) {
      try {
        await deleteFilme(id);
        navigate('/listarfilmes');
      } catch (err) {
        alert("Não foi possível excluir o filme.");
      }
    }
  };


  /*
    Função: renderFeedback
    Mostra "Carregando..." ou "Erro" se necessário.
  */
  const renderFeedback = () => {
    let feedbackContent = null;

    if (loading) {
      feedbackContent = <p className="detail-feedback">Carregando...</p>;
    }
    
    if (error || !movie && !loading) {
      feedbackContent = (
        <>
          <div className="detail-actions-container">
            <Link to="/listarfilmes" className="detail-back-button">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>
          </div>
          <p className="detail-feedback">{error || 'Filme não encontrado.'}</p>
        </>
      );
    }

    if (feedbackContent) {
      return (
        <div className="movie-detail-container">
          {feedbackContent}
        </div>
      );
    }

    return null; // Não retorna nada, renderiza o filme
  };

  const feedback = renderFeedback();

  /*
    Função Helper para renderizar os botões corretos
  */
  const renderActionButtons = () => {
    // Se não for admin, mostra "Editar" (solicitação)
    if (user?.type !== 'admin') {
      return (
        <Link to={`/editarfilme/${id}`} className="detail-edit-button">
          <Pen size={16} />
          <span>Editar</span>
        </Link>
      );
    }
    
    // Se for admin, verifica o STATUS do filme
    if (user?.type === 'admin') {
      // Se estiver pendente, mostra Aprovar/Recusar
      if (movie.status === 'PENDENTE_CADASTRO' || movie.status === 'PENDENTE_EDICAO') {
        return (
          <>
            <button className="detail-delete-button" onClick={handleRecusar}>
              <X size={16} />
              <span>Recusar</span>
            </button>
            <button className="detail-approve-button" onClick={handleAprovar}>
              <Check size={16} />
              <span>Aprovar</span>
            </button>
          </>
        );
      }
      
      // Se estiver APROVADO, admin vê Excluir (vermelho)
      return (
        <button className="detail-delete-button" onClick={handleDeleteAprovado}>
          <Trash2 size={16} />
          <span>Excluir</span>
        </button>
      );
    }
  };

  return (
    <>
      <Header />
      
      {feedback ? (
        feedback // Mostra "Carregando..." ou "Erro"
      ) : (
        // Mostra o conteúdo do filme
        <div className="movie-detail-container">
          <div className="movie-detail-content">
            
            <div className="detail-actions-container">
              {/* O botão "Voltar" envia o admin de volta para as solicitações */}
              <Link to={user?.type === 'admin' ? '/admin/solicitacoes' : '/listarfilmes'} className="detail-back-button">
                <ArrowLeft size={18} />
                <span>Voltar</span>
              </Link>

              {renderActionButtons()}
            </div>

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

                {movie.genres && movie.genres.length > 0 && (
                  <div className="detail-tags">
                    {movie.genres.map(g => <span key={g} className="tag-pill">{g}</span>)}
                  </div>
                )}

                <div className="detail-section">
                  <h2>Sinopse</h2>
                  <p className="detail-synopsis-text">
                    {movie.synopsis || 'Sinopse não disponível.'}
                  </p>
                </div>

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
      )}
      
      <Footer />
    </>
  );
}

export default MovieDetail;