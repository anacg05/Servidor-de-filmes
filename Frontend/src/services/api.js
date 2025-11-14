import axios from 'axios';

/* Instância principal da API */
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

/* Filmes (Público / Aprovados) */
export const getFilmes = (params) => api.get('/filmes', { params });
export const getFilmeById = (id) => api.get(`/filmes/${id}`);
export const getFilmesDestaque = () => api.get('/filmes/destaques');
export const getFilmesPorGenero = (genero) =>
  api.get('/filmes', { params: { genero, limit: 10 } });

/* Utilizador (Envio de Solicitações) */
export const createFilme = (filmeData) => api.post('/filmes', filmeData);
export const submitEditFilme = (id, filmeData) =>
  api.post(`/filmes/${id}/solicitar-edicao`, filmeData);

/* Admin (Moderação e Gestão) */
export const getSolicitacoesCadastro = () => api.get('/solicitacoes/cadastro');
export const getSolicitacoesEdicao = () => api.get('/solicitacoes/edicao');
export const aprovarFilme = (id) => api.put(`/filmes/${id}/aprovar`);
export const deleteFilme = (id) => api.delete(`/filmes/${id}`);

/* Filtros / Dados Auxiliares */
export const getGeneros = () => api.get('/generos');
export const getAnos = () => api.get('/filmes/anos');
export const getLinguagens = () => api.get('/linguagens');

export default api;
