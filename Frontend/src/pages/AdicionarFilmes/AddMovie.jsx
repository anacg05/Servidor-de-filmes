import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AddMovie.css';
import Header from '../../components/Header/Header';
import { createFilme, getGeneros, getLinguagens } from '../../services/api';

export default function AddMovie() {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    rating: '', 
    genres: [], 
    director: '', 
    actor1: '', 
    actor2: '',
    actor3: '',
    poster: '',
    synopsis: '',
    id_linguagem: '', 
    duration: '', // ⭐ NOVO CAMPO DE ESTADO
  });

  const [allGenres, setAllGenres] = useState([]);
  const [linguagens, setLinguagens] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingFilters, setLoadingFilters] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoadingFilters(true);
      try {
        const [generosRes, linguagensRes] = await Promise.all([
          getGeneros(),
          getLinguagens()
        ]);
        setAllGenres(generosRes.data);
        setLinguagens(linguagensRes.data);
      } catch (error) {
        console.error("Erro ao buscar filtros", error);
        showMessage('error', 'Erro ao carregar listas de filtros.');
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilters();
  }, []);

  // Handler normal para inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler para os checkboxes de gênero
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const newGenres = [...prevData.genres];
      if (checked) {
        newGenres.push(value);
      } else {
        const index = newGenres.indexOf(value);
        if (index > -1) {
          newGenres.splice(index, 1);
        }
      }
      return { ...prevData, genres: newGenres };
    });
  };


  const resetForm = () => {
    setFormData({
      title: '', year: '', rating: '', 
      genres: [], 
      director: '', 
      actor1: '', actor2: '', actor3: '', 
      poster: '', synopsis: '', id_linguagem: '',
      duration: '', // ⭐ LIMPAR O CAMPO
    });
  };

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    const { title, year, genres, id_linguagem } = formData;
    if (!title || !year || !genres.length || !id_linguagem) {
      showMessage('error', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    
    const newMovieData = {
      titulo: formData.title,
      ano: parseInt(year),
      poster: formData.poster || '',
      rating: parseFloat(formData.rating) || 0,
      synopsis: formData.synopsis || 'Sem sinopse disponível',
      generos_nomes: formData.genres, 
      diretor_nome: formData.director || '', 
      id_linguagem: parseInt(formData.id_linguagem),
      ator_nome1: formData.actor1 || '',
      ator_nome2: formData.actor2 || '',
      ator_nome3: formData.actor3 || '',
      tempo_duracao: formData.duration || null,
    };

    try {
      const response = await createFilme(newMovieData);
      
      showMessage('success', `Filme "${response.data.titulo}" adicionado com sucesso!`);
      resetForm();
    
    } catch (error) {
      console.error("Erro ao adicionar filme:", error.response?.data?.error || error.message);
      showMessage('error', `Erro ao adicionar o filme: ${error.response?.data?.error || 'Tente novamente.'}`);
    }
  };

  const handleCancel = () => {
    const temCerteza = window.confirm(
      "Tem certeza que quer cancelar? Todos os dados preenchidos serão perdidos."
    );
    if (temCerteza) {
      console.log('Cancelando...');
      resetForm();
    }
  };

  return (
    <>
      <Header />
      <div className="add-movie-container">
        {/* ... (cabeçalho da página e mensagens) ... */}
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
            {/* Título */}
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input type="text" id="title" name="title" placeholder="Ex: Oppenheimer" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}> {/* 3 colunas */}
              <div className="form-group">
                <label htmlFor="year">Ano *</label>
                <input type="number" id="year" name="year" placeholder="Ex: 2023" min="1888" max="2099" value={formData.year} onChange={handleChange} required />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duração</label>
                <input type="time" id="duration" name="duration" value={formData.duration} onChange={handleChange} step="1" />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Avaliação (0-10)</label>
                <input type="number" id="rating" name="rating" placeholder="Ex: 8.5" min="0" max="10" step="0.1" value={formData.rating} onChange={handleChange} />
              </div>
            </div>

            {/* Linguagem e Diretor */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_linguagem">Linguagem *</label>
                <select id="id_linguagem" name="id_linguagem" value={formData.id_linguagem} onChange={handleChange} required disabled={loadingFilters}>
                  <option value="">{loadingFilters ? 'Carregando...' : 'Selecione a linguagem'}</option>
                  {linguagens.map(l => (
                    <option key={l.id_linguagem} value={l.id_linguagem}>
                      {l.linguagem}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="director">Diretor (Nome)</label>
                <input type="text" id="director" name="director" placeholder="Ex: Christopher Nolan" value={formData.director} onChange={handleChange} />
              </div>
            </div>
            
            {/* Gêneros (Checkboxes) */}
            <div className="form-group">
              <label>Gêneros *</label>
              <div className="checkbox-group-container" disabled={loadingFilters}>
                {loadingFilters ? <p>Carregando gêneros...</p> : (
                  allGenres.map(g => (
                    <div key={g.id_genero} className="checkbox-item">
                      <input type="checkbox" id={`genre-${g.id_genero}`} name="genres" value={g.genero} checked={formData.genres.includes(g.genero)} onChange={handleGenreChange} />
                      <label htmlFor={`genre-${g.id_genero}`}>{g.genero}</label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3 CAMPOS PARA ATORES */}
            <div className="form-group">
              <label>Atores (Até 3)</label>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}> {/* 3 colunas */}
                <input type="text" id="actor1" name="actor1" placeholder="Ator 1 (Ex: Cillian Murphy)" value={formData.actor1} onChange={handleChange} />
                <input type="text" id="actor2" name="actor2" placeholder="Ator 2 (Opcional)" value={formData.actor2} onChange={handleChange} />
                <input type="text" id="actor3" name="actor3" placeholder="Ator 3 (Opcional)" value={formData.actor3} onChange={handleChange} />
              </div>
            </div>

            {/* URL da Capa */}
            <div className="form-group">
              <label htmlFor="poster">URL da Capa</label>
              <input type="url" id="poster" name="poster" placeholder="https://exemplo.com/poster.jpg" value={formData.poster} onChange={handleChange} />
            </div>

            {/* Sinopse */}
            <div className="form-group">
              <label htmlFor="synopsis">Sinopse</label>
              <textarea id="synopsis" name="synopsis" placeholder="Escreva uma breve descrição do filme..." value={formData.synopsis} onChange={handleChange}></textarea>
            </div>

            {/* Botões */}
            <div className="form-actions">
              <button type="button" className=" btns btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btns btn-primary">
                Enviar Solicitação
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}