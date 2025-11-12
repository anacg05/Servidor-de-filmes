import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MoviesCarousel from "../../components/MoviesCarousel/MoviesCarousel";

import "./ListarFilmes.css";

import { getFilmes, getGeneros, getAnos, getFilmesDestaque, getFilmesPorGenero } from "../../services/api";

function ListarFilmes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const searchTerm = searchParams.get('busca') || '';
  const genre = searchParams.get('genero') || '';
  const year = searchParams.get('ano') || '';

  const shouldOpenFilter = location.state?.openFilter || false;
  const [isFilterOpen, setIsFilterOpen] = useState(shouldOpenFilter);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingCarousels, setLoadingCarousels] = useState(false);
  const [error, setError] = useState(null);

  const isFiltering = useMemo(() => {
    return Boolean(searchTerm || genre || year);
  }, [searchTerm, genre, year]);

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

  useEffect(() => {
    if (!isFiltering) {
      const loadCarousels = async () => {
        setLoadingCarousels(true);
        setError(null);
        try {
          const [destaqueRes, generosRes] = await Promise.all([
            getFilmesDestaque(),
            getGeneros()
          ]);

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

  useEffect(() => {
    if (isFiltering) {
      const loadFilteredMovies = async () => {
        setLoadingGrid(true);
        setError(null);
        try {
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
  }, [isFiltering, searchParams]);

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams()); 
  };
  
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
        /* MUDANÇA AQUI: onFilterToggle agora aceita um argumento (true/false) ou alterna */
        onFilterToggle={(state) => setIsFilterOpen(state !== undefined ? state : !isFilterOpen)} 
        isFilterActive={isFilterOpen}
        isFilterPage={true} 
        filterProps={{
          searchParams,
          setSearchParams,
          genres: allGenres,
          handleClearFilters,
          onClose: () => setIsFilterOpen(false)
        }}
      />
      
      {renderContent()}
      
      <Footer />
    </>
  );
}

export default ListarFilmes;