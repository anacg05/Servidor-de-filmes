import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AddMovie.css';
import Header from '../../components/Header/Header';

export default function AddMovie({ movies, setMovies }) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    rating: '',
    genre: '',
    director: '',
    poster: '',
    synopsis: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      year: '',
      rating: '',
      genre: '',
      director: '',
      poster: '',
      synopsis: '',
    });
  };

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, year, rating, genre } = formData;
    if (!title || !year || !rating || !genre) {
      showMessage('error', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newMovie = {
      id: Date.now(),
      title,
      year: parseInt(year),
      rating: parseFloat(rating),
      genre,
      director: formData.director || 'Não informado',
      poster: formData.poster || '',
      synopsis: formData.synopsis || 'Sem sinopse disponível',
      createdAt: new Date().toISOString(),
    };

    setMovies([...movies, newMovie]);
    showMessage('success', 'Filme adicionado com sucesso!');
    resetForm();
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar? Todos os dados não salvos serão perdidos.')) {
      resetForm();
    }
  };

  return (
    <>
      <Header />
      {/* 🔹 Botão de voltar */}
      <Link to="/" className="back-button2">
        <ArrowLeft size={22} />
        <span>Voltar</span>
      </Link>


      <div className="add-movie-container">
        
        <div className="page-header">
          <h1>Adicionar Novo Filme</h1>
          <p>Preencha as informações do filme para adicionar à sua coleção</p>
        </div>

        {message.type && (
          <div className={`${message.type}-message show`}>
            {message.text}
          </div>
        )}

        <div className="form-card">
          <form id="add-movie-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Ex: Oppenheimer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Ano *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  placeholder="Ex: 2023"
                  min="1888"
                  max="2099"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Avaliação *</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  placeholder="Ex: 8.5"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="genre">Gênero *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um gênero</option>
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Terror">Terror</option>
                <option value="Romance">Romance</option>
                <option value="Suspense">Suspense</option>
                <option value="Animação">Animação</option>
                <option value="Documentário">Documentário</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="director">Diretor</label>
              <input
                type="text"
                id="director"
                name="director"
                placeholder="Ex: Christopher Nolan"
                value={formData.director}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="poster">URL da Capa</label>
              <input
                type="url"
                id="poster"
                name="poster"
                placeholder="https://exemplo.com/poster.jpg"
                value={formData.poster}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="synopsis">Sinopse</label>
              <textarea
                id="synopsis"
                name="synopsis"
                placeholder="Escreva uma breve descrição do filme..."
                value={formData.synopsis}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className=" btns btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btns btn-primary">
                Adicionar Filme
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
