import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FilterBar from "../../components/FilterBar/FilterBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MoviesCarousel from "../../components/MoviesCarousel/MoviesCarousel";

import "./ListarFilmes.css";

// Importando funções da API
import { getFilmes, getGeneros, getAnos, getFilmesDestaque, getFilmesPorGenero } from "../../services/api";

// --- ESTADO INICIAL VAZIO ---
const emptyFilters = {
  searchTerm: '',
  genre: '',
  year: '',
};

function ListarFilmes() {
  const location = useLocation();
  const genreFromHome = location.state?.genre || '';

  // --- ESTADOS ---
  const [filters, setFilters] = useState({
    ...emptyFilters,
    genre: genreFromHome,
  });

  // Estado para os resultados da filtragem (MovieGrid)
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  // Estados para os filtros
  const [allGenres, setAllGenres] = useState([]);
  const [allYears, setAllYears] = useState([]);

  // --- ESTADOS DOS CARROSSÉIS ---
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  
  // ⭐ MUDANÇA AQUI: Um único estado para todos os carrosséis de gênero
  const [carouselData, setCarouselData] = useState([]);

  // Estados de Carregamento e Erro
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingCarousels, setLoadingCarousels] = useState(false);
  const [error, setError] = useState(null);

  // Verifica se qualquer filtro está ativo
  const isFiltering = useMemo(() => {
    return Boolean(filters.searchTerm || filters.genre || filters.year);
  }, [filters]);

  // Buscar dados para os filtros (Gêneros e Anos)
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const [generosRes, anosRes] = await Promise.all([getGeneros(), getAnos()]);
        // Guardamos os nomes dos gêneros para o dropdown do filtro
        setAllGenres(generosRes.data.map(g => g.genero));
        setAllYears(anosRes.data);
      } catch (err) {
        console.error("Erro ao carregar filtros", err);
        setError("Não foi possível carregar os filtros.");
      }
    };
    loadFiltersData();
  }, []); // Roda apenas uma vez

  // ⭐ MUDANÇA AQUI: Lógica para carregar TODOS os carrosséis dinamicamente
  useEffect(() => {
    if (!isFiltering) {
      const loadCarousels = async () => {
        setLoadingCarousels(true);
        setError(null);
        try {
          // 1. Busca os filmes recentes e a lista completa de gêneros
          const [destaqueRes, generosRes] = await Promise.all([
            getFilmesDestaque(),
            getGeneros() // Busca os 20 gêneros
          ]);

          setFilmesRecentes(destaqueRes.data);
          const generos = generosRes.data; // [{id_genero: 1, genero: 'Ação'}, ...]

          // 2. Cria um array de "promessas" (uma para cada gênero)
          const promises = generos.map(g => getFilmesPorGenero(g.genero));
          
          // 3. Executa todas as buscas por gênero em paralelo
          const results = await Promise.all(promises);

          // 4. Formata os dados para o estado
          const formattedData = generos.map((genre, index) => ({
            // Adiciona "Filmes de" ao nome do gênero para o título
            title: `Filmes de ${genre.genero}`, 
            movies: results[index].data
          }));

          setCarouselData(formattedData);

        } catch (err) {
          console.error("Erro ao carregar carrosséis", err);
          setError("Não foi possível carregar os filmes.");
        } finally {
          setLoadingCarousels(false);
        }
      };
      loadCarousels();
    }
  }, [isFiltering]); // Roda quando 'isFiltering' muda

  // Buscar filmes filtrados (para o MovieGrid)
  useEffect(() => {
    if (isFiltering) {
      const loadFilteredMovies = async () => {
        setLoadingGrid(true);
        setError(null);
        try {
          const response = await getFilmes({
            busca: filters.searchTerm,
            genero: filters.genre,
            ano: filters.year,
          });
          setFilteredMovies(response.data);
        } catch (err) {
          console.error("Erro ao buscar filmes filtrados", err);
          setError("Nenhum filme encontrado ou erro na busca.");
          setFilteredMovies([]);
        } finally {
          setLoadingGrid(false);
        }
      };
      loadFilteredMovies();
    } else {
      setFilteredMovies([]); 
    }
  }, [filters, isFiltering]); 

  const handleClearFilters = () => {
    setFilters(emptyFilters);
  };
  
  // Helper para renderizar conteúdo
  const renderContent = () => {
    if (error) {
      return <div className="no-results-container"><p>{error}</p></div>;
    }

    if (isFiltering) {
      if (loadingGrid) return <div className="no-results-container"><p>Buscando...</p></div>;
      return <MovieGrid movies={filteredMovies} />;
    }

    if (loadingCarousels) {
      return <div className="no-results-container"><p>Carregando filmes...</p></div>;
    }
    
    // ⭐ MUDANÇA AQUI: Renderização dinâmica
    return (
      <>
        {/* 1. Carrossel de Filmes Recentes (sempre primeiro) */}
        <MoviesCarousel title="Filmes Cadastrados Recentemente" movies={filmesRecentes} />
        
        {/* 2. Mapeia o 'carouselData' para criar os outros carrosséis */}
        {carouselData.map(data => (
          // Só renderiza o carrossel se ele tiver pelo menos um filme
          data.movies.length > 0 && (
            <MoviesCarousel 
              key={data.title} 
              title={data.title} 
              movies={data.movies} 
            />
          )
        ))}
      </>
    );
  };

  return (
    <>
      <Header />
      
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        genres={allGenres} // Passa os nomes dos gêneros para o filtro
        years={allYears}
        handleClearFilters={handleClearFilters}
      />
      
      {renderContent()}
      
      <Footer />
    </>
  );
}

export default ListarFilmes;