import React, { useState, useEffect } from 'react'; 
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import MoviesCarousel from '../../components/MoviesCarousel/MoviesCarousel'; 
// ⭐ 1. Importar o 'Genres' de volta
import Genres from '../../components/Genres/Genres'; 
import Footer from '../../components/Footer/Footer';
import './Home.css';

// Importar a função da API
import { getFilmesDestaque } from '../../services/api'; 

function Home() {
  
  // Estados para carregar os filmes do carrossel
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os filmes recentes
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
  }, []); // Roda apenas uma vez na montagem

  return (
    <div className="app">
      <Header />
      <Hero />

      {/* ⭐ 2. Componente 'Genres' de volta ao lugar */}
      <Genres />

      {/* 3. Renderização do carrossel (agora abaixo do Genres) */}
      
      {loading && (
        <p style={{textAlign: 'center', padding: '3rem 1.5rem'}}>
          Carregando filmes...
        </p>
      )}

      {error && (
        <p style={{textAlign: 'center', padding: '3rem 1.5rem', color: '#ef4444'}}>
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