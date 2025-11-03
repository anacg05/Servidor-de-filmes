import React from 'react';
import './Footer.css';
import Icon from '../../assets/icon2.png'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={Icon} alt='Icone caclete'/>
          <span className="footer-logo-text">GrizFlix</span>
        </div>
        <p className="footer-description">Gerenciador de filmes - Criado por Ana Clara Grizotto</p>

        <div className="footer-links">
          <a href="#" className="footer-link">Sobre</a>
          <a href="#" className="footer-link">Contato</a>
          <a href="#" className="footer-link">Termos de Uso</a>
          <a href="#" className="footer-link">Privacidade</a>
        </div>

        <p className="footer-copyright">© 2025 GrizFlix. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
