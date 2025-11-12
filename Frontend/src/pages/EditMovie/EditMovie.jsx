import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './EditMovie.css'; // Usa o novo CSS (cópia do AddMovie.css)
import Header from '../../components/Header/Header'; // Atualiza o caminho
import { getFilmeById, getGeneros, getLinguagens } from '../../services/api';

// (Helper para dividir "Ator A, Ator B" em ["Ator A", "Ator B"])
const splitToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

export default function EditMovie() {
  const { id } = useParams(); // Pega o ID do filme da URL
  const navigate = useNavigate(); // Para voltar à página de detalhes
  
  const [formData, setFormData] = useState({
    title: '', year: '', rating: '', genres: [], director: '', 
    actor1: '', actor2: '', actor3: '',
    poster: '', synopsis: '', id_linguagem: '', duration: '',
  });

  // Estados para os dropdowns/checkboxes
  const [allGenres, setAllGenres] = useState([]);
  const [linguagens, setLinguagens] = useState([]);
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true); // Começa carregando

  useEffect(() => {
    const fetchFilters = async () => {
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
      }
    };
    fetchFilters();
  }, []); // Roda só uma vez

  useEffect(() => {
    // Só busca o filme se os gêneros e linguagens já tiverem sido carregados
    if (allGenres.length > 0 && linguagens.length > 0) {
      const fetchMovieData = async () => {
        setLoading(true);
        try {
          const response = await getFilmeById(id);
          const data = response.data;

          // Processa os dados recebidos da API
          const actorsArray = splitToArray(data.actors);
          const genresArray = splitToArray(data.genre);
          
          // Encontra o ID da linguagem correspondente ao NOME da linguagem
          const foundLang = linguagens.find(l => l.linguagem === data.language);

          // Preenche o formulário com os dados do filme
          setFormData({
            title: data.title || '',
            year: data.year || '',
            rating: data.rating || '',
            genres: genresArray || [],
            director: data.director || '',
            actor1: actorsArray[0] || '',
            actor2: actorsArray[1] || '',
            actor3: actorsArray[2] || '',
            poster: data.poster || '',
            synopsis: data.synopsis || '',
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
  }, [id, allGenres, linguagens]); // Depende do ID e dos filtros carregados

  
  // (Handlers 'handleChange' e 'handleGenreChange' são iguais ao AddMovie)
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

  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // (A validação ainda é uma boa prática)
    const { title, year, genres, id_linguagem } = formData;
    if (!title || !year || !genres.length || !id_linguagem) {
      showMessage('error', 'Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    // Apenas mostra a mensagem e redireciona
    showMessage('success', 'Solicitação de edição foi enviada ao administrador!');
    
    // Espera 2 segundos e volta para a página de detalhes
    setTimeout(() => {
      navigate(`/filme/${id}`);
    }, 2000);
  };

  const handleCancel = () => {
    const temCerteza = window.confirm(
      "Tem certeza que quer cancelar? As alterações não serão salvas."
    );
    if (temCerteza) {
      navigate(`/filme/${id}`); // Volta para a pág. de detalhes
    }
  };

  // Se estiver carregando, mostra um feedback
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

        {message.type && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'} show`}>
            {message.text}
          </div>
        )}

        <div className="form-card">
          <form id="edit-movie-form" onSubmit={handleSubmit}>
            {/* Título */}
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            {/* Ano, Duração, Rating */}
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

            {/* Linguagem e Diretor */}
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
            
            {/* Gêneros (Checkboxes) */}
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

            {/* Atores */}
            <div className="form-group">
              <label>Atores (Até 3)</label>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <input type="text" id="actor1" name="actor1" value={formData.actor1} onChange={handleChange} />
                <input type="text" id="actor2" name="actor2" value={formData.actor2} onChange={handleChange} />
                <input type="text" id="actor3" name="actor3" value={formData.actor3} onChange={handleChange} />
              </div>
            </div>

            {/* URL da Capa */}
            <div className="form-group">
              <label htmlFor="poster">URL da Capa</label>
              <input type="url" id="poster" name="poster" value={formData.poster} onChange={handleChange} />
            </div>

            {/* Sinopse */}
            <div className="form-group">
              <label htmlFor="synopsis">Sinopse</label>
              <textarea id="synopsis" name="synopsis" value={formData.synopsis} onChange={handleChange}></textarea>
            </div>

            {/* Botões */}
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