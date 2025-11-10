import React, { useState, useMemo, useEffect } from "react";
// ⭐ 1. Importar 'useSearchParams' e 'useLocation'
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FilterBar from "../../components/FilterBar/FilterBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MoviesCarousel from "../../components/MoviesCarousel/MoviesCarousel";

import "./ListarFilmes.css";

import { getFilmes, getGeneros, getAnos, getFilmesDestaque, getFilmesPorGenero } from "../../services/api";

function ListarFilmes() {
  const location = useLocation();
  // ⭐ 2. 'searchParams' (lê a URL), 'setSearchParams' (escreve na URL)
  const [searchParams, setSearchParams] = useSearchParams();

  // ⭐ 3. Lemos os filtros DIRETAMENTE da URL
  const searchTerm = searchParams.get('busca') || '';
  const genre = searchParams.get('genero') || '';
  const year = searchParams.get('ano') || '';

  // Verifica se a página deve abrir o menu de filtro
  const shouldOpenFilter = location.state?.openFilter || false;
  const [isFilterOpen, setIsFilterOpen] = useState(shouldOpenFilter);

  // ⭐ 4. REMOVEMOS o 'useState' para 'filters'. A URL é o estado.
  
  // (Estados para carrosséis, filtros e UI permanecem)
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingCarousels, setLoadingCarousels] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ 5. 'isFiltering' agora lê direto dos parâmetros da URL
  const isFiltering = useMemo(() => {
    return Boolean(searchTerm || genre || year);
  }, [searchTerm, genre, year]); // Depende dos valores da URL

  // (useEffect de loadFiltersData permanece o mesmo)
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const generosRes = await getGeneros();
        setAllGenres(generosRes.data.map(g => g.genero));
      } catch (err) {
        console.error("Erro ao carregar filtros", err);
        setError("Não foi possível carregar os filtros.");
      }
    };
    loadFiltersData();
  }, []);

  // (useEffect de loadCarousels permanece o mesmo)
  useEffect(() => {
    if (!isFiltering) {
      // ... (lógica para carregar carrosséis)
      const loadCarousels = async () => {
        setLoadingCarousels(true);
        setError(null);
        try {
          const [destaqueRes, generosRes] = await Promise.all([ getFilmesDestaque(), getGeneros() ]);
          setFilmesRecentes(destaqueRes.data);
          const generos = generosRes.data;
          const promises = generos.map(g => getFilmesPorGenero(g.genero));
          const results = await Promise.all(promises);
          const formattedData = generos.map((genre, index) => ({
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
  }, [isFiltering]);

  // ⭐ 6. 'useEffect[loadFilteredMovies]' agora depende da URL (searchParams)
  useEffect(() => {
    if (isFiltering) {
      const loadFilteredMovies = async () => {
        setLoadingGrid(true);
        setError(null);
        try {
          // Passa os valores da URL para a API
          const response = await getFilmes({
            busca: searchTerm,
            genero: genre,
            ano: year,
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
    // A dependência agora é 'searchParams' (que inclui searchTerm, genre, year)
    // e 'isFiltering'
  }, [isFiltering, searchParams]); 

  // ⭐ 7. REMOVEMOS o useEffect que sincronizava 'filters' com a URL.
  // Agora o FilterBar vai atualizar a URL diretamente.
  
  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams()); // Limpa todos os parâmetros da URL
  };
  
  const renderContent = () => {
    // (Lógica de renderContent permanece a mesma)
    if (error) return <div className="no-results-container"><p>{error}</p></div>;
    if (isFiltering) {
      if (loadingGrid) return <div className="no-results-container"><p>Buscando...</p></div>;
      return <MovieGrid movies={filteredMovies} />;
    }
    if (loadingCarousels) return <div className="no-results-container"><p>Carregando filmes...</p></div>;
    return (
      <>
        <MoviesCarousel title="Filmes Cadastrados Recentemente" movies={filmesRecentes} />
        {carouselData.map(data => (
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
      <Header 
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)} 
        isFilterActive={isFilterOpen} 
      />
      
      {isFilterOpen && (
        <FilterBar
          // ⭐ 8. Passa os valores da URL e a função 'setSearchParams'
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          genres={allGenres}
          handleClearFilters={handleClearFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
      
      {renderContent()}
      
      <Footer />
    </>
  );
}

export default ListarFilmes;