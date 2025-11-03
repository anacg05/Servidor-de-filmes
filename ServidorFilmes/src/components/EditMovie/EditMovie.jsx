import { useState, useEffect } from 'react';
import '../EditMovie/EditMovie.css';

function EditMovie() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    year: '',
    rating: '',
    genre: '',
    director: '',
    synopsis: '',
    poster_url: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('title');

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar filmes' });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title || '',
      year: movie.year || '',
      rating: movie.rating || '',
      genre: movie.genre || '',
      director: movie.director || '',
      synopsis: movie.synopsis || '',
      poster_url: movie.poster_url || ''
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

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage({ type: 'error', text: 'Você precisa estar logado para sugerir edições' });
        return;
      }

      const { error } = await supabase
        .from('edit_suggestions')
        .insert({
          movie_id: selectedMovie.id,
          user_id: user.id,
          title: formData.title,
          year: formData.year ? parseInt(formData.year) : null,
          rating: formData.rating ? parseFloat(formData.rating) : null,
          genre: formData.genre,
          director: formData.director,
          synopsis: formData.synopsis,
          poster_url: formData.poster_url,
          status: 'pending'
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Sugestão de edição enviada com sucesso! Aguarde aprovação do administrador.'
      });

      setSelectedMovie(null);
      setFormData({
        title: '',
        year: '',
        rating: '',
        genre: '',
        director: '',
        synopsis: '',
        poster_url: ''
      });
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      setMessage({
        type: 'error',
        text: 'Erro ao enviar sugestão. Tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="edit-movie-container">
      <div className="edit-movie-content">
        <h1>Editar Filme</h1>
        <p className="subtitle">Selecione um filme e sugira alterações para aprovação</p>

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
                      key={movie.id}
                      className={`movie-item ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
                      onClick={() => handleMovieSelect(movie)}
                    >
                      <div className="movie-poster">
                        {movie.poster_url ? (
                          <img src={movie.poster_url} alt={movie.title} />
                        ) : (
                          <div className="no-poster">?</div>
                        )}
                      </div>
                      <div className="movie-info">
                        <h3>{movie.title}</h3>
                        <p>{movie.year} {movie.rating && `• ⭐ ${movie.rating}`}</p>
                        {movie.genre && <span className="genre">{movie.genre}</span>}
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
                <h2>Sugerir Edições</h2>

                <div className="form-group">
                  <label htmlFor="title">Título *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="year">Ano</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1800"
                      max="2100"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rating">Avaliação</label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="genre">Gênero</label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Ex: Ação, Drama, Comédia"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="director">Diretor</label>
                  <input
                    type="text"
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="poster_url">URL do Poster</label>
                  <input
                    type="url"
                    id="poster_url"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/poster.jpg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="synopsis">Sinopse</label>
                  <textarea
                    id="synopsis"
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Descreva o enredo do filme..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setSelectedMovie(null);
                      setFormData({
                        title: '',
                        year: '',
                        rating: '',
                        genre: '',
                        director: '',
                        synopsis: '',
                        poster_url: ''
                      });
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : 'Enviar Sugestão'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMovie;
