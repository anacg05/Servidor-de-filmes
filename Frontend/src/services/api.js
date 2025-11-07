import axios from 'axios';

// 1. Configuração Central da API
const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Funções de Requisição de Filmes
export const getFilmes = (params) => {
  // 'params' será um objeto como { genero: 'Ação', ano: 2023 }
  return api.get('/filmes', { params });
};

export const getFilmeById = (id) => {
  // Retorna os detalhes de um filme, incluindo joins (atores, diretores)
  return api.get(`/filmes/${id}`);
};

export const createFilme = (filmeData) => {
  // 'filmeData' é o objeto do formulário
  return api.post('/filmes', filmeData);
};

export const updateFilme = (id, filmeData) => {
  return api.put(`/filmes/${id}`, filmeData);
};

export const deleteFilme = (id) => {
  return api.delete(`/filmes/${id}`);
};

// 3. Funções de Requisição de Gêneros, Anos, etc.
export const getGeneros = () => {
  return api.get('/generos');
};

export const getAnos = () => {
  // endpoint que retorna os anos únicos de filmes
  return api.get('/filmes/anos'); 
};

// ⭐ NOVA FUNÇÃO ADICIONADA AQUI ⭐
export const getLinguagens = () => {
  return api.get('/linguagens');
};


// Funções para carrosséis (Exemplos)
export const getFilmesDestaque = () => {
  return api.get('/filmes/destaques'); 
}

export const getFilmesPorGenero = (genero) => {
  return api.get('/filmes', { params: { genero: genero, limit: 10 } }); // Reutiliza /filmes
}

export default api;