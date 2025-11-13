import React, { useState, useMemo, useEffect, useCallback } from "react";
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

  /*
    MUDANÇA AQUI:
    'isFiltering' (que mostra a grelha) só é ativado pela
    BUSCA (searchTerm) ou pelo ANO. O Género foi removido.
  */
  const isFiltering = useMemo(() => {
    return Boolean(searchTerm || year);
  }, [searchTerm, year]); 

  /*
    useEffect: Carregar Dados dos Filtros (Géneros)
    (Permanece o mesmo)
  */
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const generosRes = await getGeneros();
        setAllGenres(generosRes.data.map(g => g.genero));
      } catch (err) {
        console.error("Erro ao carregar filtros", err);
      }
    };
    loadFiltersData();
  }, []);

  /*
    useEffect: Carregar Carrosséis
    (Permanece o mesmo)
  */
  useEffect(() => {
    if (!isFiltering) {
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

  /*
    useEffect: Carregar Filmes Filtrados (Grelha)
    (Permanece o mesmo)
  */
  useEffect(() => {
    if (isFiltering) {
      const loadFilteredMovies = async () => {
        setLoadingGrid(true);
        setError(null);
        try {
          const response = await getFilmes({
            busca: searchTerm,
            genero: genre, // Ainda enviamos o género, caso o utilizador filtre por Ano E Género
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

  /*
    MUDANÇA AQUI: NOVO useEffect para o Scroll (Link Âncora)
    Este 'useEffect' assiste à URL. Se apenas o 'genre' for definido,
    ele rola a página até ao carrossel correto.
  */
  useEffect(() => {
    // Só executa o scroll se 'genre' for o *único* filtro ativo
    if (genre && !searchTerm && !year) {
      
      // Converte "Aventura" para "genre-anchor-aventura"
      const anchorId = `genre-anchor-${genre.toLowerCase().replace(/ /g, '-')}`;
      const element = document.getElementById(anchorId);
      
      if (element) {
        // Rola suavemente até ao carrossel
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        /*
          IMPORTANTE: Limpa o 'genero' da URL após o scroll.
          Isto permite que o utilizador clique noutro género (ou no mesmo)
          e o filtro funcione novamente.
        */
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('genre');
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [genre, searchTerm, year, searchParams, setSearchParams]);

  /*
    useCallback: Funções estabilizadas
    (Permanece o mesmo)
  */
  const handleClearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams()); 
  }, [setSearchParams]); 
  
  const handleFilterToggle = useCallback((state) => {
    setIsFilterOpen(prev => (state !== undefined ? state : !prev));
  }, []); 
  

  /*
    Função: renderContent
    MUDANÇA: Adicionamos 'id's aos wrappers dos carrosséis
  */
  const renderContent = () => {
    if (error) return <div className="no-results-container"><p>{error}</p></div>;
    
    // 1. Se 'isFiltering' for true (Busca ou Ano), mostra a grelha
    if (isFiltering) {
      if (loadingGrid) return <div className="no-results-container"><p>Buscando...</p></div>;
      return <MovieGrid movies={filteredMovies} />;
    }

    // 2. Se não, mostra os carrosséis (com os 'id's para o scroll)
    if (loadingCarousels) return <div className="no-results-container"><p>Carregando filmes...</p></div>;
    
    return (
      <>
        {/* Adiciona um wrapper com ID para o carrossel de Recentes */}
        <div id="genre-anchor-filmes-cadastrados-recentemente" style={{ paddingTop: '1rem' }}>
          <MoviesCarousel title="Filmes Cadastrados Recentemente" movies={filmesRecentes} />
        </div>
        
        {/* Adiciona wrappers com IDs dinâmicos para os carrosséis de género */}
        {carouselData.map(data => {
          // Cria um ID (ex: "Filmes de Aventura" -> "genre-anchor-aventura")
          const genreName = data.title.replace('Filmes de ', '');
          const anchorId = `genre-anchor-${genreName.toLowerCase().replace(/ /g, '-')}`;
          
          return (
            data.movies.length > 0 && (
              <div id={anchorId} key={data.title} style={{ paddingTop: '1rem' }}>
                <MoviesCarousel 
                  title={data.title} 
                  movies={data.movies} 
                />
              </div>
            )
          )
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
          handleClearFilters: handleClearFilters,
          onClose: () => setIsFilterOpen(false)
        }}
      />
      
      {renderContent()}
      
      <Footer />
    </>
  );
}

export default ListarFilmes;