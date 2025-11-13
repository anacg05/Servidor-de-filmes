import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './EditMovie.css';
import Header from '../../components/Header/Header';
import { getFilmeById, getGeneros, getLinguagens, submitEditFilme } from '../../services/api';

const splitToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', year: '', rating: '', genres: [], director: '',
    actor1: '', actor2: '', actor3: '',
    poster: '', synopsis: '', id_linguagem: '', duration: '',
  });

  const [allGenres, setAllGenres] = useState([]);
  const [linguagens, setLinguagens] = useState([]);

  // O estado 'message' agora é usado apenas para ERROS
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  // (useEffect para buscar filtros e dados do filme permanecem os mesmos)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [generosRes, linguagensRes] = await Promise.all([getGeneros(), getLinguagens()]);
        setAllGenres(generosRes.data);
        setLinguagens(linguagensRes.data);
      } catch (error) {
        console.error("Erro ao buscar filtros", error);
        showMessage('error', 'Erro ao carregar listas de filtros.');
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    if (allGenres.length > 0 && linguagens.length > 0) {
      const fetchMovieData = async () => {
        setLoading(true);
        try {
          const response = await getFilmeById(id);
          const data = response.data;
          const actorsArray = splitToArray(data.actors);
          const genresArray = splitToArray(data.genre);
          const foundLang = linguagens.find(l => l.linguagem === data.language);

          setFormData({
            title: data.title || '', year: data.year || '',
            rating: data.rating || '', genres: genresArray || [],
            director: data.director || '', actor1: actorsArray[0] || '',
            actor2: actorsArray[1] || '', actor3: actorsArray[2] || '',
            poster: data.poster || '', synopsis: data.synopsis || '',
            id_linguagem: foundLang ? foundLang.id_linguagem : '',
            duration: data.duration || '',
          });
        } catch (error) {
          console.error("Erro ao buscar dados do filme:", error);
          showMessage('error', 'Não foi possível carregar os dados do filme.');
        } finally {
          setLoading(false);
        }
      };
      fetchMovieData();
    }
  }, [id, allGenres, linguagens]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const newGenres = [...prevData.genres];
      if (checked) newGenres.push(value);
      else {
        const index = newGenres.indexOf(value);
        if (index > -1) newGenres.splice(index, 1);
      }
      return { ...prevData, genres: newGenres };
    });
  };

  // Esta função agora é usada apenas para ERROS
  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Limpa erros antigos

    const { title, year, genres, id_linguagem } = formData;
    if (!title || !year || !genres.length || !id_linguagem) {
      showMessage('error', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    const editedMovieData = {
      titulo: formData.title, ano: parseInt(year), poster: formData.poster || '',
      rating: parseFloat(formData.rating) || 0, synopsis: formData.synopsis || 'Sem sinopse disponível',
      generos_nomes: formData.genres, diretor_nome: formData.director || '',
      id_linguagem: parseInt(formData.id_linguagem),
      ator_nome1: formData.actor1 || '', ator_nome2: formData.actor2 || '',
      ator_nome3: formData.actor3 || '', tempo_duracao: formData.duration || null,
    };

    try {
      await submitEditFilme(id, editedMovieData);

      // MUDANÇA AQUI: Usamos o 'alert' nativo
      window.alert('Solicitação de edição foi enviada ao administrador!');

      // Redireciona imediatamente após o utilizador clicar "OK" no alert
      navigate(`/filme/${id}`);

    } catch (error) {
      console.error("Erro ao enviar edição:", error.response?.data?.error || error.message);
      showMessage('error', `Erro ao enviar solicitação: ${error.response?.data?.error || 'Tente novamente.'}`);
    }
  };

  const handleCancel = () => {
    const temCerteza = window.confirm(
      "Tem certeza que quer cancelar? As alterações não serão salvas."
    );
    if (temCerteza) {
      navigate(`/filme/${id}`);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="edit-movie-container">
          <div className="page-header"><h1>Carregando dados do filme...</h1></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="edit-movie-container">
        <div className="page-header">
          <h1>Editar Filme</h1>
          <p>Altere as informações do filme abaixo.</p>
        </div>

        {/* MUDANÇA AQUI: Este div agora só renderiza se for um ERRO */}
        {message.type === 'error' && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'} show`}>
            {message.text}
          </div>
        )}

        <div className="form-card">
          <form id="edit-movie-form" onSubmit={handleSubmit}>
            {/* ... (Resto do JSX do formulário) ... */}

            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="year">Ano *</label>
                <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duração</label>
                <input type="time" id="duration" name="duration" value={formData.duration} onChange={handleChange} step="1" />
              </div>
              <div className="form-group">
                <label htmlFor="rating">Avaliação (0-10)</label>
                <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id_linguagem">Linguagem *</label>
                <select id="id_linguagem" name="id_linguagem" value={formData.id_linguagem} onChange={handleChange} required>
                  <option value="">Selecione a linguagem</option>
                  {linguagens.map(l => (
                    <option key={l.id_linguagem} value={l.id_linguagem}>
                      {l.linguagem}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="director">Diretor (Nome)</label>
                <input type="text" id="director" name="director" value={formData.director} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Gêneros *</label>
              <div className="checkbox-group-container">
                {allGenres.map(g => (
                  <div key={g.id_genero} className="checkbox-item">
                    <input type="checkbox" id={`genre-${g.id_genero}`} name="genres" value={g.genero}
                      checked={formData.genres.includes(g.genero)}
                      onChange={handleGenreChange} />
                    <label htmlFor={`genre-${g.id_genero}`}>{g.genero}</label>
                  </div>
                ))
                }
              </div>
            </div>

            <div className="form-group">
              <label>Atores (Até 3)</label>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <input type="text" id="actor1" name="actor1" value={formData.actor1} onChange={handleChange} />
                <input type="text" id="actor2" name="actor2" value={formData.actor2} onChange={handleChange} />
                <input type="text" id="actor3" name="actor3" value={formData.actor3} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="poster">URL da Capa</label>
              <input type="url" id="poster" name="poster" value={formData.poster} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="synopsis">Sinopse</label>
              <textarea id="synopsis" name="synopsis" value={formData.synopsis} onChange={handleChange}></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className=" btns btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btns btn-primary">
                Enviar Edição
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}