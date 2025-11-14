import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {
  ArrowLeft, Star, Calendar, Clock, Globe,
  Building, MapPin, User, Video,
  Pen, Trash2, Check, X
} from 'lucide-react';
import './MovieDetail.css';

import { getFilmeById, deleteFilme, aprovarFilme } from '../../services/api';
import { useAuth } from '../../auth/AuthContext';

/* Converte "A, B" em ["A", "B"] */
const splitToArray = (str) =>
  str ? str.split(',').map(item => item.trim()) : [];


export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Carrega detalhes do filme */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFilmeById(id);
        const data = response.data;

        if (!data || !data.id) throw new Error('Filme não encontrado.');

        setMovie({
          ...data,
          actors: splitToArray(data.actors),
          genres: splitToArray(data.genre),
          directors: splitToArray(data.director),
          producers: splitToArray(data.producer),
          countries: splitToArray(data.country),
        });

      } catch (err) {
        setError(err.message || "Erro ao carregar o filme.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);


  /* Ações de ADMIN */
  const handleAprovar = async () => {
    try {
      await aprovarFilme(id);
      alert("Filme aprovado com sucesso!");
      navigate('/admin/solicitacoes');
    } catch {
      alert("Erro ao aprovar o filme.");
    }
  };

  const handleRecusar = async () => {
    if (!window.confirm(`Tem certeza que deseja RECUSAR "${movie.title}"?`)) return;

    try {
      await deleteFilme(id);
      alert("Filme recusado e removido.");
      navigate('/admin/solicitacoes');
    } catch {
      alert("Erro ao recusar o filme.");
    }
  };

  const handleDeleteAprovado = async () => {
    if (!window.confirm(`Excluir permanentemente "${movie.title}"?`)) return;

    try {
      await deleteFilme(id);
      navigate('/listarfilmes');
    } catch {
      alert("Erro ao excluir o filme.");
    }
  };


  /* Exibe loading/erro */
  const renderFeedback = () => {
    if (loading) {
      return (
        <div className="movie-detail-container">
          <p className="detail-feedback">Carregando...</p>
        </div>
      );
    }

    if (error || (!movie && !loading)) {
      return (
        <div className="movie-detail-container">
          <div className="detail-actions-container">
            <Link to="/listarfilmes" className="detail-back-button">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>
          </div>
          <p className="detail-feedback">{error || "Filme não encontrado."}</p>
        </div>
      );
    }

    return null;
  };

  const feedback = renderFeedback();


  /* Botões corretos para cada tipo de usuário */
  const renderActionButtons = () => {
    if (user?.type !== 'admin') {
      return (
        <Link to={`/editarfilme/${id}`} className="detail-edit-button">
          <Pen size={16} />
          <span>Editar</span>
        </Link>
      );
    }

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

    return (
      <button className="detail-delete-button" onClick={handleDeleteAprovado}>
        <Trash2 size={16} />
        <span>Excluir</span>
      </button>
    );
  };


  return (
    <>
      <Header />

      {feedback ? (
        feedback
      ) : (
        <div className="movie-detail-container">
          <div className="movie-detail-content">

            <div className="detail-actions-container">
              <Link
                to={user?.type === 'admin' ? '/admin/solicitacoes' : '/listarfilmes'}
                className="detail-back-button"
              >
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

                {movie.genres.length > 0 && (
                  <div className="detail-tags">
                    {movie.genres.map(g => (
                      <span key={g} className="tag-pill">{g}</span>
                    ))}
                  </div>
                )}

                <div className="detail-section">
                  <h2>Sinopse</h2>
                  <p className="detail-synopsis-text">
                    {movie.synopsis || 'Sinopse não disponível.'}
                  </p>
                </div>

                {movie.actors.length > 0 && (
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
                    {movie.directors.map(d => (
                      <span key={d} className="list-item">
                        <Video size={14} /> <strong>Diretor:</strong> {d}
                      </span>
                    ))}

                    {movie.producers.map(p => (
                      <span key={p} className="list-item">
                        <Building size={14} /> <strong>Produtora:</strong> {p}
                      </span>
                    ))}

                    {movie.countries.map(c => (
                      <span key={c} className="list-item">
                        <MapPin size={14} /> <strong>País:</strong> {c}
                      </span>
                    ))}

                    {movie.language && (
                      <span className="list-item">
                        <Globe size={14} /> <strong>Idioma:</strong> {movie.language}
                      </span>
                    )}
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
