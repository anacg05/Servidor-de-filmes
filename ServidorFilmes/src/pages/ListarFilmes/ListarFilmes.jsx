import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FilterBar from "../../components/FilterBar/FilterBar";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import MoviesCarousel from "../../components/MoviesCarousel/MoviesCarousel"; // 1. Importar o Carrossel de volta

// --- BASE DE DADOS CENTRALIZADA ---
// Nossa fonte de dados única para filtros e carrosséis
const allMovies = [
  { id: 1, title: "Oppenheimer", year: 2023, rating: 8.5, genre: "Drama", director: "Christopher Nolan", actors: ["Cillian Murphy"], synopsis: "A história do físico J. Robert Oppenheimer...", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQORAieVd3WE0zCe2brYIu0IP_eAbq_cksyJQ&s" },
  { id: 2, title: "Barbie", year: 2023, rating: 7.8, genre: "Comédia", director: "Greta Gerwig", actors: ["Margot Robbie", "Ryan Gosling"], synopsis: "Barbie sai da Barbieland...", poster: "https://www.europanet.com.br/upload/id_produto/107___/107344g.jpg" },
  { id: 3, title: "John Wick 4: Baba Yaga", year: 2023, rating: 7.2, genre: "Ação", director: "Chad Stahelski", actors: ["Keanu Reeves"], synopsis: "John Wick descobre um caminho...", poster: "https://m.media-amazon.com/images/M/MV5BMGUyMGNlM2EtODY5Yy00ZjQ2LTkyY2ItZDI3YjdjYWM2MzNhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { id: 4, title: "Duna: Parte 2", year: 2024, rating: 9.0, genre: "Ficção Científica", director: "Denis Villeneuve", actors: ["Timothée Chalamet", "Zendaya"], synopsis: "Paul Atreides se une a Chani...", poster: "https://m.media-amazon.com/images/M/MV5BNzk5MTE4YTUtNGU2My00MTYxLWE5NGItODk4YWFkOWYyMjA5XkEyXkFqcGc@._V1_.jpg" },
  { id: 5, title: "Velozes e Furiosos 10", year: 2023, rating: 5.9, genre: "Ação", director: "Louis Leterrier", actors: ["Vin Diesel", "Jason Momoa"], synopsis: "Dom Toretto e sua família...", poster: "https://m.media-amazon.com/images/S/pv-target-images/848a155842f8331062bd190b1584e3b152af0271468312ce6b0def838721592b.jpg" },
  { id: 6, title: "Missão: Impossível – Acerto de Contas Parte Um", year: 2023, rating: 7.8, genre: "Ação", director: "Christopher McQuarrie", actors: ["Tom Cruise"], synopsis: "Ethan Hunt e sua equipe...", poster: "https://www.papodecinema.com.br/wp-content/uploads/2022/12/20230705-missao-impossivel-contas-papo-de-cinema-cartaz.webp" },
  { id: 7, title: "Top Gun: Maverick", year: 2022, rating: 8.4, genre: "Ação", director: "Joseph Kosinski", actors: ["Tom Cruise", "Miles Teller"], synopsis: "Pete 'Maverick' Mitchell treina...", poster: "https://upload.wikimedia.org/wikipedia/pt/d/d2/Top_Gun_Maverick.jpg" },
  { id: 8, title: "Resgate 2", year: 2023, rating: 7.0, genre: "Ação", director: "Sam Hargrave", actors: ["Chris Hemsworth"], synopsis: "Tyler Rake, resgatado da morte...", poster: "https://br.web.img2.acsta.net/pictures/23/05/29/15/29/0726500.jpg" },
  { id: 9, title: "The Batman", year: 2022, rating: 8.2, genre: "Ação", director: "Matt Reeves", actors: ["Robert Pattinson", "Zoë Kravitz"], synopsis: "Batman investiga a corrupção...", poster: "httpsA://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIyNi00NGVlLWIzMDYtZTkwMTM0RjljYWYwXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" },
  { id: 10, title: "Mad Max: Estrada da Fúria", year: 2015, rating: 8.1, genre: "Ação", director: "George Miller", actors: ["Tom Hardy", "Charlize Theron"], synopsis: "Em um mundo pós-apocalíptico...", poster: "https://play-lh.googleusercontent.com/NZVX-GzNvaGUocLGSQNUtDB-H084hgOQpRIYmg_sTEYV2BQzgH0Iqm9jCJe47u3nSqA" },
  { id: 11, title: "Homem-Aranha: Sem Volta Para Casa", year: 2021, rating: 8.3, genre: "Ação", director: "Jon Watts", actors: ["Tom Holland", "Zendaya"], synopsis: "Peter Parker pede ajuda...", poster: "https://play-lh.googleusercontent.com/15YQW9xn9s-uqz-VNNHmXAwZGtFX-Cx8_TfvtZyGWewyzecOzLrZOpRRNuIw6Of33FCnx0BPqfHei6vrYsk=w240-h480-rw" },
  { id: 12, title: "Interestelar", year: 2014, rating: 8.6, genre: "Ficção Científica", director: "Christopher Nolan", actors: ["Matthew McConaughey", "Anne Hathaway"], synopsis: "A humanidade está morrendo...", poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { id: 13, title: "Invocação do Mal", year: 2013, rating: 7.5, genre: "Terror", director: "James Wan", actors: ["Vera Farmiga", "Patrick Wilson"], synopsis: "Os investigadores paranormais...", poster: "https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDYyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg" },
  { id: 14, title: "Rio", year: 2011, rating: 6.9, genre: "Animação", director: "Carlos Saldanha", actors: ["Jesse Eisenberg", "Anne Hathaway"], synopsis: "Blu, uma arara azul...", poster: "https://m.media-amazon.com/images/M/MV5BMTU2MDY3MzAzMl5BMl5BanBnXkFtZTcwMzg2MzYxNA@@._V1_FMjpg_UX1000_.jpg" },
];

// --- LÓGICA PARA POPULAR OS FILTROS ---
const allGenres = [...new Set(allMovies.map(m => m.genre).filter(Boolean))].sort();
const allYears = [...new Set(allMovies.map(m => m.year))]
  .sort((a, b) => b - a);

// --- ESTADO INICIAL VAZIO ---
const emptyFilters = {
  searchTerm: '',
  genre: '',
  year: '',
};

function ListarFilmes() {
  const location = useLocation();
  // Pega o gênero da Home, se houver, para ativar o filtro
  const genreFromHome = location.state?.genre || '';

  const [filters, setFilters] = useState({
    ...emptyFilters,
    genre: genreFromHome, // 2. Filtro de gênero é ativado se veio da Home
  });

  // 3. Função para limpar filtros e voltar aos carrosséis
  const handleClearFilters = () => {
    setFilters(emptyFilters);
  };

  // 4. Lógica de filtragem (para o MovieGrid)
  const filteredMovies = useMemo(() => {
    let movies = [...allMovies];
    const term = filters.searchTerm.toLowerCase();
    
    if (filters.genre) {
      movies = movies.filter(m => m.genre === filters.genre);
    }
    if (filters.year) {
      movies = movies.filter(m => m.year === parseInt(filters.year));
    }
    if (term) {
      movies = movies.filter(m =>
        m.title.toLowerCase().includes(term) ||
        (m.director && m.director.toLowerCase().includes(term)) ||
        (m.actors && m.actors.some(actor => actor.toLowerCase().includes(term)))
      );
    }
    return movies;
  }, [filters]);

  // 5. Listas para os Carrosséis (só aparecem se não estiver filtrando)
  const filmesDestaque = useMemo(() => 
    allMovies.filter(m => m.rating >= 8.2).sort((a, b) => b.rating - a.rating), 
  []);
  const filmesAcao = useMemo(() => 
    allMovies.filter(m => m.genre === 'Ação'), 
  []);
  const filmesComedia = useMemo(() => 
    allMovies.filter(m => m.genre === 'Comédia'), 
  []);
  const filmesFiccao = useMemo(() => 
    allMovies.filter(m => m.genre === 'Ficção Científica'), 
  []);

  // 6. A LÓGICA PRINCIPAL:
  //    Verifica se qualquer filtro está ativo para decidir o que mostrar
  const isFiltering = Boolean(filters.searchTerm || filters.genre || filters.year);

  return (
    <>
      <Header />
      
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        genres={allGenres}
        years={allYears}
        handleClearFilters={handleClearFilters}
      />
      
      {/* 7. RENDERIZAÇÃO CONDICIONAL */}
      {isFiltering ? (
        // Se estiver filtrando, mostra a grade de resultados
        <MovieGrid movies={filteredMovies} />
      ) : (
        // Se não, mostra os carrosséis
        <>
          <MoviesCarousel title="Filmes em Destaque" movies={filmesDestaque} seeAllLink="#" />
          <MoviesCarousel title="Filmes de Ação" movies={filmesAcao} seeAllLink="#" />
          <MoviesCarousel title="Filmes de Comédia" movies={filmesComedia} seeAllLink="#" />
          <MoviesCarousel title="Ficção Científica" movies={filmesFiccao} seeAllLink="#" />
        </>
      )}
      
      <Footer />
    </>
  );
}

export default ListarFilmes;