import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Funções de Filmes (Públicas/Aprovadas)
*/
export const getFilmes = (params) => {
  return api.get('/filmes', { params });
};
export const getFilmeById = (id) => {
  return api.get(`/filmes/${id}`);
};
export const getFilmesDestaque = () => {
  return api.get('/filmes/destaques'); 
}
export const getFilmesPorGenero = (genero) => {
  return api.get('/filmes', { params: { genero: genero, limit: 10 } });
}

/*
  Funções de Utilizador (Envio de Solicitações)
*/
export const createFilme = (filmeData) => {
  return api.post('/filmes', filmeData);
};

// MUDANÇA: Esta função agora envia uma SOLICITAÇÃO de edição
export const submitEditFilme = (id, filmeData) => {
  return api.post(`/filmes/${id}/solicitar-edicao`, filmeData);
};


/*
  Funções de Admin (Gestão e Moderação)
*/
export const getSolicitacoesCadastro = () => {
  return api.get('/solicitacoes/cadastro');
};

// MUDANÇA: Nova rota para buscar solicitações de edição
export const getSolicitacoesEdicao = () => {
  return api.get('/solicitacoes/edicao');
};

export const aprovarFilme = (id) => {
  return api.put(`/filmes/${id}/aprovar`);
};

export const deleteFilme = (id) => {
  return api.delete(`/filmes/${id}`);
};

/*
  Funções de Filtros (Gerais)
*/
export const getGeneros = () => {
  return api.get('/generos');
};
export const getAnos = () => {
  return api.get('/filmes/anos'); 
};
export const getLinguagens = () => {
  return api.get('/linguagens');
};

export default api;