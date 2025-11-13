import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MoviesCarousel from '../../components/MoviesCarousel/MoviesCarousel';

/*
  Importamos as novas funções da API que criámos
*/
import { getSolicitacoesCadastro, getSolicitacoesEdicao } from '../../services/api';

/*
  Reutilizamos CSS de outras páginas para o layout
*/
import '../../pages/ListarFilmes/ListarFilmes.css'; // Para a formatação de "Carregando..."
import '../../components/Genres/Genres.css'; // Para o estilo do título da seção
import { LayoutList } from 'lucide-react'; // Ícone para o título


function Solicitacoes() {
  const [solicitacoesCadastro, setSolicitacoesCadastro] = useState([]);
  const [solicitacoesEdicao, setSolicitacoesEdicao] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
    Busca as duas listas de solicitações (cadastro e edição)
  */
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      setLoading(true);
      setError(null);
      try {
        /*
          Executa as duas chamadas à API em paralelo
        */
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
  }, []); // Roda apenas uma vez

  /*
    Renderização de Feedback (Loading/Error)
  */
  if (loading) {
    return (
      <>
        <Header />
        <div className="no-results-container"><p>Carregando solicitações...</p></div>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="no-results-container"><p>{error}</p></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/*
        Container principal da página de solicitações.
        Reutilizamos o CSS do MoviesCarousel (.featured-section) para o padding.
      */}
      <div className="featured-section">

        {/* Carrossel de Solicitação de Cadastro */}
        <h2 className="genres-title">
          <LayoutList />
          Solicitação de Cadastro
        </h2>
        {solicitacoesCadastro.length > 0 ? (
          <MoviesCarousel 
            title="" /* O título já está acima, não precisamos de outro */
            movies={solicitacoesCadastro} 
          />
        ) : (
          <p style={{color: '#9ca3af', paddingLeft: '1rem'}}>Nenhuma solicitação de cadastro pendente.</p>
        )}

        {/* Carrossel de Solicitação de Edição */}
        <h2 className="genres-title" style={{marginTop: '3rem'}}>
          <LayoutList />
          Solicitação de Edição
        </h2>
        {solicitacoesEdicao.length > 0 ? (
           <MoviesCarousel 
            title="" 
            movies={solicitacoesEdicao} 
          />
        ) : (
          <p style={{color: '#9ca3af', paddingLeft: '1rem'}}>Nenhuma solicitação de edição pendente.</p>
        )}

      </div>
      
      <Footer />
    </>
  );
}

export default Solicitacoes;