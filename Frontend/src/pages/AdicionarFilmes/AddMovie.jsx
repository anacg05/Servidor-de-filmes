import React, { useState, useEffect } from 'react';
import './AddMovie.css';
import Header from '../../components/Header/Header';
import { createFilme, getGeneros, getLinguagens } from '../../services/api';

/* Página de formulário de cadastro de novo filme (envia solicitação ao admin) */
export default function AddMovie() {

  /* Estado principal do formulário */
  const [formData, setFormData] = useState({
    title: '', year: '', rating: '', genres: [],
    director: '', actor1: '', actor2: '', actor3: '',
    poster: '', synopsis: '', id_linguagem: '', duration: '',
  });

  /* Listas de filtros vindas da API */
  const [allGenres, setAllGenres] = useState([]);
  const [linguagens, setLinguagens] = useState([]);

  /* Exibe erros (mensagem simples) */
  const [message, setMessage] = useState({ type: '', text: '' });

  /* Indica carregamento das listas */
  const [loadingFilters, setLoadingFilters] = useState(false);

  /* Busca filtros (gêneros e linguagens) ao abrir a página */
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

  /* Atualização genérica dos campos do formulário */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Atualiza array de gêneros marcados */
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updated = checked
        ? [...prev.genres, value]
        : prev.genres.filter(g => g !== value);
      return { ...prev, genres: updated };
    });
  };

  /* Limpa o formulário após envio ou cancelamento */
  const resetForm = () => {
    setFormData({
      title: '', year: '', rating: '', genres: [],
      director: '', actor1: '', actor2: '', actor3: '',
      poster: '', synopsis: '', id_linguagem: '', duration: '',
    });
  };

  /* Exibe mensagens temporárias (usado para erros) */
  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  /* Envia solicitação de cadastro ao admin */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

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
      await createFilme(newMovieData);
      window.alert('Solicitação de cadastro foi enviada ao administrador!');
      resetForm();
    } catch (error) {
      console.error("Erro ao adicionar filme:", error.response?.data?.error || error.message);
      showMessage('error', `Erro ao enviar solicitação: ${error.response?.data?.error || 'Tente novamente.'}`);
    }
  };

  /* Confirmação antes de cancelar e limpar tudo */
  const handleCancel = () => {
    if (window.confirm("Tem certeza que deseja cancelar? Todos os dados serão perdidos.")) {
      resetForm();
    }
  };

  return (
    <>
      <Header />

      <div className="add-movie-container">
        
        <div className="page-header">
          <h1>Adicionar Novo Filme</h1>
          <p>Preencha as informações do filme para enviar a solicitação</p>
        </div>

        {message.type === 'error' && (
          <div className={`${message.type}-message show`}>{message.text}</div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>

            {/* Título */}
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input id="title" name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Oppenheimer"
                required
              />
            </div>

            {/* Ano / Duração / Rating */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="year">Ano *</label>
                <input id="year" name="year" type="number"
                  min="1888" max="2099"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duração</label>
                <input id="duration" name="duration" type="time"
                  value={formData.duration}
                  onChange={handleChange}
                  step="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Avaliação (0-10)</label>
                <input id="rating" name="rating" type="number"
                  min="0" max="10" step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Linguagem + Diretor */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_linguagem">Linguagem *</label>
                <select id="id_linguagem" name="id_linguagem"
                  value={formData.id_linguagem}
                  onChange={handleChange}
                  required
                  disabled={loadingFilters}
                >
                  <option value="">
                    {loadingFilters ? 'Carregando...' : 'Selecione a linguagem'}
                  </option>
                  {linguagens.map(l => (
                    <option key={l.id_linguagem} value={l.id_linguagem}>
                      {l.linguagem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="director">Diretor (Nome)</label>
                <input id="director" name="director"
                  placeholder="Ex: Christopher Nolan"
                  value={formData.director}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Gêneros */}
            <div className="form-group">
              <label>Gêneros *</label>
              <div className="checkbox-group-container">
                {loadingFilters ? (
                  <p>Carregando gêneros...</p>
                ) : (
                  allGenres.map(g => (
                    <div key={g.id_genero} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`genre-${g.id_genero}`}
                        value={g.genero}
                        checked={formData.genres.includes(g.genero)}
                        onChange={handleGenreChange}
                      />
                      <label htmlFor={`genre-${g.id_genero}`}>{g.genero}</label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Atores */}
            <div className="form-group">
              <label>Atores (até 3)</label>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <input id="actor1" name="actor1"
                  placeholder="Ator 1"
                  value={formData.actor1}
                  onChange={handleChange}
                />
                <input id="actor2" name="actor2"
                  placeholder="Ator 2 (opcional)"
                  value={formData.actor2}
                  onChange={handleChange}
                />
                <input id="actor3" name="actor3"
                  placeholder="Ator 3 (opcional)"
                  value={formData.actor3}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Poster */}
            <div className="form-group">
              <label htmlFor="poster">URL da Capa</label>
              <input id="poster" name="poster"
                type="url"
                placeholder="https://exemplo.com/poster.jpg"
                value={formData.poster}
                onChange={handleChange}
              />
            </div>

            {/* Sinopse */}
            <div className="form-group">
              <label htmlFor="synopsis">Sinopse</label>
              <textarea
                id="synopsis"
                name="synopsis"
                placeholder="Escreva uma breve descrição..."
                value={formData.synopsis}
                onChange={handleChange}
              />
            </div>

            {/* Botões */}
            <div className="form-actions">
              <button type="button" className="btns btn-secondary" onClick={handleCancel}>
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
