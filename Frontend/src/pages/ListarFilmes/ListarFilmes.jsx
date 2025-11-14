import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MoviesCarousel from "../../components/MoviesCarousel/MoviesCarousel";

import "./ListarFilmes.css";

import {
  getFilmes,
  getGeneros,
  getAnos,
  getFilmesDestaque,
  getFilmesPorGenero,
} from "../../services/api";

function ListarFilmes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  /* Filtros da URL */
  const searchTerm = searchParams.get("busca") || "";
  const genre = searchParams.get("genero") || "";
  const year = searchParams.get("ano") || "";

  /* Controle de dropdown de filtro */
  const shouldOpenFilter = location.state?.openFilter || false;
  const [isFilterOpen, setIsFilterOpen] = useState(shouldOpenFilter);

  /* Dados principais */
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [filmesRecentes, setFilmesRecentes] = useState([]);
  const [carouselData, setCarouselData] = useState([]);

  /* Estados de carregamento */
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingCarousels, setLoadingCarousels] = useState(false);

  const [error, setError] = useState(null);

  
  const isFiltering = useMemo(() => {
    return Boolean(searchTerm || year || genre);
  }, [searchTerm, year, genre]);

  /* Carrega lista de gêneros (usada no filtro e nos carrosséis) */
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const generosRes = await getGeneros();
        setAllGenres(generosRes.data.map((g) => g.genero));
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };
    loadFiltersData();
  }, []);

  /* Carregamento dos carrosséis quando não há filtros */
  useEffect(() => {
    if (!isFiltering) {
      const loadCarousels = async () => {
        setLoadingCarousels(true);
        setError(null);

        try {
          const [destaqueRes, generosRes] = await Promise.all([
            getFilmesDestaque(),
            getGeneros(),
          ]);

          setFilmesRecentes(destaqueRes.data);

          const generos = generosRes.data;
          const promises = generos.map((g) => getFilmesPorGenero(g.genero));
          const results = await Promise.all(promises);

          const formattedData = generos.map((genre, index) => ({
            title: `Filmes de ${genre.genero}`,
            movies: results[index].data,
          }));

          setCarouselData(formattedData);
        } catch (err) {
          console.error("Erro ao carregar carrosséis:", err);
          setError("Não foi possível carregar os filmes.");
        } finally {
          setLoadingCarousels(false);
        }
      };

      loadCarousels();
    }
  }, [isFiltering]);

  /* Carregamento dos filmes filtrados (grid) */
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
          console.error("Erro ao buscar filmes filtrados:", err);
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

  

  /* Funções utilitárias estáveis */
  const handleClearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const handleFilterToggle = useCallback((state) => {
    setIsFilterOpen((prev) => (state !== undefined ? state : !prev));
  }, []);

  /* Renderização principal */
  const renderContent = () => {
    if (error) {
      return (
        <div className="no-results-container">
          <p>{error}</p>
        </div>
      );
    }

    if (isFiltering) {
      if (loadingGrid) {
        return (
          <div className="no-results-container">
            <p>Buscando...</p>
          </div>
        );
      }

      return <MovieGrid movies={filteredMovies} />;
    }

    if (loadingCarousels) {
      return (
        <div className="no-results-container">
          <p>Carregando filmes...</p>
        </div>
      );
    }

    return (
      <>
        {/* Carrossel Principal */}
        <div
          id="genre-anchor-filmes-cadastrados-recentemente"
          style={{ paddingTop: "1rem" }}
        >
          <MoviesCarousel
            title="Filmes Cadastrados Recentemente"
            movies={filmesRecentes}
          />
        </div>

        {/* Carrosséis por gênero */}
        {carouselData.map((data) => {
          const genreName = data.title.replace("Filmes de ", "");
          const anchorId = `genre-anchor-${genreName
            .toLowerCase()
            .replace(/ /g, "-")}`;

          return (
            data.movies.length > 0 && (
              <div id={anchorId} key={data.title} style={{ paddingTop: "1rem" }}>
                <MoviesCarousel title={data.title} movies={data.movies} />
              </div>
            )
          );
        })}
      </>
    );
  };

  return (
    <>
      <Header
        onFilterToggle={handleFilterToggle}
        isFilterActive={isFilterOpen}
        isFilterPage={true}
        filterProps={{
          searchParams,
          setSearchParams,
          genres: allGenres,
          handleClearFilters,
          onClose: () => setIsFilterOpen(false),
        }}
      />

      {renderContent()}

      <Footer />
    </>
  );
}

export default ListarFilmes;
