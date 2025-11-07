import React, { useState, useEffect } from 'react';
import '../EditMovie/EditMovie.css';
// MUDANÇA: Importar funções da API
import { getFilmes, updateFilme } from '../../services/api';
import Header from '../Header/Header'; // Adicionando Header

// NOTA: Seu schema MySQL não tem 'rating', 'synopsis', 'poster_url' (é 'poster')
// Vou adaptar o formulário para o schema que você forneceu.
// 'poster' (do DB) vs 'poster_url' (do form)
// 'titulo' (do DB) vs 'title' (do form)

function EditMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    // Campos do formulário (usando nomes do frontend)
    title: '',
    year: '',
    // --- Campos que NÃO ESTÃO no seu schema 'Filme' ---
    // rating: '', 
    // genre: '', 
    // director: '',
    // synopsis: '',
    // --------------------------------------------------
    poster: '' // 'poster' é o nome no DB (tipo 'text')
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      // MUDANÇA: Usar a função da API
      const response = await getFilmes();
      // Assumindo que a API retorna [{ id_filme, titulo, ano, poster, ... }]
      setMovies(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar filmes' });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    // MUDANÇA: Mapeia os dados do DB (movie) para o estado do form (formData)
    setFormData({
      title: movie.titulo || '',
      year: movie.ano || '',
      poster: movie.poster || ''
      // NOTA: Gênero e Diretor são relacionais (tabelas N:N).
      // Editar eles aqui exigiria um formulário muito mais complexo
      // (com multi-select ou caixas de busca de atores/diretores).
      // Por simplicidade, este formulário só edita campos da tabela 'Filme'.
    });
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie) {
      setMessage({ type: 'error', text: 'Selecione um filme para editar' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      // MUDANÇA: Mapeia dados do form (formData) para o formato do DB
      const updatedMovieData = {
        titulo: formData.title,
        ano: formData.year ? parseInt(formData.year) : null,
        poster: formData.poster,
        // (Não estamos editando gênero/diretor aqui pela complexidade)
      };

      // MUDANÇA: Usar a função da API
      await updateFilme(selectedMovie.id_filme, updatedMovieData);

      setMessage({
        type: 'success',
        text: 'Filme atualizado com sucesso!'
      });

      // Atualiza a lista local para refletir a mudança
      fetchMovies();
      setSelectedMovie(null);
      
    } catch (error) {
      console.error('Erro ao atualizar filme:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar filme. Tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header /> {/* Adicionado Header */}
      <div className="edit-movie-container">
        <div className="edit-movie-content">
          <h1>Editar Filme</h1>
          <p className="subtitle">Selecione um filme da lista para editar</p>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="edit-layout">
            <div className="movie-list-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar filme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {loading ? (
                <div className="loading">Carregando filmes...</div>
              ) : (
                <div className="movie-list">
                  {filteredMovies.length === 0 ? (
                    <p className="no-movies">Nenhum filme encontrado</p>
                  ) : (
                    filteredMovies.map(movie => (
                      <div
                        key={movie.id_filme}
                        className={`movie-item ${selectedMovie?.id_filme === movie.id_filme ? 'selected' : ''}`}
                        onClick={() => handleMovieSelect(movie)}
                      >
                        <div className="movie-poster">
                          {movie.poster ? (
                            <img src={movie.poster} alt={movie.titulo} />
                          ) : (
                            <div className="no-poster">?</div>
                          )}
                        </div>
                        <div className="movie-info">
                          {/* MUDANÇA: 'titulo' em vez de 'title' */}
                          <h3>{movie.titulo}</h3> 
                          {/* MUDANÇA: 'ano' em vez de 'year' */}
                          <p>{movie.ano}</p> 
                          {/* (Gênero e Rating não estão na tabela Filme) */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="edit-form-section">
              {!selectedMovie ? (
                <div className="no-selection">
                  <p>Selecione um filme da lista para editar</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                  <h2>Editando: {selectedMovie.titulo}</h2>

                  <div className="form-group">
                    {/* MUDANÇA: 'title' (do form state) */}
                    <label htmlFor="title">Título *</label> 
                    <input
                      type="text" id="title" name="title"
                      value={formData.title} onChange={handleInputChange} required
                    />
                  </div>

                  <div className="form-group">
                    {/* MUDANÇA: 'year' (do form state) */}
                    <label htmlFor="year">Ano</label>
                    <input
                      type="number" id="year" name="year"
                      value={formData.year} onChange={handleInputChange}
                      min="1800" max="2100"
                    />
                  </div>
                  
                  <div className="form-group">
                    {/* MUDANÇA: 'poster' (do form state) */}
                    <label htmlFor="poster">URL do Poster</label>
                    <input
                      type="url" id="poster" name="poster"
                      value={formData.poster} onChange={handleInputChange}
                      placeholder="https://exemplo.com/poster.jpg"
                    />
                  </div>
                  
                  {/* Campos como Gênero, Diretor, Rating, Sinopse foram removidos
                    pois não existem na sua tabela 'Filme' do DB.
                    Você precisa adicioná-los ao schema se quiser editá-los.
                  */}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setSelectedMovie(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditMovie;