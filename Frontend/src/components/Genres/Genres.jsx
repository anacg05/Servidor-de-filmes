import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link
import './Genres.css';

function Genres() {
  const genres = [
    'Ação',
    'Drama',
    'Comédia',
    'Terror',
    'Ficção Científica',
    'Romance',
    'Aventura',
    'Suspense',
    'Animação' // Removi Documentário para bater com a lista
  ];

  return (
    <section className="genres-section">
      <h2 className="genres-title">Explorar por Gênero</h2>
      <div className="genres-container">
        {genres.map((genre, index) => (
          // 2. Transforma o botão em um Link
          <Link
            key={index}
            to="/listarfilmes"
            state={{ genre: genre }} // 3. Passa o gênero no 'state'
            className="genre-button"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Genres;