import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

/* Seção principal de destaque da Home */
function Hero() {
  return (
    <section className="hero">

      {/* Camadas de fundo (degradê + grid) */}
      <div className="hero-background"></div>
      <div className="hero-grid"></div>

      {/* Conteúdo central da hero section */}
      <div className="hero-content">
        <h1 className="hero-title">DESCUBRA E GERENCIE</h1>
        <h2 className="hero-subtitle">SUA COLEÇÃO DE FILMES</h2>

        <div className="hero-buttons">
          <Link to="/listarfilmes">
            <button className="btnss btnn-primary">
              <Play />
              Ver Filmes
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
