import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function AdminDashboard() {
  return (
    <>
      <Header />
      <div style={{ padding: '50px', color: 'white', minHeight: 'calc(100vh - 200px)' }}>
        <h1>Admin Dashboard</h1>
        <p>Bem-vindo, Administrador.</p>
        <p>
          Use a navegação acima para ver as solicitações de novos filmes 
          ou para gerir todos os filmes existentes.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;