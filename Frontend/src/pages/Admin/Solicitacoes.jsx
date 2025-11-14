import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MoviesCarousel from '../../components/MoviesCarousel/MoviesCarousel';

import { getSolicitacoesCadastro, getSolicitacoesEdicao } from '../../services/api';

import '../../pages/ListarFilmes/ListarFilmes.css';
import '../../components/Genres/Genres.css';

import { LayoutList } from 'lucide-react';

function Solicitacoes() {
  /* Listas de solicitações */
  const [solicitacoesCadastro, setSolicitacoesCadastro] = useState([]);
  const [solicitacoesEdicao, setSolicitacoesEdicao] = useState([]);

  /* Estado de feedback */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Busca inicial das solicitações */
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      setLoading(true);
      setError(null);

      try {
        const [resCadastro, resEdicao] = await Promise.all([
          getSolicitacoesCadastro(),
          getSolicitacoesEdicao()
        ]);

        setSolicitacoesCadastro(resCadastro.data);
        setSolicitacoesEdicao(resEdicao.data);

      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
        setError("Não foi possível carregar as solicitações.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  /* Loading */
  if (loading) {
    return (
      <>
        <Header />
        <div className="no-results-container">
          <p>Carregando solicitações...</p>
        </div>
        <Footer />
      </>
    );
  }

  /* Erro */
  if (error) {
    return (
      <>
        <Header />
        <div className="no-results-container">
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  /* Conteúdo principal */
  return (
    <>
      <Header />

      <div className="featured-section">

        {/* Solicitações de Cadastro */}
        <h2 className="genres-title">
          <LayoutList />
          Solicitação de Cadastro
        </h2>

        {solicitacoesCadastro.length > 0 ? (
          <MoviesCarousel title="" movies={solicitacoesCadastro} />
        ) : (
          <p style={{ color: '#9ca3af', paddingLeft: '1rem' }}>
            Nenhuma solicitação de cadastro pendente.
          </p>
        )}

        {/* Solicitações de Edição */}
        <h2 className="genres-title" style={{ marginTop: '3rem' }}>
          <LayoutList />
          Solicitação de Edição
        </h2>

        {solicitacoesEdicao.length > 0 ? (
          <MoviesCarousel title="" movies={solicitacoesEdicao} />
        ) : (
          <p style={{ color: '#9ca3af', paddingLeft: '1rem' }}>
            Nenhuma solicitação de edição pendente.
          </p>
        )}

      </div>

      <Footer />
    </>
  );
}

export default Solicitacoes;
