import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Genres from '../../components/Genres/Genres';
import FeaturedMovies from '../../components/FeaturedMovies/FeaturedMovies'
import Footer from '../../components/Footer/Footer';
import '../../App.css';

function Home() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Genres />

      <FeaturedMovies />
      <Footer />
    </div>
  );
}

export default Home;
