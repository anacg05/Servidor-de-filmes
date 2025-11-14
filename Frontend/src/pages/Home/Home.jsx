import React, { useState, useEffect } from 'react'; 
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MoviesCarousel from '../../components/MoviesCarousel/MoviesCarousel';
import Genres from '../../components/Genres/Genres';
import Footer from '../../components/Footer/Footer';

import './Home.css';

import { getFilmesDestaque } from '../../services/api';

function Home() {
  /* Estado do carrossel de filmes */
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Busca inicial dos filmes cadastrados recentemente */
  useEffect(() => {
    const fetchRecentes = async () => {
      try {
        setLoading(true);
        const response = await getFilmesDestaque();
        setFilmesRecentes(response.data);

      } catch (err) {
        console.error("Erro ao buscar filmes recentes:", err);
        setError("Não foi possível carregar os filmes.");

      } finally {
        setLoading(false);
      }
    };

    fetchRecentes();
  }, []);

  return (
    <div className="app">
      <Header />
      <Hero />

      {/* Listagem dos gêneros */}
      <Genres />

      {/* Carrossel de filmes recentes */}
      {loading && (
        <p className="home-loading">
          Carregando filmes...
        </p>
      )}

      {error && (
        <p className="home-error">
          {error}
        </p>
      )}

      {!loading && !error && filmesRecentes.length > 0 && (
        <MoviesCarousel 
          title="Filmes Cadastrados Recentemente"
          movies={filmesRecentes}
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;
